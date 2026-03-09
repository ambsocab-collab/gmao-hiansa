/**
 * Tests para Middleware de Autorización PBAC
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Tests para validar:
 * - Verificación de autenticación
 * - Verificación de capabilities por ruta
 * - Redirección a /unauthorized sin capability
 * - Log de auditoría de accesos denegados
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Mock del logger para capturar logs de auditoría
 */
const mockLogs: string[] = []
const originalConsoleError = console.error

describe('PBAC Middleware', () => {
  beforeEach(() => {
    // Limpiar logs antes de cada test
    mockLogs.length = 0
    // Mock console.error para capturar logs
    console.error = vi.fn((...args) => {
      mockLogs.push(args.join(' '))
    })
  })

  afterEach(() => {
    // Restaurar console.error después de cada test
    console.error = originalConsoleError
  })

  describe('ROUTE_CAPABILITIES configuration', () => {
    it('should have capabilities defined for dashboard', async () => {
      const { ROUTE_CAPABILITIES } = await import('@/middleware')

      expect(ROUTE_CAPABILITIES['/dashboard']).toEqual(['can_view_kpis'])
    })

    it('should have capabilities defined for work-orders', async () => {
      const { ROUTE_CAPABILITIES } = await import('@/middleware')

      expect(ROUTE_CAPABILITIES['/work-orders']).toEqual(['can_view_all_ots'])
    })

    it('should have capabilities defined for users', async () => {
      const { ROUTE_CAPABILITIES } = await import('@/middleware')

      expect(ROUTE_CAPABILITIES['/users']).toEqual(['can_manage_users'])
    })
  })

  describe('hasCapability helper function', () => {
    it('should return true when user has capability', async () => {
      const { hasCapability } = await import('@/middleware')

      const capabilities = ['can_view_kpis', 'can_create_failure_report']
      const result = hasCapability(capabilities, 'can_view_kpis')

      expect(result).toBe(true)
    })

    it('should return false when user does not have capability', async () => {
      const { hasCapability } = await import('@/middleware')

      const capabilities = ['can_view_kpis']
      const result = hasCapability(capabilities, 'can_manage_users')

      expect(result).toBe(false)
    })

    it('should return false when capabilities is undefined', async () => {
      const { hasCapability } = await import('@/middleware')

      const result = hasCapability(undefined, 'can_view_kpis')

      expect(result).toBe(false)
    })
  })

  describe('hasAllCapabilities helper function', () => {
    it('should return true when user has all required capabilities', async () => {
      const { hasAllCapabilities } = await import('@/middleware')

      const userCapabilities = ['can_view_kpis', 'can_create_failure_report']
      const requiredCapabilities = ['can_view_kpis']

      const result = hasAllCapabilities(userCapabilities, requiredCapabilities)

      expect(result).toBe(true)
    })

    it('should return false when user missing some capabilities', async () => {
      const { hasAllCapabilities } = await import('@/middleware')

      const userCapabilities = ['can_view_kpis']
      const requiredCapabilities = ['can_view_kpis', 'can_manage_users']

      const result = hasAllCapabilities(userCapabilities, requiredCapabilities)

      expect(result).toBe(false)
    })

    it('should return true when no capabilities required', async () => {
      const { hasAllCapabilities } = await import('@/middleware')

      const result = hasAllCapabilities(['can_view_kpis'], [])

      expect(result).toBe(true)
    })

    it('should return true when required capabilities is undefined', async () => {
      const { hasAllCapabilities } = await import('@/middleware')

      const result = hasAllCapabilities(['can_view_kpis'], undefined as any)

      expect(result).toBe(true)
    })
  })

  describe('logAccessDenied function', () => {
    it('should log access denied event with correct format', async () => {
      const { logAccessDenied } = await import('@/middleware')

      logAccessDenied('user-123', '/dashboard', ['can_view_kpis'])

      expect(mockLogs.length).toBe(1)
      expect(mockLogs[0]).toContain('[AUDIT] Access Denied:')
      expect(mockLogs[0]).toContain('user-123')
      expect(mockLogs[0]).toContain('/dashboard')
      expect(mockLogs[0]).toContain('can_view_kpis')
    })

    it('should handle undefined userId', async () => {
      const { logAccessDenied } = await import('@/middleware')

      logAccessDenied(undefined, '/users', ['can_manage_users'])

      expect(mockLogs.length).toBe(1)
      expect(mockLogs[0]).toContain('unknown')
    })
  })

  describe('Middleware matcher configuration', () => {
    it('should include protected routes in matcher', async () => {
      const { config } = await import('@/middleware')

      expect(config.matcher).toContain('/dashboard/:path*')
      expect(config.matcher).toContain('/work-orders/:path*')
      expect(config.matcher).toContain('/users/:path*')
    })
  })
})
