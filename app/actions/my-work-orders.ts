'use server'

/**
 * Server Actions for Story 3.2: Gestión de OTs Asignadas (Mis OTs)
 *
 * These actions are used by technicians to manage their assigned work orders.
 * All actions require can_update_own_ot capability.
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { revalidatePath } from 'next/cache'
import { WorkOrderEstado, PhotoTipo } from '@prisma/client'
import { z } from 'zod'
import { ValidationError, AuthorizationError, AuthenticationError, InsufficientStockError } from '@/lib/utils/errors'
import { broadcastWorkOrderUpdated, BroadcastManager } from '@/lib/sse/broadcaster'
import { VALID_TRANSITIONS } from '@/lib/constants/work-orders'

/**
 * ============================================
 * ZOD SCHEMAS - Data Validation
 * ============================================
 */

const StartWorkOrderSchema = z.object({
  workOrderId: z.string().cuid2('ID de OT inválido'),
})

const AddUsedRepuestoSchema = z.object({
  workOrderId: z.string().cuid2('ID de OT inválido'),
  repuestoId: z.string().cuid2('ID de repuesto inválido'),
  cantidad: z.number().int().positive('La cantidad debe ser un número entero positivo'),
})

const CompleteWorkOrderSchema = z.object({
  workOrderId: z.string().cuid2('ID de OT inválido'),
})

const AddCommentSchema = z.object({
  workOrderId: z.string().cuid2('ID de OT inválido'),
  texto: z.string().min(1, 'El comentario no puede estar vacío').max(2000, 'Máximo 2000 caracteres'),
})

const UploadPhotoSchema = z.object({
  workOrderId: z.string().cuid2('ID de OT inválido'),
  tipo: z.enum(['antes', 'despues'], {
    errorMap: () => ({ message: 'Tipo debe ser "antes" o "despues"' })
  }),
  url: z.string().url('URL de foto inválida'),
})

/**
 * ============================================
 * AC3: Iniciar OT (ASIGNADA → EN_PROGRESO)
 * ============================================
 */

/**
 * Iniciar una Orden de Trabajo
 *
 * Cambia el estado de ASIGNADA a EN_PROGRESO.
 * Requiere capability can_update_own_ot.
 *
 * @param workOrderId - ID de la OT a iniciar
 * @returns OT actualizada con estado EN_PROGRESO
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si no tiene can_update_own_ot
 * @throws ValidationError si la OT no existe o transición inválida
 */
export async function startWorkOrder(workOrderId: string) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_update_own_ot
  const hasCapability = session.user.capabilities.includes('can_update_own_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para actualizar OTs propias')
  }

  // Validar input con Zod
  const validated = StartWorkOrderSchema.parse({ workOrderId })

  // Performance tracking (NFR-S3: <1s threshold)
  const perf = trackPerformance('start_work_order', validated.workOrderId)

  try {
    // Transacción Prisma para atomicidad
    const updatedWorkOrder = await prisma.$transaction(async (tx) => {
      // Fetch OT actual con asignaciones
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            where: {
              userId: session.user.id // Solo si está asignado
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Verificar que el usuario está asignado a la OT
      const isAssigned = workOrder.assignments.length > 0
      if (!isAssigned) {
        throw new AuthorizationError('No estás asignado a esta OT')
      }

      // Validar transición de estados: ASIGNADA → EN_PROGRESO
      const allowedTransitions = VALID_TRANSITIONS[workOrder.estado] || []
      if (!allowedTransitions.includes('EN_PROGRESO' as WorkOrderEstado)) {
        throw new ValidationError(
          `No se puede iniciar OT desde estado ${workOrder.estado}. ` +
          `Transiciones permitidas: ${allowedTransitions.join(', ')}`
        )
      }

      // Actualizar estado
      const updated = await tx.workOrder.update({
        where: { id: validated.workOrderId },
        data: { estado: 'EN_PROGRESO' }
      })

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'work_order_started',
          targetId: validated.workOrderId,
          metadata: {
            estadoAnterior: workOrder.estado,
            estadoNuevo: 'EN_PROGRESO',
            workOrderNumero: workOrder.numero
          }
        }
      })

      return updated
    })

    perf.end(1000) // Log warning si >1s

    // Emit evento SSE para real-time sync (NFR-S19: <30s delivery)
    broadcastWorkOrderUpdated({
      id: updatedWorkOrder.id,
      numero: updatedWorkOrder.numero,
      estado: updatedWorkOrder.estado,
      updatedAt: updatedWorkOrder.updated_at
    })

    // Revalidar caché de /mis-ots
    revalidatePath('/mis-ots')

    return updatedWorkOrder
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message)
    }
    throw error
  }
}

