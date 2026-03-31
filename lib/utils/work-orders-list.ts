/**
 * Work Orders List Utilities
 *
 * Pure functions for work orders list filtering, sorting, and validation.
 * Used by Server Actions and unit tested independently.
 *
 * Story 3.4 - Vista de Listado con Filtros y Sync Real-time
 */

import { WorkOrderEstado, WorkOrderTipo } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export interface FilterParams {
  estado?: WorkOrderEstado[] | WorkOrderEstado;
  tipo?: WorkOrderTipo;
  tecnicoId?: string;
  equipoId?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface ListParams {
  page: number;
  pageSize: number;
  filters: FilterParams;
  sort: SortParams;
}

export interface PrismaWhereClause {
  [key: string]: unknown;
}

// ============================================================================
// Constants
// ============================================================================

export const MAX_BATCH_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 100;
export const ALLOWED_SORT_COLUMNS = [
  'numero',
  'equipo',
  'estado',
  'tipo',
  'asignados',
  'fecha',
  'created_at',
] as const;

export const SORT_COLUMN_MAPPING: Record<string, string> = {
  numero: 'numero',
  equipo: 'equipo_id',
  estado: 'estado',
  tipo: 'tipo',
  asignados: 'assignments',
  fecha: 'created_at',
  created_at: 'created_at',
};

// ============================================================================
// buildFilterQuery
// ============================================================================

/**
 * Converts filter parameters to Prisma where clause
 *
 * @param filters - Filter parameters from URL or user input
 * @returns Prisma-compatible where clause object
 *
 * @example
 * ```ts
 * buildFilterQuery({ estado: ['PENDIENTE', 'ASIGNADA'] })
 * // Returns: { estado: { in: ['PENDIENTE', 'ASIGNADA'] } }
 *
 * buildFilterQuery({ estado: 'PENDIENTE', tipo: 'CORRECTIVO' })
 * // Returns: { AND: [{ estado: 'PENDIENTE' }, { tipo: 'CORRECTIVO' }] }
 * ```
 */
export function buildFilterQuery(filters: FilterParams): PrismaWhereClause {
  const conditions: PrismaWhereClause[] = [];

  // Estado filter (single or array)
  if (filters.estado) {
    if (Array.isArray(filters.estado)) {
      if (filters.estado.length > 0) {
        conditions.push({ estado: { in: filters.estado } });
      }
    } else {
      conditions.push({ estado: filters.estado });
    }
  }

  // Tipo filter
  if (filters.tipo) {
    conditions.push({ tipo: filters.tipo });
  }

  // Técnico filter (via assignments relation)
  if (filters.tecnicoId) {
    conditions.push({
      assignments: {
        some: { userId: filters.tecnicoId },
      },
    });
  }

  // Equipo filter
  if (filters.equipoId) {
    conditions.push({ equipo_id: filters.equipoId });
  }

  // Date range filter
  if (filters.fechaInicio || filters.fechaFin) {
    const dateCondition: { gte?: Date; lte?: Date } = {};

    if (filters.fechaInicio) {
      dateCondition.gte = filters.fechaInicio;
    }

    if (filters.fechaFin) {
      dateCondition.lte = filters.fechaFin;
    }

    conditions.push({ created_at: dateCondition });
  }

  // Combine with AND logic if multiple conditions
  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { AND: conditions };
}

// ============================================================================
// buildSortQuery
// ============================================================================

/**
 * Converts sort parameters to Prisma orderBy clause
 *
 * @param params - Sort parameters (sortBy, sortOrder)
 * @returns Prisma-compatible orderBy array
 *
 * @example
 * ```ts
 * buildSortQuery({ sortBy: 'fecha', sortOrder: 'desc' })
 * // Returns: [{ created_at: 'desc' }]
 *
 * buildSortQuery({})
 * // Returns: [{ created_at: 'desc' }] // Default sort
 * ```
 */
export function buildSortQuery(params: SortParams): Record<string, SortOrder>[] {
  const { sortBy, sortOrder } = params;

  // Validate sort order
  const validSortOrder: SortOrder = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

  // Validate sort column
  if (!sortBy || !ALLOWED_SORT_COLUMNS.includes(sortBy as (typeof ALLOWED_SORT_COLUMNS)[number])) {
    return [{ created_at: 'desc' }];
  }

  // Map column name to database field
  const dbColumn = SORT_COLUMN_MAPPING[sortBy] || sortBy;

  // Handle special case for 'asignados' (requires aggregation, not direct sort)
  if (sortBy === 'asignados') {
    // For assignments count sorting, we'd need a more complex query
    // For now, fall back to default sort
    return [{ created_at: 'desc' }];
  }

  return [{ [dbColumn]: validSortOrder }];
}

// ============================================================================
// validateBatchLimit
// ============================================================================

/**
 * Validates that batch operations don't exceed the maximum allowed size
 *
 * @param ids - Array of work order IDs to validate
 * @throws Error if batch size exceeds MAX_BATCH_SIZE (50)
 * @returns true if validation passes
 *
 * @example
 * ```ts
 * validateBatchLimit(['id1', 'id2', 'id3']); // Returns true
 * validateBatchLimit(Array(51).fill('id')); // Throws Error
 * ```
 */
export function validateBatchLimit(ids: string[]): boolean {
  if (ids.length > MAX_BATCH_SIZE) {
    throw new Error(`No se pueden procesar más de ${MAX_BATCH_SIZE} OTs a la vez`);
  }
  return true;
}

// ============================================================================
// parseListParams
// ============================================================================

/**
 * Parses and validates URL parameters for list view
 *
 * @param params - Raw URL parameters (from searchParams)
 * @returns Validated and typed list parameters
 *
 * @example
 * ```ts
 * parseListParams({ page: '2', estado: 'PENDIENTE', tipo: 'CORRECTIVO' })
 * // Returns: { page: 2, pageSize: 100, filters: { estado: ['PENDIENTE'], tipo: 'CORRECTIVO' }, sort: { sortBy: 'created_at', sortOrder: 'desc' } }
 * ```
 */
export function parseListParams(params: Record<string, string | undefined>): ListParams {
  // Parse page number
  let page = 1;
  if (params.page) {
    const parsedPage = parseInt(params.page, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  // Parse page size (cap at 100)
  let pageSize = DEFAULT_PAGE_SIZE;
  if (params.pageSize) {
    const parsedPageSize = parseInt(params.pageSize, 10);
    if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
      pageSize = Math.min(parsedPageSize, DEFAULT_PAGE_SIZE);
    }
  }

  // Parse filters
  const filters: FilterParams = {};

  // Estado (can be comma-separated)
  if (params.estado) {
    const trimmed = params.estado.trim();
    if (trimmed) {
      const estados = trimmed.split(',').map((e) => e.trim()).filter(Boolean);
      if (estados.length === 1) {
        filters.estado = estados[0] as WorkOrderEstado;
      } else if (estados.length > 1) {
        filters.estado = estados as WorkOrderEstado[];
      }
    }
  }

  // Tipo
  if (params.tipo) {
    const trimmed = params.tipo.trim();
    if (trimmed && (trimmed === 'PREVENTIVO' || trimmed === 'CORRECTIVO')) {
      filters.tipo = trimmed as WorkOrderTipo;
    }
  }

  // Técnico ID
  if (params.tecnico) {
    const trimmed = params.tecnico.trim();
    if (trimmed) {
      filters.tecnicoId = trimmed;
    }
  }

  // Equipo ID
  if (params.equipo) {
    const trimmed = params.equipo.trim();
    if (trimmed) {
      filters.equipoId = trimmed;
    }
  }

  // Date range
  if (params.fechaInicio) {
    const date = new Date(params.fechaInicio);
    if (!isNaN(date.getTime())) {
      filters.fechaInicio = date;
    }
  }

  if (params.fechaFin) {
    const date = new Date(params.fechaFin);
    if (!isNaN(date.getTime())) {
      filters.fechaFin = date;
    }
  }

  // Parse sort
  const sort: SortParams = {
    sortBy: params.sortBy || 'created_at',
    sortOrder: params.sortOrder === 'asc' ? 'asc' : 'desc',
  };

  return {
    page,
    pageSize,
    filters,
    sort,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Removes duplicate values from an array
 */
export function dedupeArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Formats a date for URL parameters (YYYY-MM-DD)
 */
export function formatDateForURL(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculates pagination metadata
 */
export function calculatePaginationMeta(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startItem: (page - 1) * pageSize + 1,
    endItem: Math.min(page * pageSize, total),
  };
}
