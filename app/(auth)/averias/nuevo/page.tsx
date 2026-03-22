/**
 * Nuevo Reporte de Avería Page
 * Story 2.2: Formulario Reporte de Avería (Mobile First)
 *
 * Page for reporting equipment failures
 * Features:
 * - Server Component wrapper with auth protection
 * - Passes userId to ReporteAveriaForm
 * - Mobile First layout (handled by form component)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { ReporteAveriaForm } from '@/components/averias/reporte-averia-form'

export const metadata = {
  title: 'Nuevo Reporte de Avería - GMAO HIANSA',
  description: 'Reportar una avería en un equipo',
}

export default async function NuevoAveriaPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportar Avería</h1>
        <p className="text-gray-600 mt-2">
          Completa el formulario para reportar una falla en un equipo
        </p>
      </div>

      {/* Form Component */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ReporteAveriaForm userId={session.user.id} />
      </div>
    </div>
  )
}
