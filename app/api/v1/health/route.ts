/**
 * Health Check Endpoint
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Health check endpoint para monitoring de servicios
 * Story 0.5: Integrated performance tracking for Prisma queries
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { CORRELATION_ID_HEADER } from '@/middleware'
import { logger } from '@/lib/observability/logger'

export async function GET(request: NextRequest) {
  // Get correlation ID from headers
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || crypto.randomUUID()

  try {
    // Story 0.5: Track database connection performance
    // AC specifies >1s (1000ms) threshold for slow queries
    const perf = trackPerformance('health_check_db_query', correlationId)

    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    // End performance tracking with 1000ms threshold (matches AC)
    perf.end(1000)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      correlationId,
      services: {
        database: 'up',
        version: process.env.npm_package_version || 'unknown'
      }
    })
  } catch (error) {
    // Story 0.5: Log database connection failure
    const errorObj = error instanceof Error ? error : new Error(String(error))
    logger.error(errorObj, 'health_check_db_failed', correlationId)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        correlationId,
        error: 'Database connection failed'
      },
      { status: 503 }
    )
  }
}
