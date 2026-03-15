/**
 * Login Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Public page for user authentication with email/password
 * Features:
 * - Mobile-friendly form with 44px touch targets
 * - Rate limiting (5 attempts / 15 minutes)
 * - Spanish error messages
 * - data-testid attributes for E2E testing
 */

import { LoginForm } from '@/components/auth/LoginForm'
import HiansaLogo from '@/components/brand/hiansa-logo'

export const metadata = {
  title: 'Iniciar Sesión - GMAO HIANSA',
  description: 'Accede al sistema de gestión de mantenimiento',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <HiansaLogo size="lg" className="w-56 h-14 mx-auto mb-2" />
          <p className="mt-1 text-xs text-gray-600">
            Sistema de Gestión de Mantenimiento
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  )
}
