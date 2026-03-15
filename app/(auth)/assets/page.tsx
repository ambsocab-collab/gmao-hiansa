/**
 * Assets Page - Placeholder for testing PBAC
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * This page requires can_manage_assets capability
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Activos/Equipos - GMAO HIANSA',
  description: 'Gestión de activos y equipos',
}

export default async function AssetsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-base font-semibold text-gray-900">Activos/Equipos</h1>
      <p className="mt-1 text-xs text-gray-600">
        Gestión de activos y equipos del sistema
      </p>

      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Página de gestión de activos (Próximamente)
        </p>
      </div>
    </div>
  )
}
