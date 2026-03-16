'use client'

/**
 * EquipoSearch Component
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Client Component for predictive equipment search
 * Features:
 * - Debouncing (300ms) to avoid server overload
 * - Shows full hierarchy: División → Planta → Linea → Equipo
 * - Division tags with colors: HiRock (#FFD700), Ultra (#8FBC8F)
 * - Red border (#7D1220) on results
 * - Mobile-optimized: 44px height input
 * - Accessibility: ARIA roles, keyboard navigation, screen reader support
 *
 * @param onEquipoSelect - Callback when equipo is selected
 */

import { useState, useEffect, useCallback } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { searchEquipos } from '@/app/actions/equipos'
import { cn } from '@/lib/utils'

// Tipo para equipo con jerarquía completa
export interface EquipoWithHierarchy {
  id: string
  name: string
  code: string
  linea: {
    name: string
    planta: {
      name: string
      division: 'HIROCK' | 'ULTRA'
    }
  }
}

interface EquipoSearchProps {
  onEquipoSelect?: (equipo: EquipoWithHierarchy) => void
  value?: EquipoWithHierarchy | null
  onChange?: (equipo: EquipoWithHierarchy | null) => void
  disabled?: boolean
}

/**
 * useDebounce hook - Delays updating value until after delay milliseconds
 * Used to prevent excessive server calls during typing
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function EquipoSearch({ onEquipoSelect, value, onChange, disabled = false }: EquipoSearchProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<EquipoWithHierarchy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query with 300ms delay (story requirement)
  const debouncedSearch = useDebounce(search, 300)

  /**
   * Fetch equipos when debounced search changes
   * Only searches with 3+ characters (validated in Server Action)
   */
  useEffect(() => {
    const fetchEquipos = async () => {
      // Clear previous errors when starting a new search
      if (error) setError(null)

      if (debouncedSearch.length >= 3) {
        setIsLoading(true)
        try {
          const equipos = await searchEquipos(debouncedSearch)
          setResults(equipos)
        } catch (error) {
          // Show user-friendly error message instead of console.error
          setError('Error al buscar equipos. Por favor intenta nuevamente.')
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }

    fetchEquipos()
  }, [debouncedSearch, error])

  /**
   * Handle equipo selection
   * Updates input, closes popover, and calls callbacks
   */
  const handleSelect = useCallback(
    (equipo: EquipoWithHierarchy) => {
      setSearch(equipo.name)
      onEquipoSelect?.(equipo)
      onChange?.(equipo)
      // Clear any errors when selection is made
      if (error) setError(null)
    },
    [onEquipoSelect, onChange, error]
  )

  /**
   * Clear selection
   * Resets search and equipo value
   */
  const handleClear = useCallback(() => {
    setSearch('')
    setResults([])
    onEquipoSelect?.(null as unknown as EquipoWithHierarchy)
    onChange?.(null)
    // Clear errors when clearing selection
    if (error) setError(null)
  }, [onEquipoSelect, onChange, error])

  // Determine which value to display in input
  const displayValue = value?.name || search

  // Validation state for query length
  const isQueryTooShort = search.length > 0 && search.length < 3

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative flex items-center w-full',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Command
          className="w-full"
          shouldFilter={false} // Disable client-side filtering, use Server Action
        >
          <CommandInput
            value={displayValue}
            onValueChange={setSearch}
            placeholder="Buscar equipo..."
            data-testid="equipo-search"
            className="h-11" // 44px height for mobile (Apple HIG minimum touch target)
            disabled={disabled}
            aria-label="Buscar equipo por nombre"
            aria-describedby="equipo-search-description"
            aria-invalid={isQueryTooShort || error !== null}
          />

          {/* Results dropdown - shown when searching or has results */}
          <div className="relative z-50 bg-popover border rounded-md shadow-lg mt-1">
            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {/* Loading state */}
            {isLoading && debouncedSearch.length >= 3 && (
              <div className="py-6 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
                Buscando equipos...
              </div>
            )}

            {/* Error state - user feedback instead of console.error */}
            {error && (
              <div
                className="py-6 px-4 text-center text-sm text-red-600 bg-red-50"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Empty state when no results */}
            {!isLoading && !error && debouncedSearch.length >= 3 && results.length === 0 && (
              <CommandEmpty>
                No se encontraron equipos. Intenta con otra búsqueda.
              </CommandEmpty>
            )}

            {/* Search results */}
            {!isLoading && !error && results.length > 0 && (
              <CommandGroup role="listbox" aria-label="Resultados de búsqueda de equipos">
                {results.map((equipo) => (
                  <CommandItem
                    key={equipo.id}
                    value={equipo.name}
                    onSelect={() => handleSelect(equipo)}
                    className="border-l-4 border-l-[#7D1220]" // Borde izquierdo rojo burdeos Hiansa
                    role="option"
                    aria-selected={value?.id === equipo.id}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      {/* Main equipo info with division tag */}
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{equipo.name}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium text-foreground"
                          style={{
                            backgroundColor: equipo.linea.planta.division === 'HIROCK' ? '#FFD700' : '#8FBC8F'
                          }}
                          data-testid={`division-tag-${equipo.linea.planta.division.toLowerCase()}`}
                        >
                          {equipo.linea.planta.division}
                        </span>
                      </div>

                      {/* Hierarchy: División → Planta → Linea → Equipo */}
                      <p className="text-sm text-muted-foreground">
                        {equipo.linea.planta.division} → {equipo.linea.planta.name} →{' '}
                        {equipo.linea.name} → {equipo.name}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Prompt to search when query is too short - with visual feedback */}
            {debouncedSearch.length > 0 && debouncedSearch.length < 3 && (
              <div
                className="py-6 px-4 text-center text-sm text-muted-foreground bg-amber-50 border border-amber-200"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Ingresa al menos 3 caracteres para buscar</span>
                </div>
                <p className="text-xs mt-1 text-amber-700">
                  {search.length === 1 ? 'Faltan 2 caracteres' : 'Falta 1 carácter'}
                </p>
              </div>
            )}
            </CommandList>
          </div>

        {/* Clear button (x) when value is selected */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 z-10"
            onClick={handleClear}
            data-testid="clear-equipo-button"
            aria-label="Limpiar selección de equipo"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Selected equipo badge */}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background text-sm"
            data-testid="selected-equipo-badge"
            role="status"
            aria-live="polite"
          >
            <span className="font-medium">{value.name}</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium text-foreground"
              style={{
                backgroundColor: value.linea.planta.division === 'HIROCK' ? '#FFD700' : '#8FBC8F'
              }}
              data-testid={`division-tag-${value.linea.planta.division.toLowerCase()}`}
            >
              {value.linea.planta.division}
            </span>
            <span className="text-muted-foreground text-xs">
              {value.linea.planta.division} → {value.linea.planta.name} → {value.linea.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-auto"
              onClick={handleClear}
              aria-label="Limpiar selección de equipo"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Helper text for accessibility */}
      <p id="equipo-search-description" className="text-xs text-muted-foreground sr-only">
        Busca equipos por nombre. Mínimo 3 caracteres. Usa las flechas para navegar, Enter para seleccionar.
      </p>
    </div>
  )
}
