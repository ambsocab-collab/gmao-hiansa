'use client'

/**
 * OTCard Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Tarjeta draggable con información completa de OT
 * - Borde izquierdo coloreado según estado (4px solid)
 * - Tipo de OT (Preventivo/Correctivo)
 * - División tag (HiRock/Ultra)
 * - data-testid para testing
 */

import { useDraggable } from '@dnd-kit/core'
import { WorkOrder, WorkOrderEstado, WorkOrderTipo } from '@prisma/client'
import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Wrench } from 'lucide-react'

export interface OTCardProps {
  workOrder: WorkOrder & {
    equipo: {
      name: string
      linea: {
        planta: {
          division: string
        }
      }
    }
    assignments?: Array<{
      user: {
        name: string | null
      }
    }>
  }
  onClick?: (workOrder: WorkOrder & {
    equipo: {
      name: string
      linea: {
        planta: {
          division: string
        }
      }
    }
    assignments?: Array<{
      user: {
        name: string | null
      }
    }>
  }) => void
  disableDrag?: boolean // Para móvil: no drag & drop, solo click
  compact?: boolean // Vista mobile simplificada
}

/**
 * Map de estados a colores para borde izquierdo
 */
const estadoBorderColors: Record<WorkOrderEstado, string> = {
  PENDIENTE: '#6B7280',              // Gray
  ASIGNADA: '#3B82F6',               // Blue
  EN_PROGRESO: '#8B5CF6',            // Purple
  PENDIENTE_REPUESTO: '#F97316',     // Orange
  PENDIENTE_PARADA: '#EC4899',       // Pink
  REPARACION_EXTERNA: '#06B6D4',     // Cyan
  COMPLETADA: '#10B981',             // Green
  DESCARTADA: '#EF4444',             // Red
}

/**
 * Map de tipos a colores de etiqueta
 */
const tipoColors: Record<WorkOrderTipo, { bg: string; text: string; label: string }> = {
  PREVENTIVO: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Preventivo'
  },
  CORRECTIVO: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'Correctivo'
  },
}

export function OTCard({ workOrder, onClick, disableDrag = false, compact = false }: OTCardProps) {
  // Solo usar drag & drop si no está deshabilitado (para móvil)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: workOrder.id,
    data: {
      type: 'work-order',
      workOrder
    },
    disabled: disableDrag
  })

  const borderColor = estadoBorderColors[workOrder.estado]
  const tipoInfo = tipoColors[workOrder.tipo]

  // Formatear fecha límite si existe
  const fechaLimite = workOrder.completed_at
    ? new Date(workOrder.completed_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      })
    : null

  // Técnicos asignados
  const tecnicosAsignados = workOrder.assignments
    ?.map(a => a.user.name)
    .filter(Boolean)
    .join(', ') || 'Sin asignar'

  // Manejar click en la tarjeta
  const handleClick = () => {
    if (onClick) {
      onClick(workOrder)
    }
  }

  // Vista mobile simplificada (AC5)
  if (compact) {
    return (
      <Card
        ref={setNodeRef}
        data-testid={`ot-card-${workOrder.id}`}
        onClick={handleClick}
        className={`
          relative cursor-pointer transition-all hover:shadow-md
          ${isDragging ? 'opacity-50' : ''}
        `}
        style={{
          borderLeft: `4px solid ${borderColor}`
        }}
        role="button"
        tabIndex={0}
        aria-label={`Orden de trabajo ${workOrder.numero}, estado ${workOrder.estado}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <CardContent className="p-4 space-y-2">
          {/* Header: Número y Estado */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900" data-testid={`ot-numero-${workOrder.id}`}>
                {workOrder.numero}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1" data-testid={`ot-descripcion-${workOrder.id}`}>
                {workOrder.descripcion}
              </p>
            </div>

            {/* Estado Badge (grande para tapping) */}
            <div className="shrink-0">
              <StatusBadge estado={workOrder.estado} />
            </div>
          </div>

          {/* Información esencial - touch targets >= 44px */}
          <div className="space-y-2">
            {/* Equipo */}
            <div className="flex items-center gap-2 min-h-[44px]">
              <Wrench className="h-5 w-5 shrink-0 text-gray-600" />
              <span className="text-sm font-medium text-gray-900" data-testid={`ot-equipo-${workOrder.id}`}>
                {workOrder.equipo.name}
              </span>
            </div>

            {/* Tipo de OT */}
            <Badge
              className={`${tipoInfo.bg} ${tipoInfo.text} min-h-[44px] flex items-center justify-center text-sm font-semibold py-2`}
              variant="outline"
              data-testid={`ot-tipo-${workOrder.id}`}
            >
              {tipoInfo.label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vista desktop completa
  return (
    <Card
      ref={setNodeRef}
      {...(!disableDrag && listeners)}
      {...(!disableDrag && attributes)}
      data-testid={`ot-card-${workOrder.id}`}
      onClick={handleClick}
      className={`
        relative transition-all
        ${disableDrag ? 'cursor-pointer hover:shadow-md' : 'cursor-grab active:cursor-grabbing hover:shadow-md'}
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
      style={{
        borderLeft: `4px solid ${borderColor}`
      }}
      role="button"
      tabIndex={0}
      aria-label={`Orden de trabajo ${workOrder.numero}, estado ${workOrder.estado}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: Número y Tipo */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate" data-testid={`ot-numero-${workOrder.id}`}>
              {workOrder.numero}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1" data-testid={`ot-descripcion-${workOrder.id}`}>
              {workOrder.descripcion}
            </p>
          </div>

          {/* Tipo de OT */}
          <Badge
            className={`${tipoInfo.bg} ${tipoInfo.text} shrink-0`}
            variant="outline"
            data-testid={`ot-tipo-${workOrder.id}`}
          >
            {tipoInfo.label}
          </Badge>
        </div>

        {/* Estado Badge */}
        <div>
          <StatusBadge estado={workOrder.estado} />
        </div>

        {/* Información del equipo */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Wrench className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate" data-testid={`ot-equipo-${workOrder.id}`}>
            {workOrder.equipo.name}
          </span>
        </div>

        {/* División tag */}
        <div>
          <DivisionTag division={workOrder.equipo.linea.planta.division} />
        </div>

        {/* Técnicos asignados */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate" data-testid={`ot-tecnicos-${workOrder.id}`}>
            {tecnicosAsignados}
          </span>
        </div>

        {/* Fecha límite */}
        {fechaLimite && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span data-testid={`ot-fecha-${workOrder.id}`}>
              {fechaLimite}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
