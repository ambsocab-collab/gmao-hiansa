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
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import HiansaLogo from '@/components/brand/hiansa-logo'
import Sidebar from '@/components/layout/sidebar'
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

  // Get user's initials for avatar
  const initials = session.user.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U'

  // Story 1.5 AC5: Get sidebar variant based on current route from x-pathname header
  // Note: Uses headers() which requires server-side execution
  const sidebarVariant = getSidebarVariant()

  // Calculate margin-left based on sidebar variant
  // CRITICAL Issue 4 fix: Only apply margin on desktop (md:), not mobile
  // Sidebar is hidden on mobile, so main content should have no margin
  const marginLeftMap = {
    default: 'ml-0 md:ml-64',  // 0px on mobile, 256px on desktop
    compact: 'ml-0 md:ml-52',  // 0px on mobile, 200px on desktop
    mini: 'ml-0 md:ml-40'      // 0px on mobile, 160px on desktop
  }
  const marginLeft = marginLeftMap[sidebarVariant]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation - Story 1.5 AC5: Variant based on route */}
      <Sidebar variant={sidebarVariant} userCapabilities={session.user.capabilities} />

      {/* Main Content Area - Story 1.5 AC5: Margin based on sidebar variant */}
      <div className={`flex-1 ${marginLeft}`}>
        {/* Header - Story 1.5 AC1: HiansaLogo integrated in header */}
        <header className="bg-background shadow-sm border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Story 1.5 AC1: Hiansa Logo in header */}
              <div className="flex-shrink-0">
                <HiansaLogo size="md" className="w-40 h-10" data-testid="header-logo" />
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                {/* Avatar with dropdown trigger */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">
                    Hola, {session.user.name}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium"
                    data-testid="user-avatar"
                  >
                    {initials}
                  </div>
                </div>

                {/* Logout Button */}
                <form action="/api/auth/signout" method="POST">
                  <Button type="submit" variant="outline" size="sm" data-testid="logout-button">
                    Cerrar Sesión
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">{children}</main>

        {/* Footer - Story 1.5 AC4: Only "powered by hiansa BSC", no repetition */}
        <footer className="bg-background border-t border-border mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-muted-foreground text-center">
              powered by hiansa BSC
            </p>
          </div>
        </footer>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
