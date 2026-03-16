/**
 * Landing Page E2E Tests
 * Story 1.4: Landing Page Minimalista
 *
 * E2E tests using Playwright for landing page functionality
 */

import { test, expect } from '@playwright/test'

test.describe.skip('Landing Page Minimalista - Story 1.4', () => {
  test.beforeEach(async ({ page }) => {
    // Logout before each test to ensure clean state
    await page.context().clearCookies()
  })

  test('P0-E2E-001: Usuario NO autenticado ve landing page con diseño minimalista', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check URL is still / (not redirected)
    await expect(page).toHaveURL(/\//)

    // Check for Hiansa logo
    const logo = page.getByRole('img', { name: /hiansa logo/i })
    await expect(logo).toBeVisible()

    // Check for "GMAO" text (NOT in h1 tag anymore, just text)
    const gmaoText = page.getByText('GMAO')
    await expect(gmaoText).toBeVisible()

    // Check for "Acceder al Sistema" button
    const button = page.getByRole('button', { name: /acceder al sistema/i })
    await expect(button).toBeVisible()

    // Check button has correct styling
    await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)') // white

    // Check for footer (integrated in body, not absolute positioned)
    const footer = page.getByText(/powered by hiansa BSC/i)
    await expect(footer).toBeVisible()

    // Check that old cards are NOT present
    await expect(page.getByText('Reporte de Averías')).not.toBeVisible()
    await expect(page.getByText('Órdenes de Trabajo')).not.toBeVisible()
    await expect(page.getByText('Control de Stock')).not.toBeVisible()
  })

  test('P0-E2E-002: Usuario autenticado es redirigido a /dashboard', async ({ page }) => {
    // First, login as a test user
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit login form
    await page.click('button[type="submit"]')

    // Wait for navigation after login
    await page.waitForURL(/\/(dashboard|login)/)

    // Now navigate to home page
    await page.goto('/')

    // Should be redirected to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('P0-E2E-003: Botón "Acceder al Sistema" navega a /login', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Click the "Acceder al Sistema" button
    const button = page.getByRole('button', { name: /acceder al sistema/i })
    await button.click()

    // Should navigate to /login
    await page.waitForURL(/\/login/, { timeout: 3000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test('P0-E2E-004: Landing page cumple WCAG AA (contraste, touch targets)', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check button has aria-label for accessibility
    const button = page.getByRole('button', { name: /acceder al sistema/i })
    await expect(button).toHaveAttribute('aria-label', 'Acceder al sistema de GMAO')

    // Check button has sufficient touch target (should be at least 44px tall)
    const buttonBox = await button.boundingBox()
    expect(buttonBox).toBeTruthy()
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44)

    // Check for semantic HTML structure
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Check for "GMAO" text (no h1 element)
    const gmaoText = page.getByText('GMAO')
    await expect(gmaoText).toBeVisible()

    // Check footer is visible
    const footer = page.getByText(/powered by hiansa BSC/i)
    await expect(footer).toBeVisible()
  })

  test('P1-E2E-001: Landing page es responsive en mobile, tablet, desktop', async ({ page }) => {
    // Test mobile viewport (375px x 667px - iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check all elements are visible on mobile
    const logo = page.getByRole('img', { name: /hiansa logo/i })
    await expect(logo).toBeVisible()

    const gmaoText = page.getByText('GMAO')
    await expect(gmaoText).toBeVisible()

    const button = page.getByRole('button', { name: /acceder al sistema/i })
    await expect(button).toBeVisible()

    // On mobile, button should be full width (with margins)
    const buttonBox = await button.boundingBox()
    expect(buttonBox).toBeTruthy()
    expect(buttonBox!.width).toBeGreaterThan(250) // Full width with px-8 padding on mobile

    // Test tablet viewport (768px x 1024px - iPad)
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check elements are visible on tablet
    await expect(logo).toBeVisible()
    await expect(gmaoText).toBeVisible()
    await expect(button).toBeVisible()

    // Test desktop viewport (1920px x 1080px - Full HD)
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check elements are visible on desktop
    await expect(logo).toBeVisible()
    await expect(gmaoText).toBeVisible()
    await expect(button).toBeVisible()

    // On desktop, button should NOT be full width
    const buttonBoxDesktop = await button.boundingBox()
    expect(buttonBoxDesktop).toBeTruthy()
    expect(buttonBoxDesktop!.width).toBeLessThan(400) // Should be auto width on desktop
  })
})
