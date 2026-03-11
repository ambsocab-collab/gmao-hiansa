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
import { z } from 'zod'

/**
 * Zod schemas for validation
 */

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional(),
})

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
      logger.warn(undefined, 'update_profile', correlationId, {
        correlationId,
        action: 'update_profile',
      })
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
    if (error instanceof z.ZodError) {
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
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'update_profile_error', correlationId, session?.user?.id)

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
      logger.warn(undefined, 'change_password', correlationId ? {  } : undefined)
      throw new AuthenticationError('Debes iniciar sesión para cambiar tu contraseña')
    }

    // 2. Validate and parse form data
    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
    }

    const validatedData = changePasswordSchema.parse(rawData)

    // 3. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      logger.error('User not found in database', {
        correlationId,
        userId: session.user.id,
        action: 'change_password',
      })
      throw new InternalError('Usuario no encontrado')
    }

    // 4. Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.passwordHash
    )

    if (!isCurrentPasswordValid) {
      logger.warn('Invalid current password for change password', {
        correlationId,
        userId: session.user.id,
        action: 'change_password',
      })
      throw new AuthenticationError('Contraseña actual incorrecta')
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

    logger.info('Password changed successfully', {
      correlationId,
      userId: session.user.id,
      action: 'change_password',
    })

    perf.end()

    return { success: true, message: 'Contraseña cambiada exitosamente' }
  } catch (error) {
    perf.end()

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      logger.warn('Password change validation failed', {
        correlationId,
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
    logger.error('Unexpected error changing password', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    throw new InternalError('Error al cambiar contraseña. Intente nuevamente.')
  }
}

/**
 * Zod schema for user creation
 */
export const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional(),
  roleLabel: z.string().optional(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  capabilities: z.array(z.string()).default(['can_create_failure_report']),
})

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
      logger.warn(undefined, 'create_user', correlationId ? {  } : undefined)
      throw new AuthenticationError('Debes iniciar sesión para crear usuarios')
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn('Forbidden user creation attempt', {
        correlationId,
        userId: session.user.id,
        action: 'create_user',
      })
      throw new AuthorizationError('No tienes permiso para crear usuarios')
    }

    // 3. Validate data
    const validatedData = createUserSchema.parse(data)

    // 4. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      logger.warn('User creation failed: email already exists', {
        correlationId,
        email: validatedData.email,
        action: 'create_user',
      })
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
        user_capabilities: {
          create: validatedData.capabilities.map((capabilityName) => ({
            capability: {
              connect: { name: capabilityName },
            },
          })),
        },
      },
      include: {
        user_capabilities: {
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

    logger.info('User created successfully', {
      correlationId,
      userId: session.user.id,
      createdUserId: user.id,
      action: 'create_user',
    })

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
        capabilities: user.user_capabilities.map((uc) => uc.capability.name),
      },
    }
  } catch (error) {
    perf.end(1000) // Track performance even on error

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      logger.warn('User creation validation failed', {
        correlationId,
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
    logger.error('Unexpected error creating user', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

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
      logger.warn(undefined, 'delete_user', correlationId ? {  } : undefined)
      throw new AuthenticationError('Debes iniciar sesión para eliminar usuarios')
    }

    // 2. Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn('Forbidden user deletion attempt', {
        correlationId,
        userId: session.user.id,
        action: 'delete_user',
      })
      throw new AuthorizationError('No tienes permiso para eliminar usuarios')
    }

    // 3. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      logger.warn('User deletion failed: user not found', {
        correlationId,
        targetUserId: userId,
        action: 'delete_user',
      })
      throw new ValidationError('Usuario no encontrado')
    }

    // 4. Prevent self-deletion
    if (userId === session.user.id) {
      logger.warn('Self-deletion attempt blocked', {
        correlationId,
        userId: session.user.id,
        action: 'delete_user',
      })
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
          deletedUserEmail: user.email,
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
    logger.error('Unexpected error deleting user', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    throw new InternalError('Error al eliminar usuario. Intente nuevamente.')
  }
}
