/**
 * Test Reset Failure Reports API
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Endpoint para resetear los reportes de avería en tests E2E
 * Solo disponible en ambiente de desarrollo
 * Restaura los 3 reportes iniciales creados por seed.ts
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/v1/test/reset-failure-reports
 * Resetea los reportes de avería para tests E2E
 *
 * Esta función:
 * 1. Elimina todos los WorkOrders creados durante tests
 * 2. Elimina todos los FailureReports
 * 3. Re-crea los 3 FailureReports iniciales del seed (AV-2026-001, AV-2026-002, AV-2026-003)
 *
 * WARNING: Only for testing purposes!
 */
export async function POST(request: Request) {
  // Only allow in test/development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    // 1. Delete all work orders (to remove foreign key constraints)
    await prisma.workOrderAssignment.deleteMany({})
    await prisma.workOrder.deleteMany({})

    // 2. Delete all failure reports
    await prisma.failureReport.deleteMany({})

    // 3. Get test users and equipment
    const tecnico = await prisma.user.findUnique({
      where: { email: 'tecnico@hiansa.com' }
    })

    if (!tecnico) {
      return NextResponse.json({ error: 'Test user not found. Run seed first.' }, { status: 404 })
    }

    const equipos = await prisma.equipo.findMany({
      include: { linea: { include: { planta: true } } }
    })

    if (equipos.length < 4) {
      return NextResponse.json({ error: 'Not enough equipos. Run seed first.' }, { status: 404 })
    }

    // 4. Re-create the 3 initial failure reports from seed.ts
    // Use upsert to handle case where they already exist
    const failureReport1 = await prisma.failureReport.upsert({
      where: { numero: 'AV-2026-001' },
      update: {},
      create: {
        numero: 'AV-2026-001',
        descripcion: 'Compresor haciendo ruido excesivo y vibracion anormal',
        tipo: 'avería',
        fotoUrl: null,
        equipoId: equipos[2].id, // Compresor
        estado: 'NUEVO',
        reportadoPor: tecnico.id,
      },
    })

    const failureReport2 = await prisma.failureReport.upsert({
      where: { numero: 'AV-2026-002' },
      update: {},
      create: {
        numero: 'AV-2026-002',
        descripcion: 'Torno CNC presenta errores de posicionamiento en eje X',
        tipo: 'avería',
        fotoUrl: null,
        equipoId: equipos[1].id, // Torno CNC
        estado: 'NUEVO',
        reportadoPor: tecnico.id,
      },
    })

    const failureReport3 = await prisma.failureReport.upsert({
      where: { numero: 'AV-2026-003' },
      update: {},
      create: {
        numero: 'AV-2026-003',
        descripcion: 'Transportadora tiene banda desalineada',
        tipo: 'reparación', // For color coding tests
        fotoUrl: null,
        equipoId: equipos[3].id, // Transportadora
        estado: 'NUEVO',
        reportadoPor: tecnico.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Failure reports reset to initial state',
      resetReports: [
        failureReport1.numero,
        failureReport2.numero,
        failureReport3.numero,
      ],
    })
  } catch (error) {
    console.error('[reset-failure-reports] Error:', error)
    return NextResponse.json(
      { error: 'Failed to reset failure reports', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
