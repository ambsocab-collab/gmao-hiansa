/**
 * Cambiar Password Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected page for forced password reset on first login
 * Users with forcePasswordReset=true are redirected here
 * Features:
 * - Password strength validation (8 chars, 1 uppercase, 1 number)
 * - Spanish error messages
 * - data-testid attributes for E2E testing
 * - Navigation blocking until password is changed
 */

import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'

export const metadata = {
  title: 'Cambiar Contraseña - GMAO HiRock/Ultra',
  description: 'Cambia tu contraseña temporal',
}

export default function CambiarPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Cambiar Contraseña
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Debes cambiar tu contraseña temporal en el primer acceso
          </p>
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />
      </div>
    </div>
  )
}
