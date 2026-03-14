/**
 * User Capabilities API Routes
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * GET /api/v1/users/:id/capabilities - Get user's capabilities
 * PUT /api/v1/users/:id/capabilities - Update user's capabilities
 */

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth-adapter'
import { updateUserCapabilities } from '@/app/actions/users'
import { NextRequest, NextResponse } from 'next/server'
import { AuthorizationError } from '@/lib/utils/errors'

/**
 * GET /api/v1/users/:id/capabilities
 * Get capabilities for a specific user
 * Requires can_manage_users capability
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
        { error: 'No tienes permiso para ver capabilities' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Get user capabilities
    const userCapabilities = await prisma.userCapability.findMany({
      where: { userId: id },
      include: {
        capability: true,
      },
      orderBy: {
        capability: {
          name: 'asc',
        },
      },
    })

    const capabilities = userCapabilities.map((uc) => ({
      id: uc.capability.id,
      name: uc.capability.name,
      label: uc.capability.label,
      description: uc.capability.description,
    }))

    return NextResponse.json({ capabilities })
  } catch (error) {
    console.error('[GET /api/v1/users/:id/capabilities] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener capabilities del usuario' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/v1/users/:id/capabilities
 * Update capabilities for a specific user
 * Requires can_manage_users capability
 */
export async function PUT(
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
        { error: 'No tienes permiso para actualizar capabilities' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { capabilities } = body

    if (!Array.isArray(capabilities)) {
      return NextResponse.json(
        { error: 'Capabilities debe ser un arreglo' },
        { status: 400 }
      )
    }

    // Call server action to update capabilities
    const result = await updateUserCapabilities(id, capabilities)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[PUT /api/v1/users/:id/capabilities] Error:', error)

    // Handle custom errors
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar capabilities del usuario' },
      { status: 500 }
    )
  }
}
