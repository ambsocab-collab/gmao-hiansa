/**
 * Users API Routes
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * GET /api/v1/users - List users (admin only)
 * POST /api/v1/users - Create user (admin only)
 */

import { createUser } from '@/app/actions/users'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { logger } from '@/lib/observability/logger'
import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/v1/users
 * List all users (admin only, requires can_manage_users capability)
 */
export async function GET(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn('Forbidden users list attempt', {
        correlationId,
        userId: session.user.id,
        action: 'list_users',
      })
      return NextResponse.json(
        { error: 'No tienes permiso para listar usuarios' },
        { status: 403 }
      )
    }

    // Get all users (excluding soft-deleted)
    const users = await prisma.user.findMany({
      where: { deleted: false },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        forcePasswordReset: true,
        createdAt: true,
        lastLogin: true,
        user_capabilities: {
          include: { capability: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform users to include capabilities array
    const transformedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      forcePasswordReset: user.forcePasswordReset,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      capabilities: user.user_capabilities.map((uc) => uc.capability.name),
    }))

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'get_users_api_error', correlationId, session?.user?.id)

    return apiErrorHandler(error, correlationId, 'GET /api/v1/users')
  }
}

/**
 * POST /api/v1/users
 * Create new user (admin only, requires can_manage_users capability)
 */
export async function POST(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    const body = await request.json()

    // Call Server Action
    const result = await createUser(body)

    return NextResponse.json(result)
  } catch (error) {
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'create_user_api_error', correlationId, session?.user?.id)

    // Use consistent error handler
    return apiErrorHandler(error, correlationId, 'POST /api/v1/users')
  }
}
