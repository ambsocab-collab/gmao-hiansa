'use client'

/**
 * Triage Column SSE Listener
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Client Component that subscribes to SSE events and refreshes the UI
 * Features:
 * - Subscribes to failure_report_converted events
 * - Subscribes to failure_report_discarded events
 * - Triggers router.refresh() on SSE events
 * - Real-time UI updates without manual refresh (AC5)
 */

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function TriageColumnSSE() {
  const router = useRouter()
  const { data: session } = useSession()
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!session?.user) {
      return
    }

    // Create EventSource connection to SSE endpoint
    const eventSource = new EventSource('/api/sse')

    eventSourceRef.current = eventSource

    // Subscribe to failure_report_converted events
    eventSource.addEventListener('failure_report_converted', (event) => {
      console.log('[SSE] failure_report_converted event received:', event)
      // Refresh the router to update Server Component data
      router.refresh()
    })

    // Subscribe to failure_report_discarded events
    eventSource.addEventListener('failure_report_discarded', (event) => {
      console.log('[SSE] failure_report_discarded event received:', event)
      // Refresh the router to update Server Component data
      router.refresh()
    })

    // Handle connection open
    eventSource.onopen = () => {
      console.log('[SSE] Connection established')
    }

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error('[SSE] Connection error:', error)
      // EventSource will automatically attempt to reconnect
    }

    // Cleanup function: close EventSource connection on unmount
    return () => {
      console.log('[SSE] Closing connection')
      eventSource.close()
    }
  }, [session, router])

  // This component doesn't render anything - it's just for SSE subscription
  return null
}