/**
 * ============================================
 * AC4: Agregar Repuestos Usados (Stock Validation)
 * ============================================
 */

/**
 * Agregar repuesto usado a una OT
 *
 * Valida stock disponible y actualiza cantidad.
 * Usa transacción atómica para prevenir race conditions (R-011).
 *
 * @param workOrderId - ID de la OT
 * @param repuestoId - ID del repuesto
 * @param cantidad - Cantidad usada
 * @returns Repuesto usado creado
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si no tiene can_update_own_ot o no está asignado
 * @throws ValidationError si stock insuficiente
 * @throws InsufficientStockError si stock < cantidad
 */
export async function addUsedRepuesto(
  workOrderId: string,
  repuestoId: string,
  cantidad: number
) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_update_own_ot
  const hasCapability = session.user.capabilities.includes('can_update_own_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para agregar repuestos')
  }

  // Validar input con Zod
  const validated = AddUsedRepuestoSchema.parse({ workOrderId, repuestoId, cantidad })

  // Performance tracking (NFR-S16: <1s threshold)
  const perf = trackPerformance('add_used_repuesto', validated.workOrderId)

  try {
    // CRITICAL: Prisma transaction para atomicidad (R-011 race condition)
    const result = await prisma.$transaction(async (tx) => {
      // Fetch OT actual
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            where: {
              userId: session.user.id
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Verificar que el usuario está asignado a la OT
      const isAssigned = workOrder.assignments.length > 0
      if (!isAssigned) {
        throw new AuthorizationError('No estás asignado a esta OT')
      }

      // Fetch repuesto y validar stock
      const repuesto = await tx.repuesto.findUnique({
        where: { id: validated.repuestoId }
      })

      if (!repuesto) {
        throw new ValidationError('Repuesto no existe')
      }

      // CRITICAL: Validar stock antes de actualizar (NFR-S16)
      if (repuesto.stock < validated.cantidad) {
        throw new InsufficientStockError(
          repuesto.stock,
          validated.cantidad,
          validated.repuestoId,
          workOrderId // correlationId
        )
      }

      // Actualizar stock del repuesto
      const newStock = repuesto.stock - validated.cantidad
      await tx.repuesto.update({
        where: { id: validated.repuestoId },
        data: { stock: newStock }
      })

      // Crear registro de repuesto usado
      const usedRepuesto = await tx.usedRepuesto.create({
        data: {
          work_order_id: validated.workOrderId,
          repuesto_id: validated.repuestoId,
          cantidad: validated.cantidad
        },
        include: {
          repuesto: true
        }
      })

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'repuesto_used',
          targetId: validated.repuestoId,
          metadata: {
            workOrderId: validated.workOrderId,
            cantidad: validated.cantidad,
            stockAnterior: repuesto.stock,
            stockNuevo: newStock,
            repuestoNombre: repuesto.name
          }
        }
      })

      return { usedRepuesto, newStock, repuestoNombre: repuesto.name }
    })

    perf.end(1000) // Log warning si >1s

    // Emit evento SSE de stock actualizado (NFR-S16: notificación silenciosa)
    // Solo a usuarios can_view_own_ots, NO a can_manage_stock (actualizaciones silenciosas)
    BroadcastManager.broadcast('stock', {
      name: 'repuesto-stock-updated',
      data: {
        repuestoId: validated.repuestoId,
        newStock: result.newStock,
        workOrderId: validated.workOrderId,
        updatedAt: new Date().toISOString()
      },
      id: crypto.randomUUID()
    })

    // Emit evento SSE para work-orders (para actualizar lista de repuestos usados)
    console.log('[SSE Broadcast] Emitting work-order-repuesto-added:', {
      workOrderId: validated.workOrderId,
      usedRepuestoId: result.usedRepuesto.id,
      repuestoNombre: result.repuestoNombre
    })
    BroadcastManager.broadcast('work-orders', {
      name: 'work-order-repuesto-added',
      data: {
        workOrderId: validated.workOrderId,
        usedRepuestoId: result.usedRepuesto.id,
        repuestoNombre: result.repuestoNombre,
        cantidad: result.usedRepuesto.cantidad,
        newStock: result.newStock,
        updatedAt: new Date().toISOString()
      },
      id: crypto.randomUUID()
    })

    // Revalidar caché
    revalidatePath('/mis-ots')

    return result.usedRepuesto
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message)
    }
    throw error
  }
}

