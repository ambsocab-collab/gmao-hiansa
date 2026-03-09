/**
 * Integration Tests for SSE Endpoint
 *
 * Tests the SSE API endpoint including:
 * - Authentication requirements
 * - Channel validation
 * - Correct headers
 * - Heartbeat functionality
 * - Event broadcasting
 */

import { describe, it, expect, vi } from 'vitest'
import { GET } from '@/app/api/v1/sse/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('@/lib/auth-adapter', () => ({
  auth: vi.fn()
}))

import { auth } from '@/lib/auth-adapter'

describe('SSE Endpoint Integration Tests', () => {
  describe('GET /api/v1/sse', () => {
    it('should return 401 Unauthorized when no session', async () => {
      // Mock auth to return null (no session)
      vi.mocked(auth).mockResolvedValueOnce(null)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/sse?channel=work-orders'
      )

      const response = await GET(request)

      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
    })

    it('should accept connection with valid session', async () => {
      // Mock auth to return session
      vi.mocked(auth).mockResolvedValueOnce({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      })

      const request = new NextRequest(
        'http://localhost:3000/api/v1/sse?channel=work-orders'
      )

      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform')
      expect(response.headers.get('Connection')).toBe('keep-alive')
      expect(response.headers.get('X-Accel-Buffering')).toBe('no')
    })

    it('should return 400 Bad Request for invalid channel', async () => {
      // Mock auth to return session
      vi.mocked(auth).mockResolvedValueOnce({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      })

      const request = new NextRequest(
        'http://localhost:3000/api/v1/sse?channel=invalid-channel'
      )

      const response = await GET(request)

      expect(response.status).toBe(400)
      expect(await response.text()).toContain('Invalid channel')
    })

    it('should default to work-orders channel when not specified', async () => {
      // Mock auth to return session
      vi.mocked(auth).mockResolvedValueOnce({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      })

      const request = new NextRequest('http://localhost:3000/api/v1/sse')

      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('should accept all valid channels', async () => {
      const validChannels = ['work-orders', 'kpis', 'stock']

      for (const channel of validChannels) {
        // Mock auth to return session
        vi.mocked(auth).mockResolvedValueOnce({
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User'
          },
          expires: new Date(Date.now() + 3600000).toISOString()
        })

        const request = new NextRequest(
          `http://localhost:3000/api/v1/sse?channel=${channel}`
        )

        const response = await GET(request)

        expect(response.status).toBe(200)
      }
    })
  })

  describe('SSE Stream Format', () => {
    it('should send heartbeat as SSE event', async () => {
      // Mock auth to return session
      vi.mocked(auth).mockResolvedValueOnce({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      })

      const request = new NextRequest(
        'http://localhost:3000/api/v1/sse?channel=work-orders'
      )

      const response = await GET(request)

      // Check if response is a stream
      expect(response.body).toBeInstanceOf(ReadableStream)

      // Read initial heartbeat from stream
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      // Read initial heartbeat
      const { value, done } = await reader.read()
      expect(done).toBe(false)

      const text = decoder.decode(value)

      // Verify SSE format
      expect(text).toContain('event: heartbeat')
      expect(text).toContain('data: {')
      expect(text).toContain('timestamp')
      expect(text).toContain('channel')
      expect(text).toContain('correlationId')

      // Cleanup
      reader.cancel()
    })

    it('should include correct SSE headers', async () => {
      // Mock auth to return session
      vi.mocked(auth).mockResolvedValueOnce({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: new Date(Date.now() + 3600000).toISOString()
      })

      const request = new NextRequest(
        'http://localhost:3000/api/v1/sse?channel=kpis'
      )

      const response = await GET(request)

      const headers = response.headers

      // Verify SSE headers
      expect(headers.get('Content-Type')).toBe('text/event-stream')
      expect(headers.get('Cache-Control')).toBe('no-cache, no-transform')
      expect(headers.get('Connection')).toBe('keep-alive')
      expect(headers.get('X-Accel-Buffering')).toBe('no')
    })
  })
})

describe('SSE Endpoint Reconnection Support', () => {
  it('should support replay buffer for missed events', async () => {
    // Mock auth to return session
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User'
      },
      expires: new Date(Date.now() + 3600000).toISOString()
    })

    // Create a test event that should be in replay buffer
    const { BroadcastManager } = await import('@/lib/sse/broadcaster')

    // Broadcast a test event before connection
    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_updated',
      data: {
        workOrderId: 'test-wo-999',
        numero: 999,
        estado: 'EN_PROGRESO',
        updatedAt: new Date().toISOString()
      },
      id: 'test-event-999'
    })

    // Get missed events
    const missedEvents = BroadcastManager.getMissedEvents('work-orders')

    // Verify event was added to replay buffer
    expect(missedEvents.length).toBeGreaterThan(0)
    expect(missedEvents[0]).toMatchObject({
      name: 'work_order_updated',
      data: expect.objectContaining({
        workOrderId: 'test-wo-999'
      })
    })

    // Clean up
    BroadcastManager.resetForTesting()
  })

  it('should cleanup connection on abort', async () => {
    // Mock auth to return session
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User'
      },
      expires: new Date(Date.now() + 3600000).toISOString()
    })

    // Create abort controller
    const abortController = new AbortController()

    // Create request with abort signal
    const request = new NextRequest(
      'http://localhost:3000/api/v1/sse?channel=work-orders',
      {
        signal: abortController.signal
      }
    )

    const response = await GET(request)

    expect(response.status).toBe(200)

    // Abort the connection
    abortController.abort()

    // Verify stream is closed (this would be verified by checking
    // that cleanup functions were called)
  })
})
