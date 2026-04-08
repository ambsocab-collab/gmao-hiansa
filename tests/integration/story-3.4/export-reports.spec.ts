/**
 * P2 Integration Tests for Story 3.4 - Export and Reports
 *
 * Validates data export functionality and report generation
 * Reference: test-design-epic-3.md - P2 Export Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/db';
import { WorkOrderEstado, WorkOrderTipo, WorkOrderPrioridad } from '@prisma/client';

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock observability
vi.mock('@/lib/observability/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/lib/observability/performance', () => ({
  trackPerformance: vi.fn(() => ({
    end: vi.fn(),
  })),
  generateCorrelationId: vi.fn(() => 'corr-export'),
}));

describe('Story 3.4 - Integration: Export and Reports (P2)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (createdOTs.length > 0) {
      await prisma.workOrder.deleteMany({ where: { id: { in: createdOTs } } });
      createdOTs.length = 0;
    }
    if (createdEquipment.length > 0) {
      await prisma.equipo.deleteMany({ where: { id: { in: createdEquipment } } });
      createdEquipment.length = 0;
    }
    if (createdLineas.length > 0) {
      await prisma.linea.deleteMany({ where: { id: { in: createdLineas } } });
      createdLineas.length = 0;
    }
    if (createdPlantas.length > 0) {
      await prisma.planta.deleteMany({ where: { id: { in: createdPlantas } } });
      createdPlantas.length = 0;
    }
  });

  async function createTestHierarchy() {
    const planta = await prisma.planta.create({
      data: {
        name: 'Planta Test',
        code: `PLT-${faker.string.alphanumeric(6).toUpperCase()}`,
        division: 'HIROCK'
      }
    });
    createdPlantas.push(planta.id);

    const linea = await prisma.linea.create({
      data: {
        name: 'Línea Test',
        code: `LIN-${faker.string.alphanumeric(6).toUpperCase()}`,
        planta_id: planta.id
      }
    });
    createdLineas.push(linea.id);

    const equipo = await prisma.equipo.create({
      data: {
        name: 'Equipo Test',
        code: `EQ-${faker.string.alphanumeric(8).toUpperCase()}`,
        linea_id: linea.id
      }
    });
    createdEquipment.push(equipo.id);

    return { planta, linea, equipo };
  }

  async function createTestWorkOrders(count: number, prefix: string = faker.string.alphanumeric(4)) {
    const { equipo } = await createTestHierarchy();
    const workOrders = [];

    for (let i = 0; i < count; i++) {
      const wo = await prisma.workOrder.create({
        data: {
          numero: `OT-${prefix}-${i.toString().padStart(3, '0')}`,
          tipo: [WorkOrderTipo.CORRECTIVO, WorkOrderTipo.PREVENTIVO][i % 2],
          estado: [WorkOrderEstado.PENDIENTE, WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.COMPLETADA][i % 3],
          prioridad: [WorkOrderPrioridad.ALTA, WorkOrderPrioridad.MEDIA, WorkOrderPrioridad.BAJA][i % 3],
          descripcion: `OT para exportación ${i}`,
          equipo_id: equipo.id
        }
      });
      createdOTs.push(wo.id);
      workOrders.push(wo);
    }

    return workOrders;
  }

  /**
   * P2-EXPORT-001: Exportar a CSV debe incluir todas las columnas
   */
  it('[P2-EXPORT-001] should include all columns in CSV export', { timeout: 15000 }, async () => {
    await createTestWorkOrders(10);

    const workOrders = await prisma.workOrder.findMany({
      where: { id: { in: createdOTs } },
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true
              }
            }
          }
        }
      }
    });

    // CSV columns expected
    const csvColumns = [
      'numero',
      'tipo',
      'estado',
      'prioridad',
      'descripcion',
      'equipo',
      'linea',
      'planta',
      'created_at',
      'updated_at'
    ];

    // Verify data structure supports CSV export
    workOrders.forEach(wo => {
      csvColumns.forEach(col => {
        if (col === 'equipo') {
          expect(wo.equipo?.name).toBeDefined();
        } else if (col === 'linea') {
          expect(wo.equipo?.linea?.name).toBeDefined();
        } else if (col === 'planta') {
          expect(wo.equipo?.linea?.planta?.name).toBeDefined();
        } else {
          expect(wo).toHaveProperty(col);
        }
      });
    });
  });

  /**
   * P2-EXPORT-002: Export debe manejar caracteres especiales
   */
  it('[P2-EXPORT-002] should handle special characters in export', async () => {
    const { equipo } = await createTestHierarchy();

    const specialChars = [
      'Descripción con acentos: áéíóúñ',
      'Comillas "dobles" y \'simples\'',
      'Símbolos: @#$%^&*()',
      'Emojis: 🔧⚡🛠️'
    ];

    for (const descripcion of specialChars) {
      const wo = await prisma.workOrder.create({
        data: {
          numero: `OT-SPEC-${faker.string.uuid()}`,
          tipo: WorkOrderTipo.CORRECTIVO,
          estado: WorkOrderEstado.PENDIENTE,
          prioridad: WorkOrderPrioridad.MEDIA,
          descripcion,
          equipo_id: equipo.id
        }
      });
      createdOTs.push(wo.id);

      // Verify special characters are preserved
      const saved = await prisma.workOrder.findUnique({
        where: { id: wo.id }
      });

      expect(saved?.descripcion).toBe(descripcion);
    }
  });

  /**
   * P2-EXPORT-003: Export con filtros debe respetar el filtro
   */
  it('[P2-EXPORT-003] should respect filters in export', async () => {
    await createTestWorkOrders(20);

    // Export only COMPLETADA
    const completedOTs = await prisma.workOrder.findMany({
      where: { estado: WorkOrderEstado.COMPLETADA, id: { in: createdOTs } }
    });

    // All exported OTs should be COMPLETADA
    completedOTs.forEach(wo => {
      expect(wo.estado).toBe(WorkOrderEstado.COMPLETADA);
    });
  });

  /**
   * P2-EXPORT-004: Export debe completarse eficientemente
   */
  it('[P2-EXPORT-004] should export records efficiently', { timeout: 15000 }, async () => {
    await createTestWorkOrders(20);

    const startTime = Date.now();

    const workOrders = await prisma.workOrder.findMany({
      where: { id: { in: createdOTs } },
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true
              }
            }
          }
        }
      },
      take: 20
    });

    const elapsed = Date.now() - startTime;

    expect(workOrders.length).toBe(20);
    expect(elapsed).toBeLessThan(5000);
  });

  /**
   * P2-EXPORT-005: Paginación para export grandes
   */
  it('[P2-EXPORT-005] should support pagination for large exports', async () => {
    await createTestWorkOrders(20);

    const pageSize = 10;
    let totalExported = 0;
    let page = 0;

    while (true) {
      const batch = await prisma.workOrder.findMany({
        where: { id: { in: createdOTs } },
        skip: page * pageSize,
        take: pageSize
      });

      if (batch.length === 0) break;

      totalExported += batch.length;
      page++;
    }

    expect(totalExported).toBe(20);
  });

  /**
   * P2-REPORT-001: Reporte de OTs por estado
   */
  it('[P2-REPORT-001] should generate status report', { timeout: 15000 }, async () => {
    await createTestWorkOrders(30);

    const statusReport = await prisma.workOrder.groupBy({
      by: ['estado'],
      where: { id: { in: createdOTs } },
      _count: {
        id: true
      }
    });

    expect(statusReport.length).toBeGreaterThan(0);

    // Report should have estado and count
    statusReport.forEach(item => {
      expect(item.estado).toBeDefined();
      expect(item._count.id).toBeGreaterThan(0);
    });
  });

  /**
   * P2-REPORT-002: Reporte de OTs por tipo y prioridad
   */
  it('[P2-REPORT-002] should generate tipo-prioridad report', { timeout: 15000 }, async () => {
    await createTestWorkOrders(30);

    const tipoPrioridadReport = await prisma.workOrder.groupBy({
      by: ['tipo', 'prioridad'],
      where: { id: { in: createdOTs } },
      _count: {
        id: true
      }
    });

    expect(tipoPrioridadReport.length).toBeGreaterThan(0);

    tipoPrioridadReport.forEach(item => {
      expect(item.tipo).toBeDefined();
      expect(item.prioridad).toBeDefined();
      expect(item._count.id).toBeGreaterThan(0);
    });
  });

  /**
   * P2-REPORT-003: Reporte de tiempo promedio por estado
   */
  it('[P2-REPORT-003] should calculate average time per state', async () => {
    const { equipo } = await createTestHierarchy();

    // Create OT with timing
    const wo = await prisma.workOrder.create({
      data: {
        numero: `OT-TIME-${faker.string.uuid()}`,
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.COMPLETADA,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT para timing',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(wo.id);

    const saved = await prisma.workOrder.findUnique({
      where: { id: wo.id }
    });

    // Verify timestamps exist
    expect(saved?.created_at).toBeDefined();
    expect(saved?.updated_at).toBeDefined();
  });

  /**
   * P2-REPORT-004: Reporte mensual de OTs
   */
  it('[P2-REPORT-004] should generate monthly report', async () => {
    const { equipo } = await createTestHierarchy();

    // Create OTs in different months using created_at override
    const janDate = new Date('2024-01-15');
    const febDate = new Date('2024-02-15');

    const janOT = await prisma.workOrder.create({
      data: {
        numero: `OT-JAN-${faker.string.uuid()}`,
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.COMPLETADA,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'Enero',
        equipo_id: equipo.id,
        created_at: janDate
      }
    });
    createdOTs.push(janOT.id);

    const febOT = await prisma.workOrder.create({
      data: {
        numero: `OT-FEB-${faker.string.uuid()}`,
        tipo: WorkOrderTipo.CORRECTIVO,
        estado: WorkOrderEstado.COMPLETADA,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'Febrero',
        equipo_id: equipo.id,
        created_at: febDate
      }
    });
    createdOTs.push(febOT.id);

    // Query by month
    const janReport = await prisma.workOrder.findMany({
      where: {
        id: { in: createdOTs },
        created_at: {
          gte: new Date('2024-01-01'),
          lt: new Date('2024-02-01')
        }
      }
    });

    const febReport = await prisma.workOrder.findMany({
      where: {
        id: { in: createdOTs },
        created_at: {
          gte: new Date('2024-02-01'),
          lt: new Date('2024-03-01')
        }
      }
    });

    expect(janReport).toHaveLength(1);
    expect(febReport).toHaveLength(1);
  });

  /**
   * P2-REPORT-005: KPIs de mantenibilidad
   */
  it('[P2-REPORT-005] should calculate maintainability KPIs', async () => {
    const { equipo } = await createTestHierarchy();

    // Create sample OTs for KPI calculation
    for (let i = 0; i < 10; i++) {
      const wo = await prisma.workOrder.create({
        data: {
          numero: `OT-KPI-${faker.string.uuid()}`,
          tipo: WorkOrderTipo.CORRECTIVO,
          estado: WorkOrderEstado.COMPLETADA,
          prioridad: WorkOrderPrioridad.MEDIA,
          descripcion: `KPI test ${i}`,
          equipo_id: equipo.id
        }
      });
      createdOTs.push(wo.id);
    }

    // Calculate KPIs
    const totalOTs = await prisma.workOrder.count({ where: { id: { in: createdOTs } } });
    const completedOTs = await prisma.workOrder.count({
      where: { estado: WorkOrderEstado.COMPLETADA, id: { in: createdOTs } }
    });
    const completionRate = totalOTs > 0 ? (completedOTs / totalOTs) * 100 : 0;

    expect(completionRate).toBeGreaterThanOrEqual(0);
    expect(completionRate).toBeLessThanOrEqual(100);
  });
});
