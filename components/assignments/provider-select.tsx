'use client'

/**
 * ProviderSelect Component
 * Story 3.3 AC1: Seleccionar proveedor externo
 *
 * Select para proveedores externos con:
 * - Muestra servicios del proveedor
 * - data-testid para E2E testing
 */

import { useState, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAvailableProviders, ProviderInfo } from '@/app/actions/assignments'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface ProviderSelectProps {
  value: string | null
  onChange: (providerId: string | null) => void
  disabled?: boolean
}

export function ProviderSelect({
  value,
  onChange,
  disabled = false,
}: ProviderSelectProps) {
  const [open, setOpen] = useState(false)
  const [providers, setProviders] = useState<ProviderInfo[]>([])
  const [loading, setLoading] = useState(false)

  // Load providers
  useEffect(() => {
    async function loadProviders() {
      setLoading(true)
      try {
        const data = await getAvailableProviders()
        setProviders(data)
      } catch (error) {
        console.error('Error loading providers:', error)
        toast.error('Error al cargar proveedores')
      } finally {
        setLoading(false)
      }
    }

    // Only load when popover opens
    if (open && providers.length === 0) {
      loadProviders()
    }
  }, [open, providers.length])

  const handleSelectProvider = (providerId: string) => {
    if (value === providerId) {
      onChange(null)
    } else {
      onChange(providerId)
    }
    setOpen(false)
  }

  const selectedProvider = providers.find(p => p.id === value)

  return (
    <div className="space-y-3">
      {/* Selected provider badge */}
      {selectedProvider && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1"
            data-testid="selected-proveedor-badge"
          >
            {selectedProvider.name}
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-1 hover:bg-secondary rounded-full p-0.5"
              aria-label={`Eliminar ${selectedProvider.name}`}
            >
              <span className="text-xs">✕</span>
            </button>
          </Badge>
        </div>
      )}

      {/* Select popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
            data-testid="proveedores-select"
          >
            {loading ? 'Cargando...' : selectedProvider ? selectedProvider.name : 'Seleccionar proveedor...'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <ScrollArea className="h-60">
            {providers.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay proveedores disponibles
              </div>
            ) : (
              <div className="p-1">
                {providers.map((provider, index) => {
                  const isSelected = value === provider.id

                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => handleSelectProvider(provider.id)}
                      className={cn(
                        'w-full flex items-start gap-2 p-2 rounded-md text-left transition-colors',
                        'hover:bg-accent'
                      )}
                      data-testid={`proveedor-option-${index}`}
                    >
                      {/* Checkbox indicator */}
                      <div className={cn(
                        'mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary',
                        'flex items-center justify-center',
                        isSelected && 'bg-primary text-primary-foreground'
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>

                      {/* Provider info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          data-testid="proveedor-nombre"
                        >
                          {provider.name}
                        </p>

                        {/* Services tags */}
                        {provider.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.services.map((service) => (
                              <span
                                key={service}
                                className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
                                data-testid="proveedor-service-tag"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Contact info */}
                        {provider.email && (
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            {provider.email}
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
        Opcional: selecciona un proveedor externo
      </p>
    </div>
  )
}
