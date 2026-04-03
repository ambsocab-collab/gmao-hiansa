'use client'

/**
 * FilterBar Component
 * Story 3.4 AC2: Filtros por 5 criterios
 *
 * Filtros disponibles:
 * - Estado: dropdown con 8 estados
 * - Técnico: búsqueda with combobox
    - Fecha: range picker (inicio, fin)
    - Tipo: Preventivo/Correctivo
 * - Equipo: search with combobox
 *
 * All filters use URL params for sharing URL
 */

import { useCallback, useMemo, useState } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { WorkOrderEstado, WorkOrderTipo } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Estados disponibles para el filtro
const ESTADOS_OPTIONS: { value: WorkOrderEstado; label: string }[] = [
  { value: WorkOrderEstado.PENDIENTE, label: 'Pendiente' },
  { value: WorkOrderEstado.ASIGNADA, label: 'Asignada' },
  { value: WorkOrderEstado.EN_PROGRESO, label: 'En Progreso' },
  { value: WorkOrderEstado.PENDIENTE_PARADA, label: 'Pendiente Parada' },
  { value: WorkOrderEstado.PENDIENTE_REPUESTO, label: 'Pendiente Repuesto' },
  { value: WorkOrderEstado.REPARACION_EXTERNA, label: 'Reparación Externa' },
  { value: WorkOrderEstado.COMPLETADA, label: 'Completada' },
  { value: WorkOrderEstado.DESCARTADA, label: 'Descartada' },
]

// Tipos disponibles
const TIPOS_OPTIONS: { value: WorkOrderTipo; label: string }[] = [
  { value: WorkOrderTipo.PREVENTIVO, label: 'Preventivo' },
  { value: WorkOrderTipo.CORRECTIVO, label: 'Correctivo' },
]

interface FilterBarProps {
  tecnicoOptions?: { id: string; name: string }[]
  equipoOptions?: { id: string; name: string }[]
}

