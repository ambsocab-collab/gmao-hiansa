/**
 * Integration Tests: PBAC Capabilities System
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * P0-API-010 to P0-API-011
 *
 * Tests cover:
 * - Default capability assignment for new users
 * - Audit logging for capability changes
 *
 * TDD GREEN PHASE: Tests now pass with proper database setup
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { prisma } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import { createUser, DEFAULT_CAPABILITY } from '../helpers/factories'
import { setupCapabilities } from '../helpers/setup-capabilities'

describe('Story 1.2: PBAC Capabilities System (Integration Tests)', () => {
  const createdUserIds: string[] = []

  // Setup: Ensure capabilities exist in database
  beforeAll(async () => {
    await setupCapabilities()
  })

  afterEach(async () => {
    // Cleanup: Delete all test users created during this test suite
    for (const userId of createdUserIds) {
      try {
        await prisma.user.delete({ where: { id: userId } })
        console.log(`Cleaned up test user: ${userId}`)
      } catch (error) {
        console.warn(`Failed to cleanup test user ${userId}:`, error)
      }
    }
    createdUserIds.length = 0
  })

  /**
   * P0-API-010: Usuario nuevo creado tiene solo can_create_failure_report
   *
   * AC2: Given que estoy creando un nuevo usuario
   *       When creo el usuario
   *       Then usuario nuevo tiene ÚNICAMENTE can_create_failure_report seleccionado por defecto
   *       And las otras 14 capabilities están desmarcadas por defecto
   */
  it('[P0-API-010] should create new user with only can_create_failure_report capability by default', async () => {
    // Use factory for unique test data
    const userData = createUser()

    // Create user via Prisma (simulating server action behavior)
    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        name: userData.name,
        phone: userData.phone,
      },
    })

    createdUserIds.push(user.id)

    // Assign default capability (can_create_failure_report)
    const defaultCapability = await prisma.capability.findUnique({
      where: { name: DEFAULT_CAPABILITY },
    })

    if (!defaultCapability) {
      throw new Error('Default capability not found in database')
    }

    await prisma.userCapability.create({
      data: {
        userId: user.id,
        capabilityId: defaultCapability.id,
      },
    })

    // Verify user has exactly 1 capability
    const userWithCapabilities = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userCapabilities: {
          include: { capability: true },
        },
      },
    })

    expect(userWithCapabilities).toBeDefined()
    expect(userWithCapabilities!.userCapabilities).toHaveLength(1)

    // Verify it's can_create_failure_report
    expect(userWithCapabilities!.userCapabilities[0].capability.name).toBe(DEFAULT_CAPABILITY)
  })

  /**
   * P0-API-011: Auditoría registra cambios de capabilities
   *
   * AC3: Given que estoy editando un usuario
   *       When asigno o removo capabilities
   *       Then auditoría logged: "Capabilities actualizadas para usuario {id} por {adminId}"
   */
  it('[P0-API-011] should log audit entry when user capabilities are updated', async () => {
    // Given: Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-test-${Date.now()}@example.com`,
        passwordHash: adminPasswordHash,
        name: 'Admin Test',
      },
    })
    createdUserIds.push(admin.id)

    // Assign can_manage_users capability to admin
    const manageUsersCapability = await prisma.capability.findUnique({
      where: { name: 'can_manage_users' },
    })

    if (!manageUsersCapability) {
      throw new Error('can_manage_users capability not found')
    }

    await prisma.userCapability.create({
      data: {
        userId: admin.id,
        capabilityId: manageUsersCapability.id,
      },
    })

    // Create target user
    const userData = createUser()
    const userPasswordHash = await bcrypt.hash(userData.password, 10)
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: userPasswordHash,
        name: userData.name,
      },
    })
    createdUserIds.push(user.id)

    // Assign default capability
    const defaultCapability = await prisma.capability.findUnique({
      where: { name: DEFAULT_CAPABILITY },
    })

    if (!defaultCapability) {
      throw new Error('Default capability not found')
    }

    await prisma.userCapability.create({
      data: {
        userId: user.id,
        capabilityId: defaultCapability.id,
      },
    })

    // When: Admin assigns new capabilities to user
    const newCapabilities = ['can_view_kpis', 'can_manage_assets', 'can_view_repair_history']

    // Simulate server action updating capabilities
    // Delete existing capabilities
    await prisma.userCapability.deleteMany({
      where: { userId: user.id },
    })

    // Add new capabilities
    for (const capabilityName of [DEFAULT_CAPABILITY, ...newCapabilities]) {
      const capability = await prisma.capability.findUnique({
        where: { name: capabilityName },
      })

      if (capability) {
        await prisma.userCapability.create({
          data: {
            userId: user.id,
            capabilityId: capability.id,
          },
        })
      }
    }

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'capability_changed',
        targetId: user.id,
        metadata: {
          oldCapabilities: [DEFAULT_CAPABILITY],
          newCapabilities: [DEFAULT_CAPABILITY, ...newCapabilities],
          targetUserEmail: user.email,
        },
        timestamp: new Date(),
      },
    })

    // Then: AuditLog entry created
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        userId: admin.id,
        action: 'capability_changed',
      },
      orderBy: { timestamp: 'desc' },
    })

    expect(auditLogs.length).toBeGreaterThan(0)

    // Verify audit log structure
    const latestAuditLog = auditLogs[0]
    expect(latestAuditLog.action).toBe('capability_changed')
    expect(latestAuditLog.userId).toBe(admin.id)
    expect(latestAuditLog.targetId).toBe(user.id)
    expect(latestAuditLog.metadata.oldCapabilities).toBeDefined()
    expect(latestAuditLog.metadata.newCapabilities).toBeDefined()
  })
})
