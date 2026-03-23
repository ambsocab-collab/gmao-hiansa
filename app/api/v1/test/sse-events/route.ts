/**
 * Test Endpoint: SSE Event Capture
 *
 * This endpoint is used ONLY for E2E testing to verify SSE events are emitted.
 * It reads events from a file to ensure consistency across Next.js dev mode hot reloads.
 *
 * Route: GET /api/v1/test/sse-events - Get captured events
 * Route: DELETE /api/v1/test/sse-events - Clear captured events
 *
 * **WARNING: This endpoint should ONLY be enabled in test environments**
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getCapturedSSEEvents,
  clearCapturedSSEEvents
} from '@/lib/sse/server'

/**
 * GET - Get captured SSE events
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const debug = searchParams.get('debug') === 'true'

  // Get captured events from file (async now)
  const capturedEvents = await getCapturedSSEEvents()

  // Filter by event type if specified
  const filteredEvents = type
    ? capturedEvents.filter((e) => e.name === type)
    : capturedEvents

  const response = {
    events: filteredEvents,
    count: filteredEvents.length,
    totalCount: capturedEvents.length,
    debug: debug ? {
      allEventNames: capturedEvents.map(e => e.name),
      lastCapture: capturedEvents[capturedEvents.length - 1]?.capturedAt
    } : undefined
  }

  return NextResponse.json(response)
}

/**
 * DELETE - Clear captured events
 */
export async function DELETE() {
  await clearCapturedSSEEvents()
  return NextResponse.json({ success: true, message: 'Events cleared' })
}
