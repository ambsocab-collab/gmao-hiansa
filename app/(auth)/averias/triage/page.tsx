/**
 * Triage de Averías Page
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Page for supervisors to review new failure reports and convert them to work orders
 * Features:
 * - Server Component wrapper with auth protection (middleware handles PBAC)
 * - Displays TriageColumn with new failure reports (estado: NUEVO)
 * - Shows count badge: "Por Revisar (N)"
 * - Mobile First layout (handled by TriageColumn component)
 */

import { auth } from '@/lib/auth-adapter'
import { TriageColumn } from '@/components/averias/triage-column'

export const metadata = {
  title: 'Triage de Averías - GMAO HIANSA',
  description: 'Revisar y convertir reportes de avería en órdenes de trabajo',
}

export default async function TriagePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Get session to extract userId for discard audit log
  const session = await auth()
  const userId = session?.user?.id || ''

  // Note: Middleware handles auth + capability check (can_view_all_ots)
  // If user doesn't have capability, they get redirected to /unauthorized

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Triage de Averías</h1>
        <p className="text-gray-600 mt-2">
          Revisa los reportes nuevos y conviértelos en órdenes de trabajo
        </p>
      </div>

      {/* Triage Column Component */}
      <TriageColumn userId={userId} searchParams={searchParams} />
    </div>
  )
}
