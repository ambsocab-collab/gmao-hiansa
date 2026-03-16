/**
 * Nuevo Reporte de Avería Page
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Page for reporting equipment failures
 * Features:
 * - Integrates EquipoSearch component
 * - Stores selected equipoId in form state
 * - Validates equipo selection before submit
 *
 * NOTE: Full form will be implemented in Story 2.2
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

  return <ReporteAveriaForm />
}
