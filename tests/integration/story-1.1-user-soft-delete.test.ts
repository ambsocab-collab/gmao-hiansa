/**
 * Story 1.1: User Soft Delete Tests
 * Testing P0-API-004
 *
 * Tests cover:
 * - Soft delete flag setting (P0-API-004)
 * - Deleted user filtering
 * - Query behavior with deleted flag
 */

import { describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { setupUserAPITests, prisma } from './fixtures/user-api-fixtures'

setupUserAPITests()

describe('Story 1.1: User Soft Delete', () => {
  describe('[P0-API-004] Soft Delete Flag Setting', () => {
    it('[P0-API-004] should set deleted flag on soft delete', async () => {
      // Cleanup this test's data
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'test-delete' } }
      })
      // Given: existing user
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await prisma.user.create({
        data: {
          email: 'test-delete@example.com',
          name: 'ToDelete',
          passwordHash: hashedPassword,
          deleted: false
        }
      })

      expect(user.deleted).toBe(false)

      // When: soft delete is performed
      const deletedUser = await prisma.user.update({
        where: { id: user.id },
        data: { deleted: true }
      })

      // Then: user is marked as deleted
      expect(deletedUser.deleted).toBe(true)

      // And: user still exists in database (not hard deleted)
      const userStillExists = await prisma.user.findUnique({
        where: { id: user.id }
      })
      expect(userStillExists).not.toBeNull()
      expect(userStillExists?.deleted).toBe(true)
    })

    it('[P0-API-004] should filter out deleted users from queries', async () => {
      // Cleanup this test's data and data from other tests
      await prisma.user.deleteMany({
        where: {
          OR: [
            { email: { startsWith: 'active' } },
            { email: { startsWith: 'deleted' } },
            { email: { startsWith: 'user' } },
            { email: { startsWith: 'existing' } }
          ]
        }
      })

      // And: mix of active and deleted users
      const hashedPassword = await bcrypt.hash('password123', 10)

      await prisma.user.createMany({
        data: [
          {
            email: 'active1@example.com',
            name: 'Active 1',
            passwordHash: hashedPassword,
            deleted: false
          },
          {
            email: 'active2@example.com',
            name: 'Active 2',
            passwordHash: hashedPassword,
            deleted: false
          },
          {
            email: 'deleted1@example.com',
            name: 'Deleted 1',
            passwordHash: hashedPassword,
            deleted: true
          },
          {
            email: 'deleted2@example.com',
            name: 'Deleted 2',
            passwordHash: hashedPassword,
            deleted: true
          }
        ]
      })

      // When: querying all users
      const allUsers = await prisma.user.findMany()

      // Then: all 4 users exist (including deleted)
      expect(allUsers).toHaveLength(4)

      // When: querying only active users
      const activeUsers = await prisma.user.findMany({
        where: { deleted: false }
      })

      // Then: only 2 active users returned
      expect(activeUsers).toHaveLength(2)
      expect(activeUsers.every(u => u.deleted === false)).toBe(true)

      // When: querying only deleted users
      const deletedUsers = await prisma.user.findMany({
        where: { deleted: true }
      })

      // Then: only 2 deleted users returned
      expect(deletedUsers).toHaveLength(2)
      expect(deletedUsers.every(u => u.deleted === true)).toBe(true)
    })
  })
})
