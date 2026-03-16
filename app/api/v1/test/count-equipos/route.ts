/**
 * Test API: Count equipos in database
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Used by E2E tests to verify equipos are seeded correctly
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Security: Only allow in test/development environments
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Count endpoint not available in production' },
      { status: 403 }
    );
  }

  // Check for test header
  const testHeader = request.headers.get('x-playwright-test');
  if (!testHeader && process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Count endpoint only available for automated tests' },
      { status: 403 }
    );
  }

  try {
    const { prisma } = await import('@/lib/db');

    const count = await prisma.equipo.count();

    return NextResponse.json({
      count,
      message: `Database has ${count} equipos`
    });
  } catch (error) {
    console.error('[count-equipos] Error:', error);
    return NextResponse.json(
      { error: 'Failed to count equipos' },
      { status: 500 }
    );
  }
}
