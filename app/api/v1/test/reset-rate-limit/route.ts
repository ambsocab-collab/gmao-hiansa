import { NextRequest, NextResponse } from 'next/server'
import { resetRateLimit, loginAttempts } from '@/lib/rate-limit'

/**
 * Test-only endpoint to reset rate limiting state
 * This should only be used in test environment
 */
export async function POST(request: NextRequest) {
  // Verify this is a test environment
  if (process.env.NODE_ENV !== 'test' && process.env.NEXT_PUBLIC_APP_ENV !== 'test') {
    // In development, allow but add a warning header
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Not allowed in production' },
        { status: 403 }
      )
    }
  }

  try {
    // Get IP from request body or use default
    const body = await request.json().catch(() => ({}))
    const ip = body.ip || 'localhost'

    // Reset rate limit for the IP
    resetRateLimit(ip)

    // Clear the login attempts map entirely if requested
    if (body.clearAll === true) {
      loginAttempts.clear()
    }

    return NextResponse.json({
      success: true,
      message: 'Rate limit reset',
      ip
    })
  } catch (error) {
    console.error('Reset rate limit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
