/**
 * API Route: Tags
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * GET /api/v1/tags - Get all tags
 * POST /api/v1/tags - Create a new classification tag
 */

import { createTag, getTags } from '@/app/actions/tags'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/v1/tags
 * Get all classification tags
 */
export async function GET() {
  try {
    const result = await getTags()

    if (result.success) {
      return NextResponse.json(result.tags)
    } else {
      return NextResponse.json(
        { error: 'Error al obtener etiquetas' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error getting tags:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/v1/tags
 * Create a new classification tag
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await createTag(body)

    if (result.success) {
      return NextResponse.json(result.tag, { status: 201 })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
