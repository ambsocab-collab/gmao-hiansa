import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

/**
 * ⚠️ TEMPORAL - NextAuth Configuration Incomplete
 *
 * Esta configuración es un PLACEHOLDER para Story 1.1.
 * La autenticación completa se implementará en Story 1.4.
 *
 * LIMITACIONES ACTUALES:
 * - ❌ Nadie puede hacer login (authorize retorna null)
 * - ❌ No hay validación de credenciales
 * - ❌ No hay conexión a base de datos de usuarios
 *
 * Story 1.4 implementará:
 * - ✅ Validación de email/password
 * - ✅ Búsqueda de usuario en base de datos
 * - ✅ Verificación de hash bcrypt
 * - ✅ Manejo de isFirstLogin
 */
const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 28800, // 8 horas en segundos (AC 5)
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // ⚠️ TEMPORAL - Lógica de autenticación en Story 1.4
        // Por ahora, retornamos null para que no falle la compilación
        // TODO: Implementar en Story 1.4
        return null
      }
    })
  ]
})

export { handler as GET, handler as POST }
