/**
 * Test Endpoint for SSE Event Triggering
 *
 * This endpoint is used for development and testing purposes.
 * It allows manually triggering SSE events to verify the broadcasting system.
 *
 * Route: POST /api/test-data/sse/trigger?event={event_type}
 *
 * Event types:
 * - work_order_updated: Triggers a work order update event
 * - kpis_updated: Triggers a KPIs update event
 *
 * @example
 * ```bash
 * # Trigger work order update event
 * curl -X POST "http://localhost:3000/api/test-data/sse/trigger?event=work_order_updated" \
 *   -H "Cookie: next-auth.session-token=..."
 *
 * # Trigger KPIs update event
 * curl -X POST "http://localhost:3000/api/test-data/sse/trigger?event=kpis_updated" \
 *   -H "Cookie: next-auth.session-token=..."
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-adapter'
import { broadcastWorkOrderUpdate, broadcastKPIsUpdate } from '@/lib/sse/broadcaster'

/**
 * POST handler for triggering test SSE events
 *
 * @param request - Next.js request object
 * @returns Success response or error response
 */
export async function POST(request: NextRequest) {
  // Authentication required
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('event')

  switch (eventType) {
    case 'work_order_updated':
      // Broadcast test work order update event
      broadcastWorkOrderUpdate({
        id: 'test-wo-123',
        numero: '123',
        estado: 'EN_PROGRESO',
        updatedAt: new Date()
      })
      break

    case 'kpis_updated':
      // Broadcast test KPIs update event
      broadcastKPIsUpdate({
        mttr: 4.2,
        mtbf: 127,
        otsAbiertas: 15,
        disponibilidad: 95.5
      })
      break

    default:
      return NextResponse.json(
        { error: 'Invalid event type', validEvents: ['work_order_updated', 'kpis_updated'] },
        { status: 400 }
      )
  }

  return NextResponse.json({
    success: true,
    message: `Event ${eventType} broadcasted successfully`,
    eventType
  })
}
