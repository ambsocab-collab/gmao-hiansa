/**
 * Structured Logger for Vercel
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Logger con structured logging para Vercel
 * Todos los logs se envían a stdout en formato JSON
 * Story 0.5: Removed 'any' type usage by creating AppErrorLike interface
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  timestamp: string
  level: LogLevel
  userId?: string
  action: string
  error?: {
    code: string
    message: string
    stack?: string
  }
  correlationId: string
  metadata?: Record<string, unknown>
}

/**
 * Interface for errors that have AppError-like properties
 * Used for duck typing to avoid circular dependencies
 * Exported for consumers who need to check error types
 */
export interface AppErrorLike extends Error {
  code: string
  statusCode: number
  correlationId: string
}

/**
 * Type guard to check if error has AppError properties
 * Story 0.5: Improved type safety by replacing 'any' with proper type guard
 */
function isAppErrorLike(error: Error): error is AppErrorLike {
  return (
    'code' in error &&
    'statusCode' in error &&
    'correlationId' in error &&
    typeof error.code === 'string'
  )
}

/**
 * Logger con structured logging para Vercel
 * Todos los logs se envían a stdout en formato JSON
 */
export class Logger {
  private formatLog(context: LogContext): string {
    return JSON.stringify(context)
  }

  private log(level: LogLevel, context: Omit<LogContext, 'timestamp' | 'level'>) {
    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      ...context
    }

    const formattedLog = this.formatLog(logContext)

    switch (level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console -- Logger component needs console output
        console.debug(formattedLog)
        break
      case LogLevel.INFO:
        // eslint-disable-next-line no-console -- Logger component needs console output
        console.info(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.ERROR:
        console.error(formattedLog)
        break
    }
  }

  debug(action: string, correlationId: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, { action, correlationId, metadata })
  }

  info(userId: string | undefined, action: string, correlationId: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.INFO, { userId, action, correlationId, metadata })
  }

  warn(userId: string | undefined, action: string, correlationId: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.WARN, { userId, action, correlationId, metadata })
  }

  error(error: Error, action: string, correlationId: string, userId?: string) {
    // Story 0.5: Use type guard instead of 'any' type
    const errorCode = isAppErrorLike(error) ? error.code : 'UNKNOWN_ERROR'

    this.log(LogLevel.ERROR, {
      userId,
      action,
      correlationId,
      error: {
        code: errorCode,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    })
  }

  /**
   * Audit logging for critical actions (user management, deletions, etc.)
   * Story 1.1: Added audit method for tracking critical admin actions
   * @param message - Human-readable audit message
   * @param context - Audit context with correlationId, userId, action, etc.
   */
  audit(message: string, context: { correlationId: string; userId?: string; action?: string; [key: string]: unknown }) {
    this.log(LogLevel.INFO, {
      userId: context.userId,
      action: context.action || 'audit',
      correlationId: context.correlationId,
      metadata: {
        auditMessage: message,
        ...context,
      },
    })
  }
}

// Singleton instance
export const logger = new Logger()
