/**
 * Image Upload Utility - Vercel Blob Storage
 *
 * Handles image upload to Vercel Blob Storage with validation.
 * Used for uploading failure report photos.
 *
 * Story 2.2: Client-side upload using upload() API
 */

import { upload } from '@vercel/blob/client'
import { logger } from '@/lib/observability/logger'

export interface UploadImageOptions {
  maxSize?: number // Maximum file size in bytes (default: 5MB)
  allowedTypes?: string[] // Allowed MIME types (default: image/jpeg, image/png)
}

export interface UploadImageResult {
  url: string
  filename: string
  size: number
  contentType: string
}

/**
 * Upload an image to Vercel Blob Storage
 *
 * @param file - File object to upload
 * @param options - Upload options (maxSize, allowedTypes)
 * @returns Promise<UploadImageResult> with URL and metadata
 * @throws Error if validation fails or upload fails
 */
export async function uploadImageToBlob(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadImageResult> {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png'],
  } = options

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(
      `La foto no puede superar ${Math.round(maxSize / 1024 / 1024)}MB`
    )
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Solo se permiten archivos de imagen: ${allowedTypes.join(', ')}`
    )
  }

  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `averias/${timestamp}-${ext}`

    // Upload to Vercel Blob Storage using client-side upload
    const blob = await upload(filename, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    })

    logger.info(undefined, 'image_upload_success', `upload-${timestamp}`, {
      filename: blob.url,
      size: file.size,
      contentType: file.type,
    })

    return {
      url: blob.url,
      filename,
      size: file.size,
      contentType: file.type,
    }
  } catch (error) {
    logger.error(
      error instanceof Error ? error : new Error('Unknown upload error'),
      'image_upload_failed',
      `upload-${Date.now()}`
    )
    throw new Error('Error al subir la foto. Por favor, intenta de nuevo.')
  }
}
