/**
 * E2E Tests: Story 2.3 - AC4: Descartar Aviso
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Confirmación modal visible
 * - Descartar confirma y remueve aviso
 * - Cancelar descarte cierra modal
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

import { test, expect } from '../../fixtures/test.fixtures';

test.describe('Triage de Averías - AC4: Descartar Aviso', () => {
  // Run serially to avoid conflicts with database state
  test.describe.configure({ mode: 'serial' });
  /**
   * P0-E2E-011: Descartar muestra confirmación
   *
   * AC4: Given modal de avería abierto
   *       When click "Descartar"
   *       Then confirmación modal: "¿Descartar aviso #{numero}? Esta acción no se puede deshacer."
   */
  test('[P0-E2E-011] should show confirmation modal when descartar clicked', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // When: Click "Descartar"
    await page.getByTestId('descartar-btn').click();

    // Then: Modal de confirmación visible
    const confirmModal = page.getByTestId('descartar-confirm-modal');
    await expect(confirmModal).toBeVisible();

    // And: Mensaje correcto
    await expect(confirmModal.getByText(/¿Descartar aviso #/)).toBeVisible();
    await expect(confirmModal.getByText('Esta acción no se puede deshacer')).toBeVisible();
  });

  /**
   * P0-E2E-012: Descartar confirma y remueve aviso
   *
   * AC4: Given confirmación modal visible
   *       When confirmo descarte
   *       Then aviso marcado como "Descartado"
   *       And ya no aparece en columna "Por Revisar"
   */
  test('[P0-E2E-012] should discard and remove card from por revisar', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    const cardText = await firstCard.textContent();
    await firstCard.click();

    // When: Click "Descartar" y confirmo
    await page.getByTestId('descartar-btn').click();
    await page.getByTestId('descartar-confirm-btn').click();

    // Then: Toast de éxito
    await expect(page.getByText('Aviso descartado').first()).toBeVisible();

    // And: Modal cerrado
    await expect(page.getByTestId('modal-averia-info')).not.toBeVisible();

    // And: Tarjeta removida de columna (buscamos por texto original)
    await expect(page.getByText(cardText || '')).not.toBeVisible();
  });

  /**
   * P1-E2E-013: Cancelar descarte cierra modal sin cambios
   *
   * AC4: Given confirmación modal visible
   *       When cancelo
   *       Then modal se cierra
   *       And aviso sigue en columna "Por Revisar"
   */
  test('[P1-E2E-013] should close modal without discarding when cancelled', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal de confirmación abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    const cardText = await firstCard.textContent();
    await firstCard.click();
    await page.getByTestId('descartar-btn').click();

    // When: Click cancelar
    await page.getByTestId('descartar-cancel-btn').click();

    // Then: Modal de confirmación cerrado
    await expect(page.getByTestId('descartar-confirm-modal')).not.toBeVisible();

    // And: Modal de avería sigue abierto
    await expect(page.getByTestId('modal-averia-info')).toBeVisible();

    // And: Tarjeta sigue visible
    await expect(firstCard).toBeVisible();
    await expect(page.getByText(cardText || '')).toBeVisible();
  });
});
