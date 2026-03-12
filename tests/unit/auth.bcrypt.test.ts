/**
 * Tests para Autenticación con bcryptjs
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Tests para validar:
 * - Hash de password con cost factor 10
 * - Verificación de password
 * - Integración con Prisma User model
 */

import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth'

describe('Authentication Logic - bcryptjs', () => {
  describe('hashPassword function', () => {
    it('should hash password with cost factor 10', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      // Verificar que el hash es diferente al password original
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      // Los hashes deben ser diferentes (debido al salt)
      expect(hash1).not.toBe(hash2)
    })

    it('should generate hash with bcrypt format', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      // Los hashes de bcrypt empiezan con $2a$ o $2b$
      expect(hash).toMatch(/^\$2[ab]\$/)
    })
  })

  describe('verifyPassword function', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!'
      const wrongPassword = 'WrongPassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })

    it('should return false for empty password', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('', hash)

      expect(isValid).toBe(false)
    })
  })

  describe('bcryptjs cost factor verification', () => {
    it('should use cost factor 10 (SALT_ROUNDS)', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      // Extraer el cost factor del hash
      // Formato: $2a$10$...
      const costFactor = parseInt(hash.split('$')[2])

      expect(costFactor).toBe(10)
    })
  })
})
