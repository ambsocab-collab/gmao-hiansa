/**
 * KPIs Page - Key Performance Indicators
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * This page requires can_view_kpis capability
 * Shows specific error message if user lacks the capability
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'KPIs - GMAO HIANSA',
  description: 'Indicadores clave de rendimiento',
}

export default async function KPIsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const userCapabilities = session.user.capabilities || []
  const canViewKPIs = userCapabilities.includes('can_view_kpis')

  if (!canViewKPIs) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Acceso Denegado</h1>
          <p className="text-red-700" data-testid="kpi-error-message">
            No tienes permiso para ver KPIs
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">KPIs - Indicadores Clave de Rendimiento</h1>
      <p className="mt-2 text-sm text-gray-600">
        Métricas y análisis de rendimiento
      </p>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">
          Página de KPIs (Próximamente)
        </p>
      </div>
    </div>
  )
}
