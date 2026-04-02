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
import { WorkOrder, WorkOrderEstado, PhotoTipo } from '@prisma/client'
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
  workOrderId: z.string().cuid2('ID de OT inválido')
})

const GetMyWorkOrdersSchema = z.object({
  page: z.number().int().positive('Page debe ser positivo').default(1),
  limit: z.number().int().positive('Limit debe ser positivo').max(100, 'Limit máximo es 100').default(20)
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
    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_repuesto_added',
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
      name: 'work_order_comment_added',
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
      name: 'work_order_photo_added',
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
 * Obtener las OTs asignadas al usuario actual con paginación
 *
 * @param page - Número de página (empezando en 1)
 * @param limit - Cantidad de OTs por página (default: 20, max: 100)
 * @returns Objeto con workOrders array y metadata de paginación
 * @throws AuthenticationError si no hay sesión
 */
export async function getMyWorkOrders(
  page: number = 1,
  limit: number = 20
) {
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

  // Validar parámetros de paginación
  const validated = GetMyWorkOrdersSchema.parse({ page, limit })

  // Calcular skip para paginación
  const skip = (validated.page - 1) * validated.limit

  // Ejecutar queries en paralelo para mejor performance
  const [workOrders, total] = await Promise.all([
    // Query para obtener OTs de la página actual
    prisma.workOrder.findMany({
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
            },
            provider: {
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
          },
          take: 50 // Limit to prevent N+1 queries
        }
      },
      orderBy: {
        created_at: 'asc' // Oldest first - ensures ASIGNADA/EN_PROGRESO appear before COMPLETADA (seed order)
      },
      skip,
      take: validated.limit
    }),

    // Query para obtener el total de OTs (para metadata)
    prisma.workOrder.count({
      where: {
        assignments: {
          some: {
            userId: session.user.id
          }
        }
      }
    })
  ])

  // Calcular metadata de paginación
  const totalPages = Math.ceil(total / validated.limit)
  const hasNext = validated.page < totalPages
  const hasPrev = validated.page > 1

  return {
    workOrders,
    pagination: {
      page: validated.page,
      limit: validated.limit,
      total,
      totalPages,
      hasNext,
      hasPrev
    }
  }
}

/**
 * Verify Work Order - AC6: Verificación por Operario
 *
 * Permite al operario confirmar si la reparación funciona correctamente.
 * Si NO funciona, genera una OT de re-trabajo con prioridad ALTA.
 * Si funciona, marca la OT como verificada.
 *
 * @param workOrderId - ID de la OT a verificar
 * @param funciona - true si la reparación funciona, false si no
 * @param comentario - Comentario opcional explicando por qué no funciona
 * @returns OT actualizada o nueva OT de re-trabajo
 */
