'use client'

/**
 * Edit Tags Client Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Allows admins to assign/remove tags from users on the detail page
 *
 * FIXED: Now uses Server Action (assignTagsToUser) instead of API endpoint
 * - Ensures PBAC capability validation
 * - Maintains correlation ID tracking
 * - Follows project architecture pattern
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { assignTagsToUser } from '@/app/actions/tags'

interface Tag {
  id: string
  name: string
  color: string
  description?: string | null
}

interface EditTagsClientProps {
  userId: string
  availableTags: Tag[]
  initialTags: string[]
}

export function EditTagsClient({
  userId,
  availableTags,
  initialTags,
}: EditTagsClientProps) {
  const router = useRouter()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTags)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
    // Clear messages when user changes selection
    setError('')
    setSuccess(false)
  }

  const handleSaveTags = async () => {
    setIsSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Use Server Action instead of API endpoint for PBAC validation and correlation ID tracking
      const result = await assignTagsToUser(userId, selectedTagIds)

      if (result.success) {
        setSuccess(true)
        // Refresh router state to show updated tags after a short delay
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        setError(result.message || 'Error al guardar etiquetas')
      }
    } catch (err) {
      // Server Actions throw errors directly - handle them
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar etiquetas'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6" data-testid="edit-tags-client">
      <h3 className="text-lg font-semibold text-gray-900">
        Editar Etiquetas
      </h3>

      <p className="text-sm text-gray-600">
        Selecciona las etiquetas para este usuario. Las etiquetas son solo para
        organización visual y no afectan los permisos.
      </p>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-700">
            ✓ Etiquetas guardadas exitosamente. Recargando página...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {availableTags.map((tag) => (
          <label
            key={tag.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              data-testid={`tag-checkbox-${tag.name}`}
              checked={selectedTagIds.includes(tag.id)}
              onChange={() => handleTagToggle(tag.id)}
              disabled={isSaving}
              className="rounded w-5 h-5"
            />
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
            {tag.description && (
              <span className="text-sm text-gray-500 ml-2">
                {tag.description}
              </span>
            )}
          </label>
        ))}
      </div>

      <button
        onClick={handleSaveTags}
        disabled={isSaving}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        data-testid="save-tags-button"
      >
        {isSaving ? 'Guardando...' : 'Guardar Etiquetas'}
      </button>
    </div>
  )
}
