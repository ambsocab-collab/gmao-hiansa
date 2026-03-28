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
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { VALID_TRANSITIONS, ACTION_BUTTONS } from '@/lib/constants/work-orders'
import { verifyWorkOrder } from '@/app/actions/my-work-orders'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface OTDetailsModalProps {
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

export function OTDetailsModal({ workOrder, open, onOpenChange }: OTDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  /**
   * Maneja el cambio de estado de la OT
   * Valida la transición antes de llamar al Server Action
   */
  async function handleStatusChange(newEstado: WorkOrderEstado) {
    setIsUpdating(true)

    // Validar transición de estado
    const allowedTransitions = VALID_TRANSITIONS[workOrder.estado] || []
    if (allowedTransitions.length > 0 && !allowedTransitions.includes(newEstado)) {
      toast.error(
        `Transición inválida: ${workOrder.estado} → ${newEstado}. ` +
        `Transiciones permitidas: ${allowedTransitions.join(', ')}`
      )
      setIsUpdating(false)
      return
    }

    try {
      await updateWorkOrderStatus(workOrder.id, newEstado)

      toast.success(`OT ${workOrder.numero} movida a ${newEstado.replace(/_/g, ' ')}`)

      // Cerrar modal después de actualizar
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating work order status:', error)

      toast.error(
        error instanceof Error ? error.message : 'Error desconocido al actualizar estado'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Verifica que la reparación funciona
   */
  async function handleVerifyFunciona() {
    setIsVerifying(true)

    try {
      const result = await verifyWorkOrder(workOrder.id, true)

      if (result.success) {
        toast.success(result.message || `OT ${workOrder.numero} verificada - Reparación confirmada`)
        setIsVerificationDialogOpen(false)
        onOpenChange(false)
        // Refresh page to show updated data
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al verificar OT')
      }
    } catch (error) {
      console.error('Error verifying work order:', error)
      toast.error('Error al verificar OT')
    } finally {
      setIsVerifying(false)
    }
  }

  /**
   * Crea OT de re-trabajo cuando la reparación no funciona
   */
  async function handleVerifyNoFunciona() {
    setIsVerifying(true)

    try {
      const result = await verifyWorkOrder(
        workOrder.id,
        false,
        'Reparación no funcionó - se requiere re-trabajo'
      )

      if (result.success) {
        toast.success(
          result.message || `OT de re-trabajo creada: ${result.workOrder.numero}`
        )
        setIsVerificationDialogOpen(false)
        onOpenChange(false)
        // Refresh page to show new rework OT
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al crear OT de re-trabajo')
      }
    } catch (error) {
      console.error('Error creating rework OT:', error)
      toast.error('Error al crear OT de re-trabajo')
    } finally {
      setIsVerifying(false)
    }
  }

  /**
   * Determina qué botones de acción mostrar según estado actual
   */
  const actionButtons = ACTION_BUTTONS[workOrder.estado] || []

  /**
   * AC6: Show verification button for completed OTs that haven't been verified yet
   */
  const showVerifyButton =
    workOrder.estado === 'COMPLETADA' && !workOrder.verificacion_at

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="ot-details-modal">
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
              <p className="font-medium">{workOrder.equipo.name}</p>
              <p className="text-xs text-muted-foreground">
                {workOrder.equipo.linea?.planta?.name} → {workOrder.equipo.linea?.name} → {workOrder.equipo.code}
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
          {workOrder.equipo?.linea?.planta?.division && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">División</p>
              <DivisionTag division={workOrder.equipo.linea.planta.division} />
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

          {/* AC6: Botón de verificación para OTs completadas */}
          {showVerifyButton && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium">Verificación</p>
              <Button
                onClick={() => setIsVerificationDialogOpen(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
                data-testid="verificar-reparacion-btn"
              >
                Verificar Reparación
              </Button>
            </div>
          )}

          {/* AC6: Badge de OT verificada */}
          {workOrder.verificacion_at && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium">Estado de verificación</p>
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                data-testid="ot-verified-badge"
              >
                ✓ Verificada el {new Date(workOrder.verificacion_at).toLocaleDateString('es-ES')}
              </div>
            </div>
          )}
        </div>

        {/* AC6: Diálogo de verificación */}
        <AlertDialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Verificar Reparación - OT {workOrder.numero}</AlertDialogTitle>
              <AlertDialogDescription>
                ¿La reparación funcionó correctamente? Si no funciona, se creará automáticamente una
                OT de re-trabajo con prioridad ALTA.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isVerifying}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleVerifyNoFunciona}
                disabled={isVerifying}
                className="bg-red-600 hover:bg-red-700"
                data-testid="verificacion-no-funciona-option"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'No Funciona'
                )}
              </AlertDialogAction>
              <AlertDialogAction
                onClick={handleVerifyFunciona}
                disabled={isVerifying}
                className="bg-green-600 hover:bg-green-700"
                data-testid="verificacion-funciona-option"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Funciona'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
