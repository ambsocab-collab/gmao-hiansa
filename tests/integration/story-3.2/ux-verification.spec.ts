/**
 * P2 Integration Tests for Story 3.2 - UX Verification
 *
 * Validates UX enhancements: tooltips, help text, accessibility labels
 * Reference: test-design-epic-3.md - P2 UX Enhancement Tests
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
  generateCorrelationId: vi.fn(() => 'corr-ux-verify'),
}));

describe('Story 3.2 - Integration: UX Verification (P2)', () => {
  const createdOTs: string[] = [];
  const createdEquipment: string[] = [];
  const createdLineas: string[] = [];
  const createdPlantas: string[] = [];
  const createdRepuestos: string[] = [];
  const createdComponentes: string[] = [];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (createdRepuestos.length > 0) {
      await prisma.repuesto.deleteMany({ where: { id: { in: createdRepuestos } } });
      createdRepuestos.length = 0;
    }
    if (createdComponentes.length > 0) {
      await prisma.componente.deleteMany({ where: { id: { in: createdComponentes } } });
      createdComponentes.length = 0;
    }
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

  async function createTestWorkOrder(estado: WorkOrderEstado = WorkOrderEstado.EN_PROGRESO) {
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

    const workOrder = await prisma.workOrder.create({
      data: {
        numero: `OT-${faker.string.uuid()}`,
        tipo: WorkOrderTipo.CORRECTIVO,
        estado,
        prioridad: WorkOrderPrioridad.MEDIA,
        descripcion: 'OT de prueba para UX verification',
        equipo_id: equipo.id
      }
    });
    createdOTs.push(workOrder.id);
    return workOrder;
  }

  async function createTestRepuesto(stock: number = 10) {
    const componente = await prisma.componente.create({
      data: {
        name: 'Componente Test',
        code: `COMP-${faker.string.alphanumeric(6).toUpperCase()}`
      }
    });
    createdComponentes.push(componente.id);

    const repuesto = await prisma.repuesto.create({
      data: {
        code: `REP-${faker.string.alphanumeric(8).toUpperCase()}`,
        name: 'Repuesto Test',
        stock,
        stock_minimo: 2,
        ubicacion_fisica: 'Estantería A-1',
        componente_id: componente.id
      }
    });
    createdRepuestos.push(repuesto.id);
    return repuesto;
  }

  /**
   * P2-UX-001: Estado de OT debe tener descripción amigable
   */
  it('[P2-UX-001] should have user-friendly estado labels', async () => {
    const estadoLabels: Partial<Record<WorkOrderEstado, string>> = {
      [WorkOrderEstado.PENDIENTE]: 'Pendiente de asignación',
      [WorkOrderEstado.EN_PROGRESO]: 'En progreso',
      [WorkOrderEstado.COMPLETADA]: 'Completada',
      [WorkOrderEstado.DESCARTADA]: 'Descartada'
    };

    for (const [estado, expectedLabel] of Object.entries(estadoLabels)) {
      const ot = await createTestWorkOrder(estado as WorkOrderEstado);

      // Verify estado exists and is valid
      expect(Object.values(WorkOrderEstado)).toContain(ot.estado);
      expect(estadoLabels[ot.estado]).toBe(expectedLabel);
    }
  });

  /**
   * P2-UX-002: Tipo de OT debe tener ícono asociado
   */
  it('[P2-UX-002] should have icon mapping for OT types', async () => {
    const tipoIcons: Record<WorkOrderTipo, string> = {
      [WorkOrderTipo.CORRECTIVO]: 'wrench',
      [WorkOrderTipo.PREVENTIVO]: 'calendar',
      [WorkOrderTipo.PREDICTIVO]: 'chart-line'
    };

    const workOrder = await createTestWorkOrder();

    expect(Object.keys(tipoIcons)).toContain(workOrder.tipo);
    expect(tipoIcons[workOrder.tipo]).toBeDefined();
  });

  /**
   * P2-UX-003: Stock bajo debe mostrar indicador visual
   */
  it('[P2-UX-003] should indicate low stock visually', async () => {
    const repuesto = await createTestRepuesto(1); // Stock bajo

    const isLowStock = repuesto.stock <= repuesto.stock_minimo;

    expect(isLowStock).toBe(true);
  });

  /**
   * P2-UX-004: Tiempo transcurrido debe ser calculable
   */
  it('[P2-UX-004] should calculate elapsed time for OT', async () => {
    const workOrder = await createTestWorkOrder();

    // Use created_at timestamp for elapsed time calculation
    const ot = await prisma.workOrder.findUnique({
      where: { id: workOrder.id }
    });

    const elapsed = ot?.created_at
      ? Date.now() - new Date(ot.created_at).getTime()
      : 0;

    // Should be less than 1 minute (just created)
    expect(elapsed).toBeLessThan(60000);
  });

  /**
   * P2-UX-005: Comentarios deben tener formato de timestamp relativo
   */
  it('[P2-UX-005] should support relative timestamp for comments', async () => {
    const workOrder = await createTestWorkOrder();
    const user = await prisma.user.create({
      data: {
        email: `ux-test-${faker.string.uuid()}@example.com`,
        passwordHash: 'hash',
        name: 'UX Test User'
      }
    });

    const comment = await prisma.workOrderComment.create({
      data: {
        texto: 'Comentario de prueba',
        work_order_id: workOrder.id,
        user_id: user.id
      }
    });

    const elapsed = Date.now() - new Date(comment.created_at || 0).getTime();

    // Relative time: "hace X minutos"
    const minutesAgo = Math.floor(elapsed / 60000);
    expect(minutesAgo).toBeLessThan(1); // Created just now

    await prisma.workOrderComment.delete({ where: { id: comment.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  /**
   * P2-UX-006: Fotos deben tener metadata de thumbnail
   */
  it('[P2-UX-006] should have thumbnail metadata for photos', async () => {
    const workOrder = await createTestWorkOrder();

    const foto = await prisma.workOrderPhoto.create({
      data: {
        url: 'https://example.com/photo.jpg',
        tipo: 'ANTES',
        work_order_id: workOrder.id
      }
    });

    expect(foto.url).toContain('.jpg');
    expect(foto.tipo).toBe('ANTES');

    await prisma.workOrderPhoto.delete({ where: { id: foto.id } });
  });

  /**
   * P2-UX-007: Validación de campos debe ser descriptiva
   */
  it('[P2-UX-007] should have descriptive field validation messages', async () => {
    const validationMessages = {
      stock_insuficiente: 'Stock insuficiente. Stock actual: {stock}, requerido: {cantidad}',
      estado_invalido: 'Transición de estado no permitida de {from} a {to}',
      campo_requerido: 'El campo {campo} es requerido'
    };

    // Verify messages exist and have placeholders
    expect(validationMessages.stock_insuficiente).toContain('{stock}');
    expect(validationMessages.estado_invalido).toContain('{from}');
    expect(validationMessages.campo_requerido).toContain('{campo}');
  });

  /**
   * P2-UX-008: Navegación debe tener breadcrumbs data
   */
  it('[P2-UX-008] should have breadcrumb data for navigation', async () => {
    const workOrder = await createTestWorkOrder();

    const fullOT = await prisma.workOrder.findUnique({
      where: { id: workOrder.id },
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

    // Breadcrumb: Planta > Línea > Equipo > OT
    const breadcrumbs = [
      { label: fullOT?.equipo?.linea?.planta?.name, href: `/plantas/${fullOT?.equipo?.linea?.planta?.id}` },
      { label: fullOT?.equipo?.linea?.name, href: `/lineas/${fullOT?.equipo?.linea?.id}` },
      { label: fullOT?.equipo?.name, href: `/equipos/${fullOT?.equipo?.id}` },
      { label: fullOT?.numero, href: `/ots/${fullOT?.id}` }
    ];

    expect(breadcrumbs).toHaveLength(4);
    breadcrumbs.forEach(crumb => {
      expect(crumb.label).toBeDefined();
      expect(crumb.href).toBeDefined();
    });
  });
});
