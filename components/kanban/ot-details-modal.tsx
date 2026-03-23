'use client'

/**
 * OT Details Modal
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * AC6: Modal de acciones en móvil (no drag & drop)
 *
 * Modal que muestra detalles completos de una OT con botones de acción
 * Se abre al tocar una OT card en vista móvil (<768px)
 */

import { useState } from 'react'
import { WorkOrder, WorkOrderEstado } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import { updateWorkOrderStatus } from '@/app/actions/work-orders'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface OTDetailsModalProps {
  workOrder: WorkOrder & {
    equipo?: {
      numero: string
      nombre: string
      linea?: {
        nombre: string
        planta?: {
          nombre: string
          division: string
        }
      }
    }
    assignments?: Array<{
      id: string
      role: string
      user: {
        id: string
        name: string
        email: string
      }
    }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Mapeo de transiciones de estado válidas
 * Define qué estados son alcanzables desde el estado actual
 * TODO: Implementar validación de transiciones antes de llamar Server Action
 */
const _VALID_TRANSITIONS: Record<WorkOrderEstado, WorkOrderEstado[]> = {
  PENDIENTE: ['ASIGNADA', 'EN_PROGRESO', 'DESCARTADA'],
  ASIGNADA: ['EN_PROGRESO', 'PENDIENTE_REPUESTO', 'DESCARTADA'],
  EN_PROGRESO: ['COMPLETADA', 'PENDIENTE_PARADA', 'PENDIENTE_REPUESTO', 'DESCARTADA'],
  PENDIENTE_PARADA: ['EN_PROGRESO', 'COMPLETADA', 'DESCARTADA'],
  PENDIENTE_REPUESTO: ['EN_PROGRESO', 'DESCARTADA'],
  REPARACION_EXTERNA: ['COMPLETADA', 'DESCARTADA'],
  COMPLETADA: [], // Estado terminal
  DESCARTADA: [], // Estado terminal
}

/**
 * Mapeo de estados a etiquetas de botón
 */
const ACTION_BUTTONS: Record<WorkOrderEstado, Array<{ label: string; estado: WorkOrderEstado; variant: 'default' | 'destructive' }>> = {
  PENDIENTE: [
    { label: 'Asignar', estado: 'ASIGNADA', variant: 'default' },
    { label: 'Iniciar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  ASIGNADA: [
    { label: 'Iniciar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  EN_PROGRESO: [
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
    { label: 'Pausar', estado: 'PENDIENTE_PARADA', variant: 'default' },
  ],
  PENDIENTE_PARADA: [
    { label: 'Reanudar', estado: 'EN_PROGRESO', variant: 'default' },
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
  ],
  PENDIENTE_REPUESTO: [
    { label: 'Reanudar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  REPARACION_EXTERNA: [
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
  ],
  COMPLETADA: [],
  DESCARTADA: [
    { label: 'Reactivar', estado: 'PENDIENTE', variant: 'default' },
  ],
}

export function OTDetailsModal({ workOrder, open, onOpenChange }: OTDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  /**
   * Maneja el cambio de estado de la OT
   */
  async function handleStatusChange(newEstado: WorkOrderEstado) {
    setIsUpdating(true)

    try {
      await updateWorkOrderStatus(workOrder.id, newEstado)

      toast({
        title: 'Estado actualizado',
        description: `OT ${workOrder.numero} movida a ${newEstado.replace(/_/g, ' ')}`,
      })

      // Cerrar modal después de actualizar
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating work order status:', error)

      toast({
        variant: 'destructive',
        title: 'Error al actualizar estado',
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Determina qué botones de acción mostrar según estado actual
   */
  const actionButtons = ACTION_BUTTONS[workOrder.estado] || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>OT {workOrder.numero}</span>
            <StatusBadge estado={workOrder.estado} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Título / Descripción */}
          <div>
            <h3 className="font-semibold text-lg">{workOrder.descripcion}</h3>
          </div>

          {/* Equipo */}
          {workOrder.equipo && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Equipo</p>
              <p className="font-medium">{workOrder.equipo.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {workOrder.equipo.linea?.planta?.nombre} → {workOrder.equipo.linea?.nombre} → {workOrder.equipo.numero}
              </p>
            </div>
          )}

          {/* Tipo de OT */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tipo</p>
            <Badge
              variant={workOrder.tipo === 'PREVENTIVO' ? 'default' : 'destructive'}
              className={workOrder.tipo === 'PREVENTIVO' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {workOrder.tipo === 'PREVENTIVO' ? 'Preventivo' : 'Correctivo'}
            </Badge>
          </div>

          {/* Prioridad */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Prioridad</p>
            <Badge
              variant={
                workOrder.prioridad === 'ALTA' ? 'destructive' :
                workOrder.prioridad === 'MEDIA' ? 'default' : 'secondary'
              }
            >
              {workOrder.prioridad}
            </Badge>
          </div>

          {/* División */}
          {workOrder.equipo?.linea?.planta?.nombre && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">División</p>
              <DivisionTag division={workOrder.equipo.linea.planta.nombre as 'HiRock' | 'Ultra'} />
            </div>
          )}

          {/* Técnicos asignados */}
          {workOrder.assignments && workOrder.assignments.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Técnicos asignados</p>
              <div className="flex flex-wrap gap-2">
                {workOrder.assignments.map((assignment) => (
                  <Badge key={assignment.id} variant="outline">
                    {assignment.user.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Creada</p>
              <p className="font-medium">{new Date(workOrder.created_at).toLocaleDateString('es-ES')}</p>
            </div>
            {workOrder.completed_at && (
              <div>
                <p className="text-muted-foreground">Completada</p>
                <p className="font-medium">{new Date(workOrder.completed_at).toLocaleDateString('es-ES')}</p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          {actionButtons.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium">Acciones</p>
              <div className="flex flex-col gap-2">
                {actionButtons.map((button) => (
                  <Button
                    key={button.estado}
                    variant={button.variant}
                    className="w-full"
                    onClick={() => handleStatusChange(button.estado)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      button.label
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
