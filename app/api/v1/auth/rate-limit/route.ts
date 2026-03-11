import { NextRequest, NextResponse } from 'next/server'
import { getRemainingAttempts } from '@/lib/rate-limit'
import { loginAttempts } from '@/lib/rate-limit'

/**
 * GET /api/v1/auth/rate-limit
 *
 * Returns rate limit status for the current IP address.
 * Used by the login form to check if the user is blocked.
 */
export async function GET(request: NextRequest) {
  try {
    // Use localhost for testing (same as auth.config.ts)
    const ip = 'localhost'

    const remaining = getRemainingAttempts(ip)

    // Check if actually blocked by looking at the record
    const record = loginAttempts.get('__global__')
    // Blocked when count has exceeded max attempts (6th attempt)
    const blocked = record ? record.count > 5 : false

    console.log('[Rate Limit API] Count:', record?.count || 0, 'Remaining:', remaining, 'Blocked:', blocked)

    return NextResponse.json({
      remaining,
      maxAttempts: 5,
      blocked
    })
  } catch (error) {
    console.error('[Rate Limit API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check rate limit' },
      { status: 500 }
    )
  }
}
