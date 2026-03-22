'use client'

/**
 * Filtros y Ordenamiento Component
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Client Component que provee controles de filtro y ordenamiento
 * Características:
 * - Filtro por fecha (date picker)
 * - Filtro por reporter (dropdown) - datos dinámicos desde Prisma
 * - Filtro por equipo (dropdown) - datos dinámicos desde Prisma
 * - Ordenamiento por fecha (toggle asc/desc)
 * - Ordenamiento por prioridad (alta/media/baja)
 * - Actualiza URL search params para manejo de estado
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Reporter {
  id: string
  name: string
}

interface Equipo {
  id: string
  name: string
}

interface FiltrosOrdenamientoProps {
  reporters: Reporter[]
  equipos: Equipo[]
}

export function FiltrosOrdenamiento({ reporters, equipos }: FiltrosOrdenamientoProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const updateUrl = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    // Update params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    // Push new URL
    router.push(`?${current.toString()}`, { scroll: false })
  }

  const handleFechaFilter = (fecha: string) => {
    updateUrl({ filtro_fecha: fecha })
  }

  const handleReporterFilter = (reporterId: string) => {
    updateUrl({ filtro_reporter: reporterId })
  }

  const handleEquipoFilter = (equipoId: string) => {
    updateUrl({ filtro_equipo: equipoId })
  }

  const handleFechaSort = () => {
    const currentSort = searchParams.get('ordenar_fecha')
    const newSort = currentSort === 'asc' ? 'desc' : 'asc'
    updateUrl({ ordenar_fecha: newSort, ordenar_prioridad: '' })
  }

  const handlePrioridadSort = () => {
    const currentSort = searchParams.get('ordenar_prioridad')
    // Toggle between alta, media, baja
    const priorityOrder: string[] = ['alta', 'media', 'baja', '']
    const currentIndex = priorityOrder.indexOf(currentSort || '')
    const newSort = priorityOrder[(currentIndex + 1) % priorityOrder.length]
    updateUrl({ ordenar_prioridad: newSort, ordenar_fecha: '' })
  }

  const clearFilters = () => {
    router.push('/averias/triage', { scroll: false })
  }

  return (
    <div className="space-y-2">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="text-sm text-blue-600 hover:text-blue-800"
        data-testid="filtro-toggle-btn"
      >
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow space-y-3" data-testid="filtros-panel">
          {/* Filtro por Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              onChange={(e) => handleFechaFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              data-testid="fecha-picker"
              defaultValue={searchParams.get('filtro_fecha') || ''}
            />
          </div>

          {/* Filtro por Reporter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reporter
            </label>
            <select
              onChange={(e) => handleReporterFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
              data-testid="filtro-reporter-select"
              defaultValue={searchParams.get('filtro_reporter') || ''}
            >
              <option value="">Todos</option>
              {reporters.map((reporter) => (
                <option key={reporter.id} value={reporter.id}>
                  {reporter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Equipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipo
            </label>
            <select
              onChange={(e) => handleEquipoFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
              data-testid="filtro-equipo-select"
              defaultValue={searchParams.get('filtro_equipo') || ''}
            >
              <option value="">Todos</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por Fecha */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFechaSort}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              data-testid="ordenar-fecha-btn"
            >
              Ordenar por Fecha {
                searchParams.get('ordenar_fecha') === 'asc'
                  ? '↑'
                  : searchParams.get('ordenar_fecha') === 'desc'
                  ? '↓'
                  : '↓'
              }
            </button>
          </div>

          {/* Ordenar por Prioridad */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrioridadSort}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              data-testid="ordenar-prioridad-btn"
            >
              Ordenar por Prioridad {
                searchParams.get('ordenar_prioridad') || '▼'
              }
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800"
            data-testid="clear-filters-btn"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  )
}
