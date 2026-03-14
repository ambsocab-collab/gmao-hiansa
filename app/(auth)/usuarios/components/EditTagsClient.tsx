'use client'

/**
 * Edit Tags Client Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Allows admins to assign/remove tags from users on the detail page
 */

import { useState } from 'react'

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
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTags)
  const [isSaving, setIsSaving] = useState(false)

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSaveTags = async () => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/v1/users/${userId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagIds: selectedTagIds }),
      })

      if (response.ok) {
        // Reload page to show updated tags
        // Use setTimeout to avoid interfering with ongoing operations
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        console.error('Failed to save tags:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving tags:', error)
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
