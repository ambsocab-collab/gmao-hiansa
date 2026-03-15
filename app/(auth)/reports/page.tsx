/**
 * Reports Page - Placeholder for testing PBAC
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * This page requires can_view_repair_history capability
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Reportes e Historial - GMAO HIANSA',
  description: 'Reportes e historial de reparaciones',
}

export default async function ReportsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-base font-semibold text-gray-900">Reportes e Historial</h1>
      <p className="mt-1 text-xs text-gray-600">
        Historial de reparaciones y reportes
      </p>

      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Página de reportes e historial (Próximamente)
        </p>
      </div>
    </div>
  )
}
