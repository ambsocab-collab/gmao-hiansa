/**
 * SSE Server Utilities with Prisma-based event persistence
 * Story 2.2: Formulario Reporte de Avería
 *
 * Helper functions for emitting SSE events from Server Actions.
 * Uses Prisma DB to capture events for E2E test verification (works across Next.js hot reloads).
 */

import { BroadcastManager } from './broadcaster'
import { prisma } from '@/lib/db'

/**
 * Get captured SSE events from DB
 */
export async function getCapturedSSEEvents(): Promise<any[]> {
  try {
    const events = await prisma.sSETestEvent.findMany({
      orderBy: { capturedAt: 'desc' },
      take: 100 // Last 100 events
    })
    return events.reverse() // Return in chronological order
  } catch (error) {
    console.error('[SSE] Error reading events from DB:', error)
    return []
  }
}

/**
 * Clear captured SSE events
 */
export async function clearCapturedSSEEvents(): Promise<void> {
  try {
    await prisma.sSETestEvent.deleteMany({})
  } catch (error) {
    console.error('[SSE] Error clearing events:', error)
  }
}

/**
 * Emit SSE Event
 *
 * Helper function to broadcast SSE events from Server Actions.
 * Captures events to Prisma DB for E2E test verification.
 */
export function emitSSEEvent(payload: any): void {
  try {
    // Broadcast to 'work-orders' channel
    const channel: 'work-orders' | 'kpis' | 'stock' = 'work-orders'

    const event = {
      name: payload.type,
      data: {
        ...payload.data,
        target: payload.target,
      },
      id: crypto.randomUUID(),
    }

    // Broadcast to all subscribers
    BroadcastManager.broadcast(channel, event)

    // Capture to DB (async, don't wait)
    prisma.sSETestEvent.create({
      data: {
        name: event.name,
        data: event.data as any, // Prisma Json type
      }
    }).then(() => {
      console.log('[SSE] Event emitted & captured:', event.name)
    }).catch(err => {
      console.error('[SSE] Error capturing event to DB:', err)
    })
  } catch (error) {
    console.error('[SSE] Error emitting event:', error)
  }
}

// Export types for compatibility
export interface SSEEventTarget {
  capability?: string
  userIds?: string[]
}

export interface SSEEventPayload {
  type: string
  data: Record<string, unknown>
  target?: SSEEventTarget
}
