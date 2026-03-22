'use client'

/**
 * Failure Report Card Component
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Client Component that displays a failure report card
 * Features:
 * - Displays: número, equipo, descripción (truncada), reporter, fecha/hora
 * - Color coding: rosa (#FFC0CB) para avería, blanco (#FFFFFF) para reparación (NFR-S10)
 * - Click handler to open modal
 * - Touch target: 44px mínimo (mobile first)
 * - data-testid attributes for E2E tests
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { FailureReportModal } from './failure-report-modal'

export interface FailureReportWithRelations {
  id: string
  numero: string
  descripcion: string
  tipo: string // 'avería' | 'reparación' (NFR-S10)
  fotoUrl: string | null
  createdAt: Date
  equipo: {
    id: string
    name: string
    code: string
    linea: {
      id: string
      name: string
      planta: {
        id: string
        name: string
        division: string
      }
    }
  }
  reporter: {
    id: string
    name: string
    email: string
  }
}

interface FailureReportCardProps {
  report: FailureReportWithRelations
  tipo: 'avería' | 'reparación' // Determines color coding (NFR-S10)
  userId: string
}

export function FailureReportCard({ report, tipo, userId }: FailureReportCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  // Color coding (NFR-S10): rosa #FFC0CB para avería, blanco #FFFFFF para reparación
  const customStyle = tipo === 'avería'
    ? { backgroundColor: '#FFC0CB' }  // Rosa exacto #FFC0CB
    : { backgroundColor: '#FFFFFF' } // Blanco exacto #FFFFFF

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Truncate description for card display (max 2 lines ~100 chars)
  const truncateDescription = (description: string, maxLength = 100) => {
    if (description.length <= maxLength) return description
    return description.slice(0, maxLength).trim() + '...'
  }

  return (
    <>
      <Card
        className="p-4 cursor-pointer hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-between"
        style={customStyle}
        data-testid={`failure-report-card-${report.id}`}
        onClick={() => setModalOpen(true)}
      >
        {/* Card Header: Number + Date */}
        <div className="flex justify-between items-start mb-2">
          <p
            className="font-semibold text-gray-900"
            data-testid="numero"
          >
            #{report.numero}
          </p>
          <p
            className="text-xs text-gray-500"
            data-testid="fecha"
          >
            {formatDate(report.createdAt)}
          </p>
        </div>

        {/* Equipo with hierarchy */}
        <p
          className="text-sm font-medium text-gray-800 mb-1"
          data-testid="equipo"
        >
          {report.equipo.name}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {report.equipo.linea.planta.division} → {report.equipo.linea.planta.name} → {report.equipo.linea.name}
        </p>

        {/* Descripción (truncada) */}
        <p
          className="text-sm text-gray-700 line-clamp-2 flex-grow"
          data-testid="descripcion"
        >
          {truncateDescription(report.descripcion)}
        </p>

        {/* Card Footer: Reporter */}
        <div className="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500" data-testid="reporter">
            Reportado por: {report.reporter.name}
          </p>
        </div>
      </Card>

      {/* Modal (only rendered when open) */}
      {modalOpen && (
        <FailureReportModal
          report={report}
          tipo={tipo}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
        />
      )}
    </>
  )
}
