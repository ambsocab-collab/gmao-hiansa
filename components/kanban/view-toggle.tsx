'use client'

/**
 * ViewToggle Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * AC8: Toggle Kanban ↔ Listado con sincronización
 *
 * Toggle button para alternar entre vista Kanban y Listado
 * - Guarda preferencia en localStorage
 * - Sincronización bidireccional de filtros
 * - data-testid="vista-toggle"
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'

type ViewMode = 'kanban' | 'list'

const VIEW_MODE_KEY = 'ots-view-mode-preference'

export interface ViewToggleProps {
  currentView?: ViewMode
}

export function ViewToggle({ currentView = 'kanban' }: ViewToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [viewMode, setViewMode] = useState<ViewMode>(currentView)

  // Cargar preferencia guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null
      if (saved && (saved === 'kanban' || saved === 'list')) {
        setViewMode(saved)
      }
    }
  }, [])

  // Actualizar estado si cambia la prop externa
  useEffect(() => {
    setViewMode(currentView)
  }, [currentView])

  /**
   * Toggle entre vista Kanban y Listado
   */
  const handleToggle = () => {
    const newViewMode: ViewMode = viewMode === 'kanban' ? 'list' : 'kanban'

    // Guardar preferencia en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, newViewMode)
    }

    setViewMode(newViewMode)

    // Navegar a la nueva vista
    if (newViewMode === 'kanban') {
      router.push('/ots/kanban')
    } else {
      router.push('/ots/lista')
    }
  }

  // Determinar iconos y labels según vista actual
  const isKanbanView = viewMode === 'kanban' || pathname?.includes('/kanban')

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      data-testid="vista-toggle"
      className="gap-2"
    >
      {isKanbanView ? (
        <>
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Vista Lista</span>
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Vista Kanban</span>
        </>
      )}
    </Button>
  )
}
