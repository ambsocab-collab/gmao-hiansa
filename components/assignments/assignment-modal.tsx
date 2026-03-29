'use client'

/**
 * AssignmentModal Component
 * Story 3.3 AC8: Modal de asignación desde Kanban y Listado
 *
 * Modal que permite asignar técnicos y proveedores a una OT:
 * - Multi-select de técnicos (máx 3)
 * - Select de proveedor externo
 * - Validación máximo 3 asignados total
 * - Filtros por habilidades y ubicación
 * - data-testid para E2E testing
 */

import { useState, useEffect } from 'react'
import { WorkOrder } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TechnicianSelect } from './technician-select'
import { ProviderSelect } from './provider-select'
import { assignToWorkOrder } from '@/app/actions/assignments'
import { toast } from 'sonner'
import { Loader2, Users, Wrench } from 'lucide-react'

interface AssignmentModalProps {
  workOrder: WorkOrder & {
    equipo?: {
      id: string
      name: string
      code: string
      linea?: {
        id: string
        name: string
        code: string
        planta?: {
          id: string
          name: string
          code: string
          division: string
        }
      }
    }
    assignments?: Array<{
      id: string
      role: string
      userId: string | null
      providerId: string | null
      user?: {
        id: string
        name: string
        email: string
      } | null
      provider?: {
        id: string
        name: string
      } | null
    }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignmentComplete?: () => void
}

export function AssignmentModal({
  workOrder,
  open,
  onOpenChange,
  onAssignmentComplete,
}: AssignmentModalProps) {
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [workloadWarning, setWorkloadWarning] = useState(false)

  // Initialize with current assignments
  useEffect(() => {
    if (open && workOrder.assignments) {
      const currentTechnicians = workOrder.assignments
        .filter(a => a.userId && a.user)
        .map(a => a.userId as string)
      setSelectedTechnicians(currentTechnicians)

      const currentProvider = workOrder.assignments.find(a => a.providerId)
      setSelectedProvider(currentProvider?.providerId || null)
    }
  }, [open, workOrder.assignments])

  // Calculate total assignments
  const totalAssignments = selectedTechnicians.length + (selectedProvider ? 1 : 0)
  const isValid = totalAssignments > 0 && totalAssignments <= 3
  const providerDisabled = selectedTechnicians.length >= 3

  // Reset state when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedTechnicians([])
      setSelectedProvider(null)
      setWorkloadWarning(false)
    }
    onOpenChange(newOpen)
  }

  const handleSave = async () => {
    if (!isValid) return

    setIsSaving(true)
    try {
      const result = await assignToWorkOrder(
        workOrder.id,
        selectedTechnicians,
        selectedProvider
      )

      toast.success(`Asignación guardada para OT ${workOrder.numero}`)

      // Close modal
      handleOpenChange(false)

      // Callback
      if (onAssignmentComplete) {
        onAssignmentComplete()
      }
    } catch (error) {
      console.error('Error saving assignment:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar asignación')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg"
        data-testid={`modal-asignacion-${workOrder.id}`}
      >
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            Asignar Técnicos - OT {workOrder.numero}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Work order info */}
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {workOrder.equipo?.name || 'Equipo no especificado'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {workOrder.descripcion}
            </p>
            {workOrder.equipo?.linea?.planta && (
              <p className="text-xs text-muted-foreground">
                {workOrder.equipo.linea.planta.name} → {workOrder.equipo.linea.name}
              </p>
            )}
          </div>

          {/* Assignment count indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Asignaciones</span>
            </div>
            <Badge variant={totalAssignments > 3 ? 'destructive' : 'secondary'}>
              {totalAssignments} / 3
            </Badge>
          </div>

          {/* Workload warning */}
          {workloadWarning && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Uno o más técnicos seleccionados tienen una carga alta de trabajo (5+ OTs activas)
              </p>
            </div>
          )}

          {/* Technician select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Técnicos internos
            </label>
            <TechnicianSelect
              value={selectedTechnicians}
              onChange={setSelectedTechnicians}
              maxTechnicians={selectedProvider ? 2 : 3}
              disabled={isSaving}
              onWorkloadWarning={setWorkloadWarning}
            />
          </div>

          {/* Provider select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Proveedor externo
            </label>
            <ProviderSelect
              value={selectedProvider}
              onChange={setSelectedProvider}
              disabled={isSaving || providerDisabled}
            />
            {providerDisabled && (
              <p className="text-xs text-muted-foreground">
                Máximo 3 asignados alcanzado. Libera un técnico para asignar un proveedor.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
            data-testid="cancelar-asignacion-btn"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            data-testid="guardar-asignacion-btn"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Asignación'
            )}
          </Button>
        </DialogFooter>

        {/* Close button for E2E tests */}
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          data-testid="modal-close-btn"
          aria-label="Cerrar"
        >
          <span className="sr-only">Cerrar</span>
        </button>
      </DialogContent>
    </Dialog>
  )
}
