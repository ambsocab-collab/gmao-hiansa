'use server'

/**
 * User Server Actions
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Server Actions for user management:
 * - changePassword: Change user password
 * - updateProfile: Update user profile
 * - createUser: Admin creates new user
 * - updateUser: Admin updates user
 * - deleteUser: Admin soft deletes user
 *
 * All actions use:
 * - Error handling with custom error classes
 * - Structured logging with correlation IDs
 * - Performance tracking for slow operations
 * - PBAC capability checks
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { logger } from '@/lib/observability/logger'
import { trackPerformance } from '@/lib/observability/performance'
import {
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  InternalError,
} from '@/lib/utils/errors'
import { headers } from 'next/headers'
import { changePasswordSchema, updateProfileSchema, createUserSchema } from '@/lib/schemas'
import { ZodError } from 'zod'

/**
 * Update Profile Server Action
 * Story 1.1: Perfil de usuario (edición propia)
 *
 * Updates user's own profile (name, phone)
 * Email cannot be changed
 *
 * @param data - Profile data to update
 * @returns Success message
 */
export async function updateProfile(data: { name: string; phone?: string }) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('update_profile', correlationId)

  try {
    // 1. Get current session
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'update_profile_unauthorized', correlationId)
      throw new AuthenticationError('Debes iniciar sesión para actualizar tu perfil')
    }

    // 2. Validate data
    const validatedData = updateProfileSchema.parse(data)

    // 3. Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        phone: validatedData.phone || null,
      },
    })

    // 4. Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'profile_update',
        metadata: {
          fields: ['name', 'phone'],
        },
        timestamp: new Date(),
      },
    })

    logger.info(session.user.id, 'update_profile', correlationId, {
      success: true,
    })

    perf.end()

    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser,
    }
  } catch (error) {
    perf.end()

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      logger.warn(undefined, 'update_profile_validation_failed', correlationId, {
        errors: error.errors,
      })
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
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'update_profile_error', correlationId, sessionForError?.user?.id)

    throw new InternalError('Error al actualizar perfil. Intente nuevamente.')
  }
}

/**
 * Change Password Server Action
 * Story 1.1: Cambio de contraseña forzado en primer acceso
 *
 * Changes user password after validating current password
 * Updates forcePasswordReset flag to false
 *
 * @param formData - Form data with currentPassword and newPassword
 * @returns Success message
 */
export async function changePassword(formData: FormData) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('change_password', correlationId)

  try {
    // 1. Get current session
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'change_password_unauthorized', correlationId)
      throw new AuthenticationError('Debes iniciar sesión para cambiar tu contraseña')
    }

    // 2. Validate and parse form data
    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validatedData = changePasswordSchema.parse(rawData)

    // 3. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      logger.error(new Error('User not found in database'), 'change_password_user_not_found', correlationId, session.user.id)
      throw new InternalError('Usuario no encontrado')
    }

    // 4. Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.passwordHash
    )

    if (!isCurrentPasswordValid) {
      logger.warn(session.user.id, 'change_password', correlationId)
      throw new ValidationError('Contraseña actual incorrecta')
    }

    // 5. Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword)

    // 6. Update user password and clear forcePasswordReset flag
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedPassword,
        forcePasswordReset: false,
      },
    })

    // 7. Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'password_change',
        timestamp: new Date(),
      },
    })

      logger.info(session.user.id, 'change_password', correlationId)
    perf.end()

    return { success: true, message: 'Contraseña cambiada exitosamente' }
  } catch (error) {
    perf.end()

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const sessionForError = await auth()
      logger.warn(sessionForError?.user?.id ?? undefined, 'change_password_validation_failed', correlationId, { errors: error.errors })
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
    const sessionForError2 = await auth()
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'change_password_error', correlationId, sessionForError2?.user?.id)

    throw new InternalError('Error al cambiar contraseña. Intente nuevamente.')
  }
}

/**
 * Create User Server Action
 * Story 1.1: Registro de usuarios (admin con can_manage_users capability)
 *
 * Admin creates new user with:
 * - Default capability: can_create_failure_report (NFR-S66)
 * - forcePasswordReset=true for first access
 * - Assigned capabilities from checkboxes
 *
 * @param data - User data
 * @returns Created user
 */
