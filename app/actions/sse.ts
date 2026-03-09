/**
 * Server Actions for SSE Broadcasting
 *
 * These actions allow the application to broadcast SSE events from server-side code.
 * For example, when a work order is updated, notifyWorkOrderUpdated() can be called
 * to broadcast the update to all connected clients.
 *
 * These are Server Actions that can be called from both Server and Client Components.
 */

'use server'

import { auth } from '@/lib/auth-adapter'
import { broadcastWorkOrderUpdate, broadcastKPIsUpdate } from '@/lib/sse/broadcaster'
import { prisma } from '@/lib/db'
import { AuthorizationError } from '@/lib/utils/errors'

/**
 * Broadcast work order update event
 *
 * Call this action when a work order is created, updated, or completed.
 * It will fetch the latest work order data and broadcast it to all subscribers.
 *
 * @param workOrderId - ID of the work order that was updated
 * @returns Success indicator
 * @throws AuthorizationError if user is not authenticated
 * @throws AuthorizationError if work order not found
 *
 * @example
 * ```ts
 * // In a Server Action after updating a work order:
 * await notifyWorkOrderUpdated(workOrderId)
 * ```
 */
export async function notifyWorkOrderUpdated(workOrderId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new AuthorizationError('Debe estar autenticado')
  }

  // Fetch updated work order
  const workOrder = await prisma.workOrder.findUnique({
    where: { id: workOrderId },
    select: {
      id: true,
      numero: true,
      estado: true,
      updated_at: true
    }
  })

  if (!workOrder) {
    throw new AuthorizationError('OT no encontrada')
  }

  // Broadcast to all connected clients
  broadcastWorkOrderUpdate({
    id: workOrder.id,
    numero: workOrder.numero,
    estado: workOrder.estado,
    updatedAt: workOrder.updated_at
  })

  return { success: true }
}

/**
 * Broadcast KPIs update event
 *
 * Call this action when KPIs are recalculated.
 * It will calculate current KPIs and broadcast them to all subscribers.
 *
 * @returns Success indicator
 * @throws AuthorizationError if user is not authenticated
 *
 * @example
 * ```ts
 * // In a Server Action after completing a work order:
 * await notifyKPIsUpdated()
 * ```
 */
export async function notifyKPIsUpdated() {
  const session = await auth()
  if (!session?.user) {
    throw new AuthorizationError('Debe estar autenticado')
  }

  // Calculate KPIs
  const [otsAbiertas] = await Promise.all([
    prisma.workOrder.count({
      where: {
        estado: {
          in: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'PENDIENTE_REPUESTO', 'PENDIENTE_PARADA']
        }
      }
    }),
    prisma.workOrder.count({ where: { estado: 'COMPLETADA' } })
  ])

  // Calculate MTTR and MTBF (simplified for now)
  // TODO: Implement proper MTTR/MTBF calculation in future stories
  const mttr = 4.2 // hours (placeholder)
  const mtbf = 127 // hours (placeholder)
  const disponibilidad = 95.5 // % (placeholder)

  // Broadcast to all connected clients
  broadcastKPIsUpdate({
    mttr,
    mtbf,
    otsAbiertas,
    disponibilidad
  })

  return { success: true }
}
