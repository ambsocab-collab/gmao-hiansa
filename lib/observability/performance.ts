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

  constructor(action: string, correlationId: string) {
    this.action = action
    this.correlationId = correlationId
    this.startTime = Date.now()
  }

  end(thresholdMs: number = 1000) {
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

export function trackPerformance(action: string, correlationId: string) {
  return new PerformanceTracker(action, correlationId)
}
