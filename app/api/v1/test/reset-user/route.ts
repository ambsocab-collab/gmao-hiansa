import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

/**
 * Test-only endpoint to reset a user to their initial state
 * POST /api/v1/test/reset-user
 * Body: { email: string }
 *
 * This resets:
 * - forcePasswordReset to true
 * - password to tempPassword123
 *
 * WARNING: Only for testing purposes!
 */
export async function POST(request: Request) {
  // Only allow in test/development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Reset password to tempPassword123 and set forcePasswordReset=true
    const hashedPassword = await bcrypt.hash('tempPassword123', 10)

    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        forcePasswordReset: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        forcePasswordReset: user.forcePasswordReset,
      }
    })
  } catch (error) {
    console.error('[reset-user] Error:', error)
    return NextResponse.json(
      { error: 'Failed to reset user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
