'use client'

/**
 * TechnicianSelect Component
 * Story 3.3 AC1, AC2, AC6: Seleccionar técnicos con filtros
 *
 * Multi-select para técnicos con:
 * - Filtros por habilidades (checkboxes)
 * - Filtros por ubicación (dropdown)
 * - Indicador de sobrecarga (5+ OTs)
 * - data-testid para E2E testing
 */

import { useState, useEffect } from 'react'
import { Check, ChevronDown, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAvailableTechnicians, TechnicianWithWorkload } from '@/app/actions/assignments'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface TechnicianSelectProps {
  value: string[]
  onChange: (technicianIds: string[]) => void
  maxTechnicians?: number
  disabled?: boolean
  onWorkloadWarning?: (isOverloaded: boolean) => void
}

const SKILLS = [
  { id: 'eléctrica', label: 'Eléctrica' },
  { id: 'mecánica', label: 'Mecánica' },
  { id: 'hidráulica', label: 'Hidráulica' },
  { id: 'neumática', label: 'Neumática' },
  { id: 'electrónica', label: 'Electrónica' },
]

const UBICACIONES = [
  { id: 'Planta HiRock', label: 'Planta HiRock' },
  { id: 'Planta Ultra', label: 'Planta Ultra' },
  { id: 'Taller', label: 'Taller' },
  { id: 'Almacén', label: 'Almacén' },
]

export function TechnicianSelect({
  value,
  onChange,
  maxTechnicians = 3,
  disabled = false,
  onWorkloadWarning,
}: TechnicianSelectProps) {
  const [open, setOpen] = useState(false)
  const [technicians, setTechnicians] = useState<TechnicianWithWorkload[]>([])
  const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianWithWorkload[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedUbicacion, setSelectedUbicacion] = useState<string>('')

  // Load technicians
  useEffect(() => {
    async function loadTechnicians() {
      setLoading(true)
      try {
        const data = await getAvailableTechnicians()
        setTechnicians(data)
        setFilteredTechnicians(data)
      } catch (error) {
        console.error('Error loading technicians:', error)
        toast.error('Error al cargar técnicos')
      } finally {
        setLoading(false)
      }
    }

    // Only load when popover opens
    if (open && technicians.length === 0) {
      loadTechnicians()
    }
  }, [open, technicians.length])

  // Filter technicians
  useEffect(() => {
    let filtered = technicians

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(tech =>
        selectedSkills.some(skill => tech.skills.includes(skill))
      )
    }

    if (selectedUbicacion) {
      filtered = filtered.filter(tech => tech.ubicacion === selectedUbicacion)
    }

    setFilteredTechnicians(filtered)
  }, [technicians, selectedSkills, selectedUbicacion])

  const handleSelectTechnician = (technicianId: string) => {
    const isSelected = value.includes(technicianId)

    if (isSelected) {
      onChange(value.filter(id => id !== technicianId))
    } else {
      if (value.length >= maxTechnicians) {
        toast.error(`Máximo ${maxTechnicians} técnicos permitidos`)
        return
      }
      onChange([...value, technicianId])

      // Check for overload warning
      const tech = technicians.find(t => t.id === technicianId)
      if (tech?.isOverloaded && onWorkloadWarning) {
        onWorkloadWarning(true)
      }
    }
  }

  const handleRemoveTechnician = (technicianId: string) => {
    onChange(value.filter(id => id !== technicianId))
  }

  const handleSkillFilter = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill])
    } else {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    }
  }

  const handleUbicacionFilter = (ubicacion: string) => {
    setSelectedUbicacion(ubicacion === 'all' ? '' : ubicacion === selectedUbicacion ? '' : ubicacion)
  }

  const selectedTechnicians = technicians.filter(t => value.includes(t.id))
  const canSelectMore = value.length < maxTechnicians

  return (
    <div className="space-y-3">
      {/* Selected technicians badges */}
      {selectedTechnicians.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTechnicians.map((tech) => (
            <Badge
              key={tech.id}
              variant="secondary"
              className="flex items-center gap-1"
              data-testid="selected-tecnico-badge"
            >
              {tech.name}
              {tech.isOverloaded && (
                <AlertTriangle className="h-3 w-3 text-red-500" data-testid="sobrecarga-badge" />
              )}
              <button
                type="button"
                onClick={() => handleRemoveTechnician(tech.id)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                aria-label={`Eliminar ${tech.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Multi-select popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || !canSelectMore}
            className="w-full justify-between"
            data-testid="tecnicos-select"
          >
            {loading ? 'Cargando...' : 'Seleccionar técnicos...'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          {/* Filters */}
          <div className="border-b p-3 space-y-3">
            {/* Skills filters */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Filtrar por habilidades</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Label
                    key={skill.id}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={(checked) => handleSkillFilter(skill.id, checked as boolean)}
                      data-testid={`filtro-skills-checkbox-${skill.id}`}
                    />
                    <span className="text-xs">{skill.label}</span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Location filter */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Filtrar por ubicación</p>
              <Select value={selectedUbicacion || 'all'} onValueChange={handleUbicacionFilter}>
                <SelectTrigger
                  className="h-8 text-xs"
                  data-testid="filtro-ubicacion-select"
                >
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {UBICACIONES.map((ubicacion) => (
                    <SelectItem
                      key={ubicacion.id}
                      value={ubicacion.id}
                      data-testid={`ubicacion-option-${ubicacion.id.toLowerCase().replace(' ', '-')}`}
                    >
                      {ubicacion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Technicians list */}
          <ScrollArea className="h-60">
            {filteredTechnicians.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay técnicos disponibles con los filtros seleccionados
              </div>
            ) : (
              <div className="p-1">
                {filteredTechnicians.map((tech, index) => {
                  const isSelected = value.includes(tech.id)
                  const isDisabled = !isSelected && !canSelectMore

                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => handleSelectTechnician(tech.id)}
                      disabled={isDisabled}
                      className={cn(
                        'w-full flex items-start gap-2 p-2 rounded-md text-left transition-colors',
                        'hover:bg-accent',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                      data-testid={`tecnico-option-${index}`}
                    >
                      {/* Checkbox indicator */}
                      <div className={cn(
                        'mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary',
                        'flex items-center justify-center',
                        isSelected && 'bg-primary text-primary-foreground'
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>

                      {/* Technician info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className="text-sm font-medium truncate"
                            data-testid="tecnico-nombre"
                          >
                            {tech.name}
                          </p>
                          {tech.isOverloaded && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] px-1 py-0"
                              data-testid="sobrecarga-badge"
                            >
                              {tech.workload} OTs
                            </Badge>
                          )}
                        </div>

                        {/* Skills tags */}
                        {tech.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tech.skills.map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] px-1.5 py-0.5 bg-secondary rounded"
                                data-testid="tecnico-skill-tag"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Location tag */}
                        {tech.ubicacion && (
                          <span
                            className="text-[10px] text-muted-foreground mt-1 block"
                            data-testid="tecnico-ubicacion-tag"
                          >
                            {tech.ubicacion}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {value.length} de {maxTechnicians} técnicos seleccionados
      </p>
    </div>
  )
}
