/**
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado - E2E Tests
 *
 * End-to-end tests for layout optimization using Playwright
 * Tests AC1-AC5 in real browser environment
 *
 * Prerequisites:
 * - User must be logged in
 * - Test data: test user with capabilities
 */

import { test, expect } from '@playwright/test'

/**
 * Helper function to login before tests
 * Story 1.1: Login functionality
 */
async function login(page: any) {
  await page.goto('/login')

  // Fill login form with test credentials
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'Test1234')

  // Submit login form
  await page.click('button[type="submit"]')

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard', { timeout: 5000 })
}

/**
 * Helper function to create SVG logo element for testing
 * Used when logo component is not available in test environment
 */
function createTestLogoSVG(): string {
  return `
    <svg width="164" height="41" viewBox="0 0 164 41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Hiansa Logo" role="img">
      <path d="M34.7634851,36.3269274 C34.2731935,36.4753083 33.7770446,36.6163679 33.2760149,36.750594" fill="currentColor"/>
      <g transform="translate(22.208333, 0.055399)">
        <path d="M0.222400595,2.17766131 C0.680233929,2.03123274 1.21079345,1.89090536 1.70694226,1.75863155" fill="currentColor"/>
      </g>
      <polygon points="82.8981929 29.3795506 82.8981929 2.24316369" fill="currentColor"/>
      <text x="70" y="35" font-size="12" fill="currentColor" opacity="0.8">BSC</text>
    </svg>
  `
}

