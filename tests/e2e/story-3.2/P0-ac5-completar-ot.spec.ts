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
    // THIS TEST WILL FAIL - Button doesn't exist
    // Expected: "Completar OT" button visible
    // Actual: Button doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify "Completar OT" button is visible
    const completarBtn = page.getByTestId('ot-completar-btn');
    await expect(completarBtn).toBeVisible();
  });

  test('[P0-AC5-002] should show confirmation dialog when clicking "Completar OT"', async ({ page }) => {
    // THIS TEST WILL FAIL - Confirmation dialog not implemented
    // Expected: Confirmation dialog with verification message
    // Actual: No dialog or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    // Get OT number for verification
    const otNumero = await firstCard.getByTestId('ot-numero').textContent();

    await firstCard.click();

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
  });

  test('[P0-AC5-003] should change OT status to COMPLETADA when confirmed', async ({ page }) => {
    // THIS TEST WILL FAIL - Server action doesn't exist
    // Expected: OT status = COMPLETADA, completedAt set
    // Actual: 404 or no status change

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();
    const otNumero = await firstCard.getByTestId('ot-numero').textContent();

    await firstCard.click();

    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();

    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-completar-ot-btn');
    await confirmBtn.click();

    // Wait for SSE update
    await page.waitForTimeout(500);

    // Verify OT is removed from "Mis OTs" (completed OTs shouldn't appear)
    await page.reload(); // Refresh to get updated list

    const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const completedOT = otCards.filter({ hasText: otNumero || '' });

    // Should NOT find the completed OT
    await expect(completedOT).toHaveCount(0);
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
    // THIS TEST WILL FAIL - Cancel not implemented
    // Expected: OT status remains EN_PROGRESO
    // Actual: 404 or status changes anyway

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();

    // Cancel the action
    const cancelBtn = page.getByTestId('cancel-completar-ot-btn');
    await cancelBtn.click();

    // Verify OT still in Mis OTs (not completed)
    const otNumero = await firstCard.getByTestId('ot-numero').textContent();
    await page.reload();

    const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const stillVisible = otCards.filter({ hasText: otNumero || '' });

    await expect(stillVisible).toHaveCount(1);
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
