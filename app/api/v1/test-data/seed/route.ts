// app/api/v1/test-data/seed/route.ts
// Endpoint para reset de database con seed data (Solo desarrollo)
// Story 0.2: Database Schema con Jerarquía 5 Niveles
// Story 0.5: Added performance tracking for seed operations

import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { trackPerformance } from '@/lib/observability/performance'
import { CORRELATION_ID_HEADER } from '@/middleware'

const execAsync = promisify(exec)

/**
 * POST /api/v1/test-data/seed
 * Reset database con seed data para desarrollo/testing
 *
 * ⚠️ IMPORTANT: Solo disponible en desarrollo!
 * En producción, este endpoint debería estar deshabilitado
 */
export async function POST(request: NextRequest) {
  // Get correlation ID from headers
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || crypto.randomUUID()

  // Verificar que estamos en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint not available in production' },
      { status: 403 }
    )
  }

  try {
    // Story 0.5: Track seed operation performance
    // Seed operations can take significant time (>1s threshold)
    const seedPerf = trackPerformance('test_data_seed', correlationId)

    // Ejecutar el seed script de Prisma
    // Nota: Usamos `npx prisma db seed` que ejecuta el script configurado en package.json
    const { stdout } = await execAsync('npx prisma db seed', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    })

    // End performance tracking with 1000ms threshold (1 second)
    seedPerf.end(1000)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout,
      timestamp: new Date().toISOString(),
      correlationId,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
        correlationId,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/v1/test-data/seed
 * Retorna información sobre el endpoint de seed
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/test-data/seed',
    method: 'POST',
    description: 'Reset database with seed data (development only)',
    environment: process.env.NODE_ENV,
    available: process.env.NODE_ENV !== 'production',
    warning: 'This will DELETE all existing data and reseed the database',
  })
}
