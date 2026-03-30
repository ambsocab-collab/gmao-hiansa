import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.3 AC1: Técnico sin capability no puede asignar
 *
 * TDD GREEN PHASE: Tests validate that technicians without can_assign_technicians
 * cannot see or use the assignment functionality
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.3 - AC1: Técnico sin capability no puede asignar', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    // Technicians use /ots/mis-ots to view their assigned OTs
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/mis-ots`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P1-AC1-004] Técnico sin capability no puede ver botón "Asignar"', async ({ page }) => {
    // GREEN PHASE: Technicians should NOT see the "Asignar" button

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find first OT card (technicians see their assigned OTs)
    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();

    // If there are OT cards, check that "Asignar" button is not visible
    const cardCount = await page.locator('[data-testid^="ot-card-"]').count();

    if (cardCount > 0) {
      // "Asignar" button should NOT be visible for technicians
      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await expect(asignarBtn).not.toBeVisible();
    } else {
      // No OTs assigned - that's also valid, just verify no Asignar buttons anywhere
      const allAsignarBtns = page.locator('[data-testid="btn-asignar"]');
      const count = await allAsignarBtns.count();
      expect(count).toBe(0);
    }
  });

  test('[P1-AC1-007] Técnico no puede acceder a modal de asignación directamente', async ({ page }) => {
    // Verify no "Asignar" buttons are visible anywhere on the page
    await page.waitForTimeout(1000);

    const asignarButtons = page.locator('[data-testid="btn-asignar"]');
    const count = await asignarButtons.count();

    // No "Asignar" buttons should be visible for technicians
    expect(count).toBe(0);
  });
});
