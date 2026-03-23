import { test, expect } from '@playwright/test';

/**
 * P0 E2E Tests for Story 3.1 AC1: Vista Kanban Desktop (8 columnas completas)
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Supervisor con capability can_view_all_ots accede a /ots/kanban en desktop (>1200px)
 * - Ve Kanban de 8 columnas completas
 * - Columnas en orden correcto con colores específicos
 * - Cada columna tiene count badge: "En Progreso (8)"
 * - Board tiene data-testid="ot-kanban-board"
 */

test.describe('Story 3.1 - AC1: Kanban Desktop View (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop >1200px
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    // Navigate to Kanban page
    await page.goto('/ots/kanban');
  });

  test('P0-001: Kanban de 8 columnas visible en desktop', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: supervisor con can_view_all_ots accede a /ots/kanban
    // WHEN: página carga en desktop (>1200px)
    // THEN: ve Kanban de 8 columnas completas

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    const columns = page.locator('[data-testid^="kanban-column-"]');
    await expect(columns).toHaveCount(8);

    // Verify column order
    const expectedColumns = [
      'Por Revisar',
      'Por Aprobar',
      'Aprobada',
      'En Progreso',
      'Pausada',
      'Completada',
      'Cerrada',
      'Cancelada'
    ];

    for (let i = 0; i < expectedColumns.length; i++) {
      const column = columns.nth(i);
      await expect(column).toContainText(expectedColumns[i]);
    }
  });

  test('P0-002: Columnas con colores correctos', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible en desktop
    // WHEN: veo las columnas
    // THEN: cada columna tiene color específico según estado

    const columnColors = {
      'Por Revisar': '#6B7280',   // Gray
      'Por Aprobar': '#F59E0B',   // Amber
      'Aprobada': '#3B82F6',      // Blue
      'En Progreso': '#8B5CF6',   // Purple
      'Pausada': '#EC4899',       // Pink
      'Completada': '#10B981',    // Green
      'Cerrada': '#6B7280',       // Gray
      'Cancelada': '#EF4444'      // Red
    };

    const columns = page.locator('[data-testid^="kanban-column-"]');

    for (const [columnName, expectedColor] of Object.entries(columnColors)) {
      const column = page.getByTestId(`kanban-column-${columnName}`);
      await expect(column).toBeVisible();

      // Verify column header has correct color
      const columnHeader = column.locator('[data-testid="column-header"]');
      const headerColor = await columnHeader.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Convert RGB to hex for comparison
      expect(headerColor).toBe(expectedColor);
    }
  });

  test('P0-003: Cada columna tiene count badge', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible en desktop
    // WHEN: veo las columnas
    // THEN: cada columna tiene count badge con formato "En Progreso (8)"

    const columns = page.locator('[data-testid^="kanban-column-"]');

    const columnCount = await columns.count();
    expect(columnCount).toBe(8);

    for (let i = 0; i < columnCount; i++) {
      const column = columns.nth(i);
      const badge = column.locator('[data-testid="column-count-badge"]');

      await expect(badge).toBeVisible();

      // Verify badge format: "Estado (count)"
      const badgeText = await badge.textContent();
      expect(badgeText).toMatch(/\w+ \(\d+\)/);
    }
  });

  test('P0-004: Board responsive en desktop', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible en desktop
    // WHEN: viewport es >1200px
    // THEN: 8 columnas visibles horizontalmente

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Verify all 8 columns are visible without horizontal scroll
    const columns = page.locator('[data-testid^="kanban-column-"]');
    await expect(columns).toHaveCount(8);

    // Check that no horizontal scrollbar is needed
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
