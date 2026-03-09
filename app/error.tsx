'use client'

/**
 * Root Error Boundary
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Error boundary para Next.js App Router
 * Captura errores globales y muestra UI amigable
 * Story 0.5: Updated to use structured logger via client-side logging utility
 */

import { useEffect } from 'react'
import { logErrorBoundary } from '@/lib/observability/client-logger'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Story 0.5: Log error al servidor usando structured logger
    logErrorBoundary(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Algo salió mal</h2>
        <p className="text-gray-600 mb-4">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Correlation ID: {error.digest || 'N/A'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  )
}
