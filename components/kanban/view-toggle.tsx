'use client'

/**
 * ViewToggle Component
 * Story 3.1: Kanban - 8 Columnas con Drag and Drop
 * Story 3.4: Vista de Listado con Filtros y Sync Real-time
 *
 * AC5: Toggle Kanban ↔ Listado with syncronization
 *  - Toggle button to between views
 *  - Guarda preference in localStorage
 *  - data-testid="view-toggle"
 *  - Separate buttons for Kanban and Lista with data-active attribute
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'kanban' | 'list'

const VIEW_MODE_KEY = 'ots-view-mode-preference'

export interface ViewToggleProps {
  currentView?: ViewMode
}

export function ViewToggle({ currentView = 'kanban' }: ViewToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [viewMode, setViewMode] = useState<ViewMode>(currentView)

  // Determine if we're on kanban or list view based on pathname
  const isKanbanActive = pathname?.includes('/kanban')
  const isListActive = pathname?.includes('/lista')

  // Load saved preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null
      if (saved && (saved === 'kanban' || saved === 'list')) {
        setViewMode(saved)
      }
    }
  }, [])

  // Update state if external prop changes
  useEffect(() => {
    setViewMode(currentView)
  }, [currentView])

  /**
   * Get current URL search params from window.location
   * This avoids the Suspense boundary requirement of useSearchParams()
   */
  const getCurrentSearchParams = (): string => {
    if (typeof window !== 'undefined') {
      const search = window.location.search
      return search ? search.slice(1) : '' // Remove the leading '?'
    }
    return ''
  }

  /**
   * Navigate to Kanban view, preserving current filters
   */
  const handleKanbanClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, 'kanban')
    }
    setViewMode('kanban')
    // Preserve current URL params (filters, sorting) when switching views
    const currentParams = getCurrentSearchParams()
    const targetUrl = currentParams ? `/ots/kanban?${currentParams}` : '/ots/kanban'
    window.location.href = targetUrl
  }

  /**
   * Navigate to Lista view, preserving current filters
   */
  const handleListClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, 'list')
    }
    setViewMode('list')
    // Preserve current URL params (filters, sorting) when switching views
    const currentParams = getCurrentSearchParams()
    const targetUrl = currentParams ? `/ots/lista?${currentParams}` : '/ots/lista'
    window.location.href = targetUrl
  }

  return (
    <div
      className="flex items-center gap-1 p-1 bg-muted rounded-md"
      data-testid="view-toggle"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleKanbanClick}
        data-testid="view-toggle-kanban"
        data-active={isKanbanActive ? 'true' : 'false'}
        className={cn(
          "gap-1.5 px-3",
          isKanbanActive && "bg-white shadow-sm"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Kanban</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleListClick}
        data-testid="view-toggle-lista"
        data-active={isListActive ? 'true' : 'false'}
        className={cn(
          "gap-1.5 px-3",
          isListActive && "bg-white shadow-sm"
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Lista</span>
      </Button>
    </div>
  )
}
