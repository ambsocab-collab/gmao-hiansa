/**
 * Test API: Check if user exists
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Used by E2E tests to verify database seed
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        deleted: true,
        forcePasswordReset: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.deleted) {
      return NextResponse.json({ error: 'User is deleted' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
      forcePasswordReset: user.forcePasswordReset,
    });
  } catch (error) {
    console.error('[check-user] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
