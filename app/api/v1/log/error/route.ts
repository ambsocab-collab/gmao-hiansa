/**
 * Client Error Log Endpoint
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Receives error logs from client-side components and logs them using structured logger
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/observability/logger'
import { CORRELATION_ID_HEADER } from '@/middleware'

export async function POST(request: NextRequest) {
  // Get correlation ID from headers (outside try block for use in catch)
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || crypto.randomUUID()

  try {
    // Parse error log from request body
    const errorLog = await request.json()

    // Log error using structured logger
    logger.error(
      {
        message: errorLog.message || 'Unknown error',
        stack: errorLog.stack,
        name: 'ClientError'
      } as Error,
      'CLIENT_ERROR_BOUNDARY',
      correlationId
    )

    return NextResponse.json({ success: true, correlationId })
  } catch (error) {
    // If logging fails, log to stderr to avoid cascading errors
    // Using stderr for error-level output (POSIX standard)
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      action: 'LOG_ENDPOINT_FAILED',
      error: {
        code: 'LOG_ENDPOINT_ERROR',
        message: errorObj.message,
        stack: process.env.NODE_ENV === 'development' ? errorObj.stack : undefined
      },
      correlationId
    }))
    return NextResponse.json({
      error: {
        message: 'Failed to log error',
        code: 'LOG_ENDPOINT_ERROR',
        correlationId
      }
    }, { status: 500 })
  }
}
