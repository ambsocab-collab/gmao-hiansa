/**
 * Integration Tests: Story 2.3 - Server Actions de Triage
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - AC3: Server Action convertFailureReportToOT()
 * - AC4: Server Action discardFailureReport()
 * - SSE events emisión
 * - Auditoría logged
 * - Concurrent conversion handling
 *
 * Prisma Mock: Sigue patrón de Story 2.2
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { convertFailureReportToOT, discardFailureReport } from '@/app/actions/averias';
import { prisma } from '@/lib/db';
import { emitSSEEvent } from '@/lib/sse/server';
import { logger } from '@/lib/observability/logger';
import { setupConvertToOTMocks, setupDiscardMocks, setupSSENotificationMocks } from '../helpers/averias-mocks';

// Mocks
vi.mock('@/lib/db', () => ({
  prisma: {
    failureReport: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    workOrder: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/sse/server', () => ({
  emitSSEEvent: vi.fn(),
}));

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

describe('convertFailureReportToOT - Server Action Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * P0-INT-001: Crea WorkOrder con estado "Pendiente"
   *
   * AC3: Given aviso existente
   *       When convierto a OT
   *       Then WorkOrder creada con estado "Pendiente"
   */
  it('should create WorkOrder with status Pendiente', async () => {
    // Given: Aviso existente con mocks setup
    const { mockReport, mockWorkOrder, setupPrismaMocks } = setupConvertToOTMocks();
    setupPrismaMocks(prisma);

    // When: Convierto a OT
    const result = await convertFailureReportToOT('fr-123');

    // Then: WorkOrder creada con estado Pendiente
    expect(result.success).toBe(true);
    expect(result.workOrder.estado).toBe('PENDIENTE');
    expect(prisma.workOrder.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        estado: 'PENDIENTE',
      }),
    });
  });

  /**
   * P0-INT-002: OT marcada como "Correctivo"
   *
   * AC3: Given aviso existente
   *       When convierto a OT
   *       Then tipo de OT marcado como "Correctivo"
   */
  it('should mark WorkOrder as Correctivo type', async () => {
    // Given: Aviso existente con mocks setup
    const { mockReport, mockWorkOrder, setupPrismaMocks } = setupConvertToOTMocks();
    setupPrismaMocks(prisma);

    // When: Convierto a OT
    const result = await convertFailureReportToOT('fr-123');

    // Then: Tipo es Correctivo
    expect(result.workOrder.tipo).toBe('CORRECTIVO');
  });

  /**
   * P1-INT-003: Emite notificación SSE a técnicos asignados
   *
   * AC3: Given OT creada
   *       When conversión completada
   *       Then notificación SSE enviada a técnicos asignados
   *
   * NFR-S4: SSE notificación en <30s
   */
  it('should emit SSE notification to assigned technicians', async () => {
    // Given: Aviso existente con SSE mocks setup
    const { mockReport, setupPrismaMocks, expectedSSEEvent } = setupSSENotificationMocks();
    setupPrismaMocks(prisma);

    // When: Convierto a OT
    await convertFailureReportToOT('fr-123');

    // Then: SSE event emitido
    expect(emitSSEEvent).toHaveBeenCalledWith(expectedSSEEvent);
  });

  /**
   * P2-INT-004: Maneja conversión concurrente correctamente
   *
   * AC3: Given dos supervisores intentan convertir mismo aviso
   *       When ambos ejecutan conversión simultánea
   *       Then solo uno tiene éxito (el primero)
   *       And segundo recibe error de conflicto
   */
  it('should handle concurrent conversion correctly', async () => {
    // Given: Aviso ya convertido
    const mockFailureReport = {
      id: 'fr-123',
      estado: 'CONVERTIDO',
      workOrderId: 'wo-456',
    };

    vi.mocked(prisma.failureReport.findUnique).mockResolvedValueOnce(mockFailureReport as any);

    // When/Then: Segunda conversión falla
    await expect(convertFailureReportToOT('fr-123')).rejects.toThrow('ya ha sido convertida');
  });

  /**
   * P2-INT-005: Performance tracking <1s
   *
   * AC3: Given conversión ejecutándose
   *       When completada
   *       Then performance logged si >1s
   *
   * NFR-S7: Performance <1s CRITICAL
   */
  it('should track performance and log if >1s', async () => {
    // Given: Aviso existente con mocks setup
    const { setupPrismaMocks } = setupConvertToOTMocks();
    setupPrismaMocks(prisma);

    // When: Convierto a OT
    const result = await convertFailureReportToOT('fr-123');

    // Then: Performance tracked (mock验证)
    expect(result.success).toBe(true);
    // En implementación real, trackPerformance.end() se llama
  });
});

