/**
 * Story 1.1: PBAC Access Denial Tests
 * Testing P0-INT-002
 *
 * Tests cover:
 * - Access denial without required capability (P0-INT-002)
 * - Partial capability scenarios
 * - Empty capability handling
 */

import { describe, it, expect } from 'vitest'
import {
  ROUTE_CAPABILITIES,
  hasAllCapabilities
} from '@/middleware'
import { userFactory } from '../factories/data.factories'
import { setupPBACTests } from './fixtures/pbac-fixtures'

setupPBACTests()

describe('Story 1.1: PBAC Access Denial', () => {
  describe('[P0-INT-002] Access Denial Without Required Capability', () => {
    it('[P0-INT-002] should deny access to /users route without can_manage_users capability', () => {
      // Given: user without can_manage_users capability
      const regularUser = userFactory({
        email: 'user@example.com',
        capabilities: ['can_create_failure_report'] // Missing can_manage_users
      })

      // When: checking if user has required capability for /users route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        regularUser.capabilities,
        requiredCapabilities
      )

      // Then: capability check fails
      expect(hasAccess).toBe(false)
      expect(requiredCapabilities).toEqual(['can_manage_users'])
    })

    it('[P0-INT-002] should grant access to /dashboard for any authenticated user (even with minimal capabilities)', () => {
      // Given: user with only basic capability
      const user = userFactory({
        email: 'basic@example.com',
        capabilities: ['can_create_failure_report'] // Minimal capability set
      })

      // When: checking if user has required capability for /dashboard route
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes (dashboard requires no specific capabilities)
      expect(hasAccess).toBe(true) // Changed from false to true
      expect(requiredCapabilities).toEqual([]) // No capabilities required
    })

    it('[P0-INT-002] should allow /dashboard access even with undefined capabilities (capability check only)', () => {
      // Given: unauthenticated user (undefined capabilities)
      const undefinedCapabilities = undefined

      // When: checking if user has required capability for /dashboard route
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        undefinedCapabilities,
        requiredCapabilities
      )

      // Then: capability check passes (dashboard requires no capabilities)
      // Note: Authentication is checked separately in middleware, not by hasAllCapabilities
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual([])
    })

    it('[P0-INT-002] should deny access when user has only some required capabilities', () => {
      // Given: route requiring multiple capabilities
      const customRouteCapabilities = ['can_view_all_ots', 'can_complete_ot']

      // And: user with only one of the required capabilities
      const user = userFactory({
        email: 'junior-tech@example.com',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots' // Missing can_complete_ot
        ]
      })

      // When: checking if user has all required capabilities
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        customRouteCapabilities
      )

      // Then: access denied (missing one capability)
      expect(hasAccess).toBe(false)
    })

    it('[P0-INT-002] should deny access when user has no capabilities', () => {
      // Given: user with empty capabilities array
      const user = userFactory({
        email: 'no-caps@example.com',
        capabilities: []
      })

      // When: checking any protected route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        requiredCapabilities
      )

      // Then: access denied
      expect(hasAccess).toBe(false)
    })

    it('[P0-INT-002] should allow /dashboard access with undefined capabilities (capability check only)', () => {
      // Given: user with undefined capabilities (not authenticated)
      const undefinedCapabilities = undefined

      // When: checking /dashboard route
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        undefinedCapabilities,
        requiredCapabilities
      )

      // Then: capability check passes (dashboard requires no capabilities)
      // Note: Authentication is checked separately in middleware, not by hasAllCapabilities
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual([])
    })
  })
})
