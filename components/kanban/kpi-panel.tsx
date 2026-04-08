'use client'

/**
 * KPI Panel Component
 * Story 3.1 AC4: Vista optimizada para Tablet
 *
 * Panel lateral con KPIs del Kanban:
 * - Total OTs
 * - OTs En Progreso
 * - OTs Completadas
 * - Colapsable en tablet
 */

import { WorkOrderEstado } from '@prisma/client'
import { ChevronLeft, ChevronRight, ClipboardList, Play, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KPIPanelProps {
  workOrdersByEstado: Record<WorkOrderEstado, unknown[]>
  isCollapsed?: boolean
  onToggle?: () => void
}

export function KPIPanel({ workOrdersByEstado, isCollapsed = false, onToggle }: KPIPanelProps) {
  // Calculate KPIs
  const totalOTs = Object.values(workOrdersByEstado).reduce((sum, arr) => sum + arr.length, 0)
  const inProgress = workOrdersByEstado['EN_PROGRESO']?.length || 0
  const completed = workOrdersByEstado['COMPLETADA']?.length || 0

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-12" : "w-64"
      )}
      data-testid="kpi-panel"
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
        data-testid="kpi-panel-toggle"
        aria-label={isCollapsed ? "Expandir panel KPI" : "Colapsar panel KPI"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            KPIs
          </h2>

          {/* Total OTs */}
          <div
            className="bg-gray-50 rounded-lg p-3"
            data-testid="kpi-total-ots"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Total OTs</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalOTs}</p>
          </div>

          {/* En Progreso */}
          <div
            className="bg-purple-50 rounded-lg p-3"
            data-testid="kpi-in-progress"
          >
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-purple-600">En Progreso</span>
            </div>
            <p className="text-2xl font-bold text-purple-700 mt-1">{inProgress}</p>
          </div>

          {/* Completadas */}
          <div
            className="bg-green-50 rounded-lg p-3"
            data-testid="kpi-completed"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Completadas</span>
            </div>
            <p className="text-2xl font-bold text-green-700 mt-1">{completed}</p>
          </div>
        </div>
      )}
    </div>
  )
}
