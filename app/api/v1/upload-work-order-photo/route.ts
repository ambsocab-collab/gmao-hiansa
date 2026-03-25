/**
 * Vercel Blob Upload API Route for Work Order Photos
 *
 * Server-side handler for uploading OT photos (antes/después).
 * Implements the handleUpload function to generate tokens and track uploads.
 *
 * Story 3.2: Gestión de OTs Asignadas
 * AC8: Fotos antes/después de reparación
 */

import { handleUpload } from '@vercel/blob/client'
import { logger } from '@/lib/observability/logger'

/**
 * POST /api/v1/upload-work-order-photo
 *
 * Handles client-side file uploads to Vercel Blob Storage for work order photos.
 * Generates client tokens and processes completed uploads.
 *
 * Validation:
 * - File type: image/jpeg, image/png
 * - File size: max 5MB
 * - Pathname: work-orders/antes or work-orders/despues
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()

    // Generate correlation ID for logging
    const correlationId = `wo-photo-upload-${Date.now()}`

    // Handle the upload using Vercel Blob's built-in handler
    const { searchParams } = new URL(request.url)

    // Get tipo from query params (antes | despues)
    const tipo = searchParams.get('tipo') || 'antes'
    const pathname = `work-orders/${tipo}`

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        // Validate file size and type before generating token
        return {
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB (AC8 requirement)
          allowedContentTypes: ['image/jpeg', 'image/png'],
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 days
          pathname
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Log successful upload
        logger.info(undefined, 'work_order_photo_upload_completed', correlationId, {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
          uploadedAt: new Date().toISOString(),
          tipo
        })
      },
    })

    return Response.json(jsonResponse)
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error('Work order photo upload failed'), 'work_order_photo_upload_error', 'upload-api')

    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
