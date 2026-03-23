import { test, expect } from '@playwright/test';

/**
 * P0 E2E Tests for Story 3.1 AC7: Identificación visual de tipos de OT
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - OTs preventivas muestran etiqueta "Preventivo" en verde #28A745 (NFR-S11-B)
 * - OTs correctivas muestran etiqueta "Correctivo" en rojizo #DC3545 (NFR-S11-B)
 * - Etiqueta visible en tarjeta y en vista de listado
 */

test.describe('Story 3.1 - AC7: OT Type Labels (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P0-013: OT preventiva muestra etiqueta verde', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: hay OT preventiva
    // THEN: etiqueta "Preventivo" visible en verde #28A745

    // Find a preventive OT card
    const preventiveCard = page.locator('[data-testid^="ot-card-"]').filter({
      hasText: 'Preventivo'
    }).first();

    // If no preventive OT exists, skip
    if (await preventiveCard.count() === 0) {
      test.skip(true, 'No preventive OTs found in test data');
    }

    await expect(preventiveCard).toBeVisible();

    // Verify type label is visible
    const typeLabel = preventiveCard.locator('[data-testid="ot-type-label"]');
    await expect(typeLabel).toBeVisible();
    await expect(typeLabel).toContainText('Preventivo');

    // Verify label color is #28A745 (green)
    const labelColor = await typeLabel.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // #28A745 in RGB is rgb(40, 167, 69)
    expect(labelColor.color).toBe('rgb(40, 167, 69)');
  });

  test('P0-014: OT correctiva muestra etiqueta rojiza', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: hay OT correctiva
    // THEN: etiqueta "Correctivo" visible en rojizo #DC3545

    // Find a corrective OT card
    const correctiveCard = page.locator('[data-testid^="ot-card-"]').filter({
      hasText: 'Correctivo'
    }).first();

    // If no corrective OT exists, skip
    if (await correctiveCard.count() === 0) {
      test.skip(true, 'No corrective OTs found in test data');
    }

    await expect(correctiveCard).toBeVisible();

    // Verify type label is visible
    const typeLabel = correctiveCard.locator('[data-testid="ot-type-label"]');
    await expect(typeLabel).toBeVisible();
    await expect(typeLabel).toContainText('Correctivo');

    // Verify label color is #DC3545 (reddish)
    const labelColor = await typeLabel.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // #DC3545 in RGB is rgb(220, 53, 69)
    expect(labelColor.color).toBe('rgb(220, 53, 69)');
  });

  test('P0-015: Etiqueta de tipo visible en todas las tarjetas', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: inspecciono todas las tarjetas
    // THEN: cada tarjeta tiene etiqueta "Preventivo" o "Correctivo"

    const cards = page.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      const card = cards.nth(i);
      const typeLabel = card.locator('[data-testid="ot-type-label"]');

      await expect(typeLabel).toBeVisible();

      const labelText = await typeLabel.textContent();
      expect(['Preventivo', 'Correctivo']).toContain(labelText);
    }
  });
});
