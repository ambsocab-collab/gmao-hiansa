/**
 * NextAuth Type Extensions
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Extends NextAuth types to include:
 * - user.id in session
 * - user.capabilities[] for PBAC authorization
 * - user.forcePasswordReset for temporary password flow
 */

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      capabilities: string[]
      forcePasswordReset?: boolean
    } & DefaultSession['user']
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `credentials` callback.
   */
  interface User {
    capabilities?: string[]
    forcePasswordReset?: boolean
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken` */
  interface JWT {
    id?: string
    capabilities?: string[]
    forcePasswordReset?: boolean
  }
}
