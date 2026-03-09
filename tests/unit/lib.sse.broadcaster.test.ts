/**
 * Unit Tests for BroadcastManager
 *
 * Tests the SSE broadcasting system including:
 * - Channel subscription
 * - Event broadcasting
 * - Replay buffer management
 * - Unsubscribe functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BroadcastManager, broadcastWorkOrderUpdate, broadcastKPIsUpdate } from '@/lib/sse/broadcaster'
import type { SSEChannel, SSEEvent } from '@/types/sse'

describe('BroadcastManager', () => {
  let testChannel: SSEChannel

  beforeEach(() => {
    // Use 'work-orders' as test channel
    testChannel = 'work-orders'

    // Reset singleton state before each test
    BroadcastManager.resetForTesting()
  })

  describe('subscribe()', () => {
    it('should subscribe to a valid channel', () => {
      const subscriber = vi.fn()
      const unsubscribe = BroadcastManager.subscribe(testChannel, subscriber)

      expect(typeof unsubscribe).toBe('function')
    })

    it('should throw error for invalid channel', () => {
      const subscriber = vi.fn()

      expect(() => {
        BroadcastManager.subscribe('invalid-channel', subscriber)
      }).toThrow('Invalid channel: invalid-channel')
    })

    it('should call subscriber when event is broadcast', () => {
      const subscriber = vi.fn()
      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      BroadcastManager.subscribe(testChannel, subscriber)
      BroadcastManager.broadcast(testChannel, event)

      expect(subscriber).toHaveBeenCalledTimes(1)
      expect(subscriber).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test_event',
          data: { message: 'test' }
        })
      )
    })

    it('should support multiple subscribers', () => {
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      BroadcastManager.subscribe(testChannel, subscriber1)
      BroadcastManager.subscribe(testChannel, subscriber2)
      BroadcastManager.broadcast(testChannel, event)

      expect(subscriber1).toHaveBeenCalledTimes(1)
      expect(subscriber2).toHaveBeenCalledTimes(1)
    })

    it('should unsubscribe correctly', () => {
      const subscriber = vi.fn()
      const unsubscribe = BroadcastManager.subscribe(testChannel, subscriber)

      unsubscribe()

      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      BroadcastManager.broadcast(testChannel, event)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('broadcast()', () => {
    it('should add event to replay buffer', () => {
      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      BroadcastManager.broadcast(testChannel, event)

      const missedEvents = BroadcastManager.getMissedEvents(testChannel)
      expect(missedEvents).toHaveLength(1)
      expect(missedEvents[0]).toMatchObject({
        name: 'test_event',
        data: { message: 'test' }
      })
    })

    it('should generate unique ID for events without ID', () => {
      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      BroadcastManager.broadcast(testChannel, event)

      const missedEvents = BroadcastManager.getMissedEvents(testChannel)
      expect(missedEvents[0].id).toBeDefined()
      expect(typeof missedEvents[0].id).toBe('string')
    })

    it('should keep only last 100 events in replay buffer', () => {
      // Broadcast 150 events
      for (let i = 0; i < 150; i++) {
        BroadcastManager.broadcast(testChannel, {
          name: 'test_event',
          data: { index: i }
        })
      }

      const missedEvents = BroadcastManager.getMissedEvents(testChannel)
      expect(missedEvents).toHaveLength(100)
    })

    it('should handle subscriber errors gracefully', () => {
      const errorSubscriber = vi.fn(() => {
        throw new Error('Subscriber error')
      })
      const normalSubscriber = vi.fn()

      BroadcastManager.subscribe(testChannel, errorSubscriber)
      BroadcastManager.subscribe(testChannel, normalSubscriber)

      const event: SSEEvent = {
        name: 'test_event',
        data: { message: 'test' }
      }

      // Should not throw, error subscriber should be called
      expect(() => {
        BroadcastManager.broadcast(testChannel, event)
      }).not.toThrow()

      // Normal subscriber should still receive event
      expect(normalSubscriber).toHaveBeenCalledTimes(1)
    })
  })

  describe('getMissedEvents()', () => {
    beforeEach(() => {
      // Clear replay buffer before each test
      BroadcastManager.clearReplayBuffer(testChannel)

      // Add some test events
      for (let i = 1; i <= 5; i++) {
        BroadcastManager.broadcast(testChannel, {
          name: 'test_event',
          data: { index: i }
        })
      }
    })

    it('should return all events if no fromId provided', () => {
      const missedEvents = BroadcastManager.getMissedEvents(testChannel)

      expect(missedEvents).toHaveLength(5)
    })

    it('should return events after fromId (exclusive)', () => {
      const allEvents = BroadcastManager.getMissedEvents(testChannel)
      const fromId = allEvents[2].id // Third event

      const missedEvents = BroadcastManager.getMissedEvents(testChannel, fromId)

      expect(missedEvents).toHaveLength(2) // Events 4 and 5
    })

    it('should return all events if fromId not found', () => {
      const missedEvents = BroadcastManager.getMissedEvents(testChannel, 'non-existent-id')

      expect(missedEvents).toHaveLength(5)
    })

    it('should return empty array for invalid channel', () => {
      const missedEvents = BroadcastManager.getMissedEvents(
        'invalid-channel'
      )

      expect(missedEvents).toHaveLength(0)
    })
  })

  describe('getSubscriberCount()', () => {
    it('should return 0 for channel with no subscribers', () => {
      const count = BroadcastManager.getSubscriberCount(testChannel)
      expect(count).toBe(0)
    })

    it('should return correct subscriber count', () => {
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const subscriber3 = vi.fn()

      BroadcastManager.subscribe(testChannel, subscriber1)
      BroadcastManager.subscribe(testChannel, subscriber2)
      BroadcastManager.subscribe(testChannel, subscriber3)

      const count = BroadcastManager.getSubscriberCount(testChannel)
      expect(count).toBe(3)
    })

    it('should decrease count when subscriber unsubscribes', () => {
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      const unsubscribe1 = BroadcastManager.subscribe(testChannel, subscriber1)
      BroadcastManager.subscribe(testChannel, subscriber2)

      expect(BroadcastManager.getSubscriberCount(testChannel)).toBe(2)

      unsubscribe1()

      expect(BroadcastManager.getSubscriberCount(testChannel)).toBe(1)
    })
  })

  describe('clearReplayBuffer()', () => {
    it('should clear all events from replay buffer', () => {
      // Add some events
      for (let i = 0; i < 10; i++) {
        BroadcastManager.broadcast(testChannel, {
          name: 'test_event',
          data: { index: i }
        })
      }

      expect(BroadcastManager.getMissedEvents(testChannel).length).toBeGreaterThan(0)

      BroadcastManager.clearReplayBuffer(testChannel)

      expect(BroadcastManager.getMissedEvents(testChannel)).toHaveLength(0)
    })
  })
})

describe('broadcastWorkOrderUpdate()', () => {
  it('should broadcast work order updated event', () => {
    const subscriber = vi.fn()
    BroadcastManager.subscribe('work-orders', subscriber)

    broadcastWorkOrderUpdate({
      id: 'wo-123',
      numero: 123,
      estado: 'en_progreso',
      updatedAt: new Date('2024-01-01T00:00:00Z')
    })

    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'work_order_updated',
        data: expect.objectContaining({
          workOrderId: 'wo-123',
          numero: 123,
          estado: 'en_progreso',
          updatedAt: '2024-01-01T00:00:00.000Z'
        })
      })
    )
  })
})

describe('broadcastKPIsUpdate()', () => {
  it('should broadcast KPIs updated event', () => {
    const subscriber = vi.fn()
    BroadcastManager.subscribe('kpis', subscriber)

    broadcastKPIsUpdate({
      mttr: 4.2,
      mtbf: 127,
      otsAbiertas: 15,
      disponibilidad: 95.5
    })

    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'kpis_updated',
        data: expect.objectContaining({
          mttr: 4.2,
          mtbf: 127,
          otsAbiertas: 15,
          disponibilidad: 95.5,
          timestamp: expect.any(String)
        })
      })
    )
  })
})
