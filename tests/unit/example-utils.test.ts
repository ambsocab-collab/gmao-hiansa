/**
 * Example Unit Test for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * This test demonstrates:
 * - Pure function testing
 * - Zod schema validation
 * - Utility function testing
 * - Factory usage
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { userFactory, assetFactory, otFactory, generateTestId, generateSequence } from '../factories/data.factories';

/**
 * Example: Pure function for formatting dates
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Example: Zod schema for user validation
 */
const userSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(2),
  password: z.string().min(8),
  capabilities: z.array(z.string()).min(1),
});

/**
 * Example: Utility function for OT priority calculation
 */
const calculateOTPriority = (urgencia: string, tipo: string): string => {
  const urgencyMap = { Alta: 3, Media: 2, Baja: 1 };
  const typeMap = { Correctivo: 3, Preventivo: 2 };

  const urgencyScore = urgencyMap[urgencia as keyof typeof urgencyMap] || 1;
  const typeScore = typeMap[tipo as keyof typeof typeMap] || 1;

  const score = urgencyScore + typeScore;

  if (score >= 5) return 'Alta';
  if (score >= 4) return 'Media';
  return 'Baja';
};

/**
 * Example: SSE event parser
 */
const parseSSEEvent = (data: string): { type: string; payload: any } => {
  const lines = data.split('\n');
  const eventLine = lines.find((line) => line.startsWith('event:'));

  if (!eventLine) {
    throw new Error('Invalid SSE event format');
  }

  const eventType = eventLine.split(':')[1].trim();
  const dataLine = lines.find((line) => line.startsWith('data:'));

  if (!dataLine) {
    throw new Error('Invalid SSE data format');
  }

  const payload = JSON.parse(dataLine.split(':')[1].trim());

  return { type: eventType, payload };
};

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2026-03-07T10:30:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('2026-03-07');
    });

    it('should handle dates at midnight', () => {
      const date = new Date('2026-03-07T00:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('2026-03-07');
    });
  });

  describe('calculateOTPriority', () => {
    it('should return Alta for Alta urgencia + Correctivo type', () => {
      const priority = calculateOTPriority('Alta', 'Correctivo');
      expect(priority).toBe('Alta');
    });

    it('should return Media for Media urgencia + Correctivo type', () => {
      const priority = calculateOTPriority('Media', 'Correctivo');
      expect(priority).toBe('Alta'); // 2 + 3 = 5 → Alta
    });

    it('should return Baja for Baja urgencia + Preventivo type', () => {
      const priority = calculateOTPriority('Baja', 'Preventivo');
      expect(priority).toBe('Baja'); // 1 + 2 = 3 → Baja
    });
  });

  describe('parseSSEEvent', () => {
    it('should parse valid SSE event', () => {
      const data = `event:ot_updated\ndata:{"ot_id":"123","status":"En Progreso"}`;
      const parsed = parseSSEEvent(data);

      expect(parsed.type).toBe('ot_updated');
      expect(parsed.payload).toEqual({
        ot_id: '123',
        status: 'En Progreso',
      });
    });

    it('should throw error for invalid SSE format', () => {
      const invalidData = 'invalid event format';
      expect(() => parseSSEEvent(invalidData)).toThrow('Invalid SSE event format');
    });
  });
});

describe('Zod Schema Validation', () => {
  it('should validate valid user object', () => {
    const validUser = userFactory({
      email: 'test@example.com',
      nombre: 'Juan',
    });

    const result = userSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidUser = userFactory({
      email: 'not-an-email',
    });

    const result = userSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should reject user with no capabilities', () => {
    const invalidUser = userFactory({
      capabilities: [],
    });

    const result = userSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});

describe('Factories', () => {
  it('should generate unique test IDs', () => {
    const id1 = generateTestId('test');
    const id2 = generateTestId('test');

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^test-/);
  });

  it('should generate sequence of unique items', () => {
    const sequence = generateSequence(assetFactory, 5);

    expect(sequence).toHaveLength(5);
    const nombres = sequence.map((asset) => asset.nombre);
    const uniqueNombres = new Set(nombres);

    expect(uniqueNombres.size).toBe(5); // All names are unique
  });
});
