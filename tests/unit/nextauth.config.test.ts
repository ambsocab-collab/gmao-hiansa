/**
 * Tests para NextAuth Configuration
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * RED PHASE: Tests que validan la configuración de NextAuth
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { POST, GET } from '@/app/api/auth/[...nextauth]/route'

describe('NextAuth Configuration', () => {
  describe('Route Handlers', () => {
    it('[P0] 0.3-UNIT-001: should export GET and POST handlers', () => {
      // Verificar que los route handlers existen
      expect(GET).toBeDefined()
      expect(POST).toBeDefined()
      expect(typeof GET).toBe('function')
      expect(typeof POST).toBe('function')
    })
  })

  describe('Auth Options', () => {
    it('[P0] 0.3-UNIT-002: should have Credentials provider configured', async () => {
      // Este test validará que el Credentials provider está configurado
      // La implementación hará pasar este test
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions).toBeDefined()
      expect(authOptions.providers).toBeInstanceOf(Array)
      expect(authOptions.providers.length).toBeGreaterThan(0)

      const credentialsProvider = authOptions.providers.find(
        (p: any) => p.id === 'credentials'
      )
      expect(credentialsProvider).toBeDefined()
      expect(credentialsProvider.name).toBe('Credentials')
    })

    it('[P0] 0.3-UNIT-003: should have JWT session strategy with 8 hour maxAge', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions.session).toBeDefined()
      expect(authOptions.session.strategy).toBe('jwt')
      expect(authOptions.session.maxAge).toBe(8 * 60 * 60) // 8 horas en segundos
    })

    it('[P0] 0.3-UNIT-004: should have jwt callback configured', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions.callbacks).toBeDefined()
      expect(authOptions.callbacks.jwt).toBeDefined()
      expect(typeof authOptions.callbacks.jwt).toBe('function')
    })

    it('[P0] 0.3-UNIT-005: should have session callback configured', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions.callbacks.session).toBeDefined()
      expect(typeof authOptions.callbacks.session).toBe('function')
    })

    it('[P1] 0.3-UNIT-006: should have signIn callback configured', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions.callbacks.signIn).toBeDefined()
      expect(typeof authOptions.callbacks.signIn).toBe('function')
    })

    it('[P1] 0.3-UNIT-007: should have custom pages configured', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      expect(authOptions.pages).toBeDefined()
      expect(authOptions.pages.signIn).toBe('/login')
      expect(authOptions.pages.error).toBe('/login')
    })
  })

  describe('JWT Callback Behavior', () => {
    it('[P0] 0.3-UNIT-008: should add user id and capabilities to token when user exists', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        capabilities: ['can_view_kpis', 'can_create_failure_report']
      }

      const mockToken = {}

      const result = await authOptions.callbacks.jwt({
        token: mockToken,
        user: mockUser
      })

      expect(result.id).toBe('user-123')
      expect(result.capabilities).toEqual(['can_view_kpis', 'can_create_failure_report'])
    })

    it('[P1] 0.3-UNIT-009: should add forcePasswordReset to token when user has temporary password', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        capabilities: ['can_view_kpis'],
        forcePasswordReset: true
      }

      const mockToken = {}

      const result = await authOptions.callbacks.jwt({
        token: mockToken,
        user: mockUser
      })

      expect(result.id).toBe('user-123')
      expect(result.forcePasswordReset).toBe(true)
    })

    it('[P2] 0.3-UNIT-010: should preserve existing token when user is undefined', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      const mockToken = {
        id: 'user-123',
        capabilities: ['can_view_kpis']
      }

      const result = await authOptions.callbacks.jwt({
        token: mockToken,
        user: undefined
      })

      expect(result.id).toBe('user-123')
      expect(result.capabilities).toEqual(['can_view_kpis'])
    })
  })

  describe('Session Callback Behavior', () => {
    it('should add user id and capabilities from token to session', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      const mockToken = {
        id: 'user-123',
        capabilities: ['can_view_kpis']
      }

      const mockSession = {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }

      const result = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken
      })

      expect(result.user.id).toBe('user-123')
      expect(result.user.capabilities).toEqual(['can_view_kpis'])
    })

    it('should add forcePasswordReset from token to session', async () => {
      const { authOptions } = await import('@/app/api/auth/[...nextauth]/route')

      const mockToken = {
        id: 'user-123',
        capabilities: ['can_view_kpis'],
        forcePasswordReset: true
      }

      const mockSession = {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }

      const result = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken
      })

      expect(result.user.id).toBe('user-123')
      expect(result.user.forcePasswordReset).toBe(true)
    })
  })
})
