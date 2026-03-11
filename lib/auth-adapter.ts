/**
 * NextAuth Adapter
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Exports NextAuth getServerSession without creating circular dependencies
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'

/**
 * Helper to get session without creating circular dependency with route handler
 */
export const auth = () => getServerSession(authOptions)
