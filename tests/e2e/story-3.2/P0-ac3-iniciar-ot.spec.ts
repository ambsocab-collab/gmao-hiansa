import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.2 AC3: Iniciar OT desde estado "ASIGNADA"
 *
 * TDD RED PHASE: Tests validate iniciar OT flow - all tests will FAIL
 * Expected Failures: Modal doesn't exist, buttons don't exist
 *
 * Acceptance Criteria:
 * - Modal de OT abierta
 * - Si OT está en estado "ASIGNADA", botón "Iniciar OT" visible (data-testid="ot-iniciar-btn")
 * - Click en "Iniciar OT" requiere confirmación
 * - Si confirmo: estado cambia a "EN_PROGRESO" en <1s (NFR-S3)
 * - Botón "Iniciar" reemplazado por "Completar"
 * - Evento SSE enviado a todos los usuarios asignados en <30s (NFR-S19)
 * - Auditoría logged: "OT {id} iniciada por {userId}"
 * - Tarjeta OT movida a columna "En Progreso" en Kanban
 * - Fecha updated_at registrada
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.2 - AC3: Iniciar OT (P0)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P0-AC3-001] should show "Iniciar OT" button when OT is ASIGNADA', async ({ page }) => {
    // THIS TEST WILL FAIL - Modal doesn't exist
    // Expected: Modal opens with "Iniciar OT" button
    // Actual: Click fails, modal doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    // Click on OT card to open modal
    await firstCard.click();

    // Wait for modal to open
    const modal = page.getByTestId(/ot-detalles-/);
    await expect(modal).toBeVisible();

    // Verify "Iniciar OT" button is visible (only if OT is ASIGNADA)
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await expect(iniciarBtn).toBeVisible();
  });

  test('[P0-AC3-002] should show confirmation dialog when clicking "Iniciar OT"', async ({ page }) => {
    // THIS TEST WILL FAIL - Confirmation dialog not implemented
    // Expected: Confirmation dialog appears
    // Actual: No confirmation or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click "Iniciar OT" button
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await iniciarBtn.click();

    // Verify confirmation dialog is visible
    const confirmDialog = page.getByTestId('confirm-iniciar-ot-dialog');
    await expect(confirmDialog).toBeVisible();

    // Verify confirmation message
    await expect(confirmDialog.getByText(/¿Iniciar OT #/)).toBeVisible();
  });

  test('[P0-AC3-003] should change OT status to EN_PROGRESO when confirmed', async ({ page }) => {
    // THIS TEST WILL FAIL - Server action doesn't exist
    // Expected: OT status changes to EN_PROGRESO in <1s
    // Actual: 404 or no status change

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    // Get OT number before starting
    const otNumero = await firstCard.getByTestId('ot-numero').textContent();

    await firstCard.click();

    // Click "Iniciar OT" button
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await iniciarBtn.click();

    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-iniciar-ot-btn');
    await confirmBtn.click();

    // Wait for SSE update (UI should refresh)
    await page.waitForTimeout(500); // Wait for SSE event

    // Verify estado changed to EN_PROGRESO
    await expect(firstCard.getByTestId('ot-estado-badge')).toContainText('EN_PROGRESO');

    // Verify "Iniciar" button is replaced by "Completar"
    const completarBtn = page.getByTestId('ot-completar-btn');
    await expect(completarBtn).toBeVisible();

    // Verify "Iniciar" button is no longer visible
    await expect(iniciarBtn).not.toBeVisible();
  });

  test('[P0-AC3-004] should emit SSE event when OT is started', async ({ page }) => {
    // THIS TEST WILL FAIL - SSE not implemented
    // Expected: SSE event emitted to all assigned users
    // Actual: No SSE event sent

    // This test would require SSE subscription verification
    // For now, verify that the action completes (SSE verified in integration tests)
    test.skip(true, 'SSE event verification requires SSE listener setup - verified in integration tests');
  });

  test('[P1-AC3-005] should cancel iniciar OT when confirmation dismissed', async ({ page }) => {
    // THIS TEST WILL FAIL - Cancel not implemented
    // Expected: OT status remains ASIGNADA
    // Actual: 404 or status changes anyway

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click "Iniciar OT" button
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await iniciarBtn.click();

    // Cancel the action (click "X" or "Cancel")
    const cancelBtn = page.getByTestId('cancel-iniciar-ot-btn');
    await cancelBtn.click();

    // Verify estado is still ASIGNADA
    await expect(firstCard.getByTestId('ot-estado-badge')).toContainText('ASIGNADA');

    // Verify "Iniciar" button is still visible
    await expect(iniciarBtn).toBeVisible();
  });

  test('[P1-AC3-006] should show error if iniciar OT fails', async ({ page }) => {
    // THIS TEST WILL FAIL - Error handling not implemented
    // Expected: Error toast shown
    // Actual: No error handling or 404

    // This test would require mocking a failure scenario
    test.skip(true, 'Requires mock failure scenario - error handling not implemented');
  });
});
