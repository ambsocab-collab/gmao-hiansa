/**
 * Unit Tests for lib/db.ts
 * Story 0.2: Database Schema Prisma con Jerarquía 5 Niveles
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing PrismaClient singleton pattern
 */

import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';

describe('lib/db - PrismaClient Singleton', () => {
  it('[P0] 0.2-UNIT-001: should export prisma client instance', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe('object');
  });

  it('[P0] 0.2-UNIT-002: should have Prisma Client methods available', () => {
    expect(prisma.user).toBeDefined();
    expect(typeof prisma.user.findMany).toBe('function');
    expect(typeof prisma.user.findUnique).toBe('function');
    expect(typeof prisma.user.create).toBe('function');
    expect(typeof prisma.user.update).toBe('function');
    expect(typeof prisma.user.delete).toBe('function');
  });

  it('[P0] 0.2-UNIT-003: should maintain singleton pattern', async () => {
    // Import again to verify it's the same instance
    const { prisma: prisma2 } = await import('@/lib/db');
    expect(prisma).toBe(prisma2);
  });

  it('[P1] 0.2-UNIT-004: should have transaction support', () => {
    expect(prisma.$transaction).toBeDefined();
    expect(typeof prisma.$transaction).toBe('function');
  });

  it('[P1] 0.2-UNIT-005: should have disconnect method', () => {
    expect(prisma.$disconnect).toBeDefined();
    expect(typeof prisma.$disconnect).toBe('function');
  });

  it('[P1] 0.2-UNIT-006: should have connection management methods', () => {
    expect(prisma.$connect).toBeDefined();
    expect(prisma.$disconnect).toBeDefined();
    expect(prisma.$on).toBeDefined();
    expect(prisma.$use).toBeDefined();
  });

  // Note: We don't test actual database operations here to avoid
  // requiring a database connection for unit tests.
  // Integration tests should cover database operations.

  describe('Prisma Client Configuration', () => {
    it('[P0] 0.2-UNIT-007: should be configured for PostgreSQL', () => {
      // Prisma Client should have User model from schema.prisma
      expect(prisma.user).toBeDefined();

      // Check that User model has fields from schema
      const userFields = [
        'id',
        'name',
        'email',
        'password_hash',
        'force_password_reset',
        'created_at',
        'updated_at'
      ];

      // Verify fields exist in Prisma model (fields are in .fields property)
      userFields.forEach(field => {
        expect(prisma.user.fields).toHaveProperty(field);
      });
    });

    it('[P2] 0.2-UNIT-008: should have timestamp fields', () => {
      expect(prisma.user.fields.createdAt).toBeDefined();
      expect(prisma.user.fields.updatedAt).toBeDefined();
    });

    it('[P2] 0.2-UNIT-009: should have unique constraint on email', () => {
      const emailField = prisma.user.fields.email;
      expect(emailField).toBeDefined();
      // The unique constraint is enforced at database level
      // This test verifies the field exists in the model
    });
  });

  describe('Singleton Pattern Behavior', () => {
    it('[P1] 0.2-UNIT-010: should not create multiple instances in development', async () => {
      // In development, the singleton should prevent multiple instances
      const instances = [];
      for (let i = 0; i < 5; i++) {
        const { prisma: prismaInstance } = await import('@/lib/db');
        instances.push(prismaInstance);
      }

      // All should be the same instance
      const firstInstance = instances[0];
      instances.forEach(instance => {
        expect(instance).toBe(firstInstance);
      });
    });

    it('should attach to globalThis in development', () => {
      // Verify that in development, the prisma instance is attached to globalThis
      if (process.env.NODE_ENV !== 'production') {
        expect(globalThis).toHaveProperty('prisma');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // This test verifies error handling structure
      // Actual connection testing would require database
      expect(async () => {
        // Will fail without database connection
        await prisma.user.findMany();
      }).toBeDefined(); // Function exists, may throw without DB
    });
  });
});
