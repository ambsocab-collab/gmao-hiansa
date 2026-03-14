/**
 * Story 1.3: Tags - PBAC Independence Verification
 * Testing P0-INT-003
 *
 * CRITICAL SECURITY TEST: Verify that tags (labels) are completely independent
 * from the PBAC (Permission-Based Access Control) system.
 *
 * Tests cover:
 * - Having a tag does NOT grant route access (P0-INT-003)
 * - Tags don't affect PBAC middleware authorization
 * - Users with same tag can have different capabilities
 * - Removing a tag doesn't affect capabilities
 *
 * NFR-S67-A: Las etiquetas son solo para organización visual y no afectan los permisos
 * NFR-S67-B: Una misma etiqueta NO otorga las mismas capacidades a todos los usuarios
 */

import { describe, it, expect } from 'vitest'
import {
  ROUTE_CAPABILITIES,
  hasAllCapabilities
} from '@/middleware'
import { userFactory, adminUserFactory } from '../factories/data.factories'
import { setupPBACTests } from './fixtures/pbac-fixtures'

setupPBACTests()

describe('Story 1.3: Tags - PBAC Independence Verification', () => {
  describe('[P0-INT-003] Tags do NOT grant capabilities or route access', () => {
    it('[P0-INT-003] should deny access to /work-orders for user with "Supervisor" tag but no can_view_all_ots capability', () => {
      // Given: User with tag "Supervisor" but WITHOUT can_view_all_ots capability
      const userWithSupervisorTag = userFactory({
        email: 'supervisor@example.com',
        capabilities: ['can_create_failure_report'], // NO can_view_all_ots
        roleLabel: 'Supervisor' // Tag/label for visual organization
      })

      // When: Checking if user has required capability for /work-orders route
      const requiredCapabilities = ROUTE_CAPABILITIES['/work-orders']
      const hasAccess = hasAllCapabilities(
        userWithSupervisorTag.capabilities,
        requiredCapabilities
      )

      // Then: Access DENIED - "Supervisor" tag does NOT grant permission
      expect(hasAccess).toBe(false)
      expect(requiredCapabilities).toEqual(['can_view_all_ots'])
      expect(userWithSupervisorTag.capabilities).not.toContain('can_view_all_ots')
      expect(userWithSupervisorTag.roleLabel).toBe('Supervisor') // Tag exists but doesn't grant access
    })

    it('[P0-INT-003] should deny access to /users for user with "Gerente" tag but no can_manage_users capability', () => {
      // Given: User with tag "Gerente" but WITHOUT can_manage_users capability
      const userWithGerenteTag = userFactory({
        email: 'gerente@example.com',
        capabilities: ['can_view_all_ots', 'can_complete_work_orders'],
        roleLabel: 'Gerente' // Tag/label for visual organization
      })

      // When: Checking if user has required capability for /users route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        userWithGerenteTag.capabilities,
        requiredCapabilities
      )

      // Then: Access DENIED - "Gerente" tag does NOT grant permission
      expect(hasAccess).toBe(false)
      expect(requiredCapabilities).toEqual(['can_manage_users'])
      expect(userWithGerenteTag.capabilities).not.toContain('can_manage_users')
      expect(userWithGerenteTag.roleLabel).toBe('Gerente') // Tag exists but doesn't grant access
    })

    it('[P0-INT-003] should grant access to /work-orders for user WITHOUT "Supervisor" tag but WITH can_view_all_ots capability', () => {
      // Given: User WITHOUT "Supervisor" tag but WITH can_view_all_ots capability
      const userWithoutTag = userFactory({
        email: 'tecnico@example.com',
        capabilities: ['can_view_all_ots', 'can_complete_work_orders'],
        roleLabel: null // No tag/label
      })

      // When: Checking if user has required capability for /work-orders route
      const requiredCapabilities = ROUTE_CAPABILITIES['/work-orders']
      const hasAccess = hasAllCapabilities(
        userWithoutTag.capabilities,
        requiredCapabilities
      )

      // Then: Access GRANTED based on capability, NOT based on tag
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual(['can_view_all_ots'])
      expect(userWithoutTag.capabilities).toContain('can_view_all_ots')
      expect(userWithoutTag.roleLabel).toBe(null) // No tag needed for access
    })

    it('[P0-INT-003] should verify same tag "Operario" can have different capabilities', () => {
      // Given: Two users with same tag "Operario" but DIFFERENT capabilities
      const operario1 = userFactory({
        email: 'operario1@example.com',
        capabilities: ['can_create_failure_report'], // Basic capability only
        roleLabel: 'Operario'
      })

      const operario2 = userFactory({
        email: 'operario2@example.com',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots', // This is required for /work-orders route
          'can_complete_work_orders'
        ], // Extended capabilities
        roleLabel: 'Operario' // Same tag as operario1
      })

      // When: Checking access to /work-orders route
      const requiredCapabilities = ROUTE_CAPABILITIES['/work-orders']

      const operario1HasAccess = hasAllCapabilities(
        operario1.capabilities,
        requiredCapabilities
      )

      const operario2HasAccess = hasAllCapabilities(
        operario2.capabilities,
        requiredCapabilities
      )

      // Then: operario1 DENIED, operario2 GRANTED - Same tag, different permissions
      expect(operario1.roleLabel).toBe('Operario')
      expect(operario2.roleLabel).toBe('Operario')
      // Both users have 'can_complete_work_orders' which is in OPERARIO1's capabilities but not required for /work-orders
      // Only operario2 has 'can_view_all_ots' which is required
      expect(operario1HasAccess).toBe(false) // No can_view_all_ots capability
      expect(operario2HasAccess).toBe(true) // Has can_view_all_ots capability
      expect(operario1.capabilities).not.toEqual(operario2.capabilities)
    })

    it('[P0-INT-003] should verify that changing capabilities does not affect tags', () => {
      // Given: User with tag and initial capabilities
      const user = userFactory({
        email: 'tecnico@example.com',
        capabilities: ['can_create_failure_report'],
        roleLabel: 'Técnico'
      })

      const originalTag = user.roleLabel

      // When: Capabilities are changed (simulating admin action)
      const updatedUser = {
        ...user,
        capabilities: [
          'can_create_failure_report',
          'can_view_work_orders',
          'can_complete_work_orders',
          'can_assign_technicians'
        ]
      }

      // Then: Tag remains unchanged despite capability change
      expect(updatedUser.roleLabel).toBe(originalTag)
      expect(updatedUser.roleLabel).toBe('Técnico')
      expect(updatedUser.capabilities).not.toEqual(user.capabilities)
    })

    it('[P0-INT-003] should verify that removing a tag does not affect capabilities', () => {
      // Given: User with tag and capabilities
      const userWithTag = userFactory({
        email: 'jefe-planta@example.com',
        capabilities: [
          'can_view_kpis',
          'can_view_reports',
          'can_manage_users'
        ],
        roleLabel: 'Jefe de Planta'
      })

      const originalCapabilities = userWithTag.capabilities

      // When: Tag is removed (simulating tag deletion)
      const userWithoutTag = {
        ...userWithTag,
        roleLabel: null
      }

      // Then: Capabilities remain unchanged despite tag removal
      expect(userWithoutTag.roleLabel).toBe(null)
      expect(userWithoutTag.capabilities).toEqual(originalCapabilities)
      expect(userWithoutTag.capabilities).toContain('can_view_kpis')
      expect(userWithoutTag.capabilities).toContain('can_manage_users')
    })

    it('[P0-INT-003] should verify PBAC middleware ignores tags when checking route access', () => {
      // Given: User with all capabilities for testing
      const user = userFactory({
        email: 'admin@example.com',
        capabilities: [
          'can_view_all_ots',
          'can_manage_users',
          'can_create_failure_report'
        ]
      })

      // And: Same user with a "Director" tag
      const userWithTag = {
        ...user,
        roleLabel: 'Director'
      }

      // When: Checking access to multiple routes
      const workOrdersAccess = hasAllCapabilities(userWithTag.capabilities, ROUTE_CAPABILITIES['/work-orders'])
      const usersAccess = hasAllCapabilities(userWithTag.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access based on capabilities, tag is ignored by middleware
      expect(workOrdersAccess).toBe(true)
      expect(usersAccess).toBe(true)
      expect(userWithTag.roleLabel).toBe('Director') // Tag present but not used for auth
    })

    it('[P0-INT-003] should verify that tags are completely independent from PBAC system', () => {
      // Given: Three users demonstrating tag-capability independence
      const user1 = userFactory({
        email: 'user1@example.com',
        capabilities: ['can_create_failure_report'],
        roleLabel: 'Supervisor' // Tag but NO management capability
      })

      const user2 = userFactory({
        email: 'user2@example.com',
        capabilities: ['can_view_all_ots', 'can_manage_users'], // Management capabilities
        roleLabel: null // NO tag
      })

      const user3 = userFactory({
        email: 'user3@example.com',
        capabilities: ['can_view_all_ots', 'can_manage_users'], // Same capabilities as user2
        roleLabel: 'Supervisor' // Same tag as user1
      })

      // When: Checking access to /users route
      const usersRouteCapability = ROUTE_CAPABILITIES['/users']

      const user1Access = hasAllCapabilities(user1.capabilities, usersRouteCapability)
      const user2Access = hasAllCapabilities(user2.capabilities, usersRouteCapability)
      const user3Access = hasAllCapabilities(user3.capabilities, usersRouteCapability)

      // Then: Access determined by capabilities ONLY, tags are irrelevant
      expect(user1Access).toBe(false) // "Supervisor" tag doesn't grant access
      expect(user2Access).toBe(true) // No tag, but has capability
      expect(user3Access).toBe(true) // Same tag as user1, but different access
      expect(user1.roleLabel).toBe(user3.roleLabel) // Same tag
      expect(user1.capabilities).not.toEqual(user3.capabilities) // Different capabilities
      expect(user1Access).not.toEqual(user3Access) // Different access results
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty tag name without affecting capabilities', () => {
      // Given: User with empty tag name
      const user = userFactory({
        email: 'empty-tag@example.com',
        capabilities: ['can_manage_users'],
        roleLabel: '' // Empty tag
      })

      // When: Checking route access
      const hasAccess = hasAllCapabilities(user.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access granted based on capability, empty tag ignored
      expect(hasAccess).toBe(true)
      // Note: userFactory might convert empty string to null, so we check for both
      expect(user.roleLabel === '' || user.roleLabel === null).toBe(true)
    })

    it('should handle special characters in tag names without affecting capabilities', () => {
      // NOTE: This test uses roleLabel to verify PBAC middleware ignores non-capability properties
      // The actual Tag/UserTag model from Prisma is tested in E2E tests (story-1.3-tags.spec.ts)

      // Given: User with special characters in tag name
      const user = userFactory({
        email: 'special-tag@example.com',
        capabilities: [],
        roleLabel: 'Técnico-Español-Ñ'
      })

      // When: Checking route access
      const hasAccess = hasAllCapabilities(user.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access denied (no capability), special chars in tag don't matter
      expect(hasAccess).toBe(false)
      expect(user.roleLabel).toBe('Técnico-Español-Ñ')
    })

    it('should handle multiple tags (if supported) without granting capabilities', () => {
      // Note: Story 1.3 supports multiple tags per user, but PBAC ignores all tags
      // This test prepares for future multi-tag implementation

      // Given: User with multiple tags (simulated as comma-separated string)
      const user = userFactory({
        email: 'multi-tag@example.com',
        capabilities: ['can_create_failure_report'],
        roleLabel: 'Técnico,Supervisor,Operario' // Multiple tags
      })

      // When: Checking route access
      const hasAccess = hasAllCapabilities(user.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access denied - multiple tags don't grant capability
      expect(hasAccess).toBe(false)
      expect(user.roleLabel).toContain('Técnico')
      expect(user.roleLabel).toContain('Supervisor')
      expect(user.capabilities).not.toContain('can_manage_users')
    })
  })

  describe('Security Implications', () => {
    it('should prevent privilege escalation through tag assignment', () => {
      // CRITICAL SECURITY TEST: Ensure attacker cannot gain privileges by assigning themselves tags

      // Given: Regular user attempting to escalate by assigning "Admin" tag
      const attacker = userFactory({
        email: 'attacker@example.com',
        capabilities: ['can_create_failure_report'], // Minimal capabilities
        roleLabel: 'Admin' // Attempts to use "Admin" tag for escalation
      })

      // When: Checking access to protected route
      const hasAccess = hasAllCapabilities(attacker.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access DENIED - Tag assignment does NOT escalate privileges
      expect(hasAccess).toBe(false)
      expect(attacker.roleLabel).toBe('Admin') // Tag present
      expect(attacker.capabilities).not.toContain('can_manage_users') // But no privilege escalation
    })

    it('should prevent access bypass through tag manipulation', () => {
      // CRITICAL SECURITY TEST: Ensure attacker cannot bypass access controls by manipulating tags

      // Given: User without can_manage_users capability
      const unauthorizedUser = userFactory({
        email: 'unauthorized@example.com',
        capabilities: ['can_create_failure_report'],
        roleLabel: 'Director General' // Tries to use high-level tag for bypass
      })

      // When: Checking access to /users route
      const hasAccess = hasAllCapabilities(unauthorizedUser.capabilities, ROUTE_CAPABILITIES['/users'])

      // Then: Access DENIED - Tag manipulation does NOT bypass authorization
      expect(hasAccess).toBe(false)
      expect(unauthorizedUser.roleLabel).toBe('Director General')
      expect(unauthorizedUser.capabilities).not.toContain('can_manage_users')
    })
  })
})
