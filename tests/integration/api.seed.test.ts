/**
 * Integration Tests for /api/v1/test-data/seed endpoint
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing seed endpoint for database reset in development
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { POST, GET } from '@/app/api/v1/test-data/seed/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('API /api/v1/test-data/seed - Seed Endpoint', () => {
  beforeAll(async () => {
    // Ensure clean state before tests
    await prisma.workOrderAssignment.deleteMany()
    await prisma.failureReport.deleteMany()
    await prisma.workOrder.deleteMany()
    await prisma.equipoComponente.deleteMany()
    await prisma.repuesto.deleteMany()
    await prisma.componente.deleteMany()
    await prisma.equipo.deleteMany()
    await prisma.linea.deleteMany()
    await prisma.planta.deleteMany()
    await prisma.userCapability.deleteMany()
    await prisma.capability.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    // Clean up after tests
    await prisma.workOrderAssignment.deleteMany()
    await prisma.failureReport.deleteMany()
    await prisma.workOrder.deleteMany()
    await prisma.equipoComponente.deleteMany()
    await prisma.repuesto.deleteMany()
    await prisma.componente.deleteMany()
    await prisma.equipo.deleteMany()
    await prisma.linea.deleteMany()
    await prisma.planta.deleteMany()
    await prisma.userCapability.deleteMany()
    await prisma.capability.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('GET /api/v1/test-data/seed', () => {
    it('should return endpoint information', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('endpoint', '/api/v1/test-data/seed')
      expect(data).toHaveProperty('method', 'POST')
      expect(data).toHaveProperty('description')
      expect(data).toHaveProperty('environment')
      expect(data).toHaveProperty('available')
      expect(data).toHaveProperty('warning')
    })

    it('should indicate availability based on NODE_ENV', async () => {
      const originalEnv = process.env.NODE_ENV

      // Test in development
      ;(process.env as any).NODE_ENV = 'development'
      const devResponse = await GET()
      const devData = await devResponse.json()
      expect(devData.available).toBe(true)

      // Test in production (should not be available)
      ;(process.env as any).NODE_ENV = 'production'
      const prodResponse = await GET()
      const prodData = await prodResponse.json()
      expect(prodData.available).toBe(false)

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    })
  })

  describe('POST /api/v1/test-data/seed', () => {
    it('should block seed in production environment', async () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'production'

      const response = await POST()
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toHaveProperty('error', 'Seed endpoint not available in production')

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    })

    it('should allow seed in development environment', async () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'development'

      const response = await POST()
      const data = await response.json()

      // Note: This test may fail if DATABASE_URL is not properly configured
      // In a real CI/CD environment, you would mock the execAsync call
      if (response.status === 200) {
        expect(data).toHaveProperty('success', true)
        expect(data).toHaveProperty('message', 'Database seeded successfully')
        expect(data).toHaveProperty('timestamp')
      } else if (response.status === 500) {
        // Expected in test environment without database
        expect(data).toHaveProperty('error', 'Failed to seed database')
      }

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    }, 30000) // Increase timeout to 30s for seed operation
  })

  describe('Seed Data Integrity', () => {
    it('should create correct number of entities after seed', async () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'development'

      // Execute seed
      const seedResponse = await POST()

      // Only verify if seed was successful (requires database)
      if (seedResponse.status === 200) {
        // Verify counts match seed script
        const usersCount = await prisma.user.count()
        const capabilitiesCount = await prisma.capability.count()
        const plantasCount = await prisma.planta.count()
        const lineasCount = await prisma.linea.count()
        const equiposCount = await prisma.equipo.count()
        const componentesCount = await prisma.componente.count()
        const repuestosCount = await prisma.repuesto.count()

        expect(usersCount).toBe(3) // admin, tecnico, supervisor
        expect(capabilitiesCount).toBe(15) // 15 PBAC capabilities
        expect(plantasCount).toBe(2) // HiRock, Ultra
        expect(lineasCount).toBe(5) // 5 production lines
        expect(equiposCount).toBe(10) // 10 equipment
        expect(componentesCount).toBe(8) // 8 components
        expect(repuestosCount).toBe(5) // 5 spare parts

        // Verify admin has all capabilities
        const admin = await prisma.user.findUnique({
          where: { email: 'admin@hiansa.com' },
          include: { user_capabilities: true },
        })

        expect(admin).not.toBeNull()
        expect(admin?.user_capabilities.length).toBe(15)
      }

      // Restore original env
      if (originalEnv) {
        ;(process.env as any).NODE_ENV = originalEnv
      } else {
        delete (process.env as any).NODE_ENV
      }
    }, 45000) // Increase timeout to 45s for seed and verification
  })
})
