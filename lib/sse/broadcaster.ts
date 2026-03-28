/**
 * BroadcastManager - SSE Event Broadcasting System
 *
 * Singleton class that manages SSE event broadcasting to subscribers.
 * Maintains separate channels for different event types and replay buffers
 * for reconnection scenarios.
 *
 * Architecture:
 * - In-memory storage (sufficient for 100 concurrent users per NFR-P6)
 * - Replay buffer keeps last 100 events per channel
 * - Thread-safe subscriber management
 */

import type { SSEChannel, SSEEvent, Subscriber } from '@/types/sse'

/**
 * BroadcastManager Singleton
 *
 * Manages SSE event subscriptions and broadcasting across multiple channels.
 * Each channel maintains its own subscriber list and replay buffer.
 */
class BroadcastManagerClass {
  private static instance: BroadcastManagerClass
  private channels: Map<SSEChannel, Set<Subscriber>>
  private replayBuffers: Map<SSEChannel, SSEEvent[]>

  private constructor() {
    this.channels = new Map()
    this.replayBuffers = new Map()

    // Initialize channels
    const validChannels: SSEChannel[] = ['work-orders', 'kpis', 'stock']
    validChannels.forEach((channel) => {
      this.channels.set(channel, new Set())
      this.replayBuffers.set(channel, [])
    })
  }

  /**
   * Get singleton instance
   */
  static getInstance(): BroadcastManagerClass {
    if (!this.instance) {
      this.instance = new BroadcastManagerClass()
    }
    return this.instance
  }

  /**
   * Subscribe to a channel
   *
   * @param channel - Channel to subscribe to
   * @param subscriber - Callback function for events
   * @returns Unsubscribe function
   * @throws Error if channel is invalid
   */
  subscribe(channel: SSEChannel, subscriber: Subscriber): () => void {
    const subscribers = this.channels.get(channel)
    if (!subscribers) {
      throw new Error(`Invalid channel: ${channel}`)
    }

    subscribers.add(subscriber)

    // Return unsubscribe function
    return () => {
      subscribers.delete(subscriber)
    }
  }

  /**
   * Broadcast an event to all subscribers of a channel
   *
   * Also adds the event to the replay buffer for reconnection scenarios.
   *
   * @param channel - Channel to broadcast to
   * @param event - Event to broadcast
   */
  broadcast(channel: SSEChannel, event: SSEEvent): void {
    const subscribers = this.channels.get(channel)
    if (!subscribers) {
      return
    }

    // Add to replay buffer (last 100 events)
    const buffer = this.replayBuffers.get(channel)!
    const eventWithId = { ...event, id: event.id || crypto.randomUUID() }
    buffer.push(eventWithId)

    // Keep only last 100 events
    if (buffer.length > 100) {
      buffer.shift() // Maintain last 100
    }

    // Send to all subscribers
    subscribers.forEach((subscriber) => {
      try {
        subscriber(eventWithId)
      } catch (error) {
        // Log error but don't stop broadcasting to others
        console.error(`Error broadcasting to subscriber on ${channel}:`, error)
      }
    })
  }

  /**
   * Get missed events since a specific event ID
   *
   * Used for replay buffer when client reconnects.
   *
   * @param channel - Channel to get events from
   * @param fromId - Optional event ID to start from (exclusive)
   * @returns Array of missed events
   */
  getMissedEvents(channel: SSEChannel, fromId?: string): SSEEvent[] {
    const buffer = this.replayBuffers.get(channel)
    if (!buffer) {
      return []
    }

    // If no fromId, return all events
    if (!fromId) {
      return [...buffer]
    }

    // Find starting index
    const startIndex = buffer.findIndex((e) => e.id === fromId)

    // If not found, return all events (client missed too many)
    if (startIndex === -1) {
      return [...buffer]
    }

    // Return events after the fromId (exclusive)
    return buffer.slice(startIndex + 1)
  }

  /**
   * Get current subscriber count for a channel
   * Useful for monitoring and debugging
   *
   * @param channel - Channel to check
   * @returns Number of active subscribers
   */
  getSubscriberCount(channel: SSEChannel): number {
    const subscribers = this.channels.get(channel)
    return subscribers ? subscribers.size : 0
  }

  /**
   * Clear replay buffer for a channel
   * Useful for testing or manual cleanup
   *
   * @param channel - Channel to clear
   */
  clearReplayBuffer(channel: SSEChannel): void {
    const buffer = this.replayBuffers.get(channel)
    if (buffer) {
      buffer.length = 0
    }
  }

