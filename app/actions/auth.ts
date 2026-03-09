/**
 * Server Actions for Authentication
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Login and logout server actions used from Client Components
 * Includes rate limiting and temporary password handling
 */

'use server'

import { signIn, signOut } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { checkRateLimit, resetRateLimit, initRateLimitCleanup } from '@/lib/rate-limit'
import { headers } from 'next/headers'

/**
 * Enhanced email validation helper
 * Validates email format with additional checks
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return false
  }

  // Additional checks
  const [localPart, domain] = email.split('@')

  // Local part must be 1-64 characters
  if (localPart.length < 1 || localPart.length > 64) {
    return false
  }

  // Domain must be 1-255 characters
  if (domain.length < 1 || domain.length > 255) {
    return false
  }

  // Domain must have at least one dot
  if (!domain.includes('.')) {
    return false
  }

  return true
}

/**
 * Login validation schema using Zod
 * Validates email format with enhanced validation and password length
 */
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email es requerido')
    .max(254, 'Email demasiado largo')
    .refine(isValidEmail, 'Email inválido'),
  password: z.string()
    .min(6, 'Password debe tener al menos 6 caracteres')
    .max(128, 'Password demasiado largo')
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Server Action for user login
 * Validates credentials, applies rate limiting, and authenticates user
 * Redirects to /change-password if user has temporary password
 *
 * @param formData - FormData containing email and password
 * @returns Object with error if failed, or redirects to /dashboard or /change-password
 */
export async function login(formData: FormData) {
  // Initialize rate limiting cleanup (only first time)
  initRateLimitCleanup()

  // Get client IP for rate limiting
  // NOTE: In production, use real connection IP to prevent spoofing
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const ip = forwarded?.split(',')[0].trim() || realIp || 'unknown'

  // Check rate limit (5 attempts / 15 minutes)
  const isAllowed = await checkRateLimit(ip)
  if (!isAllowed) {
    return {
      error: 'Demasiados intentos fallidos. Por favor espera 15 minutos antes de intentar nuevamente.'
    }
  }

  // Validate fields with Zod
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedFields.success) {
    return {
      error: 'Credenciales inválidas'
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Attempt login with NextAuth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    // If error, return message
    if (result?.error) {
      return {
        error: 'Credenciales inválidas'
      }
    }

    // Reset rate limit after successful login
    resetRateLimit(ip)

    // Check if user has temporary password that must be changed
    // NOTE: In NextAuth v4, we need to get session after login
    // to verify forcePasswordReset flag
    const { getSession } = await import('@/lib/auth')
    const session = await getSession()

    // Redirect to /change-password if has temporary password
    if (session?.user?.forcePasswordReset) {
      redirect('/change-password')
    }

    // Redirect to dashboard
    redirect('/dashboard')
  } catch (error) {
    // Unexpected error
    console.error('Error durante login:', error)
    return {
      error: 'Credenciales inválidas'
    }
  }
}

/**
 * Server Action for user logout
 * Closes user session and redirects to login
 *
 * @returns Redirect to /login
 */
export async function logout() {
  try {
    // Close session with NextAuth
    await signOut({ redirect: false })

    // Redirect to login
    redirect('/login')
  } catch (error) {
    console.error('Error durante logout:', error)
    // Still redirect to login even on error
    redirect('/login')
  }
}
