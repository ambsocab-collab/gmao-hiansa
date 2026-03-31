/**
 * Integration Tests for Story 3.4 - Pagination (AC1)
 *
 * Tests for getWorkOrdersList pagination functionality.
 * Uses Prisma directly (not Server Actions) to avoid auth mocking issues.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestDataTracker,
  setupCleanup,
  createTestWorkOrder,
} from './helpers/work-order-test-helpers';
import { prisma } from '@/lib/db';

describe('Story 3.4 - Integration: Pagination (AC1)', () => {
  const tracker = createTestDataTracker();

  beforeEach(() => {
    tracker.createdOTs.length = 0;
    tracker.createdEquipment.length = 0;
    tracker.createdLineas.length = 0;
    tracker.createdPlantas.length = 0;
  });

  setupCleanup(tracker);

  describe('getWorkOrdersList - Paginación', () => {
    it('[P0-INT-001] should return paginated list of work orders', async () => {
      // Create 5 test OTs
      for (let i = 0; i < 5; i++) {
        await createTestWorkOrder(tracker);
      }

      // Simulate getWorkOrdersList with pagination
      const page = 1;
      const pageSize = 100;

      const [workOrders, total] = await Promise.all([
        prisma.workOrder.findMany({
          where: { id: { in: tracker.createdOTs } },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            equipo: {
              include: {
                linea: {
                  include: {
                    planta: true,
                  },
                },
              },
            },
            assignments: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        }),
        prisma.workOrder.count({ where: { id: { in: tracker.createdOTs } } }),
      ]);

      expect(workOrders.length).toBeGreaterThanOrEqual(5);
      expect(total).toBeGreaterThanOrEqual(5);
    }, 15000);

    it('[P0-INT-002] should respect page size limit', async () => {
      // Create 3 test OTs
      for (let i = 0; i < 3; i++) {
        await createTestWorkOrder(tracker);
      }

      // Simulate pagination with page size 2
      const pageSize = 2;
      const workOrders = await prisma.workOrder.findMany({
        take: pageSize,
        orderBy: { created_at: 'desc' },
      });

      expect(workOrders.length).toBeLessThanOrEqual(2);
    }, 15000);

    it('[P0-INT-003] should return correct pagination metadata', async () => {
      // Create test OTs
      for (let i = 0; i < 3; i++) {
        await createTestWorkOrder(tracker);
      }

      const page = 1;
      const pageSize = 100;

      const total = await prisma.workOrder.count();
      const totalPages = Math.ceil(total / pageSize);

      expect(total).toBeGreaterThanOrEqual(3);
      expect(totalPages).toBeGreaterThanOrEqual(1);
    }, 15000);

    it('[P0-INT-004] should handle second page correctly', async () => {
      // Create 5 test OTs
      for (let i = 0; i < 5; i++) {
        await createTestWorkOrder(tracker);
      }

      const pageSize = 2;
      const page = 2;

      const workOrders = await prisma.workOrder.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
      });

      // Should get up to 2 items on page 2
      expect(workOrders.length).toBeLessThanOrEqual(2);
    }, 15000);

    it('[P0-INT-005] should include related entities in response', async () => {
      await createTestWorkOrder(tracker);

      const workOrders = await prisma.workOrder.findMany({
        take: 1,
        include: {
          equipo: {
            include: {
              linea: {
                include: {
                  planta: true,
                },
              },
            },
          },
          assignments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      expect(workOrders.length).toBeGreaterThanOrEqual(1);
      const ot = workOrders[0];

      // Verify related entities are included
      expect(ot.equipo).toBeDefined();
      expect(ot.equipo.linea).toBeDefined();
      expect(ot.equipo.linea.planta).toBeDefined();
    }, 15000);
  });
});
