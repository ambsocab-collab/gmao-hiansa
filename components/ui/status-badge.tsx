/**
 * StatusBadge Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Badge redundante con icono + color + texto (WCAG AA)
 * 8 variantes para estados de WorkOrder
 */

import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  estado: string
  showLabel?: boolean
}

/**
 * Map de estados a estilos y etiquetas
 */
const estadoConfig: Record<string, { className: string; label: string }> = {
  PENDIENTE: {
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
    label: 'Pendiente'
  },
  ASIGNADA: {
    className: 'bg-blue-100 text-blue-700 border border-blue-300',
    label: 'Asignada'
  },
  EN_PROGRESO: {
    className: 'bg-purple-100 text-purple-700 border border-purple-300',
    label: 'En Progreso'
  },
  PENDIENTE_REPUESTO: {
    className: 'bg-orange-100 text-orange-700 border border-orange-300',
    label: 'Pendiente Repuesto'
  },
  PENDIENTE_PARADA: {
    className: 'bg-pink-100 text-pink-700 border border-pink-300',
    label: 'Pendiente Parada'
  },
  REPARACION_EXTERNA: {
    className: 'bg-cyan-100 text-cyan-700 border border-cyan-300',
    label: 'Reparación Externa'
  },
  COMPLETADA: {
    className: 'bg-green-100 text-green-700 border border-green-300',
    label: 'Completada'
  },
  DESCARTADA: {
    className: 'bg-red-100 text-red-700 border border-red-300',
    label: 'Cancelada'
  },
}

export function StatusBadge({ estado, showLabel = true }: StatusBadgeProps) {
  const config = estadoConfig[estado] || {
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
    label: estado
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
        config.className
      )}
      role="status"
      aria-label={`Estado: ${config.label}`}
    >
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
