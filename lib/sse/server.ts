/**
 * SSE Server Utilities
 * Story 2.2: Formulario Reporte de Avería
 *
 * Helper functions for emitting SSE events from Server Actions.
 * Wraps BroadcastManager with capability-based targeting.
 */

import { BroadcastManager } from './broadcaster'

/**
 * SSE Event Target
 *
 * Defines who should receive the SSE notification.
 * Currently supports capability-based targeting (PBAC).
 */
export interface SSEEventTarget {
  capability?: string // Target users with specific capability (e.g., 'can_view_all_ots')
}

/**
 * SSE Event Payload
 *
 * Structure for SSE events emitted from Server Actions.
 */
export interface SSEEventPayload {
  type: string // Event type (e.g., 'failure_report_created')
  data: Record<string, unknown> // Event data
  target?: SSEEventTarget // Optional target filtering
}

/**
 * Emit SSE Event
 *
 * Helper function to broadcast SSE events from Server Actions.
 * Wraps BroadcastManager with structured event payload.
 *
 * Features:
 * - Capability-based targeting (PBAC)
 * - Consistent event structure
 * - Auto-generated event IDs
 * - Error handling (logs but doesn't throw)
 *
 * @param payload - SSE event payload with type, data, and optional target
 *
 * @example
 * // Emit failure report created event
 * emitSSEEvent({
 *   type: 'failure_report_created',
 *   data: {
 *     reportId: 'clxxx',
 *     numero: 'AV-2026-001',
 *     equipo: { ... },
 *     descripcion: 'Fallo en motor',
 *   },
 *   target: { capability: 'can_view_all_ots' }
 * })
 */
export function emitSSEEvent(payload: SSEEventPayload): void {
  try {
    // Broadcast to 'work-orders' channel (failure reports become work orders)
    // In the future, this could be a dedicated 'failure-reports' channel
    const channel: 'work-orders' | 'kpis' | 'stock' = 'work-orders'

    BroadcastManager.broadcast(channel, {
      name: payload.type,
      data: {
        ...payload.data,
        target: payload.target, // Include target for client-side filtering
      },
      id: crypto.randomUUID(),
    })
  } catch (error) {
    // Log error but don't throw - SSE failures shouldn't break Server Actions
    console.error('[SSE] Error emitting event:', error)
  }
}
