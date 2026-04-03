'use server'

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { logger } from '@/lib/observability/logger'
import { revalidatePath } from 'next/cache'
import { WorkOrderEstado } from '@prisma/client'
import { ValidationError, AuthorizationError, AuthenticationError } from '@/lib/utils/errors'
import { broadcastWorkOrderUpdated } from '@/lib/sse/broadcaster'
import { VALID_TRANSITIONS } from '@/lib/constants/work-orders'
import { z } from 'zod'

// Batch operation schemas
const BatchAssignSchema = z.object({
  workOrderIds: z.array(z.string()).min(1).max(50),
  userIds: z.array(z.string()).max(3, 'Máximo 3 técnicos por OT').optional(), // M-003: PRD limit
  providerId: z.string().optional()
})

const BatchStatusSchema = z.object({
  workOrderIds: z.array(z.string()).min(1).max(50),
  newStatus: z.nativeEnum(WorkOrderEstado)
})

const BatchCommentSchema = z.object({
  workOrderIds: z.array(z.string()).min(1).max(50),
  comment: z.string().min(1).max(1000)
})

/**
 * Actualiza el estado de una Orden de Trabajo
 *
 * @param workOrderId - ID de la OT a actualizar
 * @param newEstado - Nuevo estado (enum WorkOrderEstado)
 * @returns OT actualizada con estado nuevo
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si faltan capacidades PBAC
 * @throws ValidationError si la OT no existe
 */
