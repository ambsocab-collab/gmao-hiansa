/**
 * Unit Tests for SSEClient
 *
 * Tests the SSE client class including:
 * - Connection lifecycle
 * - Event handlers
 * - Disconnect functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SSEClient } from '@/lib/sse/client'
import type { SSEChannel } from '@/types/sse'

// Fixed timestamp for deterministic tests
const FIXED_TIMESTAMP = Date.parse('2024-01-01T00:00:00Z')

// Mock EventSource
class MockEventSource {
  public readonly url: string
  public readyState: number = EventSource.CONNECTING
  public onopen: ((this: EventSource, event: Event) => unknown) | null = null
  public onmessage: ((this: EventSource, event: MessageEvent) => unknown) | null = null
  public onerror: ((this: EventSource, event: Event) => unknown) | null = null

  private eventListeners: Map<string, Set<(event: Event) => void>> = new Map()

  constructor(url: string) {
    this.url = url
    // Simulate connection after 100ms
    setTimeout(() => {
      this.readyState = EventSource.OPEN
      if (this.onopen) {
        this.onopen(new Event('open'))
      }
    }, 100)
  }

  addEventListener(type: string, listener: (event: Event) => void): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set())
    }
    this.eventListeners.get(type)!.add(listener)
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    const listeners = this.eventListeners.get(type)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  // Helper method to trigger events for testing
  public triggerEvent(type: string, data: unknown): void {
    const listeners = this.eventListeners.get(type)
    if (listeners) {
      const event = new MessageEvent(type, { data })
      listeners.forEach((listener) => listener(event))
    }
  }

  close(): void {
    this.readyState = EventSource.CLOSED
  }

  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
}

// Setup global EventSource mock
vi.stubGlobal('EventSource', MockEventSource)

describe('SSEClient', () => {
  let testChannel: SSEChannel
  let client: SSEClient

  beforeEach(() => {
    vi.useFakeTimers()
    testChannel = 'work-orders'
    client = new SSEClient(testChannel)
  })

  afterEach(() => {
    vi.useRealTimers()
    client.disconnect()
  })

  describe('constructor', () => {
    it('should create client with channel', () => {
      expect(client).toBeInstanceOf(SSEClient)
      expect(client.active()).toBe(false)
    })
  })

  describe('connect()', () => {
    it('should create EventSource connection', () => {
      client.connect()

      // Wait for connection
      vi.advanceTimersByTime(150)
      expect(client.active()).toBe(true)
    })

    it('should disconnect existing connection before connecting', async () => {
      client.connect()

      // Wait for first connection
      vi.advanceTimersByTime(150)

      // Connect again
      client.connect()

      // Wait for second connection
      vi.advanceTimersByTime(150)

      expect(client.active()).toBe(true)
    })

    it('should call onopen handler', (done) => {
      client.on('open', () => {
        expect(client.active()).toBe(true)
        done()
      })

      client.connect()
    })
  })

  describe('on()', () => {
    it('should register event handler', (done) => {
      client.connect()

      client.on('heartbeat', (data) => {
        expect(data).toBeDefined()
        done()
      })

      // Trigger heartbeat event after connection
      vi.advanceTimersByTime(150)
      const eventSource = (client as unknown as { eventSource: MockEventSource }).eventSource
      eventSource.triggerEvent('heartbeat', { timestamp: FIXED_TIMESTAMP })
    })

    it('should register multiple handlers for same event', (done) => {
      let handler1Called = false
      let handler2Called = false

      client.connect()

      client.on('test_event', () => {
        handler1Called = true
        if (handler1Called && handler2Called) {
          done()
        }
      })

      client.on('test_event', () => {
        handler2Called = true
        if (handler1Called && handler2Called) {
          done()
        }
      })

      vi.advanceTimersByTime(150)
      const eventSource = (client as unknown as { eventSource: MockEventSource }).eventSource
      eventSource.triggerEvent('test_event', { test: 'data' })
    })

    it('should parse JSON data', (done) => {
      client.connect()

      client.on('test_event', (data) => {
        expect(data).toEqual({ message: 'test', number: 123 })
        done()
      })

      vi.advanceTimersByTime(150)
      const eventSource = (client as unknown as { eventSource: MockEventSource }).eventSource
      eventSource.triggerEvent('test_event', {
        message: 'test',
        number: 123
      })
    })
  })

  describe('off()', () => {
    it('should remove event handler', async () => {
      let callCount = 0

      client.connect()

      vi.advanceTimersByTime(150)

      const handler = () => {
        callCount++
      }

      client.on('test_event', handler)
      client.off('test_event')

      const eventSource = (client as unknown as { eventSource: MockEventSource }).eventSource
      eventSource.triggerEvent('test_event', {})

      // Wait to verify handler is not called
      vi.advanceTimersByTime(50)

      // Handler should not be called
      expect(callCount).toBe(0)
    })
  })

  describe('disconnect()', () => {
    it('should close EventSource connection', () => {
      client.connect()

      vi.advanceTimersByTime(150)
      expect(client.active()).toBe(true)

      client.disconnect()

      expect(client.active()).toBe(false)
    })

    it('should handle disconnect when not connected', () => {
      expect(() => {
        client.disconnect()
      }).not.toThrow()
    })
  })

  describe('active()', () => {
    it('should return false when not connected', () => {
      expect(client.active()).toBe(false)
    })

    it('should return true when connected', () => {
      client.connect()

      vi.advanceTimersByTime(150)
      expect(client.active()).toBe(true)
    })

    it('should return false after disconnect', () => {
      client.connect()

      vi.advanceTimersByTime(150)
      client.disconnect()
      expect(client.active()).toBe(false)
    })
  })
})
