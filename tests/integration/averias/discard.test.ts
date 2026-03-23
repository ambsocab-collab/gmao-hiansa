/**
 * Integration Tests: discardFailureReport Server Action
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Tests the discard failure report Server Action with mocked database.
 * Validates validation, state transitions, and SSE notifications.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { discardFailureReport } from '@/app/actions/averias'
import { prisma } from '@/lib/db'
import { emitSSEEvent } from '@/lib/sse/server'
import { logger } from '@/lib/observability/logger'
import { ValidationError } from '@/lib/utils/errors'

// Mock dependencies BEFORE imports
vi.mock('@/lib/db', () => ({
  prisma: {
    failureReport: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/sse/server')
vi.mock('@/lib/observability/logger')

describe('discardFailureReport Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('[P1] Happy Path - Successful Discard', () => {
    it('[P1-E2E-001] Should discard failure report and update estado to DESCARTADO', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'user-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        reportadoPor: 'user-456',
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      const result = await discardFailureReport(failureReportId, userId)

      // Assert
      expect(result).toEqual({ success: true })
      expect(prisma.failureReport.update).toHaveBeenCalledWith({
        where: { id: failureReportId },
        data: { estado: 'DESCARTADO' },
      })
    })

    it('[P1-E2E-002] Should emit SSE notification to reporter with discard reason', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        reportadoPor: 'user-456',
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      await discardFailureReport(failureReportId, userId)

      // Assert
      expect(emitSSEEvent).toHaveBeenCalledWith({
        type: 'failure_report_discarded',
        data: expect.objectContaining({
          reportId: 'report-1',
          numero: 'AV-2026-001',
          motivo: 'No requiere acción',
        }),
        target: { userIds: ['user-456'] }, // Notify reporter
      })
    })

    it('[P1-E2E-003] Should log audit trail with userId and report number', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        reportadoPor: 'user-456',
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      await discardFailureReport(failureReportId, userId)

      // Assert
      expect(logger.info).toHaveBeenCalledWith(
        userId,
        expect.any(String), // 'discard_failure_report' or similar
        expect.any(String), // correlationId
        expect.objectContaining({
          failureReportId: 'report-1',
          numero: 'AV-2026-001',
        })
      )
    })
  })

  describe('[P1] Validation - Error States', () => {
    it('[P1-E2E-004] Should throw ValidationError when failure report not found', async () => {
      // Arrange
      const failureReportId = 'nonexistent-report'
      const userId = 'user-123'

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(null)

      // Act & Assert
      await expect(discardFailureReport(failureReportId, userId)).rejects.toThrow('Avería no encontrada')
      expect(prisma.failureReport.update).not.toHaveBeenCalled()
    })

    it('[P1-E2E-005] Should throw ValidationError when report already converted (estado=CONVERTIDO)', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'CONVERTIDO', // Already converted to OT
        tipo: 'avería',
        reportadoPor: 'user-456',
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)

      // Act & Assert
      await expect(discardFailureReport(failureReportId, userId)).rejects.toThrow(
        'No se puede descartar una avería ya convertida a OT'
      )
      expect(prisma.failureReport.update).not.toHaveBeenCalled()
    })

    it('[P1-E2E-006] Should allow discard when estado is NUEVO or DISCARTE_REPEAT', async () => {
      // Arrange - Test with estado=NUEVO (should succeed)
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO', // Valid state for discard
        tipo: 'avería',
        reportadoPor: 'user-456',
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      const result = await discardFailureReport(failureReportId, userId)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  describe('[P2] Edge Cases', () => {
    it('[P2-E2E-001] Should emit SSE notification only to original reporter', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        reportadoPor: 'user-456', // Original reporter
        reporter: {
          id: 'user-456',
          name: 'Jane Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      await discardFailureReport(failureReportId, userId)

      // Assert - Verify only reporter receives notification
      expect(emitSSEEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { userIds: ['user-456'] },
        })
      )
    })

    it('[P2-E2E-002] Should handle userId from different user (supervisor discarding operario report)', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const supervisorUserId = 'supervisor-123' // Different from reporter

      const mockFailureReport = {
        id: 'report-1',
        numero: 'AV-2026-001',
        estado: 'NUEVO',
        tipo: 'avería',
        reportadoPor: 'operario-456',
        reporter: {
          id: 'operario-456',
          name: 'John Doe',
        },
      }

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue(mockFailureReport)
      vi.mocked(prisma.failureReport.update).mockResolvedValue({
        ...mockFailureReport,
        estado: 'DESCARTADO',
      })

      // Act
      const result = await discardFailureReport(failureReportId, supervisorUserId)

      // Assert
      expect(result.success).toBe(true)
      // Audit log should show supervisor who discarded
      expect(logger.info).toHaveBeenCalledWith(
        supervisorUserId,
        expect.any(String),
        expect.any(String),
        expect.any(Object)
      )
    })
  })

  describe('[P0] Error Handling - Database Errors', () => {
    it('[P0-E2E-001] Should throw error when database update fails', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      const dbError = new Error('Database connection failed')

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue({
        id: 'report-1',
        estado: 'NUEVO',
        tipo: 'avería',
      })
      vi.mocked(prisma.failureReport.update).mockRejectedValue(dbError)

      // Act & Assert
      await expect(discardFailureReport(failureReportId, userId)).rejects.toThrow('Database connection failed')
    })

    it('[P0-E2E-002] Should log error with correlation ID on failure', async () => {
      // Arrange
      const failureReportId = 'report-1'
      const userId = 'supervisor-123'

      vi.mocked(prisma.failureReport.findUnique).mockResolvedValue({
        id: 'report-1',
        estado: 'NUEVO',
        tipo: 'avería',
      })
      vi.mocked(prisma.failureReport.update).mockRejectedValue(new Error('DB Error'))

      // Act
      try {
        await discardFailureReport(failureReportId, userId)
      } catch (error) {
        // Expected
      }

      // Assert
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
