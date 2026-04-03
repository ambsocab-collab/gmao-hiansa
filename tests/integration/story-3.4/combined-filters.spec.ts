/**
 * P1 Integration Tests for Story 3.4 - Combined Filters AND Logic (R-109)
 *
 * Validates combined filter logic for work orders listado
 * Reference: test-design-epic-3.md - R-109 Integration Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo, WorkOrderPrioridad } from '@prisma/client';

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock observability
vi.mock('@/lib/observability/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/lib/observability/performance', () => ({
  trackPerformance: vi.fn(() => ({
    end: vi.fn(),
  })),
  generateCorrelationId: vi.fn(() => 'corr-filters'),
}));

describe('Story 3.4 - Integration: Combined Filters AND Logic (R-109)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];
  const createdUsers: string[] = [];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({ where: { id: { in: createdOTs } } });
      createdOTs.length = 0;
    }
    if (createdUsers.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUsers } } });
      createdUsers.length = 0;
    }
    if (createdEquipment.length > 0) {
      await prisma.equipo.deleteMany({ where: { id: { in: createdEquipment } } });
      createdEquipment.length = 0;
    }
    if (createdLineas.length > 0) {
      await prisma.linea.deleteMany({ where: { id: { in: createdLineas } } });
      createdLineas.length = 0;
    }
    if (createdPlantas.length > 0) {
      await prisma.planta.deleteMany({ where: { id: { in: createdPlantas } } });
      createdPlantas.length = 0;
    }
  });

  async function createTestHierarchy() {
    const planta = await prisma.planta.create({
      data: {
        name: 'Planta Test',
        code: `PLT-${faker.string.alphanumeric(6).toUpperCase()}`,
        division: 'HIROCK'
      }
    });
    createdPlantas.push(planta.id);

    const linea = await prisma.linea.create({
      data: {
        name: 'Línea Test',
        code: `LIN-${faker.string.alphanumeric(6).toUpperCase()}`,
        planta_id: planta.id
      }
    });
    createdLineas.push(linea.id);

    const equipo = await prisma.equipo.create({
      data: {
        name: 'Equipo Test',
        code: `EQ-${faker.string.alphanumeric(8).toUpperCase()}`,
        linea_id: linea.id
      }
    });
    createdEquipment.push(equipo.id);

    return { planta, linea, equipo };
  }

  async function createTestWorkOrder(overrides: Partial<{
    estado: WorkOrderEstado;
    tipo: WorkOrderTipo;
    prioridad: WorkOrderPrioridad;
    equipo_id: string;
  }> = {}) {
    const { equipo } = await createTestHierarchy();

    const workOrder = await prisma.workOrder.create({
      data: {
        numero: `OT-${faker.string.uuid()}`,
        tipo: overrides.tipo || WorkOrderTipo.CORRECTIVO,
        estado: overrides.estado || WorkOrderEstado.PENDIENTE,
        prioridad: overrides.prioridad || WorkOrderPrioridad.MEDIA,
        descripcion: 'OT de prueba para filtros',
        equipo_id: overrides.equipo_id || equipo.id
      }
    });
    createdOTs.push(workOrder.id);
    return workOrder;
  }

  /**
   * R-109-001: Filtro combinado estado + tipo (AND)
   */
  it('[R-109-001] should filter by estado AND tipo combined', async () => {
    const { equipo } = await createTestHierarchy();

    // Create test data
    const ot1 = await prisma.workOrder.create({
      data: {
        numero: 'OT-001',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.ALTA,
        descripcion: 'OT1',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot1.id);

    const ot2 = await prisma.workOrder.create({
      data: {
        numero: 'OT-002',
        tipo: WorkOrderTipo.PREVENTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT2',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot2.id);

    const ot3 = await prisma.workOrder.create({
      data: {
        numero: 'OT-003',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.COMPLETADA,
        prioridad: WorkOrderPrioridad.BAJA,
        descripcion: 'OT3',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot3.id);

    // Filter: estado=PENDIENTE AND tipo=CORRECTIVO AND same equipo
    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { estado: WorkOrderEstado.PENDIENTE },
          { tipo: WorkOrderTipo.CORRECTIVO },
          { equipo_id: equipo.id }
        ]
      }
    });

    // Should only return ot1
    expect(results).toHaveLength(1);
    expect(results[0].numero).toBe('OT-001');
  });

  /**
   * R-109-002: Filtro combinado estado + prioridad (AND)
   */
  it('[R-109-002] should filter by estado AND prioridad combined', async () => {
    const { equipo } = await createTestHierarchy();

    const ot1 = await prisma.workOrder.create({
      data: {
        numero: 'OT-101',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.EN_PROGRESO,
        prioridad: WorkOrderPrioridad.ALTA,
        descripcion: 'OT1',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot1.id);

    const ot2 = await prisma.workOrder.create({
      data: {
        numero: 'OT-102',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.EN_PROGRESO,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT2',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot2.id);

    // Filter: estado=EN_PROGRESO AND prioridad=ALTA AND same equipo
    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { estado: WorkOrderEstado.EN_PROGRESO },
          { prioridad: WorkOrderPrioridad.ALTA },
          { equipo_id: equipo.id }
        ]
      }
    });

    expect(results).toHaveLength(1);
    expect(results[0].numero).toBe('OT-101');
  });

  /**
   * R-109-003: Filtro combinado tipo + prioridad + estado (3 criterios AND)
   */
  it('[R-109-003] should filter by tipo AND prioridad AND estado (3 criteria)', async () => {
    const { equipo } = await createTestHierarchy();

    // Create multiple OTs with different combinations
    const combinations = [
      { tipo: WorkOrderTipo.CORRECTIVO, estado: WorkOrderEstado.PENDIENTE, prioridad: WorkOrderPrioridad.ALTA, expected: true },
      { tipo: WorkOrderTipo.CORRECTIVO, estado: WorkOrderEstado.PENDIENTE, prioridad: WorkOrderPrioridad.MEDIA, expected: false },
      { tipo: WorkOrderTipo.PREVENTIVO, estado: WorkOrderEstado.PENDIENTE, prioridad: WorkOrderPrioridad.ALTA, expected: false },
      { tipo: WorkOrderTipo.CORRECTIVO, estado: WorkOrderEstado.ASIGNADA, prioridad: WorkOrderPrioridad.ALTA, expected: false }
    ];

    for (const combo of combinations) {
      const ot = await prisma.workOrder.create({
        data: {
          numero: `OT-${faker.string.uuid()}`,
          tipo: combo.tipo,
          estado: combo.estado,
          prioridad: combo.prioridad,
          descripcion: 'OT test',
          equipo_id: equipo.id
        }
      });
      createdOTs.push(ot.id);
    }

    // Filter: CORRECTIVO AND PENDIENTE AND ALTA AND same equipo
    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { tipo: WorkOrderTipo.CORRECTIVO },
          { estado: WorkOrderEstado.PENDIENTE },
          { prioridad: WorkOrderPrioridad.ALTA },
          { equipo_id: equipo.id }
        ]
      }
    });

    expect(results).toHaveLength(1);
  });

  /**
   * R-109-004: Filtro sin resultados debe retornar array vacío
   */
  it('[R-109-004] should return empty array when no matches', async () => {
    const { equipo } = await createTestHierarchy();

    await prisma.workOrder.create({
      data: {
        numero: 'OT-201',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.COMPLETADA,
        prioridad: WorkOrderPrioridad.BAJA,
        descripcion: 'OT test',
        equipo_id: equipo.id
      }
    });
    createdOTs.push((await prisma.workOrder.findFirst({ where: { numero: 'OT-201' } }))!.id);

    // Filter: PENDIENTE AND ALTA (no match)
    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { estado: WorkOrderEstado.PENDIENTE },
          { prioridad: WorkOrderPrioridad.ALTA }
        ]
      }
    });

    expect(results).toHaveLength(0);
  });

  /**
   * R-109-005: Filtro combinado con fecha range
   */
  it('[R-109-005] should filter by estado AND date range', async () => {
    const { equipo } = await createTestHierarchy();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ot1 = await prisma.workOrder.create({
      data: {
        numero: 'OT-301',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT test',
        equipo_id: equipo.id,
        created_at: yesterday
      }
    });
    createdOTs.push(ot1.id);

    const ot2 = await prisma.workOrder.create({
      data: {
        numero: 'OT-302',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT test',
        equipo_id: equipo.id,
        created_at: new Date()
      }
    });
    createdOTs.push(ot2.id);

    // Filter: PENDIENTE AND created_at in last 24h AND same equipo
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { estado: WorkOrderEstado.PENDIENTE },
          { created_at: { gte: last24h } },
          { equipo_id: equipo.id }
        ]
      }
    });

    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some(r => r.numero === 'OT-302')).toBe(true);
  });

  /**
   * R-109-006: Filtro debe completarse en <500ms
   */
  it('[R-109-006] should complete filter query in <500ms', async () => {
    const { equipo } = await createTestHierarchy();

    // Create 20 OTs for performance test (reduced for test speed)
    for (let i = 0; i < 20; i++) {
      const ot = await prisma.workOrder.create({
        data: {
          numero: `OT-PERF-${i}`,
          tipo: i % 2 === 0 ? WorkOrderTipo.CORRECTIVO : WorkOrderTipo.PREVENTIVO,
          estado: [WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA, WorkOrderEstado.EN_PROGRESO][i % 3],
          prioridad: [WorkOrderPrioridad.ALTA, WorkOrderPrioridad.MEDIA, WorkOrderPrioridad.BAJA][i % 3],
          descripcion: `OT performance ${i}`,
          equipo_id: equipo.id
        }
      });
      createdOTs.push(ot.id);
    }

    const startTime = Date.now();

    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { tipo: WorkOrderTipo.CORRECTIVO },
          { estado: WorkOrderEstado.PENDIENTE },
          { prioridad: WorkOrderPrioridad.ALTA }
        ]
      }
    });

    const elapsed = Date.now() - startTime;

    expect(elapsed).toBeLessThan(500);
  });

  /**
   * R-109-007: Filtro con búsqueda de texto (descripcion)
   */
  it('[R-109-007] should filter by estado AND text search', async () => {
    const { equipo } = await createTestHierarchy();

    const ot1 = await prisma.workOrder.create({
      data: {
        numero: 'OT-401',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'Falla en motor eléctrico',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot1.id);

    const ot2 = await prisma.workOrder.create({
      data: {
        numero: 'OT-402',
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'Falla en bomba hidráulica',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(ot2.id);

    // Filter: PENDIENTE AND descripcion contains 'motor' AND same equipo
    const results = await prisma.workOrder.findMany({
      where: {
        AND: [
          { estado: WorkOrderEstado.PENDIENTE },
          { descripcion: { contains: 'motor', mode: 'insensitive' } },
          { equipo_id: equipo.id }
        ]
      }
    });

    expect(results).toHaveLength(1);
    expect(results[0].numero).toBe('OT-401');
  });
});
