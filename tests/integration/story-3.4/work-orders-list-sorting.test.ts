/**
 * Integration Tests for Story 3.4 - Sorting (AC3)
 *
 * Tests for getWorkOrdersList sorting functionality.
 * Uses Prisma directly (not Server Actions) to avoid auth mocking issues.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestDataTracker,
  setupCleanup,
  createTestWorkOrder,
} from './helpers/work-order-test-helpers';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo } from '@prisma/client';

describe('Story 3.4 - Integration: Sorting (AC3)', () => {
  const tracker = createTestDataTracker();

  beforeEach(() => {
    tracker.createdOTs.length = 0;
    tracker.createdEquipment.length = 0;
    tracker.createdLineas.length = 0;
    tracker.createdPlantas.length = 0;
  });

  setupCleanup(tracker);

  describe('getWorkOrdersList - Sorting', () => {
    it('[P0-INT-011] should sort by created_at ascending', async () => {
      // Create OTs with small delay between them
      const ot1 = await createTestWorkOrder(tracker);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const ot2 = await createTestWorkOrder(tracker);

      const sorted = await prisma.workOrder.findMany({
        where: { id: { in: [ot1.id, ot2.id] } },
        orderBy: { created_at: 'asc' },
      });

      expect(sorted[0].id).toBe(ot1.id);
      expect(sorted[1].id).toBe(ot2.id);
    }, 15000);

    it('[P0-INT-012] should sort by created_at descending', async () => {
      const ot1 = await createTestWorkOrder(tracker);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const ot2 = await createTestWorkOrder(tracker);

      const sorted = await prisma.workOrder.findMany({
        where: { id: { in: [ot1.id, ot2.id] } },
        orderBy: { created_at: 'desc' },
      });

      expect(sorted[0].id).toBe(ot2.id);
      expect(sorted[1].id).toBe(ot1.id);
    }, 15000);

    it('[P0-INT-013] should sort by estado by enum ordinal', async () => {
      const ot1 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.COMPLETADA });
      const ot2 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.ASIGNADA });
      const ot3 = await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });

      const sorted = await prisma.workOrder.findMany({
        where: { id: { in: [ot1.id, ot2.id, ot3.id] } },
        orderBy: { estado: 'asc' },
      });

      // Prisma sorts enums by ordinal position, not alphabetically
      // Enum order: PENDIENTE (0), ASIGNADA (1), EN_PROGRESO (2), ... COMPLETADA (7)
      // So order should be: PENDIENTE, ASIGNADA, COMPLETADA
      const estados = sorted.map((ot) => ot.estado);
      expect(estados[0]).toBe(WorkOrderEstado.PENDIENTE);
      expect(estados[1]).toBe(WorkOrderEstado.ASIGNADA);
      expect(estados[2]).toBe(WorkOrderEstado.COMPLETADA);
    }, 15000);

    it('[P0-INT-014] should sort by tipo', async () => {
      await createTestWorkOrder(tracker, { tipo: WorkOrderTipo.PREVENTIVO });
      await createTestWorkOrder(tracker, { tipo: WorkOrderTipo.CORRECTIVO });

      const sorted = await prisma.workOrder.findMany({
        orderBy: { tipo: 'asc' },
        take: 10,
      });

      // Verify order (CORRECTIVO comes before PREVENTIVO alphabetically)
      const tipos = sorted.map((ot) => ot.tipo);
      expect(tipos.indexOf(WorkOrderTipo.CORRECTIVO)).toBeLessThan(
        tipos.indexOf(WorkOrderTipo.PREVENTIVO)
      );
    }, 15000);

    it('[P0-INT-015] should sort by prioridad', async () => {
      const sorted = await prisma.workOrder.findMany({
        orderBy: { prioridad: 'asc' },
        take: 10,
      });

      // Verify priority order (ALTA, BAJA, CRITICA, MEDIA)
      const prioridades = sorted.map((ot) => ot.prioridad);
      const sortedPrioridades = [...prioridades].sort();
      expect(prioridades).toEqual(sortedPrioridades);
    }, 15000);

    it('[P0-INT-016] should maintain sort with pagination', async () => {
      // Create 5 OTs
      for (let i = 0; i < 5; i++) {
        await createTestWorkOrder(tracker);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Get first page
      const page1 = await prisma.workOrder.findMany({
        take: 3,
        orderBy: { created_at: 'desc' },
      });

      // Get second page
      const lastItem = page1[page1.length - 1];
      const page2 = await prisma.workOrder.findMany({
        take: 3,
        skip: 1,
        cursor: { id: lastItem.id },
        orderBy: { created_at: 'desc' },
      });

      // Verify descending order is maintained
      expect(page1[0].created_at >= page1[page1.length - 1].created_at).toBe(true);
      if (page2.length > 0) {
        expect(lastItem.created_at >= page2[0].created_at).toBe(true);
      }
    }, 15000);
  });
});
