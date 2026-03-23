import { test, expect } from '@playwright/test';

/**
 * P1 E2E Tests for Story 3.1 AC6: Modal de acciones en móvil
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Móvil: touch en OT card abre modal (no drag & drop)
 * - Modal tiene botones: "Iniciar", "Completar", "Ver Detalles"
 * - Puede cambiar estado desde el modal
 */

test.describe('Story 3.1 - AC6: Mobile Modal (P1)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P1-009: Touch en OT card abre modal en móvil', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Vista móvil con OT cards
    // WHEN: toco una OT card
    // THEN: modal de detalles se abre (no drag & drop en móvil)

    const card = page.locator('[data-testid^="ot-card-"]').first();
    await expect(card).toBeVisible();

    // Tap on card
    await card.tap();

    // Modal should open
    const modal = page.getByTestId('ot-details-modal');
    await expect(modal).toBeVisible();
  });

  test('P1-010: Modal tiene botones de acción', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Modal abierto en móvil
    // WHEN: veo botones disponibles
    // THEN: botones "Iniciar", "Completar", "Ver Detalles" visibles

    const card = page.locator('[data-testid^="ot-card-"]').first();
    await card.tap();

    const modal = page.getByTestId('ot-details-modal');
    await expect(modal).toBeVisible();

    // Verify action buttons
    const startButton = page.getByTestId('modal-btn-iniciar');
    await expect(startButton).toBeVisible();
    await expect(startButton).toContainText('Iniciar');

    const completeButton = page.getByTestId('modal-btn-completar');
    await expect(completeButton).toBeVisible();
    await expect(completeButton).toContainText('Completar');

    const detailsButton = page.getByTestId('modal-btn-ver-detalles');
    await expect(detailsButton).toBeVisible();
    await expect(detailsButton).toContainText('Ver Detalles');
  });

  test('P1-011: Cambiar estado desde modal en móvil', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Modal abierto con OT en estado inicial
    // WHEN: presiono "Iniciar"
    // THEN: estado cambia a "En Progreso" y modal se cierra

    const card = page.locator('[data-testid^="ot-card-"]').first();
    const otId = await card.getAttribute('data-testid');

    // Open modal
    await card.tap();

    // Click "Iniciar" button
    const startButton = page.getByTestId('modal-btn-iniciar');
    await startButton.tap();

    // Modal should close
    const modal = page.getByTestId('ot-details-modal');
    await expect(modal).not.toBeVisible();

    // OT should move to "En Progreso" column
    const targetColumn = page.getByTestId('kanban-column-En Progreso');
    const movedCard = targetColumn.locator(`[data-testid="${otId}"]`);

    // May need to scroll to find the column
    await page.waitForTimeout(500);
    await expect(movedCard).toBeVisible();
  });
});
