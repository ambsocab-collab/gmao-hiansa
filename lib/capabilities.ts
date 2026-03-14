/**
 * PBAC Capabilities Definition
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Defines the 15 capabilities (permissions) in the GMAO system.
 * Each capability has:
 * - name: Internal identifier (English, snake_case)
 * - label: Display name (Spanish, user-facing)
 * - description: What this capability allows
 *
 * Usage:
 * - Server actions validate user capabilities
 * - Middleware checks route access
 * - UI components show/hide features based on capabilities
 */

export const CAPABILITIES = [
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
] as const

/**
 * Type for capability names
 */
export type CapabilityName = typeof CAPABILITIES[number]['name']

/**
 * Default capability for new users (NFR-S66)
 * All users get this capability by default
 */
export const DEFAULT_CAPABILITY: CapabilityName = 'can_create_failure_report'

/**
 * Get capability label by name
 * @param name - Capability name
 * @returns Capability label or the name if not found
 */
export function getCapabilityLabel(name: string): string {
  const capability = CAPABILITIES.find((cap) => cap.name === name)
  return capability?.label || name
}

/**
 * Get capability description by name
 * @param name - Capability name
 * @returns Capability description or empty string if not found
 */
export function getCapabilityDescription(name: string): string {
  const capability = CAPABILITIES.find((cap) => cap.name === name)
  return capability?.description || ''
}
