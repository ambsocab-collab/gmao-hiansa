/**
 * Profile API Routes
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * GET /api/v1/users/profile - Get current user profile
 * PUT /api/v1/users/profile - Update current user profile
 */

import { updateProfileSchema } from '@/lib/schemas'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { logger } from '@/lib/observability/logger'
import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * GET /api/v1/users/profile
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'
  let session: Awaited<ReturnType<typeof auth>> | null = null

  try {
    session = await auth()
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
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'get_profile_api_error', correlationId, session?.user?.id ?? undefined)

    return apiErrorHandler(error, correlationId, 'GET /api/v1/users/profile')
  }
}

/**
 * PUT /api/v1/users/profile
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'
  let session: Awaited<ReturnType<typeof auth>> | null = null

  try {
    session = await auth()

    if (!session?.user?.id) {
      logger.warn(undefined, 'update_profile_unauthorized', correlationId)
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()

    // Validate data
    const validatedData = updateProfileSchema.parse(body)

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        phone: validatedData.phone || null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'profile_update',
        metadata: {
          fields: ['name', 'phone'],
        },
        timestamp: new Date(),
      },
    })

    logger.info(session.user.id, 'update_profile', correlationId, {
      success: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser,
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      logger.warn(session?.user?.id ?? undefined, 'update_profile_validation_failed', correlationId, {
        errors: error.errors,
      })
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Handle custom errors
    if (
      error instanceof Error &&
      'name' in error &&
      (error.name === 'AuthenticationError' ||
        error.name === 'ValidationError' ||
        error.name === 'AuthorizationError')
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Handle unexpected errors
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'put_profile_api_error', correlationId, session?.user?.id ?? undefined)

    return apiErrorHandler(error, correlationId, 'PUT /api/v1/users/profile')
  }
}
