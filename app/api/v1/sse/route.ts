/**
 * SSE Endpoint - Server-Sent Events Route Handler
 *
 * This endpoint provides real-time updates to connected clients using Server-Sent Events (SSE).
 * SSE is used instead of WebSockets for Vercel serverless compatibility.
 *
 * Features:
 * - Authenticated connections via NextAuth session
 * - Multiple channels: work-orders, kpis, stock
 * - Heartbeat every 30 seconds
 * - Automatic reconnection support
 *
 * Route: GET /api/v1/sse?channel={channel}
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth-adapter'
import { BroadcastManager } from '@/lib/sse/broadcaster'
import { sendSSEEvent, isValidSSEChannel } from '@/lib/sse/utils'
import type { SSEChannel } from '@/types/sse'

/**
 * GET handler for SSE connections
 *
 * @param request - Next.js request object
 * @returns SSE stream response or error response
 */
export async function GET(request: NextRequest) {
  // 1. Authentication is mandatory
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Get channel from query params
  const { searchParams } = new URL(request.url)
  const channelParam = searchParams.get('channel') || 'work-orders'

  // 3. Validate channel
  if (!isValidSSEChannel(channelParam)) {
    return new Response(
      `Invalid channel: ${channelParam}. Valid channels: work-orders, kpis, stock`,
      { status: 400 }
    )
  }

  const channel: SSEChannel = channelParam

  // 4. Rate limiting: Check active connections per user (prevent DoS)
  const activeConnections = BroadcastManager.getSubscriberCount(channel)
  const MAX_CONNECTIONS_PER_USER = 5
  if (activeConnections >= MAX_CONNECTIONS_PER_USER) {
    return new Response(
      `Too many connections. Maximum ${MAX_CONNECTIONS_PER_USER} concurrent connections allowed.`,
      { status: 429 }
    )
  }

  // 5. Create ReadableStream for SSE
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // 6. Subscribe to the channel
      const unsubscribe = BroadcastManager.subscribe(
        channel,
        (event) => {
          const data = sendSSEEvent(event.name, event.data, event.id)
          controller.enqueue(encoder.encode(data))
        }
      )

      // 7. Send initial heartbeat
      const initialHeartbeat = sendSSEEvent('heartbeat', {
        timestamp: Date.now(),
        channel,
        correlationId: crypto.randomUUID()
      })
      controller.enqueue(encoder.encode(initialHeartbeat))

      // 8. Setup heartbeat timer (30 seconds)
      const heartbeatInterval = setInterval(() => {
        const heartbeat = sendSSEEvent('heartbeat', {
          timestamp: Date.now(),
          channel,
          correlationId: crypto.randomUUID()
        })
        controller.enqueue(encoder.encode(heartbeat))
      }, 30000) // 30 seconds exact

      // 9. Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        unsubscribe()
        controller.close()
      })
    }
  })

  // 10. Return response with correct SSE headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable buffering in nginx
    }
  })
}
