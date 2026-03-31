/**
 * Capabilities API Routes
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * GET /api/v1/capabilities - List all capabilities
 */

import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/v1/capabilities
 * Get all capabilities in the system
 * No authentication required - capabilities are public metadata
 */
export async function GET(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    // Get all capabilities ordered by name
    const capabilities = await prisma.capability.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        label: true,
        description: true,
      },
    })

    return NextResponse.json({ capabilities })
  } catch (error) {
    console.error('[GET /api/v1/capabilities] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener capabilities' },
      { status: 500 }
    )
  }
}
