/**
 * Story 1.1: User Email Validation Tests
 * Testing P0-API-002
 *
 * Tests cover:
 * - Email uniqueness validation (P0-API-002)
 * - Duplicate email prevention
 * - Multiple user support
 */

import { describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { setupUserAPITests, prisma } from './fixtures/user-api-fixtures'

setupUserAPITests()

describe('Story 1.1: User Email Validation', () => {
  describe('[P0-API-002] Email Uniqueness Validation', () => {
    it('[P0-API-002] should validate email uniqueness on registration', async () => {
      // Cleanup this test's data
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'existing' } }
      })

      // And: existing user
      const hashedPassword = await bcrypt.hash('password123', 10)
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Existing',
          passwordHash: hashedPassword,
          forcePasswordReset: false
        }
      })

      // When: attempting to create user with same email
      // Then: should throw unique constraint violation
      await expect(prisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Duplicate',
          passwordHash: hashedPassword,
          forcePasswordReset: false
        }
      })).rejects.toThrow()
    })

    it('[P0-API-002] should allow users with different emails', async () => {
      // Cleanup this test's data
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'user' } }
      })

      // And: existing user
      const hashedPassword = await bcrypt.hash('password123', 10)
      await prisma.user.create({
        data: {
          email: 'user1@example.com',
          name: 'User One',
          passwordHash: hashedPassword,
          forcePasswordReset: false
        }
      })

      // When: creating user with different email
      const newUser = await prisma.user.create({
        data: {
          email: 'user2@example.com',
          name: 'User Two',
          passwordHash: hashedPassword,
          forcePasswordReset: false
        }
      })

      // Then: second user created successfully
      expect(newUser.email).toBe('user2@example.com')
      expect(newUser.name).toBe('User Two')

      // And: both users exist in database
      const allUsers = await prisma.user.findMany({
        where: { email: { in: ['user1@example.com', 'user2@example.com'] } }
      })
      expect(allUsers).toHaveLength(2)
    })
  })
})
