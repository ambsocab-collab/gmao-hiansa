/**
 * Tests para Mock Auth Provider
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Tests para validar los mocks de sesión
 */

import { describe, it, expect } from 'vitest'
import {
  mockSession,
  mockSessionWithCapabilities,
  mockAdminSession,
  mockUseSession
} from '@/tests/mocks/auth'

describe('Mock Auth Provider', () => {
  describe('mockSession', () => {
    it('should create a session with default values', () => {
      const session = mockSession()

      expect(session).toBeDefined()
      expect(session.user).toBeDefined()
      expect(session.user.id).toBe('test-user-id')
      expect(session.user.email).toBe('test@example.com')
      expect(session.user.name).toBe('Test User')
      expect(session.user.capabilities).toEqual(['can_view_kpis'])
      expect(session.expires).toBe('2099-12-31')
    })

    it('should override default values when provided', () => {
      const session = mockSession({
        id: 'custom-user-id',
        email: 'custom@example.com'
      })

      expect(session.user.id).toBe('custom-user-id')
      expect(session.user.email).toBe('custom@example.com')
      expect(session.user.name).toBe('Test User') // Default value preserved
    })

    it('should allow empty capabilities', () => {
      const session = mockSession({ capabilities: [] })

      expect(session.user.capabilities).toEqual([])
    })
  })

  describe('mockSessionWithCapabilities', () => {
    it('should create session with specified capabilities', () => {
      const capabilities = ['can_view_kpis', 'can_create_failure_report']
      const session = mockSessionWithCapabilities(capabilities)

      expect(session.user.capabilities).toEqual(capabilities)
    })

    it('should handle single capability', () => {
      const session = mockSessionWithCapabilities(['can_manage_users'])

      expect(session.user.capabilities).toEqual(['can_manage_users'])
    })
  })

  describe('mockAdminSession', () => {
    it('should create session with all 15 capabilities', () => {
      const session = mockAdminSession()

      expect(session.user.id).toBe('admin-user-id')
      expect(session.user.email).toBe('admin@example.com')
      expect(session.user.name).toBe('Admin User')
      expect(session.user.capabilities).toHaveLength(15)
    })

    it('should include all expected capabilities', () => {
      const session = mockAdminSession()

      expect(session.user.capabilities).toContain('can_create_failure_report')
      expect(session.user.capabilities).toContain('can_create_manual_ot')
      expect(session.user.capabilities).toContain('can_update_own_ot')
      expect(session.user.capabilities).toContain('can_view_own_ots')
      expect(session.user.capabilities).toContain('can_view_all_ots')
      expect(session.user.capabilities).toContain('can_complete_ot')
      expect(session.user.capabilities).toContain('can_manage_stock')
      expect(session.user.capabilities).toContain('can_assign_technicians')
      expect(session.user.capabilities).toContain('can_view_kpis')
      expect(session.user.capabilities).toContain('can_manage_assets')
      expect(session.user.capabilities).toContain('can_view_repair_history')
      expect(session.user.capabilities).toContain('can_manage_providers')
      expect(session.user.capabilities).toContain('can_manage_routines')
      expect(session.user.capabilities).toContain('can_manage_users')
      expect(session.user.capabilities).toContain('can_receive_reports')
    })
  })

  describe('mockUseSession', () => {
    it('should return authenticated session by default', () => {
      const result = mockUseSession()

      expect(result.status).toBe('authenticated')
      expect(result.data).toBeDefined()
      expect(result.update).toBeInstanceOf(Function)
      expect(result.refresh).toBeInstanceOf(Function)
    })

    it('should use custom session when provided', () => {
      const customSession = mockSession({ id: 'custom-id' })
      const result = mockUseSession(customSession)

      expect(result.data?.user.id).toBe('custom-id')
    })
  })
})
