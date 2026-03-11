// lib/factories.ts
// Data Factory Functions para Testing
// Story 0.2: Database Schema con Jerarquía 5 Niveles

import { PrismaClient, Division, EquipoEstado } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Type for transaction client - the client passed to $transaction callback
type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * Factory para crear Users de prueba
 */
export async function createTestUser(
  overrides?: {
    email?: string
    name?: string
    phone?: string
    forcePasswordReset?: boolean
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  const passwordHash = await bcrypt.hash('test123', 10)
  return client.user.create({
    data: {
      email: overrides?.email || `test-${Date.now()}@example.com`,
      passwordHash,
      name: overrides?.name || 'Test User',
      phone: overrides?.phone || '+34 600 000 000',
      forcePasswordReset: overrides?.forcePasswordReset ?? false,
    },
  })
}

/**
 * Factory para crear Equipos de prueba
 */
export async function createTestEquipo(
  overrides?: {
    name?: string
    code?: string
    linea_id?: string
    estado?: EquipoEstado
    ubicacion_actual?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  // Si no se proporciona linea_id, crear una línea de prueba primero
  let lineaId = overrides?.linea_id
  if (!lineaId) {
    const planta = await client.planta.create({
      data: {
        name: `Test Planta ${Date.now()}`,
        code: `TEST-PLANTA-${Date.now()}`,
        division: Division.HIROCK,
      },
    })

    const linea = await client.linea.create({
      data: {
        name: 'Test Línea',
        code: `TEST-LINEA-${Date.now()}`,
        planta_id: planta.id,
      },
    })

    lineaId = linea.id
  }

  return client.equipo.create({
    data: {
      name: overrides?.name || 'Test Equipo',
      code: overrides?.code || `TEST-EQ-${Date.now()}`,
      linea_id: lineaId!,
      estado: overrides?.estado || EquipoEstado.OPERATIVO,
      ubicacion_actual: overrides?.ubicacion_actual || 'Test Location',
    },
  })
}

/**
 * Factory para crear WorkOrders de prueba
 */
export async function createTestWorkOrder(
  overrides?: {
    numero?: string
    tipo?: 'PREVENTIVO' | 'CORRECTIVO'
    estado?: string
    descripcion?: string
    equipo_id?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  // Si no se proporciona equipo_id, crear uno primero
  let equipoId = overrides?.equipo_id
  if (!equipoId) {
    const equipo = await createTestEquipo(undefined, tx)
    equipoId = equipo.id
  }

  return client.workOrder.create({
    data: {
      numero: overrides?.numero || `OT-TEST-${Date.now()}`,
      tipo: overrides?.tipo || 'CORRECTIVO',
      estado: (overrides?.estado as 'PENDIENTE' | 'ASIGNADA' | 'EN_PROGRESO' | 'PENDIENTE_REPUESTO' | 'PENDIENTE_PARADA' | 'REPARACION_EXTERNA' | 'COMPLETADA' | 'DESCARTADA') || 'PENDIENTE',
      descripcion: overrides?.descripcion || 'Test WorkOrder description',
      equipo_id: equipoId!,
    },
  })
}

/**
 * Factory para crear FailureReports de prueba
 */
export async function createTestFailureReport(
  overrides?: {
    numero?: string
    descripcion?: string
    foto_url?: string
    equipo_id?: string
    reportado_por?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  // Si no se proporciona equipo_id, crear uno primero
  let equipoId = overrides?.equipo_id
  if (!equipoId) {
    const equipo = await createTestEquipo(undefined, tx)
    equipoId = equipo.id
  }

  // Si no se proporciona reportado_por, crear un usuario primero
  let reportadoPor = overrides?.reportado_por
  if (!reportadoPor) {
    const user = await createTestUser(undefined, tx)
    reportadoPor = user.id
  }

  return client.failureReport.create({
    data: {
      numero: overrides?.numero || `RA-TEST-${Date.now()}`,
      descripcion: overrides?.descripcion || 'Test FailureReport description',
      foto_url: overrides?.foto_url,
      equipo_id: equipoId!,
      reportado_por: reportadoPor!,
    },
  })
}

/**
 * Factory para crear Capabilities de prueba
 */
export async function createTestCapability(
  overrides?: {
    name?: string
    label?: string
    description?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  return client.capability.create({
    data: {
      name: overrides?.name || `test_capability_${Date.now()}`,
      label: overrides?.label || 'Test Capability',
      description: overrides?.description || 'Test capability description',
    },
  })
}

/**
 * Factory para crear Plantas de prueba
 */
export async function createTestPlanta(
  overrides?: {
    name?: string
    code?: string
    division?: Division
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  return client.planta.create({
    data: {
      name: overrides?.name || `Test Planta ${Date.now()}`,
      code: overrides?.code || `TEST-PLANTA-${Date.now()}`,
      division: overrides?.division || Division.HIROCK,
    },
  })
}

/**
 * Factory para crear Lineas de prueba
 */
export async function createTestLinea(
  overrides?: {
    name?: string
    code?: string
    planta_id?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  // Si no se proporciona planta_id, crear una primero
  let plantaId = overrides?.planta_id
  if (!plantaId) {
    const planta = await createTestPlanta(undefined, tx)
    plantaId = planta.id
  }

  return client.linea.create({
    data: {
      name: overrides?.name || 'Test Línea',
      code: overrides?.code || `TEST-LINEA-${Date.now()}`,
      planta_id: plantaId!,
    },
  })
}

/**
 * Factory para crear Componentes de prueba
 */
export async function createTestComponente(
  overrides?: {
    name?: string
    code?: string
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  return client.componente.create({
    data: {
      name: overrides?.name || 'Test Componente',
      code: overrides?.code || `TEST-COMP-${Date.now()}`,
    },
  })
}

/**
 * Factory para crear Repuestos de prueba
 */
export async function createTestRepuesto(
  overrides?: {
    name?: string
    code?: string
    componente_id?: string
    stock?: number
    stock_minimo?: number
  },
  tx?: PrismaTransactionClient
) {
  const client = tx || prisma
  // Si no se proporciona componente_id, crear uno primero
  let componenteId = overrides?.componente_id
  if (!componenteId) {
    const componente = await createTestComponente(undefined, tx)
    componenteId = componente.id
  }

  return client.repuesto.create({
    data: {
      name: overrides?.name || 'Test Repuesto',
      code: overrides?.code || `TEST-REP-${Date.now()}`,
      componente_id: componenteId!,
      stock: overrides?.stock ?? 0,
      stock_minimo: overrides?.stock_minimo ?? 0,
    },
  })
}

/**
 * Helper: Limpiar todos los datos de prueba
 * ⚠️ USE WITH CAUTION - Deletes ALL data
 */
export async function cleanupTestData() {
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
}
