/**
 * Dashboard Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected dashboard page that requires authentication
 * Shows user greeting and avatar with initials
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard - GMAO HiRock/Ultra',
  description: 'Panel principal de gestión de mantenimiento',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user's initials for avatar
  const initials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Hola, {session.user.name}
              </p>
            </div>

            {/* User Avatar with initials */}
            <div
              data-testid="user-avatar"
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium"
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bienvenido al Sistema de Gestión de Mantenimiento
          </h2>
          <p className="text-gray-600">
            Selecciona una opción del menú para comenzar.
          </p>
        </div>

        {/* User Info Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">
            Información de Usuario
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.user.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.user.email}</dd>
            </div>
          </dl>

          {/* Capabilities List */}
          <div className="mt-4">
            <dt className="text-sm font-medium text-gray-500 mb-2">Capabilities</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {session.user.capabilities?.map((capability) => (
                <span
                  key={capability}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {capability}
                </span>
              ))}
            </dd>
          </div>

          {/* Force Password Reset Warning */}
          {session.user.forcePasswordReset && (
            <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                ⚠️ Debes cambiar tu contraseña temporal en el primer acceso.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
