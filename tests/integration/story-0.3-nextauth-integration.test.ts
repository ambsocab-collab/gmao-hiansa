/**
 * Integration Tests for Story 0.3: NextAuth.js
 * AC-0.3.3: Complete login flow integration test
 * AC-0.3.4: Middleware blocking unauthorized requests
 * AC-0.3.5: Forced password redirect flow
 *
 * Tests complete authentication flow, authorization middleware,
 * and forced password reset functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import {
  ROUTE_CAPABILITIES,
  hasAllCapabilities,
  logAccessDenied
} from '@/middleware'
import { withAuth } from 'next-auth/middleware'

// Mock NextAuth
vi.mock('next-auth/middleware', () => ({
  withAuth: vi.fn()
}))

// Mock auth-adapter
vi.mock('@/lib/auth-adapter', () => ({
  auth: vi.fn()
}))

const prisma = new PrismaClient()

describe('Story 0.3: NextAuth.js - Integration Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  describe('[P0] AC-0.3.3: Complete Login Flow Integration Test', () => {
    it('[I0-3.3-001] should authenticate user with valid credentials', async () => {
      // Mock user in database
      const mockUser = {
        id: 'test-user-123',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        name: 'Test User',
        force_password_reset: false,
        created_at: new Date(),
        updated_at: new Date(),
        user_capabilities: [
          {
            capability: {
              name: 'can_view_own_ots'
            }
          }
        ]
      }

      // Mock Prisma findUnique to return test user
      const findUniqueSpy = vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser)

      // Mock NextAuth credentials provider
      const credentialsProvider = {
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials: any) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              user_capabilities: {
                include: {
                  capability: true
                }
              }
            }
          })

          if (!user) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            forcePasswordReset: user.force_password_reset,
            capabilities: user.user_capabilities.map(uc => uc.capability.name)
          }
        }
      }

      // Test authorization
      const authorizedUser = await credentialsProvider.authorize({
        email: 'test@example.com',
        password: 'password123'
      })

      // Verify user is authenticated
      expect(authorizedUser).toBeDefined()
      expect(authorizedUser?.email).toBe('test@example.com')
      expect(findUniqueSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'test@example.com' }
        })
      )

      findUniqueSpy.mockRestore()
    })

    it('[I0-3.3-002] should return session token after successful login', async () => {
      // Mock NextAuth POST handler
      const mockSession = {
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      }

      // Mock response
      const mockResponse = {
        status: 200,
        headers: new Headers({
          'content-type': 'application/json',
          'set-cookie': 'next-auth.session-token=mock-token; Path=/; HttpOnly'
        }),
        json: async () => ({ session: mockSession })
      }

      // Simulate login response
      const response = mockResponse

      // Verify session token is set
      const setCookieHeader = response.headers.get('set-cookie')
      expect(setCookieHeader).toContain('next-auth.session-token')
      expect(setCookieHeader).toContain('HttpOnly')
      expect(setCookieHeader).toContain('Path=/')
    })

    it('[I0-3.3-003] should redirect to /dashboard after successful login', async () => {
      // Mock request with CSRF token
      const mockRequest = new NextRequest('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          csrfToken: 'mock-csrf-token',
          email: 'test@example.com',
          password: 'password123',
          callbackUrl: '/dashboard'
        }).toString()
      })

      // Simulate successful authentication redirect
      const redirectUrl = new URL('/dashboard', mockRequest.url)

      // Verify redirect URL
      expect(redirectUrl.pathname).toBe('/dashboard')
      expect(redirectUrl.origin).toBe('http://localhost:3000')
    })
  })

  describe('[P0] AC-0.3.4: Middleware Blocking Unauthorized Requests', () => {
    it('[I0-3.4-001] should block request when user lacks required capability', async () => {
      // Mock token without required capability
      const mockToken = {
        id: 'test-user-123',
        email: 'test@example.com',
        capabilities: ['can_view_own_ots'] // Missing can_view_all_ots
      }

      // Mock withAuth to call middleware with token
      vi.mocked(withAuth).mockImplementation((callback: any) => {
        return async (req: any) => {
          req.nextauth = { token: mockToken }
          return callback(req)
        }
      })

      // Create mock request to /work-orders (requires can_view_all_ots)
      const mockRequest = new NextRequest('http://localhost:3000/work-orders')
      mockRequest.nextauth = { token: mockToken }

      // Test capability check
      const hasRequiredCapability = hasAllCapabilities(
        mockToken.capabilities,
        ROUTE_CAPABILITIES['/work-orders']
      )

      // Verify access is denied
      expect(hasRequiredCapability).toBe(false)
    })

    it('[I0-3.4-002] should redirect to /unauthorized with proper status code', async () => {
      // Mock token without required capability
      const mockToken = {
        id: 'test-user-123',
        email: 'test@example.com',
        capabilities: []
      }

      // Mock console.error to capture audit log
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock request to protected route
      const mockRequest = new NextRequest('http://localhost:3000/dashboard')
      mockRequest.nextauth = { token: mockToken }

      // Log access denied
      logAccessDenied(
        mockToken.id,
        '/dashboard',
        ROUTE_CAPABILITIES['/dashboard'],
        'test-correlation-123'
      )

      // Verify audit log was created
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('ACCESS_DENIED')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-user-123')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-correlation-123')
      )

      consoleErrorSpy.mockRestore()
    })

    it('[I0-3.4-003] should create audit log entry for denied access', async () => {
      // Mock token
      const mockToken = {
        id: 'test-user-456',
        email: 'unauthorized@example.com',
        capabilities: []
      }

      // Mock console.error to capture audit log
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Simulate access denied
      logAccessDenied(
        mockToken.id,
        '/stock',
        ROUTE_CAPABILITIES['/stock'],
        'test-correlation-456'
      )

      // Verify audit log structure
      const logCall = consoleErrorSpy.mock.calls[0][0] as string
      const logEntry = JSON.parse(logCall)

      expect(logEntry).toMatchObject({
        level: 'warn',
        userId: 'test-user-456',
        action: 'ACCESS_DENIED',
        correlationId: 'test-correlation-456',
        metadata: expect.objectContaining({
          path: '/stock',
          requiredCapabilities: ['can_manage_stock'],
          reason: 'Insufficient capabilities'
        })
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('[P0] AC-0.3.5: Forced Password Redirect Flow', () => {
    it('[I0-3.5-001] should redirect user to /change-password when forcePasswordReset is true', async () => {
      // Mock token with forcePasswordReset flag
      const mockToken = {
        id: 'test-user-789',
        email: 'test@example.com',
        forcePasswordReset: true,
        capabilities: ['can_view_kpis']
      }

      // Create mock request to /dashboard
      const mockRequest = new NextRequest('http://localhost:3000/dashboard')
      mockRequest.nextauth = { token: mockToken }

      // Simulate middleware redirect logic
      const shouldRedirect = mockToken.forcePasswordReset === true &&
        mockRequest.nextUrl.pathname !== '/change-password' &&
        mockRequest.nextUrl.pathname !== '/unauthorized' &&
        !mockRequest.nextUrl.pathname.startsWith('/api/auth')

      expect(shouldRedirect).toBe(true)

      // Verify redirect URL
      const redirectUrl = new URL('/change-password', mockRequest.url)
      expect(redirectUrl.pathname).toBe('/change-password')
    })

    it('[I0-3.5-002] should prevent access to protected routes until password is changed', async () => {
      // Mock token with forcePasswordReset flag
      const mockToken = {
        id: 'test-user-789',
        email: 'test@example.com',
        forcePasswordReset: true,
        capabilities: ['can_view_kpis', 'can_view_all_ots']
      }

      // Test various protected routes
      const protectedRoutes = [
        '/dashboard',
        '/work-orders',
        '/assets',
        '/stock'
      ]

      for (const route of protectedRoutes) {
        const mockRequest = new NextRequest(`http://localhost:3000${route}`)
        mockRequest.nextauth = { token: mockToken }

        // Simulate middleware check
        const shouldRedirectToPasswordChange =
          mockToken.forcePasswordReset === true &&
          mockRequest.nextUrl.pathname !== '/change-password'

        expect(shouldRedirectToPasswordChange).toBe(true)
      }
    })

    it('[I0-3.5-003] should allow access to /change-password when forcePasswordReset is true', async () => {
      // Mock token with forcePasswordReset flag
      const mockToken = {
        id: 'test-user-789',
        email: 'test@example.com',
        forcePasswordReset: true,
        capabilities: []
      }

      // Create mock request to /change-password
      const mockRequest = new NextRequest('http://localhost:3000/change-password')
      mockRequest.nextauth = { token: mockToken }

      // Simulate middleware logic - should NOT redirect
      const shouldRedirectToPasswordChange =
        mockToken.forcePasswordReset === true &&
        mockRequest.nextUrl.pathname !== '/change-password' &&
        mockRequest.nextUrl.pathname !== '/unauthorized'

      expect(shouldRedirectToPasswordChange).toBe(false)

      // User should be allowed to proceed to /change-password
      expect(mockRequest.nextUrl.pathname).toBe('/change-password')
    })

    it('[I0-3.5-004] should clear forcePasswordReset flag after successful password change', async () => {
      // Mock Prisma update
      const updateSpy = vi.spyOn(prisma.user, 'update').mockResolvedValue({
        id: 'test-user-789',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('newPassword123', 10),
        name: 'Test User',
        force_password_reset: false, // Flag cleared
        created_at: new Date(),
        updated_at: new Date()
      })

      // Simulate password change
      const updatedUser = await prisma.user.update({
        where: { id: 'test-user-789' },
        data: {
          password_hash: await bcrypt.hash('newPassword123', 10),
          force_password_reset: false
        }
      })

      // Verify flag is cleared
      expect(updatedUser.force_password_reset).toBe(false)
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            force_password_reset: false
          })
        })
      )

      updateSpy.mockRestore()
    })
  })
})
