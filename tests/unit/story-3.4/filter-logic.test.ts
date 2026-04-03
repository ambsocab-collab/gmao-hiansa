/**
 * Unit Tests for Story 3.4 - Filter Logic
 *
 * Pure business logic tests for filter combinations and query building
 * No database dependencies - fast execution
 */

import { describe, it, expect } from 'vitest';

// Types
type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

interface FilterGroup {
  logic: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
}

interface WorkOrderFilter {
  estado?: string | string[];
  tipo?: string | string[];
  prioridad?: string | string[];
  equipo_id?: string;
  linea_id?: string;
  planta_id?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  search?: string;
}

// Business logic functions to test
function buildFilterConditions(filter: WorkOrderFilter): FilterCondition[] {
  const conditions: FilterCondition[] = [];

  if (filter.estado) {
    conditions.push({
      field: 'estado',
      operator: Array.isArray(filter.estado) ? 'in' : 'eq',
      value: filter.estado
    });
  }

  if (filter.tipo) {
    conditions.push({
      field: 'tipo',
      operator: Array.isArray(filter.tipo) ? 'in' : 'eq',
      value: filter.tipo
    });
  }

  if (filter.prioridad) {
    conditions.push({
      field: 'prioridad',
      operator: Array.isArray(filter.prioridad) ? 'in' : 'eq',
      value: filter.prioridad
    });
  }

  if (filter.equipo_id) {
    conditions.push({ field: 'equipo_id', operator: 'eq', value: filter.equipo_id });
  }

  if (filter.fechaDesde) {
    conditions.push({ field: 'createdAt', operator: 'gte', value: filter.fechaDesde });
  }

  if (filter.fechaHasta) {
    conditions.push({ field: 'createdAt', operator: 'lte', value: filter.fechaHasta });
  }

  if (filter.search) {
    conditions.push({ field: 'descripcion', operator: 'contains', value: filter.search });
  }

  return conditions;
}

function combineFilters(conditions: FilterCondition[], logic: 'AND' | 'OR' = 'AND'): FilterGroup {
  return { logic, conditions };
}

function matchesFilter(item: Record<string, any>, condition: FilterCondition): boolean {
  const { field, operator, value } = condition;
  const fieldValue = item[field];

  switch (operator) {
    case 'eq':
      return fieldValue === value;
    case 'ne':
      return fieldValue !== value;
    case 'gt':
      return fieldValue > value;
    case 'gte':
      return fieldValue >= value;
    case 'lt':
      return fieldValue < value;
    case 'lte':
      return fieldValue <= value;
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    default:
      return false;
  }
}

function matchesFilterGroup(item: Record<string, any>, group: FilterGroup): boolean {
  const results = group.conditions.map(cond => {
    if ('logic' in cond) {
      return matchesFilterGroup(item, cond);
    }
    return matchesFilter(item, cond);
  });

  if (group.logic === 'AND') {
    return results.every(Boolean);
  }
  return results.some(Boolean);
}

function isValidFilterValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function sanitizeFilter(filter: WorkOrderFilter): WorkOrderFilter {
  const sanitized: WorkOrderFilter = {};

  for (const [key, value] of Object.entries(filter)) {
    if (isValidFilterValue(value)) {
      (sanitized as any)[key] = value;
    }
  }

  return sanitized;
}

function getActiveFilterCount(filter: WorkOrderFilter): number {
  return Object.values(filter).filter(isValidFilterValue).length;
}

function filterToQueryString(filter: WorkOrderFilter): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filter)) {
    if (isValidFilterValue(value)) {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else if (value instanceof Date) {
        params.append(key, value.toISOString());
      } else {
        params.append(key, String(value));
      }
    }
  }

  return params.toString();
}