/**
 * ============================================
 * AC5: Completar OT (EN_PROGRESO → COMPLETADA)
 * ============================================
 */

/**
 * Completar una Orden de Trabajo
 *
 * Cambia el estado a COMPLETADA y registra completedAt.
 * Requiere capability can_update_own_ot.
 *
 * @param workOrderId - ID de la OT a completar
 * @returns OT actualizada con estado COMPLETADA
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si no tiene can_update_own_ot o no está asignado
 * @throws ValidationError si la OT no existe o transición inválida
 */
export async function completeWorkOrder(workOrderId: string) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_update_own_ot
  const hasCapability = session.user.capabilities.includes('can_update_own_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para completar OTs')
  }

  // Validar input con Zod
  const validated = CompleteWorkOrderSchema.parse({ workOrderId })

  // Performance tracking (NFR-S3: <1s threshold)
  const perf = trackPerformance('complete_work_order', validated.workOrderId)

  try {
    // Transacción Prisma para atomicidad
    const updatedWorkOrder = await prisma.$transaction(async (tx) => {
      // Fetch OT actual con asignaciones
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            where: {
              userId: session.user.id
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Verificar que el usuario está asignado a la OT
      const isAssigned = workOrder.assignments.length > 0
      if (!isAssigned) {
        throw new AuthorizationError('No estás asignado a esta OT')
      }

      // Validar transición de estados: EN_PROGRESO → COMPLETADA
      const allowedTransitions = VALID_TRANSITIONS[workOrder.estado] || []
      if (!allowedTransitions.includes('COMPLETADA' as WorkOrderEstado)) {
        throw new ValidationError(
          `No se puede completar OT desde estado ${workOrder.estado}. ` +
          `Transiciones permitidas: ${allowedTransitions.join(', ')}`
        )
      }

      // Actualizar estado y registrar completedAt
      const updated = await tx.workOrder.update({
        where: { id: validated.workOrderId },
        data: {
          estado: 'COMPLETADA',
          completed_at: new Date()
        }
      })

      // Registrar auditoría
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'work_order_completed',
          targetId: validated.workOrderId,
          metadata: {
            estadoAnterior: workOrder.estado,
            estadoNuevo: 'COMPLETADA',
            workOrderNumero: workOrder.numero,
            completedAt: new Date().toISOString()
          }
        }
      })

      return updated
    })

    perf.end(1000) // Log warning si >1s

    // Emit evento SSE para real-time sync (NFR-S19: <30s delivery)
    broadcastWorkOrderUpdated({
      id: updatedWorkOrder.id,
      numero: updatedWorkOrder.numero,
      estado: updatedWorkOrder.estado,
      updatedAt: updatedWorkOrder.updated_at
    })

    // Revalidar caché de /mis-ots
    // NOTA: OT completada ya no aparece en "Mis OTs" (filtro en getMyWorkOrders)
    revalidatePath('/mis-ots')

    return updatedWorkOrder
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message)
    }
    throw error
  }
}

/**
 * ============================================
 * AC7: Comentarios en Tiempo Real
 * ============================================
 */

/**
 * Agregar comentario a una OT
 *
 * Crea un comentario con timestamp y emite notificación SSE.
 *
 * @param workOrderId - ID de la OT
 * @param texto - Texto del comentario (max 2000 caracteres)
 * @returns Comentario creado
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si no tiene can_update_own_ot o no está asignado
 * @throws ValidationError si la OT no existe
 */
