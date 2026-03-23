import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.1 AC7: Identificación visual de tipos de OT
 *
 * TDD GREEN PHASE: Tests validate OT type labels with correct colors
 * All tests verify type badges are visible and properly colored
 *
 * Acceptance Criteria:
 * - OTs preventivas muestran etiqueta "Preventivo" en verde (NFR-S11-B)
 * - OTs correctivas muestran etiqueta "Correctivo" en rojizo (NFR-S11-B)
 * - Etiqueta visible en tarjeta y en vista de listado
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

test.describe('Story 3.1 - AC7: OT Type Labels (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop >1200px

  test.beforeEach(async ({ page }) => {
    // Navigate to Kanban page
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban`);
  });

  test('P0-013: OT preventiva muestra etiqueta verde', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: hay OT preventiva
    // THEN: etiqueta "Preventivo" visible en verde

    // Find all type badges that say "Preventivo"
    const preventiveBadges = desktopContainer.locator('[data-testid^="ot-tipo-"]').filter({
      hasText: 'Preventivo'
    });

    // If no preventive OT exists, skip
    if (await preventiveBadges.count() === 0) {
      test.skip(true, 'No preventive OTs found in test data');
    }

    // Get the first preventive badge
    const firstBadge = preventiveBadges.first();
    await expect(firstBadge).toBeVisible();
    await expect(firstBadge).toContainText('Preventivo');

    // Verify badge has green color (bg-green-100 text-green-700)
    const badgeColor = await firstBadge.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Green colors (text-green-700 is rgb(21, 128, 61))
    const isGreen = badgeColor.color === 'rgb(21, 128, 61)' || badgeColor.color === 'rgb(22, 101, 52)';
    expect(isGreen).toBe(true);
  });

  test('P0-014: OT correctiva muestra etiqueta rojiza', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: hay OT correctiva
    // THEN: etiqueta "Correctivo" visible en rojizo

    // Find all type badges that say "Correctivo"
    const correctiveBadges = desktopContainer.locator('[data-testid^="ot-tipo-"]').filter({
      hasText: 'Correctivo'
    });

    // If no corrective OT exists, skip
    if (await correctiveBadges.count() === 0) {
      test.skip(true, 'No corrective OTs found in test data');
    }

    // Get the first corrective badge
    const firstBadge = correctiveBadges.first();
    await expect(firstBadge).toBeVisible();
    await expect(firstBadge).toContainText('Correctivo');

    // Verify badge has red color (bg-red-100 text-red-700)
    const badgeColor = await firstBadge.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Red colors (text-red-700 is rgb(185, 28, 28))
    const isRed = badgeColor.color === 'rgb(185, 28, 28)' || badgeColor.color === 'rgb(220, 38, 38)';
    expect(isRed).toBe(true);
  });

  test('P0-015: Etiqueta de tipo visible en todas las tarjetas', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: inspecciono todas las tarjetas
    // THEN: cada tarjeta tiene etiqueta "Preventivo" o "Correctivo"

    const cards = desktopContainer.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    // Check first 10 cards
    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      const card = cards.nth(i);

      // Get workOrderId from the card
      const testId = await card.getAttribute('data-testid');
      const workOrderId = testId?.replace('ot-card-', '');

      // Verify type badge exists and is visible
      const typeBadge = card.getByTestId(`ot-tipo-${workOrderId}`);
      await expect(typeBadge).toBeVisible();

      const labelText = await typeBadge.textContent();
      expect(['Preventivo', 'Correctivo', 'PREVENTIVO', 'CORRECTIVO']).toContain(labelText?.trim());
    }
  });
});
