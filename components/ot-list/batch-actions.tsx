'use client'

/**
 * BatchActions Component
 * Story 3.4 AC4: Acciones en Lote
 */

import { useState } from 'react'
import { WorkOrderEstado } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, UserPlus, RefreshCw, MessageSquare, X } from 'lucide-react'
import { logClientError } from '@/lib/observability/client-logger'
import { cn } from '@/lib/utils'
import { batchAssignTechnicians, batchUpdateStatus, batchAddComment } from '@/app/actions/work-orders'

const ESTADOS_OPTIONS = [
  { value: WorkOrderEstado.PENDIENTE, label: 'Pendiente' },
  { value: WorkOrderEstado.ASIGNADA, label: 'Asignada' },
  { value: WorkOrderEstado.EN_PROGRESO, label: 'En Progreso' },
  { value: WorkOrderEstado.PENDIENTE_PARADA, label: 'Pendiente Parada' },
  { value: WorkOrderEstado.PENDIENTE_REPUESTO, label: 'Pendiente Repuesto' },
  { value: WorkOrderEstado.REPARACION_EXTERNA, label: 'Reparacion Externa' },
  { value: WorkOrderEstado.COMPLETADA, label: 'Completada' },
  { value: WorkOrderEstado.DESCARTADA, label: 'Descartada' },
]

interface FilterOption {
  id: string
  name: string
}

// BatchCheckbox
interface BatchCheckboxProps {
  id: string
  isSelected: boolean
  onToggle: (id: string) => void
  disabled?: boolean
}

export function BatchCheckbox({ id, isSelected, onToggle, disabled }: BatchCheckboxProps) {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={() => onToggle(id)}
      disabled={disabled}
      data-testid={`ot-checkbox-${id}`}
      className="cursor-pointer"
    />
  )
}

// SelectAllCheckbox
interface SelectAllCheckboxProps {
  allIds: string[]
  selectedIds: Set<string>
  onSelectAll: () => void
  onClearAll: () => void
}

export function SelectAllCheckbox({ allIds, selectedIds, onSelectAll, onClearAll }: SelectAllCheckboxProps) {
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id))
  const someSelected = selectedIds.size > 0 && !allSelected

  const handleCheckedChange = () => {
    if (allSelected || someSelected) {
      onClearAll()
    } else {
      onSelectAll()
    }
  }

  return (
    <Checkbox
      checked={allSelected}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "cursor-pointer",
        someSelected && !allSelected && "bg-primary/10"
      )}
      data-testid="select-all-checkbox"
    />
  )
}

// BatchActionsBar
interface BatchActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBatchAssign: () => void
  onBatchStatus: () => void
  onBatchComment: () => void
}

export function BatchActionsBar({
  selectedCount,
  onClearSelection,
  onBatchAssign,
  onBatchStatus,
  onBatchComment
}: BatchActionsBarProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 py-2 bg-white border-t border-gray-200 shadow-md z-50" data-testid="batch-actions-bar">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium" data-testid="selected-count">
          {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBatchAssign}
            disabled={selectedCount === 0}
            data-testid="btn-batch-asignar"
          >
            <UserPlus className="h-4 w-4" />
            Asignar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBatchStatus}
            disabled={selectedCount === 0}
            data-testid="btn-batch-estado"
          >
            <RefreshCw className="h-4 w-4" />
            Estado
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBatchComment}
            disabled={selectedCount === 0}
            data-testid="btn-batch-comentario"
          >
            <MessageSquare className="h-4 w-4" />
            Comentario
          </Button>
        </div>

        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-sm text-muted-foreground"
            data-testid="btn-limpiar-seleccion"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  )
}