export async function addComment(workOrderId: string, texto: string) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_update_own_ot
  const hasCapability = session.user.capabilities.includes('can_update_own_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para comentar')
  }

  // Validar input con Zod
  const validated = AddCommentSchema.parse({ workOrderId, texto })

  try {
    // Transacción Prisma para atomicidad
    const comment = await prisma.$transaction(async (tx) => {
      // Fetch OT actual con asignaciones
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            where: {
              userId: session.user.id
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Verificar que el usuario está asignado a la OT
      const isAssigned = workOrder.assignments.length > 0
      if (!isAssigned) {
        throw new AuthorizationError('No estás asignado a esta OT')
      }

      // Crear comentario
      const newComment = await tx.workOrderComment.create({
        data: {
          work_order_id: validated.workOrderId,
          user_id: session.user.id,
          texto: validated.texto
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return newComment
    })

    // Emit evento SSE para notificar a otros asignados (NFR-S19: <30s delivery)
    BroadcastManager.broadcast('work-orders', {
      name: 'work-order-comment-added',
      data: {
        workOrderId: validated.workOrderId,
        commentId: comment.id,
        texto: comment.texto,
        userId: comment.user_id,
        userName: comment.user.name,
        createdAt: comment.created_at.toISOString()
      },
      id: crypto.randomUUID()
    })

    // Revalidar caché
    revalidatePath('/mis-ots')

    return comment
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message)
    }
    throw error
  }
}

/**
 * ============================================
 * AC8: Fotos Antes/Después
 * ============================================
 */

/**
 * Subir foto a una OT
 *
 * Registra la URL de Vercel Blob y la tipo (ANTES/DESPUES).
 *
 * NOTA: Esta action asume que la foto ya fue subida a Vercel Blob
 * via API endpoint /api/v1/upload-work-order-photo.
 *
 * @param workOrderId - ID de la OT
 * @param tipo - Tipo de foto ('antes' | 'despues')
 * @param url - URL pública de Vercel Blob
 * @returns Foto creada
 * @throws AuthenticationError si no hay sesión
 * @throws AuthorizationError si no tiene can_update_own_ot o no está asignado
 * @throws ValidationError si la OT no existe
 */
export async function uploadPhoto(
  workOrderId: string,
  tipo: 'antes' | 'despues',
  url: string
) {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_update_own_ot
  const hasCapability = session.user.capabilities.includes('can_update_own_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para subir fotos')
  }

  // Validar input con Zod
  const validated = UploadPhotoSchema.parse({ workOrderId, tipo, url })

  try {
    // Transacción Prisma para atomicidad
    const photo = await prisma.$transaction(async (tx) => {
      // Fetch OT actual con asignaciones
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            where: {
              userId: session.user.id
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no existe')
      }

      // Verificar que el usuario está asignado a la OT
      const isAssigned = workOrder.assignments.length > 0
      if (!isAssigned) {
        throw new AuthorizationError('No estás asignado a esta OT')
      }

      // Mapear 'antes' | 'despues' a PhotoTipo enum
      const tipoEnum = tipo === 'antes' ? PhotoTipo.ANTES : PhotoTipo.DESPUES

      // Crear foto
      const newPhoto = await tx.workOrderPhoto.create({
        data: {
          work_order_id: validated.workOrderId,
          tipo: tipoEnum,
          url: validated.url
        }
      })

      return newPhoto
    })

    // Emit evento SSE para notificar (NFR-S19: <30s delivery)
    BroadcastManager.broadcast('work-orders', {
      name: 'work-order-photo-added',
      data: {
        workOrderId: validated.workOrderId,
        photoId: photo.id,
        tipo: photo.tipo,
        url: photo.url,
        createdAt: photo.created_at.toISOString()
      },
      id: crypto.randomUUID()
    })

    // Revalidar caché
    revalidatePath('/mis-ots')

    return photo
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message)
    }
    throw error
  }
}

/**
 * ============================================
 * Server Action para listar Mis OTs (AC1)
 * ============================================
 */

/**
 * Obtener las OTs asignadas al usuario actual
 *
 * @returns Lista de OTs donde el usuario está asignado
 * @throws AuthenticationError si no hay sesión
 */
export async function getMyWorkOrders() {
  const session = await auth()

  // Validación de autenticación
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // Validación PBAC: requiere can_view_own_ots
  const hasCapability = session.user.capabilities.includes('can_view_own_ots')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para ver OTs propias')
  }

  // Fetch OTs donde el usuario está asignado
  const workOrders = await prisma.workOrder.findMany({
    where: {
      assignments: {
        some: {
          userId: session.user.id
        }
      },
      // NOTA: NO filtrar COMPLETADA aquí - dejar que el componente decida
      // El componente MyWorkOrdersList puede mostrar OTs completadas
    },
    include: {
      equipo: {
        select: {
          id: true,
          name: true,
          linea: {
            select: {
              name: true,
              planta: {
                select: {
                  division: true
                }
              }
            }
          }
        }
      },
      assignments: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      photos: {
        orderBy: {
          created_at: 'desc'
        }
      },
      comments: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 5 // Últimos 5 comentarios
      },
      usedRepuestos: {
        include: {
          repuesto: true
        }
      }
    },
    orderBy: {
      created_at: 'desc' // Más recientes primero
    }
  })

  return workOrders
}
