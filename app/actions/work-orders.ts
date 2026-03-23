'use server'

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { revalidatePath } from 'next/cache'
import { WorkOrderEstado } from '@prisma/client'
import { ValidationError, AuthorizationError, AuthenticationError } from '@/lib/utils/errors'
import { broadcastWorkOrderUpdated } from '@/lib/sse/broadcaster'

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

      // Validar transición de estados (opcional - según reglas de negocio)
      const validTransitions: Record<WorkOrderEstado, WorkOrderEstado[]> = {
        PENDIENTE: ['ASIGNADA', 'DESCARTADA'],
        ASIGNADA: ['EN_PROGRESO', 'PENDIENTE', 'DESCARTADA'],
        EN_PROGRESO: ['COMPLETADA', 'PENDIENTE_REPUESTO', 'PENDIENTE_PARADA', 'REPARACION_EXTERNA', 'DESCARTADA'],
        PENDIENTE_REPUESTO: ['EN_PROGRESO', 'DESCARTADA'],
        PENDIENTE_PARADA: ['EN_PROGRESO', 'DESCARTADA'],
        REPARACION_EXTERNA: ['COMPLETADA', 'EN_PROGRESO', 'DESCARTADA'],
        COMPLETADA: [], // Estado terminal
        DESCARTADA: [] // Estado terminal
      }

      const allowedTransitions = validTransitions[workOrder.estado] || []
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

    // Log unexpected errors
    console.error('[updateWorkOrderStatus] Error inesperado:', {
      workOrderId,
      newEstado,
      userId: session.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw new ValidationError('Error al actualizar estado de OT')
  }
}
