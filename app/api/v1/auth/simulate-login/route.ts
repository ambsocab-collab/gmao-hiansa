import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, resetRateLimit, loginAttempts } from '@/lib/rate-limit'

/**
 * Test endpoint to simulate login attempts for rate limiting testing
 * This allows testing rate limiting without going through NextAuth flow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, shouldFail = true } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Simulate rate limiting check using IP from request or default
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'localhost'

    // Check rate limit
    const rateLimitOk = await checkRateLimit(ip)

    if (!rateLimitOk) {
      return NextResponse.json({
        success: false,
        error: 'RATE_LIMITED',
        message: 'Demasiados intentos. Intenta nuevamente en 15 minutos.',
        rateLimit: {
          remaining: 0,
          maxAttempts: 5,
          blocked: true
        }
      }, { status: 429 })
    }

    // Simulate login attempt
    if (shouldFail) {
      // Failed login - don't reset rate limit
      const attempt = loginAttempts.get(ip)
      const remaining = attempt ? Math.max(0, 5 - attempt.count) : 5

      return NextResponse.json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Email o contraseña incorrectos',
        rateLimit: {
          remaining,
          maxAttempts: 5,
          blocked: false
        }
      }, { status: 401 })
    } else {
      // Successful login - reset rate limit
      resetRateLimit(ip)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        rateLimit: {
          remaining: 5,
          maxAttempts: 5,
          blocked: false
        }
      })
    }
  } catch (error) {
    console.error('Simulate login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
