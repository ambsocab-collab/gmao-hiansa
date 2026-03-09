/**
 * Unit Tests for SSE Utils
 *
 * Tests SSE utility functions including:
 * - sendSSEEvent() formatting
 * - isValidSSEChannel() validation
 * - isValidSSEEvent() validation
 */

import { describe, it, expect } from 'vitest'
import { sendSSEEvent, isValidSSEChannel, isValidSSEEvent } from '@/lib/sse/utils'
import type { SSEEvent } from '@/types/sse'

describe('sendSSEEvent()', () => {
  it('should format SSE event correctly', () => {
    const event = sendSSEEvent('heartbeat', {
      timestamp: 1234567890,
      channel: 'work-orders'
    })

    const lines = event.split('\n')
    expect(lines[0]).toBe('event: heartbeat')
    expect(lines[1]).toMatch(/^data: \{.*\}$/)
    expect(lines[2]).toBe('') // Empty line after event
  })

  it('should include event ID when provided', () => {
    const eventId = 'evt-123'
    const event = sendSSEEvent('heartbeat', { timestamp: 1234567890 }, eventId)

    expect(event).toContain(`id: ${eventId}`)
  })

  it('should not include event ID when not provided', () => {
    const event = sendSSEEvent('heartbeat', { timestamp: 1234567890 })

    expect(event).not.toContain('id:')
  })

  it('should use snake_case for event name', () => {
    const event = sendSSEEvent('work_order_updated', { workOrderId: 'wo-123' })

    expect(event).toContain('event: work_order_updated')
  })

  it('should JSON.stringify data payload', () => {
    const data = {
      workOrderId: 'wo-123',
      numero: 123,
      estado: 'en_progreso'
    }
    const event = sendSSEEvent('work_order_updated', data)

    expect(event).toContain('data: {"workOrderId":"wo-123","numero":123,"estado":"en_progreso"}')
  })

  it('should terminate with double newline', () => {
    const event = sendSSEEvent('heartbeat', { timestamp: 1234567890 })

    expect(event.endsWith('\n\n')).toBe(true)
  })

  it('should handle complex nested data', () => {
    const data = {
      user: {
        id: 'user-123',
        name: 'Test User',
        capabilities: ['can_create_ot', 'can_view_kpis']
      },
      metadata: {
        timestamp: new Date('2024-01-01T00:00:00Z').getTime(),
        correlationId: 'corr-123'
      }
    }

    const event = sendSSEEvent('complex_event', data)

    expect(event).toContain('event: complex_event')
    expect(event).toContain('data: {')
    expect(event).toContain('"user":{')
    expect(event).toContain('"capabilities":["can_create_ot","can_view_kpis"]')
  })

  it('should handle special characters in data', () => {
    const data = {
      message: 'Test with "quotes" and \'apostrophes\'',
      emoji: '🔥💡',
      newlines: 'line1\nline2\nline3'
    }

    const event = sendSSEEvent('special_chars', data)

    expect(event).toContain('event: special_chars')
    expect(event).toContain('data: {')
    // JSON should escape special characters
    expect(event).toContain('\\n')
  })
})

describe('isValidSSEChannel()', () => {
  it('should return true for valid channels', () => {
    expect(isValidSSEChannel('work-orders')).toBe(true)
    expect(isValidSSEChannel('kpis')).toBe(true)
    expect(isValidSSEChannel('stock')).toBe(true)
  })

  it('should return false for invalid channels', () => {
    expect(isValidSSEChannel('invalid')).toBe(false)
    expect(isValidSSEChannel('')).toBe(false)
    expect(isValidSSEChannel('work-orders ')).toBe(false)
    expect(isValidSSEChannel('Work-Orders')).toBe(false) // Case sensitive
  })

  it('should have correct type narrowing', () => {
    const channel = 'work-orders'

    if (isValidSSEChannel(channel)) {
      // TypeScript should know channel is 'work-orders' | 'kpis' | 'stock'
      expect(channel).toMatch(/^(work-orders|kpis|stock)$/)
    }
  })
})

describe('isValidSSEEvent()', () => {
  it('should return true for valid SSE event', () => {
    const validEvent: SSEEvent = {
      name: 'heartbeat',
      data: { timestamp: 1234567890 }
    }

    expect(isValidSSEEvent(validEvent)).toBe(true)
  })

  it('should return true for valid SSE event with ID', () => {
    const validEvent: SSEEvent = {
      name: 'work_order_updated',
      data: { workOrderId: 'wo-123' },
      id: 'evt-123'
    }

    expect(isValidSSEEvent(validEvent)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isValidSSEEvent(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isValidSSEEvent(undefined)).toBe(false)
  })

  it('should return false for non-object', () => {
    expect(isValidSSEEvent('string')).toBe(false)
    expect(isValidSSEEvent(123)).toBe(false)
    expect(isValidSSEEvent([])).toBe(false)
  })

  it('should return false if name is missing', () => {
    const invalidEvent = {
      data: { timestamp: 1234567890 }
    } as unknown

    expect(isValidSSEEvent(invalidEvent)).toBe(false)
  })

  it('should return false if name is not string', () => {
    const invalidEvent = {
      name: 123,
      data: { timestamp: 1234567890 }
    } as unknown

    expect(isValidSSEEvent(invalidEvent)).toBe(false)
  })

  it('should return false if data is missing', () => {
    const invalidEvent = {
      name: 'heartbeat'
    } as unknown

    expect(isValidSSEEvent(invalidEvent)).toBe(false)
  })

  it('should return false if data is not object', () => {
    const invalidEvent = {
      name: 'heartbeat',
      data: 'not an object'
    } as unknown

    expect(isValidSSEEvent(invalidEvent)).toBe(false)
  })

  it('should return false if id is not string when present', () => {
    const invalidEvent = {
      name: 'heartbeat',
      data: { timestamp: 1234567890 },
      id: 123 // Should be string
    } as unknown

    expect(isValidSSEEvent(invalidEvent)).toBe(false)
  })

  it('should have correct type narrowing', () => {
    const unknownEvent: unknown = {
      name: 'heartbeat',
      data: { timestamp: 1234567890 }
    }

    if (isValidSSEEvent(unknownEvent)) {
      // TypeScript should know unknownEvent is SSEEvent
      const validEvent = unknownEvent as SSEEvent
      expect(validEvent.name).toBe('heartbeat')
      expect(validEvent.data).toEqual({ timestamp: 1234567890 })
    }
  })
})
