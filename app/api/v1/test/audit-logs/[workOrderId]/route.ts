/**
 * Test Endpoint: Get Audit Logs for Work Order
 *
 * E2E Testing helper for Story 3.1 AC3: Drag & Drop
 * Returns audit logs for a specific work order
 *
 * ONLY for testing - protected by x-playwright-test header
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { workOrderId: string } }
) {
  // Security check - only allow from Playwright tests
  const playwrightTest = request.headers.get('x-playwright-test')
  if (playwrightTest !== '1') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'This endpoint is only for E2E testing' },
      { status: 403 }
    )
  }

  try {
    const { workOrderId } = params

    if (!workOrderId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'workOrderId is required' },
        { status: 400 }
      )
    }

    // Fetch audit logs for this work order
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        targetId: workOrderId,
        action: 'work_order_status_updated'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10 // Last 10 logs
    })

    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error('[Test API] Error fetching audit logs:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
