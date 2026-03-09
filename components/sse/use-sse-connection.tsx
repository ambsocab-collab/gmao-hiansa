/**
 * React Hooks for SSE (Server-Sent Events)
 *
 * Custom hooks for consuming SSE streams in React components.
 * Provides automatic reconnection with exponential backoff.
 *
 * 'use client' directive is required because these hooks use:
 * - useState, useEffect, useRef (React hooks)
 * - EventSource (browser API)
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import type { SSEChannel } from '@/types/sse'

/**
 * SSE connection state
 */
interface SSEConnectionState {
  isConnected: boolean
  error: Event | null
}

/**
 * Options for useSSEConnection hook
 */
interface UseSSEConnectionOptions {
  channel: SSEChannel
  onMessage?: (message: { type: string; data: unknown }) => void
  onError?: (error: Event) => void
  onOpen?: () => void
}

/**
 * Base SSE connection hook
 *
 * Manages SSE connection with automatic reconnection using exponential backoff.
 * Handles connection lifecycle, event parsing, and error recovery.
 *
 * @param options - Connection options
 * @returns Connection state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected } = useSSEConnection({
 *     channel: 'work-orders',
 *     onMessage: (message) => console.log(message),
 *     onError: (error) => console.error(error)
 *   })
 *
 *   return <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
 * }
 * ```
 */
export function useSSEConnection({
  channel,
  onMessage,
  onError,
  onOpen
}: UseSSEConnectionOptions): SSEConnectionState {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Event | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryCountRef = useRef(0)

  useEffect(() => {
    let eventSource: EventSource | null = null
    let reconnectTimer: NodeJS.Timeout | null = null

    const connect = () => {
      try {
        // Create EventSource with channel
        const url = `/api/v1/sse?channel=${channel}`
        eventSource = new EventSource(url)

        eventSourceRef.current = eventSource

        // Connection opened
        eventSource.onopen = () => {
          setIsConnected(true)
          setError(null)
          retryCountRef.current = 0
          onOpen?.()
        }

        // Connection error
        eventSource.onerror = (error) => {
          setIsConnected(false)
          setError(error)

          // Exponential backoff reconnection (max 30s)
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
          retryCountRef.current++

          reconnectTimer = setTimeout(() => {
            if (eventSource?.readyState === EventSource.CLOSED) {
              connect()
            }
          }, delay)

          onError?.(error)
        }

        // Generic message handler
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            onMessage?.({ type: 'message', data })
          } catch (error) {
            console.error('Error parsing SSE message:', error)
          }
        }

        // Event-specific handlers

        // Heartbeat event
        eventSource.addEventListener('heartbeat', (_event) => {
          // Heartbeat received → connection is alive
          setIsConnected(true)
          setError(null)
        })

        // Work order updated event
        eventSource.addEventListener('work_order_updated', (event) => {
          try {
            const data = JSON.parse(event.data)
            onMessage?.({ type: 'work_order_updated', data })
          } catch (error) {
            console.error('Error parsing work_order_updated:', error)
          }
        })

        // KPIs updated event
        eventSource.addEventListener('kpis_updated', (event) => {
          try {
            const data = JSON.parse(event.data)
            onMessage?.({ type: 'kpis_updated', data })
          } catch (error) {
            console.error('Error parsing kpis_updated:', error)
          }
        })

      } catch (error) {
        console.error('Error connecting to SSE:', error)
        setError(error as Event)
      }
    }

    connect()

    // Cleanup
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [channel, onMessage, onError, onOpen])

  return { isConnected, error }
}

/**
 * Work orders SSE hook
 *
 * Specialized hook for work order updates.
 *
 * @param onWorkOrderUpdate - Callback when work order is updated
 * @returns Connection state
 *
 * @example
 * ```tsx
 * function WorkOrdersList() {
 *   const { isConnected } = useWorkOrdersSSE((data) => {
 *     console.log('Work order updated:', data)
 *     // Refresh work orders list
 *   })
 *
 *   return <div>SSE: {isConnected ? '🟢' : '🔴'}</div>
 * }
 * ```
 */
export function useWorkOrdersSSE(
  onWorkOrderUpdate: (data: {
    workOrderId: string
    numero: number
    estado: string
    updatedAt: string
  }) => void
): SSEConnectionState {
  return useSSEConnection({
    channel: 'work-orders',
    onMessage: (message) => {
      if (message.type === 'work_order_updated') {
        onWorkOrderUpdate(message.data as {
          workOrderId: string
          numero: number
          estado: string
          updatedAt: string
        })
      }
    }
  })
}

/**
 * KPIs SSE hook
 *
 * Specialized hook for KPI updates.
 *
 * @param onKPIsUpdate - Callback when KPIs are updated
 * @returns Connection state
 *
 * @example
 * ```tsx
 * function KPIDashboard() {
 *   const { isConnected } = useKPIsSSE((data) => {
 *     console.log('KPIs updated:', data)
 *     // Update KPIs display
 *   })
 *
 *   return <div>SSE: {isConnected ? '🟢' : '🔴'}</div>
 * }
 * ```
 */
export function useKPIsSSE(
  onKPIsUpdate: (data: {
    mttr: number
    mtbf: number
    otsAbiertas: number
    disponibilidad: number
    timestamp: string
  }) => void
): SSEConnectionState {
  return useSSEConnection({
    channel: 'kpis',
    onMessage: (message) => {
      if (message.type === 'kpis_updated') {
        onKPIsUpdate(message.data as {
          mttr: number
          mtbf: number
          otsAbiertas: number
          disponibilidad: number
          timestamp: string
        })
      }
    }
  })
}
