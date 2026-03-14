'use server'

/**
 * Tag Server Actions
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Server Actions for tag management:
 * - createTag: Admin creates new classification tag
 * - deleteTag: Admin deletes tag (cascade to users)
 * - assignTagsToUser: Admin assigns tags to user
 * - getTags: Get all tags for UI
 * - getUserTags: Get tags for a specific user
 *
 * CRITICAL: Tags are VISUAL ONLY - they do NOT grant capabilities
 *
 * All actions use:
 * - Error handling with custom error classes
 * - Structured logging with correlation IDs
 * - Performance tracking for slow operations
 * - PBAC capability checks (can_manage_users)
 * - Audit logging for admin actions
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/observability/logger'
import { trackPerformance } from '@/lib/observability/performance'
import {
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  InternalError,
} from '@/lib/utils/errors'
import { headers } from 'next/headers'
import {
  createTagSchema,
  assignTagsSchema,
} from '@/lib/schemas'
import { ZodError } from 'zod'

/**
 * Create Tag Server Action
 * Story 1.3: Crear hasta 20 etiquetas personalizadas
 *
 * Admin creates new classification tag:
 * - NFR-S59: Maximum 20 tags per system
 * - WCAG AA compliant colors
 * - Audit log created
 *
 * @param data - Tag data (name, color, description)
 * @returns Created tag
 */
export async function createTag(data: {
  name: string
  color: string
  description?: string
}) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('create_tag', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'create_tag_unauthorized', correlationId)
      throw new AuthenticationError(
        'Debes iniciar sesión para crear etiquetas'
      )
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'create_tag_forbidden', correlationId)
      throw new AuthorizationError(
        'No tienes permiso para crear etiquetas'
      )
    }

    // 3. Validate data with Zod
    const validatedData = createTagSchema.parse(data)

    // 4. Check if tag name already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.name },
    })

    if (existingTag) {
      logger.warn(undefined, 'create_tag_duplicate_name', correlationId, {
        tagName: validatedData.name,
      })
      throw new ValidationError(
        'Ya existe una etiqueta con ese nombre'
      )
    }

    // 5. Check if maximum 20 tags reached (NFR-S59)
    const tagCount = await prisma.tag.count()

    if (tagCount >= 20) {
      logger.warn(session.user.id, 'create_tag_max_reached', correlationId, {
        tagCount,
        maxTags: 20,
      })
      throw new ValidationError(
        'Has alcanzado el máximo de 20 etiquetas personalizadas. Elimina etiquetas existentes antes de crear nuevas.'
      )
    }

    // 6. Create tag
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        color: validatedData.color,
        description: validatedData.description,
      },
    })

    // 7. Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'tag_created',
        targetId: tag.id,
        metadata: {
          tagName: tag.name,
          tagColor: tag.color,
          tagDescription: tag.description,
        },
        timestamp: new Date(),
      },
    })

    logger.info(session.user.id, 'create_tag', correlationId, {
      tagId: tag.id,
      tagName: tag.name,
    })

    perf.end(1000) // Log warning if createTag takes >1s

    return {
      success: true,
      message: 'Etiqueta creada exitosamente',
      tag: {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        description: tag.description,
        createdAt: tag.createdAt,
      },
    }
  } catch (error) {
    perf.end(1000)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const sessionForError = await auth()
      logger.warn(
        sessionForError?.user?.id ?? undefined,
        'create_tag_validation_failed',
        correlationId,
        { errors: error.errors }
      )
      throw new ValidationError('Datos inválidos', { errors: error.errors })
    }

    // Handle custom errors
    if (
      error instanceof ValidationError ||
      error instanceof AuthorizationError ||
      error instanceof AuthenticationError
    ) {
      throw error
    }

    // Handle unexpected errors
    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'create_tag_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError(
      'Error al crear etiqueta. Intente nuevamente.'
    )
  }
}

/**
 * Delete Tag Server Action
 * Story 1.3: Eliminar etiqueta con cascade
 *
 * Admin deletes tag:
 * - Cascade delete: Tag removed from all users (UserTag)
 * - Confirmation required
 * - Audit log created
 *
 * @param tagId - ID of tag to delete
 * @returns Success message
 */
