/**
 * Unit tests for custom error classes
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Story 0.5: Added tests for AuthenticationError
 */

import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  AuthorizationError,
  InsufficientStockError,
  InternalError,
  AuthenticationError
} from '@/lib/utils/errors'

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('[P0] 0.5-UNIT-014: should create instance with all required properties', () => {
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

    it('[P1] 0.5-UNIT-015: should generate correlation ID if not provided', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR')

      expect(error.correlationId).toBeDefined()
      expect(typeof error.correlationId).toBe('string')
      expect(error.correlationId).toHaveLength(36) // UUID format
    })

    it('[P1] 0.5-UNIT-016: should have correct default values', () => {
      const error = new AppError('Test error')

      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
    })

    it('[P1] 0.5-UNIT-017: should convert to JSON correctly', () => {
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

    it('[P2] 0.5-UNIT-018: should convert to string with correlation ID', () => {
      const correlationId = 'test-correlation-id-789'
      const error = new AppError('Test error', 500, 'TEST_ERROR', undefined, correlationId)

      const str = error.toString()

      expect(str).toBe('[TEST_ERROR] Test error (Correlation ID: test-correlation-id-789)')
    })
  })

  describe('ValidationError', () => {
    it('[P0] 0.5-UNIT-019: should extend AppError correctly', () => {
      const error = new ValidationError('Email is required')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.message).toBe('Email is required')
    })

    it('[P1] 0.5-UNIT-020: should accept details and correlation ID', () => {
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
    it('[P0] 0.5-UNIT-021: should extend AppError correctly', () => {
      const error = new AuthorizationError()

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(AuthorizationError)
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
    })

    it('[P2] 0.5-UNIT-022: should have default message in Spanish', () => {
      const error = new AuthorizationError()

      expect(error.message).toBe('No tienes permiso para realizar esta acción')
    })

    it('[P2] 0.5-UNIT-023: should accept custom message', () => {
      const error = new AuthorizationError('Custom auth error')

      expect(error.message).toBe('Custom auth error')
    })

    it('[P1] 0.5-UNIT-024: should accept details and correlation ID', () => {
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
    it('[P0] 0.5-UNIT-025: should extend AppError correctly with stock details', () => {
      const error = new InsufficientStockError(10, 15, 'repuesto-123')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(InsufficientStockError)
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('INSUFFICIENT_STOCK')
    })

    it('[P1] 0.5-UNIT-026: should include stock details in message', () => {
      const error = new InsufficientStockError(10, 15, 'repuesto-456')

      expect(error.message).toBe('Stock insuficiente: disponibles 10, solicitados 15')
    })

    it('[P1] 0.5-UNIT-027: should include stock details in details property', () => {
      const error = new InsufficientStockError(5, 10, 'repuesto-789')

      expect(error.details).toEqual({
        available: 5,
        requested: 10,
        repuestoId: 'repuesto-789'
      })
    })

    it('[P2] 0.5-UNIT-028: should accept custom correlation ID', () => {
      const correlationId = 'test-stock-error-123'
      const error = new InsufficientStockError(10, 15, 'repuesto-abc', correlationId)

      expect(error.correlationId).toBe(correlationId)
    })
  })

  describe('InternalError', () => {
    it('[P0] 0.5-UNIT-029: should extend AppError correctly', () => {
      const error = new InternalError()

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(InternalError)
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
    })

    it('[P2] 0.5-UNIT-030: should have default message in Spanish', () => {
      const error = new InternalError()

      expect(error.message).toBe('Error interno del servidor')
    })

    it('[P2] 0.5-UNIT-031: should accept custom message', () => {
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

  // Story 0.5: Added tests for AuthenticationError
  describe('AuthenticationError', () => {
    it('should extend AppError correctly', () => {
      const error = new AuthenticationError()

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(AuthenticationError)
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should have default message in Spanish', () => {
      const error = new AuthenticationError()

      expect(error.message).toBe('Credenciales inválidas')
    })

    it('should accept custom message', () => {
      const error = new AuthenticationError('Usuario o contraseña incorrectos')

      expect(error.message).toBe('Usuario o contraseña incorrectos')
    })

    it('should accept details and correlation ID', () => {
      const correlationId = 'test-auth-error-123'
      const error = new AuthenticationError(
        'Login failed',
        { email: 'test@example.com' },
        correlationId
      )

      expect(error.details).toEqual({ email: 'test@example.com' })
      expect(error.correlationId).toBe(correlationId)
    })

    it('should convert to JSON correctly', () => {
      const error = new AuthenticationError('Invalid credentials')

      const json = error.toJSON()

      expect(json).toEqual({
        name: 'AuthenticationError',
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid credentials',
        statusCode: 401,
        details: undefined,
        timestamp: error.timestamp.toISOString(),
        correlationId: error.correlationId
      })
    })
  })
})
