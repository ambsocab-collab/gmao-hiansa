/**
 * Story 1.1: PBAC Helper Functions Tests
 *
 * Tests cover:
 * - hasCapability function
 * - hasAllCapabilities function
 * - getOrCreateCorrelationId function
 * - logAccessDenied function
 */

import { describe, it, expect, vi } from 'vitest'
import {
  hasCapability,
  hasAllCapabilities,
  getOrCreateCorrelationId,
  logAccessDenied,
  CORRELATION_ID_HEADER
} from '@/middleware'
import { setupPBACTests } from './fixtures/pbac-fixtures'

setupPBACTests()

describe('Story 1.1: PBAC Helper Functions', () => {
  describe('hasCapability', () => {
    it('should return true when user has the specific capability', () => {
      // Given: user with capability
      const capabilities = ['can_create_failure_report', 'can_view_kpis']

      // When: checking for specific capability
      const hasIt = hasCapability(capabilities, 'can_view_kpis')

      // Then: returns true
      expect(hasIt).toBe(true)
    })

    it('should return false when user lacks the specific capability', () => {
      // Given: user without capability
      const capabilities = ['can_create_failure_report']

      // When: checking for different capability
      const hasIt = hasCapability(capabilities, 'can_view_kpis')

      // Then: returns false
      expect(hasIt).toBe(false)
    })

    it('should return false when capabilities are undefined', () => {
      // When: checking with undefined capabilities
      const hasIt = hasCapability(undefined, 'can_view_kpis')

      // Then: returns false
      expect(hasIt).toBe(false)
    })
  })

  describe('hasAllCapabilities', () => {
    it('should return true when user has all required capabilities', () => {
      // Given: user with multiple capabilities
      const userCapabilities = [
        'can_create_failure_report',
        'can_view_all_ots',
        'can_complete_ot'
      ]

      // And: route requires subset of those
      const required = ['can_view_all_ots', 'can_complete_ot']

      // When: checking
      const hasAll = hasAllCapabilities(userCapabilities, required)

      // Then: returns true
      expect(hasAll).toBe(true)
    })

    it('should return false when user lacks at least one required capability', () => {
      // Given: user with some capabilities
      const userCapabilities = ['can_create_failure_report', 'can_view_all_ots']

      // And: route requires capability user doesn't have
      const required = ['can_view_all_ots', 'can_complete_ot']

      // When: checking
      const hasAll = hasAllCapabilities(userCapabilities, required)

      // Then: returns false
      expect(hasAll).toBe(false)
    })

    it('should return true when required capabilities array is empty', () => {
      // Given: user with capabilities
      const userCapabilities = ['can_create_failure_report']

      // And: route requires no capabilities (public route)
      const required: string[] = []

      // When: checking
      const hasAll = hasAllCapabilities(userCapabilities, required)

      // Then: returns true (public route)
      expect(hasAll).toBe(true)
    })
  })

  describe('getOrCreateCorrelationId', () => {
    it('should return existing correlation ID from headers', () => {
      // Given: headers with existing correlation ID
      const existingId = 'existing-correlation-id-123'
      const headers = new Headers()
      headers.set(CORRELATION_ID_HEADER, existingId)

      // When: getting correlation ID
      const correlationId = getOrCreateCorrelationId(headers)

      // Then: returns existing ID
      expect(correlationId).toBe(existingId)
    })

    it('should generate new correlation ID when not present in headers', () => {
      // Given: headers without correlation ID
      const headers = new Headers()

      // When: getting correlation ID
      const correlationId = getOrCreateCorrelationId(headers)

      // Then: generates new UUID
      expect(correlationId).toBeTruthy()
      expect(typeof correlationId).toBe('string')
      expect(correlationId.length).toBeGreaterThan(0)
    })

    it('should generate unique correlation IDs', () => {
      // Given: empty headers
      const headers1 = new Headers()
      const headers2 = new Headers()

      // When: generating correlation IDs
      const id1 = getOrCreateCorrelationId(headers1)
      const id2 = getOrCreateCorrelationId(headers2)

      // Then: IDs are unique
      expect(id1).not.toBe(id2)
    })
  })

  describe('logAccessDenied', () => {
    it('should log access denied with required information', () => {
      // Given: console.error spy
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const userId = 'user-123'
      const path = '/users'
      const requiredCapabilities = ['can_manage_users']
      const correlationId = 'corr-456'

      // When: logging access denied
      logAccessDenied(userId, path, requiredCapabilities, correlationId)

      // Then: console.error called with structured log
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const logCall = consoleSpy.mock.calls[0][0]
      const logEntry = JSON.parse(logCall)

      expect(logEntry.level).toBe('warn')
      expect(logEntry.userId).toBe(userId)
      expect(logEntry.action).toBe('ACCESS_DENIED')
      expect(logEntry.correlationId).toBe(correlationId)
      expect(logEntry.metadata.path).toBe(path)
      expect(logEntry.metadata.requiredCapabilities).toEqual(requiredCapabilities)
      expect(logEntry.metadata.reason).toBe('Insufficient capabilities')

      consoleSpy.mockRestore()
    })

    it('should handle undefined userId in access denied log', () => {
      // Given: console.error spy
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // When: logging access denied without userId
      logAccessDenied(undefined, '/users', ['can_manage_users'])

      // Then: log contains 'unknown' userId
      const logCall = consoleSpy.mock.calls[0][0]
      const logEntry = JSON.parse(logCall)

      expect(logEntry.userId).toBe('unknown')

      consoleSpy.mockRestore()
    })
  })
})
