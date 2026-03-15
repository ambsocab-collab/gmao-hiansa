/**
 * Hamburger Button Component
 *
 * Mobile menu toggle button that triggers the sidebar to open
 * Only visible on mobile/tablet screens (hidden on desktop)
 *
 * @component
 */

'use client'

import React from 'react'

/**
 * Hamburger button to toggle sidebar on mobile/tablet
 */
export default function HamburgerButton() {
  const handleToggle = () => {
    // Find the hidden toggle trigger button in the sidebar and click it
    const toggleTrigger = document.getElementById('sidebar-toggle-trigger')
    toggleTrigger?.click()
  }

  return (
    <button
      className="md:hidden p-2 text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
      onClick={handleToggle}
      aria-label="Abrir menú de navegación"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  )
}
