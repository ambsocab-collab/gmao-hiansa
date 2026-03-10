'use client'

/**
 * LoginForm Component
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Client component for login form with:
 * - Email/password authentication via NextAuth Credentials Provider
 * - Rate limiting feedback (5 attempts / 15 minutes)
 * - Spanish error messages
 * - Mobile-friendly 44px inputs
 * - data-testid attributes for E2E testing
 */

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface LoginFormState {
  email: string
  password: string
  error: string
  isLoading: boolean
  rateLimitBlocked: boolean
  rateLimitRemaining: number
}

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
    error: '',
    isLoading: false,
    rateLimitBlocked: false,
    rateLimitRemaining: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limit
    if (state.rateLimitBlocked) {
      setState(prev => ({
        ...prev,
        error: 'Demasiados intentos. Intenta nuevamente en 15 minutos.',
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      // Call NextAuth sign-in
      const result = await signIn('credentials', {
        email: state.email,
        password: state.password,
        redirect: false,
      })

      if (result?.error) {
        // Handle error
        if (result.error.includes('rate limit') || result.error.includes('demasiados intentos')) {
          setState(prev => ({
            ...prev,
            rateLimitBlocked: true,
            error: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.',
          }))
        } else {
          setState(prev => ({
            ...prev,
            error: 'Email o contraseña incorrectos',
            rateLimitRemaining: prev.rateLimitRemaining - 1,
          }))
        }
      } else if (result?.ok) {
        // Successful login - show welcome toast and redirect to dashboard
        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente',
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Error al iniciar sesión. Intente nuevamente.',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form
        data-testid="login-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            data-testid="login-email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={state.email}
            onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
            disabled={state.isLoading || state.rateLimitBlocked}
            required
            // 44px height for mobile touch targets (WCAG AA)
            className="h-11"
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            data-testid="login-password"
            type="password"
            placeholder="••••••••"
            value={state.password}
            onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
            disabled={state.isLoading || state.rateLimitBlocked}
            required
            // 44px height for mobile touch targets (WCAG AA)
            className="h-11"
            autoComplete="current-password"
          />
        </div>

        {/* Error Message */}
        {state.error && (
          <div
            data-testid="login-error"
            className="p-3 rounded-md bg-red-50 border border-red-200"
            style={{ color: '#EF4444' }}
          >
            <p className="text-sm font-medium">{state.error}</p>
            {!state.rateLimitBlocked && state.rateLimitRemaining < 5 && (
              <p className="text-xs mt-1">
                Intentos restantes: {state.rateLimitRemaining}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          data-testid="login-submit"
          type="submit"
          disabled={state.isLoading || state.rateLimitBlocked}
          className="w-full h-11"
        >
          {state.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : state.rateLimitBlocked ? (
            'Bloqueado temporalmente'
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>
    </div>
  )
}
