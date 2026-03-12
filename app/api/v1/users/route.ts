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
  let session: Awaited<ReturnType<typeof auth>> | null = null

  try {
    session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Check can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      logger.warn(session.user.id, 'list_users_forbidden', correlationId)
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
        userCapabilities: {
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
      capabilities: user.userCapabilities.map((uc) => uc.capability.name),
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
  let session: Awaited<ReturnType<typeof auth>> | null = null

  try {
    console.log('[POST /api/v1/users] Request received')
    session = await auth()
    console.log('[POST /api/v1/users] Session authenticated:', session?.user?.email)
    console.log('[POST /api/v1/users] User capabilities:', session?.user?.capabilities)

    const body = await request.json()
    console.log('[POST /api/v1/users] Received request body:', JSON.stringify(body, null, 2))
    console.log('[POST /api/v1/users] Capabilities in request:', body.capabilities, 'Type:', typeof body.capabilities, 'Length:', Array.isArray(body.capabilities) ? body.capabilities.length : 'N/A')

    // Call Server Action
    const result = await createUser(body)

    console.log('[POST /api/v1/users] createUser result:', JSON.stringify(result, null, 2))
    return NextResponse.json(result)
  } catch (error) {
    logger.error(new Error(error instanceof Error ? error.message : 'Unknown error'), 'create_user_api_error', correlationId, session?.user?.id)

    // Use consistent error handler
    return apiErrorHandler(error, correlationId, 'POST /api/v1/users')
  }
}
