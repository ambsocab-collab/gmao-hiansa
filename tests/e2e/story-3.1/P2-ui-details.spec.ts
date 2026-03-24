import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P2 E2E Tests for Story 3.1 - UI Polish Details
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Tests:
 * - Count badges por columna: "En Progreso (8)"
 * - Panel lateral KPIs colapsable visible
 * - Indicador de columnas visibles: "1-2 de 8" (tablet)
 * - Toggle Kanban ↔ Listado data-testid="vista-toggle"
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

test.describe('Story 3.1 - P2: UI Details', () => {
  test.describe('Desktop - Count Badges', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('P2-001: Count badges por columna', async ({ page }) => {

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/kanban`);

      const columns = page.locator('[data-testid^="kanban-column-"]');

      // Check first visible column has count badge
      const firstColumn = columns.first();
      const badge = firstColumn.locator('[data-testid^="column-count-"]');

      await expect(badge).toBeVisible();

      // Verify badge shows a number
      const badgeText = await badge.textContent();
      expect(badgeText).toMatch(/\d+/);
      console.log(`First column count badge shows: ${badgeText}`);
    });

    test('P2-002: Panel lateral KPIs visible', async ({ page }) => {
      test.skip(true, 'Feature not implemented - KPI panel does not exist in current implementation');

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/kanban`);

      const kpiPanel = page.getByTestId('kpi-panel');
      await expect(kpiPanel).toBeVisible();

      // Verify KPIs are displayed
      const totalOTs = kpiPanel.getByTestId('kpi-total-ots');
      await expect(totalOTs).toBeVisible();

      const inProgress = kpiPanel.getByTestId('kpi-in-progress');
      await expect(inProgress).toBeVisible();

      const completed = kpiPanel.getByTestId('kpi-completed');
      await expect(completed).toBeVisible();
    });
  });

  test.describe('Tablet - Column Indicator', () => {
    test.use({ viewport: { width: 900, height: 720 } });

    test('P2-003: Indicador de columnas visibles "1-2 de 8"', async ({ page }) => {
      test.skip(true, 'Feature not implemented - Column indicator does not exist in current implementation');

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/kanban`);

      const indicator = page.getByTestId('column-indicator');
      await expect(indicator).toBeVisible();
      await expect(indicator).toContainText('1-2 de 8');

      // Swipe to next columns
      const board = page.getByTestId('ot-kanban-board');
      await board.evaluate((el) => {
        el.scrollBy({ left: 500, behavior: 'smooth' });
      });

      await page.waitForTimeout(500);

      // Indicator should update to "3-4 de 8"
      await expect(indicator).toContainText('3-4 de 8');
    });
  });

  test.describe('Desktop - Toggle Test ID', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('P2-004: Toggle tiene data-testid="vista-toggle"', async ({ page }) => {

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/kanban`);

      const toggle = page.getByTestId('vista-toggle');
      await expect(toggle).toBeVisible();

      // Verify the element exists in DOM
      const testId = await toggle.getAttribute('data-testid');
      expect(testId).toBe('vista-toggle');
    });
  });
});
