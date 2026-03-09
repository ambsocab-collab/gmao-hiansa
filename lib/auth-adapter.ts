/**
 * NextAuth Adapter
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Exports NextAuth auth() without creating circular dependencies
 */

import { auth as nextAuth } from '@/app/api/auth/[...nextauth]/route'

/**
 * Alias of NextAuth auth()
 * Allows importing the function without creating circular dependency with route handler
 */
export const auth = nextAuth
