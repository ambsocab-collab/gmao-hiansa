/**
 * Health Check Endpoint
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Health check endpoint para monitoring de servicios
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        version: process.env.npm_package_version || 'unknown'
      }
    })
  } catch {
    // Database connection failed
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      },
      { status: 503 }
    )
  }
}
