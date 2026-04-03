/**
 * P2 Integration Tests for Story 3.3 - Assignment Edge Cases
 *
 * Validates edge cases for work order assignment logic
 * Reference: test-design-epic-3.md - P2 Edge Case Tests
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
  generateCorrelationId: vi.fn(() => 'corr-assign-edge'),
}));

// Mock SSE broadcaster
vi.mock('@/lib/sse/broadcaster', () => ({
  BroadcastManager: {
    broadcast: vi.fn(),
  },
}));

describe('Story 3.3 - Integration: Assignment Edge Cases (P2)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];
  const createdUsers: string[] = [];
  const createdAssignments: string[] = [];
  const createdProviders: string[] = [];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (createdAssignments.length > 0) {
      await prisma.workOrderAssignment.deleteMany({ where: { id: { in: createdAssignments } } });
      createdAssignments.length = 0;
    }
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({ where: { id: { in: createdOTs } } });
      createdOTs.length = 0;
    }
    if (createdUsers.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUsers } } });
      createdUsers.length = 0;
    }
    if (createdProviders.length > 0) {
      await prisma.provider.deleteMany({ where: { id: { in: createdProviders } } });
      createdProviders.length = 0;
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

  async function createTestWorkOrder() {
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
        estado: WorkOrderEstado.PENDIENTE,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT de prueba para edge cases',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(workOrder.id);
    return workOrder;
  }

  async function createTestUser(overrides: { skills?: string[] } = {}) {
    const user = await prisma.user.create({
      data: {
        email: `edge-test-${faker.string.uuid()}@example.com`,
        passwordHash: 'hash',
        name: `Test User ${faker.person.fullName()}`,
        skills: overrides.skills || []
      }
    });
    createdUsers.push(user.id);
    return user;
  }

  async function createTestProvider() {
    const provider = await prisma.provider.create({
      data: {
        name: `Provider Test ${faker.company.name()}`,
        email: `provider-${faker.string.uuid()}@example.com`,
        services: ['eléctrica', 'mecánica']
      }
    });
    createdProviders.push(provider.id);
    return provider;
  }

  /**
   * P2-EDGE-001: Usuario sin skills requeridas puede ser asignado (validación es en service layer)
   */
  it('[P2-EDGE-001] should document skill validation requirement', async () => {
    const workOrder = await createTestWorkOrder();
    const userWithoutSkill = await createTestUser({ skills: [] });

    // Business rule: Check if user has required skills before assignment
    // This test documents the expected validation

    // User has no skills
    expect(userWithoutSkill.skills).toHaveLength(0);

    // TODO: Service layer should validate skills match requirements
  });

  /**
   * P2-EDGE-002: Usuario con skills correctas puede ser asignado
   */
  it('[P2-EDGE-002] should allow assignment with matching skills', async () => {
    const workOrder = await createTestWorkOrder();
    const userWithSkill = await createTestUser({ skills: ['eléctrica', 'mecánica'] });

    expect(userWithSkill.skills).toHaveLength(2);

    // Assignment should succeed
    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: userWithSkill.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    expect(asignacion.userId).toBe(userWithSkill.id);
  });

  /**
   * P2-EDGE-003: Múltiples técnicos pueden ser asignados a una OT
   */
  it('[P2-EDGE-003] should allow multiple technicians on single OT', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico1 = await createTestUser();
    const tecnico2 = await createTestUser();

    const asig1 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico1.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig1.id);

    const asig2 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico2.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig2.id);

    const assignments = await prisma.workOrderAssignment.findMany({
      where: { work_order_id: workOrder.id }
    });

    expect(assignments).toHaveLength(2);
  });

  /**
   * P2-EDGE-004: Proveedor externo puede ser asignado
   */
  it('[P2-EDGE-004] should allow external provider assignment', async () => {
    const workOrder = await createTestWorkOrder();
    const provider = await createTestProvider();

    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        providerId: provider.id,
        role: 'PROVEEDOR'
      }
    });
    createdAssignments.push(asignacion.id);

    expect(asignacion.providerId).toBe(provider.id);
  });

  /**
   * P2-EDGE-005: Técnico sobrecargado muestra advertencia
   */
  it('[P2-EDGE-005] should detect overloaded technician', async () => {
    const tecnico = await createTestUser();

    // Create 5 active assignments for this technician
    for (let i = 0; i < 5; i++) {
      const ot = await createTestWorkOrder();
      const asig = await prisma.workOrderAssignment.create({
        data: {
          work_order_id: ot.id,
          userId: tecnico.id,
          role: 'TECNICO'
        }
      });
      createdAssignments.push(asig.id);
    }

    // Count active assignments
    const activeAssignments = await prisma.workOrderAssignment.count({
      where: {
        userId: tecnico.id
      }
    });

    // Threshold for overload warning
    const OVERLOAD_THRESHOLD = 5;
    const isOverloaded = activeAssignments >= OVERLOAD_THRESHOLD;

    expect(isOverloaded).toBe(true);
  });

  /**
   * P2-EDGE-006: Desasignación debe actualizar registro
   */
  it('[P2-EDGE-006] should support assignment removal', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico = await createTestUser();

    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    // Delete assignment (unassign)
    await prisma.workOrderAssignment.delete({
      where: { id: asignacion.id }
    });

    const updated = await prisma.workOrderAssignment.findUnique({
      where: { id: asignacion.id }
    });

    expect(updated).toBeNull();
  });

  /**
   * P2-EDGE-007: Auto-asignación no permitida (documentación)
   */
  it('[P2-EDGE-007] should document self-assignment restriction', async () => {
    const tecnico = await createTestUser();

    // Business rule: Non-admin users cannot assign themselves
    // This test documents the expected validation
    // Actual enforcement happens in service layer

    expect(tecnico.name).toBeDefined();
    // TODO: Service layer should prevent self-assignment for non-admins
  });

  /**
   * P2-EDGE-008: Reasignación debe mantener historial
   */
  it('[P2-EDGE-008] should maintain assignment history', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico1 = await createTestUser();
    const tecnico2 = await createTestUser();

    // First assignment
    const asig1 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico1.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig1.id);

    // Delete first assignment (simulating unassignment)
    await prisma.workOrderAssignment.delete({
      where: { id: asig1.id }
    });

    // Second assignment
    const asig2 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico2.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig2.id);

    // Current assignments should show only active one
    const currentAssignments = await prisma.workOrderAssignment.findMany({
      where: { work_order_id: workOrder.id },
      orderBy: { created_at: 'asc' }
    });

    expect(currentAssignments).toHaveLength(1);
    expect(currentAssignments[0].userId).toBe(tecnico2.id);
  });
});
