/**
 * PBAC Authorization Middleware
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Implements:
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
 * Route to required capabilities mapping
 * Defines which capabilities are needed to access each route
 * Exported for testing
 */
export const ROUTE_CAPABILITIES: Record<string, string[]> = {
  '/dashboard': ['can_view_kpis'],
  '/work-orders': ['can_view_all_ots'],
  '/assets': ['can_manage_assets'],
  '/stock': ['can_manage_stock'],
  '/providers': ['can_manage_providers'],
  '/routines': ['can_manage_routines'],
  '/users': ['can_manage_users'],
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
 * Exported for testing
 * @param userId - User ID
 * @param path - Requested path
 * @param requiredCapabilities - Required capabilities
 */
export function logAccessDenied(
  userId: string | undefined,
  path: string,
  requiredCapabilities: string[]
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: 'ACCESS_DENIED',
    userId: userId || 'unknown',
    path,
    requiredCapabilities,
    reason: 'Insufficient capabilities'
  }

  // In production, this should go to a centralized logging system
  // For now, using console.error with structured format
  console.error('[AUDIT] Access Denied:', JSON.stringify(logEntry))
}

/**
 * Main middleware function
 * Uses NextAuth withAuth to verify authentication
 * Then checks route-specific capabilities and forcePasswordReset
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check if user has temporary password that must be changed
    // If forcePasswordReset=true, force redirect to /change-password
    // Except if already on /change-password or /unauthorized or /logout
    if (token?.forcePasswordReset === true &&
        path !== '/change-password' &&
        path !== '/unauthorized' &&
        !path.startsWith('/api/auth')) {
      return NextResponse.redirect(new URL('/change-password', req.url))
    }

    // Find routes matching current path
    const matchingRoute = Object.keys(ROUTE_CAPABILITIES).find((route) =>
      path.startsWith(route)
    )

    // If no capability requirements for this route, allow
    if (!matchingRoute) {
      return NextResponse.next()
    }

    const requiredCapabilities = ROUTE_CAPABILITIES[matchingRoute]
    const userCapabilities = token?.capabilities as string[] | undefined

    // Check if user has required capabilities
    if (!hasAllCapabilities(userCapabilities, requiredCapabilities)) {
      // Audit log
      logAccessDenied(token?.id as string, path, requiredCapabilities)

      // Redirect to /unauthorized
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Allow access
    return NextResponse.next()
  },
  {
    callbacks: {
      // Verify user is authenticated
      authorized: ({ token }) => !!token
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
    '/dashboard/:path*',
    '/work-orders/:path*',
    '/assets/:path*',
    '/stock/:path*',
    '/providers/:path*',
    '/routines/:path*',
    '/users/:path*',
    '/reports/:path*',
    // Change password and unauthorized routes
    '/change-password/:path*',
    '/unauthorized/:path*'
  ]
}
