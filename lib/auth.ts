import * as bcrypt from 'bcryptjs'

/**
 * bcrypt salt rounds for password hashing
 * Cost factor 10 provides good security/performance balance
 */
const SALT_ROUNDS = 10

/**
 * Hashes a password using bcryptjs
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verifies a password against a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns true if password is correct
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Gets current session from server
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Gets session using NextAuth auth()
 * @returns Current session or null if no session
 */
import { auth } from '@/lib/auth-adapter'

export async function getSession() {
  return await auth()
}