export async function verifyWorkOrder(
  workOrderId: string,
  funciona: boolean,
  comentario?: string
): Promise<{ success: true; workOrder: WorkOrder; message: string }> {
  const session = await auth()
  if (!session?.user) {
    throw new AuthenticationError('No autenticado')
  }

  // PBAC validation: capability para verificar OTs
  const hasCapability = session.user.capabilities.includes('can_verify_ot')
  if (!hasCapability) {
    throw new AuthorizationError('Sin permisos para verificar OTs')
  }

  // Validar input con Zod
  const VerifyWorkOrderSchema = z.object({
    workOrderId: z.string().cuid2('ID de OT inválido'),
    funciona: z.boolean(),
    comentario: z.string().optional()
  })

  const validated = VerifyWorkOrderSchema.parse({ workOrderId, funciona, comentario })

  // Performance tracking (NFR-S3: <1s threshold)
  const perf = trackPerformance('verify_work_order', validated.workOrderId)

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch OT actual
      const workOrder = await tx.workOrder.findUnique({
        where: { id: validated.workOrderId },
        include: {
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          equipo: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (!workOrder) {
        throw new ValidationError('OT no encontrada')
      }

      // 2. Verificar que la OT esté completada
      if (workOrder.estado !== 'COMPLETADA') {
        throw new ValidationError('Solo se pueden verificar OTs completadas')
      }

      // 3. Verificar que la OT no haya sido verificada previamente
      if (workOrder.verificacion_at) {
        throw new ValidationError('Esta OT ya ha sido verificada')
      }

      if (validated.funciona) {
        // 3a. CASO: La reparación funciona → marcar como verificada
        const updated = await tx.workOrder.update({
          where: { id: validated.workOrderId },
          data: {
            verificacion_at: new Date()
          }
        })

        // Registrar auditoría
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'work_order_verified',
            targetId: validated.workOrderId,
            metadata: {
              otNumero: workOrder.numero,
              funciona: true
            }
          }
        })

        // Emit evento SSE
        BroadcastManager.broadcast('work-orders', {
          name: 'work_order_updated',
          data: {
            workOrderId: updated.id,
            otNumero: updated.numero,
            estado: updated.estado,
            updatedAt: updated.updated_at.toISOString()
          },
          id: crypto.randomUUID()
        })

        perf.end(1000)

        return {
          success: true,
          workOrder: updated,
          message: `OT ${workOrder.numero} verificada exitosamente. La reparación funciona correctamente.`
        }
      } else {
        // 3b. CASO: La reparación NO funciona → crear OT de re-trabajo
        const ultimoNumero = await tx.workOrder.findFirst({
          orderBy: { numero: 'desc' }
        })

        // Extraer número base y calcular siguiente (use dynamic year)
        const currentYear = new Date().getFullYear()
        const numeroActual = ultimoNumero?.numero || `OT-${currentYear}-000`
        const match = numeroActual.match(/OT-\d{4}-(\d+)/)
        const siguienteNumero = match ? parseInt(match[1]) + 1 : 1
        const nuevoNumero = `OT-${currentYear}-${String(siguienteNumero).padStart(3, '0')}`

        // Crear OT de re-trabajo con prioridad ALTA
        const reworkOrder = await tx.workOrder.create({
          data: {
            numero: nuevoNumero,
            tipo: 'CORRECTIVO', // Re-trabajo es siempre correctivo
            estado: 'ASIGNADA', // Re-trabajo empieza directamente en ASIGNADA
            prioridad: 'ALTA', // Re-trabajo tiene prioridad ALTA
            descripcion: `[RE-TRABAJO] ${validated.comentario || 'Reparación no funcionó. Revisar y corregir.'}`,
            equipo_id: workOrder.equipo_id,
            parent_work_order_id: workOrder.id, // Vincular con OT original
            failure_report_id: workOrder.failure_report_id // Mantener vinculación con avería original
          }
        })

        // Copiar asignaciones de la OT original a la OT de re-trabajo
        await tx.workOrderAssignment.createMany({
          data: workOrder.assignments.map((assignment) => ({
            work_order_id: reworkOrder.id,
            userId: assignment.userId,
            role: assignment.role
          }))
        })

        // Marcar la OT original con verificacion_at (aunque fue negativa)
        await tx.workOrder.update({
          where: { id: validated.workOrderId },
          data: {
            verificacion_at: new Date()
          }
        })

        // Registrar auditoría
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'work_order_rework_created',
            targetId: reworkOrder.id,
            metadata: {
              otNumero: reworkOrder.numero,
              parentOtNumero: workOrder.numero,
              funciona: false,
              comentario: validated.comentario
            }
          }
        })

        // Emit eventos SSE
        BroadcastManager.broadcast('work-orders', {
          name: 'work_order_updated',
          data: {
            workOrderId: workOrder.id,
            otNumero: workOrder.numero,
            estado: workOrder.estado,
            updatedAt: new Date().toISOString()
          },
          id: crypto.randomUUID()
        })

        BroadcastManager.broadcast('work-orders', {
          name: 'technician_assigned',
          data: {
            otNumero: reworkOrder.numero,
            otId: reworkOrder.id,
            tecnicoId: workOrder.assignments[0]?.userId || '',
            tecnicoNombre: workOrder.assignments[0]?.user?.name || '',
            assignedAt: new Date().toISOString(),
            estado: reworkOrder.estado
          },
          id: crypto.randomUUID()
        })

        perf.end(1000)

        return {
          success: true,
          workOrder: reworkOrder,
          message: `La reparación no funcionó. Se ha creado OT de re-trabajo ${reworkOrder.numero} con prioridad ALTA.`
        }
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Datos inválidos')
    }
    throw error
  }
}
