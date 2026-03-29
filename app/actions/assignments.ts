'use server'

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { revalidatePath } from 'next/cache'
import { WorkOrderEstado } from '@prisma/client'
import { ValidationError, AuthorizationError, AuthenticationError } from '@/lib/utils/errors'
import { broadcastWorkOrderUpdated, broadcastTechnicianAssigned } from '@/lib/sse/broadcaster'

// ============================================
// TIPOS
// ============================================

export interface TechnicianWithWorkload {
  id: string
  name: string
  email: string
  phone: string | null
  skills: string[]
  ubicacion: string | null
  workload: number
  isOverloaded: boolean
}

export interface ProviderInfo {
  id: string
  name: string
  email: string | null
  phone: string | null
  services: string[]
  active: boolean
}

export interface AssignmentResult {
  success: boolean
  workOrderId: string
  assignedTechnicianIds: string[]
  assignedProviderId: string | null
}

// ============================================
// GET AVAILABLE TECHNICIANS
// ============================================

/**
 * Obtener técnicos disponibles con filtros opcionales
 * Story 3.3 AC1, AC2, AC6
 *
 * @param filters - Filtros opcionales: skills, ubicacion
 * @returns Lista de técnicos con información de workload
 */
export async function getAvailableTechnicians(
  filters?: { skills?: string[]; ubicacion?: string }
): Promise<TechnicianWithWorkload[]> {
  const session = await auth()

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_assign_technicians
  if (!session.user.capabilities.includes('can_assign_technicians')) {
    throw new AuthorizationError('No tienes permiso para asignar técnicos')
  }

  const perf = trackPerformance('get_available_technicians', session.user.id)

  try {
    // Estados activos para calcular workload
    const activeStates = [
      WorkOrderEstado.PENDIENTE,
      WorkOrderEstado.ASIGNADA,
      WorkOrderEstado.EN_PROGRESO,
      WorkOrderEstado.PENDIENTE_PARADA,
      WorkOrderEstado.PENDIENTE_REPUESTO,
    ]

    // Construir filtros WHERE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = { deleted: false }

    if (filters?.skills && filters.skills.length > 0) {
      whereConditions.skills = { hasSome: filters.skills }
    }

    if (filters?.ubicacion) {
      whereConditions.ubicacion = filters.ubicacion
    }

    // Buscar técnicos con capability can_update_own_ot (técnicos)
    const technicians = await prisma.user.findMany({
      where: {
        ...whereConditions,
        userCapabilities: {
          some: {
            capability: {
              name: 'can_update_own_ot'
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        skills: true,
        ubicacion: true,
      }
    })

    // Calcular workload para cada técnico
    const techniciansWithWorkload: TechnicianWithWorkload[] = await Promise.all(
      technicians.map(async (tech) => {
        const workload = await prisma.workOrderAssignment.count({
          where: {
            userId: tech.id,
            work_order: {
              estado: { in: activeStates }
            }
          }
        })

        return {
          id: tech.id,
          name: tech.name,
          email: tech.email,
          phone: tech.phone,
          skills: tech.skills,
          ubicacion: tech.ubicacion,
          workload,
          isOverloaded: workload >= 5,
        }
      })
    )

    perf.end(1000)

    return techniciansWithWorkload
  } catch (error) {
    perf.end(1000)
    console.error('[getAvailableTechnicians] Error:', error)
    throw new ValidationError('Error al obtener técnicos disponibles')
  }
}

// ============================================
// GET AVAILABLE PROVIDERS
// ============================================

/**
 * Obtener proveedores disponibles con filtros opcionales
 * Story 3.3 AC1
 *
 * @param filters - Filtros opcionales: services
 * @returns Lista de proveedores activos
 */
export async function getAvailableProviders(
  filters?: { services?: string[] }
): Promise<ProviderInfo[]> {
  const session = await auth()

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_assign_technicians
  if (!session.user.capabilities.includes('can_assign_technicians')) {
    throw new AuthorizationError('No tienes permiso para asignar técnicos')
  }

  const perf = trackPerformance('get_available_providers', session.user.id)

  try {
    // Construir filtros WHERE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = { active: true }

    if (filters?.services && filters.services.length > 0) {
      whereConditions.services = { hasSome: filters.services }
    }

    const providers = await prisma.provider.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        services: true,
        active: true,
      }
    })

    perf.end(1000)

    return providers
  } catch (error) {
    perf.end(1000)
    console.error('[getAvailableProviders] Error:', error)
    throw new ValidationError('Error al obtener proveedores disponibles')
  }
}

