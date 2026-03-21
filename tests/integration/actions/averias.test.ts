/**
 * Integration Tests: Story 2.2 - Server Actions
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Server Action: createFailureReport()
 * - Validación Zod (equipoId, descripcion)
 * - Generación de número único
 * - Database Prisma operations
 * - SSE notification emit
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFailureReport } from '@/app/actions/averias';
import { prisma } from '@/lib/db';
import { emitSSEEvent } from '@/lib/sse/server';

// Mocks
vi.mock('@/lib/db', () => ({
  prisma: {
    failureReport: {
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/sse/server', () => ({
  emitSSEEvent: vi.fn(),
}));

describe('createFailureReport - Server Action Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * P0-INT-001: Validación - equipoId es requerido
   *
   * AC3: Equipo es REQUERIDO
   */
  it('should reject when equipoId is missing', async () => {
    // Given: Data sin equipoId
    const inputData = {
      equipoId: '',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When/Then: Lanza ValidationError
    await expect(createFailureReport(inputData)).rejects.toThrow('equipo');
  });

  /**
   * P0-INT-002: Validación - descripción es requerida
   *
   * AC4: Descripción es REQUERIDA (mínimo 10 caracteres)
   */
  it('should reject when descripcion is empty', async () => {
    // Given: Data con descripción vacía
    const inputData = {
      equipoId: 'equipo-123',
      descripcion: '',
      reportadoPor: 'user-123',
    };

    // When/Then: Lanza ValidationError
    await expect(createFailureReport(inputData)).rejects.toThrow('descripción');
  });

  /**
   * P0-INT-003: Validación - descripción mínimo 10 caracteres
   *
   * AC4: Mínimo 10 caracteres para descripción
   */
  it('should reject when descripcion is too short', async () => {
    // Given: Data con descripción corta
    const inputData = {
      equipoId: 'equipo-123',
      descripcion: 'Corto', // 5 caracteres
      reportadoPor: 'user-123',
    };

    // When/Then: Lanza ValidationError
    await expect(createFailureReport(inputData)).rejects.toThrow('10 caracteres');
  });

  /**
   * P0-INT-004: Generación de número único sequential
   *
   * AC6: Número formato AV-YYYY-NNN, sequential por año
   */
  it('should generate sequential AV numbers per year', async () => {
    // Given: Mock de count retorna 2 (ya hay 2 reportes este año)
    vi.mocked(prisma.failureReport.count).mockResolvedValueOnce(2);

    // Mock de create retorna reporte con número
    const mockReport = {
      id: 'report-123',
      numero: 'AV-2026-003',
      descripcion: 'Fallo en motor',
      equipoId: 'equipo-123',
      reportadoPor: 'user-123',
      createdAt: new Date(),
      equipo: {},
      reporter: {},
    };
    vi.mocked(prisma.failureReport.create).mockResolvedValueOnce(mockReport);

    const inputData = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When: Creo reporte
    const result = await createFailureReport(inputData);

    // Then: Número generado correctamente
    expect(result.numero).toBe('AV-2026-003');
    expect(prisma.failureReport.count).toHaveBeenCalledWith({
      where: { numero: { startsWith: 'AV-2026' } },
    });
  });

  /**
   * P0-INT-005: Creación en database Prisma
   *
   * AC6: Reporte almacenado en database
   */
  it('should create report in database', async () => {
    // Given: Mock de create
    const mockReport = {
      id: 'report-123',
      numero: 'AV-2026-001',
      descripcion: 'Fallo en motor',
      equipoId: 'equipo-123',
      reportadoPor: 'user-123',
      createdAt: new Date(),
    };
    vi.mocked(prisma.failureReport.create).mockResolvedValueOnce(mockReport);

    const inputData = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When: Creo reporte
    await createFailureReport(inputData);

    // Then: Prisma create llamado con data correcta
    expect(prisma.failureReport.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        descripcion: 'Fallo en motor principal',
        equipoId: 'equipo-123',
        reportadoPor: 'user-123',
      }),
      include: expect.objectContaining({
        equipo: expect.any(Object),
        reporter: expect.any(Object),
      }),
    });
  });

  /**
   * P1-INT-001: Emitir notificación SSE
   *
   * AC6: Notificación SSE failure_report_created enviada
   */
  it('should emit SSE notification on successful creation', async () => {
    // Given: Mock de create exitoso
    const mockReport = {
      id: 'report-123',
      numero: 'AV-2026-001',
      descripcion: 'Fallo en motor',
      equipoId: 'equipo-123',
      reportadoPor: 'user-123',
      createdAt: new Date(),
      equipo: {
        id: 'equipo-123',
        name: 'Prensa Hidráulica',
        linea: { planta: {} },
      },
      reporter: {
        name: 'Operario Test',
      },
    };
    vi.mocked(prisma.failureReport.create).mockResolvedValueOnce(mockReport);

    const inputData = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When: Creo reporte
    await createFailureReport(inputData);

    // Then: SSE notification emitida
    expect(emitSSEEvent).toHaveBeenCalledWith({
      type: 'failure_report_created',
      data: expect.objectContaining({
        reportId: 'report-123',
        numero: 'AV-2026-001',
        equipo: expect.any(Object),
      }),
      target: { capability: 'can_view_all_ots' },
    });
  });

  /**
   * P2-INT-001: Foto opcional - reporte creado sin foto
   *
   * AC5: Foto es opcional
   */
  it('should create report without foto when fotoUrl not provided', async () => {
    // Given: Mock de create
    const mockReport = {
      id: 'report-123',
      numero: 'AV-2026-001',
      descripcion: 'Fallo en motor sin foto',
      equipoId: 'equipo-123',
      reportadoPor: 'user-123',
      fotoUrl: null,
      createdAt: new Date(),
    };
    vi.mocked(prisma.failureReport.create).mockResolvedValueOnce(mockReport);

    const inputData = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor sin foto',
      reportadoPor: 'user-123',
      fotoUrl: undefined,
    };

    // When: Creo reporte sin foto
    const result = await createFailureReport(inputData);

    // Then: Reporte creado exitosamente
    expect(result.numero).toBe('AV-2026-001');
    expect(prisma.failureReport.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        fotoUrl: null,
      }),
    });
  });
});