export async function deleteTag(tagId: string) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('delete_tag', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'delete_tag_unauthorized', correlationId)
      throw new AuthenticationError(
        'Debes iniciar sesión para eliminar etiquetas'
      )
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'delete_tag_forbidden', correlationId)
      throw new AuthorizationError(
        'No tienes permiso para eliminar etiquetas'
      )
    }

    // 3. Validate tagId
    if (!tagId || typeof tagId !== 'string') {
      logger.warn(session.user.id, 'delete_tag_invalid_id', correlationId)
      throw new ValidationError('ID de etiqueta inválido')
    }

    // 4. Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        userTags: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!tag) {
      logger.warn(session.user.id, 'delete_tag_not_found', correlationId, {
        tagId,
      })
      throw new ValidationError('Etiqueta no encontrada')
    }

    // 5. Delete tag with explicit cascade to UserTag
    // CRITICAL: Audit log is now INSIDE the transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // First, delete all UserTag records
      await tx.userTag.deleteMany({
        where: { tagId },
      })

      // Then, delete the Tag
      await tx.tag.delete({
        where: { id: tagId },
      })

      // CRITICAL: Log audit trail INSIDE transaction to ensure atomicity
      // If audit log fails, entire transaction (delete + audit) will rollback
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'tag_deleted',
          targetId: tagId,
          metadata: {
            tagName: tag.name,
            affectedUserCount: tag.userTags.length,
            message:
              'Etiqueta eliminada. Esta acción no afecta las capabilities de los usuarios.',
          },
          timestamp: new Date(),
        },
      })
    })

    logger.info(session.user.id, 'delete_tag', correlationId, {
      tagId,
      tagName: tag.name,
      affectedUserCount: tag.userTags.length,
    })

    perf.end()

    return {
      success: true,
      message: `Etiqueta "${tag.name}" eliminada exitosamente. Esta acción no afecta las capabilities de los usuarios.`,
      affectedUserCount: tag.userTags.length,
    }
  } catch (error) {
    perf.end()

    // Handle custom errors
    if (
      error instanceof ValidationError ||
      error instanceof AuthorizationError ||
      error instanceof AuthenticationError
    ) {
      throw error
    }

    // Handle unexpected errors
    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'delete_tag_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError(
      'Error al eliminar etiqueta. Intente nuevamente.'
    )
  }
}

/**
 * Assign Tags to User Server Action
 * Story 1.3: Asignar múltiples etiquetas a usuario
 *
 * Admin assigns tags to user:
 * - NFR-S62: Support multiple tag assignment
 * - Replaces all existing tags with new set
 * - Audit log created
 * - CRITICAL: Tags do NOT modify user capabilities
 *
 * @param userId - ID of user to assign tags to
 * @param tagIds - Array of tag IDs to assign
 * @returns Success message
 */
