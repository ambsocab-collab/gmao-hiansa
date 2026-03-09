/**
 * Client-side Logger Utility
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Lightweight client-side logging utility that sends errors to server-side endpoint
 * Used by client components like app/error.tsx
 * Includes rate limiting to prevent endpoint spam
 */

export interface ClientErrorLog {
  message: string
  stack?: string
  digest?: string
  userAgent?: string
  url?: string
}

/**
 * Rate limiter for client error logging
 * Prevents spamming the log endpoint with too many errors
 */
class RateLimiter {
  private errorsLogged: number = 0
  private lastResetTime: number = Date.now()
  private readonly maxErrorsPerMinute: number = 10
  private readonly minuteInMs: number = 60 * 1000

  /**
   * Checks if logging is allowed based on rate limit
   * @returns true if logging is allowed, false if rate limited
   */
  canLog(): boolean {
    const now = Date.now()

    // Reset counter if more than a minute has passed
    if (now - this.lastResetTime > this.minuteInMs) {
      this.errorsLogged = 0
      this.lastResetTime = now
    }

    // Check if we've exceeded the rate limit
    if (this.errorsLogged >= this.maxErrorsPerMinute) {
      return false
    }

    this.errorsLogged++
    return true
  }

  /**
   * Gets the current rate limit status
   * @returns Object with rate limit information
   */
  getStatus(): { logged: number; limit: number; resetIn: number } {
    const now = Date.now()
    const timeSinceReset = now - this.lastResetTime
    const resetIn = Math.max(0, this.minuteInMs - timeSinceReset)

    return {
      logged: this.errorsLogged,
      limit: this.maxErrorsPerMinute,
      resetIn: Math.ceil(resetIn / 1000) // seconds until reset
    }
  }
}

// Singleton rate limiter instance
const rateLimiter = new RateLimiter()


/**
 * Safely gets user agent from browser environment
 * Exported for testing
 */
export function getUserAgent(): string {
  if (typeof window !== 'undefined' && window.navigator) {
    return window.navigator.userAgent
  }
  return 'unknown'
}

/**
 * Safely gets current URL from browser environment
 * Exported for testing
 */
export function getCurrentUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.href
  }
  return 'unknown'
}

/**
 * Logs error from client-side to server endpoint
 * Rate limited to 10 errors per minute to prevent endpoint spam
 * @param error - Error object with message, stack, digest
 * @returns Promise that resolves when log is sent or is rate limited
 */
export async function logClientError(error: ClientErrorLog): Promise<void> {
  // Check rate limit before sending
  if (!rateLimiter.canLog()) {
    const status = rateLimiter.getStatus()
    console.warn(
      `[CLIENT_LOGGER] Rate limit exceeded (${status.logged}/${status.limit}). ` +
      `Resets in ${status.resetIn}s. Error was:`,
      error.message
    )
    return
  }

  try {
    await fetch('/api/v1/log/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...error,
        userAgent: getUserAgent(),
        url: getCurrentUrl(),
        timestamp: new Date().toISOString()
      })
    })
  } catch (fetchError) {
    // Fallback to console if fetch fails
    console.error('[CLIENT_LOGGER] Failed to send error log:', fetchError)
    console.error('[CLIENT_LOGGER] Original error:', error)
  }
}

/**
 * React Error Boundary Logger Hook
 * Extracts error information and logs it
 * @param error - Error from React Error Boundary
 */
export function logErrorBoundary(error: Error & { digest?: string }): void {
  const errorLog: ClientErrorLog = {
    message: error.message,
    stack: error.stack,
    digest: error.digest
  }

  // Log to server
  logClientError(errorLog).catch(() => {
    // Fallback already handled in logClientError
  })

  // Also log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR_BOUNDARY]', errorLog)
  }
}
