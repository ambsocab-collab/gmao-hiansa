import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P2 E2E Tests for Story 3.2 AC6: Verificación por operario (post-completación)
 *
 * TDD RED PHASE: Tests validate verification flow - all tests will FAIL
 * Expected Failures: Verification UI doesn't exist
 *
 * Acceptance Criteria:
 * - OT completada
 * - Operario verifica la reparación
 * - Puede confirmar si funciona o no (NFR-S5)
 * - Si NO funciona: se genera OT de re-trabajo con prioridad ALTA (NFR-S101)
 * - Nueva OT vinculada via parent_work_order_id
 * - Técnicos/proveedores asignados notificados
 * - Si funciona: OT marcada como "Verificada" (campo verificacion_at)
 * - Operario recibe confirmación con número de aviso
 *
 * Storage State: Uses admin or operario auth (not tecnico)
 */

test.describe('Story 3.2 - AC6: Verificación por Operario (P2)', () => {
  // Use operario or admin auth (not tecnico - technicians don't verify)
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban`); // Go to Kanban to find completed OTs
  });

  test.skip('[P2-AC6-001] should show verification option for completed OTs', async ({ page }) => {
    // THIS TEST WILL FAIL - Verification UI doesn't exist
    // Expected: "Verificar" button visible on completed OTs
    // Actual: Button doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // Find COMPLETADA column
    const completadaColumn = desktopContainer.getByTestId('kanban-column-COMPLETADA');

    // Get first completed OT card
    const otCard = completadaColumn.locator('[data-testid^="ot-card-"]').first();
    const cardCount = await otCard.count();

    if (cardCount === 0) {
      test.skip(true, 'No completed OTs available - skipping test');
    }

    await otCard.click();

    // Verify "Verificar Reparación" button is visible
    const verificarBtn = page.getByTestId('verificar-reparacion-btn');
    await expect(verificarBtn).toBeVisible();
  });

  test.skip('[P2-AC6-002] should mark OT as verified when repair works', async ({ page }) => {
    // THIS TEST WILL FAIL - Verification action not implemented
    // Expected: verificacion_at set, success message shown
    // Actual: 404 or no action

    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();
    const completadaColumn = desktopContainer.getByTestId('kanban-column-COMPLETADA');

    const otCard = completadaColumn.locator('[data-testid^="ot-card-"]').first();
    const cardCount = await otCard.count();

    if (cardCount === 0) {
      test.skip(true, 'No completed OTs available - skipping test');
    }

    await otCard.click();

    // Click "Verificar Reparación" button
    const verificarBtn = page.getByTestId('verificar-reparacion-btn');
    await verificarBtn.click();

    // Select "Funciona" option
    const funcionaOption = page.getByTestId('verificacion-funciona-option');
    await funcionaOption.click();

    // Confirm verification
    const confirmBtn = page.getByTestId('confirm-verificacion-btn');
    await confirmBtn.click();

    // Wait for update
    await page.waitForTimeout(500);

    // Verify success message
    const successMessage = page.getByTestId('verificacion-success-message');
    await expect(successMessage).toBeVisible();

    // Verify OT marked as verified (verificacion_at set)
    // This would require database check, so we verify in UI
    await expect(otCard.getByTestId('ot-verified-badge')).toBeVisible();
  });

  test.skip('[P2-AC6-003] should create rework OT when repair does not work', async ({ page }) => {
    // THIS TEST WILL FAIL - Rework OT creation not implemented
    // Expected: New OT created with HIGH priority, linked to parent
    // Actual: 404 or no action

    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();
    const completadaColumn = desktopContainer.getByTestId('kanban-column-COMPLETADA');

    const otCard = completadaColumn.locator('[data-testid^="ot-card-"]').first();
    const cardCount = await otCard.count();

    if (cardCount === 0) {
      test.skip(true, 'No completed OTs available - skipping test');
    }

    // Get original OT number
    const originalOtNumero = await otCard.getByTestId('ot-numero').textContent();

    await otCard.click();

    // Click "Verificar Reparación" button
    const verificarBtn = page.getByTestId('verificar-reparacion-btn');
    await verificarBtn.click();

    // Select "No Funciona" option
    const noFuncionaOption = page.getByTestId('verificacion-no-funciona-option');
    await noFuncionaOption.click();

    // Confirm verification
    const confirmBtn = page.getByTestId('confirm-verificacion-btn');
    await confirmBtn.click();

    // Wait for rework OT creation
    await page.waitForTimeout(1000);

    // Verify success message with new OT number
    const successMessage = page.getByTestId('verificacion-rework-created-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('OT de re-trabajo creada');

    // Verify new OT is created with HIGH priority
    // Navigate to ASIGNADA column to find rework OT
    await page.reload();

    const asignadaColumn = desktopContainer.getByTestId('kanban-column-ASIGNADA');
    const reworkOtCard = asignadaColumn.locator('[data-testid^="ot-card-"]').filter({ hasText: /re-trabajo/i });

    await expect(reworkOtCard.first()).toBeVisible();

    // Verify rework OT has HIGH priority
    await expect(reworkOtCard.first().getByTestId('ot-prioridad-badge')).toContainText('ALTA');

    // Verify rework OT is linked to parent (would need to check modal details)
  });

  test.skip('[P2-AC6-004] should notify technicians when rework OT created', async ({ page }) => {
    // THIS TEST WILL FAIL - Notification not implemented
    // Expected: Technicians notified of new rework OT
    // Actual: No notification

    test.skip(true, 'Notification verification requires SSE listener setup - verified in integration tests');
  });

  test.skip('[P2-AC6-005] should show confirmation message with aviso number', async ({ page }) => {
    // THIS TEST WILL FAIL - Confirmation message not implemented
    // Expected: Message includes aviso number
    // Actual: No message or wrong format

    test.skip(true, 'Depends on verification action being implemented first');
  });
});
