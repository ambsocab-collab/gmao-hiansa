/**
 * Sidebar Component
 * Story 1.0: Sistema de Diseño Multi-Direccional
 *
 * Multi-directional design sidebar with 3 width variants for different UX patterns:
 * - default: 256px (w-64) for Dashboard clásico (Dirección 1)
 * - compact: 200px (w-52) for Kanban First (Dirección 2)
 * - mini: 160px (w-40) for Data Heavy (Dirección 4)
 *
 * @component
 * @example
 * ```tsx
 * <Sidebar variant="default" /> // Dashboard classic
 * <Sidebar variant="compact" /> // Kanban first
 * <Sidebar variant="mini" /> // Data heavy
 * ```
 */

'use client'

import React from 'react'
import HiansaLogo from '@/components/brand/hiansa-logo'
import { Navigation } from '@/components/users/Navigation'

export interface SidebarProps {
  /**
   * Width variant for the sidebar
   * @default 'default'
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
  compact: 'w-52', // 200px - Kanban First
  mini: 'w-40', // 160px - Data Heavy
}

/**
 * Sidebar component with multi-directional design variants
 */
export default function Sidebar({ variant = 'default', userCapabilities, className = '' }: SidebarProps) {
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
      {/* Logo Section */}
      <div className="p-6">
        <HiansaLogo size="md" />
      </div>

      {/* Brand Name - Only "GMAO" without "Hiansa" to avoid redundancy (Story 1.0 AC5) */}
      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold text-foreground">GMAO</h2>
      </div>

      {/* Navigation - Uses PBAC-filtered Navigation component (Story 1.2) */}
      <div className="flex-1 px-4">
        <Navigation userCapabilities={userCapabilities} className="bg-transparent border-none p-0" />
      </div>

      {/* Footer - Story 1.0 AC5: Only "powered by hiansa BSC" */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          powered by hiansa BSC
        </p>
      </div>
    </aside>
  )
}
