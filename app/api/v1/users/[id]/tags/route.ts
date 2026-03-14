/**
 * API Route: Assign Tags to User
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * PUT /api/v1/users/:id/tags
 * Assigns multiple tags to a user
 *
 * GET /api/v1/users/:id/tags
 * Gets user's tags
 */

import { assignTagsToUser, getUserTags } from '@/app/actions/tags'
import { NextRequest, NextResponse } from 'next/server'
import {
  ValidationError,
  AuthorizationError,
  AuthenticationError,
} from '@/lib/utils/errors'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params

    const result = await getUserTags(id)

    if (result.success) {
      return NextResponse.json(result.tags)
    } else {
      return NextResponse.json(
        { error: 'Error al obtener etiquetas de usuario' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error getting user tags:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params
    const body = await request.json()

    const result = await assignTagsToUser(id, body.tagIds || [])

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    // Handle custom errors from Server Actions
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error instanceof AuthorizationError || error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    console.error('Error assigning tags:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