test.describe.skip('Story 1.5: Layout Desktop Optimizado', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  /**
   * P0-E2E-001: Logo Hiansa visible en todas las páginas autenticadas (AC1)
   *
   * Given: Usuario autenticado en el sistema
   * When: Navega a páginas autenticadas (/dashboard, /usuarios, /kpis)
   * Then: Veo el logo Hiansa SVG visible en el header
   * And: El logo está ubicado en la parte superior del header
   * And: El logo NO está duplicado en el sidebar
   */
  test('P0-E2E-001: Logo Hiansa visible en todas las páginas autenticadas', async ({ page }) => {
    // Test dashboard page
    await page.goto('/dashboard')

    // Check for logo in header
    const headerLogo = page.locator('header svg[aria-label="Hiansa Logo"]')
    await expect(headerLogo).toBeVisible()

    // Verify logo is in header (top of page)
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.locator('svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Verify logo is NOT in sidebar
    const sidebar = page.locator('aside[role="complementary"]')
    const sidebarLogo = sidebar.locator('svg[aria-label="Hiansa Logo"]')
    await expect(sidebarLogo).not.toBeVisible()

    // Test other authenticated pages
    const pages = ['/usuarios', '/assets']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()
    }
  })

  /**
   * P0-E2E-002: Sidebar compact implementado por defecto (AC2)
   *
   * Given: Usuario autenticado en el sistema
   * When: Navega a páginas autenticadas en desktop
   * Then: El sidebar usa variant compact (200px de ancho)
   * And: El sidebar tiene las clases CSS correctas (w-52)
   * And: El sidebar es responsive: oculto en móvil
   */
  test('P0-E2E-002: Sidebar compact implementado por defecto', async ({ page }) => {
    await page.goto('/dashboard')

    // Get sidebar element
    const sidebar = page.locator('aside[role="complementary"]')

    // Verify sidebar is visible on desktop
    await expect(sidebar).toBeVisible()

    // Verify sidebar has compact width (w-52 = 200px)
    await expect(sidebar).toHaveClass(/w-52/)

    // Verify sidebar is hidden on mobile (has 'hidden' class)
    await expect(sidebar).toHaveClass(/hidden/)

    // Verify sidebar has flex on md breakpoint
    await expect(sidebar).toHaveClass(/md:flex/)

    // Verify sidebar width is approximately 200px
    const sidebarBox = await sidebar.boundingBox()
    expect(sidebarBox?.width).toBeGreaterThan(190)
    expect(sidebarBox?.width).toBeLessThan(210)
  })

  /**
   * P0-E2E-003: Footer optimizado sin "GMAO 2026" repetido (AC4)
   *
   * Given: Usuario autenticado en el sistema
   * When: Reviso el footer en todas las páginas autenticadas
   * Then: El footer muestra solo "powered by hiansa BSC"
   * And: El footer NO muestra "GMAO 2026" repetido
   * And: El footer NO está duplicado en el sidebar
   */
  test('P0-E2E-003: Footer optimizado sin redundancia', async ({ page }) => {
    await page.goto('/dashboard')

    // Check main footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('powered by hiansa BSC')

    // Verify "GMAO 2026" is NOT in footer
    await expect(footer.locator('text=GMAO 2026')).not.toBeVisible()

    // Verify footer is NOT in sidebar
    const sidebar = page.locator('aside[role="complementary"]')
    const sidebarFooter = sidebar.locator('p:has-text("powered by hiansa BSC")')
    await expect(sidebarFooter).not.toBeVisible()
  })

  /**
   * P0-E2E-004: Layout por dirección correcto en dashboard, kanban, kpis (AC5)
   *
   * Given: Usuario autenticado en el sistema
   * When: Navego a diferentes páginas
   * Then: Cada página usa el sidebar variant correcto
   * And: /dashboard usa variant default (256px) per AC2
   * And: /kpis usa variant mini (160px)
   * And: /kanban usa variant compact (200px)
   */
  test('P0-E2E-004: Layout por dirección correcto en dashboard, kpis, kanban', async ({ page }) => {
    // Test dashboard with default variant (256px) per AC2
    await page.goto('/dashboard')

    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar).toBeVisible()

    // Dashboard uses default variant (256px) per AC2 spec
    await expect(sidebar).toHaveClass(/w-64/) // 256px - AC2 allows dashboard to use default

    // Verify main content margin matches sidebar width
    const mainContent = page.locator('.flex-1')
    await expect(mainContent).toHaveClass(/ml-64/) // margin-left for 256px sidebar

    // Test kpis page with mini variant (160px)
    await page.goto('/kpis')

    const kpisSidebar = page.locator('aside[role="complementary"]')
    await expect(kpisSidebar).toBeVisible()

    // KPIs should use mini variant (160px)
    await expect(kpisSidebar).toHaveClass(/w-40/) // 160px

    // Verify main content margin matches sidebar width
    const kpisMainContent = page.locator('.flex-1')
    await expect(kpisMainContent).toHaveClass(/ml-40/) // margin-left for 160px sidebar

    // Test kanban page with compact variant (200px)
    await page.goto('/kanban')

    const kanbanSidebar = page.locator('aside[role="complementary"]')
    await expect(kanbanSidebar).toBeVisible()

    // Kanban uses compact variant (200px)
    await expect(kanbanSidebar).toHaveClass(/w-52/) // 200px

    // Verify main content margin matches sidebar width
    const kanbanMainContent = page.locator('.flex-1')
    await expect(kanbanMainContent).toHaveClass(/ml-52/) // margin-left for 200px sidebar
  })

  /**
   * P1-E2E-001: Responsive en mobile, tablet, desktop (AC2, AC5)
   *
   * Given: Usuario autenticado en el sistema
   * When: Pruebo en diferentes tamaños de pantalla
   * Then: El layout es responsive en mobile (<768px)
   * And: El layout es responsive en tablet (768px-1200px)
   * And: El layout es responsive en desktop (>1200px)
   */
  test('P1-E2E-001: Responsive en mobile, tablet, desktop', async ({ page }) => {
    await page.goto('/dashboard')

    // Mobile viewport (375px - iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 })
    const sidebarMobile = page.locator('aside[role="complementary"]')

    // Sidebar should be hidden on mobile
    await expect(sidebarMobile).not.toBeVisible()

    // Logo should still be visible
    await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Tablet viewport (768px - iPad)
    await page.setViewportSize({ width: 768, height: 1024 })
    const sidebarTablet = page.locator('aside[role="complementary"]')

    // Sidebar should be visible on tablet
    await expect(sidebarTablet).toBeVisible()

    // Desktop viewport (1920px - Full HD)
    await page.setViewportSize({ width: 1920, height: 1080 })
    const sidebarDesktop = page.locator('aside[role="complementary"]')

    // Sidebar should be visible on desktop
    await expect(sidebarDesktop).toBeVisible()

    // Verify sidebar width on desktop
    await expect(sidebarDesktop).toHaveClass(/w-52/) // 200px compact

    // Verify layout is properly aligned
    const header = page.locator('header')
    const headerBox = await header.boundingBox()
    const sidebarBox = await sidebarDesktop.boundingBox()

    expect(headerBox?.x).toBe(0) // Header starts at left edge
    expect(sidebarBox?.x).toBe(0) // Sidebar starts at left edge
  })

  /**
   * P1-E2E-002: Branding consistente sin redundancia (AC3)
   *
   * Given: Usuario autenticado en el sistema
   * When: Reviso el header y sidebar
   * Then: El header muestra solo Logo Hiansa (NO texto "GMAO Hiansa")
   * And: El sidebar muestra solo texto "GMAO" (NO "Hiansa" duplicado)
   * And: No hay instancias de "GMAO Hiansa" repetido
   */
  test('P1-E2E-002: Branding consistente sin redundancia', async ({ page }) => {
    await page.goto('/dashboard')

    // Check header has logo but NO "GMAO Hiansa" text
    const header = page.locator('header')
    await expect(header.locator('svg[aria-label="Hiansa Logo"]')).toBeVisible()
    await expect(header.locator('text=GMAO Hiansa')).not.toBeVisible()

    // Check sidebar has only "GMAO" text (NOT "Hiansa")
    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar.locator('text=GMAO')).toBeVisible()
    await expect(sidebar.locator('text=Hiansa')).not.toBeVisible()

    // Verify no "GMAO Hiansa" anywhere on page
    const pageContent = page.locator('body')
    await expect(pageContent.locator('text=GMAO Hiansa')).not.toBeVisible()
  })

  /**
   * P2-E2E-001: Navegación entre páginas mantiene layout consistente
   *
   * Given: Usuario autenticado en el sistema
   * When: Navego entre diferentes páginas
   * Then: El layout se mantiene consistente
   * And: El logo siempre está visible en el header
   * And: El footer siempre muestra "powered by hiansa BSC"
   * And: El sidebar variant es correcto para cada página
   */
  test('P2-E2E-001: Navegación entre páginas mantiene layout consistente', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard')
    await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Navigate to assets page
    await page.click('a[href="/assets"]')
    await page.waitForURL('**/assets')
    await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Navigate to usuarios page
    await page.click('a[href="/usuarios"]')
    await page.waitForURL('**/usuarios')
    await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Navigate back to dashboard
    await page.click('a[href="/dashboard"]')
    await page.waitForURL('**/dashboard')
    await expect(page.locator('header svg[aria-label="Hiansa Logo"]')).toBeVisible()

    // Verify footer is consistent across all pages
    const footer = page.locator('footer')
    await expect(footer).toContainText('powered by hiansa BSC')
  })
})

