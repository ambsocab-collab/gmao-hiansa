'use client'

/**
 * Edit Capabilities Client Component for User Detail Page
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Allows admins to edit user capabilities inline on the user detail page
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateUserCapabilities } from '@/app/actions/users'
import { CapabilityCheckboxGroup } from '@/components/users/CapabilityCheckboxGroup'

interface EditCapabilitiesClientProps {
  userId: string
  initialCapabilities: string[]
}

export function EditCapabilitiesClient({
  userId,
  initialCapabilities,
}: EditCapabilitiesClientProps) {
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(initialCapabilities)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSaveCapabilities = async () => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const result = await updateUserCapabilities(userId, selectedCapabilities)

      if (result.success) {
        setSuccess('Capacidades actualizadas exitosamente')
        setTimeout(() => {
          setSuccess('')
          // Optionally reload the page to show updated capabilities
          window.location.reload()
        }, 1500)
      } else {
        setError(result.message || 'Error al actualizar capacidades')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar capacidades')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Editar Capacidades
      </h3>

      <p className="text-sm text-gray-600">
        Selecciona las capacidades para este usuario. Las capacidades determinan
        qué acciones puede realizar el usuario en el sistema.
      </p>

      <CapabilityCheckboxGroup
        selectedCapabilities={selectedCapabilities}
        onChange={setSelectedCapabilities}
        disabled={isSaving}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Save Capabilities Button */}
      <Button
        onClick={handleSaveCapabilities}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? 'Guardando...' : 'Guardar Capacidades'}
      </Button>
    </div>
  )
}