describe('Story 3.4 - Unit: Filter Logic', () => {
  // Test fixtures
  const createWorkOrder = (overrides: Record<string, any> = {}): Record<string, any> => ({
    id: 'wo-001',
    numero: 'OT-001',
    estado: 'PENDIENTE',
    tipo: 'CORRECTIVO',
    prioridad: 'MEDIA',
    descripcion: 'OT de prueba',
    equipo_id: 'eq-001',
    createdAt: new Date('2024-01-15'),
    ...overrides
  });

  describe('Filter Condition Building', () => {
    /**
     * U4-FILTER-001: Build single estado filter
     */
    it('[U4-FILTER-001] should build single estado filter', () => {
      const filter: WorkOrderFilter = { estado: 'PENDIENTE' };
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(1);
      expect(conditions[0]).toEqual({
        field: 'estado',
        operator: 'eq',
        value: 'PENDIENTE'
      });
    });

    /**
     * U4-FILTER-002: Build multiple estados filter (IN)
     */
    it('[U4-FILTER-002] should build IN filter for multiple estados', () => {
      const filter: WorkOrderFilter = { estado: ['PENDIENTE', 'ASIGNADA'] };
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(1);
      expect(conditions[0].operator).toBe('in');
      expect(conditions[0].value).toEqual(['PENDIENTE', 'ASIGNADA']);
    });

    /**
     * U4-FILTER-003: Build date range filter
     */
    it('[U4-FILTER-003] should build date range filter', () => {
      const filter: WorkOrderFilter = {
        fechaDesde: new Date('2024-01-01'),
        fechaHasta: new Date('2024-01-31')
      };
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(2);
      expect(conditions.find(c => c.operator === 'gte')).toBeDefined();
      expect(conditions.find(c => c.operator === 'lte')).toBeDefined();
    });

    /**
     * U4-FILTER-004: Build search filter with contains
     */
    it('[U4-FILTER-004] should build search filter with contains', () => {
      const filter: WorkOrderFilter = { search: 'motor' };
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(1);
      expect(conditions[0].operator).toBe('contains');
      expect(conditions[0].field).toBe('descripcion');
    });

    /**
     * U4-FILTER-005: Build combined filters
     */
    it('[U4-FILTER-005] should build combined filters', () => {
      const filter: WorkOrderFilter = {
        estado: 'PENDIENTE',
        tipo: 'CORRECTIVO',
        prioridad: 'ALTA'
      };
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(3);
    });

    /**
     * U4-FILTER-006: Empty filter returns empty conditions
     */
    it('[U4-FILTER-006] should return empty conditions for empty filter', () => {
      const filter: WorkOrderFilter = {};
      const conditions = buildFilterConditions(filter);

      expect(conditions).toHaveLength(0);
    });
  });

  describe('Filter Matching', () => {
    /**
     * U4-MATCH-001: Match equals condition
     */
    it('[U4-MATCH-001] should match equals condition', () => {
      const item = createWorkOrder({ estado: 'PENDIENTE' });
      const condition: FilterCondition = { field: 'estado', operator: 'eq', value: 'PENDIENTE' };

      expect(matchesFilter(item, condition)).toBe(true);
    });

    /**
     * U4-MATCH-002: Not match equals condition
     */
    it('[U4-MATCH-002] should NOT match different value', () => {
      const item = createWorkOrder({ estado: 'COMPLETADA' });
      const condition: FilterCondition = { field: 'estado', operator: 'eq', value: 'PENDIENTE' };

      expect(matchesFilter(item, condition)).toBe(false);
    });

    /**
     * U4-MATCH-003: Match IN condition
     */
    it('[U4-MATCH-003] should match IN condition', () => {
      const item = createWorkOrder({ estado: 'ASIGNADA' });
      const condition: FilterCondition = {
        field: 'estado',
        operator: 'in',
        value: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO']
      };

      expect(matchesFilter(item, condition)).toBe(true);
    });

    /**
     * U4-MATCH-004: Match contains condition (case insensitive)
     */
    it('[U4-MATCH-004] should match contains condition case insensitive', () => {
      const item = createWorkOrder({ descripcion: 'Falla en MOTOR eléctrico' });
      const condition: FilterCondition = { field: 'descripcion', operator: 'contains', value: 'motor' };

      expect(matchesFilter(item, condition)).toBe(true);
    });

    /**
     * U4-MATCH-005: Match date comparison
     */
    it('[U4-MATCH-005] should match date comparison', () => {
      const item = createWorkOrder({ createdAt: new Date('2024-01-15') });
      const condition: FilterCondition = {
        field: 'createdAt',
        operator: 'gte',
        value: new Date('2024-01-01')
      };

      expect(matchesFilter(item, condition)).toBe(true);
    });
  });

  describe('Filter Groups (AND/OR)', () => {
    /**
     * U4-GROUP-001: AND logic - all must match
     */
    it('[U4-GROUP-001] should require ALL conditions for AND logic', () => {
      const item = createWorkOrder({ estado: 'PENDIENTE', tipo: 'CORRECTIVO' });
      const group: FilterGroup = {
        logic: 'AND',
        conditions: [
          { field: 'estado', operator: 'eq', value: 'PENDIENTE' },
          { field: 'tipo', operator: 'eq', value: 'CORRECTIVO' }
        ]
      };

      expect(matchesFilterGroup(item, group)).toBe(true);
    });

    /**
     * U4-GROUP-002: AND logic - one fails
     */
    it('[U4-GROUP-002] should fail AND if one condition fails', () => {
      const item = createWorkOrder({ estado: 'COMPLETADA', tipo: 'CORRECTIVO' });
      const group: FilterGroup = {
        logic: 'AND',
        conditions: [
          { field: 'estado', operator: 'eq', value: 'PENDIENTE' },
          { field: 'tipo', operator: 'eq', value: 'CORRECTIVO' }
        ]
      };

      expect(matchesFilterGroup(item, group)).toBe(false);
    });

    /**
     * U4-GROUP-003: OR logic - one must match
     */
    it('[U4-GROUP-003] should require ANY condition for OR logic', () => {
      const item = createWorkOrder({ estado: 'COMPLETADA', tipo: 'CORRECTIVO' });
      const group: FilterGroup = {
        logic: 'OR',
        conditions: [
          { field: 'estado', operator: 'eq', value: 'PENDIENTE' },
          { field: 'tipo', operator: 'eq', value: 'CORRECTIVO' }
        ]
      };

      expect(matchesFilterGroup(item, group)).toBe(true);
    });

    /**
     * U4-GROUP-004: OR logic - all fail
     */
    it('[U4-GROUP-004] should fail OR if all conditions fail', () => {
      const item = createWorkOrder({ estado: 'COMPLETADA', tipo: 'PREVENTIVO' });
      const group: FilterGroup = {
        logic: 'OR',
        conditions: [
          { field: 'estado', operator: 'eq', value: 'PENDIENTE' },
          { field: 'tipo', operator: 'eq', value: 'CORRECTIVO' }
        ]
      };

      expect(matchesFilterGroup(item, group)).toBe(false);
    });

    /**
     * U4-GROUP-005: Nested filter groups
     */
    it('[U4-GROUP-005] should handle nested filter groups', () => {
      const item = createWorkOrder({ estado: 'PENDIENTE', prioridad: 'ALTA', tipo: 'CORRECTIVO' });
      const group: FilterGroup = {
        logic: 'AND',
        conditions: [
          { field: 'estado', operator: 'eq', value: 'PENDIENTE' },
          {
            logic: 'OR',
            conditions: [
              { field: 'prioridad', operator: 'eq', value: 'CRITICA' },
              { field: 'prioridad', operator: 'eq', value: 'ALTA' }
            ]
          } as FilterGroup
        ]
      };

      expect(matchesFilterGroup(item, group)).toBe(true);
    });
  });

  describe('Filter Validation & Sanitization', () => {
    /**
     * U4-VALID-001: Validate valid filter values
     */
    it('[U4-VALID-001] should validate valid filter values', () => {
      expect(isValidFilterValue('PENDIENTE')).toBe(true);
      expect(isValidFilterValue(['A', 'B'])).toBe(true);
      expect(isValidFilterValue(new Date())).toBe(true);
    });

    /**
     * U4-VALID-002: Invalidate null/undefined/empty
     */
    it('[U4-VALID-002] should invalidate null/undefined/empty values', () => {
      expect(isValidFilterValue(null)).toBe(false);
      expect(isValidFilterValue(undefined)).toBe(false);
      expect(isValidFilterValue('')).toBe(false);
      expect(isValidFilterValue([])).toBe(false);
    });

    /**
     * U4-VALID-003: Sanitize filter removes invalid values
     */
    it('[U4-VALID-003] should sanitize filter removing invalid values', () => {
      const filter: WorkOrderFilter = {
        estado: 'PENDIENTE',
        tipo: '',
        prioridad: undefined,
        search: '  ' // whitespace only
      };
      const sanitized = sanitizeFilter(filter);

      expect(sanitized.estado).toBe('PENDIENTE');
      expect(sanitized.tipo).toBeUndefined();
      expect(sanitized.prioridad).toBeUndefined();
      expect(sanitized.search).toBeUndefined();
    });

    /**
     * U4-VALID-004: Count active filters
     */
    it('[U4-VALID-004] should count active filters correctly', () => {
      const filter: WorkOrderFilter = {
        estado: 'PENDIENTE',
        tipo: 'CORRECTIVO',
        prioridad: undefined,
        search: ''
      };

      expect(getActiveFilterCount(filter)).toBe(2);
    });
  });

  describe('Query String Serialization', () => {
    /**
     * U4-QUERY-001: Convert filter to query string
     */
    it('[U4-QUERY-001] should convert filter to query string', () => {
      const filter: WorkOrderFilter = {
        estado: 'PENDIENTE',
        tipo: 'CORRECTIVO'
      };
      const queryString = filterToQueryString(filter);

      expect(queryString).toContain('estado=PENDIENTE');
      expect(queryString).toContain('tipo=CORRECTIVO');
    });

    /**
     * U4-QUERY-002: Handle array values in query string
     */
    it('[U4-QUERY-002] should handle array values as comma-separated', () => {
      const filter: WorkOrderFilter = {
        estado: ['PENDIENTE', 'ASIGNADA']
      };
      const queryString = filterToQueryString(filter);

      expect(queryString).toContain('estado=PENDIENTE%2CASIGNADA');
    });

    /**
     * U4-QUERY-003: Handle date values in query string
     */
    it('[U4-QUERY-003] should handle date values as ISO string', () => {
      const filter: WorkOrderFilter = {
        fechaDesde: new Date('2024-01-15T00:00:00.000Z')
      };
      const queryString = filterToQueryString(filter);

      expect(queryString).toContain('fechaDesde=');
      expect(queryString).toContain('2024-01-15');
    });

    /**
     * U4-QUERY-004: Empty filter returns empty string
     */
    it('[U4-QUERY-004] should return empty string for empty filter', () => {
      const filter: WorkOrderFilter = {};
      const queryString = filterToQueryString(filter);

      expect(queryString).toBe('');
    });
  });
});
