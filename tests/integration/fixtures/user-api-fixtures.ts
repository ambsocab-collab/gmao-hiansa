/**
 * User API Integration Test Fixtures
 *
 * Shared setup for User API integration tests
 * Eliminates code duplication across split test files
 */

import { PrismaClient } from '@prisma/client'
import { beforeEach, afterEach } from 'vitest'

const prisma = new PrismaClient()

/**
 * Setup function for User API tests
 * Cleans up test data before and after each test
 */
export function setupUserAPITests() {
  beforeEach(async () => {
    // Cleanup test data before each test
    // Delete in correct order due to foreign key constraints
    await prisma.activityLog.deleteMany({})
    await prisma.auditLog.deleteMany({})
    await prisma.userCapability.deleteMany({})
    // Individual tests are responsible for their own user cleanup with deleteMany({})
  })

  afterEach(async () => {
    // Cleanup test data after each test
    await prisma.activityLog.deleteMany({})
    await prisma.auditLog.deleteMany({})
    await prisma.userCapability.deleteMany({})
    // Individual tests are responsible for their own user cleanup with deleteMany({})
  })
}

export { prisma }
