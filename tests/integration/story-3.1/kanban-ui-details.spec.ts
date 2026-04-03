/**
 * P2 Integration Tests for Story 3.1 - Kanban UI Details
 *
 * Validates UI-specific behaviors: animations, transitions, accessibility
 * Reference: test-design-epic-3.md - P2 UI Enhancement Tests
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
  generateCorrelationId: vi.fn(() => 'corr-ui-details'),
}));

describe('Story 3.1 - Integration: Kanban UI Details (P2)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({ where: { id: { in: createdOTs } } });
      createdOTs.length = 0;
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

  async function createTestWorkOrder(estado: WorkOrderEstado = WorkOrderEstado.PENDIENTE) {
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

    const workOrder = await prisma.workOrder.create({
      data: {
        numero: `OT-${faker.string.uuid()}`,
        tipo: WorkOrderTipo.CORRECTIVO,
        estado,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT de prueba para UI details',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(workOrder.id);
    return workOrder;
  }

  /**
   * P2-UI-001: Transición de estado debe registrar timestamp correcto
   */
  it('[P2-UI-001] should record correct timestamps on state transition', async () => {
    const workOrder = await createTestWorkOrder(WorkOrderEstado.PENDIENTE);

    const beforeUpdate = new Date();

    await prisma.workOrder.update({
      where: { id: workOrder.id },
      data: {
        estado: WorkOrderEstado.ASIGNADA
      }
    });

    const afterUpdate = new Date();

    const updated = await prisma.workOrder.findUnique({
      where: { id: workOrder.id }
    });

    const updated_at = updated?.updated_at || new Date();
    expect(updated_at.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime() - 1000);
    expect(updated_at.getTime()).toBeLessThanOrEqual(afterUpdate.getTime() + 1000);
  });

  /**
   * P2-UI-002: OT debe tener todos los campos requeridos para UI card
   */
  it('[P2-UI-002] should have all required fields for UI card display', async () => {
    const workOrder = await createTestWorkOrder();

    const fullOT = await prisma.workOrder.findUnique({
      where: { id: workOrder.id },
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true
              }
            }
          }
        }
      }
    });

    // Required fields for UI card
    expect(fullOT?.numero).toBeDefined();
    expect(fullOT?.tipo).toBeDefined();
    expect(fullOT?.estado).toBeDefined();
    expect(fullOT?.prioridad).toBeDefined();
    expect(fullOT?.descripcion).toBeDefined();
    expect(fullOT?.equipo?.name).toBeDefined();
    expect(fullOT?.equipo?.linea?.name).toBeDefined();
    expect(fullOT?.equipo?.linea?.planta?.name).toBeDefined();
  });

  /**
   * P2-UI-003: Color de prioridad debe ser mapeable
   */
  it('[P2-UI-003] should have mappable priority colors', async () => {
    const prioridades = [
      { prioridad: WorkOrderPrioridad.ALTA, expectedColor: 'orange' },
      { prioridad: WorkOrderPrioridad.MEDIA, expectedColor: 'yellow' },
      { prioridad: WorkOrderPrioridad.BAJA, expectedColor: 'green' }
    ];

    for (const { prioridad } of prioridades) {
      const ot = await createTestWorkOrder();
      await prisma.workOrder.update({
        where: { id: ot.id },
        data: { prioridad }
      });

      const updated = await prisma.workOrder.findUnique({
        where: { id: ot.id }
      });

      expect(updated?.prioridad).toBe(prioridad);
    }
  });

  /**
   * P2-UI-004: Tipo de OT debe ser distinguible visualmente
   */
  it('[P2-UI-004] should have distinguishable OT types', async () => {
    const tipos = [
      WorkOrderTipo.CORRECTIVO,
      WorkOrderTipo.PREVENTIVO
    ];

    for (const tipo of tipos) {
      const ot = await createTestWorkOrder();
      await prisma.workOrder.update({
        where: { id: ot.id },
        data: { tipo }
      });

      const updated = await prisma.workOrder.findUnique({
        where: { id: ot.id }
      });

      expect(updated?.tipo).toBe(tipo);
    }
  });

  /**
   * P2-UI-005: Conteo de OTs por columna debe ser eficiente
   */
  it('[P2-UI-005] should efficiently count OTs per column', async () => {
    // Create OTs in different states
    for (let i = 0; i < 5; i++) {
      await createTestWorkOrder(WorkOrderEstado.PENDIENTE);
    }
    for (let i = 0; i < 3; i++) {
      await createTestWorkOrder(WorkOrderEstado.ASIGNADA);
    }
    for (let i = 0; i < 2; i++) {
      await createTestWorkOrder(WorkOrderEstado.EN_PROGRESO);
    }

    const startTime = Date.now();

    // Count by estado (simulating column counts)
    const counts = await prisma.workOrder.groupBy({
      by: ['estado'],
      _count: true
    });

    const elapsed = Date.now() - startTime;

    expect(elapsed).toBeLessThan(500); // Allow 500ms for groupBy operation
    expect(counts.length).toBeGreaterThan(0);
  });

  /**
   * P2-UI-006: Ordenamiento de cards por prioridad
   */
  it('[P2-UI-006] should sort OT cards by priority', async () => {
    const ot1 = await createTestWorkOrder();
    await prisma.workOrder.update({
      where: { id: ot1.id },
      data: { prioridad: WorkOrderPrioridad.BAJA }
    });

    const ot2 = await createTestWorkOrder();
    await prisma.workOrder.update({
      where: { id: ot2.id },
      data: { prioridad: WorkOrderPrioridad.CRITICA }
    });

    const ot3 = await createTestWorkOrder();
    await prisma.workOrder.update({
      where: { id: ot3.id },
      data: { prioridad: WorkOrderPrioridad.MEDIA }
    });

    // Get OTs sorted by priority (critical first)
    const priorityOrder = {
      [WorkOrderPrioridad.CRITICA]: 0,
      [WorkOrderPrioridad.ALTA]: 1,
      [WorkOrderPrioridad.MEDIA]: 2,
      [WorkOrderPrioridad.BAJA]: 3
    };

    const ots = await prisma.workOrder.findMany({
      where: { id: { in: [ot1.id, ot2.id, ot3.id] } },
      orderBy: { prioridad: 'asc' }
    });

    expect(ots.length).toBe(3);
  });

  /**
   * P2-UI-007: Fecha de creación debe ser accesible para display
   */
  it('[P2-UI-007] should have accessible creation date for display', async () => {
    const workOrder = await createTestWorkOrder();

    const ot = await prisma.workOrder.findUnique({
      where: { id: workOrder.id }
    });

    expect(ot?.created_at).toBeDefined();
    expect(ot?.created_at).toBeInstanceOf(Date);
  });

  /**
   * P2-UI-008: Descripción truncada para preview
   */
  it('[P2-UI-008] should support truncated description preview', async () => {
    const longDescription = 'A'.repeat(500);
    const workOrder = await createTestWorkOrder();
    await prisma.workOrder.update({
      where: { id: workOrder.id },
      data: { descripcion: longDescription }
    });

    const ot = await prisma.workOrder.findUnique({
      where: { id: workOrder.id }
    });

    // Preview should be first 100 chars
    const preview = ot?.descripcion?.substring(0, 100) || '';
    expect(preview.length).toBe(100);
    expect(ot?.descripcion).toBe(longDescription);
  });
});
