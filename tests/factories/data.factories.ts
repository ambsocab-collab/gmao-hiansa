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
 */
export interface UserFactoryOptions {
  email?: string;
  nombre?: string;
  capabilities?: string[];
}

export const userFactory = (options: UserFactoryOptions = {}) => ({
  email: options.email || faker.internet.email(),
  nombre: options.nombre || faker.person.firstName(),
  apellido: faker.person.lastName(),
  password: 'password123', // Consistent test password
  capabilities: options.capabilities || ['can_create_failure_report'],
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
