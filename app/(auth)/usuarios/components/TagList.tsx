'use client'

/**
 * Tag List Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Displays all tags with user count and delete button
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTag } from '@/app/actions/tags'
import { Button } from '@/components/ui/button'

interface Tag {
  id: string
  name: string
  color: string
  description?: string | null
  _count?: {
    userTags: number
  }
}

interface TagListProps {
  tags: Tag[]
}

export function TagList({ tags }: TagListProps) {
  const router = useRouter()
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null)

  const handleDelete = async (tagId: string, tagName: string) => {
    // Simple confirmation dialog (no AlertDialog component)
    if (!confirm(`¿Estás seguro de que quieres eliminar la etiqueta "${tagName}"?`)) {
      return
    }

    setDeletingTagId(tagId)

    try {
      const result = await deleteTag(tagId)

      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || 'Error al eliminar etiqueta')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al eliminar etiqueta')
    } finally {
      setDeletingTagId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            {/* Color Badge */}
            <div className="flex items-center space-x-3">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{
                  backgroundColor: tag.color,
                }}
              >
                {tag.name}
              </span>
              {tag.description && (
                <span className="text-sm text-gray-500">
                  {tag.description}
                </span>
              )}
            </div>
          </div>

          {/* User Count */}
          <div className="mb-3">
            <span className="text-sm text-gray-600">
              {tag._count?.userTags || 0} {tag._count?.userTags === 1 ? 'usuario' : 'usuarios'}
            </span>
          </div>

          {/* Delete Button */}
          <Button
            onClick={() => handleDelete(tag.id, tag.name)}
            disabled={deletingTagId === tag.id}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            {deletingTagId === tag.id ? 'Eliminando...' : 'Eliminar'}
          </Button>

          {/* Warning if tag has users */}
          {(tag._count?.userTags || 0) > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              No puedes eliminar etiquetas con usuarios asignados
            </p>
          )}
        </div>
      ))}

      {tags.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 012.828 0l7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay etiquetas creadas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Crea tu primera etiqueta para organizar los usuarios.
          </p>
        </div>
      )}
    </div>
  )
}
