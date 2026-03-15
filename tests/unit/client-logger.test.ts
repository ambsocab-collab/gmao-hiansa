/**
 * Tests para Client-Side Logger
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Tests para validar:
 * - Client error logging utility
 * - Error boundary logging hook
 * - Browser environment safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Client Logger', () => {
  describe('getUserAgent function', () => {
    it('should return user agent when window is defined', async () => {
      // jsdom environment provides window.navigator
      const { getUserAgent } = await import('@/lib/observability/client-logger')

      const userAgent = getUserAgent()

      // In jsdom test environment, window is defined with a fake user agent
      expect(userAgent).toBeDefined()
      expect(typeof userAgent).toBe('string')
      expect(userAgent.length).toBeGreaterThan(0)
    })
  })

  describe('getCurrentUrl function', () => {
    it('should return current URL when window is defined', async () => {
      const { getCurrentUrl } = await import('@/lib/observability/client-logger')

      const url = getCurrentUrl()

      // In jsdom test environment, window.location is defined
      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
      expect(url).toMatch(/^https?:\/\//)
    })
  })

  describe('logClientError function', () => {
    beforeEach(() => {
      // Mock fetch to succeed
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ success: true })
        } as Response)
      )
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should send error log to server endpoint', async () => {
      const { logClientError } = await import('@/lib/observability/client-logger')

      const errorLog = {
        message: 'Test error',
        stack: 'Error: Test error\n    at test.ts:1:1',
        digest: 'test-digest-123'
      }

      await logClientError(errorLog)

      expect(fetch).toHaveBeenCalledWith('/api/v1/log/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('"message":"Test error"')
      })
    })

    it('should include userAgent and url in error log', async () => {
      const { logClientError } = await import('@/lib/observability/client-logger')

      const errorLog = {
        message: 'Test error'
      }

      await logClientError(errorLog)

      expect(fetch).toHaveBeenCalled()
      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      const body = JSON.parse(fetchCall[1]?.body as string)

      // In jsdom environment, window is defined so we get actual values
      expect(body.userAgent).toBeDefined()
      expect(body.url).toBeDefined()
    })

    it('should include timestamp in error log', async () => {
      const { logClientError } = await import('@/lib/observability/client-logger')

      const errorLog = {
        message: 'Test error'
      }

      await logClientError(errorLog)

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      const body = JSON.parse(fetchCall[1]?.body as string)

      expect(body.timestamp).toBeDefined()
      expect(new Date(body.timestamp)).toBeInstanceOf(Date)
    })

    it('should handle fetch errors gracefully', async () => {
      const { logClientError } = await import('@/lib/observability/client-logger')

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock fetch to fail
      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      )

      const errorLog = {
        message: 'Test error'
      }

      await logClientError(errorLog)

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('logErrorBoundary function', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      // Mock fetch to succeed
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ success: true })
        } as Response)
      )
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it('should log error boundary errors', async () => {
      const { logErrorBoundary } = await import('@/lib/observability/client-logger')

      const error = new Error('Test error')
      error.stack = 'Error: Test error\n    at test.ts:1:1'

      logErrorBoundary(error)

      // Wait for async logging
      vi.advanceTimersByTime(10)

      expect(fetch).toHaveBeenCalled()
    })

    it('should include digest in error log if present', async () => {
      const { logErrorBoundary } = await import('@/lib/observability/client-logger')

      const error = new Error('Test error') as Error & { digest?: string }
      error.digest = 'test-digest-123'

      logErrorBoundary(error)

      // Wait for async logging
      vi.advanceTimersByTime(10)

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      const body = JSON.parse(fetchCall[1]?.body as string)

      expect(body.digest).toBe('test-digest-123')
    })

    it('should log to console in development mode', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const { logErrorBoundary } = await import('@/lib/observability/client-logger')

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const error = new Error('Test error')
      error.digest = 'test-digest-123'

      logErrorBoundary(error)

      // Wait for async logging
      vi.advanceTimersByTime(10)

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR_BOUNDARY]', {
        message: 'Test error',
        stack: error.stack,
        digest: 'test-digest-123'
      })

      process.env.NODE_ENV = originalEnv
      consoleErrorSpy.mockRestore()
    })
  })
})
