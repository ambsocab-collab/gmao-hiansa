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
 * Type guard para verificar si un error es Error instance
 */
function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Type guard para verificar si un error es AppError
 */
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Error handler para API Routes
 * Captura todas las excepciones y retorna respuesta consistentemente formateada
 *
 * @param error - The error to handle (unknown type for type safety)
 * @param action - The action being performed when error occurred
 * @param correlationId - Request correlation ID for tracking
 * @param userId - Optional user ID for logging
 * @returns NextResponse with appropriate error status and message
 */
export function apiErrorHandler(
  error: unknown,
  action: string,
  correlationId: string,
  userId?: string
): NextResponse {
  // Log error completo - validate that error is Error instance first
  const errorObj = isError(error) ? error : new Error(String(error))
  logger.error(errorObj, action, correlationId, userId)

  // Si es AppError, usar sus datos pero usar el correlationId del request
  if (isAppError(error)) {
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
