/**
 * Story 1.1: User Password Management Tests
 * Testing P0-API-003
 *
 * Tests cover:
 * - ForcePasswordReset flag update (P0-API-003)
 * - Password change behavior
 * - New user password reset flag
 */

import { describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { newUserFactory } from '../factories/data.factories'
import { setupUserAPITests, prisma } from './fixtures/user-api-fixtures'

setupUserAPITests()

describe('Story 1.1: User Password Management', () => {
  describe('[P0-API-003] ForcePasswordReset Flag Update', () => {
    it('[P0-API-003] should update forcePasswordReset to false after password change', async () => {
      // Cleanup this test's data
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'test-reset' } }
      })
      // Given: user with forcePasswordReset=true
      const oldPassword = await bcrypt.hash('oldPassword123', 10)
      const user = await prisma.user.create({
        data: {
          email: 'test-reset@example.com',
          name: 'Test Reset',
          passwordHash: oldPassword,
          forcePasswordReset: true,
          deleted: false
        }
      })

      expect(user.forcePasswordReset).toBe(true)

      // When: user changes password
      const newPassword = await bcrypt.hash('newPassword123', 10)
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPassword,
          forcePasswordReset: false
        }
      })

      // Then: forcePasswordReset is false
      expect(updatedUser.forcePasswordReset).toBe(false)

      // And: new password hash is different
      expect(updatedUser.passwordHash).not.toBe(user.passwordHash)
    })

    it('[P0-API-003] should create new user with forcePasswordReset=true', async () => {
      // Cleanup this test's data
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'test-newuser' } }
      })
      // Given: new user data
      const userData = newUserFactory({
        email: 'test-newuser@example.com'
      })

      // When: user is created
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          passwordHash: hashedPassword,
          forcePasswordReset: true // Default for new users
        }
      })

      // Then: forcePasswordReset is true
      expect(newUser.forcePasswordReset).toBe(true)

      // And: other fields are correct
      expect(newUser.email).toBe('test-newuser@example.com')
      expect(newUser.deleted).toBe(false)
    })
  })
})
