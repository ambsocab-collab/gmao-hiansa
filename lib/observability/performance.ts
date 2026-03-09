/**
 * Performance Tracking
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Performance tracking para Prisma queries y operaciones lentas
 */

import { logger } from './logger'

export class PerformanceTracker {
  private startTime: number
  private correlationId: string
  private action: string

  /**
   * Creates a new PerformanceTracker instance
   * @param action - Description of the action being performed
   * @param correlationId - Request correlation ID for tracking
   */
  constructor(action: string, correlationId: string) {
    this.action = action
    this.correlationId = correlationId
    this.startTime = Date.now()
  }

  /**
   * Ends performance tracking and logs the result
   * Logs a warning if the operation took longer than the threshold
   *
   * @param thresholdMs - Threshold in milliseconds for slow operation warning (default: 1000ms)
   * @returns The actual duration in milliseconds
   */
  end(thresholdMs: number = 1000): number {
    const duration = Date.now() - this.startTime

    if (duration > thresholdMs) {
      logger.warn(
        undefined,
        `SLOW_QUERY: ${this.action} took ${duration}ms`,
        this.correlationId,
        { duration, threshold: thresholdMs }
      )
    } else {
      logger.debug(this.action, this.correlationId, { duration })
    }

    return duration
  }
}

/**
 * Factory function to create a PerformanceTracker instance
 * Use this to track the duration of operations like Prisma queries
 *
 * @param action - Description of the action being performed (e.g., 'db_query_users')
 * @param correlationId - Request correlation ID for tracking
 * @returns PerformanceTracker instance - call .end() when operation completes
 *
 * @example
 * const perf = trackPerformance('create_user', correlationId)
 * await prisma.user.create({ data: userData })
 * perf.end(1000) // Logs warning if takes >1000ms
 */
export function trackPerformance(action: string, correlationId: string): PerformanceTracker {
  return new PerformanceTracker(action, correlationId)
}
