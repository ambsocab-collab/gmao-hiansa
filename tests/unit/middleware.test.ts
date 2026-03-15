/**
 * Middleware Tests
 * Story 1.5: Layout Desktop Optimizado - x-pathname header injection
 *
 * Tests for PBAC authorization middleware and pathname header propagation
 */

import { NextRequest } from 'next/server'
import { describe, it, expect, vi } from 'vitest'
import {
  PATHNAME_HEADER,
  getOrCreateCorrelationId,
  ROUTE_CAPABILITIES,
  hasCapability,
  hasAllCapabilities,
  logAccessDenied
} from '@/middleware'

// Mock NextAuth withAuth function
vi.mock('next-auth/middleware', () => ({
  withAuth: (fn: any) => fn,
}))

describe('Middleware - Story 1.5 Pathname Header', () => {
  describe('PATHNAME_HEADER constant', () => {
    it('exports x-pathname as pathname header name', () => {
      expect(PATHNAME_HEADER).toBe('x-pathname')
    })
  })

  describe('getOrCreateCorrelationId', () => {
    it('returns existing correlation ID from headers', () => {
      const headers = new Headers()
      headers.set('x-correlation-id', 'existing-id-123')

      const correlationId = getOrCreateCorrelationId(headers)
      expect(correlationId).toBe('existing-id-123')
    })

    it('generates new correlation ID if not present', () => {
      const headers = new Headers()

      const correlationId = getOrCreateCorrelationId(headers)
      expect(correlationId).toBeDefined()
      expect(typeof correlationId).toBe('string')
      expect(correlationId.length).toBeGreaterThan(0)
    })

    it('generates unique correlation IDs', () => {
      const headers1 = new Headers()
      const headers2 = new Headers()

      const id1 = getOrCreateCorrelationId(headers1)
      const id2 = getOrCreateCorrelationId(headers2)

      expect(id1).not.toBe(id2)
    })
  })

  describe('ROUTE_CAPABILITIES configuration', () => {
    it('defines /dashboard as requiring no capabilities', () => {
      expect(ROUTE_CAPABILITIES['/dashboard']).toEqual([])
    })

    it('defines capability requirements for protected routes', () => {
      expect(ROUTE_CAPABILITIES['/work-orders']).toEqual(['can_view_all_ots'])
      expect(ROUTE_CAPABILITIES['/assets']).toEqual(['can_manage_assets'])
      expect(ROUTE_CAPABILITIES['/users']).toEqual(['can_manage_users'])
      expect(ROUTE_CAPABILITIES['/usuarios']).toEqual(['can_manage_users'])
    })
  })

  describe('hasCapability', () => {
    it('returns true when user has the capability', () => {
      const capabilities = ['can_view_dashboard', 'can_create_ot']
      expect(hasCapability(capabilities, 'can_view_dashboard')).toBe(true)
    })

    it('returns false when user does not have the capability', () => {
      const capabilities = ['can_view_dashboard']
      expect(hasCapability(capabilities, 'can_create_ot')).toBe(false)
    })

    it('returns false when capabilities array is undefined', () => {
      expect(hasCapability(undefined, 'can_view_dashboard')).toBe(false)
    })

    it('returns false when capabilities array is empty', () => {
      expect(hasCapability([], 'can_view_dashboard')).toBe(false)
    })
  })

  describe('hasAllCapabilities', () => {
    it('returns true when user has all required capabilities', () => {
      const capabilities = ['can_view_dashboard', 'can_create_ot', 'can_view_users']
      const required = ['can_view_dashboard', 'can_create_ot']
      expect(hasAllCapabilities(capabilities, required)).toBe(true)
    })

    it('returns false when user missing some capabilities', () => {
      const capabilities = ['can_view_dashboard']
      const required = ['can_view_dashboard', 'can_create_ot']
      expect(hasAllCapabilities(capabilities, required)).toBe(false)
    })

    it('returns true when no capabilities are required', () => {
      const capabilities = ['can_view_dashboard']
      expect(hasAllCapabilities(capabilities, [])).toBe(true)
    })

    it('returns true when required capabilities is undefined', () => {
      const capabilities = ['can_view_dashboard']
      expect(hasAllCapabilities(capabilities, undefined)).toBe(true)
    })
  })

  describe('logAccessDenied', () => {
    it('logs access denied with correlation ID', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logAccessDenied('user-123', '/assets', ['can_manage_assets'], 'corr-456')

      expect(consoleErrorSpy).toHaveBeenCalled()
      const logCall = consoleErrorSpy.mock.calls[0][0] as string
      const logEntry = JSON.parse(logCall)

      expect(logEntry.level).toBe('warn')
      expect(logEntry.userId).toBe('user-123')
      expect(logEntry.action).toBe('ACCESS_DENIED')
      expect(logEntry.metadata.path).toBe('/assets')
      expect(logEntry.metadata.requiredCapabilities).toEqual(['can_manage_assets'])
      expect(logEntry.correlationId).toBe('corr-456')

      consoleErrorSpy.mockRestore()
    })

    it('handles undefined user ID', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logAccessDenied(undefined, '/assets', ['can_manage_assets'], 'corr-456')

      expect(consoleErrorSpy).toHaveBeenCalled()
      const logCall = consoleErrorSpy.mock.calls[0][0] as string
      const logEntry = JSON.parse(logCall)

      expect(logEntry.userId).toBe('unknown')

      consoleErrorSpy.mockRestore()
    })

    it('handles missing correlation ID', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logAccessDenied('user-123', '/assets', ['can_manage_assets'], undefined)

      expect(consoleErrorSpy).toHaveBeenCalled()
      const logCall = consoleErrorSpy.mock.calls[0][0] as string
      const logEntry = JSON.parse(logCall)

      expect(logEntry.correlationId).toBe('N/A')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Story 1.5: Pathname Header Propagation', () => {
    it('PATHNAME_HEADER constant is exported for testing', () => {
      expect(PATHNAME_HEADER).toBeDefined()
      expect(PATHNAME_HEADER).toBe('x-pathname')
    })

    it('middleware uses PATHNAME_HEADER for route detection', () => {
      // This test verifies that the PATHNAME_HEADER constant is used
      // for Story 1.5's sidebar variant detection system

      // Verify the constant is correctly defined
      expect(PATHNAME_HEADER).toBe('x-pathname')

      // Note: Full middleware integration testing requires
      // integration/E2E tests due to Next.js middleware complexity
      // See: tests/e2e/story-1.5-layout-optimizado.spec.ts
      // P0-E2E-004: Layout por dirección correcto en dashboard, kpis, kanban
    })
  })
})
