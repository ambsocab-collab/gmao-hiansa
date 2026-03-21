/**
 * Unit Tests: Story 2.2 - Zod Validation Schemas
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - reporteAveriaSchema validation
 * - equipoId required
 * - descripcion required (min 10 chars)
 * - fotoUrl optional
 */

import { describe, it, expect } from 'vitest';
import { reporteAveriaSchema } from '@/lib/utils/validations/averias';

describe('reporteAveriaSchema - Zod Validation', () => {
  /**
   * P0-UNIT-001: Validación exitosa con todos los campos
   */
  it('should validate correct input', () => {
    // Given: Data válido
    const input = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal de línea 1',
      reportadoPor: 'user-123',
      fotoUrl: 'https://storage.example.com/foto.jpg',
    };

    // When: Parseo con schema
    const result = reporteAveriaSchema.parse(input);

    // Then: Validación exitosa
    expect(result).toEqual(input);
  });

  /**
   * P0-UNIT-002: Validación - equipoId es requerido
   *
   * AC3: Equipo es REQUERIDO
   */
  it('should reject when equipoId is missing', () => {
    // Given: Input sin equipoId
    const input = {
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When/Then: Validación falla
    expect(() => reporteAveriaSchema.parse(input)).toThrow();
  });

  /**
   * P0-UNIT-003: Validación - equipoId debe ser string no vacío
   */
  it('should reject when equipoId is empty string', () => {
    // Given: Input con equipoId vacío
    const input = {
      equipoId: '',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When/Then: Validación falla
    expect(() => reporteAveriaSchema.parse(input)).toThrow();
  });

  /**
   * P0-UNIT-004: Validación - descripción es requerida
   *
   * AC4: Descripción es REQUERIDA
   */
  it('should reject when descripcion is missing', () => {
    // Given: Input sin descripción
    const input = {
      equipoId: 'equipo-123',
      reportadoPor: 'user-123',
    };

    // When/Then: Validación falla
    expect(() => reporteAveriaSchema.parse(input)).toThrow();
  });

  /**
   * P0-UNIT-005: Validación - descripción mínimo 10 caracteres
   *
   * AC4: Mínimo 10 caracteres
   */
  it('should reject when descripcion is too short', () => {
    // Given: Input con descripción corta
    const input = {
      equipoId: 'equipo-123',
      descripcion: 'Corto', // 5 caracteres
      reportadoPor: 'user-123',
    };

    // When/Then: Validación falla
    expect(() => reporteAveriaSchema.parse(input)).toThrow();
  });

  /**
   * P0-UNIT-006: Validación - descripción exactamente 10 caracteres (frontera)
   *
   * AC4: Mínimo 10 caracteres (acepta 10 exactos)
   */
  it('should accept when descripcion is exactly 10 characters', () => {
    // Given: Input con descripción de 10 caracteres
    const input = {
      equipoId: 'equipo-123',
      descripcion: '1234567890', // Exactly 10 chars
      reportadoPor: 'user-123',
    };

    // When: Parseo con schema
    const result = reporteAveriaSchema.parse(input);

    // Then: Validación exitosa
    expect(result.descripcion).toBe('1234567890');
  });

  /**
   * P2-UNIT-001: Validación - fotoUrl es opcional
   *
   * AC5: Foto es opcional
   */
  it('should accept input without fotoUrl', () => {
    // Given: Input sin fotoUrl
    const input = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    };

    // When: Parseo con schema
    const result = reporteAveriaSchema.parse(input);

    // Then: Validación exitosa
    expect(result).toEqual({
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
    });
  });

  /**
   * P2-UNIT-002: Validación - fotoUrl debe ser URL válida si está presente
   */
  it('should validate fotoUrl is URL if provided', () => {
    // Given: Input con fotoUrl inválida
    const input = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
      fotoUrl: 'not-a-valid-url',
    };

    // When/Then: Validación falla
    expect(() => reporteAveriaSchema.parse(input)).toThrow();
  });

  /**
   * P2-UNIT-003: Validación - fotoUrl acepta URL válida
   */
  it('should accept valid fotoUrl', () => {
    // Given: Input con fotoUrl válida
    const input = {
      equipoId: 'equipo-123',
      descripcion: 'Fallo en motor principal',
      reportadoPor: 'user-123',
      fotoUrl: 'https://storage.example.com/foto.jpg',
    };

    // When: Parseo con schema
    const result = reporteAveriaSchema.parse(input);

    // Then: Validación exitosa
    expect(result.fotoUrl).toBe('https://storage.example.com/foto.jpg');
  });
});
