/**
 * Integration tests for API error handler
 * Story 0.5: Error Handling, Observability y CI/CD
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { AppError, ValidationError, AuthorizationError } from '@/lib/utils/errors'

describe('API Error Handler', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('apiErrorHandler()', () => {
    it('[P0] 0.5-INT-001: should capture AppError and return correct status code', async () => {
      const error = new ValidationError('Email is required')
      const correlationId = 'test-error-123'

      const response = apiErrorHandler(error, 'Test action', correlationId, 'user-123')

      expect(response.status).toBe(400)
    })

    it('[P0] 0.5-INT-002: should return error response with message and code', async () => {
      const error = new ValidationError('Invalid email format')
      const correlationId = 'test-error-456'

      const response = apiErrorHandler(error, 'Test action', correlationId)
      const json = await response.json()

      expect(json).toEqual({
        error: {
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          correlationId
        }
      })
    })

    it('[P1] 0.5-INT-003: should log error with correlation ID', async () => {
      const error = new ValidationError('Test error')
      const correlationId = 'test-error-789'

      apiErrorHandler(error, 'Test action', correlationId, 'user-123')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('[P0] 0.5-INT-004: should return generic error response for non-AppError', async () => {
      const error = new Error('Generic error')
      const correlationId = 'test-error-000'

      const response = apiErrorHandler(error, 'Test action', correlationId)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        error: {
          message: 'Error interno del servidor',
          code: 'INTERNAL_ERROR',
          correlationId
        }
      })
    })

    it('[P0] 0.5-INT-005: should not expose stack trace in response', async () => {
      const error = new AppError('Test error', 500, 'INTERNAL_ERROR', { detail: 'sensitive' })
      const correlationId = 'test-error-999'

      const response = apiErrorHandler(error, 'Test action', correlationId)
      const json = await response.json()

      expect(json.error).not.toHaveProperty('details')
      expect(json.error).not.toHaveProperty('stack')
    })

    it('[P1] 0.5-INT-006: should handle errors without userId', async () => {
      const error = new AuthorizationError('Access denied')
      const correlationId = 'test-error-888'

      const response = apiErrorHandler(error, 'Test action', correlationId)

      expect(response.status).toBe(403)
    })

    it('[P0] 0.5-INT-007: should include correlation ID in all error responses', async () => {
      const error = new ValidationError('Validation failed')
      const correlationId = 'test-correlation-123'

      const response = apiErrorHandler(error, 'Test action', correlationId)
      const json = await response.json()

      expect(json.error.correlationId).toBe(correlationId)
    })
  })
})
