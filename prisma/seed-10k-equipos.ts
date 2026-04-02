/**
 * Seed Script: 10,000 Equipos for Performance Testing
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * This script creates 10,000 equipos across multiple plantas and líneas
 * to validate that search performance meets <200ms P95 requirement (R-001)
 *
 * Usage:
 *   npm run seed:10k-equipos
 *
 * Expected Performance:
 *   - Search with 10K equipos should complete in <200ms P95
 *   - Database index on `equipos.name` is required
 *   - LIMIT 10 in query prevents large result sets
 *
 * @see Story 2.1 AC4: Performance con 10K+ Activos en Database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Hierarchical structure for generating equipos
 * Matches the 5-level hierarchy: Planta → Linea → Equipo → Componente → Repuesto
 */
const _divisiones = ['HIROCK', 'ULTRA'] as const

const plantas = [
  { division: 'HIROCK' as const, name: 'Planta HiRock 1', code: 'PHR-1' },
  { division: 'HIROCK' as const, name: 'Planta HiRock 2', code: 'PHR-2' },
  { division: 'HIROCK' as const, name: 'Planta HiRock 3', code: 'PHR-3' },
  { division: 'ULTRA' as const, name: 'Planta Ultra 1', code: 'PUL-1' },
  { division: 'ULTRA' as const, name: 'Planta Ultra 2', code: 'PUL-2' },
  { division: 'ULTRA' as const, name: 'Planta Ultra 3', code: 'PUL-3' },
]

// Generate 30 líneas (5 per planta)
const lineas = plantas.flatMap((planta) =>
  Array.from({ length: 5 }, (_, i) => ({
    plantaCode: planta.code,
    name: `Línea ${i + 1}`,
    code: `${planta.code}-L${i + 1}`,
  }))
)

// Generate 333 unique equipo names per línea type
const equipoTypes = [
  'Prensa',
  'Compresor',
  'Torno',
  'Fresadora',
  'Taladro',
  'Molino',
  'Mezclador',
  'Separador',
  'Secador',
  'Envasadora',
  'Transportador',
  'Elevador',
  'Bomba',
  'Valvula',
  'Filtro',
  'Caldera',
  'Intercambiador',
  'Reactivo',
  'Condensador',
  'Evaporador',
]

/**
 * Generate unique equipos with hierarchical structure
 */
async function generate10KEquipos() {
  console.log('🌱 Starting seed: 10,000 equipos for performance testing\n')

  // Step 1: Clear existing equipos (optional, for testing)
  const existingCount = await prisma.equipo.count()
  console.log(`📊 Existing equipos: ${existingCount}`)

  if (existingCount > 0) {
    console.log('⚠️  WARNING: Database already has equipos')
    console.log('   Skipping seed to avoid duplicates')
    console.log('   Run this script with a clean database for accurate results\n')
    return
  }

  // Step 2: Create plantas if they don't exist
  console.log('📝 Creating plantas...')
  for (const planta of plantas) {
    await prisma.planta.upsert({
      where: { code: planta.code },
      update: {},
      create: {
        name: planta.name,
        code: planta.code,
        division: planta.division,
      },
    })
  }
  console.log(`✅ Created ${plantas.length} plantas`)

  // Step 3: Create líneas if they don't exist
  console.log('📝 Creating líneas...')
  for (const linea of lineas) {
    const planta = await prisma.planta.findFirst({
      where: { code: linea.plantaCode },
    })

    if (!planta) {
      console.error(`❌ Planta not found: ${linea.plantaCode}`)
      continue
    }

    // Check if linea already exists (using unique constraint: planta_id + code)
    const existingLinea = await prisma.linea.findFirst({
      where: {
        planta_id: planta.id,
        code: linea.code,
      },
    })

    if (!existingLinea) {
      await prisma.linea.create({
        data: {
          name: linea.name,
          code: linea.code,
          planta: {
            connect: { id: planta.id },
          },
        },
      })
    }
  }
  console.log(`✅ Verified/Created ${lineas.length} líneas`)

  // Step 4: Generate 10,000 equipos
  console.log('📝 Generating 10,000 equipos...')
  const _batchSize = 100
  const totalEquipos = 10000
  const equiposPerLinea = Math.floor(totalEquipos / lineas.length)

  let createdCount = 0

  for (const linea of lineas) {
    // Find the linea using both planta_id and code (unique constraint)
    const planta = await prisma.planta.findFirst({
      where: { code: linea.plantaCode },
    })

    if (!planta) {
      console.error(`❌ Planta not found: ${linea.plantaCode}`)
      continue
    }

    const lineaRecord = await prisma.linea.findFirst({
      where: {
        planta_id: planta.id,
        code: linea.code,
      },
    })

    if (!lineaRecord) {
      console.error(`❌ Línea not found: ${linea.code}`)
      continue
    }

    // Create equipos for this línea
    for (let i = 0; i < equiposPerLinea; i++) {
      const tipoIndex = i % equipoTypes.length
      const tipo = equipoTypes[tipoIndex]
      const sequentialNumber = Math.floor(i / equipoTypes.length) + 1

      const equipoName = `${tipo} ${linea.code}-${String(sequentialNumber).padStart(3, '0')}`
      const equipoCode = `${linea.code}-${String(i + 1).padStart(4, '0')}`

      await prisma.equipo.create({
        data: {
          name: equipoName,
          code: equipoCode,
          linea: {
            connect: { id: lineaRecord.id },
          },
          estado: 'OPERATIVO',
        },
      })

      createdCount++

      // Log progress every 500 equipos
      if (createdCount % 500 === 0) {
        console.log(`   Progress: ${createdCount}/${totalEquipos} equipos created...`)
      }
    }
  }

  console.log(`\n✅ Seed complete: ${createdCount} equipos created`)
  console.log(`📊 Final count: ${await prisma.equipo.count()} equipos`)
}

/**
 * Main function
 */
async function main() {
  try {
    await generate10KEquipos()

    console.log('\n🎯 Performance Test Instructions:')
    console.log('   1. Run the search function and measure performance')
    console.log('   2. Expected: <200ms P95 with 10K equipos')
    console.log('   3. Use: npm run test:perf:asset-search')
    console.log('   4. Verify database index is being used (check PostgreSQL logs)\n')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Execute seed if run directly
if (require.main === module) {
  main()
}

export { generate10KEquipos }