export function FilterBar({ tecnicoOptions = [], equipoOptions = [] }: FilterBarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state for comboboxes
  const [tecnicoOpen, setTecnicoOpen] = useState(false)
  const [equipoOpen, setEquipoOpen] = useState(false)
  const [tecnicoSearch, setTecnicoSearch] = useState('')
  const [equipoSearch, setEquipoSearch] = useState('')

  // Get current filter values directly from searchParams (reactive)
  const estadoFilter = searchParams.get('estado') || ''
  const tecnicoFilter = searchParams.get('tecnico') || ''
  const fechaInicioFilter = searchParams.get('fechaInicio') || ''
  const fechaFinFilter = searchParams.get('fechaFin') || ''
  const tipoFilter = searchParams.get('tipo') || ''
  const equipoFilter = searchParams.get('equipo') || ''

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (estadoFilter) count++
    if (tecnicoFilter) count++
    if (fechaInicioFilter || fechaFinFilter) count++
    if (tipoFilter) count++
    if (equipoFilter) count++
    return count
  }, [estadoFilter, tecnicoFilter, fechaInicioFilter, fechaFinFilter, tipoFilter, equipoFilter])
  // Update URL with new filter params - use window.location for reliable navigation
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    // Reset to page 1 when filters change
    newParams.delete('page')
    // Navigate using window.location for reliable URL update
    const newUrl = `${pathname}?${newParams.toString()}`
    window.location.href = newUrl
  }, [searchParams, pathname])
  // Clear all filters
  const clearFilters = useCallback(() => {
    const newParams = new URLSearchParams()
    // Preserve sorting params
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy) newParams.set('sortBy', sortBy)
    if (sortOrder) newParams.set('sortOrder', sortOrder)
    // Navigate using window.location for reliable URL update
    const newUrl = `${pathname}?${newParams.toString()}`
    window.location.href = newUrl
  }, [searchParams, pathname])
  // Filter tecnico options by search
  const filteredTecnicos = useMemo(() => {
    if (!tecnicoSearch) return tecnicoOptions
    return tecnicoOptions.filter(t =>
      t.name.toLowerCase().includes(tecnicoSearch.toLowerCase())
    )
  }, [tecnicoOptions, tecnicoSearch])
  // Filter equipo options by search
  const filteredEquipos = useMemo(() => {
    if (!equipoSearch) return equipoOptions
    return equipoOptions.filter(e =>
      e.name.toLowerCase().includes(equipoSearch.toLowerCase())
    )
  }, [equipoOptions, equipoSearch])
  // Get selected tecnico name
  const selectedTecnico = useMemo(() => {
    return tecnicoOptions.find(t => t.id === tecnicoFilter)?.name || ''
  }, [tecnicoOptions, tecnicoFilter])
  // Get selected equipo name
  const selectedEquipo = useMemo(() => {
    return equipoOptions.find(e => e.id === equipoFilter)?.name || ''
  }, [equipoOptions, equipoFilter])
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3" data-testid="filter-bar">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtro Estado */}
        <Select
          value={estadoFilter}
          onValueChange={(value) => {
            const finalValue = value === 'all' ? null : value || null
            updateFilters({ estado: finalValue })
          }}
        >
          <SelectTrigger
            className="w-[160px] h-9"
            data-testid="filtro-estado"
          >
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {ESTADOS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                data-testid={`estado-option-${option.value}`}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro Técnico */}
        <Popover open={tecnicoOpen} onOpenChange={setTecnicoOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] h-9 justify-between font-normal",
                !tecnicoFilter && "text-muted-foreground"
              )}
              data-testid="filtro-tecnico"
            >
              {tecnicoFilter ? (
                <span className="truncate">{selectedTecnico || tecnicoFilter}</span>
              ) : (
                "Técnico"
              )}
              <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <Input
                placeholder="Buscar técnico..."
                value={tecnicoSearch}
                onChange={(e) => setTecnicoSearch(e.target.value)}
                className="w-full h-9 mb-2"
                autoFocus
              />
              {filteredTecnicos.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No hay técnicos disponibles
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredTecnicos.map((tecnico) => (
                    <div
                      key={tecnico.id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        updateFilters({ tecnico: tecnico.id })
                        setTecnicoOpen(false)
                        setTecnicoSearch('')
                      }}
                      data-testid={`tecnico-option-${tecnico.id}`}
                    >
                      {tecnico.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Filtro Fecha Inicio */}
        <Input
          type="date"
          className="w-[150px] h-9"
          placeholder="Fecha inicio"
          value={fechaInicioFilter}
          onChange={(e) => updateFilters({ fechaInicio: e.target.value || null })}
          data-testid="filtro-fecha-inicio"
        />

        {/* Filtro Fecha Fin */}
        <Input
          type="date"
          className="w-[150px] h-9"
          placeholder="Fecha fin"
          value={fechaFinFilter}
          onChange={(e) => updateFilters({ fechaFin: e.target.value || null })}
          data-testid="filtro-fecha-fin"
        />

        {/* Filtro Tipo */}
        <Select
          value={tipoFilter}
          onValueChange={(value) => {
            const finalValue = value === 'all' ? null : value || null
            updateFilters({ tipo: finalValue })
          }}
        >
          <SelectTrigger
            className="w-[140px] h-9"
            data-testid="filtro-tipo"
          >
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {TIPOS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                data-testid={`tipo-option-${option.value}`}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro Equipo */}
        <Popover open={equipoOpen} onOpenChange={setEquipoOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] h-9 justify-between font-normal",
                !equipoFilter && "text-muted-foreground"
              )}
              data-testid="filtro-equipo"
            >
              {equipoFilter ? (
                <span className="truncate">{selectedEquipo || equipoFilter}</span>
              ) : (
                "Equipo"
              )}
              <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <Input
                placeholder="Buscar equipo..."
                value={equipoSearch}
                onChange={(e) => setEquipoSearch(e.target.value)}
                className="w-full h-9 mb-2"
                autoFocus
              />
              {filteredEquipos.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No hay equipos disponibles
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredEquipos.map((equipo) => (
                    <div
                      key={equipo.id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        updateFilters({ equipo: equipo.id })
                        setEquipoOpen(false)
                        setEquipoSearch('')
                      }}
                      data-testid={`equipo-option-${equipo.id}`}
                    >
                      {equipo.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters Badge */}
        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="h-6 px-2"
            data-testid="filtros-activos-badge"
          >
            {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
          </Badge>
        )}

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2"
            onClick={clearFilters}
            data-testid="btn-limpiar-filtros"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
