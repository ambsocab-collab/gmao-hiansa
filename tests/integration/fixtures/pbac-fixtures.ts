/**
 * PBAC Integration Test Fixtures
 *
 * Shared setup for PBAC middleware integration tests
 * Eliminates code duplication across split test files
 */

import { beforeEach, vi } from 'vitest'

/**
 * Setup function for PBAC tests
 * Clears all mocks before each test
 */
export function setupPBACTests() {
  beforeEach(() => {
    vi.clearAllMocks()
  })
}