// ============================================
// ASSIGN TO WORK ORDER
// ============================================

/**
 * Asignar técnicos y/o proveedor a una OT
 * Story 3.3 AC1, AC3
 *
 * Reglas:
 * - Máximo 3 asignados (técnicos + proveedor)
 * - Si se asigna proveedor, máximo 2 técnicos
 * - Requiere capability can_assign_technicians
 * - Emite SSE a todos los asignados
 *
 * @param workOrderId - ID de la OT
 * @param technicianIds - IDs de técnicos (1-3)
 * @param providerId - ID del proveedor (opcional)
 * @returns Resultado de la asignación
 */
export async function assignToWorkOrder(
  workOrderId: string,
  technicianIds: string[],
  providerId?: string | null
): Promise<AssignmentResult> {
  const session = await auth()

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_assign_technicians
  if (!session.user.capabilities.includes('can_assign_technicians')) {
    throw new AuthorizationError('No tienes permiso para asignar técnicos')
  }

  const perf = trackPerformance('assign_to_work_order', session.user.id)

  try {
    // Validación: máximo 3 asignados
    const totalAssignments = technicianIds.length + (providerId ? 1 : 0)
    if (totalAssignments > 3) {
      throw new ValidationError('No se pueden asignar más de 3 personas a una OT')
    }

    // Validación: al menos 1 técnico
    if (technicianIds.length === 0 && !providerId) {
      throw new ValidationError('Debe asignar al menos un técnico o proveedor')
    }

    // Verificar que la OT existe
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId }
    })

    if (!workOrder) {
      throw new ValidationError('La OT no existe')
    }

    // Transacción para asignaciones
    const result = await prisma.$transaction(async (tx) => {
      // Eliminar asignaciones anteriores de técnicos
      await tx.workOrderAssignment.deleteMany({
        where: {
          work_order_id: workOrderId,
          userId: { not: null }
        }
      })

      // Eliminar asignaciones anteriores de proveedores
      if (providerId) {
        await tx.workOrderAssignment.deleteMany({
          where: {
            work_order_id: workOrderId,
            providerId: { not: null }
          }
        })
      }

      // Crear nuevas asignaciones de técnicos
      const assignedTechnicianIds: string[] = []
      for (const userId of technicianIds) {
        await tx.workOrderAssignment.create({
          data: {
            work_order_id: workOrderId,
            userId,
            providerId: null,
            role: 'TECNICO'
          }
        })
        assignedTechnicianIds.push(userId)
      }

      // Crear asignación de proveedor si existe
      let assignedProviderId: string | null = null
      if (providerId) {
        await tx.workOrderAssignment.create({
          data: {
            work_order_id: workOrderId,
            userId: null,
            providerId,
            role: 'PROVEEDOR'
          }
        })
        assignedProviderId = providerId
      }

      // Actualizar estado de OT a ASIGNADA si estaba PENDIENTE
      if (workOrder.estado === WorkOrderEstado.PENDIENTE) {
        await tx.workOrder.update({
          where: { id: workOrderId },
          data: { estado: WorkOrderEstado.ASIGNADA }
        })
      }

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'work_order_assigned',
          targetId: workOrderId,
          metadata: {
            workOrderNumero: workOrder.numero,
            technicianIds,
            providerId,
            assignedBy: session.user.name
          }
        }
      })

      return { assignedTechnicianIds, assignedProviderId }
    })

    // Emitir SSE para cada técnico asignado
    for (const technicianId of technicianIds) {
      const technician = await prisma.user.findUnique({
        where: { id: technicianId },
        select: { name: true }
      })

      broadcastTechnicianAssigned({
        otNumero: workOrder.numero,
        otId: workOrder.id,
        tecnicoId: technicianId,
        tecnicoNombre: technician?.name || 'Desconocido',
        assignedAt: new Date(),
        estado: workOrder.estado
      })
    }

    // Emitir evento de actualización de OT
    broadcastWorkOrderUpdated({
      id: workOrder.id,
      numero: workOrder.numero,
      estado: workOrder.estado,
      updatedAt: new Date()
    })

    // Revalidar rutas
    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')
    revalidatePath('/ots/mis-ots')

    perf.end(1000)

    return {
      success: true,
      workOrderId,
      assignedTechnicianIds: result.assignedTechnicianIds,
      assignedProviderId: result.assignedProviderId
    }
  } catch (error) {
    perf.end(1000)

    if (error instanceof ValidationError || error instanceof AuthorizationError) {
      throw error
    }

    console.error('[assignToWorkOrder] Error:', error)
    throw new ValidationError('Error al asignar técnicos')
  }
}

