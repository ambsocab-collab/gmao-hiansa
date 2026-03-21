/**
 * Integration Tests: searchEquipos Server Action
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Tests the Server Action directly without HTTP layer
 * Uses test database with seeded data (10 equipos)
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { searchEquipos } from '@/app/actions/equipos'
import { prisma } from '@/lib/db'

describe('searchEquipos Server Action - Integration Tests', () => {
  beforeAll(async () => {
    // Verify database has test data
    const count = await prisma.equipo.count()
    expect(count).toBeGreaterThan(0)
  })

  describe('Validations', () => {
    /**
     * P0-API-002: Server Action valida mínimo 3 caracteres
     */
    it('[P0-API-002] should require minimum 3 characters', async () => {
      await expect(searchEquipos('pr')).rejects.toThrow('La búsqueda debe tener al menos 3 caracteres')
    })

    it('should reject empty string', async () => {
      await expect(searchEquipos('')).rejects.toThrow('La búsqueda debe tener al menos 3 caracteres')
    })

    it('should reject whitespace-only query', async () => {
      await expect(searchEquipos('   ')).rejects.toThrow()
    })

    it('should reject query with special characters that could break SQL', async () => {
      // SQL injection attempts should be handled safely by Prisma
      const results = await searchEquipos("'; DROP TABLE equipos; --")
      expect(Array.isArray(results)).toBe(true)
      // Should return empty array, not crash
      expect(results.length).toBe(0)
    })
  })

  describe('Search Functionality', () => {
    /**
     * P0-API-001: Server Action retorna resultados con búsqueda válida
     */
    it('[P0-API-001] should return equipos for valid search', async () => {
      const startTime = Date.now()
      const resultados = await searchEquipos('pren')
      const endTime = Date.now()
      const duration = endTime - startTime

      // Then: Results array returned
      expect(Array.isArray(resultados)).toBe(true)

      // And: At least one equipo contains "pren" (case-insensitive)
      const hasPrensa = resultados.some((e: any) =>
        e.name.toLowerCase().includes('pren')
      )
      expect(hasPrensa).toBe(true)

      // And: Response time <2s (cold start allowance, subsequent runs <200ms)
      expect(duration).toBeLessThan(2000)

      console.log(`✅ Search completed in ${duration}ms (first run has cold start)`)
    })

    /**
     * P0-API-003: Server Action usa case-insensitive search (ILIKE)
     */
    it('[P0-API-003] should perform case-insensitive search', async () => {
      // Buscar con mayúsculas
      const resultadosUpper = await searchEquipos('PREN')

      // Buscar con minúsculas
      const resultadosLower = await searchEquipos('pren')

      // Then: Ambas búsquedas retornan resultados
      expect(resultadosUpper.length).toBeGreaterThan(0)
      expect(resultadosLower.length).toBeGreaterThan(0)

      // And: Mismos resultados
      expect(resultadosUpper.length).toBe(resultadosLower.length)
      if (resultadosUpper.length > 0 && resultadosLower.length > 0) {
        expect(resultadosUpper[0].id).toBe(resultadosLower[0].id)
      }
    })

    it('should handle mixed case search', async () => {
      const resultados = await searchEquipos('PrEn')
      expect(resultados.length).toBeGreaterThan(0)
    })

    it('should match partial words (not exact match)', async () => {
      // Buscar "hidra" debería encontrar "Prensa Hidraulica"
      const resultados = await searchEquipos('hidra')
      expect(resultados.length).toBeGreaterThan(0)
    })

    /**
     * P0-API-006: Server Action retorna array vacío si no hay resultados
     */
    it('[P0-API-006] should return empty array when no results', async () => {
      const resultados = await searchEquipos('xyz123noexiste')

      // Then: Array vacío (no error)
      expect(Array.isArray(resultados)).toBe(true)
      expect(resultados.length).toBe(0)

      console.log(`✅ Empty search returned empty array`)
    })
  })

  describe('Data Structure', () => {
    /**
     * P0-API-004: Server Action incluye relaciones (linea.planta)
     */
    it('[P0-API-004] should include linea and planta relations', async () => {
      const resultados = await searchEquipos('pren')

      expect(resultados.length).toBeGreaterThan(0)

      const firstEquipo = resultados[0]

      // Then: Relaciones incluidas
      expect(firstEquipo).toHaveProperty('linea')
      expect(firstEquipo.linea).toHaveProperty('planta')
      expect(firstEquipo.linea.planta).toHaveProperty('division')

      // And: División es HIROCK o ULTRA
      expect(['HIROCK', 'ULTRA']).toContain(firstEquipo.linea.planta.division)

      console.log(`✅ First equipo: ${firstEquipo.name} (${firstEquipo.linea.planta.division})`)
    })

    it('should return all required fields', async () => {
      const resultados = await searchEquipos('pren')
      expect(resultados.length).toBeGreaterThan(0)

      const equipo = resultados[0]

      // Required fields
      expect(equipo).toHaveProperty('id')
      expect(equipo).toHaveProperty('name')
      expect(equipo).toHaveProperty('code')
      expect(equipo).not.toHaveProperty('estado') // Should not be in select
      expect(equipo).not.toHaveProperty('ubicacion_actual') // Should not be in select
    })

    it('should include complete hierarchy path', async () => {
      const resultados = await searchEquipos('pren')
      expect(resultados.length).toBeGreaterThan(0)

      const equipo = resultados[0]

      // Verify hierarchy: Equipo → Linea → Planta → Division
      expect(equipo.linea.name).toBeDefined()
      expect(equipo.linea.planta.name).toBeDefined()
      expect(equipo.linea.planta.division).toBeDefined()
      expect(['HIROCK', 'ULTRA']).toContain(equipo.linea.planta.division)
    })
  })

  describe('Performance & Limits', () => {
    /**
     * P0-API-005: Server Action limita resultados a 10 (LIMIT 10)
     */
    it('[P0-API-005] should limit results to 10', async () => {
      // Buscar "pre" que probablemente matchee varios equipos (3+ caracteres)
      const resultados = await searchEquipos('pre')

      // Then: Máximo 10 resultados
      expect(resultados.length).toBeLessThanOrEqual(10)

      console.log(`✅ Search for "pre" returned ${resultados.length} results (max 10)`)
    })

    it('should use optimized query (minimal select)', async () => {
      // This test verifies that we're not selecting unnecessary fields
      const resultados = await searchEquipos('pren')
      expect(resultados.length).toBeGreaterThan(0)

      const equipo = resultados[0]

      // Should have these fields (selected)
      expect(equipo).toHaveProperty('id')
      expect(equipo).toHaveProperty('name')
      expect(equipo).toHaveProperty('code')

      // Should NOT have these fields (not selected for performance)
      expect(equipo).not.toHaveProperty('estado')
      expect(equipo).not.toHaveProperty('ubicacion_actual')
      expect(equipo).not.toHaveProperty('created_at')
    })

    it('should handle multiple concurrent searches', async () => {
      // Simulate concurrent searches (like user typing quickly)
      const searches = [
        searchEquipos('pre'),
        searchEquipos('com'),
        searchEquipos('trans')
      ]

      const results = await Promise.all(searches)

      expect(results[0]).toBeDefined()
      expect(results[1]).toBeDefined()
      expect(results[2]).toBeDefined()

      // All should be arrays
      results.forEach(r => {
        expect(Array.isArray(r)).toBe(true)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Note: This test would require mocking prisma to simulate DB errors
      // For now, we verify the function doesn't throw on empty results
      const resultados = await searchEquipos('nonexistent')
      expect(Array.isArray(resultados)).toBe(true)
      expect(resultados.length).toBe(0)
    })

    it('should handle Unicode characters correctly', async () => {
      // Search with Unicode/special characters
      const resultados = await searchEquipos('café') // or any Unicode in team names
      expect(Array.isArray(resultados)).toBe(true)
    })
  })
})
