/**
 * Tests para Middleware de Autorización PBAC
 * Story 0.3: NextAuth.js con Credentials Provider
 * Story 0.5: Error Handling, Observability y CI/CD (Correlation ID tests)
 *
 * Tests para validar:
 * - Verificación de autenticación
 * - Verificación de capabilities por ruta
 * - Redirección a /unauthorized sin capability
 * - Log de auditoría de accesos denegados
 * - Story 0.5: Correlation ID generation and propagation
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

      // Dashboard is accessible to all authenticated users (no capabilities required)
      expect(ROUTE_CAPABILITIES['/dashboard']).toEqual([])
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
      // Story 0.5: Updated to use structured format matching logger
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.level).toBe('warn')
      expect(logEntry.userId).toBe('user-123')
      expect(logEntry.action).toBe('ACCESS_DENIED')
      expect(logEntry.metadata.path).toBe('/dashboard')
      expect(logEntry.metadata.requiredCapabilities).toEqual(['can_view_kpis'])
      expect(logEntry.metadata.reason).toBe('Insufficient capabilities')
    })

    it('should handle undefined userId', async () => {
      const { logAccessDenied } = await import('@/middleware')

      logAccessDenied(undefined, '/users', ['can_manage_users'])

      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.userId).toBe('unknown')
    })

    // Story 0.5: Correlation ID tests
    it('should include correlation ID in access denied logs', async () => {
      const { logAccessDenied } = await import('@/middleware')

      const correlationId = 'test-correlation-123'
      logAccessDenied('user-123', '/dashboard', ['can_view_kpis'], correlationId)

      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.correlationId).toBe(correlationId)
    })

    it('should use N/A when correlation ID is not provided', async () => {
      const { logAccessDenied } = await import('@/middleware')

      logAccessDenied('user-123', '/dashboard', ['can_view_kpis'])

      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.correlationId).toBe('N/A')
    })
  })

  // Story 0.5: Correlation ID generation tests
  describe('getOrCreateCorrelationId function', () => {
    it('should return existing correlation ID from headers', async () => {
      const { getOrCreateCorrelationId, CORRELATION_ID_HEADER } = await import('@/middleware')

      const existingId = 'existing-correlation-123'
      const headers = new Headers()
      headers.set(CORRELATION_ID_HEADER, existingId)

      const result = getOrCreateCorrelationId(headers)

      expect(result).toBe(existingId)
    })

    it('should generate new correlation ID when not in headers', async () => {
      const { getOrCreateCorrelationId } = await import('@/middleware')

      const headers = new Headers()
      const result = getOrCreateCorrelationId(headers)

      expect(result).toBeDefined()
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should generate unique correlation IDs', async () => {
      const { getOrCreateCorrelationId } = await import('@/middleware')

      const headers1 = new Headers()
      const headers2 = new Headers()

      const id1 = getOrCreateCorrelationId(headers1)
      const id2 = getOrCreateCorrelationId(headers2)

      expect(id1).not.toBe(id2)
    })
  })

  describe('CORRELATION_ID_HEADER constant', () => {
    it('should export correlation ID header name', async () => {
      const { CORRELATION_ID_HEADER } = await import('@/middleware')

      expect(CORRELATION_ID_HEADER).toBe('x-correlation-id')
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
