'use client'

/**
 * RepuestoSelect - Dropdown para agregar repuestos usados
 *
 * Story 3.2: Gestión de OTs Asignadas
 * AC4: Agregar repuestos con validación de stock
 *
 * Muestra:
 * - Dropdown de repuestos
 * - Stock actual
 * - Ubicación física
 * - Input de cantidad
 * - Validación: cantidad <= stock
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { addUsedRepuesto } from '@/app/actions/my-work-orders'
import { InsufficientStockError } from '@/lib/utils/errors'

interface Repuesto {
  id: string
  name: string
  code: string
  stock: number
  ubicacion_fisica?: string
}

interface RepuestoSelectProps {
  workOrderId: string
  repuestos: Repuesto[]
  onRepuestoAdded?: () => void
}

/**
 * RepuestoSelect Component
 *
 * - Select dropdown de repuestos
 * - Input numérico para cantidad
 * - Validación visual de stock
 * - Error handling para stock insuficiente
 */
export function RepuestoSelect({ workOrderId, repuestos, onRepuestoAdded }: RepuestoSelectProps) {
  const [selectedRepuestoId, setSelectedRepuestoId] = useState<string>('')
  const [cantidad, setCantidad] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Repuesto seleccionado
  const selectedRepuesto = repuestos.find(r => r.id === selectedRepuestoId)

  /**
   * Validar stock suficiente
   */
  const isValidCantidad = selectedRepuesto && cantidad <= selectedRepuesto.stock
  const isStockInsufficient = selectedRepuesto && cantidad > selectedRepuesto.stock

  /**
   * Maneja submit del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRepuestoId) {
      toast.error('Selecciona un repuesto')
      return
    }

    if (!isValidCantidad) {
      toast.error('Cantidad excede stock disponible')
      return
    }

    setIsSubmitting(true)
    try {
      await addUsedRepuesto(workOrderId, selectedRepuestoId, cantidad)
      toast.success(`Repuesto agregado: ${selectedRepuesto?.name} x${cantidad}`)

      // Reset form
      setSelectedRepuestoId('')
      setCantidad(1)

      // Callback para refrescar datos
      onRepuestoAdded?.()
    } catch (error) {
      // Manejo específico de InsufficientStockError
      if (error instanceof Error && error.name === 'InsufficientStockError') {
        toast.error(error.message)
      } else {
        toast.error(error instanceof Error ? error.message : 'Error al agregar repuesto')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Filtrar repuestos con stock disponible
   */
  const repuestosDisponibles = repuestos.filter(r => r.stock > 0)

  if (repuestosDisponibles.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900 rounded">
        No hay repuestos disponibles con stock
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Select de repuestos */}
      <div>
        <label
          htmlFor="repuesto-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Repuesto
        </label>
        <select
          id="repuesto-select"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
          value={selectedRepuestoId}
          onChange={(e) => setSelectedRepuestoId(e.target.value)}
          data-testid="repuesto-select"
          disabled={isSubmitting}
        >
          <option value="">Seleccionar repuesto...</option>
          {repuestosDisponibles.map((repuesto) => (
            <option
              key={repuesto.id}
              value={repuesto.id}
              data-testid={`repuesto-option-${repuesto.id}`}
            >
              {repuesto.code} - {repuesto.name} (Stock: {repuesto.stock})
            </option>
          ))}
        </select>
      </div>

      {/* Info de repuesto seleccionado */}
      {selectedRepuesto && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Nombre: </span>
              <span
                className="text-gray-900 dark:text-gray-100 font-medium"
                data-testid="repuesto-nombre"
              >
                {selectedRepuesto.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Stock: </span>
              <span
                className="text-gray-900 dark:text-gray-100 font-medium"
                data-testid="repuesto-stock"
              >
                {selectedRepuesto.stock} unidades
              </span>
            </div>
            {selectedRepuesto.ubicacion_fisica && (
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Ubicación: </span>
                <span
                  className="text-gray-900 dark:text-gray-100"
                  data-testid="repuesto-ubicacion"
                >
                  {selectedRepuesto.ubicacion_fisica}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input de cantidad */}
      <div>
        <label
          htmlFor="cantidad-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Cantidad
        </label>
        <input
          id="cantidad-input"
          type="number"
          min="1"
          max={selectedRepuesto?.stock || 1}
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
          data-testid="repuesto-cantidad-input"
          disabled={isSubmitting || !selectedRepuesto}
        />
      </div>

      {/* Validación de stock */}
      {isStockInsufficient && (
        <div
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded"
          data-testid="repuesto-error-message"
        >
          Stock insuficiente. Stock actual: {selectedRepuesto.stock}, solicitado: {cantidad}
        </div>
      )}

      {/* Botón agregar */}
      <Button
        type="submit"
        disabled={!selectedRepuesto || isSubmitting || !isValidCantidad}
        className="w-full"
        data-testid="agregar-repuesto-btn"
      >
        {isSubmitting ? 'Agregando...' : 'Agregar Repuesto'}
      </Button>
    </form>
  )
}
