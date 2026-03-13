/**
 * Story 1.1: PBAC Route Authorization Tests
 * Testing P0-INT-001
 *
 * Tests cover:
 * - PBAC authorization for user management (P0-INT-001)
 * - Route capability requirements
 * - Access control verification
 */

import { describe, it, expect } from 'vitest'
import {
  ROUTE_CAPABILITIES,
  hasAllCapabilities
} from '@/middleware'
import { adminUserFactory, userFactory } from '../factories/data.factories'
import { setupPBACTests } from './fixtures/pbac-fixtures'

setupPBACTests()

describe('Story 1.1: PBAC Route Authorization', () => {
  describe('[P0-INT-001] PBAC Authorization for User Management', () => {
    it('[P0-INT-001] should grant access to /users route with can_manage_users capability', () => {
      // Given: user with can_manage_users capability
      const adminUser = adminUserFactory({
        email: 'admin@example.com',
        capabilities: [
          'can_manage_users',
          'can_view_kpis'
        ]
      })

      // When: checking if user has required capability for /users route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        adminUser.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual(['can_manage_users'])
    })

    it('[P0-INT-001] should grant access to /dashboard route for any authenticated user', () => {
      // Given: user with basic capabilities
      const user = userFactory({
        email: 'viewer@example.com',
        capabilities: [
          'can_create_failure_report'
        ]
      })

      // When: checking if user has required capability for /dashboard route
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes (dashboard requires no specific capabilities)
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual([]) // No capabilities required for /dashboard
    })

    it('[P0-INT-001] should grant access to /work-orders route with can_view_all_ots capability', () => {
      // Given: user with can_view_all_ots capability
      const technician = userFactory({
        email: 'technician@example.com',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots',
          'can_complete_ot'
        ]
      })

      // When: checking if user has required capability for /work-orders route
      const requiredCapabilities = ROUTE_CAPABILITIES['/work-orders']
      const hasAccess = hasAllCapabilities(
        technician.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual(['can_view_all_ots'])
    })

    it('[P0-INT-001] should grant access when user has all required capabilities', () => {
      // Given: route requiring multiple capabilities
      const customRouteCapabilities = ['can_view_all_ots', 'can_complete_ot']

      // And: user with both capabilities
      const user = userFactory({
        email: 'senior-tech@example.com',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots',
          'can_complete_ot'
        ]
      })

      // When: checking if user has all required capabilities
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        customRouteCapabilities
      )

      // Then: access granted
      expect(hasAccess).toBe(true)
    })

    it('[P0-INT-001] should handle routes with no capability requirements', () => {
      // Given: user with minimal capabilities
      const user = userFactory({
        email: 'basic@example.com',
        capabilities: ['can_create_failure_report']
      })

      // When: checking route with empty capability requirements
      const hasAccess = hasAllCapabilities(user.capabilities, [])

      // Then: access granted (empty requirements = public route)
      expect(hasAccess).toBe(true)
    })
  })
})
