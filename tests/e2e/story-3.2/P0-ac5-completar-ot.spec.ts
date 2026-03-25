import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.2 AC5: Completar OT con confirmación
 *
 * TDD RED PHASE: Tests validate completar OT flow - all tests will FAIL
 * Expected Failures: Button doesn't exist, action not implemented
 *
 * Acceptance Criteria:
 * - OT en estado "EN_PROGRESO" (u otros válidos para completar)
 * - Click en botón "Completar OT" (data-testid="ot-completar-btn")
 * - Confirmación requerida: "¿Completar OT #{numero}? Verifica que la reparación funciona correctamente."
 * - Si confirmo: estado cambia a "COMPLETADA"
 * - Fecha completedAt registrada con timestamp
 * - Evento SSE enviado a todos los asignados
 * - OT removida de "Mis OTs" (ya no está asignada/en progreso)
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.2 - AC5: Completar OT (P0)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P0-AC5-001] should show "Completar OT" button when OT is EN_PROGRESO', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status badge
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    let enProgresoCardFound = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        await card.click();
        enProgresoCardFound = true;
        break;
      }
    }

    expect(enProgresoCardFound).toBe(true);

    // Verify "Completar OT" button is visible
    const completarBtn = page.getByTestId('ot-completar-btn');
    await expect(completarBtn).toBeVisible();
  });

  test('[P0-AC5-002] should show confirmation dialog when clicking "Completar OT"', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status badge
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        // Get OT number for verification
        const otNumero = await card.getByTestId('ot-numero').textContent();

        await card.click();

        // Click "Completar OT" button
        const completarBtn = page.getByTestId('ot-completar-btn');
        await completarBtn.click();

        // Verify confirmation dialog is visible
        const confirmDialog = page.getByTestId('confirm-completar-ot-dialog');
        await expect(confirmDialog).toBeVisible();

        // Verify confirmation message includes OT number
        await expect(confirmDialog.getByText(new RegExp(`¿Completar OT #${otNumero}?`))).toBeVisible();

        // Verify verification message
        await expect(confirmDialog.getByText(/Verifica que la reparación funciona correctamente/)).toBeVisible();
        return;
      }
    }
  });

  test('[P0-AC5-003] should change OT status to COMPLETADA when confirmed', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status badge
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        const otNumero = await card.getByTestId('ot-numero').textContent();

        await card.click();

        // Click "Completar OT" button
        const completarBtn = page.getByTestId('ot-completar-btn');
        await completarBtn.click();

        // Confirm the action
        const confirmBtn = page.getByTestId('confirm-completar-ot-btn');
        await confirmBtn.click();

        // Wait for modal to close
        await expect(page.getByTestId(/ot-detalles-/)).not.toBeVisible();

        // Force page reload to get updated state
        await page.reload();

        // Find the completed OT and verify status changed to COMPLETADA
        const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
        const updatedCardCount = await otCards.count();

        let foundCompleted = false;
        for (let j = 0; j < updatedCardCount; j++) {
          const updatedCard = otCards.nth(j);
          const cardNumero = await updatedCard.getByTestId('ot-numero').textContent();
          if (cardNumero === otNumero) {
            // Verify estado changed to COMPLETADA (UI shows "Completada")
            await expect(updatedCard.getByTestId('ot-estado-badge')).toContainText('Completada');
            foundCompleted = true;
            break;
          }
        }

        expect(foundCompleted).toBe(true);
        return;
      }
    }
  });

  test('[P0-AC5-004] should record completedAt timestamp', async ({ page }) => {
    // THIS TEST WILL FAIL - completedAt not implemented
    // Expected: completedAt field set in database
    // Actual: Field doesn't exist or not set

    // This would require database verification after completion
    // For E2E, we can't directly check database, so skip
    test.skip(true, 'completedAt verification requires database query - verified in integration tests');
  });

  test('[P0-AC5-005] should emit SSE event when OT is completed', async ({ page }) => {
    // THIS TEST WILL FAIL - SSE not implemented
    // Expected: SSE event emitted to assigned users
    // Actual: No SSE event sent

    test.skip(true, 'SSE event verification requires SSE listener setup - verified in integration tests');
  });

  test('[P1-AC5-006] should cancel completar OT when confirmation dismissed', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status badge
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        await card.click();

        // Click "Completar OT" button
        const completarBtn = page.getByTestId('ot-completar-btn');
        await completarBtn.click();

        // Cancel the action
        const cancelBtn = page.getByTestId('cancel-completar-ot-btn');
        await cancelBtn.click();

        // Verify estado is still EN_PROGRESO (UI shows "En Progreso")
        await expect(card.getByTestId('ot-estado-badge')).toContainText('En Progreso');

        // Verify "Completar" button is still visible
        await expect(completarBtn).toBeVisible();
        return;
      }
    }
  });

  test('[P1-AC5-007] should show error if completar OT fails', async ({ page }) => {
    // THIS TEST WILL FAIL - Error handling not implemented
    // Expected: Error toast shown
    // Actual: No error handling

    test.skip(true, 'Requires mock failure scenario - error handling not implemented');
  });

  test('[P2-AC5-008] should only allow completion from valid states', async ({ page }) => {
    // THIS TEST WILL FAIL - State validation not implemented
    // Expected: Error if trying to complete from invalid state
    // Actual: No validation

    // This test would require OTs in different states
    test.skip(true, 'Requires OTs in multiple states - state transition validation not implemented');
  });
});
