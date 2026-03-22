/**
 * Vercel Blob Upload API Route
 *
 * Server-side handler for client-side uploads to Vercel Blob Storage.
 * Implements the handleUpload function to generate tokens and track uploads.
 *
 * Story 2.2: Formulario Reporte de Avería (Mobile First)
 */

import { handleUpload } from '@vercel/blob/client'
import { logger } from '@/lib/observability/logger'

/**
 * POST /api/upload
 *
 * Handles client-side file uploads to Vercel Blob Storage.
 * Generates client tokens and processes completed uploads.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()

    // Generate correlation ID for logging
    const correlationId = `upload-${Date.now()}`

    // Handle the upload using Vercel Blob's built-in handler
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get('pathname') || 'averias'

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        // Validate file size and type before generating token
        return {
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
          allowedContentTypes: ['image/jpeg', 'image/png'],
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 days
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Log successful upload
        logger.info(undefined, 'upload_completed', correlationId, {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
        })
      },
    })

    return Response.json(jsonResponse)
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error('Upload failed'), 'upload_error', 'upload-api')

    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
