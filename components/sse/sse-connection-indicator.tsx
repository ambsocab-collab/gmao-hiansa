'use client'

/**
 * SSE Connection Indicator Component
 * Story 3.4: Vista de Listado con Filtros y Sync Real-time
 *
 * AC5: SSE indicator visible with connection state
 *  - Shows green when connected
 *  - Shows red when disconnected
 *  - data-testid="sse-connection-indicator"
 *  - data-connected="true" | "false"
 */

import { useSSEConnection } from './use-sse-connection'
import { Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SSEChannel } from '@/types/sse'

export interface SSEConnectionIndicatorProps {
  channel?: SSEChannel
  className?: string
}

export function SSEConnectionIndicator({
  channel = 'work-orders',
  className
}: SSEConnectionIndicatorProps) {
  const { isConnected } = useSSEConnection({
    channel,
    onMessage: () => {
      // Connection is alive when we receive messages
    }
  })

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
        isConnected
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700",
        className
      )}
      data-testid="sse-connection-indicator"
      data-connected={isConnected ? 'true' : 'false'}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sincronizado</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Desconectado</span>
        </>
      )}
    </div>
  )
}
