/**
 * PBAC Authorization Middleware
 * Story 0.3: NextAuth.js con Credentials Provider
 * Story 0.5: Error Handling, Observability y CI/CD (Correlation ID generation)
 *
 * Implements:
 * - Correlation ID generation for all requests (Story 0.5)
 * - Authentication verification with NextAuth
 * - Capability-Based Access Control (PBAC) authorization
 * - Redirect to /unauthorized if missing capability
 * - Audit logging for denied access (NFR-S5)
 * - Force password reset redirect (NFR-S72-A)
 *
 * 15 PBAC Capabilities:
 * 1. can_create_failure_report
 * 2. can_create_manual_ot
 * 3. can_update_own_ot
 * 4. can_view_own_ots
 * 5. can_view_all_ots
 * 6. can_complete_ot
 * 7. can_manage_stock
 * 8. can_assign_technicians
 * 9. can_view_kpis
 * 10. can_manage_assets
 * 11. can_view_repair_history
 * 12. can_manage_providers
 * 13. can_manage_routines
 * 14. can_manage_users
 * 15. can_receive_reports
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Correlation ID header name
 * Exported for testing
 */
export const CORRELATION_ID_HEADER = 'x-correlation-id'

/**
 * Generates or retrieves correlation ID for request
 * Exported for testing
 * @param request - NextRequest object
 * @returns correlation ID string
 */
export function getOrCreateCorrelationId(request: Headers): string {
  const existingId = request.get(CORRELATION_ID_HEADER)
  if (existingId) {
    return existingId
  }

  // Generate new correlation ID
  return crypto.randomUUID()
}

/**
 * Route to required capabilities mapping
 * Defines which capabilities are needed to access each route
 * Exported for testing
 *
 * Note: /dashboard is accessible to all authenticated users
 * Specific dashboard features are protected by capabilities within the page
 */
export const ROUTE_CAPABILITIES: Record<string, string[]> = {
  '/dashboard': [], // No capabilities required - all authenticated users can access
  '/work-orders': ['can_view_all_ots'],
  '/assets': ['can_manage_assets'],
  '/stock': ['can_manage_stock'],
  '/providers': ['can_manage_providers'],
  '/routines': ['can_manage_routines'],
  '/users': ['can_manage_users'],
  '/usuarios': ['can_manage_users'], // Spanish route for user management
  '/reports': ['can_view_repair_history']
}

/**
 * Checks if user has a specific capability
 * Exported for testing
 * @param capabilities - User's capabilities array
 * @param requiredCapability - Required capability
 * @returns true if user has the capability
 */
export function hasCapability(capabilities: string[] | undefined, requiredCapability: string): boolean {
  return capabilities?.includes(requiredCapability) ?? false
}

/**
 * Checks if user has all required capabilities for a route
 * Exported for testing
 * @param capabilities - User's capabilities array
 * @param requiredCapabilities - Array of required capabilities
 * @returns true if user has all required capabilities
 */
export function hasAllCapabilities(
  capabilities: string[] | undefined,
  requiredCapabilities: string[]
): boolean {
  if (!requiredCapabilities || requiredCapabilities.length === 0) {
    return true
  }

  return requiredCapabilities.every((required) =>
    hasCapability(capabilities, required)
  )
}

/**
 * Log denied access for audit purposes (NFR-S5)
 * Story 0.5: Added correlation ID parameter for tracking
 * Exported for testing
 * @param userId - User ID
 * @param path - Requested path
 * @param requiredCapabilities - Required capabilities
 * @param correlationId - Request correlation ID
 */
export function logAccessDenied(
  userId: string | undefined,
  path: string,
  requiredCapabilities: string[],
  correlationId?: string
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    userId: userId || 'unknown',
    action: 'ACCESS_DENIED',
    correlationId: correlationId || 'N/A',
    metadata: {
      path,
      requiredCapabilities,
      reason: 'Insufficient capabilities'
    }
  }

  // Middleware runs on edge runtime, so we use console.error
  // Format matches structured logger format used throughout the app
  console.error(JSON.stringify(logEntry))
}

