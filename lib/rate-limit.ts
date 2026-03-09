/**
 * Rate Limiting (In-Memory)
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Implements in-memory rate limiting for login attempts
 * Phase 1: In-Memory storage (current implementation)
 * Phase 2: Migrate to Upstash Redis when needed for multi-instance deployments
 *
 * Rate limit: 5 failed attempts per IP in 15 minutes (NFR-S9)
 *
 * SECURITY NOTE: IP is obtained from headers (x-forwarded-for, x-real-ip)
 * which can be spoofed. In production, use real connection IP when available.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

/**
 * Rate limiting configuration constants
 */
export const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
  CLEANUP_INTERVAL_MS: 15 * 60 * 1000 // 15 minutes for cleanup
} as const

/**
 * In-memory storage for rate limiting
 * Key: IP address
 * Value: { count, resetTime }
 */
const loginAttempts = new Map<string, RateLimitRecord>()

/**
 * Checks if an IP has exceeded the rate limit
 * @param ip - Client IP address
 * @returns true if attempt is allowed, false if should be blocked
 */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  // If no record or reset time has passed, create new record
  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS
    })
    return true
  }

  // If exceeded max attempts, block
  if (record.count >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    return false
  }

  // Increment counter
  record.count++
  return true
}

/**
 * Resets attempt counter for an IP
 * Useful after successful login
 * @param ip - Client IP address
 */
export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * Gets number of remaining attempts for an IP
 * @param ip - Client IP address
 * @returns Number of remaining attempts (0-5)
 */
export function getRemainingAttempts(ip: string): number {
  const record = loginAttempts.get(ip)
  if (!record) return RATE_LIMIT_CONFIG.MAX_ATTEMPTS

  const now = Date.now()
  if (now > record.resetTime) {
    loginAttempts.delete(ip)
    return RATE_LIMIT_CONFIG.MAX_ATTEMPTS
  }

  return Math.max(0, RATE_LIMIT_CONFIG.MAX_ATTEMPTS - record.count)
}

/**
 * Cleans up expired rate limiting records
 * Called automatically every 15 minutes to prevent memory leaks
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now()
  for (const [ip, record] of loginAttempts.entries()) {
    if (now > record.resetTime) {
      loginAttempts.delete(ip)
    }
  }
}

/**
 * Initializes automatic cleanup of expired records
 * Runs every 15 minutes to prevent memory leaks
 */
let cleanupInitialized = false
export function initRateLimitCleanup(): void {
  if (cleanupInitialized) return

  setInterval(() => {
    cleanupExpiredRecords()
  }, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS)

  cleanupInitialized = true
}
