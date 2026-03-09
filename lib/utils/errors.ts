/**
 * Custom Error Classes
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Custom error classes for consistent error handling throughout the application.
 * All error messages are in Spanish for end users.
 */

/**
 * Base error for all application errors
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation error (400)
 * Thrown when input data is invalid
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

/**
 * Authorization error (403)
 * Thrown when user attempts to access a resource without permissions
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'No tienes permiso para realizar esta acción') {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}

/**
 * Authentication error (401)
 * Thrown when login or authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Credenciales inválidas') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

/**
 * Insufficient stock error (400)
 * Domain-specific for parts inventory management
 */
export class InsufficientStockError extends AppError {
  constructor(message: string = 'Stock insuficiente') {
    super(message, 400)
    this.name = 'InsufficientStockError'
  }
}
