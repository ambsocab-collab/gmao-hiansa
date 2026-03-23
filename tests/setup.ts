/**
 * Vitest Setup File for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Global test setup for unit/integration tests
 */

import { afterEach, vi, expect } from 'vitest'
import { cleanup } from '@testing-library/react'

// Debug: Verify setup is being executed
console.log('[setup.ts] Loading jest-dom matchers...')

// Import jest-dom matchers as side effect (automatically extends vitest expect)
import '@testing-library/jest-dom/vitest'

// Debug: Verify matchers are loaded
console.log('[setup.ts] jest-dom matchers loaded, toBeInTheDocument:', typeof expect('').toBeInTheDocument)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
