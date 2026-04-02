/**
 * Dashboard Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected dashboard page that requires authentication
 * Shows user greeting and avatar with initials
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { getCapabilityLabel } from '@/lib/capabilities'

export const metadata = {
  title: 'Dashboard - GMAO HIANSA',
  description: 'Panel principal de gestión de mantenimiento',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user's initials for avatar
  const _initials = session.user.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U'

  return (
    <>
      {/* Page Header - Solo título, sin avatar repetido */}
      <div className="mb-4">
        <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-600 mt-1">
          Bienvenido al Sistema de Gestión de Mantenimiento
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-3">
        <h2 className="text-sm font-medium text-gray-900 mb-2">
          Selecciona una opción del menú para comenzar.
        </h2>
      </div>

        {/* User Info Card */}
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Información de Usuario
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-xs text-gray-900">{session.user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-xs text-gray-900">{session.user.email}</dd>
            </div>
          </dl>

          {/* Capabilities List */}
          <div className="mt-4">
            <dt className="text-xs font-medium text-gray-500 mb-2">Permisos</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {session.user.capabilities?.map((capability: string) => (
                <span
                  key={capability}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  title={capability}
                >
                  {getCapabilityLabel(capability)}
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
      </>
    )
}
