/**
 * Integration Test Helpers for Story 3.4
 *
 * Shared setup, mocks, and helper functions for work orders list tests.
 * This file reduces duplication across the split test files.
 */

import { afterEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo, WorkOrderPrioridad } from '@prisma/client';

// ============================================================================
// Mocks
// ============================================================================

// Mock revalidatePath to avoid Next.js context errors
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

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
vi.mock('@/lib/sse/broadcaster', () => {
  const broadcastMock = vi.fn();
  return {
    BroadcastManager: {
      broadcast: broadcastMock,
    },
    broadcastWorkOrderUpdated: vi.fn((workOrder) => {
      broadcastMock('work-orders', {
        name: 'work_order_updated',
        data: {
          workOrderId: workOrder.id,
          otNumero: workOrder.numero,
          estado: workOrder.estado,
          updatedAt: workOrder.updatedAt.toISOString(),
        },
        id: expect.any(String),
      });
    }),
  };
});

// ============================================================================
// Test Data Tracker (for cleanup)
// ============================================================================

export interface TestDataTracker {
  createdOTs: string[];
  createdEquipment: string[];
  createdLineas: string[];
  createdPlantas: string[];
  createdUsers: string[];
  createdAssignments: string[];
  createdComments: string[];
}

export function createTestDataTracker(): TestDataTracker {
  return {
    createdOTs: [],
    createdEquipment: [],
    createdLineas: [],
    createdPlantas: [],
    createdUsers: [],
    createdAssignments: [],
    createdComments: [],
  };
}

// ============================================================================
// Cleanup Function
// ============================================================================

export function setupCleanup(tracker: TestDataTracker) {
  afterEach(async () => {
    // Clean up in correct order (respecting FK constraints)
    if (tracker.createdComments.length > 0) {
      await prisma.workOrderComment.deleteMany({
        where: { id: { in: tracker.createdComments } },
      });
      tracker.createdComments.length = 0;
    }

    if (tracker.createdAssignments.length > 0) {
      await prisma.workOrderAssignment.deleteMany({
        where: { id: { in: tracker.createdAssignments } },
      });
      tracker.createdAssignments.length = 0;
    }

    if (tracker.createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({
        where: { id: { in: tracker.createdOTs } },
      });
      tracker.createdOTs.length = 0;
    }

    if (tracker.createdEquipment.length > 0) {
      await prisma.equipo.deleteMany({
        where: { id: { in: tracker.createdEquipment } },
      });
      tracker.createdEquipment.length = 0;
    }

    if (tracker.createdLineas.length > 0) {
      await prisma.linea.deleteMany({
        where: { id: { in: tracker.createdLineas } },
      });
      tracker.createdLineas.length = 0;
    }

    if (tracker.createdPlantas.length > 0) {
      await prisma.planta.deleteMany({
        where: { id: { in: tracker.createdPlantas } },
      });
      tracker.createdPlantas.length = 0;
    }

    if (tracker.createdUsers.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: tracker.createdUsers } },
      });
      tracker.createdUsers.length = 0;
    }

    vi.clearAllMocks();
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

interface CreateTestWorkOrderOptions {
  estado?: WorkOrderEstado;
  tipo?: WorkOrderTipo;
  prioridad?: WorkOrderPrioridad;
  equipoId?: string;
  descripcion?: string;
  created_at?: Date;
}

export async function createTestWorkOrder(
  tracker: TestDataTracker,
  overrides: CreateTestWorkOrderOptions = {}
) {
  // Create planta
  const planta = await prisma.planta.create({
    data: {
      name: 'Planta Test List',
      code: `PLT-LIST-${faker.string.alphanumeric(6).toUpperCase()}`,
      division: 'HIROCK',
    },
  });
  tracker.createdPlantas.push(planta.id);

  // Create linea
  const linea = await prisma.linea.create({
    data: {
      name: 'Línea Test List',
      code: `LIN-LIST-${faker.string.alphanumeric(6).toUpperCase()}`,
      planta_id: planta.id,
    },
  });
  tracker.createdLineas.push(linea.id);

  // Create equipo
  const equipo = await prisma.equipo.create({
    data: {
      name: 'Equipo Test List',
      code: `EQ-LIST-${faker.string.alphanumeric(8).toUpperCase()}`,
      linea_id: linea.id,
    },
  });
  tracker.createdEquipment.push(equipo.id);

  const workOrder = await prisma.workOrder.create({
    data: {
      numero: `OT-LIST-${faker.string.uuid().slice(0, 8)}`,
      tipo: overrides.tipo || WorkOrderTipo.CORRECTIVO,
      estado: overrides.estado || WorkOrderEstado.PENDIENTE,
      prioridad: overrides.prioridad || WorkOrderPrioridad.MEDIA,
      descripcion: overrides.descripcion || 'OT de prueba para listado',
      equipo_id: overrides.equipoId || equipo.id,
      created_at: overrides.created_at || new Date(),
    },
  });
  tracker.createdOTs.push(workOrder.id);
  return workOrder;
}

export async function createTestUser(
  tracker: TestDataTracker,
  overrides: { name?: string; email?: string } = {}
) {
  const user = await prisma.user.create({
    data: {
      email: overrides.email || faker.internet.email(),
      name: overrides.name || faker.person.fullName(),
      passwordHash: 'test-hash',
    },
  });
  tracker.createdUsers.push(user.id);
  return user;
}

export async function createTestAssignment(
  tracker: TestDataTracker,
  workOrderId: string,
  userId: string,
  role: 'TECNICO' | 'PROVEEDOR' = 'TECNICO'
) {
  const assignment = await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrderId,
      userId,
      role,
    },
  });
  tracker.createdAssignments.push(assignment.id);
  return assignment;
}

export async function createTestComment(
  tracker: TestDataTracker,
  workOrderId: string,
  userId: string,
  texto: string
) {
  const comment = await prisma.workOrderComment.create({
    data: {
      work_order_id: workOrderId,
      user_id: userId,
      texto,
    },
  });
  tracker.createdComments.push(comment.id);
  return comment;
}
