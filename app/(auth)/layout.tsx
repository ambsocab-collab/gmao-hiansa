/**
 * Auth Layout
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Layout for authenticated routes
 * Provides consistent header and footer for all authenticated pages
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/users/Navigation'

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r fixed h-full overflow-y-auto">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center mb-6">
            <h1 className="text-lg font-bold text-gray-900">
              GMAO HIANSA
            </h1>
          </Link>

          {/* Navigation filtered by user capabilities */}
          <Navigation userCapabilities={session.user.capabilities} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Page Title (will be overridden by individual pages) */}
              <div className="flex-1">
                {/* Empty div for spacing */}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                {/* Avatar with dropdown trigger */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    Hola, {session.user.name}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium"
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

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} GMAO HIANSA. Sistema de Gestión de Mantenimiento.
            </p>
          </div>
        </footer>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
