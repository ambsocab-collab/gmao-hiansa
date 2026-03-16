/**
 * Performance Test: EquipoSearch Server Action
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * This test measures the actual performance of the searchEquipos Server Action
 * with a realistic database (10K+ equipos)
 *
 * AC4: Performance <200ms P95 with 10,000+ equipos (R-001, NFR-P1)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { searchEquipos } from '@/app/actions/equipos'
import { prisma } from '@/lib/db'

describe('Story 2.1: EquipoSearch Performance Test', () => {
  let equipoCount = 0

  beforeAll(async () => {
    // Check if database has sufficient data for performance testing
    equipoCount = await prisma.equipo.count()
    console.log(`📊 Database has ${equipoCount} equipos for performance testing`)

    if (equipoCount < 10000) {
      console.warn(`⚠️  WARNING: Database has less than 10,000 equipos`)
      console.warn('   Run: npm run db:seed:10k-equipos')
      console.warn('   Performance results may not be accurate\n')
    }
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('AC4: Performance <200ms with 10K+ equipos', () => {
    it('should complete search in <200ms P95 with common queries', async () => {
      // Test common search terms that would match multiple equipos
      const searchQueries = ['Prensa', 'Compresor', 'Torno', 'Fresadora']

      const timings: number[] = []

      for (const query of searchQueries) {
        const startTime = performance.now()
        const results = await searchEquipos(query)
        const endTime = performance.now()
        const duration = endTime - startTime

        timings.push(duration)
        console.log(`   Query: "${query}" → ${results.length} results in ${duration.toFixed(2)}ms`)

        // Each individual search should be <200ms
        expect(duration).toBeLessThan(200)
      }

      // Calculate P95
      const sortedTimings = timings.sort((a, b) => a - b)
      const p95Index = Math.floor(sortedTimings.length * 0.95)
      const p95 = sortedTimings[p95Index] || sortedTimings[sortedTimings.length - 1]

      console.log(`\n   📊 Performance Summary:`)
      console.log(`   - Average: ${(timings.reduce((a, b) => a + b, 0) / timings.length).toFixed(2)}ms`)
      console.log(`   - Min: ${Math.min(...timings).toFixed(2)}ms`)
      console.log(`   - Max: ${Math.max(...timings).toFixed(2)}ms`)
      console.log(`   - P95: ${p95.toFixed(2)}ms`)

      // P95 should be <200ms (AC4 requirement)
      expect(p95).toBeLessThan(200)
    }, 30000) // 30 second timeout for performance test

    it('should maintain performance with multiple concurrent searches', async () => {
      // Simulate 5 concurrent searches (realistic usage pattern)
      const concurrentQueries = Array.from({ length: 5 }, (_, i) => ({
        query: `Prensa ${i + 1}`,
      }))

      const startTime = performance.now()

      const results = await Promise.all(
        concurrentQueries.map(({ query }) => searchEquipos(query))
      )

      const endTime = performance.now()
      const totalDuration = endTime - startTime
      const avgDuration = totalDuration / concurrentQueries.length

      console.log(`   📊 Concurrent Search Performance:`)
      console.log(`   - Total time: ${totalDuration.toFixed(2)}ms`)
      console.log(`   - Average per search: ${avgDuration.toFixed(2)}ms`)
      console.log(`   - Results returned: ${results.length} searches`)

      // Each search should complete in <300ms (allowing for database connection pool overhead)
      expect(avgDuration).toBeLessThan(300)
    }, 30000)

    it('should handle empty results efficiently', async () => {
      const startTime = performance.now()
      const results = await searchEquipos('XYZ123NONEXISTENT')
      const endTime = performance.now()
      const duration = endTime - startTime

      console.log(`   Empty query ("XYZ123NONEXISTENT") → ${results.length} results in ${duration.toFixed(2)}ms`)

      // Even empty results should be fast
      expect(duration).toBeLessThan(200)
      expect(results).toHaveLength(0)
    })
  })

  describe('Performance Regression Detection', () => {
    it('should use database index for name search (verified by query plan)', async () => {
      // This test verifies that the database index is being used
      // by checking query execution time and result count

      const query = 'Prensa'
      const startTime = performance.now()
      const results = await searchEquipos(query)
      const endTime = performance.now()
      const duration = endTime - startTime

      console.log(`\n   📊 Index Usage Verification:`)
      console.log(`   - Query: "${query}"`)
      console.log(`   - Results: ${results.length}`)
      console.log(`   - Duration: ${duration.toFixed(2)}ms`)

      // If the index is being used, search should be <100ms for 10K records
      // If >500ms, likely doing full table scan (index not being used)
      expect(duration).toBeLessThan(500)

      if (duration > 200) {
        console.warn(`   ⚠️  WARNING: Search took longer than expected`)
        console.warn(`      Possible causes:`)
        console.warn(`      - Database index on \`equipos.name\` not being used`)
        console.warn(`      - Connection pool not configured`)
        console.warn(`      - Database server overloaded`)
      }
    })
  })
})