test.describe.skip('Story 1.5: Layout Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  /**
   * Accessibility: Logo tiene alt text correcto
   *
   * Given: Usuario autenticado en el sistema
   * When: Inspecciono el logo Hiansa
   * Then: El logo tiene aria-label="Hiansa Logo"
   * And: El logo tiene role="img"
   */
  test('a11y: Logo tiene alt text "Hiansa Logo"', async ({ page }) => {
    await page.goto('/dashboard')

    const logo = page.locator('header svg')
    await expect(logo).toHaveAttribute('aria-label', 'Hiansa Logo')
    await expect(logo).toHaveAttribute('role', 'img')
  })

  /**
   * Accessibility: Sidebar tiene navigation landmarks
   *
   * Given: Usuario autenticado en el sistema
   * When: Inspecciono el sidebar
   * Then: El sidebar tiene role="complementary"
   * And: La navegación dentro del sidebar tiene landmarks apropiados
   */
  test('a11y: Sidebar tiene navigation landmarks', async ({ page }) => {
    await page.goto('/dashboard')

    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar).toBeVisible()

    // Check for navigation element within sidebar
    const nav = sidebar.locator('nav')
    await expect(nav).toBeVisible()
  })

  /**
   * Accessibility: Footer tiene semantic HTML
   *
   * Given: Usuario autenticado en el sistema
   * When: Inspecciono el footer
   * Then: El footer usa etiqueta <footer>
   */
  test('a11y: Footer tiene semantic HTML <footer>', async ({ page }) => {
    await page.goto('/dashboard')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  /**
   * Accessibility: Header tiene semantic HTML
   *
   * Given: Usuario autenticado en el sistema
   * When: Inspecciono el header
   * Then: El header usa etiqueta <header>
   */
  test('a11y: Header tiene semantic HTML <header>', async ({ page }) => {
    await page.goto('/dashboard')

    const header = page.locator('header')
    await expect(header).toBeVisible()
  })
})
