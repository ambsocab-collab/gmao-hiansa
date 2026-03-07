import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 28800, // 8 horas en segundos
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Lógica de autenticación en Story 1.4
        // Por ahora, retornamos null para que no falle la compilación
        return null
      }
    })
  ]
})

export { handler as GET, handler as POST }
