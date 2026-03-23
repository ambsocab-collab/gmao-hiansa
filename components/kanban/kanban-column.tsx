'use client'

/**
 * KanbanColumn Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Columna con drop zone para @dnd-kit
 * - Título, color, count badge
 * - Lista de OT cards
 * - Borde punteado cuando es drag target
 */

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { WorkOrder, WorkOrderEstado } from '@prisma/client'
import { OTCard } from './ot-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface KanbanColumnProps {
  estado: WorkOrderEstado
  workOrders: Array<WorkOrder & {
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
  }>
  onOTCardClick?: (workOrder: WorkOrder & {
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
  disableDrag?: boolean
  compactCards?: boolean // Vista mobile simplificada
}

/**
 * Colores de fondo para columnas (light variants)
 */
const estadoColumnColors: Record<WorkOrderEstado, string> = {
  PENDIENTE: 'bg-gray-50',
  ASIGNADA: 'bg-blue-50',
  EN_PROGRESO: 'bg-purple-50',
  PENDIENTE_REPUESTO: 'bg-orange-50',
  PENDIENTE_PARADA: 'bg-pink-50',
  REPARACION_EXTERNA: 'bg-cyan-50',
  COMPLETADA: 'bg-green-50',
  DESCARTADA: 'bg-red-50',
}

/**
 * Labels legibles para estados
 */
const estadoLabels: Record<WorkOrderEstado, string> = {
  PENDIENTE: 'Pendiente',
  ASIGNADA: 'Asignada',
  EN_PROGRESO: 'En Progreso',
  PENDIENTE_REPUESTO: 'Pendiente Repuesto',
  PENDIENTE_PARADA: 'Pendiente Parada',
  REPARACION_EXTERNA: 'Reparación Externa',
  COMPLETADA: 'Completada',
  DESCARTADA: 'Cancelada',
}

export function KanbanColumn({ estado, workOrders, onOTCardClick, disableDrag, compactCards }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: estado,
    data: {
      type: 'column',
      estado
    }
  })

  const columnColor = estadoColumnColors[estado]
  const estadoLabel = estadoLabels[estado]
  const count = workOrders.length

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-lg border transition-colors snap-start shrink-0
        ${columnColor}
        ${isOver ? 'border-primary border-2 bg-primary/5' : 'border-gray-200'}
        // Desktop: ancho fijo
        lg:w-full lg:max-w-[320px] lg:min-w-[280px]
        // Tablet: ancho fijo con scroll
        md:w-[400px] md:min-w-[400px]
        // Mobile: ancho completo
        w-full min-w-full
      `}
      data-testid={`kanban-column-${estado}`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900" data-testid={`column-title-${estado}`}>
            {estadoLabel}
          </h3>

          {/* Count Badge */}
          <span
            className={`
              inline-flex items-center justify-center
              rounded-full px-2.5 py-0.5
              text-xs font-semibold
              ${columnColor}
            `}
            data-testid={`column-count-${estado}`}
          >
            {count}
          </span>
        </div>

        {/* Estado Badge (redundancia para WCAG AA) */}
        <div className="mt-2">
          <StatusBadge estado={estado} />
        </div>
      </div>

      {/* OT Cards List */}
      <ScrollArea className="flex-1 h-[calc(100vh-320px)] min-h-[200px]">
        <div className="p-3 space-y-3">
          {workOrders.length === 0 ? (
            <div
              className={`
                flex items-center justify-center
                h-24 rounded-lg border-2 border-dashed border-gray-300
                text-sm text-gray-500
                ${isOver ? 'border-primary bg-primary/5' : ''}
              `}
              data-testid={`column-empty-${estado}`}
            >
              Sin OTs
            </div>
          ) : (
            <SortableContext
              items={workOrders.map(wo => wo.id)}
              strategy={verticalListSortingStrategy}
            >
              {workOrders.map((workOrder) => (
                <OTCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  onClick={onOTCardClick}
                  disableDrag={disableDrag}
                  compact={compactCards}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
