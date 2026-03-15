/**
 * Sidebar Component
 * Story 1.0: Sistema de Diseño Multi-Direccional
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * Multi-directional design sidebar with 3 width variants for different UX patterns:
 * - default: 256px (w-64) for Dashboard clásico (Dirección 1)
 * - compact: 200px (w-52) for Kanban First (Dirección 2)
 * - mini: 160px (w-40) for Data Heavy (Dirección 4)
 *
 * Story 1.5 Changes:
 * - Logo moved to header (removed from sidebar)
 * - Footer removed from sidebar (redundant with main footer)
 * - Default variant changed to 'mini' (160px)
 * - Mobile responsive: Sidebar hidden by default, toggleable with hamburger button
 *
 * @component
 * @example
 * ```tsx
 * <Sidebar variant="default" /> // Dashboard classic (256px)
 * <Sidebar variant="compact" /> // Kanban first (200px)
 * <Sidebar variant="mini" /> // Data heavy (160px) - DEFAULT
 * ```
 */

'use client'

import React, { useState } from 'react'
import { Navigation } from '@/components/users/Navigation'

export interface SidebarProps {
  /**
   * Width variant for the sidebar
   * @default 'mini' (Story 1.5: Changed from 'default' to 'mini')
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
  mini: 'w-40', // 160px - Data Heavy - DEFAULT
}

/**
 * Sidebar component with multi-directional design variants
 * Story 1.5: Logo removed (moved to header), footer removed (redundant), "GMAO" removed
 * Mobile responsive: Hidden on mobile, toggleable with hamburger button
 */
export default function Sidebar({ variant = 'mini', userCapabilities, className = '' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const widthClass = variantWidths[variant]

  return (
    <>
      {/* Overlay oscuro - Solo visible en mobile cuando sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${widthClass}
          ${className}
          fixed
          top-16
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          z-40
          transition-transform duration-300 ease-in-out
          flex
          flex-col
          bg-background
          border-r
          border-border
          h-[calc(100vh-4rem)]
          overflow-hidden
        `.trim()}
        aria-label="Sidebar de navegación"
      >
        {/* Botón de toggle (oculto) - Para ser accedido desde el header */}
        <button
          id="sidebar-toggle-trigger"
          className="hidden"
          onClick={() => setIsOpen(true)}
          aria-hidden="true"
        />

        {/* Botón cerrar - Solo visible en mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation - Uses PBAC-filtered Navigation component (Story 1.2) */}
        <div className="flex-1 px-2 py-4">
          <Navigation userCapabilities={userCapabilities} className="bg-transparent border-none p-0" />
        </div>
      </aside>
    </>
  )
}
