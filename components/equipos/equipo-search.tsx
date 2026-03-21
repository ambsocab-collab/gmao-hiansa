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
import { Command, CommandInput } from '@/components/ui/command'
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
  onEquipoSelect?: (equipo: EquipoWithHierarchy | null) => void
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
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

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
      setIsOpen(false) // Close dropdown after selection
      setFocusedIndex(-1) // Reset focused index
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
    setIsOpen(false) // Close dropdown when clearing
    onEquipoSelect?.(null)
    onChange?.(null)
    // Clear errors when clearing selection
    if (error) setError(null)
  }, [onEquipoSelect, onChange, error])

  // Determine which value to display in input
  const displayValue = value?.name || search

  // Validation state for query length
  const isQueryTooShort = search.length > 0 && search.length < 3

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        e.stopPropagation()
        setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        e.stopPropagation()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        e.stopPropagation()
        if (focusedIndex >= 0 && results[focusedIndex]) {
          handleSelect(results[focusedIndex])
          setFocusedIndex(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const searchContainer = target.closest('[data-equipo-search-container]')
      if (!searchContainer && isOpen) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Reset focused index when dropdown closes or results change
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  return (
    <div className="w-full" data-equipo-search-container>
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
            onValueChange={(val) => {
              setSearch(val)
              setFocusedIndex(-1) // Reset focused index when typing
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar equipo..."
            data-testid="equipo-search"
            className="h-11" // 44px height for mobile (Apple HIG minimum touch target)
            disabled={disabled}
            aria-label="Buscar equipo por nombre"
            aria-describedby="equipo-search-description"
            aria-invalid={isQueryTooShort || error !== null}
            aria-expanded={isOpen}
            aria-controls="equipo-listbox"
            aria-activedescendant={focusedIndex >= 0 ? `equipo-option-${focusedIndex}` : undefined}
          />
        </Command>

        {/* Results dropdown - outside Command for proper z-index stacking */}
        {isOpen && (
          <div className="absolute z-50 w-full bg-popover border rounded-md shadow-lg mt-1">
            <div id="equipo-listbox" role="listbox" className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
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
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No se encontraron equipos. Intenta con otra búsqueda.
                </div>
              )}

              {/* Search results */}
              {!isLoading && !error && results.length > 0 && (
                <div role="group" aria-label="Resultados de búsqueda de equipos">
                  {results.map((equipo, index) => (
                    <div
                      key={equipo.id}
                      id={`equipo-option-${index}`}
                      onClick={() => handleSelect(equipo)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none border-l-4 border-l-[#7D1220]",
                        focusedIndex === index ? "bg-gray-100" : "hover:bg-gray-100"
                      )}
                      role="option"
                      aria-selected={value?.id === equipo.id}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        {/* Main equipo info with division tag */}
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{equipo.name}</span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium text-foreground",
                              equipo.linea.planta.division === 'HIROCK'
                                ? "bg-[#FFD700]" // HiRock division color (gold)
                                : "bg-[#8FBC8F]"  // Ultra division color (dark sea green)
                            )}
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
                    </div>
                  ))}
                </div>
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
            </div>
          </div>
          )}

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
              className={cn(
                "px-2 py-0.5 rounded text-xs font-medium text-foreground",
                value.linea.planta.division === 'HIROCK'
                  ? "bg-[#FFD700]" // HiRock division color (gold)
                  : "bg-[#8FBC8F]"  // Ultra division color (dark sea green)
              )}
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
