/**
 * Test API: Seed database
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Used by E2E tests to automatically seed database before running tests
 * This endpoint should ONLY be available in test/development environments
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  // Security: Only allow in test/development environments
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint not available in production' },
      { status: 403 }
    );
  }

  // Check for test header to prevent accidental calls
  const testHeader = request.headers.get('x-playwright-test');
  if (!testHeader && process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Seed endpoint only available for automated tests' },
      { status: 403 }
    );
  }

  try {
    console.log('[seed] Starting database seed...');

    // Run Prisma seed command
    const { stdout, stderr } = await execAsync('npx prisma db seed', {
      env: {
        ...process.env,
      }
    });

    if (stderr && !stderr.includes('warning')) {
      console.error('[seed] stderr:', stderr);
    }

    console.log('[seed] Seed completed successfully');
    console.log('[seed] stdout:', stdout);

    // Verify seed was successful by checking for required users
    // Note: We import prisma here to avoid issues during build
    const { prisma } = await import('@/lib/db');

    const userCount = await prisma.user.count();
    const capabilityCount = await prisma.capability.count();

    return NextResponse.json({
      success: true,
      summary: {
        users: userCount,
        capabilities: capabilityCount,
        message: 'Database seeded successfully'
      }
    });
  } catch (error) {
    console.error('[seed] Error:', error);
    return NextResponse.json(
      {
        error: 'Seed failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method to check if seed is needed
export async function GET(request: NextRequest) {
  // Security: Only allow in test/development environments
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    const { prisma } = await import('@/lib/db');

    // Check if required users exist
    const requiredUsers = [
      'admin@hiansa.com',
      'tecnico@hiansa.com',
      'supervisor@hiansa.com',
      'new.user@example.com'
    ];

    const existingUsers = await prisma.user.findMany({
      where: {
        email: { in: requiredUsers },
        deleted: false
      },
      select: { email: true }
    });

    const existingEmails = existingUsers.map(u => u.email);
    const missingUsers = requiredUsers.filter(email => !existingEmails.includes(email));

    return NextResponse.json({
      seeded: missingUsers.length === 0,
      missingUsers,
      existingUsers: existingEmails
    });
  } catch (error) {
    console.error('[seed-check] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
