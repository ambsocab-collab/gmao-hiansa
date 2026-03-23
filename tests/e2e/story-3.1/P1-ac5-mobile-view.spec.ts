import { test, expect } from '@playwright/test';

/**
 * P1 E2E Tests for Story 3.1 AC5: Vista Mobile First optimizada
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Móvil (<768px): 1 columna visible con swipe horizontal
 * - OT cards simplificadas (menos información, más grande para tapping)
 * - Touch targets de 44x44px mínimo (NFR-A3)
 */

test.describe('Story 3.1 - AC5: Mobile View (P1)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile iPhone SE
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P1-005: Móvil muestra 1 columna visible', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: accedo a /ots/kanban en móvil (<768px)
    // WHEN: página carga
    // THEN: veo 1 columna visible

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Should show exactly 1 column
    const visibleColumns = page.locator('[data-testid^="kanban-column-"]:visible');
    await expect(visibleColumns).toHaveCount(1);

    // Verify first column is visible
    await expect(page.getByTestId('kanban-column-Por Revisar')).toBeVisible();
  });

  test('P1-006: Swipe horizontal en móvil', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: 1 columna visible en móvil
    // WHEN: hago swipe horizontal
    // THEN: veo siguiente columna

    const board = page.getByTestId('ot-kanban-board');

    // Initially showing column 1
    await expect(page.getByTestId('kanban-column-Por Revisar')).toBeVisible();

    // Swipe left
    await board.evaluate((el) => {
      el.scrollBy({ left: 400, behavior: 'smooth' });
    });

    await page.waitForTimeout(500);

    // Now showing column 2
    await expect(page.getByTestId('kanban-column-Por Aprobar')).toBeVisible();
  });

  test('P1-007: OT cards simplificadas en móvil', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Vista móvil
    // WHEN: veo tarjetas OT
    // THEN: información simplificada (menos detalles)

    const card = page.locator('[data-testid^="ot-card-"]').first();
    await expect(card).toBeVisible();

    // On mobile, cards should show simplified info
    const otNumber = card.locator('[data-testid="ot-number"]');
    await expect(otNumber).toBeVisible();

    const title = card.locator('[data-testid="ot-title"]');
    await expect(title).toBeVisible();

    // Some details should be hidden on mobile
    const technicians = card.locator('[data-testid="ot-technicians"]');
    await expect(technicians).not.toBeVisible();
  });

  test('P1-008: Touch targets >= 44x44px en móvil', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Vista móvil
    // WHEN: toco elementos interactivos
    // THEN: touch targets tienen mínimo 44x44px (NFR-A3)

    const card = page.locator('[data-testid^="ot-card-"]').first();
    await expect(card).toBeVisible();

    // Get card dimensions
    const box = await card.boundingBox();
    expect(box).toBeDefined();

    // Verify height >= 44px
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
