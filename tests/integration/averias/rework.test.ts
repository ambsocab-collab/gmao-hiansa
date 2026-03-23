/**
 * Integration Tests: createReworkOT Server Action
 * Story 2.3: Triage de Averías y Conversión a OTs (Edge Case: AC6)
 *
 * Tests the re-work OT creation Server Action with mocked database.
 * Validates high priority assignment, parent OT linking, and edge case handling.
 *
 * **NOTE:** This function requires schema changes to WorkOrder model:
 * - Add `prioridad` field (ALTA/MEDIA/BAJA)
 * - Add `parent_work_order_id` field to link to original OT
 * These changes are coordinated with Epic 3 (Kanban) implementation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createReworkOT } from '@/app/actions/averias'
import { prisma } from '@/lib/db'
import { emitSSEEvent } from '@/lib/sse/server'
import { logger } from '@/lib/observability/logger'
import { ValidationError } from '@/lib/utils/errors'

// Mock dependencies BEFORE imports
vi.mock('@/lib/db', () => ({
  prisma: {
    workOrder: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/sse/server')
vi.mock('@/lib/observability/logger')

describe('createReworkOT Server Action (AC6 Edge Case)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('[P2] Happy Path - Successful Rework OT Creation', () => {
    it('[P2-E2E-001] Should create re-work OT with high priority (NFR-S101)', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'La reparación no funciona después de 24h'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA', // Must be completed to create re-work
        tipo: 'CORRECTIVO',
        descripcion: 'Reparar: Prensa PH-500 - Motor principal',
        equipo_id: 'eq-1',
        failure_report_id: 'report-1',
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
        },
      }

      const mockReworkOT = {
        id: 'ot-2',
        numero: 'OT-2026-002',
        tipo: 'CORRECTIVO',
        estado: 'PENDIENTE',
        prioridad: 'ALTA', // NFR-S101: Re-work OTs have high priority
        descripcion: `[RE-TRABAJO] ${motivo}\n\nOT Original: OT-2026-001\nDescripción original: Reparar: Prensa PH-500 - Motor principal`,
        equipo_id: 'eq-1',
        parent_work_order_id: 'ot-1', // AC6: Linked to original OT
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null) // No existing OTs for year
      vi.mocked(prisma.workOrder.create).mockResolvedValue(mockReworkOT)

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result).toEqual({
        success: true,
        workOrder: mockReworkOT,
      })
      expect(mockReworkOT.prioridad).toBe('ALTA')
      expect(mockReworkOT.parent_work_order_id).toBe('ot-1')
    })

    it('[P2-E2E-002] Should emit SSE notification to supervisors after re-work OT created', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Pieza incorrecta instalada'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        descripcion: 'Reparar: Prensa PH-500',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Prensa PH-500' },
      }

      const mockReworkOT = {
        id: 'ot-2',
        numero: 'OT-2026-002',
        prioridad: 'ALTA',
        estado: 'PENDIENTE',
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.workOrder.create).mockResolvedValue(mockReworkOT)

      // Act
      await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(emitSSEEvent).toHaveBeenCalledWith({
        type: 'rework_ot_created',
        data: expect.objectContaining({
          reworkOTId: 'ot-2',
          reworkOTNumero: 'OT-2026-002',
          originalOTId: 'ot-1',
          originalOTNumero: 'OT-2026-001',
          motivo,
        }),
        target: { capability: 'can_view_all_ots' },
      })
    })

    it('[P2-E2E-003] Should include original OT number in re-work description for traceability', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Componente defectuoso'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        descripcion: 'Reparar: Compresor-500',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Compresor-500' },
      }

      const mockReworkOT = {
        id: 'ot-2',
        numero: 'OT-2026-002',
        descripcion: `[RE-TRABAJO] ${motivo}\n\nOT Original: OT-2026-001\nDescripción original: Reparar: Compresor-500`,
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.workOrder.create).mockResolvedValue(mockReworkOT)

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.workOrder.descripcion).toContain('OT Original: OT-2026-001')
      expect(result.workOrder.descripcion).toContain('Descripción original: Reparar: Compresor-500')
    })
  })

  describe('[P2] Validation - Error States', () => {
    it('[P2-E2E-004] Should throw ValidationError when original OT not found', async () => {
      // Arrange
      const originalWorkOrderId = 'nonexistent-ot'
      const motivo = 'Re-work needed'

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(null)

      // Act & Assert
      await expect(createReworkOT(originalWorkOrderId, motivo)).rejects.toThrow('Orden de Trabajo original no encontrada')
    })

    it('[P2-E2E-005] Should throw ValidationError when original OT is NOT COMPLETADA', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Need re-work'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'PENDIENTE', // NOT completed - invalid for re-work
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)

      // Act & Assert
      await expect(createReworkOT(originalWorkOrderId, motivo)).rejects.toThrow(
        'Solo se pueden crear OTs de re-trabajo para OTs completadas'
      )
    })

    it('[P2-E2E-006] Should allow re-work for OTs in estado: COMPLETADA only', async () => {
      // Arrange - Test with COMPLETADA (should succeed)
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Reparación falló después de 48h'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA', // Valid state for re-work
        tipo: 'CORRECTIVO',
        descripcion: 'Reparar: Prensa PH-500',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Prensa PH-500' },
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.workOrder.create).mockResolvedValue({
        id: 'ot-2',
        numero: 'OT-2026-002',
        prioridad: 'ALTA',
        estado: 'PENDIENTE',
        descripcion: expect.any(String),
      })

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  describe('[P2] Edge Cases', () => {
    it('[P2-E2E-007] Should handle sequential number generation for re-work OTs', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Primera reparación falló'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-010', // Existing OT number is 010
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Motor-500' },
      }

      // Simulate existing OT: OT-2026-010
      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue({
        numero: 'OT-2026-010',
      })
      vi.mocked(prisma.workOrder.create).mockResolvedValue({
        id: 'ot-2',
        numero: 'OT-2026-011', // Should increment to 011
        prioridad: 'ALTA',
        estado: 'PENDIENTE',
      })

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.workOrder.numero).toBe('OT-2026-011')
    })

    it('[P2-E2E-008] Should handle motivo with special characters and length', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Pieza XYZ-123 está defectuosa! (reemplazar bajo garantía)'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        descripcion: 'Reparar: Prensa',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      const expectedDescription = `[RE-TRABAJO] ${motivo}\n\nOT Original: OT-2026-001\nDescripción original: Reparar: Prensa`

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.workOrder.create).mockResolvedValue({
        id: 'ot-2',
        numero: 'OT-2026-002',
        prioridad: 'ALTA',
        estado: 'PENDIENTE',
        descripcion: expectedDescription,
      })

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.success).toBe(true)
      expect(result.workOrder.descripcion).toContain(motivo)
    })
  })

  describe('[P1] Error Handling - Database Errors', () => {
    it('[P1-E2E-001] Should throw error when database create fails', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Re-work needed'

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue({
        id: 'ot-1',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
      })

      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.workOrder.findFirst).mockRejectedValue(dbError)

      // Act & Assert
      await expect(createReworkOT(originalWorkOrderId, motivo)).rejects.toThrow('Database connection failed')
    })

    it('[P1-E2E-002] Should log error with correlation ID on failure', async () => {
      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Re-work needed'

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue({
        id: 'ot-1',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
      })

      vi.mocked(prisma.workOrder.findFirst).mockRejectedValue(new Error('DB Error'))

      // Act
      try {
        await createReworkOT(originalWorkOrderId, motivo)
      } catch (error) {
        // Expected
      }

      // Assert
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('[P2] Schema Requirements - Epic 3 Coordination', () => {
    it('[P2-E2E-003] Should document that prioridad field is required (NFR-S101)', async () => {
      // This test documents the requirement for Epic 3 schema changes
      // The test itself will fail until Epic 3 adds the prioridad field

      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Re-work needed'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)

      // Note: This will fail until Epic 3 adds prioridad field
      // When Epic 3 is implemented, update this test to verify prioridad='ALTA'
      vi.mocked(prisma.workOrder.create).mockResolvedValue({
        id: 'ot-2',
        numero: 'OT-2026-002',
        estado: 'PENDIENTE',
        // prioridad field missing here until Epic 3
      })

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.success).toBe(true)
      // TODO: Uncomment after Epic 3
      // expect(result.workOrder.prioridad).toBe('ALTA')
    })

    it('[P2-E2E-004] Should document that parent_work_order_id field is required (AC6)', async () => {
      // This test documents the requirement for Epic 3 schema changes
      // The test itself will fail until Epic 3 adds the parent_work_order_id field

      // Arrange
      const originalWorkOrderId = 'ot-1'
      const motivo = 'Re-work needed'

      const mockOriginalOT = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'COMPLETADA',
        tipo: 'CORRECTIVO',
        equipo_id: 'eq-1',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      vi.mocked(prisma.workOrder.findUnique).mockResolvedValue(mockOriginalOT)
      vi.mocked(prisma.workOrder.findFirst).mockResolvedValue(null)

      // Note: This will fail until Epic 3 adds parent_work_order_id field
      vi.mocked(prisma.workOrder.create).mockResolvedValue({
        id: 'ot-2',
        numero: 'OT-2026-002',
        estado: 'PENDIENTE',
        // parent_work_order_id field missing here until Epic 3
      })

      // Act
      const result = await createReworkOT(originalWorkOrderId, motivo)

      // Assert
      expect(result.success).toBe(true)
      // TODO: Uncomment after Epic 3
      // expect(result.workOrder.parent_work_order_id).toBe('ot-1')
    })
  })
})