  /**
   * Reset all channels and subscribers
   * **WARNING: This is for testing purposes only**
   * Clears all subscribers and replay buffers across all channels
   */
  resetForTesting(): void {
    // Clear all subscribers
    this.channels.forEach((subscribers) => {
      subscribers.clear()
    })

    // Clear all replay buffers
    this.replayBuffers.forEach((buffer) => {
      buffer.length = 0
    })
  }
}

// Export singleton instance
export const BroadcastManager = BroadcastManagerClass.getInstance()

/**
 * Broadcast work order update event
 *
 * Helper function to broadcast work order updates with proper payload structure.
 *
 * NOTE: This function is kept for backwards compatibility.
 * New code should use broadcastWorkOrderUpdated() instead.
 *
 * @param workOrder - Work order data to broadcast
 */
export function broadcastWorkOrderUpdate(workOrder: {
  id: string
  numero: string
  estado: string
  updatedAt: Date
}): void {
  BroadcastManager.broadcast('work-orders', {
    name: 'work_order_updated',
    data: {
      workOrderId: workOrder.id,
      otNumero: workOrder.numero,
      estado: workOrder.estado,
      updatedAt: workOrder.updatedAt.toISOString()
    },
    id: crypto.randomUUID()
  })
}

/**
 * Broadcast KPIs update event
 *
 * Helper function to broadcast KPI updates with proper payload structure.
 *
 * @param kpis - KPI data to broadcast
 */
export function broadcastKPIsUpdate(kpis: {
  mttr: number
  mtbf: number
  otsAbiertas: number
  disponibilidad: number
}): void {
  BroadcastManager.broadcast('kpis', {
    name: 'kpis_updated',
    data: {
      mttr: kpis.mttr,
      mtbf: kpis.mtbf,
      otsAbiertas: kpis.otsAbiertas,
      disponibilidad: kpis.disponibilidad,
      timestamp: new Date().toISOString()
    },
    id: crypto.randomUUID()
  })
}

/**
 * Broadcast failure report created event
 *
 * Helper function to broadcast when a new avería is created.
 * Notifies all supervisors connected to the work-orders channel.
 *
 * @param failureReport - Failure report data to broadcast
 */
export function broadcastFailureReportCreated(failureReport: {
  id: string
  numero: string
  descripcion: string
  equipoNombre: string
  equipoId: string
  reportadoPor: string
  createdAt: Date
}): void {
  BroadcastManager.broadcast('work-orders', {
    name: 'failure-report-created',
    data: {
      id: failureReport.id,
      numero: failureReport.numero,
      descripcion: failureReport.descripcion,
      equipoNombre: failureReport.equipoNombre,
      equipoId: failureReport.equipoId,
      reportadoPor: failureReport.reportadoPor,
      createdAt: failureReport.createdAt.toISOString()
    },
    id: crypto.randomUUID()
  })
}

/**
 * Broadcast work order updated event
 *
 * Helper function to broadcast when a work order is created or updated.
 *
 * @param workOrder - Work order data to broadcast
 */
export function broadcastWorkOrderUpdated(workOrder: {
  id: string
  numero: string
  estado: string
  updatedAt: Date
}): void {
  BroadcastManager.broadcast('work-orders', {
    name: 'work_order_updated',
    data: {
      workOrderId: workOrder.id,
      otNumero: workOrder.numero,
      estado: workOrder.estado,
      updatedAt: workOrder.updatedAt.toISOString()
    },
    id: crypto.randomUUID()
  })
}

/**
 * Broadcast technician assigned event
 *
 * Helper function to broadcast when a technician is assigned to a work order.
 * Notifies the technician and all supervisors.
 *
 * @param assignment - Assignment data to broadcast
 */
export function broadcastTechnicianAssigned(assignment: {
  otNumero: string
  otId: string
  tecnicoId: string
  tecnicoNombre: string
  assignedAt: Date
  estado: string
}): void {
  BroadcastManager.broadcast('work-orders', {
    name: 'technician_assigned',
    data: {
      otNumero: assignment.otNumero,
      otId: assignment.otId,
      tecnicoId: assignment.tecnicoId,
      tecnicoNombre: assignment.tecnicoNombre,
      assignedAt: assignment.assignedAt.toISOString(),
      estado: assignment.estado
    },
    id: crypto.randomUUID()
  })
}
