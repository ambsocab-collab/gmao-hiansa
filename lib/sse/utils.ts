/**
 * SSE Utility Functions
 *
 * Helper functions for Server-Sent Events implementation.
 */

import type { SSEEvent } from '@/types/sse'

/**
 * Format an SSE event according to the W3C specification
 * https://html.spec.whatwg.org/multipage/server-sent-events.html
 *
 * Event naming convention:
 * - Event names: snake_case (e.g., 'work_order_updated')
 * - Data payload: camelCase (e.g., 'workOrderId')
 *
 * @param name - Event name in snake_case
 * @param data - Event payload data (will be JSON stringified)
 * @param id - Optional unique event ID for replay buffer
 * @returns Properly formatted SSE event string
 *
 * @example
 * ```ts
 * const event = sendSSEEvent('heartbeat', { timestamp: Date.now() }, 'evt-123')
 * // Returns:
 * // event: heartbeat
 * // id: evt-123
 * // data: {"timestamp":1715421234567}
 * //
 * // ```
 */
export function sendSSEEvent(
  name: string,
  data: Record<string, unknown>,
  id?: string
): string {
  let message = ''

  // Event name (snake_case according to architecture)
  message += `event: ${name}\n`

  // Event ID (for replay buffer)
  if (id) {
    message += `id: ${id}\n`
  }

  // Data payload (camelCase according to architecture)
  message += `data: ${JSON.stringify(data)}\n`

  // Double newline to terminate event
  message += '\n'

  return message
}

/**
 * Validate SSE channel name
 * @param channel - Channel to validate
 * @returns true if channel is valid
 */
export function isValidSSEChannel(channel: string): channel is 'work-orders' | 'kpis' | 'stock' {
  return ['work-orders', 'kpis', 'stock'].includes(channel)
}

/**
 * Validate SSE event structure
 * @param event - Event to validate
 * @returns true if event has valid structure
 */
export function isValidSSEEvent(event: unknown): event is SSEEvent {
  if (typeof event !== 'object' || event === null) {
    return false
  }

  const e = event as Record<string, unknown>

  return (
    typeof e.name === 'string' &&
    e.data !== undefined &&
    typeof e.data === 'object' &&
    (e.id === undefined || typeof e.id === 'string')
  )
}
