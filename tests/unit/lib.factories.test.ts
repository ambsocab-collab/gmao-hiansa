/**
 * Unit Tests for lib/factories.ts
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing data factory functions for development/testing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
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

describe('lib/factories - Data Factory Functions', () => {
  beforeEach(async () => {
    // Clean up before each test to ensure isolation
    await cleanupTestData()
  })

  afterEach(async () => {
    // Clean up after each test
    await cleanupTestData()
  })

  describe('createTestUser', () => {
    it('should create a user with default values', async () => {
      const user = await createTestUser()

      expect(user).toBeDefined()
      expect(user.email).toContain('@example.com')
      expect(user.name).toBe('Test User')
      expect(user.password_hash).toBeDefined()
      expect(user.password_hash).not.toBe('test123') // Should be hashed
      expect(user.force_password_reset).toBe(false)
    })

    it('should create a user with custom values', async () => {
      const customEmail = 'custom@test.com'
      const customName = 'Custom User'
      const user = await createTestUser({
        email: customEmail,
        name: customName,
        phone: '+34 600 000 001',
        force_password_reset: true,
      })

      expect(user.email).toBe(customEmail)
      expect(user.name).toBe(customName)
      expect(user.phone).toBe('+34 600 000 001')
      expect(user.force_password_reset).toBe(true)
    })

    it('should hash passwords with bcrypt', async () => {
      const user = await createTestUser()

      // Password hash should be longer than plain text (bcrypt hash is 60 chars)
      expect(user.password_hash.length).toBeGreaterThan(20)
      expect(user.password_hash).toMatch(/^\$2[ayb]\$\d+\$/) // Bcrypt hash format
    })
  })

  describe('createTestPlanta', () => {
    it('should create a planta with default values', async () => {
      const planta = await createTestPlanta()

      expect(planta).toBeDefined()
      expect(planta.name).toContain('Test Planta')
      expect(planta.code).toContain('TEST-PLANTA-')
      expect(planta.division).toBeDefined()
    })

    it('should create a planta with custom values', async () => {
      const planta = await createTestPlanta({
        name: 'Custom Planta',
        code: 'CUSTOM-PLANTA-001',
        division: 'ULTRA',
      })

      expect(planta.name).toBe('Custom Planta')
      expect(planta.code).toBe('CUSTOM-PLANTA-001')
      expect(planta.division).toBe('ULTRA')
    })
  })

  describe('createTestLinea', () => {
    it('should create a linea with default values', async () => {
      const linea = await createTestLinea()

      expect(linea).toBeDefined()
      expect(linea.name).toBe('Test Línea')
      expect(linea.code).toContain('TEST-LINEA-')
      expect(linea.planta_id).toBeDefined()
    })

    it('should create a linea with custom values', async () => {
      const planta = await createTestPlanta()
      const linea = await createTestLinea({
        name: 'Custom Linea',
        code: 'CUSTOM-LINEA-001',
        planta_id: planta.id,
      })

      expect(linea.name).toBe('Custom Linea')
      expect(linea.code).toBe('CUSTOM-LINEA-001')
      expect(linea.planta_id).toBe(planta.id)
    })
  })

  describe('createTestEquipo', () => {
    it('should create an equipo with default values', async () => {
      const equipo = await createTestEquipo()

      expect(equipo).toBeDefined()
      expect(equipo.name).toBe('Test Equipo')
      expect(equipo.code).toContain('TEST-EQ-')
      expect(equipo.linea_id).toBeDefined()
      expect(equipo.estado).toBe('OPERATIVO')
    })

    it('should create an equipo with custom values', async () => {
      const planta = await createTestPlanta()
      const linea = await createTestLinea({ planta_id: planta.id })
      const equipo = await createTestEquipo({
        name: 'Custom Equipo',
        code: 'CUSTOM-EQ-001',
        linea_id: linea.id,
        estado: 'AVERIADO',
        ubicacion_actual: 'Custom Location',
      })

      expect(equipo.name).toBe('Custom Equipo')
      expect(equipo.code).toBe('CUSTOM-EQ-001')
      expect(equipo.linea_id).toBe(linea.id)
      expect(equipo.estado).toBe('AVERIADO')
      expect(equipo.ubicacion_actual).toBe('Custom Location')
    })
  })

  describe('createTestComponente', () => {
    it('should create a componente with default values', async () => {
      const componente = await createTestComponente()

      expect(componente).toBeDefined()
      expect(componente.name).toBe('Test Componente')
      expect(componente.code).toContain('TEST-COMP-')
    })

    it('should create a componente with custom values', async () => {
      const componente = await createTestComponente({
        name: 'Custom Componente',
        code: 'CUSTOM-COMP-001',
      })

      expect(componente.name).toBe('Custom Componente')
      expect(componente.code).toBe('CUSTOM-COMP-001')
    })
  })

  describe('createTestRepuesto', () => {
    it('should create a repuesto with default values', async () => {
      const repuesto = await createTestRepuesto()

      expect(repuesto).toBeDefined()
      expect(repuesto.name).toBe('Test Repuesto')
      expect(repuesto.code).toContain('TEST-REP-')
      expect(repuesto.componente_id).toBeDefined()
      expect(repuesto.stock).toBe(0)
      expect(repuesto.stock_minimo).toBe(0)
    })

    it('should create a repuesto with custom values', async () => {
      const componente = await createTestComponente()
      const repuesto = await createTestRepuesto({
        name: 'Custom Repuesto',
        code: 'CUSTOM-REP-001',
        componente_id: componente.id,
        stock: 10,
        stock_minimo: 2,
      })

      expect(repuesto.name).toBe('Custom Repuesto')
      expect(repuesto.code).toBe('CUSTOM-REP-001')
      expect(repuesto.componente_id).toBe(componente.id)
      expect(repuesto.stock).toBe(10)
      expect(repuesto.stock_minimo).toBe(2)
    })
  })

  describe('createTestCapability', () => {
    it('should create a capability with default values', async () => {
      const capability = await createTestCapability()

      expect(capability).toBeDefined()
      expect(capability.name).toContain('test_capability_')
      expect(capability.label).toBe('Test Capability')
      expect(capability.description).toBe('Test capability description')
    })

    it('should create a capability with custom values', async () => {
      const capability = await createTestCapability({
        name: 'custom_capability',
        label: 'Custom Capability',
        description: 'Custom capability description',
      })

      expect(capability.name).toBe('custom_capability')
      expect(capability.label).toBe('Custom Capability')
      expect(capability.description).toBe('Custom capability description')
    })
  })

  describe('createTestWorkOrder', () => {
    it('should create a work order with default values', async () => {
      const workOrder = await createTestWorkOrder()

      expect(workOrder).toBeDefined()
      expect(workOrder.numero).toContain('OT-TEST-')
      expect(workOrder.tipo).toBe('CORRECTIVO')
      expect(workOrder.estado).toBe('PENDIENTE')
      expect(workOrder.equipo_id).toBeDefined()
    })

    it('should create a work order with custom values', async () => {
      // Don't pass equipo_id - let the factory create it
      // This avoids foreign key constraint issues
      const workOrder = await createTestWorkOrder({
        numero: 'OT-CUSTOM-001',
        tipo: 'PREVENTIVO',
        estado: 'EN_PROGRESO',
        descripcion: 'Custom description',
      })

      expect(workOrder.numero).toBe('OT-CUSTOM-001')
      expect(workOrder.tipo).toBe('PREVENTIVO')
      expect(workOrder.estado).toBe('EN_PROGRESO')
      expect(workOrder.descripcion).toBe('Custom description')
      expect(workOrder.equipo_id).toBeDefined()
    })
  })

  describe('createTestFailureReport', () => {
    it('should create a failure report with default values', async () => {
      const failureReport = await createTestFailureReport()

      expect(failureReport).toBeDefined()
      expect(failureReport.numero).toContain('RA-TEST-')
      expect(failureReport.descripcion).toBe('Test FailureReport description')
      expect(failureReport.equipo_id).toBeDefined()
      expect(failureReport.reportado_por).toBeDefined()
    })

    it('should create a failure report with custom values', async () => {
      const equipo = await createTestEquipo()
      const user = await createTestUser()
      const failureReport = await createTestFailureReport({
        numero: 'RA-CUSTOM-001',
        descripcion: 'Custom description',
        foto_url: 'https://example.com/photo.jpg',
        equipo_id: equipo.id,
        reportado_por: user.id,
      })

      expect(failureReport.numero).toBe('RA-CUSTOM-001')
      expect(failureReport.descripcion).toBe('Custom description')
      expect(failureReport.foto_url).toBe('https://example.com/photo.jpg')
      expect(failureReport.equipo_id).toBe(equipo.id)
      expect(failureReport.reportado_por).toBe(user.id)
    })
  })

  describe('cleanupTestData', () => {
    it('should clean up all test data', async () => {
      // Increase timeout for database cleanup operation
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
    }, 15000) // Increase timeout to 15s for database cleanup
  })
})
