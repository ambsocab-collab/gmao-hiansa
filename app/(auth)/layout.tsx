/**
 * Auth Layout
 * Story 1.0: Sistema de Diseño Multi-Direccional
 * Story 1.1: Login, Registro y Perfil de Usuario
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * Layout for authenticated routes
 * Provides consistent header and footer for all authenticated pages
 * Story 1.5 Changes:
 * - HiansaLogo integrated in header (AC1)
 * - Sidebar variant changed to 'compact' by default (AC2)
 * - Branding consistency: only "GMAO" in sidebar, no "Hiansa" duplication (AC3)
 * - Footer optimized: only "powered by hiansa BSC" (AC4)
 * - Layout by direction: sidebar variant based on route (AC5)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import Sidebar from '@/components/layout/sidebar'
import ScrollFollowCursor from '@/components/layout/scroll-follow-cursor'
import { getSidebarVariant } from '@/lib/sidebar-variants'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Story 1.5 AC5: Get sidebar variant based on current route from x-pathname header
  // Note: Uses headers() which requires server-side execution
  const sidebarVariant = getSidebarVariant()

  // Margin-left based on sidebar variant (FIXED sidebar on desktop)
  // Using arbitrary values to ensure Tailwind compiles them
  let marginLeft = 'md:ml-[160px]' // mini (default)
  if (sidebarVariant === 'default') marginLeft = 'md:ml-[256px]'
  else if (sidebarVariant === 'compact') marginLeft = 'md:ml-[200px]'

  return (
    <>
      {/* Sidebar Navigation - FIXED position, outside of flex flow */}
      <Sidebar variant={sidebarVariant} userCapabilities={session.user.capabilities} />

      {/* Main Content Area - with margin for fixed sidebar */}
      <div className={`${marginLeft} bg-background`}>
        {/* Content area with scroll - starts below header (mt-16) */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <ScrollFollowCursor className="min-h-full">
            {/* Main Content - SIN header propio (el header está en el layout raíz) */}
            <main className="w-full px-4">{children}</main>
          </ScrollFollowCursor>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </>
  )
}
