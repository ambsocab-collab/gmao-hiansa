'use client'

/**
 * Failure Report Modal Component
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Client Component that displays detailed failure report information
 * Features:
 * - Shows full details: foto (if exists), description, equipo hierarchy, reporter, timestamp
 * - Action buttons: "Convertir a OT", "Descartar"
 * - shadcn/ui Dialog component
 * - data-testid attributes for E2E tests
 *
 * TODO: Story 2.3 - Add Server Actions for convert/discard functionality
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { FailureReportWithRelations } from './failure-report-card'

interface FailureReportModalProps {
  report: FailureReportWithRelations
  tipo: 'avería' | 'reparación'
  open: boolean
  onClose: () => void
}

export function FailureReportModal({ report, tipo: _tipo, open, onClose }: FailureReportModalProps) {
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Format full timestamp for display
  const formatFullDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  /**
   * Handle "Convertir a OT" button click
   * TODO: Implement convertFailureReportToOT Server Action
   * AC3: Convertir aviso a OT en <1s, crear OT con estado "Pendiente", tipo "Correctivo"
   */
  const handleConvertToOT = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Call Server Action when implemented
      // await convertFailureReportToOT(report.id)

      toast({
        variant: 'default',
        title: 'Función no implementada aún',
        description: 'La conversión a OT se implementará en la siguiente fase',
      })

      // Temporary - close modal
      onClose()
    } catch (error) {
      console.error('Error converting to OT:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo convertir el reporte a OT',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle "Descartar" button click
   * Shows confirmation dialog
   * AC4: Confirmación modal antes de descartar
   */
  const handleDiscardClick = () => {
    setDiscardConfirmOpen(true)
  }

  /**
   * Confirm discard action
   * TODO: Implement discardFailureReport Server Action
   * AC4: Marcar como "Descartado", log auditoría, notificar reporter vía SSE
   */
  const handleConfirmDiscard = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Call Server Action when implemented
      // await discardFailureReport(report.id, userId)

      toast({
        variant: 'default',
        title: 'Función no implementada aún',
        description: 'El descarte se implementará en la siguiente fase',
      })

      // Temporary - close modals
      setDiscardConfirmOpen(false)
      onClose()
    } catch (error) {
      console.error('Error discarding report:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo descartar el reporte',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Cancel discard action
   */
  const handleCancelDiscard = () => {
    setDiscardConfirmOpen(false)
  }

  return (
    <>
      {/* Main Modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Detalles de Avería #{report.numero}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Foto (if exists) */}
            {report.fotoUrl && (
              <div data-testid="foto">
                <p className="text-sm font-medium text-gray-700 mb-2">Foto</p>
                <img
                  src={report.fotoUrl}
                  alt={`Foto de avería ${report.numero}`}
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Descripción completa */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Descripción</p>
              <p
                className="text-gray-900 whitespace-pre-wrap"
                data-testid="descripcion-completa"
              >
                {report.descripcion}
              </p>
            </div>

            {/* Equipo con jerarquía completa */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Equipo</p>
              <p
                className="text-gray-900"
                data-testid="equipo-jerarquia"
              >
                {report.equipo.linea.planta.division} → {report.equipo.linea.planta.name} → {report.equipo.linea.name} → {report.equipo.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Código: {report.equipo.code}
              </p>
            </div>

            {/* Reporter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Reportado por</p>
              <p
                className="text-gray-900"
                data-testid="reporter"
              >
                {report.reporter.name} ({report.reporter.email})
              </p>
            </div>

            {/* Timestamp completo */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Fecha y hora</p>
              <p
                className="text-gray-900"
                data-testid="timestamp"
              >
                {formatFullDate(report.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cerrar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDiscardClick}
              disabled={isSubmitting}
              data-testid="descartar-btn"
            >
              Descartar
            </Button>

            <Button
              onClick={handleConvertToOT}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
              data-testid="convertir-a-ot-btn"
            >
              Convertir a OT
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Modal */}
      <Dialog open={discardConfirmOpen} onOpenChange={setDiscardConfirmOpen}>
        <DialogContent data-testid="descartar-confirm-modal">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              ¿Descartar aviso #{report.numero}?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-gray-700">
              Esta acción no se puede deshacer. El reporte se marcará como "Descartado" y ya no aparecerá en la lista de triage.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancelDiscard}
              disabled={isSubmitting}
              data-testid="descartar-cancel-btn"
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirmDiscard}
              disabled={isSubmitting}
              data-testid="descartar-confirm-btn"
            >
              Confirmar Descarte
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
