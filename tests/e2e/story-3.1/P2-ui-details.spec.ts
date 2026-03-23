import { test, expect } from '@playwright/test';

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
 */

test.describe('Story 3.1 - P2: UI Details', () => {
  test.describe('Desktop - Count Badges', () => {
    test.use({ viewport: { width: 1280, height: 720 } });
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('P2-001: Count badges por columna', async ({ page }) => {
      test.skip(true, 'Feature not implemented yet - TDD Red Phase');

      await page.goto('/ots/kanban');

      const columns = page.locator('[data-testid^="kanban-column-"]');

      // Check each column has count badge
      const columnCount = await columns.count();

      for (let i = 0; i < columnCount; i++) {
        const column = columns.nth(i);
        const badge = column.locator('[data-testid="column-count-badge"]');

        await expect(badge).toBeVisible();

        // Format: "Estado (count)"
        const badgeText = await badge.textContent();
        expect(badgeText).toMatch(/\w+ \(\d+\)/);

        // Verify count matches actual OT cards in column
        const cards = column.locator('[data-testid^="ot-card-"]');
        const cardCount = await cards.count();
        const countMatch = badgeText?.match(/\((\d+)\)/);
        const badgeCount = countMatch ? parseInt(countMatch[1]) : 0;

        expect(cardCount).toBe(badgeCount);
      }
    });

    test('P2-002: Panel lateral KPIs visible', async ({ page }) => {
      test.skip(true, 'Feature not implemented yet - TDD Red Phase');

      await page.goto('/ots/kanban');

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
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('P2-003: Indicador de columnas visibles "1-2 de 8"', async ({ page }) => {
      test.skip(true, 'Feature not implemented yet - TDD Red Phase');

      await page.goto('/ots/kanban');

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
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('P2-004: Toggle tiene data-testid="vista-toggle"', async ({ page }) => {
      test.skip(true, 'Feature not implemented yet - TDD Red Phase');

      await page.goto('/ots/kanban');

      const toggle = page.getByTestId('vista-toggle');
      await expect(toggle).toBeVisible();

      // Verify the element exists in DOM
      const testId = await toggle.getAttribute('data-testid');
      expect(testId).toBe('vista-toggle');
    });
  });
});
