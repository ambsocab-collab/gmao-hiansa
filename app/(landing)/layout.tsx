/**
 * Landing Page Layout
 * Story 1.4: Landing Page Minimalista
 *
 * Layout específico para la landing page
 * Sin header "GMAO Hiansa" ni footer del layout raíz
 * Solo renderiza los children (la landing page)
 */

import { Toaster } from '@/components/ui/toaster'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Solo renderiza el contenido de la landing page, sin header ni footer */}
      {children}

      {/* Toast notification container */}
      <Toaster />
    </>
  )
}
