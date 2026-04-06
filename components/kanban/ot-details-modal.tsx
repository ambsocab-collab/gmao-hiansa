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
import { useRouter } from 'next/navigation'
import { WorkOrder, WorkOrderEstado } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import { updateWorkOrderStatus } from '@/app/actions/work-orders'
import { logClientError } from '@/lib/observability/client-logger'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { VALID_TRANSITIONS, ACTION_BUTTONS } from '@/lib/constants/work-orders'
import { verifyWorkOrder } from '@/app/actions/my-work-orders'
import { confirmProviderWork } from '@/app/actions/assignments'
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
    spareParts?: Array<{
      id: string
      cantidad: number
      repuesto?: {
        id: string
        name: string
      }
    }>
    comments?: Array<{
      id: string
      texto: string
      created_at: Date | string
      user?: {
        id: string
        name: string
      } | null
    }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OTDetailsModal({ workOrder, open, onOpenChange }: OTDetailsModalProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isConfirmingProvider, setIsConfirmingProvider] = useState(false)

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
      // M-NEW-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error updating work order status: ${errorMessage}` })

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

      toast.success(result.message || `OT ${workOrder.numero} verificada - Reparación confirmada`)
      setIsVerificationDialogOpen(false)
      onOpenChange(false)
      // M-NEW-001: Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      // M-NEW-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error verifying work order: ${errorMessage}` })
      toast.error(error instanceof Error ? error.message : 'Error al verificar OT')
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

      toast.success(
        result.message || `OT de re-trabajo creada: ${result.workOrder.numero}`
      )
      setIsVerificationDialogOpen(false)
      onOpenChange(false)
      // M-NEW-001: Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      // M-NEW-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error creating rework OT: ${errorMessage}` })
      toast.error(error instanceof Error ? error.message : 'Error al crear OT de re-trabajo')
    } finally {
      setIsVerifying(false)
    }
  }

  /**
   * Story 3.3 AC5: Confirm provider work received
   */
  async function handleConfirmProviderWork() {
    setIsConfirmingProvider(true)

    try {
      await confirmProviderWork(workOrder.id)

      toast.success(`Recepción confirmada para OT ${workOrder.numero}`)
      onOpenChange(false)
      // M-NEW-001: Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      // M-NEW-002: Structured logging instead of console.error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logClientError({ message: `Error confirming provider work: ${errorMessage}` })
      toast.error(error instanceof Error ? error.message : 'Error al confirmar recepción')
    } finally {
      setIsConfirmingProvider(false)
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

  /**
   * Story 3.3 AC5: Show confirm provider button for REPARACION_EXTERNA with provider
   */
  const hasProviderAssigned = workOrder.assignments?.some(a => a.providerId && a.provider)
  const showConfirmProviderButton =
    workOrder.estado === 'REPARACION_EXTERNA' && hasProviderAssigned

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
                {workOrder.equipo.linea?.planta?.division} → {workOrder.equipo.linea?.name} → {workOrder.equipo.code}
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

          {/* Story 3.3 AC4: Técnicos/Proveedores asignados con testids */}
          {workOrder.assignments && workOrder.assignments.length > 0 && (
            <div className="space-y-1" data-testid="modal-ot-asignados">
              <p className="text-sm text-muted-foreground">Asignados</p>
              <div className="flex flex-wrap gap-2">
                {workOrder.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-1"
                    data-testid={`asignado-item-${assignment.id}`}
                  >
                    <Badge variant="outline" data-testid="asignado-nombre">
                      {assignment.user?.name || assignment.provider?.name || 'Sin asignar'}
                    </Badge>
                    <span
                      className="text-xs text-muted-foreground"
                      data-testid="asignado-rol"
                    >
                      {assignment.providerId ? 'Proveedor' : 'Técnico'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 text-sm" data-testid="modal-ot-fechas">
            <div>
              <p className="text-muted-foreground">Creación</p>
              <p className="font-medium">{new Date(workOrder.created_at).toLocaleDateString('es-ES')}</p>
            </div>
            {workOrder.completed_at && (
              <div>
                <p className="text-muted-foreground">Completada</p>
                <p className="font-medium">{new Date(workOrder.completed_at).toLocaleDateString('es-ES')}</p>
              </div>
            )}
            {workOrder.updated_at && (
              <div>
                <p className="text-muted-foreground">Última Actualización</p>
                <p className="font-medium">{new Date(workOrder.updated_at).toLocaleDateString('es-ES')}</p>
              </div>
            )}
          </div>

          {/* Origen */}
          <div className="space-y-1" data-testid="modal-ot-origen">
            <p className="text-sm text-muted-foreground">Origen</p>
            <p className="font-medium">
              {workOrder.failure_report_id
                ? 'Avería'
                : 'Manual'}
            </p>
            {workOrder.failure_report_id && (
              <a
                href={`/averias/${workOrder.failure_report_id}`}
                className="text-sm text-blue-600 hover:underline"
                data-testid="link-averia-original"
              >
                Ver avería original →
              </a>
            )}
          </div>

          {/* Repuestos usados */}
          <div className="space-y-1" data-testid="modal-ot-repuestos">
            <p className="text-sm text-muted-foreground">Repuestos</p>
            {workOrder.spareParts && workOrder.spareParts.length > 0 ? (
              <div className="space-y-2">
                {workOrder.spareParts.map((sparePart) => (
                  <div key={sparePart.id} className="flex justify-between items-center text-sm">
                    <span>{sparePart.repuesto?.name || 'Repuesto'}</span>
                    <span className="text-muted-foreground">x{sparePart.cantidad}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin repuestos registrados</p>
            )}
          </div>

          {/* Comentarios */}
          <div className="space-y-1" data-testid="modal-ot-comentarios">
            <p className="text-sm text-muted-foreground">Comentarios</p>
            {workOrder.comments && workOrder.comments.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {workOrder.comments.map((comment) => (
                  <div key={comment.id} className="text-sm border-l-2 border-muted pl-2">
                    <p className="text-xs text-muted-foreground">
                      {comment.user?.name || 'Sistema'} - {new Date(comment.created_at).toLocaleDateString('es-ES')}
                    </p>
                    <p>{comment.texto}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Sin comentarios registrados</p>
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

          {/* Story 3.3 AC5: Botón de confirmación de proveedor para OTs en REPARACION_EXTERNA */}
          {showConfirmProviderButton && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium">Confirmación de Proveedor</p>
              <Button
                onClick={handleConfirmProviderWork}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={isConfirmingProvider}
                data-testid="confirmar-recepcion-btn"
              >
                {isConfirmingProvider ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  'Confirmar Recepción'
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Confirma que el proveedor ha completado la reparación externa
              </p>
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