/**
 * Main middleware function
 * Uses NextAuth withAuth to verify authentication
 * Then checks route-specific capabilities and forcePasswordReset
 *
 * Story 0.5: Adds correlation ID generation and propagation
 */
export default withAuth(
  function middleware(req: any) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // DEBUG: Log token and path for debugging forcePasswordReset
    console.log('[Middleware] Path:', path, 'Token forcePasswordReset:', token?.forcePasswordReset, 'Token ID:', token?.id, 'Full token:', JSON.stringify(token))

    // Story 0.5: Generate or retrieve correlation ID
    const correlationId = getOrCreateCorrelationId(req.headers)

    // Create request headers with correlation ID
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set(CORRELATION_ID_HEADER, correlationId)

    // Check if user has temporary password that must be changed
    // If forcePasswordReset=true, force redirect to /cambiar-password (Spanish route)
    // Except if already on /cambiar-password, /unauthorized, /logout or API routes
    // Story 1.1: Navigation blocking until password is changed (NFR-S72-A)
    if (token?.forcePasswordReset === true &&
        path !== '/cambiar-password' &&
        path !== '/unauthorized' &&
        !path.startsWith('/api/auth')) {
      console.log('[Middleware] Redirecting to /cambiar-password due to forcePasswordReset=true')
      const response = NextResponse.redirect(new URL('/cambiar-password', req.url))
      response.headers.set(CORRELATION_ID_HEADER, correlationId)
      return response
    }

    // Find routes matching current path
    const matchingRoute = Object.keys(ROUTE_CAPABILITIES).find((route) =>
      path.startsWith(route)
    )

    // If no capability requirements for this route, allow
    if (!matchingRoute) {
      const response = NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
      response.headers.set(CORRELATION_ID_HEADER, correlationId)
      return response
    }

    const requiredCapabilities = ROUTE_CAPABILITIES[matchingRoute]
    const userCapabilities = token?.capabilities as string[] | undefined

    // Check if user has required capabilities
    if (!hasAllCapabilities(userCapabilities, requiredCapabilities)) {
      console.log('[Middleware] Access denied - Path:', path, 'Required:', requiredCapabilities, 'User has:', userCapabilities)

      // Audit log with correlation ID
      logAccessDenied(token?.id as string, path, requiredCapabilities, correlationId)

      // Redirect to /unauthorized with context about why access was denied
      const unauthorizedUrl = new URL('/unauthorized', req.url)
      unauthorizedUrl.searchParams.set('path', path)
      unauthorizedUrl.searchParams.set('required', requiredCapabilities.join(','))

      console.log('[Middleware] Redirecting to:', unauthorizedUrl.toString())

      const response = NextResponse.redirect(unauthorizedUrl)
      response.headers.set(CORRELATION_ID_HEADER, correlationId)
      return response
    }

    // Allow access with correlation ID
    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
    response.headers.set(CORRELATION_ID_HEADER, correlationId)
    return response
  },
  {
    callbacks: {
      // Verify user is authenticated
      authorized: ({ token }: any) => !!token
    }
  }
)

/**
 * Middleware configuration
 * Defines which routes must be protected
 */
export const config = {
  matcher: [
    // Protected routes requiring authentication
    // Note: Must match both exact path and paths with sub-paths
    '/dashboard',
    '/dashboard/:path*',
    '/work-orders',
    '/work-orders/:path*',
    '/assets',
    '/assets/:path*',
    '/stock',
    '/stock/:path*',
    '/providers',
    '/providers/:path*',
    '/routines',
    '/routines/:path*',
    '/users',
    '/users/:path*',
    '/usuarios',
    '/usuarios/:path*', // Spanish routes for user management
    '/reports',
    '/reports/:path*',
    // Change password and unauthorized routes (Story 1.1: Spanish route names)
    '/cambiar-password',
    '/cambiar-password/:path*',
    '/unauthorized',
    '/unauthorized/:path*'
  ]
}
