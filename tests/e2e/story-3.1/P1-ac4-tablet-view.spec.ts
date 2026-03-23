import { test, expect } from '@playwright/test';

/**
 * P1 E2E Tests for Story 3.1 AC4: Vista optimizada para Tablet
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Tablet (768-1200px): 2 columnas visibles con swipe horizontal
 * - Indicador: "1-2 de 8" mostrando columnas visibles
 * - Panel lateral KPIs colapsable visible
 */

test.describe('Story 3.1 - AC4: Tablet View (P1)', () => {
  test.use({ viewport: { width: 900, height: 720 } }); // Tablet 768-1200px
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P1-001: Tablet muestra 2 columnas visibles', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: accedo a /ots/kanban en tablet (768-1200px)
    // WHEN: página carga
    // THEN: veo 2 columnas visibles horizontalmente

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Should show exactly 2 columns
    const visibleColumns = page.locator('[data-testid^="kanban-column-"]:visible');
    await expect(visibleColumns).toHaveCount(2);

    // Verify first two columns are visible
    await expect(page.getByTestId('kanban-column-Por Revisar')).toBeVisible();
    await expect(page.getByTestId('kanban-column-Por Aprobar')).toBeVisible();
  });

  test('P1-002: Swipe horizontal para ver más columnas', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: 2 columnas visibles en tablet
    // WHEN: hago swipe horizontal
    // THEN: veo siguientes 2 columnas

    const board = page.getByTestId('ot-kanban-board');

    // Initially showing columns 1-2
    await expect(page.getByTestId('kanban-column-Por Revisar')).toBeVisible();
    await expect(page.getByTestId('kanban-column-Por Aprobar')).toBeVisible();

    // Swipe left to see columns 3-4
    await board.evaluate((el) => {
      el.scrollBy({ left: 500, behavior: 'smooth' });
    });

    // Wait for scroll animation
    await page.waitForTimeout(500);

    // Now showing columns 3-4 (Aprobada, En Progreso)
    await expect(page.getByTestId('kanban-column-Aprobada')).toBeVisible();
    await expect(page.getByTestId('kanban-column-En Progreso')).toBeVisible();
  });

  test('P1-003: Indicador de columnas visibles', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Tablet con 2 columnas visibles
    // WHEN: veo indicador
    // THEN: muestra "1-2 de 8"

    const indicator = page.getByTestId('column-indicator');
    await expect(indicator).toBeVisible();
    await expect(indicator).toContainText('1-2 de 8');
  });

  test('P1-004: Panel lateral KPIs colapsable visible', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Vista tablet
    // WHEN: veo panel lateral
    // THEN: KPIs panel colapsable visible

    const kpiPanel = page.getByTestId('kpi-panel');
    await expect(kpiPanel).toBeVisible();

    // Verify collapse button
    const collapseButton = page.getByTestId('kpi-panel-collapse');
    await expect(collapseButton).toBeVisible();

    // Collapse the panel
    await collapseButton.click();

    // Verify panel is collapsed
    await expect(kpiPanel).toHaveClass(/collapsed/);
  });
});
