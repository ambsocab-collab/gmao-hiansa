/**
 * SSE Client Utility Class
 *
 * Client-side utility for managing SSE connections.
 * Provides a more imperative API compared to React hooks.
 *
 * This is useful for non-React contexts or when you need more control
 * over the connection lifecycle.
 */

import type { SSEChannel } from '@/types/sse'

/**
 * SSE client class
 *
 * Manages a single SSE connection with event handlers.
 */
export class SSEClient {
  private eventSource: EventSource | null = null
  private eventHandlers: Map<string, (data: unknown) => void> = new Map()
  private isConnected = false
  private channel: SSEChannel

  constructor(channel: SSEChannel) {
    this.channel = channel
  }

  /**
   * Connect to SSE endpoint
   *
   * @throws Error if connection fails
   */
  connect(): void {
    if (this.eventSource) {
      this.disconnect()
    }

    const url = `/api/v1/sse?channel=${this.channel}`
    this.eventSource = new EventSource(url)

    this.eventSource.onopen = () => {
      this.isConnected = true
    }

    this.eventSource.onerror = (_error) => {
      this.isConnected = false
    }

    // Register event handlers
    this.eventSource.addEventListener('heartbeat', (event) => {
      const handler = this.eventHandlers.get('heartbeat')
      if (handler) {
        try {
          const data = JSON.parse((event as MessageEvent).data)
          handler(data)
        } catch (error) {
          console.error('Error parsing heartbeat:', error)
        }
      }
    })

    this.eventSource.addEventListener('work_order_updated', (event) => {
      const handler = this.eventHandlers.get('work_order_updated')
      if (handler) {
        try {
          const data = JSON.parse((event as MessageEvent).data)
          handler(data)
        } catch (error) {
          console.error('Error parsing work_order_updated:', error)
        }
      }
    })

    this.eventSource.addEventListener('kpis_updated', (event) => {
      const handler = this.eventHandlers.get('kpis_updated')
      if (handler) {
        try {
          const data = JSON.parse((event as MessageEvent).data)
          handler(data)
        } catch (error) {
          console.error('Error parsing kpis_updated:', error)
        }
      }
    })
  }

  /**
   * Register event handler
   *
   * @param eventName - Event name to listen for
   * @param handler - Callback function
   */
  on(eventName: string, handler: (data: unknown) => void): void {
    this.eventHandlers.set(eventName, handler)
  }

  /**
   * Remove event handler
   *
   * @param eventName - Event name to remove handler for
   */
  off(eventName: string): void {
    this.eventHandlers.delete(eventName)
  }

  /**
   * Disconnect from SSE endpoint
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.isConnected = false
    }
  }

  /**
   * Check if connected
   */
  active(): boolean {
    return this.isConnected && this.eventSource?.readyState === EventSource.OPEN
  }
}
