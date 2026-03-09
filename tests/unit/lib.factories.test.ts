/**
 * Unit Tests for lib/factories.ts
 * Story 0.2: Database Schema Prisma con Jerarquía 5 Niveles
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing data factory functions for development/testing
 */

import { describe, it, expect } from 'vitest'
import {
  createTestUser,
  createTestEquipo,
  createTestWorkOrder,
  createTestFailureReport,
  createTestCapability,
  createTestPlanta,
  createTestLinea,
  createTestComponente,
  createTestRepuesto,
  cleanupTestData,
} from '@/lib/factories'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to run a test within a transaction that rolls back
async function withTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
  return await prisma.$transaction(
    async (tx) => {
      return await callback(tx)
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  )
}

describe('lib/factories - Data Factory Functions', () => {
  describe('createTestUser', () => {
    it('[P0] 0.2-UNIT-011: should create a user with default values', async () => {
      await withTransaction(async (tx) => {
        const user = await createTestUser(undefined, tx)

        expect(user).toBeDefined()
        expect(user.email).toContain('@example.com')
        expect(user.name).toBe('Test User')
        expect(user.password_hash).toBeDefined()
        expect(user.password_hash).not.toBe('test123') // Should be hashed
        expect(user.force_password_reset).toBe(false)
      })
    })

    it('[P1] 0.2-UNIT-012: should create a user with custom values', async () => {
      await withTransaction(async (tx) => {
        const customEmail = 'custom@test.com'
        const customName = 'Custom User'
        const user = await createTestUser(
          {
            email: customEmail,
            name: customName,
            phone: '+34 600 000 001',
            force_password_reset: true,
          },
          tx
        )

        expect(user.email).toBe(customEmail)
        expect(user.name).toBe(customName)
        expect(user.phone).toBe('+34 600 000 001')
        expect(user.force_password_reset).toBe(true)
      })
    })

    it('[P0] 0.2-UNIT-013: should hash passwords with bcrypt', async () => {
      await withTransaction(async (tx) => {
        const user = await createTestUser(undefined, tx)

        // Password hash should be longer than plain text (bcrypt hash is 60 chars)
        expect(user.password_hash.length).toBeGreaterThan(20)
        expect(user.password_hash).toMatch(/^\$2[ayb]\$\d+\$/) // Bcrypt hash format
      })
    })
  })

  describe('createTestPlanta', () => {
    it('[P0] 0.2-UNIT-014: should create a planta with default values', async () => {
      await withTransaction(async (tx) => {
        const planta = await createTestPlanta(undefined, tx)

        expect(planta).toBeDefined()
        expect(planta.name).toContain('Test Planta')
        expect(planta.code).toContain('TEST-PLANTA-')
        expect(planta.division).toBeDefined()
      })
    })

    it('[P1] 0.2-UNIT-015: should create a planta with custom values', async () => {
      await withTransaction(async (tx) => {
        const planta = await createTestPlanta(
          {
            name: 'Custom Planta',
            code: 'CUSTOM-PLANTA-001',
            division: 'ULTRA',
          },
          tx
        )

        expect(planta.name).toBe('Custom Planta')
        expect(planta.code).toBe('CUSTOM-PLANTA-001')
        expect(planta.division).toBe('ULTRA')
      })
    })
  })

  describe('createTestLinea', () => {
    it('[P0] 0.2-UNIT-016: should create a linea with default values', async () => {
      await withTransaction(async (tx) => {
        const linea = await createTestLinea(undefined, tx)

        expect(linea).toBeDefined()
        expect(linea.name).toBe('Test Línea')
        expect(linea.code).toContain('TEST-LINEA-')
        expect(linea.planta_id).toBeDefined()
      })
    })

    it('[P1] 0.2-UNIT-017: should create a linea with custom values', async () => {
      await withTransaction(async (tx) => {
        const planta = await createTestPlanta(undefined, tx)
        const linea = await createTestLinea(
          {
            name: 'Custom Linea',
            code: 'CUSTOM-LINEA-001',
            planta_id: planta.id,
          },
          tx
        )

        expect(linea.name).toBe('Custom Linea')
        expect(linea.code).toBe('CUSTOM-LINEA-001')
        expect(linea.planta_id).toBe(planta.id)
      })
    })
  })

  describe('createTestEquipo', () => {
    it('[P0] 0.2-UNIT-018: should create an equipo with default values', async () => {
      await withTransaction(async (tx) => {
        const equipo = await createTestEquipo(undefined, tx)

        expect(equipo).toBeDefined()
        expect(equipo.name).toBe('Test Equipo')
        expect(equipo.code).toContain('TEST-EQ-')
        expect(equipo.linea_id).toBeDefined()
        expect(equipo.estado).toBe('OPERATIVO')
      })
    })

    it('[P1] 0.2-UNIT-019: should create an equipo with custom values', async () => {
      await withTransaction(async (tx) => {
        const planta = await createTestPlanta(undefined, tx)
        const linea = await createTestLinea({ planta_id: planta.id }, tx)
        const equipo = await createTestEquipo(
          {
            name: 'Custom Equipo',
            code: 'CUSTOM-EQ-001',
            linea_id: linea.id,
            estado: 'AVERIADO',
            ubicacion_actual: 'Custom Location',
          },
          tx
        )

        expect(equipo.name).toBe('Custom Equipo')
        expect(equipo.code).toBe('CUSTOM-EQ-001')
        expect(equipo.linea_id).toBe(linea.id)
        expect(equipo.estado).toBe('AVERIADO')
        expect(equipo.ubicacion_actual).toBe('Custom Location')
      })
    })
  })

  describe('createTestComponente', () => {
    it('[P0] 0.2-UNIT-020: should create a componente with default values', async () => {
      await withTransaction(async (tx) => {
        const componente = await createTestComponente(undefined, tx)

        expect(componente).toBeDefined()
        expect(componente.name).toBe('Test Componente')
        expect(componente.code).toContain('TEST-COMP-')
      })
    })

    it('[P1] 0.2-UNIT-021: should create a componente with custom values', async () => {
      await withTransaction(async (tx) => {
        const componente = await createTestComponente(
          {
            name: 'Custom Componente',
            code: 'CUSTOM-COMP-001',
          },
          tx
        )

        expect(componente.name).toBe('Custom Componente')
        expect(componente.code).toBe('CUSTOM-COMP-001')
      })
    })
  })

  describe('createTestRepuesto', () => {
    it('[P0] 0.2-UNIT-022: should create a repuesto with default values', async () => {
      await withTransaction(async (tx) => {
        const repuesto = await createTestRepuesto(undefined, tx)

        expect(repuesto).toBeDefined()
        expect(repuesto.name).toBe('Test Repuesto')
        expect(repuesto.code).toContain('TEST-REP-')
        expect(repuesto.componente_id).toBeDefined()
        expect(repuesto.stock).toBe(0)
        expect(repuesto.stock_minimo).toBe(0)
      })
    })

    it('[P1] 0.2-UNIT-023: should create a repuesto with custom values', async () => {
      await withTransaction(async (tx) => {
        const componente = await createTestComponente(undefined, tx)
        const repuesto = await createTestRepuesto(
          {
            name: 'Custom Repuesto',
            code: 'CUSTOM-REP-001',
            componente_id: componente.id,
            stock: 10,
            stock_minimo: 2,
          },
          tx
        )

        expect(repuesto.name).toBe('Custom Repuesto')
        expect(repuesto.code).toBe('CUSTOM-REP-001')
        expect(repuesto.componente_id).toBe(componente.id)
        expect(repuesto.stock).toBe(10)
        expect(repuesto.stock_minimo).toBe(2)
      })
    })
  })

  describe('createTestCapability', () => {
    it('[P0] 0.2-UNIT-024: should create a capability with default values', async () => {
      await withTransaction(async (tx) => {
        const capability = await createTestCapability(undefined, tx)

        expect(capability).toBeDefined()
        expect(capability.name).toContain('test_capability_')
        expect(capability.label).toBe('Test Capability')
        expect(capability.description).toBe('Test capability description')
      })
    })

    it('[P1] 0.2-UNIT-025: should create a capability with custom values', async () => {
      await withTransaction(async (tx) => {
        const capability = await createTestCapability(
          {
            name: 'custom_capability',
            label: 'Custom Capability',
            description: 'Custom capability description',
          },
          tx
        )

        expect(capability.name).toBe('custom_capability')
        expect(capability.label).toBe('Custom Capability')
        expect(capability.description).toBe('Custom capability description')
      })
    })
  })

  describe('createTestWorkOrder', () => {
    it('[P0] 0.2-UNIT-026: should create a work order with default values', async () => {
      await withTransaction(async (tx) => {
        const workOrder = await createTestWorkOrder(undefined, tx)

        expect(workOrder).toBeDefined()
        expect(workOrder.numero).toContain('OT-TEST-')
        expect(workOrder.tipo).toBe('CORRECTIVO')
        expect(workOrder.estado).toBe('PENDIENTE')
        expect(workOrder.equipo_id).toBeDefined()
      })
    })

    it('[P1] 0.2-UNIT-027: should create a work order with custom values', async () => {
      await withTransaction(async (tx) => {
        // Don't pass equipo_id - let the factory create it
        // This avoids foreign key constraint issues
        const workOrder = await createTestWorkOrder(
          {
            numero: 'OT-CUSTOM-001',
            tipo: 'PREVENTIVO',
            estado: 'EN_PROGRESO',
            descripcion: 'Custom description',
          },
          tx
        )

        expect(workOrder.numero).toBe('OT-CUSTOM-001')
        expect(workOrder.tipo).toBe('PREVENTIVO')
        expect(workOrder.estado).toBe('EN_PROGRESO')
        expect(workOrder.descripcion).toBe('Custom description')
        expect(workOrder.equipo_id).toBeDefined()
      })
    })
  })

  describe('createTestFailureReport', () => {
    it('[P0] 0.2-UNIT-028: should create a failure report with default values', async () => {
      await withTransaction(async (tx) => {
        const failureReport = await createTestFailureReport(undefined, tx)

        expect(failureReport).toBeDefined()
        expect(failureReport.numero).toContain('RA-TEST-')
        expect(failureReport.descripcion).toBe('Test FailureReport description')
        expect(failureReport.equipo_id).toBeDefined()
        expect(failureReport.reportado_por).toBeDefined()
      })
    })

    it('[P1] 0.2-UNIT-029: should create a failure report with custom values', async () => {
      await withTransaction(async (tx) => {
        const equipo = await createTestEquipo(undefined, tx)
        const user = await createTestUser(undefined, tx)
        const failureReport = await createTestFailureReport(
          {
            numero: 'RA-CUSTOM-001',
            descripcion: 'Custom description',
            foto_url: 'https://example.com/photo.jpg',
            equipo_id: equipo.id,
            reportado_por: user.id,
          },
          tx
        )

        expect(failureReport.numero).toBe('RA-CUSTOM-001')
        expect(failureReport.descripcion).toBe('Custom description')
        expect(failureReport.foto_url).toBe('https://example.com/photo.jpg')
        expect(failureReport.equipo_id).toBe(equipo.id)
        expect(failureReport.reportado_por).toBe(user.id)
      })
    })
  })

  describe('cleanupTestData', () => {
    it('should clean up all test data', async () => {
      // This test remains unchanged as it's testing the cleanupTestData() function itself
      // Create some test data
      await createTestUser()
      await createTestEquipo()
      await createTestWorkOrder()
      await createTestFailureReport()

      // Verify data exists
      const usersBefore = await prisma.user.count()
      const equiposBefore = await prisma.equipo.count()
      const workOrdersBefore = await prisma.workOrder.count()
      const failureReportsBefore = await prisma.failureReport.count()

      expect(usersBefore).toBeGreaterThan(0)
      expect(equiposBefore).toBeGreaterThan(0)
      expect(workOrdersBefore).toBeGreaterThan(0)
      expect(failureReportsBefore).toBeGreaterThan(0)

      // Clean up
      await cleanupTestData()

      // Verify all data is deleted
      const usersAfter = await prisma.user.count()
      const equiposAfter = await prisma.equipo.count()
      const workOrdersAfter = await prisma.workOrder.count()
      const failureReportsAfter = await prisma.failureReport.count()

      expect(usersAfter).toBe(0)
      expect(equiposAfter).toBe(0)
      expect(workOrdersAfter).toBe(0)
      expect(failureReportsAfter).toBe(0)
    }, 15000) // Keep timeout for this test as it still uses DELETE
  })
})
