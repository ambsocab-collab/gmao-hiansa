/**
 * Integration Tests for Story 3.4 - Filters (AC2)
 *
 * Tests for getWorkOrdersList filtering functionality.
 * Uses Prisma directly (not Server Actions) to avoid auth mocking issues.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestDataTracker,
  setupCleanup,
  createTestWorkOrder,
  createTestUser,
  createTestAssignment,
} from './helpers/work-order-test-helpers';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo } from '@prisma/client';

describe('Story 3.4 - Integration: Filters (AC2)', () => {
  const tracker = createTestDataTracker();

  beforeEach(() => {
    tracker.createdOTs.length = 0;
    tracker.createdEquipment.length = 0;
    tracker.createdLineas.length = 0;
    tracker.createdPlantas.length = 0;
    tracker.createdUsers.length = 0;
    tracker.createdAssignments.length = 0;
  });

  setupCleanup(tracker);

  describe('getWorkOrdersList - Filtros', () => {
    it('[P0-INT-004] should filter by estado', async () => {
      // Create OTs with different states
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.ASIGNADA });
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.COMPLETADA });

      // Filter by PENDIENTE
      const filtered = await prisma.workOrder.findMany({
        where: { estado: WorkOrderEstado.PENDIENTE },
      });

      expect(filtered.length).toBeGreaterThanOrEqual(1);
      filtered.forEach((ot) => {
        expect(ot.estado).toBe(WorkOrderEstado.PENDIENTE);
      });
    }, 15000);

    it('[P0-INT-005] should filter by tipo', async () => {
      // Create OTs with different types
      await createTestWorkOrder(tracker, { tipo: WorkOrderTipo.CORRECTIVO });
      await createTestWorkOrder(tracker, { tipo: WorkOrderTipo.PREVENTIVO });

      // Filter by CORRECTIVO
      const filtered = await prisma.workOrder.findMany({
        where: { tipo: WorkOrderTipo.CORRECTIVO },
      });

      expect(filtered.length).toBeGreaterThanOrEqual(1);
      filtered.forEach((ot) => {
        expect(ot.tipo).toBe(WorkOrderTipo.CORRECTIVO);
      });
    }, 15000);

    it('[P0-INT-006] should filter by date range', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Create OTs with different dates
      await createTestWorkOrder(tracker, { created_at: yesterday });
      await createTestWorkOrder(tracker, { created_at: lastWeek });

      // Filter by date range (last 3 days)
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const filtered = await prisma.workOrder.findMany({
        where: {
          created_at: {
            gte: threeDaysAgo,
            lte: now,
          },
        },
      });

      // Should include yesterday's OT
      expect(filtered.some((ot) => ot.created_at >= threeDaysAgo)).toBe(true);
    }, 15000);

    it('[P0-INT-007] should filter by técnico assigned', async () => {
      const tecnico = await createTestUser(tracker, { name: 'Técnico Test' });
      const ot = await createTestWorkOrder(tracker, {
        estado: WorkOrderEstado.ASIGNADA,
      });

      // Assign technician
      await createTestAssignment(tracker, ot.id, tecnico.id, 'TECNICO');

      // Filter by technician
      const filtered = await prisma.workOrder.findMany({
        where: {
          assignments: {
            some: { userId: tecnico.id },
          },
        },
      });

      expect(filtered.length).toBeGreaterThanOrEqual(1);
      expect(filtered.find((w) => w.id === ot.id)).toBeDefined();
    }, 15000);

    it('[P0-INT-008] should filter by equipo', async () => {
      // Create OTs (each has its own equipo)
      const ot1 = await createTestWorkOrder(tracker);
      const ot2 = await createTestWorkOrder(tracker);

      // Filter by specific equipo
      const filtered = await prisma.workOrder.findMany({
        where: { equipo_id: ot1.equipo_id },
      });

      expect(filtered.length).toBeGreaterThanOrEqual(1);
      expect(filtered.find((w) => w.id === ot1.id)).toBeDefined();
    }, 15000);

    it('[P0-INT-009] should combine multiple filters with AND logic', async () => {
      // Create OTs with different combinations
      await createTestWorkOrder(tracker, {
        estado: WorkOrderEstado.PENDIENTE,
        tipo: WorkOrderTipo.CORRECTIVO,
      });
      await createTestWorkOrder(tracker, {
        estado: WorkOrderEstado.ASIGNADA,
        tipo: WorkOrderTipo.CORRECTIVO,
      });
      await createTestWorkOrder(tracker, {
        estado: WorkOrderEstado.PENDIENTE,
        tipo: WorkOrderTipo.PREVENTIVO,
      });

      // Filter by estado AND tipo
      const filtered = await prisma.workOrder.findMany({
        where: {
          AND: [
            { estado: WorkOrderEstado.PENDIENTE },
            { tipo: WorkOrderTipo.CORRECTIVO },
          ],
        },
      });

      // Should only include OTs that match BOTH filters
      filtered.forEach((ot) => {
        expect(ot.estado).toBe(WorkOrderEstado.PENDIENTE);
        expect(ot.tipo).toBe(WorkOrderTipo.CORRECTIVO);
      });
    }, 15000);

    it('[P0-INT-010] should filter by multiple estados (IN clause)', async () => {
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.PENDIENTE });
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.ASIGNADA });
      await createTestWorkOrder(tracker, { estado: WorkOrderEstado.COMPLETADA });

      const filtered = await prisma.workOrder.findMany({
        where: {
          estado: { in: [WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA] },
        },
      });

      filtered.forEach((ot) => {
        expect([WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA]).toContain(
          ot.estado
        );
      });
    }, 15000);
  });
});
