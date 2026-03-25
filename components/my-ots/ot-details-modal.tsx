'use client'

/**
 * OTDetailsModal - Modal extendido para Mis OTs
 *
 * Story 3.2: Gestión de OTs Asignadas
 * AC2: Modal de detalles con acciones disponibles
 * AC3: Iniciar OT con confirmación en Dialog
 *
 * Basado en Story 3.1's OTDetailsModal pero extendido con:
 * - Botones de acción contextuales por estado
 * - Dialog de confirmación para Iniciar/Completar
 * - Sección de repuestos usados
 * - Sección de comentarios
 * - Sección de fotos antes/después
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import { useSSEConnection } from '@/components/sse/use-sse-connection'
import {
  startWorkOrder,
  completeWorkOrder,
  addComment,
  uploadPhoto,
  addUsedRepuesto
} from '@/app/actions/my-work-orders'
import type { WorkOrder } from '@prisma/client'

interface WorkOrderWithRelations extends WorkOrder {
  equipo: {
    id: string
    name: string
    linea?: {
      name: string
      planta?: {
        division: string
      }
    }
  }
  assignments: Array<{
    user: {
      id: string
      name: string
    }
  }>
  photos: Array<{
    id: string
    tipo: 'ANTES' | 'DESPUES'
    url: string
    created_at: Date
  }>
  comments: Array<{
    id: string
    texto: string
    created_at: Date
    user: {
      name: string
    }
  }>
  usedRepuestos: Array<{
    id: string
    cantidad: number
    repuesto: {
      name: string
    }
  }>
}

interface Repuesto {
  id: string
  name: string
  stock: number
  ubicacion_fisica: string | null
}

interface OTDetailsModalProps {
  ot: WorkOrderWithRelations
  isOpen: boolean
  onClose: () => void
  allRepuestos?: Repuesto[]
}

/**
 * OTDetailsModal Component
 *
 * - Muestra detalles completos de OT
 * - Botones contextuales por estado (AC3, AC5)
 * - Secciones: Repuestos, Comentarios, Fotos
 * - SSE subscription para updates en tiempo real
 */
