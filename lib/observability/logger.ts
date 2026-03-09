/**
 * Structured Logger for Vercel
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Logger con structured logging para Vercel
 * Todos los logs se envían a stdout en formato JSON
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
        console.debug(formattedLog)
        break
      case LogLevel.INFO:
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
    // Check if error has AppError properties using duck typing
    // This avoids circular dependency issues
    const isAppError =
      'code' in error &&
      'statusCode' in error &&
      'correlationId' in error &&
      typeof error.code === 'string'

    this.log(LogLevel.ERROR, {
      userId,
      action,
      correlationId,
      error: {
        code: isAppError ? (error as any).code : 'UNKNOWN_ERROR',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    })
  }
}

// Singleton instance
export const logger = new Logger()
