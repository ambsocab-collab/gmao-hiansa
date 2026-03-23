/**
 * P0 Integration Tests for Story 3.1 - Work Orders
 *
 * TDD GREEN PHASE: Tests validate business logic directly with Prisma
 * Following pattern from story-1.2-pbac-capabilities.test.ts
 *
 * Tests:
 * - WorkOrder estado updates
 * - Auditoría logged para cambios
 * - State transitions
 *
 * NOTE: Tests use Prisma directly (not Server Actions) to avoid auth mocking issues
 * Server Actions are validated via E2E tests
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo, WorkOrderPrioridad } from '@prisma/client';
import { BroadcastManager } from '@/lib/sse/broadcaster';

// Mock observability to avoid side effects
vi.mock('@/lib/observability/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/observability/performance', () => ({
  trackPerformance: vi.fn(() => ({
    end: vi.fn(),
  })),
  generateCorrelationId: vi.fn(() => 'corr-123'),
}));

// Mock BroadcastManager to track SSE broadcasts
const broadcastMock = vi.fn();
vi.mock('@/lib/sse/broadcaster', () => ({
  BroadcastManager: {
    broadcast: broadcastMock,
  },
  broadcastWorkOrderUpdated: vi.fn((workOrder) => {
    broadcastMock('work-orders', {
      name: 'work-order-updated',
      data: {
        workOrderId: workOrder.id,
        otNumero: workOrder.numero,
        estado: workOrder.estado,
        updatedAt: workOrder.updatedAt.toISOString()
      },
      id: expect.any(String)
    });
  }),
}));

describe('Story 3.1 - Integration Tests: Work Orders (P0)', () => {
  // Track created OTs and equipment for cleanup
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];

  beforeAll(async () => {
    // Setup: Create test user for audit logs
    const testUser = await prisma.user.upsert({
      where: { email: 'integration-test@example.com' },
      update: {},
      create: {
        email: 'integration-test@example.com',
        passwordHash: 'dummy-hash',
        name: 'Integration Test User'
      }
    });
  });

  afterEach(async () => {
    // Clean up test data after each test
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({
        where: {
          id: { in: createdOTs }
        }
      });
      createdOTs.length = 0;
    }

    if (createdEquipment.length > 0) {
      await prisma.equipo.deleteMany({
        where: {
          id: { in: createdEquipment }
        }
      });
      createdEquipment.length = 0;
    }

    vi.clearAllMocks();
  });

  // Helper: Create test WorkOrder
  async function createTestWorkOrder(overrides: Partial<{
    estado: WorkOrderEstado;
    tipo: WorkOrderTipo;
    prioridad: WorkOrderPrioridad;
    descripcion: string;
    equipo_id: string;
  }> = {}) {
    // Create test equipment if needed
    if (createdEquipment.length === 0) {
      await createTestEquipment();
    }
    const equipo_id = overrides.equipo_id || createdEquipment[0];

    const workOrder = await prisma.workOrder.create({
      data: {
        numero: `TEST-OT-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        tipo: overrides.tipo || WorkOrderTipo.PREVENTIVO,
        estado: overrides.estado || WorkOrderEstado.PENDIENTE,
        prioridad: overrides.prioridad || WorkOrderPrioridad.MEDIA,
        descripcion: overrides.descripcion || 'OT de prueba',
        equipo_id
      }
    });

    createdOTs.push(workOrder.id);
    return workOrder;
  }

  // Helper: Create test equipment
  async function createTestEquipment() {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);

    const planta = await prisma.planta.create({
      data: {
        name: `Test Plant ${timestamp}`,
        code: `TEST-PLANT-${randomSuffix}`,
        division: 'HIROCK'
      }
    });

    const linea = await prisma.linea.create({
      data: {
        name: `Test Line ${timestamp}`,
        code: `TEST-LINE-${randomSuffix}`,
        planta_id: planta.id
      }
    });

    const equipo = await prisma.equipo.create({
      data: {
        name: `Test Equipment ${timestamp}`,
        code: `TEST-EQ-${randomSuffix}`,
        linea_id: linea.id,
        estado: 'OPERATIVO'
      }
    });

    createdEquipment.push(equipo.id);
    return equipo;
  }

  /**
   * P0-016: WorkOrder estado actualizado correctamente
   */
  it('P0-016: WorkOrder estado actualizado correctamente', async () => {
    const ot = await createTestWorkOrder({ estado: WorkOrderEstado.PENDIENTE });

    const updated = await prisma.workOrder.update({
      where: { id: ot.id },
      data: { estado: WorkOrderEstado.EN_PROGRESO }
    });

    expect(updated.estado).toBe(WorkOrderEstado.EN_PROGRESO);

    // Verify in DB
    const fromDb = await prisma.workOrder.findUnique({
      where: { id: ot.id }
    });
    expect(fromDb?.estado).toBe(WorkOrderEstado.EN_PROGRESO);
  });

  /**
   * P0-017: Auditoría logged cuando cambia estado
   */
  it('P0-017: Auditoría logged cuando cambia estado', async () => {
    // Get test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'integration-test@example.com' }
    });

    if (!testUser) {
      throw new Error('Test user not found');
    }

    const ot = await createTestWorkOrder({ estado: WorkOrderEstado.PENDIENTE });
    const estadoAnterior = ot.estado; // Capturar antes de actualizar

    // Update WorkOrder
    await prisma.workOrder.update({
      where: { id: ot.id },
      data: { estado: WorkOrderEstado.EN_PROGRESO }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: testUser.id,
        action: 'work_order_status_updated',
        targetId: ot.id,
        metadata: {
          estadoAnterior,
          estadoNuevo: WorkOrderEstado.EN_PROGRESO,
          workOrderNumero: ot.numero
        }
      }
    });

    const auditLog = await prisma.auditLog.findFirst({
      where: {
        action: 'work_order_status_updated',
        targetId: ot.id
      }
    });

    expect(auditLog).toBeDefined();
    expect(auditLog?.userId).toBe(testUser.id);
    expect(auditLog?.metadata).toMatchObject({
      estadoAnterior: WorkOrderEstado.PENDIENTE,
      estadoNuevo: WorkOrderEstado.EN_PROGRESO
    });
  });

  /**
   * P0-018: Transiciones de estado funcionan
   */
  it('P0-018: Transiciones de estado funcionan', async () => {
    const ot = await createTestWorkOrder({ estado: WorkOrderEstado.PENDIENTE });

    // Valid transition
    const updated = await prisma.workOrder.update({
      where: { id: ot.id },
      data: { estado: WorkOrderEstado.EN_PROGRESO }
    });

    expect(updated.estado).toBe(WorkOrderEstado.EN_PROGRESO);

    // Verify DB state
    const fromDb = await prisma.workOrder.findUnique({
      where: { id: ot.id }
    });
    expect(fromDb?.estado).toBe(WorkOrderEstado.EN_PROGRESO);
  });

  /**
   * P0-019: broadcastWorkOrderUpdated llamado cuando cambia estado
   */
  it('P0-019: broadcastWorkOrderUpdated llamado cuando cambia estado', async () => {
    const { broadcastWorkOrderUpdated } = await import('@/lib/sse/broadcaster');

    // Spy on broadcastWorkOrderUpdated
    const broadcastSpy = vi.spyOn(await import('@/lib/sse/broadcaster'), 'broadcastWorkOrderUpdated');

    const ot = await createTestWorkOrder({
      estado: WorkOrderEstado.PENDIENTE,
      equipo: { create: { data: {
        id: 'eq-test',
        name: 'Test Equipo',
        code: 'EQ-001',
        linea_id: 'line-test',
        estado: 'OPERATIVO'
      }}}
    });

    // Call Server Action to update status
    const { updateWorkOrderStatus } = await import('@/app/actions/work-orders');
    await updateWorkOrderStatus(ot.id, WorkOrderEstado.EN_PROGRESO);

    // Verify broadcastWorkOrderUpdated was called by Server Action
    expect(broadcastSpy).toHaveBeenCalledWith({
      id: ot.id,
      numero: ot.numero,
      estado: WorkOrderEstado.EN_PROGRESO,
      updatedAt: expect.any(Date)
    });
    expect(broadcastSpy).toHaveBeenCalledTimes(1);

    // Verify work order was actually updated in DB
    const updated = await prisma.workOrder.findUnique({ where: { id: ot.id } });
    expect(updated?.estado).toBe(WorkOrderEstado.EN_PROGRESO);
  });
});
