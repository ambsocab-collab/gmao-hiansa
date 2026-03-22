/**
 * Mock Helpers for Story 2.3 Integration Tests
 * Reduces repetition and improves maintainability
 */

import { faker } from '@faker-js/faker/locale/es';
import { failureReportFactory, assetFactory, otFactory } from '../../factories/data.factories';
import { vi } from 'vitest';

/**
 * Setup mocks for convertFailureReportToOT Server Action
 *
 * Usage:
 *   const { mockReport, mockWorkOrder } = setupConvertToOTMocks();
 *   const result = await convertFailureReportToOT('fr-123');
 */
export function setupConvertToOTMocks(overrides: {
  report?: Partial<ReturnType<typeof failureReportFactory>>;
  equipo?: Partial<ReturnType<typeof assetFactory>>;
  workOrder?: Partial<ReturnType<typeof otFactory>>;
} = {}) {
  // Generate default mock data using factories
  const defaultReport = failureReportFactory({
    id: 'fr-123',
    descripcion: 'Fallo en motor principal',
    estado: 'NUEVO',
  });

  const defaultEquipo = assetFactory({
    id: 'equipo-123',
    name: 'Prensa Hidráulica',
  });

  const defaultWorkOrder = otFactory({
    id: 'wo-456',
    numero: `OT-${new Date().getFullYear()}-001`,
    tipo: 'CORRECTIVO',
    estado: 'PENDIENTE',
  });

  // Apply user overrides
  const mockReport = { ...defaultReport, ...overrides.report };
  const mockEquipo = { ...defaultEquipo, ...overrides.equipo };
  const mockWorkOrder = { ...defaultWorkOrder, ...overrides.workOrder };

  // Return mock setup function for dynamic vi.import usage
  return {
    mockReport,
    mockEquipo,
    mockWorkOrder,
    // Helper to setup Prisma mocks
    setupPrismaMocks: (prisma: any) => {
      prisma.failureReport.findUnique = vi.fn().mockResolvedValueOnce({
        ...mockReport,
        equipo: mockEquipo,
      } as any);

      prisma.workOrder.findFirst = vi.fn().mockResolvedValueOnce(null);

      prisma.workOrder.create = vi.fn().mockResolvedValueOnce(mockWorkOrder as any);

      prisma.failureReport.update = vi.fn().mockResolvedValueOnce({
        ...mockReport,
        estado: 'CONVERTIDO',
      } as any);
    },
  };
}

/**
 * Setup mocks for discardFailureReport Server Action
 *
 * Usage:
 *   const { mockReport, setupPrismaMocks, expectedDiscardSSEEvent } = setupDiscardMocks();
 *   const result = await discardFailureReport('fr-123', 'supervisor-456');
 */
export function setupDiscardMocks(overrides: {
  report?: Partial<ReturnType<typeof failureReportFactory>>;
  reporter?: { id: string; name: string };
} = {}) {
  // Use a consistent reporter ID
  const reporterId = 'user-123';

  const defaultReport = failureReportFactory({
    id: 'fr-123',
    estado: 'NUEVO',
    reportadoPor: reporterId, // Use the same reporter ID
  });

  const defaultReporter = {
    id: reporterId,
    name: 'Juan Pérez',
  };

  const mockReport = { ...defaultReport, ...overrides.report };
  const mockReporter = { ...defaultReporter, ...overrides.reporter };

  return {
    mockReport,
    mockReporter,
    // Expected discard SSE event (matching discardFailureReport implementation)
    expectedDiscardSSEEvent: (id: string = reporterId) => ({
      type: 'failure_report_discarded',
      data: {
        reportId: mockReport.id,
        numero: mockReport.numero,
        motivo: 'No requiere acción',
      },
      target: { userIds: [id] },
    }),
    // Helper to setup Prisma mocks
    setupPrismaMocks: (prisma: any) => {
      prisma.failureReport.findUnique = vi.fn().mockResolvedValueOnce({
        ...mockReport,
        reporter: mockReporter,
      } as any);

      prisma.failureReport.update = vi.fn().mockResolvedValueOnce({
        ...mockReport,
        estado: 'DESCARTADO',
      } as any);
    },
  };
}

/**
 * Setup mocks for SSE notification tests
 *
 * Usage:
 *   const { mockReport, mockWorkOrder, setupPrismaMocks, expectedSSEEvent } = setupSSENotificationMocks();
 *   setupPrismaMocks(prisma);
 *   await convertFailureReportToOT('fr-123');
 *   expect(emitSSEEvent).toHaveBeenCalledWith(expectedSSEEvent);
 */
export function setupSSENotificationMocks() {
  const { mockReport, mockWorkOrder, mockEquipo, setupPrismaMocks } = setupConvertToOTMocks();

  return {
    mockReport,
    mockWorkOrder,
    mockEquipo,
    setupPrismaMocks,
    // Expected SSE event structure (matching convertFailureReportToOT implementation)
    expectedSSEEvent: {
      type: 'failure_report_converted',
      data: {
        reportId: mockReport.id,
        reportNumero: mockReport.numero,
        workOrderId: mockWorkOrder.id,
        workOrderNumero: mockWorkOrder.numero,
        equipo: mockEquipo.name, // Match failureReport.equipo.name
      },
      target: { capability: 'can_view_all_ots' },
    },
    // Expected discard SSE event (matching discardFailureReport implementation)
    expectedDiscardSSEEvent: (reporterId: string) => ({
      type: 'failure_report_discarded',
      data: {
        reportId: mockReport.id,
        numero: mockReport.numero,
        motivo: 'No requiere acción',
      },
      target: { userIds: [reporterId] },
    }),
  };
}
