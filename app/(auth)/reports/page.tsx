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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Reportes e Historial</h1>
      <p className="mt-2 text-sm text-gray-600">
        Historial de reparaciones y reportes
      </p>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">
          Página de reportes e historial (Próximamente)
        </p>
      </div>
    </div>
  )
}
