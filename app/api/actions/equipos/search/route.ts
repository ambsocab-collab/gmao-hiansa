/**
 * API Route: Search Equipos
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * HTTP endpoint that wraps the searchEquipos Server Action
 * Used by API tests and external clients
 *
 * POST /api/actions/equipos/search
 * Body: { query: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchEquipos } from '@/app/actions/equipos'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { auth } from '@/lib/auth-adapter'

export async function POST(request: NextRequest) {
  // Generate correlation ID for tracking
  const correlationId = crypto.randomUUID()

  try {
    // Verify authentication
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { query } = body

    // Call Server Action
    const resultados = await searchEquipos(query)

    return NextResponse.json(resultados, { status: 200 })
  } catch (error) {
    return apiErrorHandler(
      error,
      'search_equipos_api',
      correlationId,
      undefined // userId - not needed for logging in this case
    )
  }
}
