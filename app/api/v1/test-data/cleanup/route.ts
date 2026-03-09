/**
 * Test Data Cleanup API
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Endpoint para limpiar datos de prueba en desarrollo
 * Solo disponible en ambiente de desarrollo
 * Story 0.5: Added authentication, performance tracking and structured logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { logger } from '@/lib/observability/logger'
import { CORRELATION_ID_HEADER } from '@/middleware'
import { auth } from '@/lib/auth-adapter'

/**
 * DELETE /api/v1/test-data/cleanup
 * Limpia todos los datos de prueba de la base de datos
 * Story 0.5: Added authentication check, performance tracking and structured logging
 */
export async function DELETE(request: NextRequest) {
  // Get correlation ID from headers
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || crypto.randomUUID()

  // Verificar que estamos en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: {
          message: 'Test data cleanup is not available in production',
          code: 'FORBIDDEN'
        }
      },
      { status: 403 }
    )
  }

  // Story 0.5: Verify authentication
  const session = await auth()
  if (!session?.user) {
    logger.warn(undefined, 'test_data_cleanup_unauthorized', correlationId, {
      reason: 'No authenticated session'
    })

    return NextResponse.json(
      {
        error: {
          message: 'Authentication required for test data cleanup',
          code: 'UNAUTHORIZED',
          correlationId
        }
      },
      { status: 401 }
    )
  }

  // Story 0.5: Verify user has can_manage_users capability
  const userCapabilities = session.user.capabilities as string[] | undefined
  const hasManageUsersCapability = userCapabilities?.includes('can_manage_users') ?? false

  if (!hasManageUsersCapability) {
    logger.warn(session.user.id, 'test_data_cleanup_forbidden', correlationId, {
      reason: 'User lacks can_manage_users capability'
    })

    return NextResponse.json(
      {
        error: {
          message: 'No tienes permiso para limpiar datos de prueba',
          code: 'AUTHORIZATION_ERROR',
          correlationId
        }
      },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { entities = ['users', 'workOrders', 'activos'] } = body

    let deleted = {}

    // Story 0.5: Track performance for cleanup operations
    const cleanupPerf = trackPerformance('test_data_cleanup', correlationId)

    // Cleanup work orders primero (por foreign keys)
    if (entities.includes('workOrders')) {
      const perf = trackPerformance('delete_workOrders', correlationId)
      const result = await prisma.workOrder.deleteMany({})
      perf.end()
      deleted = { ...deleted, workOrders: result.count }
    }

    // Cleanup activos
    if (entities.includes('activos')) {
      // Borrar componentes, equipos, lineas, plantas en orden
      // Story 0.5: Order respects foreign key constraints (bottom-up hierarchy)
      const componentesPerf = trackPerformance('delete_componentes', correlationId)
      const componentes = await prisma.componente.deleteMany({})
      componentesPerf.end()

      const equiposPerf = trackPerformance('delete_equipos', correlationId)
      const equipos = await prisma.equipo.deleteMany({})
      equiposPerf.end()

      const lineasPerf = trackPerformance('delete_lineas', correlationId)
      const lineas = await prisma.linea.deleteMany({})
      lineasPerf.end()

      const plantasPerf = trackPerformance('delete_plantas', correlationId)
      const plantas = await prisma.planta.deleteMany({})
      plantasPerf.end()

      deleted = {
        ...deleted,
        activos: {
          componentes: componentes.count,
          equipos: equipos.count,
          lineas: lineas.count,
          plantas: plantas.count
        }
      }
    }

    // Cleanup usuarios
    if (entities.includes('users')) {
      const perf = trackPerformance('delete_users', correlationId)
      const result = await prisma.user.deleteMany({})
      perf.end()
      deleted = { ...deleted, users: result.count }
    }

    // End overall cleanup performance tracking
    cleanupPerf.end()

    logger.info(session.user.id, 'test_data_cleanup_success', correlationId, { deleted })

    return NextResponse.json({
      status: 'success',
      message: 'Test data cleaned up successfully',
      deleted,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // Story 0.5: Use structured logger instead of console.error
    logger.error(error as Error, 'test_data_cleanup_error', correlationId, session?.user?.id)

    return NextResponse.json(
      {
        error: {
          message: 'Failed to clean up test data',
          code: 'CLEANUP_ERROR',
          correlationId
        }
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/v1/test-data/cleanup
 * Retorna información sobre el endpoint de cleanup
 */
export async function GET() {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  return NextResponse.json({
    endpoint: '/api/v1/test-data/cleanup',
    method: 'DELETE',
    available: isDevelopment,
    description: 'Clean up test data from the database',
    body: {
      entities: {
        description: 'Array of entity types to clean up',
        options: ['users', 'workOrders', 'activos'],
        default: ['users', 'workOrders', 'activos']
      }
    },
    warning: 'This will permanently delete data. Use with caution.',
    example: {
      entities: ['users', 'workOrders']
    }
  })
}
