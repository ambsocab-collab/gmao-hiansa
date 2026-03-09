/**
 * Unit tests for custom error classes
 * Story 0.5: Error Handling, Observability y CI/CD
 */

import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  AuthorizationError,
  InsufficientStockError,
  InternalError
} from '@/lib/utils/errors'

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create instance with all required properties', () => {
      const correlationId = 'test-correlation-id-123'
      const error = new AppError(
        'Test error message',
        500,
        'TEST_ERROR',
        { detail: 'test detail' },
        correlationId
      )

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Test error message')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.details).toEqual({ detail: 'test detail' })
      expect(error.correlationId).toBe(correlationId)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should generate correlation ID if not provided', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR')

      expect(error.correlationId).toBeDefined()
      expect(typeof error.correlationId).toBe('string')
      expect(error.correlationId).toHaveLength(36) // UUID format
    })

    it('should have correct default values', () => {
      const error = new AppError('Test error')

      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
    })

    it('should convert to JSON correctly', () => {
      const correlationId = 'test-correlation-id-456'
      const error = new AppError(
        'Test error',
        400,
        'VALIDATION_ERROR',
        { field: 'email' },
        correlationId
      )

      const json = error.toJSON()

      expect(json).toEqual({
        name: 'AppError',
        code: 'VALIDATION_ERROR',
        message: 'Test error',
        statusCode: 400,
        details: { field: 'email' },
        timestamp: error.timestamp.toISOString(),
        correlationId
      })
    })

    it('should convert to string with correlation ID', () => {
      const correlationId = 'test-correlation-id-789'
      const error = new AppError('Test error', 500, 'TEST_ERROR', undefined, correlationId)

      const str = error.toString()

      expect(str).toBe('[TEST_ERROR] Test error (Correlation ID: test-correlation-id-789)')
    })
  })

  describe('ValidationError', () => {
    it('should extend AppError correctly', () => {
      const error = new ValidationError('Email is required')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.message).toBe('Email is required')
    })

    it('should accept details and correlation ID', () => {
      const correlationId = 'test-validation-error-123'
      const error = new ValidationError(
        'Invalid email format',
        { field: 'email', value: 'invalid' },
        correlationId
      )

      expect(error.details).toEqual({ field: 'email', value: 'invalid' })
      expect(error.correlationId).toBe(correlationId)
    })
  })

  describe('AuthorizationError', () => {
    it('should extend AppError correctly', () => {
      const error = new AuthorizationError()

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(AuthorizationError)
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
    })

    it('should have default message in Spanish', () => {
      const error = new AuthorizationError()

      expect(error.message).toBe('No tienes permiso para realizar esta acción')
    })

    it('should accept custom message', () => {
      const error = new AuthorizationError('Custom auth error')

      expect(error.message).toBe('Custom auth error')
    })

    it('should accept details and correlation ID', () => {
      const correlationId = 'test-auth-error-123'
      const error = new AuthorizationError(
        'Access denied',
        { requiredCapability: 'can_delete_users' },
        correlationId
      )

      expect(error.details).toEqual({ requiredCapability: 'can_delete_users' })
      expect(error.correlationId).toBe(correlationId)
    })
  })

  describe('InsufficientStockError', () => {
    it('should extend AppError correctly with stock details', () => {
      const error = new InsufficientStockError(10, 15, 'repuesto-123')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(InsufficientStockError)
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('INSUFFICIENT_STOCK')
    })

    it('should include stock details in message', () => {
      const error = new InsufficientStockError(10, 15, 'repuesto-456')

      expect(error.message).toBe('Stock insuficiente: disponibles 10, solicitados 15')
    })

    it('should include stock details in details property', () => {
      const error = new InsufficientStockError(5, 10, 'repuesto-789')

      expect(error.details).toEqual({
        available: 5,
        requested: 10,
        repuestoId: 'repuesto-789'
      })
    })

    it('should accept custom correlation ID', () => {
      const correlationId = 'test-stock-error-123'
      const error = new InsufficientStockError(10, 15, 'repuesto-abc', correlationId)

      expect(error.correlationId).toBe(correlationId)
    })
  })

  describe('InternalError', () => {
    it('should extend AppError correctly', () => {
      const error = new InternalError()

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(InternalError)
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
    })

    it('should have default message in Spanish', () => {
      const error = new InternalError()

      expect(error.message).toBe('Error interno del servidor')
    })

    it('should accept custom message', () => {
      const error = new InternalError('Custom internal error')

      expect(error.message).toBe('Custom internal error')
    })

    it('should accept details and correlation ID', () => {
      const correlationId = 'test-internal-error-123'
      const error = new InternalError(
        'Database connection failed',
        { database: 'neon', error: 'connection_timeout' },
        correlationId
      )

      expect(error.details).toEqual({
        database: 'neon',
        error: 'connection_timeout'
      })
      expect(error.correlationId).toBe(correlationId)
    })
  })
})
