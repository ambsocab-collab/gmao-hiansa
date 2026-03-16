'use client'

/**
 * Reporte Avería Form Component
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Client Component wrapper for the failure report form
 * Manages form state and equipo selection using React state (not DOM manipulation)
 */

import { useState } from 'react'
import { EquipoSearch, type EquipoWithHierarchy } from '@/components/equipos/equipo-search'

export function ReporteAveriaForm() {
  const [selectedEquipo, setSelectedEquipo] = useState<EquipoWithHierarchy | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  /**
   * Handle equipo selection
   * Updates React state directly (no DOM manipulation)
   */
  const handleEquipoSelect = (equipo: EquipoWithHierarchy | null) => {
    setSelectedEquipo(equipo)
    // Clear any previous submit errors when equipo changes
    if (equipo && submitError) {
      setSubmitError(null)
    }
  }

  /**
   * Handle form submission
   * Validates equipo is selected before allowing submit
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate equipo is selected (AC6 requirement)
    if (!selectedEquipo) {
      setSubmitError('Por favor selecciona un equipo antes de continuar')
      return
    }

    // Clear error and proceed with submission
    setSubmitError(null)

    // TODO: In Story 2.2, this will submit the form with all fields
    // For now, just log that equipo is validated
    console.log('Equipo validado:', {
      equipoId: selectedEquipo.id,
      equipoName: selectedEquipo.name,
      hierarchy: `${selectedEquipo.linea.planta.division} → ${selectedEquipo.linea.planta.name} → ${selectedEquipo.linea.name} → ${selectedEquipo.name}`,
    })

    // Placeholder for Story 2.2 submission logic
    alert('Formulario validado correctamente. Story 2.2 completará la funcionalidad de envío.')
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-base font-semibold text-gray-900">Nuevo Reporte de Avería</h1>
        <p className="text-xs text-gray-600 mt-1">
          Selecciona el equipo que tiene la falla para reportar la avería
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow p-4">
        <form id="averia-form" className="space-y-4" onSubmit={handleSubmit}>
          {/* Equipo Search - Story 2.1 */}
          <div className="space-y-2">
            <label htmlFor="equipo-search" className="block text-sm font-medium text-gray-700">
              Equipo *
            </label>
            <EquipoSearch
              value={selectedEquipo}
              onChange={handleEquipoSelect}
              data-testid="equipo-search-form"
            />
            <p className="text-xs text-gray-500">
              Busca el equipo por nombre. Selecciona de la lista para confirmar.
            </p>
          </div>

          {/* Validation Error Message */}
          {submitError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{submitError}</h3>
                </div>
              </div>
            </div>
          )}

          {/* NOTE: Additional form fields will be added in Story 2.2 */}
          {/* - Descripción de avería */}
          {/* - Severidad */}
          {/* - Fecha y hora */}
          {/* - Reporter */}
          {/* - Fotos adjuntas */}

          {/* Submit Button - Now enabled with validation */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#7D1220] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5a0e17] focus:outline-none focus:ring-2 focus:ring-[#7D1220] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-averia-button"
            >
              Validar Equipo
            </button>
            <p className="text-xs text-gray-500 mt-2">
              El formulario completo estará disponible en Story 2.2
            </p>
          </div>
        </form>
      </div>

      {/* Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Cómo usar:</h3>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Empieza a escribir el nombre del equipo (mínimo 3 caracteres)</li>
          <li>Selecciona el equipo de la lista desplegable</li>
          <li>Verifica que la jerarquía sea correcta (División → Planta → Línea → Equipo)</li>
          <li>El tag de división indica HiRock (dorado) o Ultra (verde)</li>
          <li>Puedes limpiar la selección haciendo clic en la X</li>
          <li>Haz clic en "Validar Equipo" para confirmar tu selección</li>
        </ol>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && selectedEquipo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Debug - Selected Equipo:</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto">
            {JSON.stringify(selectedEquipo, null, 2)}
          </pre>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Equipo ID:</strong> {selectedEquipo.id}
          </p>
        </div>
      )}
    </div>
  )
}
