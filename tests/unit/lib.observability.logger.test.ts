/**
 * Unit tests for structured logger
 * Story 0.5: Error Handling, Observability y CI/CD
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { logger, Logger, LogLevel } from '@/lib/observability/logger'
import { AppError } from '@/lib/utils/errors'

describe('Logger - Structured Logging', () => {
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Spy on console methods
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore spies
    consoleDebugSpy.mockRestore()
    consoleInfoSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('Logger.formatLog()', () => {
    it('[P2] 0.5-UNIT-001: should format log context as JSON', () => {
      const logger = new Logger()
      const context = {
        timestamp: '2024-03-09T12:00:00.000Z',
        level: LogLevel.INFO,
        userId: 'user-123',
        action: 'test_action',
        correlationId: 'corr-123',
        metadata: { key: 'value' }
      }

      // Access private method via type assertion for testing
      const formattedLog = (logger as any).formatLog(context)

      expect(typeof formattedLog).toBe('string')
      const parsed = JSON.parse(formattedLog)
      expect(parsed).toEqual(context)
    })
  })

  describe('Logger.debug()', () => {
    it('[P2] 0.5-UNIT-002: should log debug messages with correlation ID', () => {
      const correlationId = 'test-debug-123'
      logger.debug('Test debug action', correlationId, { debugData: 'test' })

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)

      const loggedJSON = consoleDebugSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.level).toBe(LogLevel.DEBUG)
      expect(logged.action).toBe('Test debug action')
      expect(logged.correlationId).toBe(correlationId)
      expect(logged.metadata).toEqual({ debugData: 'test' })
      expect(logged.timestamp).toBeDefined()
    })

    it('[P3] 0.5-UNIT-003: should log debug messages without metadata', () => {
      const correlationId = 'test-debug-456'
      logger.debug('Test debug action', correlationId)

      const loggedJSON = consoleDebugSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.level).toBe(LogLevel.DEBUG)
      expect(logged.metadata).toBeUndefined()
    })
  })

  describe('Logger.info()', () => {
    it('[P1] 0.5-UNIT-004: should log info messages with userId and correlation ID', () => {
      const userId = 'user-info-123'
      const correlationId = 'test-info-123'
      logger.info(userId, 'Test info action', correlationId, { infoData: 'test' })

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1)

      const loggedJSON = consoleInfoSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.level).toBe(LogLevel.INFO)
      expect(logged.userId).toBe(userId)
      expect(logged.action).toBe('Test info action')
      expect(logged.correlationId).toBe(correlationId)
      expect(logged.metadata).toEqual({ infoData: 'test' })
    })

    it('[P2] 0.5-UNIT-005: should log info messages with undefined userId', () => {
      const correlationId = 'test-info-456'
      logger.info(undefined, 'Test info action', correlationId)

      const loggedJSON = consoleInfoSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.userId).toBeUndefined()
      expect(logged.action).toBe('Test info action')
    })
  })

  describe('Logger.warn()', () => {
    it('[P1] 0.5-UNIT-006: should log warning messages with userId and correlation ID', () => {
      const userId = 'user-warn-123'
      const correlationId = 'test-warn-123'
      logger.warn(userId, 'Test warning action', correlationId, { warnData: 'test' })

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)

      const loggedJSON = consoleWarnSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.level).toBe(LogLevel.WARN)
      expect(logged.userId).toBe(userId)
      expect(logged.action).toBe('Test warning action')
      expect(logged.correlationId).toBe(correlationId)
      expect(logged.metadata).toEqual({ warnData: 'test' })
    })
  })

  describe('Logger.error()', () => {
    it('[P0] 0.5-UNIT-007: should log error with AppError details and stack in development', async () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR', { detail: 'test' })
      const correlationId = 'test-error-123'

      // Set development mode
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'development'

      logger.error(error, 'Test error action', correlationId, 'user-123')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)

      const loggedJSON = consoleErrorSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.level).toBe(LogLevel.ERROR)
      expect(logged.userId).toBe('user-123')
      expect(logged.action).toBe('Test error action')
      expect(logged.correlationId).toBe(correlationId)
      expect(logged.error).toEqual({
        code: 'TEST_ERROR',
        message: 'Test error',
        stack: expect.any(String)
      })

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    })

    it('[P0] 0.5-UNIT-008: should log error without stack trace in production', async () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR')
      const correlationId = 'test-error-456'

      // Set production mode
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'production'

      logger.error(error, 'Test error action', correlationId)

      const loggedJSON = consoleErrorSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.error).toEqual({
        code: 'TEST_ERROR',
        message: 'Test error',
        stack: undefined
      })

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    })

    it('[P1] 0.5-UNIT-009: should log generic error with UNKNOWN_ERROR code', () => {
      const error = new Error('Generic error')
      const correlationId = 'test-error-789'

      // Set development mode for consistent test behavior
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'development'

      logger.error(error, 'Test generic error', correlationId)

      const loggedJSON = consoleErrorSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.error).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Generic error',
        stack: expect.any(String)
      })

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    })

    it('[P2] 0.5-UNIT-010: should handle error without userId', async () => {
      const error = new AppError('Test error', 500, 'INTERNAL_ERROR')
      const correlationId = 'test-error-000'

      logger.error(error, 'Test error without user', correlationId)

      const loggedJSON = consoleErrorSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.userId).toBeUndefined()
      expect(logged.action).toBe('Test error without user')
    })
  })

  describe('Log structure', () => {
    it('[P1] 0.5-UNIT-011: should include ISO timestamp in all logs', () => {
      const correlationId = 'test-timestamp-123'
      logger.debug('Test timestamp', correlationId)

      const loggedJSON = consoleDebugSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('[P1] 0.5-UNIT-012: should include all required fields in info logs', () => {
      const correlationId = 'test-fields-123'
      logger.info('user-123', 'Test fields', correlationId, { extra: 'data' })

      const loggedJSON = consoleInfoSpy.mock.calls[0][0] as string
      const logged = JSON.parse(loggedJSON)

      expect(logged).toHaveProperty('timestamp')
      expect(logged).toHaveProperty('level')
      expect(logged).toHaveProperty('userId')
      expect(logged).toHaveProperty('action')
      expect(logged).toHaveProperty('correlationId')
      expect(logged).toHaveProperty('metadata')
    })
  })
})
