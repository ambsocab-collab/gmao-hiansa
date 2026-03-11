/**
 * User Detail API Routes
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * GET /api/v1/users/[id] - Get user details
 * PUT /api/v1/users/[id] - Update user
 * DELETE /api/v1/users/[id] - Soft delete user (admin only)
 */

import { deleteUser } from '@/app/actions/users'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { logger } from '@/lib/observability/logger'
import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/v1/users/[id]
 * Get user details (admin only, requires can_manage_users capability)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      return NextResponse.json(
        { error: 'No tienes permiso para ver detalles de usuario' },
        { status: 403 }
      )
    }

    // Await params (Next.js 15 requirement)
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        user_capabilities: {
          include: { capability: true },
        },
        activity_logs: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Transform user
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      forcePasswordReset: user.forcePasswordReset,
      deleted: user.deleted,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      capabilities: user.user_capabilities.map((uc) => uc.capability.name),
      activityLogs: user.activityLogs,
    }

    return NextResponse.json({ user: transformedUser })
  } catch (error) {
    logger.error('Error in GET user by ID API route', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return apiErrorHandler(error, correlationId, 'GET /api/v1/users/[id]')
  }
}

/**
 * DELETE /api/v1/users/[id]
 * Soft delete user (admin only, requires can_manage_users capability)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    // Await params (Next.js 15 requirement)
    const { id } = await params

    // Call Server Action
    const result = await deleteUser(id)

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error in DELETE user API route', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return apiErrorHandler(error, correlationId, 'DELETE /api/v1/users/[id]')
  }
}
