'use client'

/**
 * SortableHeader Component
 * Story 3.4 AC3: Ordenamiento por cualquier columna
 *
 * Features:
 * - Toggle ascendente/descendente/neutral con 3 clicks
 * - Indicador visual: ↑ (asc), ↓ (desc), ↕ (neutral)
 * - URL params: sortBy y sortOrder
 */

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { TableHead } from '@/components/ui/table'

type SortOrder = 'asc' | 'desc' | null

interface SortableHeaderProps {
  column: string // Column identifier for URL param (e.g., 'numero', 'fecha')
  label: string // Display label
  sortBy: string | null // Current sortBy from URL
  sortOrder: SortOrder // Current sortOrder from URL
  className?: string
}

export function SortableHeader({
  column,
  label,
  sortBy,
  sortOrder,
  className,
}: SortableHeaderProps) {
  const isActive = sortBy === column

  // Handle sort toggle: asc → desc → neutral → asc
  const handleSort = useCallback(() => {
    // Get current params from window.location to avoid stale closure issues
    const currentUrl = new URL(window.location.href)
    const params = new URLSearchParams(currentUrl.search)

    let newSortOrder: SortOrder = 'asc'

    if (isActive) {
      // Toggle: asc → desc → neutral
      if (sortOrder === 'asc') {
        newSortOrder = 'desc'
      } else if (sortOrder === 'desc') {
        newSortOrder = null
      } else {
        newSortOrder = 'asc'
      }
    }

    if (newSortOrder) {
      params.set('sortBy', column)
      params.set('sortOrder', newSortOrder)
    } else {
      params.delete('sortBy')
      params.delete('sortOrder')
    }

    // Reset to page 1 when sorting changes
    params.delete('page')

    // Navigate using window.location for reliability
    const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${params.toString()}`
    window.location.href = newUrl
  }, [column, isActive, sortOrder])

  // Determine the indicator to show
  const getIndicator = () => {
    if (isActive && sortOrder === 'asc') {
      return '↑'
    } else if (isActive && sortOrder === 'desc') {
      return '↓'
    }
    return '↕'
  }

  return (
    <TableHead
      className={cn(
        'cursor-pointer select-none hover:bg-muted/50 transition-colors',
        className
      )}
      onClick={handleSort}
      data-testid={`sort-header-${column}`}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <span data-testid="sort-indicator">{getIndicator()}</span>
      </div>
    </TableHead>
  )
}
