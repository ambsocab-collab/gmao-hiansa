'use client'

/**
 * Create Tag Form Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Form for creating classification tags
 * - WCAG AA compliant color presets
 * - Validates max 20 tags constraint
 * - data-testid="crear-etiqueta-form"
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTag } from '@/app/actions/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// WCAG AA compliant color presets (contrast ratio >= 4.5:1)
const WCAG_COLORS = [
  { value: '#EF4444', label: 'Rojo', bg: 'bg-red-500' },
  { value: '#F97316', label: 'Naranja', bg: 'bg-orange-500' },
  { value: '#EAB308', label: 'Amarillo', bg: 'bg-yellow-500' },
  { value: '#22C55E', label: 'Verde', bg: 'bg-green-500' },
  { value: '#3B82F6', label: 'Azul', bg: 'bg-blue-500' },
  { value: '#8B5CF6', label: 'Violeta', bg: 'bg-violet-500' },
  { value: '#EC4899', label: 'Rosa', bg: 'bg-pink-500' },
  { value: '#6B7280', label: 'Gris', bg: 'bg-gray-500' },
]

interface CreateTagFormProps {
  canCreateMore: boolean
}

export default function CreateTagForm({ canCreateMore }: CreateTagFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3B82F6') // Default to blue
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!name.trim()) {
      setError('El nombre de la etiqueta es requerido')
      return
    }

    if (!canCreateMore) {
      setError('Has alcanzado el máximo de 20 etiquetas personalizadas')
      return
    }

    setIsLoading(true)

    try {
      const result = await createTag({
        name: name.trim(),
        color,
        description: description.trim() || undefined,
      })

      if (result.success) {
        // Reset form
        setName('')
        setColor('#3B82F6')
        setDescription('')
        // Refresh page to show new tag in list
        router.refresh()
      } else {
        setError(result.message || 'Error al crear etiqueta')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear etiqueta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Crear Nueva Etiqueta
      </h2>

      <form onSubmit={handleSubmit} data-testid="crear-etiqueta-form">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="etiqueta-nombre" className="block text-sm font-medium text-gray-700">
            Nombre <span className="text-red-500">*</span>
          </label>
          <Input
            id="etiqueta-nombre"
            type="text"
            data-testid="etiqueta-nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Operario, Técnico, Supervisor"
            disabled={!canCreateMore || isLoading}
            maxLength={50}
            className="mt-1"
          />
        </div>

        {/* Color */}
        <div className="mb-4">
          <label htmlFor="etiqueta-color" className="block text-sm font-medium text-gray-700">
            Color <span className="text-red-500">*</span>
          </label>
          <Select
            value={color}
            onValueChange={setColor}
            disabled={!canCreateMore || isLoading}
          >
            <SelectTrigger className="mt-1" data-testid="etiqueta-color">
              <SelectValue placeholder="Selecciona un color" />
            </SelectTrigger>
            <SelectContent>
              {WCAG_COLORS.map((wcagColor) => (
                <SelectItem key={wcagColor.value} value={wcagColor.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${wcagColor.bg}`}
                      style={{ backgroundColor: wcagColor.value }}
                    />
                    {wcagColor.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label htmlFor="etiqueta-descripcion" className="block text-sm font-medium text-gray-700">
            Descripción (opcional)
          </label>
          <textarea
            id="etiqueta-descripcion"
            data-testid="etiqueta-descripcion"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Describe el propósito de esta etiqueta"
            disabled={!canCreateMore || isLoading}
            maxLength={200}
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canCreateMore || isLoading}
          className="w-full"
        >
          {isLoading ? 'Creando...' : 'Crear Etiqueta'}
        </Button>

        {/* Preview */}
        {name && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {name}
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
