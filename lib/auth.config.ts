import type { User, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { AuthenticationError, AuthorizationError } from '@/lib/utils/errors'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas')
        }

        const ip = 'localhost'; // Simplificado para evitar problemas con headers en Next.js 15

        // Get request headers for test bypass detection
        const requestHeaders = req?.headers ? new Headers(req.headers as Record<string, string>) : undefined

        const rateLimitOk = await checkRateLimit(ip, requestHeaders)
        if (!rateLimitOk) {
          const error = new Error('RATE_LIMITED:Demasiados intentos. Intenta nuevamente en 15 minutos.')
          error.name = 'RATE_LIMITED'
          throw error
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              userCapabilities: {
                include: { capability: true }
              }
            }
          })

          if (!user) {
            await compare('password', '$2b$10$dummy.hash.for.timing.attack.prevention')
            throw new Error('Credenciales inválidas')
          }

          if (user.deleted) {
            throw new Error('Este usuario ha sido eliminado. Contacta al administrador.')
          }

          const isValid = await compare(credentials.password, user.passwordHash)

          if (!isValid) {
            throw new Error('Credenciales inválidas')
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          resetRateLimit(ip)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            passwordHash: user.passwordHash,
            capabilities: user.userCapabilities.map((uc) => uc.capability.name),
            forcePasswordReset: user.forcePasswordReset
          }
        } catch (error: any) {
          throw error
        }
      }
    })
  ],

  session: {
    strategy: 'jwt' as const,
    maxAge: 8 * 60 * 60
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        token.id = user.id
        token.capabilities = user.capabilities
        token.forcePasswordReset = user.forcePasswordReset
        console.log('[JWT Callback] User logged in, forcePasswordReset:', user.forcePasswordReset, 'Email:', user.email)
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.capabilities = token.capabilities as string[]
        session.user.forcePasswordReset = token.forcePasswordReset as boolean | undefined
      }
      return session
    },

    async signIn() {
      return true
    }
  },

  pages: {
    signIn: '/login',
    error: '/login'
  }
}
