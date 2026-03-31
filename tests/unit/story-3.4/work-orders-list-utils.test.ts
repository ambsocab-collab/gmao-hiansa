/**
 * Unit Tests for Story 3.4 - Work Orders List Utilities
 *
 * Tests pure functions for filtering, sorting, and validation.
 * These functions have no side effects and are deterministic.
 */

import { describe, it, expect } from 'vitest';
import {
  buildFilterQuery,
  buildSortQuery,
  validateBatchLimit,
  parseListParams,
  dedupeArray,
  formatDateForURL,
  calculatePaginationMeta,
  MAX_BATCH_SIZE,
  DEFAULT_PAGE_SIZE,
} from '@/lib/utils/work-orders-list';
import { WorkOrderEstado, WorkOrderTipo } from '@prisma/client';

describe('Story 3.4 - Unit Tests: Work Orders List Utils (P1)', () => {
  /**
   * buildFilterQuery Tests
   */
  describe('buildFilterQuery', () => {
    it('[P1-UNIT-001] should return empty object when no filters provided', () => {
      const result = buildFilterQuery({});
      expect(result).toEqual({});
    });

    it('[P1-UNIT-002] should build estado filter query (single value)', () => {
      const result = buildFilterQuery({ estado: WorkOrderEstado.PENDIENTE });
      expect(result).toEqual({
        estado: WorkOrderEstado.PENDIENTE,
      });
    });

    it('[P1-UNIT-003] should build estado filter query (array)', () => {
      const result = buildFilterQuery({ estado: [WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA] });
      expect(result).toEqual({
        estado: { in: [WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA] },
      });
    });

    it('[P1-UNIT-004] should build tipo filter query', () => {
      const result = buildFilterQuery({ tipo: WorkOrderTipo.CORRECTIVO });
      expect(result).toEqual({
        tipo: WorkOrderTipo.CORRECTIVO,
      });
    });

    it('[P1-UNIT-005] should build date range filter query', () => {
      const fechaInicio = new Date('2024-01-01');
      const fechaFin = new Date('2024-12-31');
      const result = buildFilterQuery({ fechaInicio, fechaFin });
      expect(result).toEqual({
        created_at: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      });
    });

    it('[P1-UNIT-006] should build date range with only start date', () => {
      const fechaInicio = new Date('2024-01-01');
      const result = buildFilterQuery({ fechaInicio });
      expect(result).toEqual({
        created_at: {
          gte: fechaInicio,
        },
      });
    });

    it('[P1-UNIT-007] should build date range with only end date', () => {
      const fechaFin = new Date('2024-12-31');
      const result = buildFilterQuery({ fechaFin });
      expect(result).toEqual({
        created_at: {
          lte: fechaFin,
        },
      });
    });

    it('[P1-UNIT-008] should build técnico filter query', () => {
      const result = buildFilterQuery({ tecnicoId: 'user-123' });
      expect(result).toEqual({
        assignments: {
          some: { userId: 'user-123' },
        },
      });
    });

    it('[P1-UNIT-009] should build equipo filter query', () => {
      const result = buildFilterQuery({ equipoId: 'equipo-456' });
      expect(result).toEqual({
        equipo_id: 'equipo-456',
      });
    });

    it('[P1-UNIT-010] should combine multiple filters with AND logic', () => {
      const result = buildFilterQuery({
        estado: [WorkOrderEstado.PENDIENTE],
        tipo: WorkOrderTipo.CORRECTIVO,
      });

      expect(result).toHaveProperty('AND');
      expect((result as { AND: unknown[] }).AND).toHaveLength(2);
    });

    it('[P1-UNIT-011] should ignore empty estado array', () => {
      const result = buildFilterQuery({ estado: [] });
      expect(result).toEqual({});
    });

    it('[P1-UNIT-012] should handle all filters combined', () => {
      const fechaInicio = new Date('2024-01-01');
      const fechaFin = new Date('2024-12-31');
      const result = buildFilterQuery({
        estado: WorkOrderEstado.ASIGNADA,
        tipo: WorkOrderTipo.PREVENTIVO,
        tecnicoId: 'user-123',
        equipoId: 'equipo-456',
        fechaInicio,
        fechaFin,
      });

      expect(result).toHaveProperty('AND');
      expect((result as { AND: unknown[] }).AND).toHaveLength(5);
    });
  });

  /**
   * buildSortQuery Tests
   */
  describe('buildSortQuery', () => {
    it('[P1-UNIT-013] should return default sort when no params provided', () => {
      const result = buildSortQuery({});
      expect(result).toEqual([{ created_at: 'desc' }]);
    });

    it('[P1-UNIT-014] should build ascending sort query', () => {
      const result = buildSortQuery({ sortBy: 'created_at', sortOrder: 'asc' });
      expect(result).toEqual([{ created_at: 'asc' }]);
    });

    it('[P1-UNIT-015] should build descending sort query', () => {
      const result = buildSortQuery({ sortBy: 'estado', sortOrder: 'desc' });
      expect(result).toEqual([{ estado: 'desc' }]);
    });

    it('[P1-UNIT-016] should map numero column correctly', () => {
      const result = buildSortQuery({ sortBy: 'numero', sortOrder: 'asc' });
      expect(result).toEqual([{ numero: 'asc' }]);
    });

    it('[P1-UNIT-017] should map fecha column to created_at', () => {
      const result = buildSortQuery({ sortBy: 'fecha', sortOrder: 'desc' });
      expect(result).toEqual([{ created_at: 'desc' }]);
    });

    it('[P1-UNIT-018] should validate sort column (reject invalid)', () => {
      const result = buildSortQuery({ sortBy: 'invalid_column', sortOrder: 'asc' });
      expect(result).toEqual([{ created_at: 'desc' }]);
    });

    it('[P1-UNIT-019] should validate sort order (reject invalid)', () => {
      const result = buildSortQuery({ sortBy: 'estado', sortOrder: 'invalid' as never });
      expect(result).toEqual([{ estado: 'desc' }]); // Falls back to desc
    });

    it('[P1-UNIT-020] should handle equipo column', () => {
      const result = buildSortQuery({ sortBy: 'equipo', sortOrder: 'asc' });
      expect(result).toEqual([{ equipo_id: 'asc' }]);
    });

    it('[P1-UNIT-021] should handle tipo column', () => {
      const result = buildSortQuery({ sortBy: 'tipo', sortOrder: 'asc' });
      expect(result).toEqual([{ tipo: 'asc' }]);
    });

    it('[P1-UNIT-022] should fall back to default for asignados (complex aggregation)', () => {
      const result = buildSortQuery({ sortBy: 'asignados', sortOrder: 'asc' });
      expect(result).toEqual([{ created_at: 'desc' }]);
    });
  });

  /**
   * validateBatchLimit Tests
   */
  describe('validateBatchLimit', () => {
    it('[P1-UNIT-023] should return true for valid batch size', () => {
      const result = validateBatchLimit(['id1', 'id2', 'id3']);
      expect(result).toBe(true);
    });

    it('[P1-UNIT-024] should return true for exactly 50 items', () => {
      const ids = Array(50).fill('id');
      const result = validateBatchLimit(ids);
      expect(result).toBe(true);
    });

    it('[P1-UNIT-025] should throw error for 51 items', () => {
      const ids = Array(51).fill('id');
      expect(() => validateBatchLimit(ids)).toThrow(`No se pueden procesar más de ${MAX_BATCH_SIZE} OTs a la vez`);
    });

    it('[P1-UNIT-026] should throw error for 100 items', () => {
      const ids = Array(100).fill('id');
      expect(() => validateBatchLimit(ids)).toThrow(`No se pueden procesar más de ${MAX_BATCH_SIZE} OTs a la vez`);
    });

    it('[P1-UNIT-027] should return true for empty array', () => {
      const result = validateBatchLimit([]);
      expect(result).toBe(true);
    });

    it('[P1-UNIT-028] should return true for single item', () => {
      const result = validateBatchLimit(['id1']);
      expect(result).toBe(true);
    });
  });

  /**
   * parseListParams Tests
   */
  describe('parseListParams', () => {
    it('[P1-UNIT-029] should parse empty URL params with defaults', () => {
      const result = parseListParams({});
      expect(result).toEqual({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        filters: {},
        sort: { sortBy: 'created_at', sortOrder: 'desc' },
      });
    });

    it('[P1-UNIT-030] should parse page param', () => {
      const result = parseListParams({ page: '2' });
      expect(result.page).toBe(2);
    });

    it('[P1-UNIT-031] should parse estado filter (single value)', () => {
      const result = parseListParams({ estado: 'PENDIENTE' });
      expect(result.filters.estado).toBe('PENDIENTE');
    });

    it('[P1-UNIT-032] should parse estado filter (comma-separated)', () => {
      const result = parseListParams({ estado: 'PENDIENTE,ASIGNADA' });
      expect(result.filters.estado).toEqual(['PENDIENTE', 'ASIGNADA']);
    });

    it('[P1-UNIT-033] should parse tipo filter', () => {
      const result = parseListParams({ tipo: 'CORRECTIVO' });
      expect(result.filters.tipo).toBe('CORRECTIVO');
    });

    it('[P1-UNIT-034] should ignore invalid tipo value', () => {
      const result = parseListParams({ tipo: 'INVALID' });
      expect(result.filters.tipo).toBeUndefined();
    });

    it('[P1-UNIT-035] should parse tecnico filter', () => {
      const result = parseListParams({ tecnico: 'user-123' });
      expect(result.filters.tecnicoId).toBe('user-123');
    });

    it('[P1-UNIT-036] should parse equipo filter', () => {
      const result = parseListParams({ equipo: 'equipo-456' });
      expect(result.filters.equipoId).toBe('equipo-456');
    });

    it('[P1-UNIT-037] should parse date range filters', () => {
      const result = parseListParams({
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
      });
      expect(result.filters.fechaInicio).toBeInstanceOf(Date);
      expect(result.filters.fechaFin).toBeInstanceOf(Date);
    });

    it('[P1-UNIT-038] should parse sort params', () => {
      const result = parseListParams({ sortBy: 'estado', sortOrder: 'asc' });
      expect(result.sort).toEqual({ sortBy: 'estado', sortOrder: 'asc' });
    });

    it('[P1-UNIT-039] should validate page number is positive', () => {
      const result = parseListParams({ page: '-1' });
      expect(result.page).toBe(1); // Should default to 1
    });

    it('[P1-UNIT-040] should validate page number is not NaN', () => {
      const result = parseListParams({ page: 'invalid' });
      expect(result.page).toBe(1); // Should default to 1
    });

    it('[P1-UNIT-041] should limit pageSize to maximum 100', () => {
      const result = parseListParams({ pageSize: '500' });
      expect(result.pageSize).toBe(DEFAULT_PAGE_SIZE); // Should cap at 100
    });

    it('[P1-UNIT-042] should parse all params together', () => {
      const result = parseListParams({
        page: '2',
        estado: 'PENDIENTE,ASIGNADA',
        tipo: 'CORRECTIVO',
        sortBy: 'fecha',
        sortOrder: 'desc',
      });
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(result.filters.estado).toEqual(['PENDIENTE', 'ASIGNADA']);
      expect(result.filters.tipo).toBe('CORRECTIVO');
      expect(result.sort.sortBy).toBe('fecha');
      expect(result.sort.sortOrder).toBe('desc');
    });
  });

  /**
   * Helper Functions Tests
   */
  describe('Helper Functions', () => {
    describe('dedupeArray', () => {
      it('[P1-UNIT-043] should remove duplicates', () => {
        expect(dedupeArray(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      });

      it('[P1-UNIT-044] should handle empty array', () => {
        expect(dedupeArray([])).toEqual([]);
      });

      it('[P1-UNIT-045] should handle array with no duplicates', () => {
        expect(dedupeArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      });
    });

    describe('formatDateForURL', () => {
      it('[P1-UNIT-046] should format date as YYYY-MM-DD', () => {
        const date = new Date('2024-03-15T10:30:00Z');
        expect(formatDateForURL(date)).toBe('2024-03-15');
      });
    });

    describe('calculatePaginationMeta', () => {
      it('[P1-UNIT-047] should calculate correct metadata for first page', () => {
        const meta = calculatePaginationMeta(250, 1, 100);
        expect(meta).toEqual({
          total: 250,
          page: 1,
          pageSize: 100,
          totalPages: 3,
          hasNextPage: true,
          hasPrevPage: false,
          startItem: 1,
          endItem: 100,
        });
      });

      it('[P1-UNIT-048] should calculate correct metadata for middle page', () => {
        const meta = calculatePaginationMeta(250, 2, 100);
        expect(meta).toEqual({
          total: 250,
          page: 2,
          pageSize: 100,
          totalPages: 3,
          hasNextPage: true,
          hasPrevPage: true,
          startItem: 101,
          endItem: 200,
        });
      });

      it('[P1-UNIT-049] should calculate correct metadata for last page', () => {
        const meta = calculatePaginationMeta(250, 3, 100);
        expect(meta).toEqual({
          total: 250,
          page: 3,
          pageSize: 100,
          totalPages: 3,
          hasNextPage: false,
          hasPrevPage: true,
          startItem: 201,
          endItem: 250,
        });
      });

      it('[P1-UNIT-050] should handle empty results', () => {
        const meta = calculatePaginationMeta(0, 1, 100);
        expect(meta.totalPages).toBe(0);
        expect(meta.hasNextPage).toBe(false);
      });
    });
  });

  /**
   * Edge Cases
   */
  describe('Edge Cases', () => {
    it('[P1-UNIT-051] should handle malformed date strings', () => {
      const result = parseListParams({ fechaInicio: 'not-a-date' });
      expect(result.filters.fechaInicio).toBeUndefined();
    });

    it('[P1-UNIT-052] should handle empty string values', () => {
      const result = parseListParams({ estado: '' });
      expect(result.filters.estado).toBeUndefined();
    });

    it('[P1-UNIT-053] should handle whitespace in values', () => {
      const result = parseListParams({ estado: '  PENDIENTE  ' });
      expect(result.filters.estado).toBe('PENDIENTE');
    });

    it('[P1-UNIT-054] should handle duplicate values in comma-separated list', () => {
      const result = parseListParams({ estado: 'PENDIENTE,ASIGNADA,PENDIENTE' });
      // Note: deduplication happens at usage, not parsing
      expect(result.filters.estado).toEqual(['PENDIENTE', 'ASIGNADA', 'PENDIENTE']);
    });

    it('[P1-UNIT-055] should handle zero page number', () => {
      const result = parseListParams({ page: '0' });
      expect(result.page).toBe(1); // Should default to 1
    });
  });
});