export function OTDetailsModal({ ot, isOpen, onClose, allRepuestos = [] }: OTDetailsModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [selectedRepuestoId, setSelectedRepuestoId] = useState('')
  const [repuestoCantidad, setRepuestoCantidad] = useState(1)
  const [localUsedRepuestos, setLocalUsedRepuestos] = useState(ot.usedRepuestos)
  const [localComments, setLocalComments] = useState(ot.comments)
  const [localPhotos, setLocalPhotos] = useState(ot.photos)

  // Update local state when ot data changes (e.g., modal reopened)
  useEffect(() => {
    setLocalUsedRepuestos(ot.usedRepuestos)
    setLocalComments(ot.comments)
    setLocalPhotos(ot.photos)
  }, [ot.id, ot.usedRepuestos, ot.comments, ot.photos])

  // Estados para dialogs de confirmación
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  /**
   * SSE Connection para updates en tiempo real
   *
   * NOTA: No usamos router.refresh() aquí para evitar loop infinito.
   * Las actualizaciones se manejan cuando el usuario cierra el modal o después de acciones.
   */
  useSSEConnection({
    channel: 'work-orders',
    onMessage: (message) => {
      // Handle repuesto added event
      if (message.type === 'work-order-repuesto-added') {
        const data = message.data as {
          workOrderId?: string
          usedRepuestoId: string
          repuestoNombre: string
          cantidad: number
        }
        if (data.workOrderId === ot.id) {
          setLocalUsedRepuestos((prev) => [
            ...prev,
            {
              id: data.usedRepuestoId,
              cantidad: data.cantidad,
              repuesto: { name: data.repuestoNombre }
            }
          ])
        }
      }

      // Handle comment added event
      if (message.type === 'work-order-comment-added') {
        const data = message.data as {
          workOrderId?: string
          commentId: string
          texto: string
          createdAt: string
          userName: string
        }
        if (data.workOrderId === ot.id) {
          setLocalComments((prev) => [
            ...prev,
            {
              id: data.commentId,
              texto: data.texto,
              created_at: new Date(data.createdAt),
              user: { name: data.userName }
            }
          ])
        }
      }

      // Handle photo added event
      if (message.type === 'work-order-photo-added') {
        const data = message.data as {
          workOrderId?: string
          photoId: string
          tipo: 'ANTES' | 'DESPUES'
          url: string
          createdAt: string
        }
        if (data.workOrderId === ot.id) {
          setLocalPhotos((prev) => [
            ...prev,
            {
              id: data.photoId,
              tipo: data.tipo,
              url: data.url,
              created_at: new Date(data.createdAt)
            }
          ])
        }
      }
    }
  })

  /**
   * AC3: Iniciar OT (ASIGNADA → EN_PROGRESO)
   * Abre dialog de confirmación
   */
  const handleStartOTClick = () => {
    setIsStartDialogOpen(true)
  }

  /**
   * Confirma iniciar OT después de la confirmación en dialog
   */
  const handleConfirmStart = async () => {
    setIsSubmitting(true)
    setIsStartDialogOpen(false)
    try {
      await startWorkOrder(ot.id)
      toast.success(`OT ${ot.numero} iniciada`)
      router.refresh()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar OT')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * AC5: Completar OT (EN_PROGRESO → COMPLETADA)
   * Abre dialog de confirmación
   */
  const handleCompleteOTClick = () => {
    setIsCompleteDialogOpen(true)
  }

  /**
   * Confirma completar OT después de la confirmación en dialog
   */
  const handleConfirmComplete = async () => {
    setIsSubmitting(true)
    setIsCompleteDialogOpen(false)
    try {
      await completeWorkOrder(ot.id)
      toast.success(`OT ${ot.numero} completada`)
      router.refresh()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al completar OT')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * AC7: Agregar comentario
   */
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await addComment(ot.id, commentText)
      toast.success('Comentario agregado')
      setCommentText('')
      // Don't refresh - SSE will handle updates
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar comentario')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * AC4: Agregar repuesto usado
   */
  const handleAddRepuesto = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRepuestoId || repuestoCantidad < 1) {
      return
    }

    setIsSubmitting(true)
    try {
      await addUsedRepuesto(ot.id, selectedRepuestoId, repuestoCantidad)
      toast.success('Repuesto agregado')
      setSelectedRepuestoId('')
      setRepuestoCantidad(1)
      // Don't refresh - SSE will handle updates
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar repuesto')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * AC8: Upload photo
   */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'antes' | 'despues') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      toast.error('Solo se permiten archivos JPEG o PNG')
      return
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('El archivo debe pesar menos de 5MB')
      return
    }

    setIsSubmitting(true)
    try {
      // For now, create a fake URL (in real implementation, upload to Vercel Blob)
      const fakeUrl = URL.createObjectURL(file)

      await uploadPhoto(ot.id, tipo, fakeUrl)
      toast.success(`Foto "${tipo}" agregada`)
      // Don't refresh - SSE will handle updates
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir foto')
    } finally {
      setIsSubmitting(false)
      // Clear input
      e.target.value = ''
    }
  }

  /**
   * Determinar botones disponibles según estado
   * Usa VALID_TRANSITIONS de lib/constants/work-orders.ts
   */
  const showStartButton = ot.estado === 'ASIGNADA'
  const showCompleteButton = ot.estado === 'EN_PROGRESO'

  // Separar fotos por tipo
  const fotosAntes = localPhotos.filter(p => p.tipo === 'ANTES')
  const fotosDespues = localPhotos.filter(p => p.tipo === 'DESPUES')

  // Extraer división
  const division = ot.equipo?.linea?.planta?.division

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid={`ot-detalles-${ot.id}`}
      >
        <DialogHeader>
          {/* Header: Número OT + Estado + División */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {ot.numero}
            </h2>
            <StatusBadge estado={ot.estado} />
            {division && <DivisionTag division={division} />}
          </div>
        </DialogHeader>

        {/* Contenido del modal */}
        <div className="space-y-6 mt-4">
          {/* Información básica */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Detalles
            </h3>
            <div className="space-y-2 text-sm">
              <div data-testid="ot-descripcion">
                <span className="text-gray-600 dark:text-gray-400">Descripción: </span>
                <span className="text-gray-900 dark:text-gray-100">{ot.descripcion}</span>
              </div>
              <div data-testid="ot-equipo">
                <span className="text-gray-600 dark:text-gray-400">Equipo: </span>
                <span className="text-gray-900 dark:text-gray-100">{ot.equipo.name}</span>
              </div>
              <div data-testid="ot-asignados">
                <span className="text-gray-600 dark:text-gray-400">Técnicos asignados: </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {ot.assignments.map(a => a.user.name).join(', ')}
                </span>
              </div>
            </div>
          </section>

          {/* Repuestos usados (AC4) */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Repuestos Usados
            </h3>

            {/* Formulario para agregar repuestos (solo EN_PROGRESO) */}
            {showCompleteButton && allRepuestos.length > 0 && (
              <form onSubmit={handleAddRepuesto} className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="space-y-2">
                  {/* Dropdown de repuestos */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                      Seleccionar Repuesto
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-900 dark:text-gray-100"
                      value={selectedRepuestoId}
                      onChange={(e) => setSelectedRepuestoId(e.target.value)}
                      data-testid="repuesto-select"
                      disabled={isSubmitting}
                    >
                      <option value="">-- Seleccionar repuesto --</option>
                      {allRepuestos.map((repuesto) => (
                        <option key={repuesto.id} value={repuesto.id}>
                          {repuesto.name} (Stock: {repuesto.stock}) - {repuesto.ubicacion_fisica || 'Sin ubicación'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input de cantidad */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-900 dark:text-gray-100"
                      value={repuestoCantidad}
                      onChange={(e) => setRepuestoCantidad(parseInt(e.target.value) || 1)}
                      data-testid="repuesto-cantidad-input"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Botón agregar */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedRepuestoId}
                    size="sm"
                    className="w-full"
                  >
                    Agregar Repuesto
                  </Button>
                </div>
              </form>
            )}

            {/* Lista de repuestos usados */}
            <div
              className="space-y-1"
              data-testid="repuestos-usados-list"
            >
              {localUsedRepuestos.length > 0 ? (
                localUsedRepuestos.map((ur) => (
                  <div
                    key={ur.id}
                    className="text-sm flex justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded"
                    data-testid={`used-repuesto-${ur.id}`}
                  >
                    <span className="text-gray-900 dark:text-gray-100">
                      {ur.repuesto.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      x{ur.cantidad}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No se han usado repuestos aún
                </p>
              )}
            </div>
          </section>

          {/* Comentarios (AC7) */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Comentarios
            </h3>

            {/* Lista de comentarios - always rendered */}
            <div
              className="space-y-2 mb-3 max-h-40 overflow-y-auto"
              data-testid="comentarios-list"
            >
              {localComments.length > 0 ? (
                localComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded"
                    data-testid={`comentario-${comment.id}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="font-medium text-gray-900 dark:text-gray-100"
                        data-testid="comentario-autor"
                      >
                        {comment.user.name}
                      </span>
                      <time
                        className="text-xs text-gray-500 dark:text-gray-400"
                        data-testid="comentario-timestamp"
                      >
                        {new Date(comment.created_at).toLocaleString('es-ES')}
                      </time>
                    </div>
                    <p
                      className="text-gray-700 dark:text-gray-300"
                      data-testid="comentario-texto"
                    >
                      {comment.texto}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No hay comentarios aún
                </p>
              )}
            </div>

            {/* Input para nuevo comentario */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <textarea
                className="flex-1 min-h-[60px] p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                placeholder="Agregar comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                data-testid="comentario-input"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                size="sm"
                data-testid="submit-comentario-btn"
              >
                Enviar
              </Button>
            </form>
          </section>

          {/* Fotos (AC8) */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fotos
            </h3>

            {/* Photo upload buttons */}
            <div className="flex gap-2 mb-3">
              <input
                type="file"
                id="foto-antes-input"
                className="hidden"
                accept="image/jpeg,image/png"
                data-testid="foto-antes-file-input"
                disabled={isSubmitting || ot.estado !== 'EN_PROGRESO'}
                onChange={(e) => handlePhotoUpload(e, 'antes')}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('foto-antes-input')?.click()}
                disabled={isSubmitting || ot.estado !== 'EN_PROGRESO'}
                data-testid="adjuntar-foto-antes-btn"
              >
                Adjuntar foto antes
              </Button>

              <input
                type="file"
                id="foto-despues-input"
                className="hidden"
                accept="image/jpeg,image/png"
                data-testid="foto-despues-file-input"
                disabled={isSubmitting || ot.estado !== 'EN_PROGRESO'}
                onChange={(e) => handlePhotoUpload(e, 'despues')}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('foto-despues-input')?.click()}
                disabled={isSubmitting || ot.estado !== 'EN_PROGRESO'}
                data-testid="adjuntar-foto-despues-btn"
              >
                Adjuntar foto después
              </Button>
            </div>

            {/* Existing photos */}
            {(fotosAntes.length > 0 || fotosDespues.length > 0) && (
              <>
                {/* Fotos Antes */}
                {fotosAntes.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Antes
                    </h4>
                    <div className="grid grid-cols-2 gap-2" data-testid="fotos-antes-section">
                      {fotosAntes.map((foto) => (
                        <img
                          key={foto.id}
                          src={foto.url}
                          alt="Antes de la reparación"
                          className="w-full h-32 object-cover rounded border"
                          data-testid={`foto-antes-preview`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Fotos Después */}
                {fotosDespues.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Después
                    </h4>
                    <div className="grid grid-cols-2 gap-2" data-testid="fotos-despues-section">
                      {fotosDespues.map((foto) => (
                        <img
                        key={foto.id}
                        src={foto.url}
                        alt="Después de la reparación"
                        className="w-full h-32 object-cover rounded border"
                        data-testid={`foto-despues-preview`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
            )}
          </section>
        </div>

        {/* Footer con botones de acción */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* AC3: Botón Iniciar OT */}
          {showStartButton && (
            <Button
              onClick={handleStartOTClick}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="ot-iniciar-btn"
            >
              Iniciar OT
            </Button>
          )}

          {/* AC5: Botón Completar OT */}
          {showCompleteButton && (
            <Button
              onClick={handleCompleteOTClick}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
              data-testid="ot-completar-btn"
            >
              Completar OT
            </Button>
          )}

          {/* Botón cerrar */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cerrar
          </Button>
        </div>

        {/* AC3: Dialog de confirmación para Iniciar OT */}
        <AlertDialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
          <AlertDialogContent data-testid="confirm-iniciar-ot-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Iniciar Orden de Trabajo</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Iniciar OT #{ot.numero}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="cancel-iniciar-ot-btn">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmStart}
                disabled={isSubmitting}
                data-testid="confirm-iniciar-ot-btn"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AC5: Dialog de confirmación para Completar OT */}
        <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <AlertDialogContent data-testid="confirm-completar-ot-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Completar Orden de Trabajo</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Completar OT #{ot.numero}? Verifica que la reparación funciona correctamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="cancel-completar-ot-btn">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmComplete}
                disabled={isSubmitting}
                data-testid="confirm-completar-ot-btn"
                className="bg-green-600 hover:bg-green-700"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
