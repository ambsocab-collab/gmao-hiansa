/**
 * Unit Tests for User Server Actions
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Tests cover:
 * - updateProfile: Update user's own profile (name, phone)
 * - changePassword: Change password with current password verification
 * - createUser: Admin creates new user with capabilities
 * - deleteUser: Admin performs soft delete on user
 *
 * Testing Strategy:
 * - Mock all external dependencies (Prisma, auth, headers, logger, trackPerformance)
 * - Test success paths and error scenarios
 * - Verify authorization checks (PBAC capabilities)
 * - Verify error handling and logging
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  updateProfile,
  changePassword,
  createUser,
  deleteUser,
} from '@/app/actions/users'
import * as authAdapter from '@/lib/auth-adapter'
import * as db from '@/lib/db'
import * as authLib from '@/lib/auth'
import * as loggerModule from '@/lib/observability/logger'
import * as perfModule from '@/lib/observability/performance'

// Mock all external dependencies
vi.mock('@/lib/auth-adapter')
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    capability: {
      createMany: vi.fn(),
    },
  },
}))
vi.mock('@/lib/auth')
vi.mock('@/lib/observability/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    audit: vi.fn(),
  },
}))
vi.mock('@/lib/observability/performance')

// Mock headers() from next/headers
const mockGet = vi.fn(() => 'test-correlation-id-123')
vi.mock('next/headers', () => ({
  headers: () => ({
    get: mockGet,
  }),
}))

describe('User Server Actions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()

    // Setup default mock return values
    mockGet.mockReturnValue('test-correlation-id-123')

    // Setup trackPerformance mock to return object with end method
    vi.spyOn(perfModule, 'trackPerformance').mockReturnValue({
      end: vi.fn(),
    })

    // Setup default mocks for Prisma calls
    vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)
    vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({
      id: 'audit-123',
      user_id: 'test-user-123',
      action: 'test_action',
      target_id: 'test-target-123',
      metadata: {},
      timestamp: new Date(),
    } as any)
  })

  describe('updateProfile', () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        capabilities: [],
      },
    }

    it('[P1-UNIT-001] should update user profile successfully', async () => {
      // Arrange
      const profileData = {
        name: 'Updated Name',
        phone: '+34 612 345 678',
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({
        id: 'user-123',
        name: 'Updated Name',
        email: 'user@example.com',
        phone: '+34 612 345 678',
      } as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      // Act
      const result = await updateProfile(profileData)

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: expect.any(Object),
      })
      expect(db.prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          name: 'Updated Name',
          phone: '+34 612 345 678',
        },
      })
      expect(db.prisma.activityLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: 'user-123',
          action: 'profile_update',
        }),
      })
    })

    it('[P1-UNIT-002] should require authentication', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(null as any)

      // Act & Assert
      await expect(updateProfile({ name: 'Test' })).rejects.toThrow(
        'Debes iniciar sesión para actualizar tu perfil'
      )
    })

    it('[P1-UNIT-003] should validate name is required', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)

      // Act & Assert
      await expect(updateProfile({ name: '' })).rejects.toThrow()
    })

    it('[P1-UNIT-004] should handle database errors gracefully', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'update').mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(
        updateProfile({ name: 'Test' })
      ).rejects.toThrow('Error al actualizar perfil. Intente nuevamente.')
    })
  })

  describe('changePassword', () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        capabilities: [],
      },
    }

    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      password_hash: 'hashed-current-password',
    }

    it('[P1-UNIT-005] should change password successfully', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(mockUser as any)
      vi.spyOn(authLib, 'verifyPassword').mockResolvedValue(true)
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('new-hashed-password')
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({} as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      // Act
      const result = await changePassword(formData)

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      })
      expect(authLib.verifyPassword).toHaveBeenCalledWith('currentPass123', 'hashed-current-password')
      expect(authLib.hashPassword).toHaveBeenCalledWith('NewSecure123')
      expect(db.prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          password_hash: 'new-hashed-password',
          force_password_reset: false,
        },
      })
    })

    it('[P1-UNIT-006] should require authentication', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(null as any)
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow(
        'Debes iniciar sesión para cambiar tu contraseña'
      )
    })

    it('[P1-UNIT-007] should validate current password is required', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      const formData = new FormData()
      formData.append('currentPassword', '')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow()
    })

    it('[P1-UNIT-008] should validate password strength (8+ chars)', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'weak')
      formData.append('confirmPassword', 'weak')

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow()
    })

    it('[P1-UNIT-009] should validate password strength (uppercase required)', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'lowercase123')
      formData.append('confirmPassword', 'lowercase123')

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow()
    })

    it('[P1-UNIT-010] should validate password strength (number required)', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'UppercaseOnly')
      formData.append('confirmPassword', 'UppercaseOnly')

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow()
    })

    it('[P1-UNIT-011] should verify current password matches', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('currentPassword', 'wrongPassword')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(mockUser as any)
      vi.spyOn(authLib, 'verifyPassword').mockResolvedValue(false)

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow(
        'Contraseña actual incorrecta'
      )
    })

    it('[P1-UNIT-012] should require passwords to match', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'DifferentSecure123')

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)

      // Act & Assert
      await expect(changePassword(formData)).rejects.toThrow()
    })
  })

  describe('createUser', () => {
    const mockAdminSession = {
      user: {
        id: 'admin-123',
        email: 'admin@hiansa.com',
        name: 'Admin',
        capabilities: ['can_manage_users'],
      },
    }

    it('[P1-UNIT-013] should create user successfully with default capability', async () => {
      // Arrange
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        phone: '+34 600 000 001',
        password: 'TempPassword123',
        capabilities: ['can_create_failure_report'],
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(null) // Email not taken
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('hashed-password')
      vi.spyOn(db.prisma.user, 'create').mockResolvedValue({
        id: 'new-user-123',
        email: 'newuser@example.com',
        name: 'New User',
        user_capabilities: [
          {
            capability: { name: 'can_create_failure_report' },
          },
        ],
      } as any)
      vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({} as any)

      // Act
      const result = await createUser(userData)

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Usuario creado exitosamente',
        user: expect.objectContaining({
          id: 'new-user-123',
          email: 'newuser@example.com',
          name: 'New User',
        }),
      })
      expect(db.prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'newuser@example.com',
          name: 'New User',
          phone: '+34 600 000 001',
          password_hash: 'hashed-password',
          force_password_reset: true,
          user_capabilities: {
            create: [
              {
                capability: {
                  connect: { name: 'can_create_failure_report' },
                },
              },
            ],
          },
        }),
        include: expect.objectContaining({
          user_capabilities: expect.objectContaining({
            include: expect.objectContaining({
              capability: true,
            }),
          }),
        }),
      })
    })

    it('[P1-UNIT-014] should require authentication', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(null as any)

      // Act & Assert
      await expect(
        createUser({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123',
          capabilities: [],
        })
      ).rejects.toThrow('Debes iniciar sesión para crear usuarios')
    })

    it('[P1-UNIT-015] should require can_manage_users capability', async () => {
      // Arrange
      const mockNonAdminSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          capabilities: ['can_create_failure_report'], // No can_manage_users
        },
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockNonAdminSession as any)

      // Act & Assert
      await expect(
        createUser({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123',
          capabilities: [],
        })
      ).rejects.toThrow('No tienes permiso para crear usuarios')
    })

    it('[P1-UNIT-016] should require unique email', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        capabilities: [],
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      } as any)

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow('El email ya está registrado')
    })

    it('[P1-UNIT-017] should validate name is required', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)

      // Act & Assert
      await expect(
        createUser({
          name: '',
          email: 'test@example.com',
          password: 'password123',
          capabilities: [],
        })
      ).rejects.toThrow()
    })

    it('[P1-UNIT-018] should validate email format', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)

      // Act & Assert
      await expect(
        createUser({
          name: 'Test',
          email: 'invalid-email',
          password: 'password123',
          capabilities: [],
        })
      ).rejects.toThrow()
    })

    it('[P1-UNIT-019] should validate password minimum length', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)

      // Act & Assert
      await expect(
        createUser({
          name: 'Test',
          email: 'test@example.com',
          password: 'short',
          capabilities: [],
        })
      ).rejects.toThrow()
    })
  })

  describe('deleteUser', () => {
    const mockAdminSession = {
      user: {
        id: 'admin-123',
        email: 'admin@hiansa.com',
        name: 'Admin',
        capabilities: ['can_manage_users'],
      },
    }

    const mockUserToDelete = {
      id: 'user-to-delete-123',
      email: 'todelete@example.com',
      name: 'User To Delete',
    }

    it('[P1-UNIT-020] should soft delete user successfully', async () => {
      // Arrange
      const userId = 'user-to-delete-123'

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(mockUserToDelete as any)
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({
        id: userId,
        email: 'todelete@example.com',
        name: 'User To Delete',
      } as any)
      vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({
        id: 'audit-123',
        user_id: 'admin-123',
        action: 'user_deleted',
        target_id: userId,
        metadata: {
          deletedUserEmail: 'todelete@example.com',
        },
        timestamp: new Date(),
      } as any)

      // Act
      const result = await deleteUser(userId)

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Usuario eliminado exitosamente',
      })
      expect(db.prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deleted: true },
      })
    })

    it('[P1-UNIT-021] should require authentication', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(null as any)

      // Act & Assert
      await expect(deleteUser('user-123')).rejects.toThrow(
        'Debes iniciar sesión para eliminar usuarios'
      )
    })

    it('[P1-UNIT-022] should require can_manage_users capability', async () => {
      // Arrange
      const mockNonAdminSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          capabilities: ['can_create_failure_report'], // No can_manage_users
        },
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockNonAdminSession as any)

      // Act & Assert
      await expect(deleteUser('user-123')).rejects.toThrow(
        'No tienes permiso para eliminar usuarios'
      )
    })

    it('[P1-UNIT-023] should verify user exists', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(null)

      // Act & Assert
      await expect(deleteUser('non-existent-user')).rejects.toThrow(
        'Usuario no encontrado'
      )
    })

    it('[P1-UNIT-024] should handle database errors gracefully', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(mockUserToDelete as any)
      vi.spyOn(db.prisma.user, 'update').mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(deleteUser('user-123')).rejects.toThrow('Error al eliminar usuario. Intente nuevamente.')
    })
  })

  describe('Performance Tracking', () => {
    it('[P1-UNIT-025] should track performance for updateProfile', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com', name: 'Test', capabilities: [] },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({} as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      // Act
      await updateProfile({ name: 'Updated' })

      // Assert
      expect(perfModule.trackPerformance).toHaveBeenCalledWith('update_profile', 'test-correlation-id-123')
    })

    it('[P1-UNIT-026] should track performance for changePassword', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com', name: 'Test', capabilities: [] },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue({
        id: 'user-123',
        password_hash: 'hash',
      } as any)
      vi.spyOn(authLib, 'verifyPassword').mockResolvedValue(true)
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('new-hash')
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({} as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      // Act
      await changePassword(formData)

      // Assert
      expect(perfModule.trackPerformance).toHaveBeenCalledWith('change_password', 'test-correlation-id-123')
    })

    it('[P1-UNIT-027] should track performance for createUser', async () => {
      // Arrange
      const mockAdminSession = {
        user: {
          id: 'admin-123',
          email: 'admin@hiansa.com',
          name: 'Admin',
          capabilities: ['can_manage_users'],
        },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(null)
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('hash')
      vi.spyOn(db.prisma.user, 'create').mockResolvedValue({
        id: 'new-123',
        user_capabilities: [{ capability: { name: 'can_create_failure_report' } }],
      } as any)
      vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({} as any)

      // Act
      await createUser({
        name: 'New',
        email: 'new@example.com',
        password: 'password123',
        capabilities: [],
      })

      // Assert
      expect(perfModule.trackPerformance).toHaveBeenCalledWith('create_user', 'test-correlation-id-123')
    })

    it('[P1-UNIT-028] should track performance even on error', async () => {
      // Arrange
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(null as any)

      // Act & Assert
      try {
        await updateProfile({ name: 'Test' })
      } catch {
        // Expected to throw
      }

      expect(perfModule.trackPerformance).toHaveBeenCalled()
    })
  })

  describe('Logging', () => {
    it('[P1-UNIT-029] should log profile update success', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com', name: 'Test', capabilities: [] },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({} as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      // Act
      await updateProfile({ name: 'Updated' })

      // Assert
      expect(loggerModule.logger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          correlationId: 'test-correlation-id-123',
          userId: 'user-123',
          action: 'update_profile',
        })
      )
    })

    it('[P1-UNIT-030] should log password change success', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com', name: 'Test', capabilities: [] },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue({
        id: 'user-123',
        password_hash: 'hash',
      } as any)
      vi.spyOn(authLib, 'verifyPassword').mockResolvedValue(true)
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('new-hash')
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({} as any)
      vi.spyOn(db.prisma.activityLog, 'create').mockResolvedValue({} as any)

      const formData = new FormData()
      formData.append('currentPassword', 'currentPass123')
      formData.append('newPassword', 'NewSecure123')
      formData.append('confirmPassword', 'NewSecure123')

      // Act
      await changePassword(formData)

      // Assert
      expect(loggerModule.logger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          correlationId: 'test-correlation-id-123',
          userId: 'user-123',
          action: 'change_password',
        })
      )
    })

    it('[P1-UNIT-031] should log user creation success', async () => {
      // Arrange
      const mockAdminSession = {
        user: {
          id: 'admin-123',
          email: 'admin@hiansa.com',
          name: 'Admin',
          capabilities: ['can_manage_users'],
        },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(null)
      vi.spyOn(authLib, 'hashPassword').mockResolvedValue('hash')
      vi.spyOn(db.prisma.user, 'create').mockResolvedValue({
        id: 'new-123',
        user_capabilities: [{ capability: { name: 'can_create_failure_report' } }],
      } as any)
      vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({} as any)

      // Act
      await createUser({
        name: 'New',
        email: 'new@example.com',
        password: 'password123',
        capabilities: [],
      })

      // Assert
      expect(loggerModule.logger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          correlationId: 'test-correlation-id-123',
          userId: 'admin-123',
          createdUserId: 'new-123',
          action: 'create_user',
        })
      )
    })

    it('[P1-UNIT-032] should log audit trail for user deletion', async () => {
      // Arrange
      const mockAdminSession = {
        user: {
          id: 'admin-123',
          email: 'admin@hiansa.com',
          name: 'Admin',
          capabilities: ['can_manage_users'],
        },
      }
      const mockUser = {
        id: 'user-to-delete',
        email: 'todelete@example.com',
        name: 'User To Delete',
      }

      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockAdminSession as any)
      vi.spyOn(db.prisma.user, 'findUnique').mockResolvedValue(mockUser as any)
      vi.spyOn(db.prisma.user, 'update').mockResolvedValue({
        id: 'user-to-delete',
        email: 'todelete@example.com',
        name: 'User To Delete',
      } as any)
      vi.spyOn(db.prisma.auditLog, 'create').mockResolvedValue({
        id: 'audit-log-123',
        user_id: 'admin-123',
        action: 'user_deleted',
        target_id: 'user-to-delete',
        metadata: {
          deletedUserEmail: 'todelete@example.com',
        },
        timestamp: new Date(),
      } as any)

      // Act
      await deleteUser('user-to-delete')

      // Assert
      expect(loggerModule.logger.audit).toHaveBeenCalledWith(
        'User deleted',
        expect.objectContaining({
          correlationId: 'test-correlation-id-123',
          userId: 'admin-123',
          deletedUserId: 'user-to-delete',
          action: 'delete_user',
        })
      )
    })

    it('[P1-UNIT-033] should log warnings for authorization failures', async () => {
      // Arrange
      const mockNonAdminSession = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          capabilities: [],
        },
      }
      vi.spyOn(authAdapter, 'auth').mockResolvedValue(mockNonAdminSession as any)

      // Act & Assert
      try {
        await createUser({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123',
          capabilities: [],
        })
      } catch {
        // Expected to throw
      }

      expect(loggerModule.logger.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          correlationId: 'test-correlation-id-123',
          userId: 'user-123',
          action: 'create_user',
        })
      )
    })
  })
})
