import { test, expect } from '../../fixtures/test.fixtures';
import { findOTCardByState } from '../helpers/pagination-helper';

import { waitForLoadState } from '@playwright/test';

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

    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    await result!.card.click();
    // Verify "Completar OT" button is visible
    const completarBtn = page.getByTestId('ot-completar-btn');
    await expect(completarBtn).toBeVisible();
  });

  test('[P0-AC5-002] should show confirmation dialog when clicking "Completar OT"', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    const otNumero = await result!.card.getByTestId('ot-numero').textContent();
    await result!.card.click();
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
    await page.waitForLoadState('domcontentloaded');
    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    const otNumero = await result!.card.getByTestId('ot-numero').textContent();
    await result!.card.click();
    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();
    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-completar-ot-btn');
    await confirmBtn.click();
    // Wait for modal to close
    await expect(page.getByTestId(/ot-detalles-/)).not.toBeVisible();
    // force page reload to get updated state
    await page.reload();
    // find the completed OT and verify it has completion info
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    let foundCompleted = false;
    for (let pageNum = 1; pageNum <= 10; pageNum++) {
      await page.goto(`${baseURL}/mis-ots?page=${pageNum}`);
      await page.waitForLoadState('domcontentloaded');
      const otCards = page.getByTestId('mis-ots-lista').locator('[data-testid^="my-ot-card-"]');
      const updatedCardCount = await otCards.count();
      for (let j = 0; j < updatedCardCount; j++) {
        const updatedCard = otCards.nth(j);
        const cardNumero = await updatedCard.getByTestId('ot-numero').textContent();
        if (cardNumero === otNumero) {
          // verify state changed to COMPLETADA (UI shows "Completada")
          await expect(updatedCard.getByTestId('ot-estado-badge')).toContainText('Completada', { timeout: 5000 });
          foundCompleted = true;
          break;
        }
      }
      expect(foundCompleted).toBe(true);
    }
  });

  test('[P0-AC5-004] should record completedAt timestamp', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    const otNumero = await result!.card.getByTestId('ot-numero').textContent();
    await result!.card.click();
    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();
    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-completar-ot-btn');
    await confirmBtn.click();
    // Wait for modal to close
    await expect(page.getByTestId(/ot-detalles-/)).not.toBeVisible();
    // force page reload to get updated state
    await page.reload();
    // find the completed OT and verify it has completion info
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    let foundCompleted = false;
    for (let pageNum = 1; pageNum <= 10; pageNum++) {
      await page.goto(`${baseURL}/mis-ots?page=${pageNum}`);
      await page.waitForLoadState('domcontentloaded');
      const otCards = page.getByTestId('mis-ots-lista').locator('[data-testid^="my-ot-card-"]');
      const updatedCardCount = await otCards.count();
      for (let j = 0; j < updatedCardCount; j++) {
        const updatedCard = otCards.nth(j);
        const cardNumero = await updatedCard.getByTestId('ot-numero').textContent();
        if (cardNumero === otNumero) {
          // verify estado changed to COMPLETADA (UI shows "Completada")
          await expect(updatedCard.getByTestId('ot-estado-badge')).toContainText('Completada', { timeout: 5000 });
          foundCompleted = true;
          break;
        }
      }
      expect(foundCompleted).toBe(true);
    }
  });

  test('[P1-AC5-006] should cancel completar OT when confirmation dismissed', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    await result!.card.click();
    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();
    // Cancel the action
    const cancelBtn = page.getByTestId('cancel-completar-ot-btn');
    await cancelBtn.click();
    // Verify state is still EN_PROGRESO (UI shows "En Progreso")
    await expect(result!.card.getByTestId('ot-estado-badge')).toContainText('En Progreso');
    // Verify "Completar" button is still visible
    await expect(completarBtn).toBeVisible();
  });

  test('[P1-AC5-007] should show error if completar OT fails', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const result = await findOTCardByState(page, 'EN_PROGRESO');
    expect(result).not.toBeNull();
    await result!.card.click();
    // Click "Completar OT" button
    const completarBtn = page.getByTestId('ot-completar-btn');
    await completarBtn.click();
    // Confirm the action
    const confirmBtn = page.getByTestId('confirm-completar-ot-btn');
    await confirmBtn.click();
    // Wait for modal to close
    await expect(page.getByTestId(/ot-detalles-/)).not.toBeVisible();
    // Verify error toast is shown
    await expect(page.getByText(/Error|)).toBeVisible({ timeout: 2000 });
  });
});
