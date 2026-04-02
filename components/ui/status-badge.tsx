/**
 * StatusBadge Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Badge redundante con icono + color + texto (WCAG AA)
 * 8 variantes para estados de WorkOrder
 */

import { cn } from '@/lib/utils'
import { Clock, UserCheck, Play, Package, Pause, Wrench, CheckCircle, XCircle } from 'lucide-react'

export interface StatusBadgeProps {
  estado: string
  showLabel?: boolean
  'data-testid'?: string
}

/**
 * Map de estados a iconos, estilos y etiquetas
 */
const estadoConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  className: string
  label: string
}> = {
  PENDIENTE: {
    icon: Clock,
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
    label: 'Pendiente'
  },
  ASIGNADA: {
    icon: UserCheck,
    className: 'bg-blue-100 text-blue-700 border border-blue-300',
    label: 'Asignada'
  },
  EN_PROGRESO: {
    icon: Play,
    className: 'bg-purple-100 text-purple-700 border border-purple-300',
    label: 'En Progreso'
  },
  PENDIENTE_REPUESTO: {
    icon: Package,
    className: 'bg-orange-100 text-orange-700 border border-orange-300',
    label: 'Pendiente Repuesto'
  },
  PENDIENTE_PARADA: {
    icon: Pause,
    className: 'bg-pink-100 text-pink-700 border border-pink-300',
    label: 'Pendiente Parada'
  },
  REPARACION_EXTERNA: {
    icon: Wrench,
    className: 'bg-cyan-100 text-cyan-700 border border-cyan-300',
    label: 'Reparación Externa'
  },
  COMPLETADA: {
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border border-green-300',
    label: 'Completada'
  },
  DESCARTADA: {
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border border-red-300',
    label: 'Cancelada'
  },
}

export function StatusBadge({ estado, showLabel = true, 'data-testid': testId }: StatusBadgeProps) {
  const config = estadoConfig[estado] || {
    icon: Clock,
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
    label: estado
  }

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
        config.className
      )}
      role="status"
      aria-label={`Estado: ${config.label}`}
      data-testid={testId || 'status-badge'}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
