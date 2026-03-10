import { faker } from '@faker-js/faker/locale/es';

/**
 * Test Data Factories for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Factories generate realistic test data using Faker.js
 * All IDs are unique per test run to avoid conflicts
 */

/**
 * User Factory
 * Story 1.1: Extended factory for authentication and user management
 */
export interface UserFactoryOptions {
  email?: string;
  name?: string;
  capabilities?: string[];
  forcePasswordReset?: boolean;
  deleted?: boolean;
  roleLabel?: string;
  phone?: string;
}

export const userFactory = (options: UserFactoryOptions = {}) => ({
  email: options.email || faker.internet.email(),
  name: options.name || faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'password123', // Consistent test password
  capabilities: options.capabilities || ['can_create_failure_report'],
  forcePasswordReset: options.forcePasswordReset ?? false,
  deleted: options.deleted ?? false,
  roleLabel: options.roleLabel || null,
  phone: options.phone || faker.phone.number(),
});

/**
 * All 15 PBAC Capabilities
 * Story 1.1: Complete capability list
 */
export const ALL_CAPABILITIES = [
  'can_create_failure_report',
  'can_view_work_orders',
  'can_create_work_orders',
  'can_complete_work_orders',
  'can_assign_technicians',
  'can_manage_assets',
  'can_manage_stock',
  'can_manage_users',
  'can_view_kpis',
  'can_view_reports',
  'can_export_data',
  'can_manage_providers',
  'can_manage_routines',
  'can_manage_labels',
  'can_delete_any_data'
] as const;

/**
 * Admin User Factory
 * Story 1.1: User with all 15 capabilities for admin tests
 */
export const adminUserFactory = (options: UserFactoryOptions = {}) => userFactory({
  ...options,
  capabilities: [...ALL_CAPABILITIES],
  forcePasswordReset: false,
  deleted: false,
});

/**
 * New User Factory
 * Story 1.1: User with forcePasswordReset=true and default capability
 */
export const newUserFactory = (options: UserFactoryOptions = {}) => userFactory({
  ...options,
  forcePasswordReset: true,
  capabilities: options.capabilities || ['can_create_failure_report'],
});

/**
 * Deleted User Factory
 * Story 1.1: User marked as deleted (soft delete)
 */
export const deletedUserFactory = (options: UserFactoryOptions = {}) => userFactory({
  ...options,
  deleted: true,
});

/**
 * Activity Log Factory
 * Story 1.1: Activity tracking for user actions
 */
export interface ActivityLogFactoryOptions {
  userId?: string;
  action?: string;
  metadata?: any;
  timestamp?: Date;
}

export const activityLogFactory = (options: ActivityLogFactoryOptions = {}) => ({
  userId: options.userId || faker.string.uuid(),
  action: options.action || faker.helpers.arrayElement([
    'login',
    'profile_update',
    'password_change',
    'capability_changed',
    'user_created',
    'user_deleted'
  ]),
  metadata: options.metadata || {},
  timestamp: options.timestamp || faker.date.recent({ days: 180 })
});

/**
 * Generate Activity History
 * Story 1.1: Helper to generate sequence of activity logs for last 6 months
 */
export const generateActivityHistory = (userId: string, count: number = 20) => {
  return Array.from({ length: count }, () =>
    activityLogFactory({
      userId,
      timestamp: faker.date.recent({ days: 180 }) // Last 6 months
    })
  );
};

/**
 * Audit Log Factory
 * Story 1.1: Audit trail for critical actions (user management)
 */
export interface AuditLogFactoryOptions {
  userId?: string;
  action?: string;
  targetId?: string;
  metadata?: any;
  timestamp?: Date;
}

export const auditLogFactory = (options: AuditLogFactoryOptions = {}) => ({
  userId: options.userId || faker.string.uuid(),
  action: options.action || faker.helpers.arrayElement([
    'user_created',
    'user_deleted',
    'capability_changed'
  ]),
  targetId: options.targetId || faker.string.uuid(),
  metadata: options.metadata || {},
  timestamp: options.timestamp || faker.date.recent({ days: 180 })
});

/**
 * Asset (Equipo) Factory - 5-Level Hierarchy
 */
export interface AssetFactoryOptions {
  nombre?: string;
  planta?: string;
  linea?: string;
  tipo?: string;
  estado?: string;
}

export const assetFactory = (options: AssetFactoryOptions = {}) => ({
  nombre: options.nombre || `${faker.vehicle.type()}-${faker.string.uuid()}`,
  planta: options.planta || 'Planta Acero Perfilado',
  linea: options.linea || 'Línea 1',
  tipo: options.tipo || 'Perfiladora',
  estado: options.estado || 'Operativo',
});

/**
 * Orden de Trabajo (OT) Factory
 */
export interface OTFactoryOptions {
  tipo_mantenimiento?: string;
  estado?: string;
  prioridad?: string;
  descripcion?: string;
}

export const otFactory = (options: OTFactoryOptions = {}) => ({
  tipo_mantenimiento: options.tipo_mantenimiento || 'Correctivo',
  estado: options.estado || 'Pendiente',
  prioridad: options.prioridad || 'Media',
  descripcion: options.descripcion || faker.lorem.sentence(),
  fecha_creacion: new Date().toISOString(),
});

/**
 * Repuesto Factory
 */
export interface RepuestoFactoryOptions {
  codigo?: string;
  nombre?: string;
  stock?: number;
  stock_minimo?: number;
  ubicacion?: string;
}

export const repuestoFactory = (options: RepuestoFactoryOptions = {}) => ({
  codigo: options.codigo || `REP-${faker.string.alphanumeric(6).toUpperCase()}`,
  nombre: options.nombre || `Repuesto ${faker.vehicle.parts()}`,
  stock: options.stock ?? faker.number.int({ min: 0, max: 50 }),
  stock_minimo: options.stock_minimo ?? 5,
  ubicacion: options.ubicacion || 'Estante A-15',
});

/**
 * Provider Factory
 */
export interface ProviderFactoryOptions {
  nombre?: string;
  tipo_servicio?: string[];
  email?: string;
  telefono?: string;
}

export const providerFactory = (options: ProviderFactoryOptions = {}) => ({
  nombre: options.nombre || faker.company.name(),
  tipo_servicio: options.tipo_servicio || ['Reparación'],
  email: options.email || faker.internet.email(),
  telefono: options.telefono || faker.phone.number(),
});

/**
 * Failure Report (Avería) Factory
 */
export interface FailureReportFactoryOptions {
  equipo_id?: string;
  descripcion?: string;
  urgencia?: string;
  reportado_por?: string;
}

export const failureReportFactory = (options: FailureReportFactoryOptions = {}) => ({
  equipo_id: options.equipo_id || faker.string.uuid(),
  descripcion: options.descripcion || faker.lorem.sentences(2),
  urgencia: options.urgencia || 'Media',
  reportado_por: options.reportado_por || faker.string.uuid(),
  fecha_reporte: new Date().toISOString(),
  estado: 'Recibido',
});

/**
 * Helper: Generate unique ID for test data
 */
export const generateTestId = (prefix: string): string => {
  return `${prefix}-${faker.string.uuid()}`;
};

/**
 * Helper: Generate sequence of unique items
 */
export const generateSequence = <T>(
  factory: () => T,
  count: number,
): T[] => {
  return Array.from({ length: count }, () => factory());
};

/**
 * Helper: Override factory defaults
 */
export const withOverrides = <T extends Record<string, any>>(
  factory: () => T,
  overrides: Partial<T>,
): T => {
  return { ...factory(), ...overrides };
};
