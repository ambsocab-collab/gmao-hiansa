'use client'

/**
 * Unauthorized Logger Component
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Client component that logs access denied events to AuditLog.
 * Used by unauthorized page to record security violations.
 *
 * Features:
 * - Logs access denied on mount
 * - Passes path and required capabilities from URL params
 * - Handles errors gracefully (logging failures shouldn't break the page)
 */

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { logAccessDeniedAction } from '@/app/actions/users'

interface UnauthorizedLoggerProps {
  userId: string
}

export function UnauthorizedLogger({ userId }: UnauthorizedLoggerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only log if we have the required params
    const path = searchParams.get('path')
    const required = searchParams.get('required')

    if (path && required && userId) {
      // Log access denied asynchronously (don't block rendering)
      logAccessDeniedAction(path, required.split(',')).catch((error) => {
        console.error('[UnauthorizedLogger] Failed to log access denied:', error)
      })
    }
  }, [searchParams, userId])

  // This component doesn't render anything
  return null
}
