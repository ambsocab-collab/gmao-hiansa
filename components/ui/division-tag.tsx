/**
 * DivisionTag Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Tag con color específico para división
 * HiRock (#FFD700) - Fondo amarillo/dorado, texto negro
 * Ultra (#8FBC8F) - Fondo verde salvia, texto negro
 */

import { cn } from '@/lib/utils'

export interface DivisionTagProps {
  division?: string | null
  showLabel?: boolean
}

/**
 * Map de divisiones a estilos y etiquetas
 */
const divisionConfig = {
  HIROCK: {
    className: 'bg-yellow-400 text-black border-yellow-500',
    label: 'HiRock'
  },
  ULTRA: {
    className: 'bg-emerald-400 text-black border-emerald-500',
    label: 'Ultra'
  },
} as const

export function DivisionTag({ division, showLabel = true }: DivisionTagProps) {
  if (!division) {
    return null
  }

  const divisionKey = division.toUpperCase() as keyof typeof divisionConfig
  const config = divisionConfig[divisionKey]

  if (!config) {
    // Fallback para divisiones desconocidas
    return (
      <span
        className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-300"
        role="status"
        aria-label={`División: ${division}`}
      >
        {showLabel && <span>{division}</span>}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border',
        config.className
      )}
      role="status"
      aria-label={`División: ${config.label}`}
    >
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
