/**
 * P0 Integration Tests for Story 3.2 - Gestión de OTs Asignadas (Mis OTs)
 *
 * TDD RED PHASE: Tests validate business logic directly with Prisma
 * Following pattern from tests/integration/work-orders/P0-work-orders.test.ts
 *
 * Tests:
 * - startWorkOrder: ASIGNADA → EN_PROGRESO
 * - addUsedRepuesto: Stock validation con optimistic locking
 * - completeWorkOrder: Mark as COMPLETADA
 * - addComment: Comment creation with timestamp
 * - uploadPhoto: Photo URL storage
 *
 * NOTE: Tests use Prisma directly (not Server Actions) to avoid auth mocking issues
 * Server Actions are validated via E2E tests
 *
 * TDD RED PHASE: All tests are marked with test.skip() because models don't exist yet
 * Expected Failures: Prisma errors (WorkOrderComment, WorkOrderPhoto, UsedRepuesto models)
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo, WorkOrderPrioridad } from '@prisma/client';

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
  broadcastRepuestoStockUpdated: vi.fn((repuestoId) => {
    broadcastMock('work-orders', {
      name: 'repuesto-stock-updated',
      data: {
        repuestoId,
        updatedAt: new Date().toISOString()
      },
      id: expect.any(String)
    });
  }),
  broadcastWorkOrderCommentAdded: vi.fn((workOrderId, comment) => {
    broadcastMock('work-orders', {
      name: 'work-order-comment-added',
      data: {
        workOrderId,
        commentId: comment.id,
        texto: comment.texto,
        createdAt: comment.createdAt.toISOString()
      },
      id: expect.any(String)
    });
  }),
}));

describe('Story 3.2 - Integration Tests: My WorkOrders (P0)', () => {
  // Track created records for cleanup
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdUsers: string[] = [];
  const createdRepuestos: string[] = [];

  beforeAll(async () => {
    // Setup: Create test technician user
    const tecnico = await prisma.user.upsert({
      where: { email: 'tecnico-test@example.com' },
      update: {},
      create: {
        email: 'tecnico-test@example.com',
        passwordHash: 'dummy-hash',
        name: 'Tecnico Test',
        capabilities: ['can_view_own_ots', 'can_update_own_ot'],
      }
    });
    createdUsers.push(tecnico.id);
  });

  afterEach(async () => {
    // Clean up test data after each test
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({
        where: { id: { in: createdOTs } }
      });
      createdOTs.length = 0;
    }

    if (createdEquipment.length > 0) {
      await prisma.equipo.deleteMany({
        where: { id: { in: createdEquipment } }
      });
      createdEquipment.length = 0;
    }

    if (createdUsers.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUsers } }
      });
      createdUsers.length = 0;
    }

    if (createdRepuestos.length > 0) {
      await prisma.repuesto.deleteMany({
        where: { id: { in: createdRepuestos } }
      });
      createdRepuestos.length = 0;
    }

    vi.clearAllMocks();
  });

  // Helper: Create test WorkOrder
  async function createTestWorkOrder(overrides: Partial<{
    estado: WorkOrderEstado;
    tipo: WorkOrderTipo;
    prioridad: WorkOrderPrioridad;
    equipoId: string;
  }> = {}) {
    const equipo = await prisma.equipo.create({
      data: {
        numero: 'EQ-TEST-001',
        nombre: 'Equipo Test',
        linea: { create: { nombre: 'Línea Test', planta: { create: { nombre: 'Planta Test', division: 'HIROCK' } } } }
      }
    });
    createdEquipment.push(equipo.id);

    const workOrder = await prisma.workOrder.create({
      data: {
        numero: `OT-${faker.string.uuid()}`,
        tipo: overrides.tipo || WorkOrderTipo.CORRECTIVO,
        estado: overrides.estado || WorkOrderEstado.ASIGNADA,
        prioridad: overrides.prioridad || WorkOrderPrioridad.MEDIA,
        descripcion: 'OT de prueba para integración',
        equipoId: overrides.equipoId || equipo.id,
        assignments: {
          create: {
            userId: createdUsers[0], // tecnico
          }
        }
      }
    });
    createdOTs.push(workOrder.id);
    return workOrder;
  }

  // Helper: Create test Repuesto
  async function createTestRepuesto(stock: number = 10) {
    const repuesto = await prisma.repuesto.create({
      data: {
        code: `REP-${faker.string.alphanumeric(8).toUpperCase()}`,
        name: 'Repuesto Test',
        stock,
        stockMinimo: 2,
        ubicacionFisica: 'Estantería A-1',
      }
    });
    createdRepuestos.push(repuesto.id);
    return repuesto;
  }

  /**
   * AC3: Iniciar OT (ASIGNADA → EN_PROGRESO)
   * Priority: P0 (Critical Business Flow)
   * NFR-S3: Estado cambia en <1s
   */
  describe.skip('startWorkOrder (AC3)', () => {
    it.skip('[P0-AC3] should change OT status from ASIGNADA to EN_PROGRESO', async () => {
      // THIS TEST WILL FAIL - Server Action not implemented yet
      // Expected: WorkOrder estado = EN_PROGRESO
      // Actual: Estado remains ASIGNADA (no action to update it)

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.ASIGNADA });

      // Simulate Server Action: startWorkOrder(workOrderId)
      // This would be: await prisma.workOrder.update({
      //   where: { id: workOrderId },
      //   data: { estado: 'EN_PROGRESO' }
      // });

      // Verify estado changed (will fail - no action to change it)
      const updated = await prisma.workOrder.findUnique({
        where: { id: workOrder.id }
      });

      expect(updated?.estado).toBe(WorkOrderEstado.EN_PROGRESO);
    });

    it.skip('[P0-AC3] should create audit log when OT is started', async () => {
      // THIS TEST WILL FAIL - Audit logging not implemented
      // Expected: AuditLog entry created
      // Actual: No audit log entry

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.ASIGNADA });

      // Simulate Server Action with audit log
      // await prisma.auditLog.create({
      //   data: {
      //     userId: createdUsers[0],
      //     action: 'OT_STARTED',
      //     targetId: workOrder.id,
      //     metadata: { estadoAnterior: 'ASIGNADA', estadoNuevo: 'EN_PROGRESO' }
      //   }
      // });

      // Verify audit log created
      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: 'OT_STARTED',
          targetId: workOrder.id
        }
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.action).toBe('OT_STARTED');
    });

    it.skip('[P0-AC3] should emit SSE event when OT is started', async () => {
      // THIS TEST WILL FAIL - SSE broadcast not implemented
      // Expected: broadcastWorkOrderUpdated called
      // Actual: broadcastMock never called

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.ASIGNADA });

      // Simulate Server Action with SSE broadcast
      // await broadcastWorkOrderUpdated(workOrder);

      // Verify SSE broadcast called
      expect(broadcastMock).toHaveBeenCalledWith('work-orders', expect.objectContaining({
        name: 'work-order-updated',
        data: expect.objectContaining({
          workOrderId: workOrder.id,
          estado: 'EN_PROGRESO'
        })
      }));
    });

    it.skip('[P1-AC3] should return error if OT not in ASIGNADA state', async () => {
      // THIS TEST WILL FAIL - Validation not implemented
      // Expected: Error thrown
      // Actual: No validation, update would succeed

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });

      // Simulate Server Action: should validate transition
      // const validTransitions = VALID_TRANSITIONS[workOrder.estado];
      // if (!validTransitions.includes('EN_PROGRESO')) {
      //   throw new Error('No se puede iniciar OT desde estado EN_PROGRESO');
      // }

      // This test would verify the error is thrown
      // For now, it's skipped because validation doesn't exist
    });
  });

  /**
   * AC4: Agregar repuestos usados con validación de stock
   * Priority: P0 (CRITICAL - R-011 race condition)
   * NFR-S16: Stock actualizado en <1s con optimistic locking
   */
  describe.skip('addUsedRepuesto (AC4)', () => {
    it.skip('[P0-AC4] should add repuesto used and decrease stock atomically', async () => {
      // THIS TEST WILL FAIL - UsedRepuesto model doesn't exist yet
      // Expected: UsedRepuesto created, stock decreased
      // Actual: Prisma error - model doesn't exist

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const repuesto = await createTestRepuesto(10);
      const cantidad = 3;

      // Simulate Server Action in transaction
      // await prisma.$transaction(async (tx) => {
      //   // Verify stock
      //   const repuestoRecord = await tx.repuesto.findUnique({
      //     where: { id: repuesto.id }
      //   });
      //   if (!repuestoRecord || repuestoRecord.stock < cantidad) {
      //     throw new Error('Stock insuficiente');
      //   }
      //
      //   // Decrease stock
      //   const newStock = repuestoRecord.stock - cantidad;
      //   await tx.repuesto.update({
      //     where: { id: repuesto.id },
      //     data: { stock: newStock }
      //   });
      //
      //   // Create UsedRepuesto record
      //   await tx.usedRepuesto.create({
      //     data: {
      //       workOrderId: workOrder.id,
      //       repuestoId: repuesto.id,
      //       cantidad
      //     }
      //   });
      // });

      // Verify UsedRepuesto created (will fail - model doesn't exist)
      const usedRepuesto = await prisma.usedRepuesto.findFirst({
        where: {
          workOrderId: workOrder.id,
          repuestoId: repuesto.id
        }
      });

      expect(usedRepuesto).toBeDefined();
      expect(usedRepuesto?.cantidad).toBe(cantidad);

      // Verify stock decreased
      const updatedRepuesto = await prisma.repuesto.findUnique({
        where: { id: repuesto.id }
      });

      expect(updatedRepuesto?.stock).toBe(10 - cantidad); // 10 - 3 = 7
    });

    it.skip('[P0-AC4] should fail if cantidad exceeds current stock', async () => {
      // THIS TEST WILL FAIL - Validation not implemented
      // Expected: Error "Stock insuficiente"
      // Actual: Transaction would fail with Prisma error or succeed incorrectly

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const repuesto = await createTestRepuesto(2); // Only 2 in stock
      const cantidad = 5; // Try to use 5

      // Simulate Server Action validation
      // const repuestoRecord = await prisma.repuesto.findUnique({
      //   where: { id: repuesto.id }
      // });
      // if (repuestoRecord.stock < cantidad) {
      //   throw new Error(`Stock insuficiente. Stock actual: ${repuestoRecord.stock}, solicitado: ${cantidad}`);
      // }

      // For now, this test is skipped because validation doesn't exist
      // When implemented, it should throw InsufficientStockError
    });

    it.skip('[P1-AC4] should rollback transaction on race condition', async () => {
      // THIS TEST WILL FAIL - Optimistic locking not implemented
      // Expected: One transaction succeeds, one fails with 409 Conflict
      // Actual: No race condition handling

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const repuesto = await createTestRepuesto(1); // Only 1 in stock (race condition target)

      // CRITICAL: R-011 DATA requirement - Must validate optimistic locking
      // Implementation pattern when GREEN phase:
      //
      // // Launch CONCURRENT transactions (true race condition)
      // const [result1, result2] = await Promise.all([
      //   prisma.$transaction(async (tx) => {
      //     const current = await tx.repuesto.findUnique({ where: { id: repuesto.id } });
      //     if (!current || current.stock < 1) throw new Error('Stock insuficiente');
      //     await tx.usedRepuesto.create({
      //       data: { workOrderId: workOrder.id, repuestoId: repuesto.id, cantidad: 1 }
      //     });
      //     return await tx.repuesto.update({
      //       where: { id: repuesto.id, version: current.version }, // Optimistic lock
      //       data: { stock: { decrement: 1 }, version: { increment: 1 } }
      //     });
      //   }),
      //   prisma.$transaction(async (tx) => {
      //     const current = await tx.repuesto.findUnique({ where: { id: repuesto.id } });
      //     if (!current || current.stock < 1) throw new Error('Stock insuficiente');
      //     await tx.usedRepuesto.create({
      //       data: { workOrderId: workOrder.id, repuestoId: repuesto.id, cantidad: 1 }
      //     });
      //     return await tx.repuesto.update({
      //       where: { id: repuesto.id, version: current.version }, // Optimistic lock
      //       data: { stock: { decrement: 1 }, version: { increment: 1 } }
      //     });
      //   })
      // ]);
      //
      // // One should succeed, one should fail
      // const successCount = [result1, result2].filter(r => r !== null).length;
      // expect(successCount).toBe(1); // Only one should succeed due to optimistic locking

      // This test requires concurrent transaction simulation
      // For now, skipped because optimistic locking doesn't exist
    });

    it.skip('[P1-AC4] should create audit log for repuesto used', async () => {
      // THIS TEST WILL FAIL - Audit logging not implemented
      // Expected: AuditLog entry created
      // Actual: No audit log entry

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const repuesto = await createTestRepuesto(5);
      const cantidad = 2;

      // Simulate Server Action with audit log
      // await prisma.auditLog.create({
      //   data: {
      //     userId: createdUsers[0],
      //     action: 'repuesto_used',
      //     targetId: repuesto.id,
      //     metadata: { workOrderId: workOrder.id, cantidad, newStock: 3 }
      //   }
      // });

      // Verify audit log created
      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: 'repuesto_used',
          targetId: repuesto.id
        }
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.metadata).toMatchObject({
        workOrderId: workOrder.id,
        cantidad
      });
    });

    it.skip('[P1-AC4] should emit SSE event for stock update', async () => {
      // THIS TEST WILL FAIL - SSE broadcast not implemented
      // Expected: broadcastRepuestoStockUpdated called
      // Actual: broadcastMock never called

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const repuesto = await createTestRepuesto(5);

      // Simulate Server Action with SSE broadcast
      // await broadcastRepuestoStockUpdated(repuesto.id);

      // Verify SSE broadcast called
      expect(broadcastMock).toHaveBeenCalledWith('work-orders', expect.objectContaining({
        name: 'repuesto-stock-updated',
        data: expect.objectContaining({
          repuestoId: repuesto.id
        })
      }));
    });
  });

  /**
   * AC5: Completar OT con confirmación
   * Priority: P0 (Critical Business Flow)
   */
  describe.skip('completeWorkOrder (AC5)', () => {
    it.skip('[P0-AC5] should change OT status to COMPLETADA with completedAt timestamp', async () => {
      // THIS TEST WILL FAIL - Server Action not implemented
      // Expected: WorkOrder estado = COMPLETADA, completedAt set
      // Actual: Estado remains EN_PROGRESO

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });

      // Simulate Server Action: completeWorkOrder(workOrderId)
      // await prisma.workOrder.update({
      //   where: { id: workOrderId },
      //   data: {
      //     estado: 'COMPLETADA',
      //     completedAt: new Date()
      //   }
      // });

      // Verify estado changed
      const updated = await prisma.workOrder.findUnique({
        where: { id: workOrder.id }
      });

      expect(updated?.estado).toBe(WorkOrderEstado.COMPLETADA);
      expect(updated?.completedAt).toBeDefined();
      expect(updated?.completedAt).toBeInstanceOf(Date);
    });

    it.skip('[P0-AC5] should emit SSE event when OT is completed', async () => {
      // THIS TEST WILL FAIL - SSE broadcast not implemented
      // Expected: broadcastWorkOrderUpdated called
      // Actual: broadcastMock never called

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });

      // Simulate Server Action with SSE broadcast
      // await broadcastWorkOrderUpdated(workOrder);

      // Verify SSE broadcast called
      expect(broadcastMock).toHaveBeenCalledWith('work-orders', expect.objectContaining({
        name: 'work-order-updated',
        data: expect.objectContaining({
          workOrderId: workOrder.id,
          estado: 'COMPLETADA'
        })
      }));
    });

    it.skip('[P1-AC5] should create audit log when OT is completed', async () => {
      // THIS TEST WILL FAIL - Audit logging not implemented
      // Expected: AuditLog entry created
      // Actual: No audit log entry

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });

      // Simulate Server Action with audit log
      // await prisma.auditLog.create({
      //   data: {
      //     userId: createdUsers[0],
      //     action: 'OT_COMPLETED',
      //     targetId: workOrder.id,
      //     metadata: { completedAt: expect.any(Date) }
      //   }
      // });

      // Verify audit log created
      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: 'OT_COMPLETED',
          targetId: workOrder.id
        }
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.action).toBe('OT_COMPLETED');
    });
  });

  /**
   * AC7: Comentarios en tiempo real
   * Priority: P1 (Important but not critical)
   */
  describe.skip('addComment (AC7)', () => {
    it.skip('[P1-AC7] should create comment with timestamp', async () => {
      // THIS TEST WILL FAIL - WorkOrderComment model doesn't exist yet
      // Expected: WorkOrderComment created
      // Actual: Prisma error - model doesn't exist

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const texto = 'Reemplazado bearing defectuoso';

      // Simulate Server Action: addComment(workOrderId, texto)
      // await prisma.workOrderComment.create({
      //   data: {
      //     workOrderId: workOrder.id,
      //     userId: createdUsers[0],
      //     texto,
      //     createdAt: new Date()
      //   }
      // });

      // Verify comment created (will fail - model doesn't exist)
      const comment = await prisma.workOrderComment.findFirst({
        where: {
          workOrderId: workOrder.id,
          texto
        }
      });

      expect(comment).toBeDefined();
      expect(comment?.texto).toBe(texto);
      expect(comment?.userId).toBe(createdUsers[0]);
      expect(comment?.createdAt).toBeDefined();
    });

    it.skip('[P1-AC7] should emit SSE event after comment added', async () => {
      // THIS TEST WILL FAIL - SSE broadcast not implemented
      // Expected: broadcastWorkOrderCommentAdded called
      // Actual: broadcastMock never called

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const texto = 'Necesito repuesto adicional';

      // Simulate Server Action with SSE broadcast
      // const comment = await prisma.workOrderComment.create({...});
      // await broadcastWorkOrderCommentAdded(workOrder.id, comment);

      // Verify SSE broadcast called
      expect(broadcastMock).toHaveBeenCalledWith('work-orders', expect.objectContaining({
        name: 'work-order-comment-added',
        data: expect.objectContaining({
          workOrderId: workOrder.id,
          texto
        })
      }));
    });
  });

  /**
   * AC8: Fotos antes/después
   * Priority: P1 (Important for documentation)
   */
  describe.skip('uploadPhoto (AC8)', () => {
    it.skip('[P1-AC8] should create WorkOrderPhoto with Vercel Blob URL', async () => {
      // THIS TEST WILL FAIL - WorkOrderPhoto model doesn't exist yet
      // Expected: WorkOrderPhoto created with URL
      // Actual: Prisma error - model doesn't exist

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const tipo = 'ANTES'; // PhotoTipo.ANTES
      const url = 'https://vercel-storage.com/work-orders/foto-antes.jpg';

      // Simulate Server Action: uploadPhoto(workOrderId, tipo, file)
      // await prisma.workOrderPhoto.create({
      //   data: {
      //     workOrderId: workOrder.id,
      //     tipo,
      //     url,
      //     createdAt: new Date()
      //   }
      // });

      // Verify photo created (will fail - model doesn't exist)
      const photo = await prisma.workOrderPhoto.findFirst({
        where: {
          workOrderId: workOrder.id,
          tipo
        }
      });

      expect(photo).toBeDefined();
      expect(photo?.url).toBe(url);
      expect(photo?.tipo).toBe(tipo);
    });

    it.skip('[P1-AC8] should support DESPUES photo type', async () => {
      // THIS TEST WILL FAIL - WorkOrderPhoto model doesn't exist yet
      // Expected: WorkOrderPhoto with tipo = DESPUES
      // Actual: Prisma error - model doesn't exist

      const workOrder = await createTestWorkOrder({ estado: WorkOrderEstado.EN_PROGRESO });
      const tipo = 'DESPUES'; // PhotoTipo.DESPUES
      const url = 'https://vercel-storage.com/work-orders/foto-despues.jpg';

      // Simulate Server Action
      // await prisma.workOrderPhoto.create({
      //   data: { workOrderId: workOrder.id, tipo, url }
      // });

      // Verify photo created
      const photo = await prisma.workOrderPhoto.findFirst({
        where: {
          workOrderId: workOrder.id,
          tipo: 'DESPUES'
        }
      });

      expect(photo).toBeDefined();
      expect(photo?.tipo).toBe('DESPUES');
    });
  });
});
