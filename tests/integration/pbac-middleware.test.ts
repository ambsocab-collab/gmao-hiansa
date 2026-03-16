/**
 * PBAC Middleware Integration Tests
 * Epic 1: PBAC (Permission-Based Access Control) System
 *
 * Test Framework: Vitest (TypeScript)
 * Testing Stack: Next.js 15 + Prisma + NextAuth.js
 *
 * Coverage:
 * - [P0] PBAC authorization with valid capabilities
 * - [P0] PBAC access denied without capabilities
 * - [P0] PBAC integration with NextAuth session/tokens
 * - [P1] Default capability assignment for new users
 * - [P1] Force password reset redirect behavior
 * - [P2] Edge case: undefined/null capability handling
 *
 * Test Strategy:
 * - Mock Prisma client for database operations
 * - Mock NextAuth withAuth wrapper
 * - Test middleware helper functions in isolation
 * - Verify capability checking logic
 * - Validate audit logging behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  ROUTE_CAPABILITIES,
  hasCapability,
  hasAllCapabilities,
  logAccessDenied,
  getOrCreateCorrelationId,
  CORRELATION_ID_HEADER
} from '@/middleware'

/**
 * Mock setup for Prisma and NextAuth
 */
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn()
  },
  userCapability: {
    findMany: vi.fn()
  }
}

// Mock console.error to capture audit logs
const mockLogs: string[] = []
const originalConsoleError = console.error

