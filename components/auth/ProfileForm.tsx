'use client'

/**
 * ProfileForm Component
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Client component for user profile with:
 * - Display current profile information
 * - Edit name, email, phone
 * - Change password from profile
 * - Spanish error messages
 * - Mobile-friendly inputs (44px)
 * - data-testid attributes for E2E testing
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, Edit2, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  createdAt: Date
  lastLogin: Date | null
}

interface ProfileFormState {
  isEditing: boolean
  isLoading: boolean
  error: string
  success: string
  editData: {
    name: string
    phone: string
  }
}

interface PasswordFormState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  error: string
  isLoading: boolean
}

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const { toast } = useToast()
  const [state, setState] = useState<ProfileFormState>({
    isEditing: false,
    isLoading: false,
    error: '',
    success: '',
    editData: {
      name: user.name,
      phone: user.phone || '',
    },
  })

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordState, setPasswordState] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    isLoading: false,
  })

  const handleEdit = () => {
    setState(prev => ({
      ...prev,
      isEditing: true,
      editData: {
        name: user.name,
        phone: user.phone || '',
      },
    }))
  }

  const handleCancel = () => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      editData: {
        name: user.name,
        phone: user.phone || '',
      },
    }))
  }

  const handleSave = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '', success: '' }))

    try {
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.editData),
      })

      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          error: data.error || 'Error al actualizar perfil',
        }))
        return
      }

      setState(prev => ({
        ...prev,
        isEditing: false,
        success: 'Perfil actualizado exitosamente',
      }))

      // Refresh to show updated data
      router.refresh()
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Error al actualizar perfil. Intente nuevamente.',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
      setPasswordState(prev => ({ ...prev, error: 'Todos los campos son requeridos' }))
      return
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordState(prev => ({ ...prev, error: 'Las contraseñas no coinciden' }))
      return
    }

    if (passwordState.newPassword.length < 8) {
      setPasswordState(prev => ({ ...prev, error: 'Mínimo 8 caracteres' }))
      return
    }

    setPasswordState(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      const response = await fetch('/api/v1/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordState.currentPassword,
          newPassword: passwordState.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordState(prev => ({
          ...prev,
          error: data.error || 'Error al cambiar contraseña',
        }))
        return
      }

      // Success - close dialog and show toast
      toast({
        title: '¡Contraseña cambiada!',
        description: 'Contraseña cambiada exitosamente',
      })

      setShowPasswordDialog(false)
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        isLoading: false,
      })
    } catch {
      setPasswordState(prev => ({
        ...prev,
        error: 'Error al cambiar contraseña. Intente nuevamente.',
      }))
    } finally {
      setPasswordState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {state.error && (
        <div
          className="p-4 rounded-md bg-red-50 border border-red-200"
          style={{ color: '#EF4444' }}
        >
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm font-medium text-green-800">{state.success}</p>
        </div>
      )}

      {/* Profile Information Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Información Personal
          </h2>
          {!state.isEditing && (
            <Button
              data-testid="edit-profile-button"
              onClick={handleEdit}
              variant="outline"
              size="sm"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

        <form
          data-testid="perfil-form"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="profile-name">Nombre</Label>
            <Input
              id="profile-name"
              data-testid="profile-name"
              value={state.isEditing ? state.editData.name : user.name}
              onChange={(e) =>
                setState(prev => ({
                  ...prev,
                  editData: { ...prev.editData, name: e.target.value },
                }))
              }
              disabled={!state.isEditing || state.isLoading}
              className="h-11"
            />
          </div>

          {/* Email Field (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              data-testid="profile-email"
              value={user.email}
              disabled
              className="h-11 bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              El email no se puede modificar
            </p>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="profile-phone">Teléfono</Label>
            <Input
              id="profile-phone"
              data-testid="profile-phone"
              type="tel"
              value={
                state.isEditing
                  ? state.editData.phone
                  : user.phone || 'No especificado'
              }
              onChange={(e) =>
                setState(prev => ({
                  ...prev,
                  editData: { ...prev.editData, phone: e.target.value },
                }))
              }
              disabled={!state.isEditing || state.isLoading}
              placeholder="+34 612 345 678"
              className="h-11"
            />
          </div>

          {/* Account Info (read-only) */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Información de Cuenta
            </h3>
            <dl className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-500">Miembro desde</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Último acceso</dt>
                <dd className="text-sm text-gray-900">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Nunca'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Buttons (Edit Mode) */}
          {state.isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={state.isLoading}
                data-testid="save-profile-button"
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={state.isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Cambiar Contraseña
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Actualiza tu contraseña de acceso
            </p>
          </div>
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button
                data-testid="change-password-button"
                variant="outline"
              >
                Cambiar Contraseña
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar Contraseña</DialogTitle>
                <DialogDescription>
                  Ingresa tu contraseña actual y la nueva contraseña
                </DialogDescription>
              </DialogHeader>
              <form
                data-testid="cambiar-password-form"
                onSubmit={handlePasswordChange}
                className="space-y-4 py-4"
              >
                {/* Error Message */}
                {passwordState.error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800">{passwordState.error}</p>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input
                    id="current-password"
                    data-testid="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwordState.currentPassword}
                    onChange={(e) =>
                      setPasswordState(prev => ({ ...prev, currentPassword: e.target.value }))
                    }
                    disabled={passwordState.isLoading}
                    required
                    className="h-11"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input
                    id="new-password"
                    data-testid="new-password"
                    type="password"
                    placeholder="NuevaContraseña123"
                    value={passwordState.newPassword}
                    onChange={(e) =>
                      setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))
                    }
                    disabled={passwordState.isLoading}
                    required
                    className="h-11"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    data-testid="confirm-password"
                    type="password"
                    placeholder="NuevaContraseña123"
                    value={passwordState.confirmPassword}
                    onChange={(e) =>
                      setPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    disabled={passwordState.isLoading}
                    required
                    className="h-11"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  data-testid="change-password-submit"
                  disabled={passwordState.isLoading}
                  className="w-full h-11"
                >
                  {passwordState.isLoading ? (
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
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  )
}
