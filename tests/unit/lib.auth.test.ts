/**
 * Unit Tests for lib/auth.ts
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing password hashing and verification utilities
 */

import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, getSession } from '@/lib/auth';

describe('lib/auth - Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'SamePassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salt each time
    });

    it('should hash passwords with special characters', async () => {
      const password = 'P@$$w0rd!ñ#€';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should handle empty string passwords', async () => {
      const password = '';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should use bcryptjs with salt rounds 10', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      // bcrypt hashes with salt=10 start with $2b$10$
      expect(hash).toMatch(/^\$2[aby]\$10\$/);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password successfully', async () => {
      const password = 'CorrectPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'CorrectPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should reject empty password when hash is from non-empty password', async () => {
      const password = 'NonEmptyPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('', hash);

      expect(isValid).toBe(false);
    });

    it('should handle password with special characters', async () => {
      const password = 'P@$$w0rd!ñ#€';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject invalid hash format', async () => {
      const password = 'TestPassword123!';
      const invalidHash = 'invalid-hash-format';

      const isValid = await verifyPassword(password, invalidHash);
      expect(isValid).toBe(false);
    });
  });

  describe('hashPassword + verifyPassword integration', () => {
    it('should work together for multiple passwords', async () => {
      const passwords = [
        'Simple123',
        'Complex!@#123',
        'WithSpaces 123',
        'MuyÑoñoÇñáéí',
      ];

      for (const password of passwords) {
        const hash = await hashPassword(password);
        const isValid = await verifyPassword(password, hash);
        expect(isValid).toBe(true);
      }
    });

    it('should not verify different passwords against same hash', async () => {
      const correctPassword = 'OriginalPassword123!';
      const wrongPasswords = [
        'originalpassword123!', // Case sensitive
        'OriginalPassword123', // Missing !
        'OriginalPassword1234', // Extra digit
      ];

      const hash = await hashPassword(correctPassword);

      for (const wrongPassword of wrongPasswords) {
        const isValid = await verifyPassword(wrongPassword, hash);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('getSession', () => {
    it('should return null (placeholder)', async () => {
      const session = await getSession();
      expect(session).toBe(null);
    });

    // TODO: Add tests for getSession after Story 1.4 implementation
    // it('should return session when user is authenticated', async () => {
    //   // Test after Story 1.4
    // });
  });
});
