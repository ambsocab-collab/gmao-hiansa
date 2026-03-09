/**
 * Custom Error Classes
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Custom error classes for consistent error handling throughout the application.
 * All error messages are in Spanish for end users.
 *
 * Each error includes:
 * - code: Error code for programmatic handling
 * - message: User-facing error message in Spanish
 * - details: Additional context (optional)
 * - timestamp: When the error occurred
 * - correlationId: UUID for tracking end-to-end
 */

/**
 * Base error class for all application errors
 * Includes correlation ID for tracking end-to-end
 */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>
  public readonly timestamp: Date
  public readonly correlationId: string

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: Record<string, unknown>,
    correlationId?: string
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.timestamp = new Date()
    this.correlationId = correlationId || crypto.randomUUID()

    // Maintains proper stack trace (V8 engines)
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      correlationId: this.correlationId
    }
  }

  toString() {
    return `[${this.code}] ${this.message} (Correlation ID: ${this.correlationId})`
  }
}

/**
 * Validation error (400)
 * Thrown when input data is invalid
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    correlationId?: string
  ) {
    super(message, 400, 'VALIDATION_ERROR', details, correlationId)
  }
}

/**
 * Authorization error (403)
 * Thrown when user lacks required capability (PBAC)
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'No tienes permiso para realizar esta acción',
    details?: Record<string, unknown>,
    correlationId?: string
  ) {
    super(message, 403, 'AUTHORIZATION_ERROR', details, correlationId)
  }
}

/**
 * Authentication error (401)
 * Thrown when login or authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Credenciales inválidas',
    details?: Record<string, unknown>,
    correlationId?: string
  ) {
    super(message, 401, 'AUTHENTICATION_ERROR', details, correlationId)
  }
}

/**
 * Insufficient stock error (400)
 * Domain-specific for parts inventory management
 */
export class InsufficientStockError extends AppError {
  constructor(
    available: number,
    requested: number,
    repuestoId: string,
    correlationId?: string
  ) {
    const message = `Stock insuficiente: disponibles ${available}, solicitados ${requested}`
    super(
      message,
      400,
      'INSUFFICIENT_STOCK',
      { available, requested, repuestoId },
      correlationId
    )
  }
}

/**
 * Internal server error (500)
 * Thrown for unexpected server errors
 */
export class InternalError extends AppError {
  constructor(
    message: string = 'Error interno del servidor',
    details?: Record<string, unknown>,
    correlationId?: string
  ) {
    super(message, 500, 'INTERNAL_ERROR', details, correlationId)
  }
}
