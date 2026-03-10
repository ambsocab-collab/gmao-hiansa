/**
 * Change Password API Route
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * POST /api/v1/users/change-password
 *
 * Changes user password after validating current password
 * Requires authentication
 */

import { changePassword } from '@/app/actions/users'
import { apiErrorHandler } from '@/lib/api/errorHandler'
import { logger } from '@/lib/observability/logger'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 'unknown'

  try {
    const body = await request.json()

    // Convert JSON body to FormData for Server Action
    const formData = new FormData()
    formData.append('currentPassword', body.currentPassword)
    formData.append('newPassword', body.newPassword)

    // Call Server Action
    const result = await changePassword(formData)

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error in change-password API route', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    // Use consistent error handler
    return apiErrorHandler(error, correlationId, 'POST /api/v1/users/change-password')
  }
}
