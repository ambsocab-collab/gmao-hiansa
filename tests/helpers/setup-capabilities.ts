/**
 * Test Setup Helper: Capabilities
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Creates the 15 PBAC capabilities in the test database.
 * Use this in beforeAll() hooks for integration tests.
 */

import { prisma } from '@/lib/db'

/**
 * Spanish labels for all 15 capabilities
 * Must match prisma/seed.ts and lib/capabilities.ts
 */
const CAPABILITIES = [
  {
    name: 'can_create_failure_report',
    label: 'Reportar averías',
    description: 'Permite crear reportes de avería en el sistema'
  },
  {
    name: 'can_create_manual_ot',
    label: 'Crear OTs manuales',
    description: 'Permite crear órdenes de trabajo manualmente'
  },
  {
    name: 'can_update_own_ot',
    label: 'Actualizar OTs propias',
    description: 'Permite actualizar las OTs asignadas al usuario'
  },
  {
    name: 'can_view_own_ots',
    label: 'Ver OTs asignadas',
    description: 'Permite ver las OTs asignadas al usuario'
  },
  {
    name: 'can_view_all_ots',
    label: 'Ver todas las OTs',
    description: 'Permite ver todas las OTs del sistema'
  },
  {
    name: 'can_complete_ot',
    label: 'Completar OTs',
    description: 'Permite completar OTs y marcarlas como finalizadas'
  },
  {
    name: 'can_manage_stock',
    label: 'Gestionar stock',
    description: 'Permite gestionar stock de repuestos'
  },
  {
    name: 'can_assign_technicians',
    label: 'Asignar técnicos a OTs',
    description: 'Permite asignar técnicos a órdenes de trabajo'
  },
  {
    name: 'can_view_kpis',
    label: 'Ver KPIs avanzados',
    description: 'Permite ver dashboard con KPIs y métricas'
  },
  {
    name: 'can_manage_assets',
    label: 'Gestionar activos',
    description: 'Permite crear, editar y eliminar activos/equipos'
  },
  {
    name: 'can_view_repair_history',
    label: 'Ver historial reparaciones',
    description: 'Permite ver historial de reparaciones de equipos'
  },
  {
    name: 'can_manage_providers',
    label: 'Gestionar proveedores',
    description: 'Permite gestionar catálogo de proveedores'
  },
  {
    name: 'can_manage_routines',
    label: 'Gestionar rutinas',
    description: 'Permite gestionar rutinas de mantenimiento preventivo'
  },
  {
    name: 'can_manage_users',
    label: 'Gestionar usuarios',
    description: 'Permite crear, editar y eliminar usuarios del sistema'
  },
  {
    name: 'can_receive_reports',
    label: 'Recibir reportes automáticos',
    description: 'Permite recibir reportes automáticos por email'
  }
]

/**
 * Ensure all 15 capabilities exist in the database
 * Creates them if they don't exist (idempotent)
 *
 * Usage:
 * ```ts
 * import { setupCapabilities } from '@/tests/helpers/setup-capabilities'
 *
 * beforeAll(async () => {
 *   await setupCapabilities()
 * })
 * ```
 */
export async function setupCapabilities() {
  // Check if capabilities already exist
  const existingCount = await prisma.capability.count()

  if (existingCount === 15) {
    // Already seeded, skip
    return
  }

  // Create all capabilities (upsert to handle partial data)
  for (const capability of CAPABILITIES) {
    await prisma.capability.upsert({
      where: { name: capability.name },
      update: {}, // Don't update if exists
      create: {
        name: capability.name,
        label: capability.label,
        description: capability.description,
      },
    })
  }

  console.log(`[setupCapabilities] Created 15 capabilities in test database`)
}

/**
 * Clean up all capabilities (use in afterEach if needed)
 * WARNING: This will cascade delete all UserCapability records
 */
export async function cleanupCapabilities() {
  await prisma.capability.deleteMany({})
  console.log(`[cleanupCapabilities] Removed all capabilities from test database`)
}
