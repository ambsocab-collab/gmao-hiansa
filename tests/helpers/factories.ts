/**
 * Test Data Factories
 *
 * Factory functions for creating test data with faker.js
 * Follows data-factories.md best practices
 */

import { faker } from '@faker-js/faker/locale/es';

/**
 * Create a user object with unique test data
 * @param overrides - Partial user data to override defaults
 * @returns User object with email, name, password, phone
 */
export const createUser = (overrides: Partial<{
  email: string;
  name: string;
  password: string;
  phone: string;
}> = {}) => ({
  email: overrides.email || `test-${faker.string.uuid()}@example.com`,
  name: overrides.name || faker.person.fullName(),
  password: overrides.password || 'TempPassword123!',
  phone: overrides.phone || faker.phone.number('+34#########'),
});

/**
 * Create an admin user with elevated privileges
 * @param overrides - Partial user data to override defaults
 * @returns Admin user object
 */
export const createAdminUser = (overrides: Partial<{
  email: string;
  name: string;
  password: string;
}> = {}) => ({
  email: overrides.email || `admin-${faker.string.uuid()}@hiansa.com`,
  name: overrides.name || faker.person.fullName(),
  password: overrides.password || 'Admin123!',
});

/**
 * Create a user with specific capabilities
 * @param capabilities - Array of capability names to assign
 * @param overrides - Partial user data to override defaults
 * @returns User object with capabilities
 */
export const createUserWithCapabilities = (
  capabilities: string[],
  overrides: Partial<{
    email: string;
    name: string;
    password: string;
  }> = {}
) => ({
  ...createUser(overrides),
  capabilities,
});

/**
 * The 15 PBAC capabilities defined in Story 1.2
 */
export const ALL_CAPABILITIES = [
  'can_create_failure_report',
  'can_create_manual_ot',
  'can_update_own_ot',
  'can_view_own_ots',
  'can_view_all_ots',
  'can_complete_ot',
  'can_manage_stock',
  'can_assign_technicians',
  'can_view_kpis',
  'can_manage_assets',
  'can_view_repair_history',
  'can_manage_providers',
  'can_manage_routines',
  'can_manage_users',
  'can_receive_reports',
] as const;

/**
 * Default capability assigned to new users
 */
export const DEFAULT_CAPABILITY = 'can_create_failure_report';

/**
 * Capabilities excluding the default one (14 capabilities)
 */
export const NON_DEFAULT_CAPABILITIES = ALL_CAPABILITIES.filter(
  (cap) => cap !== DEFAULT_CAPABILITY
);

/**
 * Spanish labels for all 15 capabilities
 * Matches the labels defined in Story 1.2
 */
export const CAPABILITY_LABELS: Record<string, string> = {
  can_create_failure_report: 'Reportar averías',
  can_create_manual_ot: 'Crear OTs manuales',
  can_update_own_ot: 'Actualizar OTs propias',
  can_view_own_ots: 'Ver OTs asignadas',
  can_view_all_ots: 'Ver todas las OTs',
  can_complete_ot: 'Completar OTs',
  can_manage_stock: 'Gestionar stock',
  can_assign_technicians: 'Asignar técnicos a OTs',
  can_view_kpis: 'Ver KPIs avanzados',
  can_manage_assets: 'Gestionar activos',
  can_view_repair_history: 'Ver historial reparaciones',
  can_manage_providers: 'Gestionar proveedores',
  can_manage_routines: 'Gestionar rutinas',
  can_manage_users: 'Gestionar usuarios',
  can_receive_reports: 'Recibir reportes automáticos',
};

/**
 * Get the Spanish label for a capability
 * @param capability - Capability name
 * @returns Spanish label
 */
export const getCapabilityLabel = (capability: string): string => {
  return CAPABILITY_LABELS[capability] || capability;
};