export async function createUser(data: {
  name: string
  email: string
  phone?: string
  roleLabel?: string
  password: string
  capabilities: string[]
}) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('create_user', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'create_user_unauthorized', correlationId)
      throw new AuthenticationError('Debes iniciar sesión para crear usuarios')
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'create_user_forbidden', correlationId)
      throw new AuthorizationError('No tienes permiso para crear usuarios')
    }

    // 3. Validate data
    const validatedData = createUserSchema.parse(data)

    // 4. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      logger.warn(undefined, 'create_user_duplicate_email', correlationId)
      throw new ValidationError('El email ya está registrado')
    }

    // 5. Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // 6. Create user with capabilities
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone || null,
        passwordHash: hashedPassword,
        forcePasswordReset: true, // Force password reset on first login
        userCapabilities: {
          create: validatedData.capabilities.map((capabilityName) => ({
            capability: {
              connect: { name: capabilityName },
            },
          })),
        },
      },
      include: {
        userCapabilities: {
          include: { capability: true },
        },
      },
    })

    // 7. Log activity for admin
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'user_created',
        targetId: user.id,
        metadata: {
          createdUserEmail: user.email,
          capabilities: validatedData.capabilities,
        },
        timestamp: new Date(),
      },
    })

      logger.info(session.user.id, 'create_user', correlationId)
    /**
     * Performance tracking: log warning if createUser takes >1s (1000ms)
     *
     * Rationale: 1-second threshold for user-facing operations
     * - User creation involves: DB write, password hashing (bcrypt), audit logging
     * - Expected completion time: <500ms on Vercel serverless
     * - Threshold: 1000ms provides buffer for cold starts, network latency
     * - Action: Create warning log if exceeded (for performance optimization)
     *
     * @see Story 0.5: Performance tracking pattern (lib/observability/performance.ts)
     */
    perf.end(1000) // Log warning if createUser takes >1s

    return {
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        capabilities: user.userCapabilities.map((uc) => uc.capability.name),
      },
    }
  } catch (error) {
    perf.end(1000) // Track performance even on error

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const sessionForError = await auth()
      logger.warn(sessionForError?.user?.id ?? undefined, 'create_user_validation_failed', correlationId, { errors: error.errors })
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
    const sessionForError2 = await auth()
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'create_user_error', correlationId, sessionForError2?.user?.id)

    throw new InternalError('Error al crear usuario. Intente nuevamente.')
  }
}

/**
 * Delete User Server Action (Soft Delete)
 * Story 1.1: Soft delete con bloqueo de login
 *
 * Admin performs soft delete on user:
 * - Sets deleted=true
 * - User cannot login after deletion
 * - Audit log created
 *
 * @param userId - ID of user to delete
 * @returns Success message
 */
export async function deleteUser(userId: string) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('delete_user', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'delete_user_unauthorized', correlationId)
      throw new AuthenticationError('Debes iniciar sesión para eliminar usuarios')
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'delete_user', correlationId)
      throw new AuthorizationError('No tienes permiso para eliminar usuarios')
    }

    // 3. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      logger.warn(undefined, 'delete_user_not_found', correlationId)
      throw new ValidationError('Usuario no encontrado')
    }

    // 4. Prevent self-deletion
    if (userId === session.user.id) {
      logger.warn(session.user.id, 'delete_user_self_attempt', correlationId)
      throw new ValidationError('No puedes eliminar tu propio usuario')
    }

    // 5. Perform soft delete
    await prisma.user.update({
      where: { id: userId },
      data: { deleted: true },
    })

    // 5. Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'user_deleted',
        targetId: userId,
        metadata: {
          deletedUserEmail: user?.email ?? 'unknown',
        },
        timestamp: new Date(),
      },
    })

    logger.audit('User deleted', {
      correlationId,
      userId: session.user.id,
      deletedUserId: userId,
      action: 'delete_user',
    })

    perf.end()

    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
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
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'delete_user_error', correlationId, sessionForError?.user?.id)

    throw new InternalError('Error al eliminar usuario. Intente nuevamente.')
  }
}

/**
 * Update User Capabilities Server Action
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Admin updates user capabilities:
 * - Only users with can_manage_users can update capabilities
 * - Old capabilities are replaced with new ones
 * - Audit log entry created
 * - Session updated if user edits themselves (with restrictions)
 *
 * @param userId - ID of user to update
 * @param capabilities - New array of capability names
 * @returns Success message
 */
