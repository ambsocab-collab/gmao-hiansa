'use client'

/**
 * Tag Multi-Select Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Multi-select component for assigning tags to users
 * - data-testid="tag-multiselect" for E2E testing
 * - Shows available tags as checkboxes
 * - Displays selected tags as colored badges
 */

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export interface Tag {
  id: string
  name: string
  color: string
  description?: string | null
}

interface TagMultiSelectProps {
  availableTags: Tag[]
  selectedTagIds: string[]
  onTagToggle: (tagId: string) => void
  disabled?: boolean
}

export default function TagMultiSelect({
  availableTags,
  selectedTagIds,
  onTagToggle,
  disabled = false,
}: TagMultiSelectProps) {
  return (
    <div className="space-y-4">
      {/* Clarifier Message */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Importante:</strong> Las etiquetas son solo para organización visual
              y no afectan los permisos. Los usuarios con la misma etiqueta pueden tener
              diferentes capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Available Tags */}
      {availableTags.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay etiquetas disponibles
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Crea etiquetas en la página de gestión de etiquetas.
          </p>
        </div>
      ) : (
        <div
          data-testid="tag-multiselect"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {availableTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)

            return (
              <div
                key={tag.id}
                className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  id={`tag-${tag.id}`}
                  data-testid={`tag-checkbox-${tag.name}`}
                  checked={isSelected}
                  onCheckedChange={() => onTagToggle(tag.id)}
                  disabled={disabled}
                />

                {/* Tag Color Badge (using span instead of Badge) */}
                <span
                  className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{
                    backgroundColor: tag.color,
                  }}
                >
                  {tag.name}
                </span>

                <Label
                  htmlFor={`tag-${tag.id}`}
                  className="flex-1 text-sm font-medium cursor-pointer"
                >
                  {tag.description || tag.name}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected Tags Summary */}
      {selectedTagIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            {selectedTagIds.length} {selectedTagIds.length === 1 ? 'etiqueta' : 'etiquetas'} seleccionada{selectedTagIds.length > 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter((tag) => selectedTagIds.includes(tag.id))
              .map((tag) => (
                <span
                  key={tag.id}
                  data-testid={`selected-tag-${tag.name}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{
                    backgroundColor: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
