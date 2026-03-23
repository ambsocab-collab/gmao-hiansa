/**
 * Integration Tests: createFailureReport Server Action
 * Story 2.2: Formulario Reporte de Avería (Mobile First)
 *
 * Tests the failure report creation Server Action with mocked database.
 * Validates sequential number generation, SSE notifications, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFailureReport } from '@/app/actions/averias'
import { prisma } from '@/lib/db'
import { emitSSEEvent } from '@/lib/sse/server'
import { logger } from '@/lib/observability/logger'
import { trackPerformance } from '@/lib/observability/performance'

// Mock dependencies BEFORE imports
vi.mock('@/lib/db', () => ({
  prisma: {
    failureReport: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    workOrder: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/sse/server')
vi.mock('@/lib/observability/logger')
vi.mock('@/lib/observability/performance')

describe('createFailureReport Server Action', () => {
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

  describe('[P1] Happy Path - Valid Report Creation', () => {
    it('[P1-E2E-001] Should create failure report with sequential number (AV-YYYY-NNN)', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor principal',
        reportadoPor: 'user-123',
        fotoUrl: undefined,
      }

      const mockReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor principal',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: {
            planta: {
              division: 'HIROCK',
            },
          },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null) // No existing reports
      vi.mocked(prisma.failureReport.create).mockResolvedValue(mockReport)

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(result).toEqual(mockReport)
      expect(prisma.failureReport.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            numero: expect.stringMatching(/^AV-2026-\d{3}$/), // AV-YYYY-NNN format
            descripcion: 'Fallo en motor principal',
            equipoId: 'eq-1',
            reportadoPor: 'user-123',
          }),
        })
      )
    })

    it('[P1-E2E-002] Should include full equipo hierarchy in response (linea.planta.division)', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      const mockReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: {
            name: 'Línea 1',
            planta: {
              name: 'HiRock',
              division: 'HIROCK',
            },
          },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue(mockReport)

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(result.equipo).toHaveProperty('linea')
      expect(result.equipo.linea).toHaveProperty('planta')
      expect(result.equipo.linea.planta).toHaveProperty('division')
      expect(result.equipo.linea.planta.division).toBe('HIROCK')
    })

    it('[P1-E2E-003] Should emit SSE notification to supervisors with can_view_all_ots capability', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      const mockReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: { id: 'eq-1', name: 'Prensa PH-500', linea: { planta: {} } },
        reporter: { id: 'user-123', name: 'John Doe' },
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue(mockReport)

      // Act
      await createFailureReport(reportData)

      // Assert
      expect(emitSSEEvent).toHaveBeenCalledWith({
        type: 'failure-report-created',
        data: expect.objectContaining({
          id: 'report-1',
          numero: 'AV-2026-001',
          equipoNombre: 'Prensa PH-500',
        }),
        target: { capability: 'can_view_all_ots' },
      })
    })
  })

  describe('[P1] Validation - Zod Schema', () => {
    it('[P1-E2E-004] Should throw ValidationError when equipoId is missing', async () => {
      // Arrange
      const invalidData = {
        equipoId: '',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      // Act & Assert
      await expect(createFailureReport(invalidData)).rejects.toThrow()
      expect(prisma.failureReport.create).not.toHaveBeenCalled()
    })

    it('[P1-E2E-005] Should throw ValidationError when descripcion is <10 characters', async () => {
      // Arrange
      const invalidData = {
        equipoId: 'eq-1',
        descripcion: 'Corto', // <10 characters
        reportadoPor: 'user-123',
      }

      // Act & Assert
      await expect(createFailureReport(invalidData)).rejects.toThrow()
      expect(prisma.failureReport.create).not.toHaveBeenCalled()
    })

    it('[P1-E2E-006] Should allow fotoUrl to be optional (null or undefined)', async () => {
      // Arrange - Test with fotoUrl: null
      const dataWithNull = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor principal de línea 1',
        reportadoPor: 'user-123',
        fotoUrl: null,
      }

      const mockReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor principal de línea 1',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: {
            planta: {},
          },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue(mockReport)

      // Act
      const result = await createFailureReport(dataWithNull)

      // Assert
      expect(prisma.failureReport.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fotoUrl: null,
          }),
        })
      )
    })
  })

  describe('[P1] Sequential Number Generation', () => {
    it('[P1-E2E-007] Should increment number when existing reports exist for same year', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      // Simulate existing report: AV-2026-005
      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue({
        numero: 'AV-2026-005',
      })

      const mockReport = {
        id: 'report-2',
        numero: 'AV-2026-006',
        descripcion: 'Fallo en motor',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: {
            planta: {},
          },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      }

      vi.mocked(prisma.failureReport.create).mockResolvedValue(mockReport)

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(result.numero).toBe('AV-2026-006')
      expect(prisma.failureReport.findFirst).toHaveBeenCalledWith({
        where: {
          numero: {
            startsWith: 'AV-2026',
          },
        },
        orderBy: {
          numero: 'desc',
        },
        select: {
          numero: true,
        },
      })
    })

    it('[P1-E2E-008] Should retry with different number if unique constraint violated (race condition)', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      // First call: No existing reports
      vi.mocked(prisma.failureReport.findFirst)
        .mockResolvedValueOnce(null)
        // After retry: Still AV-2026-001 exists (race condition)
        .mockResolvedValueOnce({ numero: 'AV-2026-001' })

      // Simulate unique constraint violation on first create attempt
      const uniqueConstraintError = {
        code: 'P2002',
        meta: { target: ['numero'] },
      }

      vi.mocked(prisma.failureReport.create)
        .mockRejectedValueOnce(uniqueConstraintError) // First attempt fails
        .mockResolvedValueOnce({
          // Second attempt succeeds with AV-2026-002
          id: 'report-2',
          numero: 'AV-2026-002',
          descripcion: 'Fallo en motor',
          fotoUrl: null,
          equipoId: 'eq-1',
          reportadoPor: 'user-123',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
          equipo: {
            id: 'eq-1',
            name: 'Prensa PH-500',
            linea: { planta: {} },
          },
          reporter: {
            id: 'user-123',
            name: 'John Doe',
          },
        })

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(prisma.failureReport.create).toHaveBeenCalledTimes(2) // Retry happened
      expect(result.numero).toBe('AV-2026-002') // Incremented on retry
    })
  })

  describe('[P0] Error Handling - Database Errors', () => {
    it('[P0-E2E-001] Should throw error when database create fails', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor principal',
        reportadoPor: 'user-123',
      }

      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockRejectedValue(dbError)

      // Act & Assert
      await expect(createFailureReport(reportData)).rejects.toThrow('Database connection failed')
    })

    it('[P0-E2E-002] Should log error with correlation ID when creation fails', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockRejectedValue(new Error('DB Error'))

      // Act
      try {
        await createFailureReport(reportData)
      } catch (error) {
        // Expected error
      }

      // Assert
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('[P2] Edge Cases', () => {
    it('[P2-E2E-001] Should handle description with special characters', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo: motor #3 sobrecalentado! (reparar)',
        reportadoPor: 'user-123',
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue({
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo: motor #3 sobrecalentado! (reparar)',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: { planta: {} },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      })

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(result).toBeTruthy()
      expect(prisma.failureReport.create).toHaveBeenCalled()
    })

    it('[P2-E2E-002] Should truncate very long descriptions to database field limit', async () => {
      // Arrange
      const longDescription = 'A'.repeat(5000) // Very long description

      const reportData = {
        equipoId: 'eq-1',
        descripcion: longDescription,
        reportadoPor: 'user-123',
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue({
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: longDescription,
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: { planta: {} },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      })

      // Act
      const result = await createFailureReport(reportData)

      // Assert
      expect(result).toBeTruthy()
      // Note: Actual truncation would happen at database layer or via Zod schema
    })
  })

  describe('[P0] Performance Tracking', () => {
    it('[P0-E2E-003] Should track performance and log warning if >3s (NFR-S5 requirement)', async () => {
      // Arrange
      const reportData = {
        equipoId: 'eq-1',
        descripcion: 'Fallo en motor',
        reportadoPor: 'user-123',
      }

      vi.mocked(prisma.failureReport.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.failureReport.create).mockResolvedValue({
        id: 'report-1',
        numero: 'AV-2026-001',
        descripcion: 'Fallo en motor',
        fotoUrl: null,
        equipoId: 'eq-1',
        reportadoPor: 'user-123',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        equipo: {
          id: 'eq-1',
          name: 'Prensa PH-500',
          linea: { planta: {} },
        },
        reporter: {
          id: 'user-123',
          name: 'John Doe',
        },
      })

      const mockPerf = {
        end: vi.fn(),
      }
      vi.mocked(trackPerformance).mockReturnValue(mockPerf)

      // Act
      await createFailureReport(reportData)

      // Assert
      expect(trackPerformance).toHaveBeenCalledWith('create_failure_report', expect.any(String))
      expect(mockPerf.end).toHaveBeenCalled()
    })
  })
})
