'use client'

/**
 * AssignmentBadge Component
 * Story 3.3 AC4: Columna "Asignaciones" en vista de listado
 *
 * Badge que muestra la distribución de asignaciones:
 * - Formato: "2 técnicos / 1 proveedor"
 * - Tooltip con nombres de asignados
 * - data-testid para E2E testing
 */

import { useState } from 'react'
import { Users, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Assignment {
  id: string
  role: string
  userId: string | null
  providerId: string | null
  user?: {
    id: string
    name: string
  } | null
  provider?: {
    id: string
    name: string
  } | null
}

interface AssignmentBadgeProps {
  assignments: Assignment[]
  workOrderId: string
}

export function AssignmentBadge({ assignments, workOrderId }: AssignmentBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Separate technicians and providers
  const technicians = assignments.filter(a => a.userId && a.user)
  const providers = assignments.filter(a => a.providerId && a.provider)

  const technicianCount = technicians.length
  const providerCount = providers.length
  const total = technicianCount + providerCount

  // Build tooltip content
  const technicianNames = technicians.map(a => a.user?.name || 'Sin nombre').join(', ')
  const providerNames = providers.map(a => a.provider?.name || 'Sin nombre').join(', ')

  let tooltipContent = ''
  if (technicianCount > 0 && providerCount > 0) {
    tooltipContent = `Técnicos: ${technicianNames}\nProveedor: ${providerNames}`
  } else if (technicianCount > 0) {
    tooltipContent = `Técnicos: ${technicianNames}`
  } else if (providerCount > 0) {
    tooltipContent = `Proveedor: ${providerNames}`
  } else {
    tooltipContent = 'Sin asignar'
  }

  if (total === 0) {
    return (
      <Badge variant="outline" className="text-muted-foreground" data-testid={`asignaciones-badge-${workOrderId}`}>
        Sin asignar
      </Badge>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            data-testid={`asignaciones-badge-${workOrderId}`}
          >
            {/* Technicians */}
            {technicianCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {technicianCount}
              </Badge>
            )}

            {/* Provider */}
            {providerCount > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                {providerCount}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs whitespace-pre-line"
          data-testid="asignaciones-tooltip"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
