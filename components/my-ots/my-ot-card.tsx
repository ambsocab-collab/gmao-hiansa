'use client'

/**
 * MyOTCard - Tarjeta compacta para OT asignada
 *
 * Story 3.2: Gestión de OTs Asignadas (Mis OTs)
 * AC1: Vista de "Mis OTs" con cards de info básica
 *
 * Muestra:
 * - Número OT
 * - Estado badge
 * - Nombre equipo
 * - División tag (HiRock/Ultra)
 * - Fecha asignación
 */

import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import type { WorkOrder } from '@prisma/client'

interface WorkOrderWithRelations extends WorkOrder {
  equipo: {
    id: string
    name: string
    linea?: {
      name: string
      planta?: {
        division: string
      }
    }
  }
}

interface MyOTCardProps {
  ot: WorkOrderWithRelations
  onClick: () => void
}

/**
 * MyOTCard Component
 *
 * - Card clickable con hover state
 * - Responsive: 44px min-height en móvil (Apple HIG)
 * - Muestra info básica de OT
 */
export function MyOTCard({ ot, onClick }: MyOTCardProps) {
  // Extraer división del equipo (con optional chaining para evitar crashes)
  const division = ot.equipo?.linea?.planta?.division

  // Calcular fecha de asignación (relativa) - JavaScript nativo
  const now = new Date()
  const created = new Date(ot.created_at)
  const seconds = Math.floor((now.getTime() - created.getTime()) / 1000)

  let timeAgo: string
  if (seconds < 60) {
    timeAgo = 'hace un momento'
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    timeAgo = `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    timeAgo = `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  } else {
    const days = Math.floor(seconds / 86400)
    timeAgo = `hace ${days} ${days === 1 ? 'día' : 'días'}`
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        // Accesibilidad: permitir abrir con Enter/Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`
        bg-white dark:bg-gray-800 rounded-lg border
        border-gray-200 dark:border-gray-700
        p-4 cursor-pointer transition-all duration-200
        hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        min-h-[44px] /* NFR-A3: Touch target mínimo 44px */
        flex flex-col sm:flex-row sm:items-center justify-between gap-3
      `}
      data-testid={`my-ot-card-${ot.id}`}
      aria-label={`OT ${ot.numero} - ${ot.equipo.name}`}
    >
      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        {/* Header: Número OT + Estado + División */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {/* Número OT */}
          <h3
            className="text-sm font-semibold text-gray-900 dark:text-gray-100"
            data-testid="ot-numero"
          >
            {ot.numero}
          </h3>

          {/* Estado Badge */}
          <div data-testid="ot-estado-badge">
            <StatusBadge estado={ot.estado} />
          </div>

          {/* AC6: Badge "Verificada" */}
          {ot.verificacion_at && (
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              data-testid="ot-verified-badge"
            >
              ✓ Verificada
            </span>
          )}

          {/* División Tag */}
          {division && <DivisionTag division={division} />}
        </div>

        {/* Info secundaria: Equipo + Fecha */}
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          {/* Nombre equipo */}
          <span
            className="truncate"
            data-testid="ot-equipo"
          >
            {ot.equipo.name}
          </span>

          {/* Separador */}
          <span className="text-gray-300">•</span>

          {/* Fecha asignación */}
          <time
            dateTime={ot.created_at.toISOString()}
            data-testid="ot-fecha-asignacion"
          >
            {timeAgo}
          </time>
        </div>
      </div>

      {/* Chevron indicador de click (desktop only) */}
      <div className="hidden sm:block text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  )
}
