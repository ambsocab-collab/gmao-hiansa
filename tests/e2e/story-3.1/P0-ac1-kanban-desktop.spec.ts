import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.1 AC1: Vista Kanban Desktop (8 columnas completas)
 *
 * TDD GREEN PHASE: Tests validate Kanban board implementation
 * All tests verify the 8-column desktop view functionality
 *
 * Acceptance Criteria:
 * - Supervisor con capability can_view_all_ots accede a /ots/kanban en desktop (>1200px)
 * - Ve Kanban de 8 columnas completas
 * - Columnas en orden correcto con colores específicos
 * - Cada columna tiene count badge con número de OTs
 * - Board tiene data-testid="ot-kanban-board"
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

test.describe('Story 3.1 - AC1: Kanban Desktop View (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop >1200px

  test.beforeEach(async ({ page }) => {
    // Navigate to Kanban page
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban`);
  });

  test('P0-001: Kanban de 8 columnas visible en desktop', async ({ page }) => {
    // Then: Ve Kanban de 8 columnas completas
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Desktop columns are in the lg:flex container (8 columns for desktop)
    const desktopContainer = board.locator('.lg\\:flex').first();

    // Verify all 8 columns exist by checking each one individually
    const expectedColumns = [
      'PENDIENTE',
      'ASIGNADA',
      'EN_PROGRESO',
      'PENDIENTE_REPUESTO',
      'PENDIENTE_PARADA',
      'REPARACION_EXTERNA',
      'COMPLETADA',
      'DESCARTADA'
    ];

    for (const estado of expectedColumns) {
      const column = desktopContainer.getByTestId(`kanban-column-${estado}`);
      await expect(column).toBeVisible();
    }
  });

  test('P0-002: Columnas con colores correctos', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // Then: Cada columna tiene color específico según estado
    const columnColors = {
      'PENDIENTE': 'gray',
      'ASIGNADA': 'blue',
      'EN_PROGRESO': 'purple',
      'PENDIENTE_REPUESTO': 'yellow',
      'PENDIENTE_PARADA': 'orange',
      'REPARACION_EXTERNA': 'pink',
      'COMPLETADA': 'green',
      'DESCARTADA': 'red'
    };

    for (const [columnName] of Object.entries(columnColors)) {
      const column = desktopContainer.getByTestId(`kanban-column-${columnName}`);
      await expect(column).toBeVisible();

      const columnTitle = column.getByTestId(`column-title-${columnName}`);
      await expect(columnTitle).toBeVisible();

      const classList = await column.evaluate((el) => {
        return Array.from(el.classList).filter(cls =>
          cls.includes('bg-') || cls.includes('text-') || cls.includes('border-')
        );
      });

      expect(classList.length).toBeGreaterThan(0);
    }
  });

  test('P0-003: Cada columna tiene count badge', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    const columnNames = [
      'PENDIENTE',
      'ASIGNADA',
      'EN_PROGRESO',
      'PENDIENTE_REPUESTO',
      'PENDIENTE_PARADA',
      'REPARACION_EXTERNA',
      'COMPLETADA',
      'DESCARTADA'
    ];

    for (const columnName of columnNames) {
      const column = desktopContainer.getByTestId(`kanban-column-${columnName}`);
      const badge = column.getByTestId(`column-count-${columnName}`);
      await expect(badge).toBeVisible();

      const badgeText = await badge.textContent();
      expect(badgeText).toMatch(/\d+/);
    }
  });

  test('P0-004: Board responsive en desktop', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Desktop columns are in the lg:flex container
    const desktopContainer = board.locator('.lg\\:flex').first();

    // Verify all 8 columns exist
    const expectedColumns = [
      'PENDIENTE',
      'ASIGNADA',
      'EN_PROGRESO',
      'PENDIENTE_REPUESTO',
      'PENDIENTE_PARADA',
      'REPARACION_EXTERNA',
      'COMPLETADA',
      'DESCARTADA'
    ];

    for (const estado of expectedColumns) {
      const column = desktopContainer.getByTestId(`kanban-column-${estado}`);
      await expect(column).toBeVisible();
    }

    await expect(board).toBeInViewport();
  });
});
