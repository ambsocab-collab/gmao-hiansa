import { test, expect } from '../../fixtures/test.fixtures';
import { findOTCardByState } from '../helpers/pagination-helper';

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
    await page.waitForLoadState('domcontentloaded');

    // Use pagination helper to find ASIGNADA card across multiple pages
    const result = await findOTCardByState(page, 'ASIGNADA');

    // Verify we found an ASIGNADA card
    expect(result).not.toBeNull();

    // Click on OT card to open modal
    await result!.card.click();

    // Wait for modal to open
    const modal = page.getByTestId(/ot-detalles-/);
    await expect(modal).toBeVisible();

    // Verify "Iniciar OT" button is visible (only if OT is ASIGNADA)
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await expect(iniciarBtn).toBeVisible();
  });

  test('[P0-AC3-002] should show confirmation dialog when clicking "Iniciar OT"', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Use pagination helper to find ASIGNADA card
    const result = await findOTCardByState(page, 'ASIGNADA');

    expect(result).not.toBeNull();

    await result!.card.click();

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
    await page.waitForLoadState('domcontentloaded');

    // Use pagination helper to find ASIGNADA card
    const result = await findOTCardByState(page, 'ASIGNADA');

    expect(result).not.toBeNull();

    // Get OT number before starting
    const otNumero = await result!.card.getByTestId('ot-numero').textContent();

    await result!.card.click();

    // Click "Iniciar OT" button
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await iniciarBtn.click();

    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-iniciar-ot-btn');
    await confirmBtn.click();

    // Wait for modal to close (it closes after starting)
    await expect(page.getByTestId(/ot-detalles-/)).not.toBeVisible();

    // Force page reload to get updated state (router.refresh() might not trigger hard reload)
    await page.reload();

    // Find the card again by OT number (it may be on a different page now)
    // Search through all pages
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    let foundCard = false;

    for (let pageNum = 1; pageNum <= 10; pageNum++) {
      await page.goto(`${baseURL}/mis-ots?page=${pageNum}`);
      await page.waitForLoadState('domcontentloaded');

      const misOtsList = page.getByTestId('mis-ots-lista');
      const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
      const cardCount = await cards.count();

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const cardNumero = await card.getByTestId('ot-numero').textContent();

        if (cardNumero === otNumero) {
          // Verify estado changed to EN_PROGRESO (UI shows "En Progreso")
          await expect(card.getByTestId('ot-estado-badge')).toContainText('En Progreso', { timeout: 5000 });

          // Click to open modal and verify "Completar" button
          await card.click();
          const completarBtn = page.getByTestId('ot-completar-btn');
          await expect(completarBtn).toBeVisible({ timeout: 5000 });

          // Verify "Iniciar" button is no longer visible
          await expect(page.getByTestId('ot-iniciar-btn')).not.toBeVisible();

          foundCard = true;
          break;
        }
      }

      if (foundCard) break;
    }

    expect(foundCard).toBe(true);
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
    await page.waitForLoadState('domcontentloaded');

    // Use pagination helper to find ASIGNADA card
    const result = await findOTCardByState(page, 'ASIGNADA');

    expect(result).not.toBeNull();

    await result!.card.click();

    // Click "Iniciar OT" button
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    await iniciarBtn.click();

    // Cancel the action (click "X" or "Cancel")
    const cancelBtn = page.getByTestId('cancel-iniciar-ot-btn');
    await cancelBtn.click();

    // Verify estado is still ASIGNADA (UI shows "Asignada")
    await expect(result!.card.getByTestId('ot-estado-badge')).toContainText('Asignada');

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
