/**
 * NextAuth Configuration
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * NextAuth.js v4.24.7 configuration with:
 * - Credentials provider for email/password authentication
 * - JWT session strategy with 8-hour maxAge
 * - Callbacks to include capabilities in session
 * - Custom pages for login and errors
 * - Security: Timing attack prevention, user enumeration prevention
 */

import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { AuthenticationError, AuthorizationError } from '@/lib/utils/errors'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'

/**
 * NextAuth configuration options
 * Exported for testing purposes
 */
export const authOptions: NextAuthOptions = {
  /**
   * Credentials Provider
   * Email/password authentication against Prisma database
   */
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'usuario@ejemplo.com'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '••••••••'
        }
      },
      /**
       * Authorize function
       * Validates credentials against Prisma User model
       * Includes security measures to prevent user enumeration and timing attacks
       * Story 1.1: Adds rate limiting, soft delete check, and last login tracking
       */
      async authorize(credentials, req): Promise<User | null> {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new AuthenticationError('Credenciales inválidas')
        }

        // Story 1.1: Rate limiting (5 attempts / 15 minutes)
        // Get IP from request headers (works with Vercel proxy)
        const ip = (req?.headers?.['x-forwarded-for'] as string)?.split(',')[0].trim()
          || (req?.headers?.['x-real-ip'] as string)
          || 'unknown'

        const rateLimitOk = await checkRateLimit(ip)
        if (!rateLimitOk) {
          throw new AuthenticationError('Demasiados intentos. Intenta nuevamente en 15 minutos.')
        }

        try {
          // Search user in database with capabilities
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { capabilities: true }
          })

          if (!user) {
            // Security: Prevent user enumeration - always same message
            // Security: Prevent timing attack using dummy hash comparison
            await compare('password', '$2b$10$dummy.hash.for.timing.attack.prevention')
            throw new AuthenticationError('Credenciales inválidas')
          }

          // Story 1.1: Check soft delete (deleted users cannot login)
          if (user.deleted) {
            throw new AuthorizationError('Este usuario ha sido eliminado. Contacta al administrador.')
          }

          // Verify password using bcryptjs
          const isValid = await compare(credentials.password, user.password_hash)

          if (!isValid) {
            throw new AuthenticationError('Credenciales inválidas')
          }

          // Story 1.1: Update last_login timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { last_login: new Date() }
          })

          // Story 1.1: Reset rate limit after successful login
          resetRateLimit(ip)

          // Return user object for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            capabilities: user.capabilities.map((c) => c.name),
            // Include forcePasswordReset for redirect in login
            forcePasswordReset: user.force_password_reset
          }
        } catch (error) {
          // If AuthenticationError or AuthorizationError, re-throw
          if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
            throw error
          }
          // Other error, throw generic with consistent message
          throw new AuthenticationError('Credenciales inválidas')
        }
      }
    })
  ],

  /**
   * Session Configuration
   * JWT strategy with 8-hour maxAge (NFR-S6)
   */
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60 // 8 hours in seconds (28800 seconds)
  },

  /**
   * Callbacks
   * Customize JWT and Session behavior
   */
  callbacks: {
    /**
     * JWT Callback
     * Called every time a JWT is created or updated
     * Adds id, capabilities, and forcePasswordReset to token
     */
    async jwt({ token, user }) {
      // If user exists (first login), add to token
      if (user) {
        token.id = user.id
        token.capabilities = user.capabilities
        token.forcePasswordReset = user.forcePasswordReset
      }
      return token
    },

    /**
     * Session Callback
     * Called every time session is accessed
     * Exposes id, capabilities, and forcePasswordReset in session.user
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.capabilities = token.capabilities as string[]
        session.user.forcePasswordReset = token.forcePasswordReset as boolean | undefined
      }
      return session
    },

    /**
     * SignIn Callback
     * Called when user attempts to login
     * Can be used to block users or verify additional conditions
     * TODO: Add logic to verify if user is active/blocked
     */
    async signIn() {
      // Allow login by default
      // Add logic here to verify if user is active
      return true
    }
  },

  /**
   * Custom Pages
   * Custom routes for login and errors
   * Story 1.1: Spanish route names
   */
  pages: {
    signIn: '/login',
    error: '/login',
    // Note: newUser is not used, registration is admin-only via /usuarios/nuevo
  }
}

/**
 * NextAuth Route Handler
 * Exports GET and POST handlers for Next.js App Router
 */
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