// BatchAssignDialog
interface BatchAssignDialogProps {
  open: boolean
  selectedIds: Set<string>
  tecnicoOptions?: FilterOption[]
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function BatchAssignDialog({
  open,
  selectedIds,
  tecnicoOptions = [],
  onSuccess,
  onOpenChange
}: BatchAssignDialogProps) {
  const [selectedTecnicos, setSelectedTecnicos] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const toggleTecnico = (id: string) => {
    setSelectedTecnicos(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selectedTecnicos.length === 0) {
      return
    }

    setIsSaving(true)
    try {
      const result = await batchAssignTechnicians(
        Array.from(selectedIds),
        selectedTecnicos
      )

      if (result.success) {
        toast.success(`Técnicos asignados a ${result.count} OTs`)
        onOpenChange(false)
        onSuccess()
      } else {
        throw new Error('Error al asignar técnicos')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al asignar técnicos')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="modal-asignacion-batch">
        <DialogHeader>
          <DialogTitle>Asignar Técnicos en Lote</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Se asignarán técnicos a {selectedIds.size} OTs seleccionadas.
          </p>

          <div className="space-y-2">
            <Label>Técnicos (máx. 3)</Label>
            <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto" data-testid="tecnicos-select">
              {tecnicoOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No hay técnicos disponibles</p>
              ) : (
                tecnicoOptions.map((tecnico) => (
                  <div
                    key={tecnico.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent",
                      selectedTecnicos.includes(tecnico.id) && "bg-accent"
                    )}
                    onClick={() => toggleTecnico(tecnico.id)}
                    data-testid={`tecnico-option-${tecnico.id}`}
                  >
                    <Checkbox
                      checked={selectedTecnicos.includes(tecnico.id)}
                      onCheckedChange={() => toggleTecnico(tecnico.id)}
                    />
                    <span className="text-sm">{tecnico.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedTecnicos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedTecnicos.map(id => {
                const tecnico = tecnicoOptions.find(t => t.id === id)
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1">
                    {tecnico?.name}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() => toggleTecnico(id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={selectedTecnicos.length === 0 || isSaving} data-testid="guardar-asignacion-btn">
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
      </DialogContent>
    </Dialog>
  )
}

// BatchStatusDialog
interface BatchStatusDialogProps {
  open: boolean
  selectedIds: Set<string>
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function BatchStatusDialog({
  open,
  selectedIds,
  onSuccess,
  onOpenChange
}: BatchStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderEstado | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!selectedStatus) return

    setIsSaving(true)
    try {
      const result = await batchUpdateStatus(
        Array.from(selectedIds),
        selectedStatus
      )

      if (result.success) {
        toast.success(`${result.count} OTs actualizadas a ${selectedStatus}`)
        onOpenChange(false)
        onSuccess()
      } else {
        throw new Error('Error al cambiar estado')
      }
    } catch (error) {
      // M-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error updating batch status: ${errorMessage}` })
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-cambiar-estado">
        <DialogHeader>
          <DialogTitle>Cambiar Estado en Lote</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Se cambiará el estado de {selectedIds.size} OTs seleccionadas.
          </p>

          <div className="space-y-2">
            <Label>Nuevo Estado</Label>
            <Select
              value={selectedStatus || undefined}
              onValueChange={(value) => setSelectedStatus(value as WorkOrderEstado)}
            >
              <SelectTrigger data-testid="select-nuevo-estado">
                <SelectValue placeholder="Seleccionar estado..." />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_OPTIONS.map((estado) => (
                  <SelectItem
                    key={estado.value}
                    value={estado.value}
                    data-testid={`estado-option-${estado.value}`}
                  >
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!selectedStatus || isSaving} data-testid="btn-confirmar-cambio">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Confirmar Cambio'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// BatchCommentDialog
interface BatchCommentDialogProps {
  open: boolean
  selectedIds: Set<string>
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function BatchCommentDialog({
  open,
  selectedIds,
  onSuccess,
  onOpenChange
}: BatchCommentDialogProps) {
  const [comment, setComment] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!comment.trim()) {
      toast.error('El comentario debe tener entre 1 y 1000 caracteres')
      return
    }

    setIsSaving(true)
    try {
      const result = await batchAddComment(
        Array.from(selectedIds),
        comment
      )

      if (result.success) {
        toast.success(`Comentario agregado a ${result.count} OTs`)
        onOpenChange(false)
        onSuccess()
      } else {
        throw new Error('Error al agregar comentario')
      }
    } catch (error) {
      // M-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error adding batch comment: ${errorMessage}` })
      toast.error(error instanceof Error ? error.message : 'Error al agregar comentario')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-agregar-comentario">
        <DialogHeader>
          <DialogTitle>Agregar Comentario en Lote</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Se agregará el comentario en {selectedIds.size} OTs seleccionadas.
          </p>

          <div className="space-y-2">
            <Label>Comentario</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              placeholder="Escribe un comentario..."
              data-testid="input-comentario"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!comment.trim() || isSaving} data-testid="btn-guardar-comentario">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Comentario'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
