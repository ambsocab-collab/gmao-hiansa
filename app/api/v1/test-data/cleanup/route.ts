/**
 * Test Data Cleanup API
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Endpoint para limpiar datos de prueba en desarrollo
 * Solo disponible en ambiente de desarrollo
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * DELETE /api/v1/test-data/cleanup
 * Limpia todos los datos de prueba de la base de datos
 */
export async function DELETE(request: NextRequest) {
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

  try {
    const body = await request.json()
    const { entities = ['users', 'workOrders', 'activos'] } = body

    let deleted = {}

    // Cleanup work orders primero (por foreign keys)
    if (entities.includes('workOrders')) {
      const result = await prisma.workOrder.deleteMany({})
      deleted = { ...deleted, workOrders: result.count }
    }

    // Cleanup activos
    if (entities.includes('activos')) {
      // Borrar componentes, equipos, lineas, plantas en orden
      const componentes = await prisma.componente.deleteMany({})
      const equipos = await prisma.equipo.deleteMany({})
      const lineas = await prisma.linea.deleteMany({})
      const plantas = await prisma.planta.deleteMany({})

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
      const result = await prisma.user.deleteMany({})
      deleted = { ...deleted, users: result.count }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Test data cleaned up successfully',
      deleted,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error cleaning up test data:', error)
    return NextResponse.json(
      {
        error: {
          message: 'Failed to clean up test data',
          code: 'CLEANUP_ERROR'
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