export async function updateWorkOrderStatus(
  workOrderId: string,
  newEstado: WorkOrderEstado
) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_view_all_ots (supervisores) o can_update_own_ot (técnicos)
  const hasCapability = session.user.capabilities.includes('can_view_all_ots') ||
                       session.user.capabilities.includes('can_update_own_ot')

  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para actualizar OTs')
  }

  // Performance tracking (NFR-S3: <1s threshold)
  const perf = trackPerformance('update_work_order_status', workOrderId)

  try {
    // Transacción Prisma para atomicidad
    const updatedWorkOrder = await prisma.$transaction(async (tx) => {
      // Fetch OT actual
      const workOrder = await tx.workOrder.findUnique({
        where: { id: workOrderId },
        include: {
          equipo: {
            include: {
              linea: {
                include: {
                  planta: true
                }
              }
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Validar transición de estados
      const allowedTransitions = VALID_TRANSITIONS[workOrder.estado] || []
      if (allowedTransitions.length > 0 && !allowedTransitions.includes(newEstado)) {
        throw new ValidationError(
          `Transición inválida: ${workOrder.estado} → ${newEstado}. ` +
          `Transiciones permitidas: ${allowedTransitions.join(', ')}`
        )
      }

      // Actualizar estado
      const updated = await tx.workOrder.update({
        where: { id: workOrderId },
        data: { estado: newEstado }
      })

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'work_order_status_updated',
          targetId: workOrderId,
          metadata: {
            estadoAnterior: workOrder.estado,
            estadoNuevo: newEstado,
            workOrderNumero: workOrder.numero
          }
        }
      })

      return updated
    })

    // Emit evento SSE para real-time sync (R-002: <30s delivery)
    broadcastWorkOrderUpdated({
      id: updatedWorkOrder.id,
      numero: updatedWorkOrder.numero,
      estado: updatedWorkOrder.estado,
      updatedAt: updatedWorkOrder.updated_at
    })

    // Revalidar rutas para actualizar Server Components
    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')
    revalidatePath('/averias/triage')

    // Log performance warning si >1s (NFR-S3)
    perf.end(1000)

    return updatedWorkOrder
  } catch (error) {
    // Log error con structured logging
    perf.end(1000) // End performance tracking even on error

    if (error instanceof ValidationError || error instanceof AuthorizationError) {
      throw error // Re-throw errores conocidos
    }

    // Log unexpected errors with structured logging (M-002)
    const errorObj = error instanceof Error ? error : new Error('Unknown error')
    logger.error(errorObj, 'updateWorkOrderStatus.error', crypto.randomUUID(), session.user.id)

    // Preservar contexto original del error
    const originalMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw new ValidationError(`Error al actualizar estado de OT: ${originalMessage}`)
  }
}

/**
 * Asignar técnicos a múltiples Órdenes de Trabajo en lote
 *
 * @param workOrderIds - Array de IDs de OTs (máx 50)
 * @param userIds - Array de IDs de usuarios a asignar (máx 3 por OT según PRD)
 * @param providerId - ID de proveedor (opcional)
 * @returns Objeto con count de OTs actualizadas
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si faltan capacidades PBAC (can_assign_technicians)
 * @throws ValidationError si la validación falla o no hay usuarios/proveedor
 */
export async function batchAssignTechnicians(
  workOrderIds: string[],
  userIds?: string[],
  providerId?: string
) {
  const session = await auth()
  const perf = trackPerformance('batchAssignTechnicians', crypto.randomUUID())

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validar que tenga capability para asignar
  const canAssign = session.user.capabilities?.includes('can_assign_technicians')
  if (!canAssign) {
    throw new AuthorizationError('No tienes permisos para asignar técnicos')
  }

  // Validar input
  const validated = BatchAssignSchema.parse({ workOrderIds, userIds, providerId })

  if (!validated.userIds?.length && !validated.providerId) {
    throw new ValidationError('Debe especificar al menos un usuario o proveedor')
  }

  try {
    // First, collect work order data and do updates in transaction
    const { updatedIds, workOrdersData } = await prisma.$transaction(async (tx) => {
      const updated: string[] = []
      const workOrders: Array<{ id: string; numero: string; estado: WorkOrderEstado }> = []

      for (const workOrderId of validated.workOrderIds) {
        // Verificar que la OT existe
        const workOrder = await tx.workOrder.findUnique({
          where: { id: workOrderId },
          select: { id: true, estado: true, numero: true }
        })

        if (!workOrder) continue

        // Eliminar asignaciones existentes (si hay)
        await tx.workOrderAssignment.deleteMany({
          where: { work_order_id: workOrderId }
        })

        // Crear nuevas asignaciones para usuarios
        if (validated.userIds?.length) {
          await tx.workOrderAssignment.createMany({
            data: validated.userIds.map(userId => ({
              work_order_id: workOrderId,
              userId: userId,
              role: 'TECNICO'
            }))
          })
        }

        // Crear asignación para proveedor
        if (validated.providerId) {
          await tx.workOrderAssignment.create({
            data: {
              work_order_id: workOrderId,
              providerId: validated.providerId,
              role: 'PROVEEDOR'
            }
          })
        }

        updated.push(workOrderId)
        workOrders.push(workOrder)
      }

      return { updatedIds: updated, workOrdersData: workOrders }
    })

    // Emit SSE events AFTER transaction commits successfully
    for (const wo of workOrdersData) {
      broadcastWorkOrderUpdated({
        id: wo.id,
        numero: wo.numero,
        estado: wo.estado,
        updatedAt: new Date()
      })
    }

    // Revalidar rutas
    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')

    perf.end(2000) // Allow 2s for batch operations

    return {
      success: true,
      count: updatedIds.length,
      workOrderIds: updatedIds
    }
  } catch (error) {
    perf.end(2000)
    // M-002: Structured logging instead of console.error
    const errorObj = error instanceof Error ? error : new Error('Unknown error')
    logger.error(errorObj, 'batchAssignTechnicians.error', crypto.randomUUID())
    throw new ValidationError(
      error instanceof Error ? error.message : 'Error al asignar técnicos en lote'
    )
  }
}

/**
 * Cambiar estado a múltiples Órdenes de Trabajo en lote
 *
 * @param workOrderIds - Array de IDs de OTs (máx 50)
 * @param newStatus - Nuevo estado
 * @returns Objeto con count de OTs actualizadas
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si faltan capacidades PBAC
 * @throws ValidationError si la validación falla
 */
export async function batchUpdateStatus(
  workOrderIds: string[],
  newStatus: WorkOrderEstado
) {
  const session = await auth()
  const perf = trackPerformance('batchUpdateStatus', crypto.randomUUID())

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validar que tenga capability para cambiar estado
  const canUpdate = session.user.capabilities?.some(cap =>
    ['can_update_own_ot', 'can_complete_ot', 'can_view_all_ots'].includes(cap)
  )
  if (!canUpdate) {
    throw new AuthorizationError('No tienes permisos para cambiar estado')
  }

  // Validar input
  const validated = BatchStatusSchema.parse({ workOrderIds, newStatus })

  try {
    // Do updates in transaction and collect data for SSE
    const { updatedIds, workOrdersData } = await prisma.$transaction(async (tx) => {
      const updated: string[] = []
      const workOrders: Array<{ id: string; numero: string; estado: WorkOrderEstado }> = []

      for (const workOrderId of validated.workOrderIds) {
        const workOrder = await tx.workOrder.findUnique({
          where: { id: workOrderId },
          select: { id: true, estado: true, numero: true }
        })

        if (!workOrder) continue

        // Validar transición
        const allowedTransitions = VALID_TRANSITIONS[workOrder.estado] || []
        if (allowedTransitions.length > 0 && !allowedTransitions.includes(newStatus)) {
          continue // Skip invalid transitions
        }

        // Actualizar estado
        await tx.workOrder.update({
          where: { id: workOrderId },
          data: {
            estado: newStatus,
            updated_at: new Date(),
            ...(newStatus === WorkOrderEstado.COMPLETADA && {
              completed_at: new Date()
            })
          }
        })

        updated.push(workOrderId)
        workOrders.push({ id: workOrder.id, numero: workOrder.numero, estado: newStatus })
      }

      return { updatedIds: updated, workOrdersData: workOrders }
    })

    // Emit SSE events AFTER transaction commits successfully
    for (const wo of workOrdersData) {
      broadcastWorkOrderUpdated({
        id: wo.id,
        numero: wo.numero,
        estado: wo.estado,
        updatedAt: new Date()
      })
    }

    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')

    perf.end(2000)

    return {
      success: true,
      count: updatedIds.length,
      workOrderIds: updatedIds
    }
  } catch (error) {
    perf.end(2000)
    // M-002: Structured logging instead of console.error
    const errorObj = error instanceof Error ? error : new Error('Unknown error')
    logger.error(errorObj, 'batchUpdateStatus.error', crypto.randomUUID())
    throw new ValidationError(
      error instanceof Error ? error.message : 'Error al cambiar estado en lote'
    )
  }
}

/**
 * Agregar comentario a múltiples Órdenes de Trabajo en lote
 *
 * @param workOrderIds - Array de IDs de OTs (máx 50)
 * @param comment - Comentario a agregar (máx 1000 caracteres)
 * @returns Objeto con count de OTs actualizadas
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si faltan capacidades PBAC
 * @throws ValidationError si la validación falla
 */
export async function batchAddComment(
  workOrderIds: string[],
  comment: string
) {
  const session = await auth()
  const perf = trackPerformance('batchAddComment', crypto.randomUUID())

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validar que tenga capability básica
  const canComment = session.user.capabilities?.some(cap =>
    ['can_view_all_ots', 'can_update_own_ot'].includes(cap)
  )
  if (!canComment) {
    throw new AuthorizationError('No tienes permisos para agregar comentarios')
  }

  // Validar input
  const validated = BatchCommentSchema.parse({ workOrderIds, comment })

  try {
    // Do updates in transaction and collect data for SSE
    const { updatedIds, workOrdersData } = await prisma.$transaction(async (tx) => {
      const updated: string[] = []
      const workOrders: Array<{ id: string; numero: string; estado: WorkOrderEstado }> = []

      for (const workOrderId of validated.workOrderIds) {
        const workOrder = await tx.workOrder.findUnique({
          where: { id: workOrderId },
          select: { id: true, estado: true, numero: true }
        })

        if (!workOrder) continue

        // Crear comentario
        await tx.workOrderComment.create({
          data: {
            work_order_id: workOrderId,
            user_id: session.user.id,
            texto: validated.comment
          }
        })

        // Actualizar fecha de modificación de la OT
        await tx.workOrder.update({
          where: { id: workOrderId },
          data: { updated_at: new Date() }
        })

        updated.push(workOrderId)
        workOrders.push(workOrder)
      }

      return { updatedIds: updated, workOrdersData: workOrders }
    })

    // Emit SSE events AFTER transaction commits successfully
    for (const wo of workOrdersData) {
      broadcastWorkOrderUpdated({
        id: wo.id,
        numero: wo.numero,
        estado: wo.estado,
        updatedAt: new Date()
      })
    }

    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')

    perf.end(2000)

    return {
      success: true,
      count: updatedIds.length,
      workOrderIds: updatedIds
    }
  } catch (error) {
    perf.end(2000)
    // M-002: Structured logging instead of console.error
    const errorObj = error instanceof Error ? error : new Error('Unknown error')
    logger.error(errorObj, 'batchAddComment.error', crypto.randomUUID())
    throw new ValidationError(
      error instanceof Error ? error.message : 'Error al agregar comentario en lote'
    )
  }
}