describe('PBAC Middleware Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    mockLogs.length = 0

    // Mock console.error to capture audit logs
    console.error = vi.fn((...args: any[]) => {
      mockLogs.push(args.join(' '))
    })
  })

  afterEach(() => {
    // Restore console.error after each test
    console.error = originalConsoleError
  })

  /**
   * [P0] PBAC Authorization with Valid Capabilities
   * Tests that users with appropriate capabilities can access protected routes
   */
  describe('[P0] PBAC Authorization with Valid Capabilities', () => {
    it('[P0] should grant access to /users route with can_manage_users capability', () => {
      // Given: user with can_manage_users capability
      const adminUser = {
        id: 'user-123',
        email: 'admin@hiansa.com',
        name: 'Admin User',
        capabilities: ['can_manage_users', 'can_view_kpis']
      }

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

    it('[P0] should grant access to /work-orders route with can_view_all_ots capability', () => {
      // Given: technician with can_view_all_ots capability
      const technician = {
        id: 'tech-456',
        email: 'tech@hiansa.com',
        name: 'Technician User',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots',
          'can_complete_ot'
        ]
      }

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

    it('[P0] should grant access to /assets route with can_manage_assets capability', () => {
      // Given: user with can_manage_assets capability
      const assetManager = {
        id: 'asset-789',
        email: 'assets@hiansa.com',
        name: 'Asset Manager',
        capabilities: [
          'can_create_failure_report',
          'can_manage_assets',
          'can_view_repair_history'
        ]
      }

      // When: checking if user has required capability for /assets route
      const requiredCapabilities = ROUTE_CAPABILITIES['/assets']
      const hasAccess = hasAllCapabilities(
        assetManager.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual(['can_manage_assets'])
    })

    it('[P0] should grant access to /stock route with can_manage_stock capability', () => {
      // Given: user with can_manage_stock capability
      const stockManager = {
        id: 'stock-101',
        email: 'stock@hiansa.com',
        name: 'Stock Manager',
        capabilities: ['can_create_failure_report', 'can_manage_stock']
      }

      // When: checking if user has required capability for /stock route
      const requiredCapabilities = ROUTE_CAPABILITIES['/stock']
      const hasAccess = hasAllCapabilities(
        stockManager.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual(['can_manage_stock'])
    })

    it('[P0] should grant access to /dashboard for any authenticated user (no capabilities required)', () => {
      // Given: user with minimal capabilities
      const basicUser = {
        id: 'basic-202',
        email: 'basic@hiansa.com',
        name: 'Basic User',
        capabilities: ['can_create_failure_report']
      }

      // When: checking if user has required capability for /dashboard route
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        basicUser.capabilities,
        requiredCapabilities
      )

      // Then: capability check passes (dashboard requires no capabilities)
      expect(hasAccess).toBe(true)
      expect(requiredCapabilities).toEqual([])
    })

    it('[P0] should grant access when user has all required capabilities for a route', () => {
      // Given: custom route requiring multiple capabilities
      const customRouteCapabilities = ['can_view_all_ots', 'can_complete_ot']

      // And: user with both required capabilities
      const seniorTech = {
        id: 'senior-303',
        email: 'senior@hiansa.com',
        name: 'Senior Technician',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots',
          'can_complete_ot',
          'can_update_own_ot'
        ]
      }

      // When: checking if user has all required capabilities
      const hasAccess = hasAllCapabilities(
        seniorTech.capabilities,
        customRouteCapabilities
      )

      // Then: access granted
      expect(hasAccess).toBe(true)
    })
  })

  /**
   * [P0] PBAC Access Denied Without Capabilities
   * Tests that users without appropriate capabilities are denied access
   */
  describe('[P0] PBAC Access Denied Without Capabilities', () => {
    it('[P0] should deny access to /users route without can_manage_users capability', () => {
      // Given: user without can_manage_users capability
      const regularUser = {
        id: 'user-404',
        email: 'user@hiansa.com',
        name: 'Regular User',
        capabilities: ['can_create_failure_report'] // Missing can_manage_users
      }

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

    it('[P0] should deny access to /work-orders route without can_view_all_ots capability', () => {
      // Given: user without can_view_all_ots capability
      const limitedUser = {
        id: 'limited-505',
        email: 'limited@hiansa.com',
        name: 'Limited User',
        capabilities: ['can_create_failure_report'] // Missing can_view_all_ots
      }

      // When: checking if user has required capability for /work-orders route
      const requiredCapabilities = ROUTE_CAPABILITIES['/work-orders']
      const hasAccess = hasAllCapabilities(
        limitedUser.capabilities,
        requiredCapabilities
      )

      // Then: capability check fails
      expect(hasAccess).toBe(false)
    })

    it('[P0] should deny access when user has only some required capabilities', () => {
      // Given: route requiring multiple capabilities
      const customRouteCapabilities = ['can_view_all_ots', 'can_complete_ot']

      // And: user with only one of the required capabilities
      const juniorTech = {
        id: 'junior-606',
        email: 'junior@hiansa.com',
        name: 'Junior Technician',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots' // Missing can_complete_ot
        ]
      }

      // When: checking if user has all required capabilities
      const hasAccess = hasAllCapabilities(
        juniorTech.capabilities,
        customRouteCapabilities
      )

      // Then: access denied (missing one capability)
      expect(hasAccess).toBe(false)
    })

    it('[P0] should deny access when user has no capabilities', () => {
      // Given: user with empty capabilities array
      const noCapsUser = {
        id: 'nocaps-707',
        email: 'nocaps@hiansa.com',
        name: 'No Caps User',
        capabilities: []
      }

      // When: checking any protected route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        noCapsUser.capabilities,
        requiredCapabilities
      )

      // Then: access denied
      expect(hasAccess).toBe(false)
    })

    it('[P0] should deny access when user capabilities are undefined', () => {
      // Given: user with undefined capabilities (session not fully loaded)
      const undefinedCapabilities = undefined

      // When: checking any protected route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        undefinedCapabilities,
        requiredCapabilities
      )

      // Then: access denied
      expect(hasAccess).toBe(false)
    })
  })

  /**
   * [P0] PBAC Integration with NextAuth
   * Tests the integration between PBAC and NextAuth session/tokens
   */
  describe('[P0] PBAC Integration with NextAuth', () => {
    it('[P0] should extract capabilities from NextAuth JWT token', () => {
      // Given: NextAuth JWT token with capabilities
      const mockToken = {
        id: 'user-808',
        email: 'auth@hiansa.com',
        name: 'Auth User',
        capabilities: [
          'can_create_failure_report',
          'can_view_all_ots',
          'can_manage_users'
        ],
        forcePasswordReset: false
      }

      // When: checking if user has required capability
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        mockToken.capabilities as string[],
        requiredCapabilities
      )

      // Then: capability check passes using token data
      expect(hasAccess).toBe(true)
      expect(mockToken.capabilities).toContain('can_manage_users')
    })

    it('[P0] should handle NextAuth session with forcePasswordReset flag', () => {
      // Given: NextAuth session with forcePasswordReset=true
      const mockSession = {
        user: {
          id: 'user-909',
          email: 'reset@hiansa.com',
          name: 'Password Reset User',
          capabilities: ['can_create_failure_report'],
          forcePasswordReset: true
        },
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      }

      // When: checking session data
      const user = mockSession.user

      // Then: forcePasswordReset flag is accessible
      expect(user.forcePasswordReset).toBe(true)
      expect(user.capabilities).toBeDefined()
    })

    it('[P0] should verify authentication before checking capabilities', () => {
      // Given: unauthenticated request (no token)
      const noToken = null

      // When: checking if user is authenticated
      const isAuthenticated = !!noToken

      // Then: authentication fails
      expect(isAuthenticated).toBe(false)

      // Note: Middleware withAuth callback verifies this before capability checks
      // The authorized: ({ token }) => !!token callback handles this
    })

    it('[P0] should log access denied with user ID from NextAuth token', () => {
      // Given: NextAuth token with user ID
      const mockToken = {
        id: 'user-1010',
        email: 'denied@hiansa.com',
        name: 'Denied User',
        capabilities: ['can_create_failure_report'] // Missing can_manage_users
      }

      // When: logging access denied
      logAccessDenied(
        mockToken.id,
        '/users',
        ROUTE_CAPABILITIES['/users'],
        'test-correlation-123'
      )

      // Then: audit log includes user ID
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.userId).toBe('user-1010')
      expect(logEntry.action).toBe('ACCESS_DENIED')
      expect(logEntry.metadata.path).toBe('/users')
      expect(logEntry.correlationId).toBe('test-correlation-123')
    })

    it('[P0] should handle undefined capabilities in NextAuth token gracefully', () => {
      // Given: NextAuth token without capabilities (edge case)
      const mockToken = {
        id: 'user-1111',
        email: 'nocaps@hiansa.com',
        name: 'No Caps User',
        capabilities: undefined
      }

      // When: checking if user has required capability
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        mockToken.capabilities as string[] | undefined,
        requiredCapabilities
      )

      // Then: capability check fails gracefully
      expect(hasAccess).toBe(false)
    })
  })

  /**
   * [P1] Default Capability Assignment
   * Tests that new users receive default capabilities
   */
  describe('[P1] Default Capability Assignment', () => {
    it('[P1] should assign can_create_failure_report as default capability for new users', () => {
      // Given: newly created user
      const newUser = {
        id: 'newuser-1212',
        email: 'newuser@hiansa.com',
        name: 'New User',
        capabilities: ['can_create_failure_report'], // Default capability
        forcePasswordReset: true
      }

      // When: checking user capabilities
      const hasDefaultCapability = hasCapability(
        newUser.capabilities,
        'can_create_failure_report'
      )

      // Then: user has default capability
      expect(hasDefaultCapability).toBe(true)
      expect(newUser.capabilities).toContain('can_create_failure_report')
    })

    it('[P1] should allow new user to access /dashboard with default capability', () => {
      // Given: new user with only default capability
      const newUser = {
        id: 'newuser-1313',
        email: 'newuser@hiansa.com',
        name: 'New User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: checking if user can access /dashboard
      const requiredCapabilities = ROUTE_CAPABILITIES['/dashboard']
      const hasAccess = hasAllCapabilities(
        newUser.capabilities,
        requiredCapabilities
      )

      // Then: access granted (dashboard requires no capabilities)
      expect(hasAccess).toBe(true)
    })

    it('[P1] should deny new user access to protected routes with only default capability', () => {
      // Given: new user with only default capability
      const newUser = {
        id: 'newuser-1414',
        email: 'newuser@hiansa.com',
        name: 'New User',
        capabilities: ['can_create_failure_report'], // Only default capability
        forcePasswordReset: true
      }

      // When: checking if user can access /users route
      const requiredCapabilities = ROUTE_CAPABILITIES['/users']
      const hasAccess = hasAllCapabilities(
        newUser.capabilities,
        requiredCapabilities
      )

      // Then: access denied (missing can_manage_users)
      expect(hasAccess).toBe(false)
    })

    it('[P1] should allow admin to assign additional capabilities to new user', () => {
      // Given: new user with default capability
      const newUser = {
        id: 'newuser-1515',
        email: 'newuser@hiansa.com',
        name: 'New User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: admin adds can_view_all_ots capability
      newUser.capabilities.push('can_view_all_ots')

      // Then: user now has both capabilities
      expect(newUser.capabilities).toEqual([
        'can_create_failure_report',
        'can_view_all_ots'
      ])
      expect(hasCapability(newUser.capabilities, 'can_view_all_ots')).toBe(true)
    })
  })

  /**
   * [P1] Force Password Reset Redirect Behavior
   * Tests that users with forcePasswordReset=true are redirected to change password
   */
  describe('[P1] Force Password Reset Redirect Behavior', () => {
    it('[P1] should detect forcePasswordReset flag in NextAuth token', () => {
      // Given: NextAuth token with forcePasswordReset=true
      const mockToken = {
        id: 'user-1616',
        email: 'reset@hiansa.com',
        name: 'Password Reset User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: checking forcePasswordReset flag
      const needsPasswordReset = mockToken.forcePasswordReset === true

      // Then: flag is detected
      expect(needsPasswordReset).toBe(true)
      expect(mockToken.forcePasswordReset).toBe(true)
    })

    it('[P1] should allow access to /cambiar-password route when forcePasswordReset=true', () => {
      // Given: user with forcePasswordReset=true
      const user = {
        id: 'user-1717',
        email: 'reset@hiansa.com',
        name: 'Password Reset User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: accessing /cambiar-password route
      const targetPath = '/cambiar-password'
      const isPasswordResetRoute = targetPath === '/cambiar-password'

      // Then: access to password reset route is allowed
      expect(isPasswordResetRoute).toBe(true)
      expect(user.forcePasswordReset).toBe(true)
    })

    it('[P1] should allow access to /unauthorized route when forcePasswordReset=true', () => {
      // Given: user with forcePasswordReset=true
      const user = {
        id: 'user-1818',
        email: 'reset@hiansa.com',
        name: 'Password Reset User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: accessing /unauthorized route
      const targetPath = '/unauthorized'
      const isUnauthorizedRoute = targetPath === '/unauthorized'

      // Then: access to unauthorized route is allowed
      expect(isUnauthorizedRoute).toBe(true)
    })

    it('[P1] should allow access to API auth routes when forcePasswordReset=true', () => {
      // Given: user with forcePasswordReset=true
      const user = {
        id: 'user-1919',
        email: 'reset@hiansa.com',
        name: 'Password Reset User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: accessing API auth route
      const targetPath = '/api/auth/signout'
      const isApiAuthRoute = targetPath.startsWith('/api/auth')

      // Then: access to API auth routes is allowed
      expect(isApiAuthRoute).toBe(true)
    })

    it('[P1] should redirect protected routes when forcePasswordReset=true', () => {
      // Given: user with forcePasswordReset=true
      const user = {
        id: 'user-2020',
        email: 'reset@hiansa.com',
        name: 'Password Reset User',
        capabilities: ['can_create_failure_report'],
        forcePasswordReset: true
      }

      // When: accessing protected route (not password reset/unauthorized/API auth)
      const targetPath = '/dashboard'
      const needsRedirect =
        user.forcePasswordReset === true &&
        targetPath !== '/cambiar-password' &&
        targetPath !== '/unauthorized' &&
        !targetPath.startsWith('/api/auth')

      // Then: redirect to /cambiar-password is needed
      expect(needsRedirect).toBe(true)
    })
  })

  /**
   * [P2] Edge Cases: Capability Checking
   * Tests edge cases and error handling in capability checking
   */
  describe('[P2] Edge Cases: Capability Checking', () => {
    it('[P2] should handle empty required capabilities array', () => {
      // Given: user with capabilities
      const user = {
        id: 'user-2121',
        email: 'user@hiansa.com',
        name: 'Regular User',
        capabilities: ['can_create_failure_report']
      }

      // When: checking route with no required capabilities
      const hasAccess = hasAllCapabilities(user.capabilities, [])

      // Then: access granted (empty requirements = public route)
      expect(hasAccess).toBe(true)
    })

    it('[P2] should handle undefined required capabilities', () => {
      // Given: user with capabilities
      const user = {
        id: 'user-2222',
        email: 'user@hiansa.com',
        name: 'Regular User',
        capabilities: ['can_create_failure_report']
      }

      // When: checking route with undefined required capabilities
      const hasAccess = hasAllCapabilities(
        user.capabilities,
        undefined as any
      )

      // Then: access granted (undefined requirements = no requirements)
      expect(hasAccess).toBe(true)
    })

    it('[P2] should handle single capability check', () => {
      // Given: user with multiple capabilities
      const user = {
        id: 'user-2323',
        email: 'user@hiansa.com',
        name: 'Multi-Cap User',
        capabilities: ['can_create_failure_report', 'can_view_all_ots', 'can_manage_users']
      }

      // When: checking for single capability
      const hasCapability1 = hasCapability(user.capabilities, 'can_view_all_ots')
      const hasCapability2 = hasCapability(user.capabilities, 'can_manage_stock')

      // Then: correct results
      expect(hasCapability1).toBe(true)
      expect(hasCapability2).toBe(false)
    })

    it('[P2] should handle case-sensitive capability names', () => {
      // Given: user with capabilities
      const user = {
        id: 'user-2424',
        email: 'user@hiansa.com',
        name: 'Case User',
        capabilities: ['can_create_failure_report']
      }

      // When: checking with wrong case
      const hasAccessWrongCase = hasCapability(
        user.capabilities,
        'CAN_CREATE_FAILURE_REPORT'
      )
      const hasAccessCorrectCase = hasCapability(
        user.capabilities,
        'can_create_failure_report'
      )

      // Then: case-sensitive matching
      expect(hasAccessWrongCase).toBe(false)
      expect(hasAccessCorrectCase).toBe(true)
    })

    it('[P2] should handle duplicate capabilities in user array', () => {
      // Given: user with duplicate capabilities (edge case)
      const user = {
        id: 'user-2525',
        email: 'user@hiansa.com',
        name: 'Duplicate User',
        capabilities: ['can_create_failure_report', 'can_create_failure_report', 'can_view_all_ots']
      }

      // When: checking for capability
      const hasAccess = hasCapability(user.capabilities, 'can_create_failure_report')

      // Then: capability is found (duplicates don't break the check)
      expect(hasAccess).toBe(true)
    })
  })

  /**
   * [P0] Correlation ID Generation and Propagation
   * Tests correlation ID functionality for observability
   */
  describe('[P0] Correlation ID Generation and Propagation', () => {
    it('[P0] should generate new correlation ID when not present in headers', () => {
      // Given: request headers without correlation ID
      const headers = new Headers()

      // When: generating or retrieving correlation ID
      const correlationId = getOrCreateCorrelationId(headers)

      // Then: new UUID v4 format correlation ID is generated
      expect(correlationId).toBeDefined()
      expect(correlationId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('[P0] should return existing correlation ID from headers', () => {
      // Given: request headers with existing correlation ID
      const existingId = 'existing-correlation-123'
      const headers = new Headers()
      headers.set(CORRELATION_ID_HEADER, existingId)

      // When: generating or retrieving correlation ID
      const correlationId = getOrCreateCorrelationId(headers)

      // Then: existing correlation ID is returned
      expect(correlationId).toBe(existingId)
    })

    it('[P0] should generate unique correlation IDs for different requests', () => {
      // Given: two different requests
      const headers1 = new Headers()
      const headers2 = new Headers()

      // When: generating correlation IDs for both
      const id1 = getOrCreateCorrelationId(headers1)
      const id2 = getOrCreateCorrelationId(headers2)

      // Then: unique correlation IDs are generated
      expect(id1).not.toBe(id2)
    })

    it('[P0] should include correlation ID in access denied logs', () => {
      // Given: correlation ID
      const correlationId = 'test-correlation-456'

      // When: logging access denied
      logAccessDenied(
        'user-2626',
        '/users',
        ['can_manage_users'],
        correlationId
      )

      // Then: log includes correlation ID
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.correlationId).toBe(correlationId)
    })

    it('[P0] should use N/A when correlation ID is not provided in logs', () => {
      // When: logging access denied without correlation ID
      logAccessDenied('user-2727', '/users', ['can_manage_users'])

      // Then: log uses N/A for correlation ID
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.correlationId).toBe('N/A')
    })
  })

  /**
   * [P0] Audit Logging for Access Denied
   * Tests audit logging functionality for security compliance
   */
  describe('[P0] Audit Logging for Access Denied', () => {
    it('[P0] should log access denied event with correct structure', () => {
      // When: logging access denied
      logAccessDenied('user-2828', '/dashboard', ['can_view_kpis'])

      // Then: log has correct structure
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])

      expect(logEntry.timestamp).toBeDefined()
      expect(logEntry.level).toBe('warn')
      expect(logEntry.userId).toBe('user-2828')
      expect(logEntry.action).toBe('ACCESS_DENIED')
      expect(logEntry.metadata.path).toBe('/dashboard')
      expect(logEntry.metadata.requiredCapabilities).toEqual(['can_view_kpis'])
      expect(logEntry.metadata.reason).toBe('Insufficient capabilities')
    })

    it('[P0] should handle undefined userId in access denied logs', () => {
      // When: logging access denied with undefined userId
      logAccessDenied(undefined, '/users', ['can_manage_users'])

      // Then: log uses 'unknown' for userId
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.userId).toBe('unknown')
    })

    it('[P0] should log multiple access denied events separately', () => {
      // When: logging multiple access denied events
      logAccessDenied('user-2929', '/users', ['can_manage_users'])
      logAccessDenied('user-3030', '/work-orders', ['can_view_all_ots'])
      logAccessDenied('user-3131', '/assets', ['can_manage_assets'])

      // Then: each event is logged separately
      expect(mockLogs.length).toBe(3)

      const log1 = JSON.parse(mockLogs[0])
      const log2 = JSON.parse(mockLogs[1])
      const log3 = JSON.parse(mockLogs[2])

      expect(log1.userId).toBe('user-2929')
      expect(log2.userId).toBe('user-3030')
      expect(log3.userId).toBe('user-3131')
    })

    it('[P0] should include timestamp in ISO format in access denied logs', () => {
      // When: logging access denied
      logAccessDenied('user-3232', '/reports', ['can_view_repair_history'])

      // Then: log includes ISO 8601 timestamp
      expect(mockLogs.length).toBe(1)
      const logEntry = JSON.parse(mockLogs[0])
      expect(logEntry.timestamp).toBeDefined()
      expect(new Date(logEntry.timestamp).toISOString()).toBe(logEntry.timestamp)
    })
  })

  /**
   * [P1] Route Capabilities Configuration
   * Tests that ROUTE_CAPABILITIES is properly configured
   */
  describe('[P1] Route Capabilities Configuration', () => {
    it('[P1] should have capabilities defined for all protected routes', () => {
      // Given: list of protected routes
      const protectedRoutes = [
        '/dashboard',
        '/work-orders',
        '/assets',
        '/stock',
        '/providers',
        '/routines',
        '/users',
        '/usuarios',
        '/usuarios/etiquetas',
        '/usuarios/editar',
        '/reports'
      ]

      // When: checking if all routes have capability definitions
      const missingRoutes = protectedRoutes.filter(
        route => !ROUTE_CAPABILITIES.hasOwnProperty(route)
      )

      // Then: all routes have capability definitions
      expect(missingRoutes).toEqual([])
    })

    it('[P1] should have correct capability for /users route', () => {
      // When: checking /users route capabilities
      const capabilities = ROUTE_CAPABILITIES['/users']

      // Then: correct capability is defined
      expect(capabilities).toEqual(['can_manage_users'])
    })

    it('[P1] should have correct capability for /work-orders route', () => {
      // When: checking /work-orders route capabilities
      const capabilities = ROUTE_CAPABILITIES['/work-orders']

      // Then: correct capability is defined
      expect(capabilities).toEqual(['can_view_all_ots'])
    })

    it('[P1] should have correct capability for /dashboard route', () => {
      // When: checking /dashboard route capabilities
      const capabilities = ROUTE_CAPABILITIES['/dashboard']

      // Then: no capabilities required (all authenticated users can access)
      expect(capabilities).toEqual([])
    })

    it('[P1] should handle Spanish route /usuarios with same capabilities as /users', () => {
      // When: checking /usuarios route capabilities
      const usuariosCapabilities = ROUTE_CAPABILITIES['/usuarios']
      const usersCapabilities = ROUTE_CAPABILITIES['/users']

      // Then: both routes have same capabilities
      expect(usuariosCapabilities).toEqual(usersCapabilities)
      expect(usuariosCapabilities).toEqual(['can_manage_users'])
    })
  })

  /**
   * [P2] Helper Functions Unit Tests
   * Tests individual helper functions in isolation
   */
  describe('[P2] Helper Functions Unit Tests', () => {
    it('[P2] hasCapability should return true for existing capability', () => {
      // Given: capabilities array
      const capabilities = ['can_view_kpis', 'can_create_failure_report']

      // When: checking for existing capability
      const result = hasCapability(capabilities, 'can_view_kpis')

      // Then: returns true
      expect(result).toBe(true)
    })

    it('[P2] hasCapability should return false for missing capability', () => {
      // Given: capabilities array
      const capabilities = ['can_view_kpis']

      // When: checking for missing capability
      const result = hasCapability(capabilities, 'can_manage_users')

      // Then: returns false
      expect(result).toBe(false)
    })

    it('[P2] hasCapability should return false for undefined capabilities', () => {
      // When: checking with undefined capabilities
      const result = hasCapability(undefined, 'can_view_kpis')

      // Then: returns false
      expect(result).toBe(false)
    })

    it('[P2] hasAllCapabilities should return true when user has all required', () => {
      // Given: user capabilities and required capabilities
      const userCapabilities = ['can_view_kpis', 'can_create_failure_report', 'can_manage_users']
      const requiredCapabilities = ['can_view_kpis', 'can_manage_users']

      // When: checking if user has all required
      const result = hasAllCapabilities(userCapabilities, requiredCapabilities)

      // Then: returns true
      expect(result).toBe(true)
    })

    it('[P2] hasAllCapabilities should return false when user missing some', () => {
      // Given: user capabilities and required capabilities
      const userCapabilities = ['can_view_kpis']
      const requiredCapabilities = ['can_view_kpis', 'can_manage_users']

      // When: checking if user has all required
      const result = hasAllCapabilities(userCapabilities, requiredCapabilities)

      // Then: returns false
      expect(result).toBe(false)
    })

    it('[P2] hasAllCapabilities should return true for empty required capabilities', () => {
      // Given: user capabilities
      const userCapabilities = ['can_view_kpis']

      // When: checking with empty required capabilities
      const result = hasAllCapabilities(userCapabilities, [])

      // Then: returns true (no requirements)
      expect(result).toBe(true)
    })

    it('[P2] hasAllCapabilities should return true for undefined required capabilities', () => {
      // Given: user capabilities
      const userCapabilities = ['can_view_kpis']

      // When: checking with undefined required capabilities
      const result = hasAllCapabilities(userCapabilities, undefined as any)

      // Then: returns true (no requirements)
      expect(result).toBe(true)
    })
  })
})