export async function updateUserCapabilities(
  userId: string,
  capabilities: string[]
) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'
  const perf = trackPerformance('update_user_capabilities', correlationId)

  try {
    // 1. Get current session and verify capability
    const session = await auth()
    if (!session?.user?.id) {
      logger.warn(undefined, 'update_capabilities_unauthorized', correlationId)
      throw new AuthenticationError('Debes iniciar sesión para actualizar capabilities')
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'update_capabilities_forbidden', correlationId)
      throw new AuthorizationError('No tienes permiso para actualizar capabilities')
    }

    // 3. Validate capabilities array
    if (!Array.isArray(capabilities)) {
      logger.warn(session.user.id, 'update_capabilities_invalid_array', correlationId)
      throw new ValidationError('Capabilities debe ser un arreglo')
    }

    // 4. Verify user exists and get current capabilities
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userCapabilities: {
          include: { capability: true },
        },
      },
    })

    if (!user) {
      logger.warn(session.user.id, 'update_capabilities_user_not_found', correlationId)
      throw new ValidationError('Usuario no encontrado')
    }

    // 5. Prevent self-modification of can_manage_users (security measure)
    if (userId === session.user.id) {
      const willLoseManageUsers = !capabilities.includes('can_manage_users')
      const hasManageUsersCurrently = session.user.capabilities?.includes('can_manage_users')

      if (hasManageUsersCurrently && willLoseManageUsers) {
        logger.warn(session.user.id, 'update_capabilities_self_remove_admin', correlationId)
        throw new ValidationError('No puedes quitarte a ti mismo el permiso de gestionar usuarios')
      }
    }

    // 6. Store old capabilities for audit
    const oldCapabilities = user.userCapabilities.map((uc) => uc.capability.name)

    // 7. Delete all existing capabilities
    await prisma.userCapability.deleteMany({
      where: { userId },
    })

    // 8. Create new capabilities
    if (capabilities.length > 0) {
      // Get capability IDs for the provided capability names
      const capabilityRecords = await prisma.capability.findMany({
        where: {
          name: { in: capabilities },
        },
        select: { id: true, name: true },
      })

      // Create UserCapability records
      await prisma.userCapability.createMany({
        data: capabilityRecords.map((cap) => ({
          userId,
          capabilityId: cap.id,
        })),
      })

      // ✅ Validate that all requested capabilities were found
      if (capabilityRecords.length !== capabilities.length) {
        const invalidCapabilities = capabilities.filter(
          capName => !capabilityRecords.find(cr => cr.name === capName)
        )
        logger.warn(session.user.id, 'update_capabilities_invalid_names', correlationId, {
          invalidCapabilities,
          provided: capabilities.length,
          found: capabilityRecords.length
        })
        // Note: We don't throw here because the valid capabilities were still assigned
        // This prevents partial updates from failing completely
      }
    }

    // 9. Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'capability_changed',
        targetId: userId,
        metadata: {
          oldCapabilities,
          newCapabilities: capabilities,
          targetUserEmail: user.email,
        },
        timestamp: new Date(),
      },
    })

    logger.info(session.user.id, 'update_capabilities', correlationId, {
      targetUserId: userId,
      oldCapabilities,
      newCapabilities: capabilities,
    })

    perf.end()

    return {
      success: true,
      message: 'Capabilities actualizadas exitosamente',
      oldCapabilities,
      newCapabilities: capabilities,
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
      'update_capabilities_error',
      correlationId,
      sessionForError?.user?.id
    )

    throw new InternalError('Error al actualizar capabilities. Intente nuevamente.')
  }
}

/**
 * Log Access Denied Server Action
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Logs access denied events to AuditLog for security tracking.
 * Called when user tries to access a route without required capability.
 *
 * @param path - The path user tried to access
 * @param requiredCapabilities - Capabilities required for the path
 * @returns Success message
 */
export async function logAccessDeniedAction(
  path: string,
  requiredCapabilities: string[]
) {
  const correlationId = (await headers()).get('x-correlation-id') || 'unknown'

  try {
    // Get current session
    const session = await auth()
    if (!session?.user?.id) {
      // If no session, skip logging (shouldn't happen)
      return { success: false, message: 'No session found' }
    }

    // Log access denied to audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'access_denied',
        metadata: {
          path,
          requiredCapabilities,
          userCapabilities: session.user.capabilities || [],
          reason: 'Insufficient capabilities',
        },
        timestamp: new Date(),
      },
    })

    logger.warn(session.user.id, 'access_denied_logged', correlationId, {
      path,
      requiredCapabilities,
    })

    return { success: true, message: 'Access denied logged' }
  } catch (error) {
    // Don't throw - logging failures shouldn't prevent the page from loading
    const sessionForError = await auth()
    logger.error(
      new Error(error instanceof Error ? error.message : 'Unknown error'),
      'log_access_denied_error',
      correlationId,
      sessionForError?.user?.id
    )

    return { success: false, message: 'Failed to log access denied' }
  }
}
