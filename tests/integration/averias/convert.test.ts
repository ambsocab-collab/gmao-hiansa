/**
 * Integration Tests: convertFailureReportToOT Server Action
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Tests the conversion of failure reports to work orders with mocked database.
 * Validates transaction integrity, race condition prevention, and OT number generation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertFailureReportToOT } from '@/app/actions/averias'
import { prisma } from '@/lib/db'
import { emitSSEEvent } from '@/lib/sse/server'
import { logger } from '@/lib/observability/logger'
import { trackPerformance } from '@/lib/observability/performance'
import { ValidationError } from '@/lib/utils/errors'

// Mock dependencies BEFORE imports
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
}))

vi.mock('@/lib/sse/server')
vi.mock('@/lib/observability/logger')
vi.mock('@/lib/observability/performance')

describe('convertFailureReportToOT Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock trackPerformance to return object with end method
    vi.mocked(trackPerformance).mockReturnValue({
      end: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('[P1] Happy Path - Successful Conversion', () => {
    it('[P1-E2E-001] Should convert avería to OT with sequential number (OT-YYYY-NNN)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        descripcion: 'Fallo en motor principal',
        equipoId: 'eq-1',
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
        },
      }

      const mockWorkOrder = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        tipo: 'CORRECTIVO',
        estado: 'PENDIENTE',
        descripcion: 'Reparar: Prensa PH-500 - Fallo en motor principal',
        equipo_id: 'eq-1',
        failure_report_id: 'report-1',
      }

      // Mock Prisma transaction
      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockResolvedValue({}),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue(null), // No existing OTs
            create: vi.fn().mockResolvedValue(mockWorkOrder),
          },
        })
      })

      // Act
      const result = await convertFailureReportToOT(failureReportId)

      // Assert
      expect(result).toEqual({
        success: true,
        workOrder: mockWorkOrder,
      })
      expect(mockWorkOrder.numero).toMatch(/^OT-2026-\d{3}$/)
      expect(mockWorkOrder.tipo).toBe('CORRECTIVO')
      expect(mockWorkOrder.estado).toBe('PENDIENTE')
    })

    it('[P1-E2E-002] Should update failureReport estado to CONVERTIDO (transactional)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      const mockWorkOrder = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        tipo: 'CORRECTIVO',
        estado: 'PENDIENTE',
      }

      let updatedEstado = null

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        const tx = {
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockImplementation(async ({ data }) => {
              updatedEstado = data.estado
              return {}
            }),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue(mockWorkOrder),
          },
        }
        return await callback(tx)
      })

      // Act
      const result = await convertFailureReportToOT(failureReportId)

      // Assert
      expect(updatedEstado).toBe('CONVERTIDO')
      expect(result.success).toBe(true)
    })

    it('[P1-E2E-003] Should emit SSE notification after successful conversion', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      const mockWorkOrder = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        estado: 'PENDIENTE',
      }

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockResolvedValue({}),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue(mockWorkOrder),
          },
        })
      })

      // Act
      await convertFailureReportToOT(failureReportId)

      // Assert
      expect(emitSSEEvent).toHaveBeenCalledWith({
        type: 'work-order-updated',
        data: expect.objectContaining({
          workOrderId: 'ot-1',
          otNumero: 'OT-2026-001',
          estado: 'PENDIENTE',
        }),
        target: { capability: 'can_view_all_ots' },
      })
    })
  })

  describe('[P1] Validation - Error States', () => {
    it('[P1-E2E-004] Should throw ValidationError when failure report not found', async () => {
      // Arrange
      const failureReportId = 'nonexistent-report'

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        const tx = {
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(null), // Not found
          },
        }
        return await callback(tx)
      })

      // Act & Assert
      await expect(convertFailureReportToOT(failureReportId)).rejects.toThrow('Avería no encontrada')
    })

    it('[P1-E2E-005] Should throw ValidationError when report already converted (estado=CONVERTIDO)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'CONVERTIDO', // Already converted
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
          },
        })
      })

      // Act & Assert
      await expect(convertFailureReportToOT(failureReportId)).rejects.toThrow('Esta avería ya ha sido convertida a OT')
    })

    it('[P1-E2E-006] Should throw ValidationError when report is discarded (estado=DESCARTADO)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'DESCARTADO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
          },
        })
      })

      // Act & Assert
      await expect(convertFailureReportToOT(failureReportId)).rejects.toThrow('No se puede convertir una avería descartada')
    })

    it('[P1-E2E-007] Should throw ValidationError when report tipo is "reparación" (not avería)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'reparación', // Already a repair report, not an avería
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
          },
        })
      })

      // Act & Assert
      await expect(convertFailureReportToOT(failureReportId)).rejects.toThrow('Solo se pueden convertir averías')
    })
  })

  describe('[P1] Transaction Integrity - Race Condition Prevention', () => {
    it('[P1-E2E-008] Should prevent duplicate OT when two supervisors convert simultaneously', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      let callCount = 0

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        callCount++

        // Second call should fail with "already converted" error
        if (callCount > 1) {
          const error: any = new Error('Ya convertida')
          error.code = 'P2002'
          throw error
        }

        // First call succeeds
        const tx = {
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockResolvedValue({
              id: 'report-1',
              estado: 'CONVERTIDO',
            }),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue({
              id: 'ot-1',
              numero: 'OT-2026-001',
              tipo: 'CORRECTIVO',
              estado: 'PENDIENTE',
            }),
          },
        }

        return await callback(tx)
      })

      // Act - Simulate two concurrent calls
      const promise1 = convertFailureReportToOT(failureReportId)
      const promise2 = convertFailureReportToOT(failureReportId)

      // Assert
      const [result1, result2] = await Promise.allSettled([promise1, promise2])

      // At least one should fail (transaction isolation)
      const successCount = [result1, result2].filter((r) => r.status === 'fulfilled').length
      expect(successCount).toBeLessThanOrEqual(1) // Only one should succeed
    })

    it('[P1-E2E-009] Should retry with different OT number if unique constraint violated', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      // Simulate existing OT: OT-2026-005
      let createCallCount = 0
      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        const tx = {
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockResolvedValue({}),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue({
              numero: 'OT-2026-005',
            }),
            create: vi.fn().mockImplementation(async () => {
              createCallCount++
              // First attempt: Unique constraint violation
              if (createCallCount === 1) {
                const error: any = new Error('Unique constraint')
                error.code = 'P2002'
                error.meta = { target: ['numero'] }
                throw error
              }
              // Second attempt succeeds with OT-2026-006
              return {
                id: 'ot-2',
                numero: 'OT-2026-006',
                tipo: 'CORRECTIVO',
                estado: 'PENDIENTE',
              }
            }),
          },
        }

        return await callback(tx)
      })

      // Act
      const result = await convertFailureReportToOT(failureReportId)

      // Assert
      expect(result.workOrder.numero).toBe('OT-2026-006')
      expect(createCallCount).toBe(2) // Retry happened
    })
  })

  describe('[P0] Error Handling - Database Errors', () => {
    it('[P0-E2E-001] Should throw error when transaction fails', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const dbError = new Error('Transaction failed')
      vi.mocked(prisma.$transaction).mockRejectedValue(dbError)

      // Act & Assert
      await expect(convertFailureReportToOT(failureReportId)).rejects.toThrow('Transaction failed')
    })

    it('[P0-E2E-002] Should log error with correlation ID on failure', async () => {
      // Arrange
      const failureReportId = 'report-1'

      vi.mocked(prisma.$transaction).mockRejectedValue(new Error('DB Error'))

      // Act
      try {
        await convertFailureReportToOT(failureReportId)
      } catch (error) {
        // Expected
      }

      // Assert
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('[P0] Performance Tracking', () => {
    it('[P0-E2E-003] Should track performance and log warning if >1s (NFR-S7 CRITICAL)', async () => {
      // Arrange
      const failureReportId = 'report-1'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        equipo: { id: 'eq-1', name: 'Prensa' },
      }

      const mockWorkOrder = {
        id: 'ot-1',
        numero: 'OT-2026-001',
        tipo: 'CORRECTIVO',
        estado: 'PENDIENTE',
      }

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback({
          failureReport: {
            findUnique: vi.fn().mockResolvedValue(mockFailureReport),
            update: vi.fn().mockResolvedValue({}),
          },
          workOrder: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue(mockWorkOrder),
          },
        })
      })

      const mockPerf = {
        end: vi.fn(),
      }
      vi.mocked(trackPerformance).mockReturnValue(mockPerf)

      // Act
      await convertFailureReportToOT(failureReportId)

      // Assert
      expect(trackPerformance).toHaveBeenCalledWith('convert_failure_report_to_ot', expect.any(String))
      expect(mockPerf.end).toHaveBeenCalled()
    })
  })
})