export async function assignTagsToUser(userId: string, tagIds: string[]) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('assign_tags_to_user', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'assign_tags_unauthorized', correlationId)
      throw new AuthenticationError(
        'Debes iniciar sesión para asignar etiquetas'
      )
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'assign_tags_forbidden', correlationId)
      throw new AuthorizationError(
        'No tienes permiso para asignar etiquetas'
      )
    }

    // 3. Validate data with Zod
    const validatedData = assignTagsSchema.parse({ userId, tagIds })

    // 4. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      include: {
        userTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!user) {
      logger.warn(session.user.id, 'assign_tags_user_not_found', correlationId, {
        userId: validatedData.userId,
      })
      throw new ValidationError('Usuario no encontrado')
    }

    // 5. CRITICAL: Store current capabilities to verify tags don't modify them
    const currentCapabilities = await prisma.userCapability.findMany({
      where: { userId: validatedData.userId },
      include: { capability: true },
    })

    // 6. Delete all existing user tags
    await prisma.userTag.deleteMany({
      where: { userId: validatedData.userId },
    })

    // 7. Assign new tags if provided
    let assignedTags: any[] = []
    if (validatedData.tagIds.length > 0) {
      // Verify all tags exist
      const tags = await prisma.tag.findMany({
        where: {
          id: { in: validatedData.tagIds },
        },
      })

      if (tags.length !== validatedData.tagIds.length) {
        logger.warn(session.user.id, 'assign_tags_some_not_found', correlationId, {
          requestedTagIds: validatedData.tagIds,
          foundTagIds: tags.map((t) => t.id),
        })
        throw new ValidationError(
          'Algunas etiquetas no existen. Verifica tu selección.'
        )
      }

      // Create UserTag records
      await prisma.userTag.createMany({
        data: validatedData.tagIds.map((tagId) => ({
          userId: validatedData.userId,
          tagId,
        })),
      })

      assignedTags = tags
    }

    // 8. CRITICAL: Verify capabilities were NOT modified
    const capabilitiesAfter = await prisma.userCapability.findMany({
      where: { userId: validatedData.userId },
      include: { capability: true },
    })

    if (currentCapabilities.length !== capabilitiesAfter.length) {
      logger.error(
        new Error('Capabilities modified during tag assignment'),
        'assign_tags_capabilities_modified',
        correlationId,
        session.user.id
      )
      throw new InternalError(
        'Error de seguridad: Las capabilities no deben modificarse al asignar etiquetas'
      )
    }

    // 9. Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'tags_assigned',
        targetId: validatedData.userId,
        metadata: {
          oldTags: user.userTags.map((ut) => ut.tag.name),
          newTags: assignedTags.map((t) => t.name),
          targetUserEmail: user.email,
          capabilitiesUnchanged: true,
        },
        timestamp: new Date(),
      },
    })

    logger.info(session.user.id, 'assign_tags_to_user', correlationId, {
      targetUserId: validatedData.userId,
      tagCount: validatedData.tagIds.length,
      capabilitiesUnchanged: true,
    })

    perf.end(1000) // Log warning if assignTags takes >1s

    return {
      success: true,
      message: 'Etiquetas asignadas exitosamente',
      assignedTags: assignedTags.map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color,
      })),
      capabilitiesUnchanged: true,
    }
  } catch (error) {
    perf.end(1000)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const sessionForError = await auth()
      logger.warn(
        sessionForError?.user?.id ?? undefined,
        'assign_tags_validation_failed',
        correlationId,
        { errors: error.errors }
      )
      throw new ValidationError('Datos inválidos', { errors: error.errors })
    }

    // Handle custom errors
    if (
      error instanceof ValidationError ||
      error instanceof AuthorizationError ||
      error instanceof AuthenticationError
    ) {
      throw error
    }

    // Handle unexpected errors
    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'assign_tags_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError(
      'Error al asignar etiquetas. Intente nuevamente.'
    )
  }
}

/**
 * Get All Tags Server Action
 * Story 1.3: Listar todas las etiquetas
 *
 * Returns all tags in the system:
 * - For tag management UI
 * - Shows count of users assigned to each tag
 * - No capability check (read-only)
 *
 * @returns All tags with user count
 */
export async function getTags() {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('get_tags', correlationId)

  try {
    // Get session (optional for read-only)
    // const session = await auth()

    // Fetch all tags with user count
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            userTags: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    perf.end()

    return {
      success: true,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        description: tag.description,
        createdAt: tag.createdAt,
        userCount: tag._count.userTags,
      })),
      totalTags: tags.length,
      maxTags: 20,
    }
  } catch (error) {
    perf.end()

    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'get_tags_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError(
      'Error al obtener etiquetas. Intente nuevamente.'
    )
  }
}

/**
 * Get User Tags Server Action
 * Story 1.3: Obtener etiquetas de un usuario
 *
 * Returns tags assigned to a specific user:
 * - For user profile/edit UI
 * - Shows user's tags with colors
 *
 * @param userId - ID of user
 * @returns User's tags
 */
export async function getUserTags(userId: string) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('get_user_tags', correlationId)

  try {
    // Get session (optional for read-only)
    // const session = await auth()

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('ID de usuario inválido')
    }

    // Fetch user's tags
    const userTags = await prisma.userTag.findMany({
      where: { userId },
      include: {
        tag: true,
      },
      orderBy: {
        tag: {
          name: 'asc',
        },
      },
    })

    perf.end()

    return {
      success: true,
      userId,
      tags: userTags.map((ut) => ({
        id: ut.tag.id,
        name: ut.tag.name,
        color: ut.tag.color,
        description: ut.tag.description,
        assignedAt: ut.assignedAt,
      })),
    }
  } catch (error) {
    perf.end()

    // Handle custom errors
    if (error instanceof ValidationError) {
      throw error
    }

    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'get_user_tags_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError(
      'Error al obtener etiquetas del usuario. Intente nuevamente.'
    )
  }
}
