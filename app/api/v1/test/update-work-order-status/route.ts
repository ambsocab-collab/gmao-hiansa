/**
 * Test Endpoint: Update Work Order Status
 *
 * E2E Testing helper for Story 3.1 AC3: Drag & Drop
 * Simulates the Server Action that updates work order status
 *
 * ONLY for testing - protected by x-playwright-test header
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { WorkOrderEstado } from '@prisma/client'
import { broadcastWorkOrderUpdated } from '@/lib/sse/broadcaster'

export async function POST(request: NextRequest) {
  // Security check - only allow from Playwright tests
  const playwrightTest = request.headers.get('x-playwright-test')
  if (playwrightTest !== '1') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'This endpoint is only for E2E testing' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { workOrderId, nuevoEstado } = body

    if (!workOrderId || !nuevoEstado) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'workOrderId and nuevoEstado are required' },
        { status: 400 }
      )
    }

    // Validate nuevoEstado is a valid WorkOrderEstado
    if (!Object.values(WorkOrderEstado).includes(nuevoEstado)) {
      return NextResponse.json(
        { error: 'Bad Request', message: `Invalid estado: ${nuevoEstado}` },
        { status: 400 }
      )
    }

    // Fetch OT actual
    const workOrder = await prisma.workOrder.findUnique({
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
      return NextResponse.json(
        { error: 'Not Found', message: 'Work order not found' },
        { status: 404 }
      )
    }

    // Get admin user for audit log
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@hiansa.com' }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Admin user not found' },
        { status: 500 }
      )
    }

    // Actualizar estado
    const updated = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: { estado: nuevoEstado }
    })

    // Registrar auditoría
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: 'work_order_status_updated',
        targetId: workOrderId,
        metadata: {
          estadoAnterior: workOrder.estado,
          estadoNuevo: nuevoEstado,
          workOrderNumero: workOrder.numero
        }
      }
    })

    // Broadcast SSE event
    await broadcastWorkOrderUpdated({
      id: updated.id,
      numero: updated.numero,
      estado: updated.estado,
      updatedAt: updated.updated_at
    })

    return NextResponse.json({
      success: true,
      workOrderId,
      nuevoEstado,
      estadoAnterior: workOrder.estado
    })
  } catch (error) {
    console.error('[Test API] Error updating work order status:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
