/**
 * Profile API Routes
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * GET /api/v1/users/profile - Get current user profile
 * PUT /api/v1/users/profile - Update current user profile
 */

import { updateProfile } from '@/app/actions/users'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { logger } from '@/lib/observability/logger'
import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/v1/users/profile
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        lastLogin: true,
        forcePasswordReset: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'get_profile_api_error', correlationId, session.user.id)

    return apiErrorHandler(error, correlationId, 'GET /api/v1/users/profile')
  }
}

/**
 * PUT /api/v1/users/profile
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    const body = await request.json()

    // Call Server Action
    const result = await updateProfile(body)

    return NextResponse.json(result)
  } catch (error) {
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'put_profile_api_error', correlationId, session?.user?.id)

    // Use consistent error handler
    return apiErrorHandler(error, correlationId, 'PUT /api/v1/users/profile')
  }
}
