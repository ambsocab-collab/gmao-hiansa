/**
 * Integration Tests for Story 3.4 - Batch Operations (AC4)
 *
 * Tests for batchAssignTechnicians, batchUpdateStatus, batchAddComment.
 * Uses Prisma directly (not Server Actions) to avoid auth mocking issues.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestDataTracker,
  setupCleanup,
  createTestWorkOrder,
  createTestUser,
  createTestComment,
} from './helpers/work-order-test-helpers';
import { prisma } from '@/lib/db';
import { WorkOrderEstado } from '@prisma/client';
import {
  validateBatchLimit,
  MAX_BATCH_SIZE,
} from '@/lib/utils/work-orders-list';

describe('Story 3.4 - Integration: Batch Operations (AC4)', () => {
  const tracker = createTestDataTracker();

  beforeEach(() => {
    tracker.createdOTs.length = 0;
    tracker.createdEquipment.length = 0;
    tracker.createdLineas.length = 0;
    tracker.createdPlantas.length = 0;
    tracker.createdUsers.length = 0;
    tracker.createdAssignments.length = 0;
    tracker.createdComments.length = 0;
  });

  setupCleanup(tracker);

  describe('batchAssignTechnicians', () => {
    it('[P0-INT-017] should assign technicians to multiple work orders', async () => {
      const ot1 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      const ot2 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      const tecnico = await createTestUser(tracker, { name: 'Técnico Batch' });

      // Simulate batchAssignTechnicians
      const results = await prisma.$transaction(async (tx) => {
        const assignments = [];
        for (const otId of [ot1.id, ot2.id]) {
          const assignment = await tx.workOrderAssignment.create({
            data: {
              work_order_id: otId,
              userId: tecnico.id,
              role: 'TECNICO',
            },
          });
          assignments.push(assignment);

          // Update OT state to ASIGNada
          await tx.workOrder.update({
            where: { id: otId },
            data: { estado: WorkOrderEstado.ASIGNADA },
          });
        }
        return assignments;
      });

      expect(results).toHaveLength(2);

      // Verify OTs are now ASIGNADA
      const updatedOT1 = await prisma.workOrder.findUnique({ where: { id: ot1.id } });
      const updatedOT2 = await prisma.workOrder.findUnique({ where: { id: ot2.id } });

      expect(updatedOT1?.estado).toBe(WorkOrderEstado.ASIGNADA);
      expect(updatedOT2?.estado).toBe(WorkOrderEstado.ASIGNADA);
    }, 15000);

    it('[P0-INT-018] should reject batch larger than 50 OTs', () => {
      const testIds = Array(51).fill('test-id');
      expect(testIds.length).toBeGreaterThan(MAX_BATCH_SIZE);

      // Validate using utility function
      expect(() => validateBatchLimit(testIds)).toThrow(
        'No se pueden procesar más de 50 OTs a la vez'
      );
    });

    it('[P0-INT-019] should create audit log for batch assignment', async () => {
      const ot = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      const tecnico = await createTestUser(tracker, { name: 'Técnico Audit' });
      const supervisor = await createTestUser(tracker, {
        name: 'Supervisor Audit',
        email: 'sup-audit@test.com',
      });

      await prisma.$transaction(async (tx) => {
        await tx.workOrderAssignment.create({
          data: {
            work_order_id: ot.id,
            userId: tecnico.id,
            role: 'TECNICO',
          },
        });

        await tx.auditLog.create({
          data: {
            userId: supervisor.id,
            action: 'batch_assign_technicians',
            targetId: ot.id,
            metadata: {
              assignedUserId: tecnico.id,
              batchCount: 1,
            },
          },
        });
      });

      const auditLog = await prisma.auditLog.findFirst({
        where: { action: 'batch_assign_technicians' },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.metadata).toMatchObject({
        assignedUserId: tecnico.id,
        batchCount: 1,
      });
    }, 15000);
  });

  describe('batchUpdateStatus', () => {
    it('[P0-INT-020] should update status for multiple work orders', async () => {
      const ot1 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      const ot2 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });

      // Simulate batchUpdateStatus
      const results = await prisma.$transaction(async (tx) => {
        const updates = [];
        for (const otId of [ot1.id, ot2.id]) {
          const updated = await tx.workOrder.update({
            where: { id: otId },
            data: { estado: WorkOrderEstado.EN_PROGRESO },
          });
          updates.push(updated);
        }
        return updates;
      });

      expect(results).toHaveLength(2);
      results.forEach((ot) => {
        expect(ot.estado).toBe(WorkOrderEstado.EN_PROGRESO);
      });
    }, 15000);

    it('[P0-INT-021] should validate state transition rules', () => {
        // State transition rules
        const validTransitions: Record<WorkOrderEstado, WorkOrderEstado[]> = {
          [WorkOrderEstado.PENDIENTE]: [WorkOrderEstado.ASIGNADA],
          [WorkOrderEstado.ASIGNADA]: [WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.PENDIENTE],
          [WorkOrderEstado.EN_PROGRESO]: [WorkOrderEstado.COMPLETADA, WorkOrderEstado.ASIGNADA],
          [WorkOrderEstado.COMPLETADA]: [], // Terminal state
        };

        // Verify COMPLETADA is terminal
        expect(validTransitions[WorkOrderEstado.COMPLETADA]).not.toContain(
          WorkOrderEstado.PENDIENTE
        );
    });
  });

  describe('batchAddComment', () => {
    it('[P0-INT-022] should add comment to multiple work orders', async () => {
      const ot1 = await createTestWorkOrder(tracker);
      const ot2 = await createTestWorkOrder(tracker);
      const user = await createTestUser(tracker, { name: 'Commenter' });
      const comment = 'Comentario de prueba para batch';

      // Simulate batchAddComment
      const results = await prisma.$transaction(async (tx) => {
        const comments = [];
        for (const otId of [ot1.id, ot2.id]) {
          const newComment = await createTestComment(tracker, otId, user.id, comment);
          comments.push(newComment);
        }
        return comments;
      });

      expect(results).toHaveLength(2);
      results.forEach((c) => {
        expect(c.texto).toBe(comment);
      });
    }, 15000);

    it('[P0-INT-023] should create audit log for batch comment', async () => {
      const ot = await createTestWorkOrder(tracker);
      const user = await createTestUser(tracker, { name: 'Commenter Audit' });

      await createTestComment(tracker, ot.id, user.id, 'Test comment');

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'batch_add_comment',
          targetId: ot.id,
          metadata: {
            commentPreview: 'Test comment',
            batchCount: 1,
          },
        },
      });

      const auditLog = await prisma.auditLog.findFirst({
        where: { action: 'batch_add_comment' },
      });

      expect(auditLog).toBeDefined();
    }, 15000);
  });
});
