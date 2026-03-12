'use client'

/**
 * RegisterForm Component
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Client component for user registration with:
 * - Create user with name, email, phone, role label, password
 * - 15 capability checkboxes for PBAC
 * - Default capability: can_create_failure_report (NFR-S66)
 * - forcePasswordReset=true for new users
 * - Spanish error messages
 * - Mobile-friendly inputs (44px)
 * - data-testid attributes for E2E testing
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

interface Capability {
  id: string
  name: string
  label: string
  description?: string | null
}

interface RegisterFormState {
  name: string
  email: string
  phone: string
  roleLabel: string
  password: string
  confirmPassword: string
  selectedCapabilities: string[]
  isLoading: boolean
  error: string
  validationErrors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
}

// 15 PBAC Capabilities (from database seed)
const ALL_CAPABILITIES = [
  'can_create_failure_report',
  'can_create_manual_ot',
  'can_update_own_ot',
  'can_view_own_ots',
  'can_view_all_ots',
  'can_complete_ot',
  'can_manage_stock',
  'can_assign_technicians',
  'can_view_kpis',
  'can_manage_assets',
  'can_view_repair_history',
  'can_manage_providers',
  'can_manage_routines',
  'can_manage_users',
  'can_receive_reports',
]

export function RegisterForm({ capabilities }: { capabilities: Capability[] }) {
  const router = useRouter()
  const [state, setState] = useState<RegisterFormState>({
    name: '',
    email: '',
    phone: '',
    roleLabel: '',
    password: '',
    confirmPassword: '',
    selectedCapabilities: ['can_create_failure_report'], // Default (NFR-S66)
    isLoading: false,
    error: '',
    validationErrors: {},
  })

  const handleCapabilityToggle = (capabilityName: string) => {
    setState(prev => ({
      ...prev,
      selectedCapabilities: prev.selectedCapabilities.includes(capabilityName)
        ? prev.selectedCapabilities.filter(c => c !== capabilityName)
        : [...prev.selectedCapabilities, capabilityName],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[RegisterForm] handleSubmit called!')

    // Clear previous errors
    setState(prev => ({
      ...prev,
      error: '',
      validationErrors: {},
    }))

    // Validate fields
    const validationErrors: RegisterFormState['validationErrors'] = {}

    if (!state.name) {
      validationErrors.name = 'Nombre requerido'
    }

    if (!state.email) {
      validationErrors.email = 'Email requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      validationErrors.email = 'Email inválido'
    }

    if (!state.password) {
      validationErrors.password = 'Contraseña requerida'
    } else if (state.password.length < 8) {
      validationErrors.password = 'Mínimo 8 caracteres'
    }

    if (state.password !== state.confirmPassword) {
      validationErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(validationErrors).length > 0) {
      setState(prev => ({ ...prev, validationErrors }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: '' }))

    // Debug: log form state before submitting
    console.log('[RegisterForm] Submitting form with state:', {
      name: state.name,
      email: state.email,
      phone: state.phone,
      roleLabel: state.roleLabel,
      passwordLength: state.password?.length,
      selectedCapabilities: state.selectedCapabilities,
    })

    try {
      const requestBody = {
        name: state.name,
        email: state.email,
        phone: state.phone || null,
        roleLabel: state.roleLabel || undefined,
        password: state.password,
        capabilities: state.selectedCapabilities,
      }
      console.log('[RegisterForm] Creating user with request body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log('[RegisterForm] Response status:', response.status, 'Response data:', data)

      if (!response.ok) {
        // Extract error message from error object
        const errorMessage = data.error?.message || data.error || 'Error al crear usuario'
        setState(prev => ({
          ...prev,
          error: errorMessage,
        }))
        return
      }

      // User created successfully - redirect to user list
      router.push('/usuarios')
      router.refresh()
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Error al crear usuario. Intente nuevamente.',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <form
      data-testid="register-form"
      onSubmit={(e) => {
        console.log('[RegisterForm] Form onSubmit triggered!')
        handleSubmit(e)
      }}
      className="space-y-8"
    >
      {/* User Information */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Información del Usuario
        </h2>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="register-name">Nombre Completo *</Label>
          <Input
            id="register-name"
            data-testid="register-name"
            placeholder="Juan Pérez García"
            value={state.name}
            onChange={(e) =>
              setState(prev => ({ ...prev, name: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.name && (
            <p className="text-sm text-red-600">{state.validationErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="register-email">Email *</Label>
          <Input
            id="register-email"
            data-testid="register-email"
            type="email"
            placeholder="juan.perez@ejemplo.com"
            value={state.email}
            onChange={(e) =>
              setState(prev => ({ ...prev, email: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.email && (
            <p className="text-sm text-red-600">{state.validationErrors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="register-phone">Teléfono</Label>
          <Input
            id="register-phone"
            data-testid="register-phone"
            type="tel"
            placeholder="+34 612 345 678"
            value={state.phone}
            onChange={(e) =>
              setState(prev => ({ ...prev, phone: e.target.value }))
            }
            disabled={state.isLoading}
            className="h-11"
          />
        </div>

        {/* Role Label Field */}
        <div className="space-y-2">
          <Label htmlFor="register-role-label">Etiqueta de Rol</Label>
          <Input
            id="register-role-label"
            data-testid="register-role-label"
            placeholder="Técnico, Operario, Supervisor, etc."
            value={state.roleLabel}
            onChange={(e) =>
              setState(prev => ({ ...prev, roleLabel: e.target.value }))
            }
            disabled={state.isLoading}
            className="h-11"
          />
          <p className="text-xs text-gray-500">
            Etiqueta descriptiva del rol del usuario (opcional)
          </p>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="register-password">Contraseña Temporal *</Label>
          <Input
            id="register-password"
            data-testid="register-password"
            type="password"
            placeholder="••••••••"
            value={state.password}
            onChange={(e) =>
              setState(prev => ({ ...prev, password: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.password && (
            <p className="text-sm text-red-600">{state.validationErrors.password}</p>
          )}
          <p className="text-xs text-gray-500">
            Mínimo 8 caracteres. El usuario deberá cambiarla en el primer acceso.
          </p>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="register-confirm-password">Confirmar Contraseña *</Label>
          <Input
            id="register-confirm-password"
            data-testid="register-confirm-password"
            type="password"
            placeholder="••••••••"
            value={state.confirmPassword}
            onChange={(e) =>
              setState(prev => ({ ...prev, confirmPassword: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.confirmPassword && (
            <p className="text-sm text-red-600">{state.validationErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Capabilities (Permisos)
        </h2>
        <p className="text-sm text-gray-600">
          Selecciona los permisos para este usuario. Por defecto, todos los usuarios tienen{' '}
          <code>can_create_failure_report</code>.
        </p>

        <div
          data-testid="capability-checkboxes"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {capabilities.map((capability) => (
            <div
              key={capability.id}
              className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50"
            >
              <Checkbox
                id={`capability-${capability.name}`}
                data-testid={`capability-${capability.name}`}
                checked={state.selectedCapabilities.includes(capability.name)}
                onCheckedChange={() => handleCapabilityToggle(capability.name)}
                disabled={state.isLoading}
              />
              <div className="flex-1">
                <Label
                  htmlFor={`capability-${capability.name}`}
                  className="font-medium text-sm cursor-pointer"
                >
                  {capability.label}
                </Label>
                {capability.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {capability.description}
                  </p>
                )}
                <code className="text-xs text-gray-400 block mt-1">
                  {capability.name}
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Capabilities Count */}
        <p className="text-sm text-gray-600">
          {state.selectedCapabilities.length} de {ALL_CAPABILITIES.length} capabilities seleccionadas
        </p>
      </div>

      {/* Error Message */}
      {state.error && (
        <div
          className="p-4 rounded-md bg-red-50 border border-red-200"
          style={{ color: '#EF4444' }}
        >
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          data-testid="register-submit"
          type="submit"
          disabled={state.isLoading}
          className="flex-1 h-11"
          onClick={() => console.log('[RegisterForm] Submit button clicked!')}
        >
          {state.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando Usuario...
            </>
          ) : (
            'Crear Usuario'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={state.isLoading}
          className="h-11"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
