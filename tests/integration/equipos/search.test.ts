/**
 * Integration Tests: searchEquipos Server Action
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Tests the equipment search Server Action with mocked database.
 * Validates business logic, error handling, and performance tracking.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchEquipos } from '@/app/actions/equipos'
import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'

// Mock dependencies BEFORE imports
vi.mock('@/lib/db', () => ({
  prisma: {
    equipo: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/observability/logger')
vi.mock('@/lib/observability/performance')

describe('searchEquipos Server Action', () => {
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

  describe('[P1] Happy Path - Valid Search', () => {
    it('[P1-E2E-001] Should return equipos when query has 3+ characters', async () => {
      // Arrange
      const mockEquipos = [
        {
          id: 'eq-1',
          name: 'Prensa PH-500',
          code: 'PH-500',
          linea: {
            name: 'Línea 1',
            planta: {
              name: 'HiRock',
              division: 'HIROCK',
            },
          },
        },
        {
          id: 'eq-2',
          name: 'Prensa PH-600',
          code: 'PH-600',
          linea: {
            name: 'Línea 2',
            planta: {
              name: 'Ultra',
              division: 'ULTRA',
            },
          },
        },
      ]

      vi.mocked(prisma.equipo.findMany).mockResolvedValue(mockEquipos)

      // Act
      const result = await searchEquipos('pren')

      // Assert
      expect(result).toEqual(mockEquipos)
      expect(prisma.equipo.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'pren',
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          code: true,
          linea: {
            select: {
              name: true,
              planta: {
                select: {
                  name: true,
                  division: true,
                },
              },
            },
          },
        },
        take: 10,
      })
    })

    it('[P1-E2E-002] Should return equipo with full hierarchy (linea.planta.division)', async () => {
      // Arrange
      const mockEquipo = {
        id: 'eq-1',
        name: 'Prensa PH-500',
        code: 'PH-500',
        linea: {
          name: 'Línea 1',
          planta: {
            name: 'HiRock',
            division: 'HIROCK',
          },
        },
      }

      vi.mocked(prisma.equipo.findMany).mockResolvedValue([mockEquipo])

      // Act
      const result = await searchEquipos('prensa')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('linea')
      expect(result[0].linea).toHaveProperty('planta')
      expect(result[0].linea.planta).toHaveProperty('division')
      expect(result[0].linea.planta.division).toBe('HIROCK')
    })
  })

  describe('[P1] Validation - Error Handling', () => {
    it('[P1-E2E-003] Should throw ValidationError when query has <3 characters', async () => {
      // Act & Assert
      await expect(searchEquipos('pr')).rejects.toThrow('La búsqueda debe tener al menos 3 caracteres')
      expect(prisma.equipo.findMany).not.toHaveBeenCalled()
    })

    it('[P1-E2E-004] Should throw ValidationError when query is empty string', async () => {
      // Act & Assert
      await expect(searchEquipos('')).rejects.toThrow()
      expect(prisma.equipo.findMany).not.toHaveBeenCalled()
    })

    it('[P1-E2E-005] Should trim whitespace from query before validation', async () => {
      // Act & Assert
      // "pr" with spaces is still <3 characters after trim
      await expect(searchEquipos('  pr  ')).rejects.toThrow()
    })
  })

  describe('[P1] Performance - Query Constraints', () => {
    it('[P1-E2E-006] Should limit results to max 10 equipos (R-001 performance requirement)', async () => {
      // Arrange
      const mockEquipos = Array.from({ length: 15 }, (_, i) => ({
        id: `eq-${i}`,
        name: `Equipo ${i}`,
        code: `EQ-${i}`,
        linea: {
          name: 'Línea 1',
          planta: {
            name: 'HiRock',
            division: 'HIROCK',
          },
        },
      }))

      vi.mocked(prisma.equipo.findMany).mockResolvedValue(mockEquipos)

      // Act
      await searchEquipos('equipo')

      // Assert
      expect(prisma.equipo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10, // Max 10 results for performance
        })
      )
    })

    it('[P1-E2E-007] Should use case-insensitive search (mode: insensitive)', async () => {
      // Arrange
      vi.mocked(prisma.equipo.findMany).mockResolvedValue([])

      // Act
      await searchEquipos('PRENSA') // Uppercase

      // Assert
      expect(prisma.equipo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.objectContaining({
              contains: 'PRENSA',
              mode: 'insensitive', // PostgreSQL ILIKE
            }),
          }),
        })
      )
    })
  })

  describe('[P2] Edge Cases', () => {
    it('[P2-E2E-001] Should return empty array when no equipos match query', async () => {
      // Arrange
      vi.mocked(prisma.equipo.findMany).mockResolvedValue([])

      // Act
      const result = await searchEquipos('nonexistent')

      // Assert
      expect(result).toEqual([])
      expect(prisma.equipo.findMany).toHaveBeenCalled()
    })

    it('[P2-E2E-002] Should handle special characters in query', async () => {
      // Arrange
      vi.mocked(prisma.equipo.findMany).mockResolvedValue([])

      // Act
      const result = await searchEquipos('prensa-500')

      // Assert
      expect(result).toEqual([])
      expect(prisma.equipo.findMany).toHaveBeenCalled()
    })
  })

  describe('[P0] Error Handling - Database Errors', () => {
    it('[P0-E2E-001] Should throw error when database query fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.equipo.findMany).mockRejectedValue(dbError)

      // Act & Assert
      await expect(searchEquipos('pren')).rejects.toThrow('Database connection failed')
    })
  })
})
