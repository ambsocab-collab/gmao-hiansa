// app/api/v1/test-data/seed/route.ts
// Endpoint para reset de database con seed data (Solo desarrollo)
// Story 0.2: Database Schema con Jerarquía 5 Niveles

import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * POST /api/v1/test-data/seed
 * Reset database con seed data para desarrollo/testing
 *
 * ⚠️ IMPORTANT: Solo disponible en desarrollo!
 * En producción, este endpoint debería estar deshabilitado
 */
export async function POST() {
  // Verificar que estamos en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint not available in production' },
      { status: 403 }
    )
  }

  try {
    // Ejecutar el seed script de Prisma
    // Nota: Usamos `npx prisma db seed` que ejecuta el script configurado en package.json
    const { stdout } = await execAsync('npx prisma db seed', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
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
