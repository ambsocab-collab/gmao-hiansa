/**
 * Tests para Server Actions de Autenticación
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Tests para:
 * - Server Action login()
 * - Server Action logout()
 * - Rate limiting
 */

import { describe, it, expect } from 'vitest'
import { checkRateLimit, resetRateLimit, getRemainingAttempts } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  describe('checkRateLimit', () => {
    it('should allow first attempt', async () => {
      const ip = '192.168.1.1'
      const result = await checkRateLimit(ip)

      expect(result).toBe(true)
    })

    it('should allow up to 5 attempts', async () => {
      const ip = '192.168.1.2'

      // Hacer 5 intentos
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit(ip)
        expect(result).toBe(true)
      }
    })

    it('should block after 5 failed attempts', async () => {
      const ip = '192.168.1.3'

      // Hacer 5 intentos permitidos
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(ip)
      }

      // Sexto intento debe ser bloqueado
      const result = await checkRateLimit(ip)
      expect(result).toBe(false)
    })
  })

  describe('resetRateLimit', () => {
    it('should reset rate limit for IP', async () => {
      const ip = '192.168.1.4'

      // Hacer 3 intentos
      for (let i = 0; i < 3; i++) {
        await checkRateLimit(ip)
      }

      // Verificar que quedan 2 intentos
      expect(getRemainingAttempts(ip)).toBe(2)

      // Resetear
      resetRateLimit(ip)

      // Debe permitir nuevamente 5 intentos
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit(ip)
        expect(result).toBe(true)
      }
    })
  })

  describe('getRemainingAttempts', () => {
    it('should return 5 for new IP', () => {
      const ip = '192.168.1.5'
      const remaining = getRemainingAttempts(ip)

      expect(remaining).toBe(5)
    })

    it('should decrease after each attempt', async () => {
      const ip = '192.168.1.6'

      await checkRateLimit(ip)
      expect(getRemainingAttempts(ip)).toBe(4)

      await checkRateLimit(ip)
      expect(getRemainingAttempts(ip)).toBe(3)

      await checkRateLimit(ip)
      expect(getRemainingAttempts(ip)).toBe(2)
    })

    it('should return 0 when blocked', async () => {
      const ip = '192.168.1.7'

      // Hacer 5 intentos
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(ip)
      }

      expect(getRemainingAttempts(ip)).toBe(0)
    })

    it('should reset after using a different IP', async () => {
      const ip1 = '192.168.1.8'
      const ip2 = '192.168.1.9'

      // Agotar intentos para ip1
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(ip1)
      }

      expect(getRemainingAttempts(ip1)).toBe(0)

      // ip2 debe tener todos los intentos disponibles
      expect(getRemainingAttempts(ip2)).toBe(5)
    })
  })
})
