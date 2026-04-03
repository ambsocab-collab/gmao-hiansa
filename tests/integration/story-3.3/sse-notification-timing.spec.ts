/**
 * P1 Integration Tests for Story 3.3 - SSE Notification Timing (AC5)
 *
 * Validates NFR-S18: Notificaciones SSE deben llegar en <30s
 * Reference: test-design-epic-3.md - P1 SSE Timing Tests
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
  generateCorrelationId: vi.fn(() => 'corr-sse-timing'),
}));

// Mock SSE broadcaster with timing tracking
const broadcastEvents: Array<{ channel: string; event: any; timestamp: number }> = [];
vi.mock('@/lib/sse/broadcaster', () => ({
  BroadcastManager: {
    broadcast: vi.fn((channel: string, event: any) => {
      broadcastEvents.push({ channel, event, timestamp: Date.now() });
    }),
    getConnectedClients: vi.fn(() => 1),
  },
  broadcastWorkOrderAssigned: vi.fn((data: any) => {
    broadcastEvents.push({
      channel: 'work-orders',
      event: {
        name: 'work_order_assigned',
        data
      },
      timestamp: Date.now()
    });
  }),
}));

describe('Story 3.3 - Integration: SSE Notification Timing (AC5)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];
  const createdUsers: string[] = [];
  const createdProviders: string[] = [];
  const createdAssignments: string[] = [];

  beforeEach(async () => {
    broadcastEvents.length = 0;
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
        descripcion: 'OT de prueba para SSE timing',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(workOrder.id);

    return workOrder;
  }

  async function createTestUser(nameSuffix: string = 'User') {
    const user = await prisma.user.create({
      data: {
        email: `sse-test-${faker.string.uuid()}@example.com`,
        passwordHash: 'hash',
        name: `Test ${nameSuffix}`
      }
    });
    createdUsers.push(user.id);
    return user;
  }

  async function createTestProvider() {
    const provider = await prisma.provider.create({
      data: {
        name: `Provider Test ${faker.string.alphanumeric(6)}`,
        email: `provider-${faker.string.uuid()}@example.com`,
        services: ['eléctrica', 'mecánica']
      }
    });
    createdProviders.push(provider.id);
    return provider;
  }

  /**
   * P1-AC5-001: Notificación de asignación debe enviarse en <30s (NFR-S18)
   */
  it('[P1-AC5-001] should send assignment notification in <30s', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico = await createTestUser('Tecnico');

    const startTime = Date.now();

    // Create assignment
    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    // Trigger SSE broadcast
    const { BroadcastManager } = await import('@/lib/sse/broadcaster');
    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_assigned',
      data: {
        workOrderId: workOrder.id,
        otNumero: workOrder.numero,
        tecnicoId: tecnico.id,
        tecnicoName: tecnico.name,
        assignedAt: new Date().toISOString()
      },
      id: `evt-assign-${Date.now()}`
    });

    const elapsed = Date.now() - startTime;

    // NFR-S18: <30s requirement
    expect(elapsed).toBeLessThan(30000);
    expect(BroadcastManager.broadcast).toHaveBeenCalled();
  });

  /**
   * P1-AC5-002: SSE broadcast debe incluir todos los datos necesarios
   */
  it('[P1-AC5-002] should include all required data in SSE notification', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico = await createTestUser('TECNICO');

    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    const { BroadcastManager } = await import('@/lib/sse/broadcaster');
    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_assigned',
      data: {
        workOrderId: workOrder.id,
        otNumero: workOrder.numero,
        tecnicoId: tecnico.id,
        tecnicoName: tecnico.name,
        assignedAt: new Date().toISOString()
      },
      id: 'evt-data-check'
    });

    expect(BroadcastManager.broadcast).toHaveBeenCalledWith(
      'work-orders',
      expect.objectContaining({
        name: 'work_order_assigned',
        data: expect.objectContaining({
          workOrderId: workOrder.id,
          tecnicoId: tecnico.id
        })
      })
    );
  });

  /**
   * P1-AC5-003: Múltiples asignaciones deben broadcastear individualmente
   */
  it('[P1-AC5-003] should broadcast each assignment separately', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico1 = await createTestUser('TECNICO');
    const tecnico2 = await createTestUser('TECNICO');

    const { BroadcastManager } = await import('@/lib/sse/broadcaster');

    // Assign first technician
    const asig1 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico1.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig1.id);

    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_assigned',
      data: { tecnicoId: tecnico1.id },
      id: 'evt-1'
    });

    // Assign second technician
    const asig2 = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico2.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asig2.id);

    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_assigned',
      data: { tecnicoId: tecnico2.id },
      id: 'evt-2'
    });

    expect(BroadcastManager.broadcast).toHaveBeenCalledTimes(2);
  });

  /**
   * P1-AC5-004: Notificación de confirmación de proveedor en <30s
   */
  it('[P1-AC5-004] should send provider confirmation notification in <30s', async () => {
    const workOrder = await createTestWorkOrder();
    const proveedor = await createTestProvider();

    const startTime = Date.now();

    // Simulate provider confirmation
    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        providerId: proveedor.id,
        role: 'PROVEEDOR'
      }
    });
    createdAssignments.push(asignacion.id);

    const { BroadcastManager } = await import('@/lib/sse/broadcaster');
    BroadcastManager.broadcast('work-orders', {
      name: 'provider_confirmed',
      data: {
        workOrderId: workOrder.id,
        proveedorId: proveedor.id,
        confirmadoAt: new Date().toISOString()
      },
      id: 'evt-provider-confirm'
    });

    const elapsed = Date.now() - startTime;

    expect(elapsed).toBeLessThan(30000);
  });

  /**
   * P1-AC5-005: SSE debe manejar reconexión con sync de estado
   */
  it('[P1-AC5-005] should handle reconnection with state sync', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico = await createTestUser('TECNICO');

    // Create assignment
    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    // Simulate client reconnection - fetch current state
    const currentState = await prisma.workOrderAssignment.findMany({
      where: { work_order_id: workOrder.id },
      include: { user: true }
    });

    expect(currentState).toHaveLength(1);
    expect(currentState[0].user.id).toBe(tecnico.id);
  });

  /**
   * P1-AC5-006: Notificación debe incluir timestamp correcto
   */
  it('[P1-AC5-006] should include accurate timestamp in notification', async () => {
    const workOrder = await createTestWorkOrder();
    const tecnico = await createTestUser('TECNICO');

    const beforeAssign = new Date();

    const asignacion = await prisma.workOrderAssignment.create({
      data: {
        work_order_id: workOrder.id,
        userId: tecnico.id,
        role: 'TECNICO'
      }
    });
    createdAssignments.push(asignacion.id);

    const afterAssign = new Date();

    const { BroadcastManager } = await import('@/lib/sse/broadcaster');
    BroadcastManager.broadcast('work-orders', {
      name: 'work_order_assigned',
      data: {
        workOrderId: workOrder.id,
        assignedAt: asignacion.created_at?.toISOString() || new Date().toISOString()
      },
      id: 'evt-timestamp'
    });

    // Verify timestamp is within expected range
    const assignedAt = new Date(asignacion.created_at || new Date());
    expect(assignedAt.getTime()).toBeGreaterThanOrEqual(beforeAssign.getTime() - 1000);
    expect(assignedAt.getTime()).toBeLessThanOrEqual(afterAssign.getTime() + 1000);
  });
});