// ============================================
// GET TECHNICIAN WORKLOAD
// ============================================

/**
 * Obtener la carga de trabajo de un técnico
 * Story 3.3 AC7
 *
 * @param userId - ID del técnico
 * @returns Número de OTs activas asignadas
 */
export async function getTechnicianWorkload(userId: string): Promise<number> {
  const session = await auth()

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_assign_technicians
  if (!session.user.capabilities.includes('can_assign_technicians')) {
    throw new AuthorizationError('No tienes permiso para ver carga de trabajo')
  }

  const perf = trackPerformance('get_technician_workload', session.user.id)

  try {
    // Estados activos
    const activeStates = [
      WorkOrderEstado.PENDIENTE,
      WorkOrderEstado.ASIGNADA,
      WorkOrderEstado.EN_PROGRESO,
      WorkOrderEstado.PENDIENTE_PARADA,
      WorkOrderEstado.PENDIENTE_REPUESTO,
    ]

    const workload = await prisma.workOrderAssignment.count({
      where: {
        userId,
        work_order: {
          estado: { in: activeStates }
        }
      }
    })

    perf.end(1000)

    return workload
  } catch (error) {
    perf.end(1000)
    console.error('[getTechnicianWorkload] Error:', error)
    throw new ValidationError('Error al obtener carga de trabajo')
  }
}

// ============================================
// CONFIRM PROVIDER WORK
// ============================================

/**
 * Confirmar trabajo de proveedor externo
 * Story 3.3 AC5
 *
 * @param workOrderId - ID de la OT
 * @returns Resultado de la confirmación
 */
/**
 * Remove a technician or provider assignment from a work order
 * * Story 3.3: AC1 - Remove assignment capability
 */
export async function removeAssignment(
  workOrderId: string,
  userId?: string,
  providerId?: string
): Promise<{ success: boolean }> {

  const session = await auth()

  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_assign_technicians
  if (!session.user.capabilities.includes('can_assign_technicians')) {
    throw new AuthorizationError('No tienes permiso para confirmar trabajo de proveedor')
  }

  const perf = trackPerformance('confirm_provider_work', session.user.id)

  try {
    // Verificar que la OT existe y está en estado REPARACION_EXTERNA
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId }
    })

    if (!workOrder) {
      throw new ValidationError('La OT no existe')
    }

    if (workOrder.estado !== WorkOrderEstado.REPARACION_EXTERNA) {
      throw new ValidationError('Solo se pueden confirmar OTs en estado REPARACION_EXTERNA')
    }

    // Transacción para actualizar estado
    await prisma.$transaction(async (tx) => {
      // Actualizar estado a COMPLETADA
      await tx.workOrder.update({
        where: { id: workOrderId },
        data: {
          estado: WorkOrderEstado.COMPLETADA,
          completed_at: new Date()
        }
      })

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'provider_work_confirmed',
          targetId: workOrderId,
          metadata: {
            workOrderNumero: workOrder.numero,
            previousState: WorkOrderEstado.REPARACION_EXTERNA,
            newState: WorkOrderEstado.COMPLETADA,
            confirmedBy: session.user.name
          }
        }
      })
    })

    // Emitir evento SSE
    broadcastWorkOrderUpdated({
      id: workOrder.id,
      numero: workOrder.numero,
      estado: WorkOrderEstado.COMPLETADA,
      updatedAt: new Date()
    })

    // Revalidar rutas
    revalidatePath('/ots/kanban')
    revalidatePath('/ots/lista')
    revalidatePath('/ots/mis-ots')

    perf.end(1000)

    return { success: true }
  } catch (error) {
    perf.end(1000)

    if (error instanceof ValidationError || error instanceof AuthorizationError) {
      throw error
    }

    console.error('[confirmProviderWork] Error:', error)
    throw new ValidationError('Error al confirmar trabajo de proveedor')
  }
}
