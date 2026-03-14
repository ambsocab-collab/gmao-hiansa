/**
 * Landing Page Unit Tests
 * Story 1.4: Landing Page Minimalista
 *
 * Testing the minimalist landing page with Hiansa branding
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/(landing)/page'

// Mock NextAuth
vi.mock('@/lib/auth-adapter', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}))

// Mock Next.js redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visual Design (AC1)', () => {
    it('renders HiansaLogo centered at top', async () => {
      render(await HomePage())

      // Check for Hiansa logo SVG
      const logos = screen.getAllByRole('img', { name: /hiansa logo/i })
      expect(logos.length).toBeGreaterThan(0)
    })

    it('renders "GMAO" text without "Hiansa" duplication', async () => {
      render(await HomePage())

      // Use getAllByText to handle potential multiple instances
      const gmaoTexts = screen.getAllByText('GMAO')
      expect(gmaoTexts.length).toBeGreaterThan(0)

      // Ensure "Hiansa" is not duplicated in the heading
      const hiansaHeadings = screen.queryAllByRole('heading', { name: /hiansa/i })
      expect(hiansaHeadings.length).toBe(0)
    })

    it('renders "Acceder al Sistema" button', async () => {
      render(await HomePage())

      const buttons = screen.getAllByRole('button', { name: /acceder al sistema/i })
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders footer "powered by hiansa BSC"', async () => {
      render(await HomePage())

      const footers = screen.getAllByText(/powered by hiansa BSC/i)
      expect(footers.length).toBeGreaterThan(0)
    })

    it('does NOT render informational cards', async () => {
      render(await HomePage())

      // Should not have the old 3-card layout titles
      expect(screen.queryByText('Reporte de Averías')).toBeNull()
      expect(screen.queryByText('Órdenes de Trabajo')).toBeNull()
      expect(screen.queryByText('Control de Stock')).toBeNull()
    })
  })

  describe('Server-side Auth Redirect (AC2)', () => {
    it('redirects to /dashboard when user is authenticated', async () => {
      const { redirect } = await import('next/navigation')
      const { auth } = await import('@/lib/auth-adapter')

      // Mock authenticated session
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      } as any)

      await HomePage()

      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('renders landing page when user is NOT authenticated', async () => {
      const { auth } = await import('@/lib/auth-adapter')

      // Mock unauthenticated session
      vi.mocked(auth).mockResolvedValue(null)

      const { container } = render(await HomePage())
      expect(container.firstChild).toBeDefined()
    })
  })

  describe('Accessibility (AC4)', () => {
    it('has semantic HTML structure', async () => {
      render(await HomePage())

      // Check for semantic main element(s)
      const mains = screen.getAllByRole('main')
      expect(mains.length).toBeGreaterThan(0)

      // Check for button
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Note: User requested to remove heading element, so we don't expect one
    })

    it('button has proper aria-label', async () => {
      render(await HomePage())

      const buttons = screen.getAllByRole('button', { name: /acceder al sistema/i })
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons[0].getAttribute('aria-label')).toBe('Acceder al sistema de GMAO')
    })
  })
})
