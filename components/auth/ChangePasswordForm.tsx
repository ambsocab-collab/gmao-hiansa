'use client'

/**
 * ChangePasswordForm Component
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Client component for password change with:
 * - Current password verification
 * - Password strength validation (8 chars, 1 uppercase, 1 number)
 * - Confirmation matching
 * - Spanish error messages
 * - Mobile-friendly 44px inputs
 * - data-testid attributes for E2E testing
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ChangePasswordFormState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  error: string
  isLoading: boolean
  validationErrors: {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }
}

// Password validation requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasNumber: /[0-9]/,
}

export function ChangePasswordForm() {
  const { toast } = useToast()
  const [state, setState] = useState<ChangePasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    isLoading: false,
    validationErrors: {},
  })

  const validatePassword = (password: string): string | null => {
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      return 'Mínimo 8 caracteres'
    }
    if (!PASSWORD_REQUIREMENTS.hasUpperCase.test(password)) {
      return 'Debe contener al menos una mayúscula'
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
      return 'Debe contener al menos un número'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setState(prev => ({
      ...prev,
      error: '',
      validationErrors: {},
    }))

    // Validate fields
    const validationErrors: ChangePasswordFormState['validationErrors'] = {}

    if (!state.currentPassword) {
      validationErrors.currentPassword = 'Contraseña actual requerida'
    }

    const passwordError = validatePassword(state.newPassword)
    if (passwordError) {
      validationErrors.newPassword = passwordError
    }

    if (state.newPassword !== state.confirmPassword) {
      validationErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(validationErrors).length > 0) {
      setState(prev => ({ ...prev, validationErrors }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      // Call Server Action to change password
      const response = await fetch('/api/v1/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: state.currentPassword,
          newPassword: state.newPassword,
          confirmPassword: state.confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Extract error message from object or string
        const errorMessage = typeof data.error === 'object'
          ? data.error?.message || 'Error al cambiar contraseña'
          : data.error || 'Error al cambiar contraseña'

        setState(prev => ({
          ...prev,
          error: errorMessage,
        }))
        return
      }

      // Password changed successfully - show success message
      toast({
        title: '¡Contraseña cambiada!',
        description: 'Contraseña cambiada exitosamente',
      })

      // Sign out to force session refresh, then redirect to login
      // User will need to log in again with new password
      await signOut({ redirect: false })
      window.location.href = '/login'
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Error al cambiar contraseña. Intente nuevamente.',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form
        data-testid="change-password-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Current Password Field */}
        <div className="space-y-2">
          <Label htmlFor="current-password">Contraseña Actual</Label>
          <Input
            id="current-password"
            data-testid="current-password"
            type="password"
            placeholder="••••••••"
            value={state.currentPassword}
            onChange={(e) =>
              setState(prev => ({ ...prev, currentPassword: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.currentPassword && (
            <p className="text-sm text-red-600">
              {state.validationErrors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="new-password">Nueva Contraseña</Label>
          <Input
            id="new-password"
            data-testid="new-password"
            type="password"
            placeholder="NuevaContraseña123"
            value={state.newPassword}
            onChange={(e) =>
              setState(prev => ({ ...prev, newPassword: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.newPassword && (
            <p className="text-sm text-red-600">
              {state.validationErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
          <Input
            id="confirm-password"
            data-testid="confirm-password"
            type="password"
            placeholder="NuevaContraseña123"
            value={state.confirmPassword}
            onChange={(e) =>
              setState(prev => ({ ...prev, confirmPassword: e.target.value }))
            }
            disabled={state.isLoading}
            required
            className="h-11"
          />
          {state.validationErrors.confirmPassword && (
            <p className="text-sm text-red-600">
              {state.validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Error Message */}
        {state.error && (
          <div
            className="p-3 rounded-md bg-red-50 border border-red-200"
            style={{ color: '#EF4444' }}
          >
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          data-testid="change-password-submit"
          type="submit"
          disabled={state.isLoading}
          className="w-full h-11"
        >
          {state.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cambiando contraseña...
            </>
          ) : (
            'Cambiar Contraseña'
          )}
        </Button>

        {/* Password Requirements Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>La contraseña debe cumplir:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una mayúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>
      </form>
    </div>
  )
}
