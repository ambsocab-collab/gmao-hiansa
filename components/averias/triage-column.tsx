/**
 * Triage Column Component
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Server Component that displays new failure reports in a triage column
 * Features:
 * - Fetches FailureReports with estado "NUEVO" from Prisma
 * - Displays count badge: "Por Revisar (N)"
 * - Renders FailureReportCard for each report
 * - Mobile First layout (single column <768px)
 * - Includes equipo hierarchy (Planta > Línea > Equipo)
 */

import { prisma } from '@/lib/db'
import { FailureReportCard } from './failure-report-card'

export async function TriageColumn() {
  // Fetch failure reports with estado "NUEVO"
  // Include equipo (with linea.planta) and reporter for display
  const failureReports = await prisma.failureReport.findMany({
    where: {
      estado: 'NUEVO',
    },
    include: {
      equipo: {
        include: {
          linea: {
            include: {
              planta: true,
            },
          },
        },
      },
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Most recent first
    },
  })

  return (
    <div data-testid="averias-triage" className="space-y-4">
      {/* Column Header with Count Badge */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Por Revisar ({failureReports.length})
        </h2>

        {/* TODO: Filters (P2) - Date, Reporter, Equipo */}
        {/* TODO: Sort buttons (P2) - Date, Priority */}
      </div>

      {/* Failure Report Cards */}
      {failureReports.length === 0 ? (
        // Empty state
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No hay averías pendientes de revisión
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Los nuevos reportes aparecerán aquí
          </p>
        </div>
      ) : (
        // Grid of cards (responsive: 1 column mobile, 2 columns desktop >1200px)
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {failureReports.map((report) => (
            <FailureReportCard
              key={report.id}
              report={report}
              tipo="avería" // Color rosa (NFR-S10)
            />
          ))}
        </div>
      )}
    </div>
  )
}
