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
 * Story 2.3: Updated to match Prisma schema
 */
export interface AssetFactoryOptions {
  id?: string;
  name?: string;
  code?: string;
  linea?: {
    id: string
    name: string
    planta?: {
      id: string
      name: string
      division: string
    }
  }
  estado?: string; // OPERATIVO | AVERIADO | EN_REPARACION | RETIRADO | BLOQUEADO
}

export const assetFactory = (options: AssetFactoryOptions = {}) => ({
  id: options.id || faker.string.uuid(),
  name: options.name || `${faker.vehicle.type()}-${faker.string.uuid()}`,
  code: options.code || `EQ-${faker.string.alphanumeric(5).toUpperCase()}`,
  linea: options.linea || {
    id: faker.string.uuid(),
    name: 'Línea 1',
    planta: {
      id: faker.string.uuid(),
      name: 'Planta Acero Perfilado',
      division: 'HIROCK',
    },
  },
  estado: options.estado || 'OPERATIVO',
});

/**
 * Orden de Trabajo (OT) Factory
 * Story 2.3: Updated to match Prisma schema
 */
export interface OTFactoryOptions {
  id?: string;
  tipo?: string; // 'CORRECTIVO' | 'PREVENTIVO'
  estado?: string; // 'PENDIENTE' | 'ASIGNADA' | ...
  prioridad?: string;
  descripcion?: string;
  numero?: string; // OT-YYYY-NNN format
}

export const otFactory = (options: OTFactoryOptions = {}) => ({
  id: options.id || faker.string.uuid(),
  tipo: options.tipo || 'CORRECTIVO', // Match Prisma enum WorkOrderTipo
  estado: options.estado || 'PENDIENTE', // Match Prisma enum WorkOrderEstado
  prioridad: options.prioridad || 'Media',
  descripcion: options.descripcion || faker.lorem.sentence(),
  numero: options.numero || `OT-${new Date().getFullYear()}-${faker.string.numeric(3)}`,
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
 * Story 2.3: Updated to match Prisma schema with camelCase fields
 */
export interface FailureReportFactoryOptions {
  id?: string;
  equipoId?: string; // camelCase to match Prisma
  descripcion?: string;
  reportadoPor?: string; // camelCase to match Prisma
  estado?: 'NUEVO' | 'RECIBIDO' | 'AUTORIZADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'CONVERTIDO' | 'DESCARTADO'; // Story 2.3: Updated enum
  fotoUrl?: string | null; // Story 2.3: Optional photo for failure reports
  numero?: string; // Story 2.3: Consistent format for test readability
}

export const failureReportFactory = (options: FailureReportFactoryOptions = {}) => ({
  id: options.id || faker.string.uuid(),
  equipoId: options.equipoId || faker.string.uuid(), // camelCase
  descripcion: options.descripcion || faker.lorem.sentences(2),
  reportadoPor: options.reportadoPor || faker.string.uuid(), // camelCase
  createdAt: new Date().toISOString(), // Match Prisma field name
  updatedAt: new Date().toISOString(), // Match Prisma field name
  estado: options.estado || 'NUEVO', // Updated default to NUEVO (Story 2.3)
  fotoUrl: options.fotoUrl || null,
  numero: options.numero || `AV-${new Date().getFullYear()}-${faker.string.numeric(3)}`,
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