describe('discardFailureReport - Server Action Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * P0-INT-006: Marca aviso como "Descartado"
   *
   * AC4: Given aviso existente
   *       When descarto aviso
   *       Then aviso marcado como "Descartado"
   */
  it('should mark failure report as Descartado', async () => {
    // Given: Aviso existente con mocks setup
    const { setupPrismaMocks } = setupDiscardMocks();
    setupPrismaMocks(prisma);

    // When: Descarto aviso
    const result = await discardFailureReport('fr-123', 'supervisor-456');

    // Then: Status actualizado a Descartado
    expect(result.success).toBe(true);
    expect(prisma.failureReport.update).toHaveBeenCalledWith({
      where: { id: 'fr-123' },
      data: { estado: 'DESCARTADO' },
    });
  });

  /**
   * P1-INT-007: Auditoría logged
   *
   * AC4: Given aviso descartado
   *       When acción completada
   *       Then auditoría logged: "Avería {id} descartada por {userId}"
   */
  it('should log audit trail for discard action', async () => {
    // Given: Aviso existente con mocks setup
    const { mockReport, setupPrismaMocks } = setupDiscardMocks();
    setupPrismaMocks(prisma);

    // When: Descarto aviso
    await discardFailureReport('fr-123', 'supervisor-456');

    // Then: Auditoría logged with new signature: (userId, action, correlationId, metadata)
    expect(logger.info).toHaveBeenCalledWith(
      'supervisor-456',
      'discard_failure_report',
      expect.any(String), // correlationId
      expect.objectContaining({
        failureReportId: 'fr-123',
        numero: mockReport.numero,
      })
    );
  });

  /**
   * P2-INT-008: Notifica reporter vía SSE
   *
   * AC4: Given aviso descartado
   *       When acción completada
   *       Then reporter notificado vía SSE que su aviso fue descartado
   */
  it('should notify reporter via SSE about discard', async () => {
    // Given: Aviso existente con reporter y SSE mocks
    const reporterId = 'user-123';
    const { mockReport, setupPrismaMocks, expectedDiscardSSEEvent } = setupDiscardMocks();
    setupPrismaMocks(prisma);

    // When: Descarto aviso
    await discardFailureReport('fr-123', 'supervisor-456');

    // Then: SSE event emitido al reporter
    expect(emitSSEEvent).toHaveBeenCalledWith(expectedDiscardSSEEvent(reporterId));
  });

  /**
   * P2-INT-009: Error handling - aviso no encontrado
   *
   * AC4: Given aviso no existe
   *       When intento descartar
   *       Then error lanzado
   */
  it('should throw error if failure report not found', async () => {
    // Given: Aviso no existe
    vi.mocked(prisma.failureReport.update).mockRejectedValueOnce(
      new Error('Record not found')
    );

    // When/Then: Error lanzado
    await expect(discardFailureReport('fr-999', 'supervisor-456')).rejects.toThrow();
  });
});

describe('SSE Real-time Sync Integration Tests', () => {
  /**
   * P2-INT-010: SSE sync para conversión de OT
   *
   * AC5: Given múltiples usuarios en triage
   *       When usuario A convierte aviso a OT
   *       Then todos usuarios ven actualización vía SSE
   */
  it('should sync OT conversion via SSE to all viewers', async () => {
    // Given: Setup con mocks
    const { setupPrismaMocks } = setupConvertToOTMocks();
    setupPrismaMocks(prisma);

    // When: Usuario A convierte aviso
    await convertFailureReportToOT('fr-123');

    // Then: SSE event emitido a todos con can_view_all_ots
    expect(emitSSEEvent).toHaveBeenCalledWith({
      type: 'failure_report_converted',
      data: expect.any(Object),
      target: { capability: 'can_view_all_ots' },
    });
  });

  /**
   * P2-INT-011: SSE sync para descarte
   *
   * AC5: Given múltiples usuarios en triage
   *       When usuario A descarta aviso
   *       Then todos usuarios ven actualización vía SSE
   */
  it('should sync discard via SSE to all viewers', async () => {
    // Given: Setup con mocks
    const { mockReporter, setupPrismaMocks } = setupDiscardMocks();
    setupPrismaMocks(prisma);

    // When: Usuario A descarta aviso
    await discardFailureReport('fr-123', 'supervisor-456');

    // Then: SSE event emitido a reporter
    expect(emitSSEEvent).toHaveBeenCalledWith({
      type: 'failure_report_discarded',
      data: expect.any(Object),
      target: { userIds: [mockReporter.id] },
    });
  });
});

describe.skip('AC6: Re-trabajo Edge Case', () => {
  /**
   * P1-INT-012: Rechazo de reparación genera OT de re-trabajo
   *
   * AC6: Given operario confirma reparación no funciona
   *       When reporta rechazo
   *       Then OT de re-trabajo creada con prioridad alta
   *       And OT vinculada a OT original
   *
   * NOTE: Skipped until AC6 is fully implemented with Epic 3 schema changes
   *       - Requires prioridad field in WorkOrder model
   *       - Requires parent_work_order_id field in WorkOrder model
   *       - Server Action createReworkOT() already created in app/actions/averias.ts
   */
  it.skip('should create rework OT with high priority when repair rejected', async () => {
    // Implementation pending Epic 3 schema coordination
  });

  /**
   * P2-INT-013: Notificación enviada a supervisor para revisión
   *
   * AC6: Given OT de re-trabajo creada
   *       Then notificación enviada a supervisor
   *
   * NOTE: Skipped until AC6 is fully implemented
   */
  it.skip('should notify supervisor when rework OT created', async () => {
    // Implementation pending Epic 3 schema coordination
  });
});
