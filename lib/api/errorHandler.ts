/**
 * API Error Handler
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Error handler para API Routes
 * Captura todas las excepciones y retorna respuesta consistentemente formateada
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/observability/logger'
import { AppError } from '@/lib/utils/errors'

/**
 * Error handler para API Routes
 * Captura todas las excepciones y retorna respuesta consistentemente formateada
 */
export function apiErrorHandler(
  error: unknown,
  action: string,
  correlationId: string,
  userId?: string
): NextResponse {
  // Log error completo
  logger.error(error as Error, action, correlationId, userId)

  // Si es AppError, usar sus datos pero usar el correlationId del request
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          correlationId  // Usar correlationId del request, no del error
        }
      },
      { status: error.statusCode }
    )
  }

  // Error genérico (no exponer stack trace)
  return NextResponse.json(
    {
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        correlationId
      }
    },
    { status: 500 }
  )
}
