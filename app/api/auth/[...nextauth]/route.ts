import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth.config'

const handler = NextAuth(authOptions)

// Export authOptions for testing
export { authOptions }

export { handler as GET, handler as POST }
