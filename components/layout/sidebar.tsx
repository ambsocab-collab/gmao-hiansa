/**
 * Sidebar Component
 * Story 1.0: Sistema de Diseño Multi-Direccional
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * Multi-directional design sidebar with 3 width variants for different UX patterns:
 * - default: 256px (w-64) for Dashboard clásico (Dirección 1)
 * - compact: 200px (w-52) for Kanban First (Dirección 2) - DEFAULT for Story 1.5
 * - mini: 160px (w-40) for Data Heavy (Dirección 4)
 *
 * Story 1.5 Changes:
 * - Logo moved to header (removed from sidebar)
 * - Footer removed from sidebar (redundant with main footer)
 * - Default variant changed to 'compact' (200px)
 *
 * @component
 * @example
 * ```tsx
 * <Sidebar variant="default" /> // Dashboard classic (256px)
 * <Sidebar variant="compact" /> // Kanban first (200px) - DEFAULT
 * <Sidebar variant="mini" /> // Data heavy (160px)
 * ```
 */

'use client'

import React from 'react'
import { Navigation } from '@/components/users/Navigation'

export interface SidebarProps {
  /**
   * Width variant for the sidebar
   * @default 'compact' (Story 1.5: Changed from 'default' to 'compact')
   */
  variant?: 'default' | 'compact' | 'mini'
  /**
   * User capabilities for PBAC filtering
   */
  userCapabilities?: string[]
  /**
   * Additional CSS classes to apply
   */
  className?: string
}

const variantWidths = {
  default: 'w-64', // 256px - Dashboard clásico
  compact: 'w-52', // 200px - Kanban First (DEFAULT from Story 1.5)
  mini: 'w-40', // 160px - Data Heavy
}

/**
 * Sidebar component with multi-directional design variants
 * Story 1.5: Logo removed (moved to header), footer removed (redundant)
 */
export default function Sidebar({ variant = 'compact', userCapabilities, className = '' }: SidebarProps) {
  const widthClass = variantWidths[variant]

  return (
    <aside
      className={`
        ${widthClass}
        ${className}
        hidden
        md:flex
        flex-col
        bg-background
        border-r
        border-border
        h-screen
        sticky
        top-0
      `.trim()}
    >
      {/* Brand Name - Only "GMAO" without "Hiansa" (Story 1.0 AC5, Story 1.5 AC3) */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-foreground">GMAO</h2>
      </div>

      {/* Navigation - Uses PBAC-filtered Navigation component (Story 1.2) */}
      <div className="flex-1 px-4">
        <Navigation userCapabilities={userCapabilities} className="bg-transparent border-none p-0" />
      </div>
    </aside>
  )
}
