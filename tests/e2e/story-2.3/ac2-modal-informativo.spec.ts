/**
 * E2E Tests: Story 2.3 - AC2: Modal Informativo
 *
 * Tests cover:
 * - AC2: Modal informativo de avería con detalles completos
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

import { test, expect } from '../../fixtures/test.fixtures';

// NOTA: Tests usan storageState global (playwright/.auth/admin.json)
// loginAs fixture es no-op por ahora - todos corren como admin

/**
 * Reset failure reports before each test to ensure test independence
 */
test.beforeEach(async ({ request }) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const response = await request.post(`${baseURL}/api/v1/test/reset-failure-reports`);

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to reset failure reports: ${error}`);
  }

  console.log('✅ Database reset: Failure reports restored to initial state');
});

test.describe('Triage de Averías - AC2: Modal Informativo', () => {
  /**
   * P0-E2E-005: Modal abre al click en tarjeta
   *
   * AC2: Given lista de avisos visible
   *       When hago click en un aviso
   *       Then modal informativo se abre con detalles completos
   *       And modal tiene data-testid="modal-averia-info"
   */
  test('[P0-E2E-005] should open modal when clicking card', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Click en primera tarjeta
    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // Then: Modal visible
    const modal = page.getByTestId('modal-averia-info');
    await expect(modal).toBeVisible();

    // And: Modal tiene detalles completos
    await expect(modal.getByTestId('descripcion-completa')).toBeVisible();
    await expect(modal.getByTestId('equipo-jerarquia')).toBeVisible();
    await expect(modal.getByTestId('reporter')).toBeVisible();
    await expect(modal.getByTestId('timestamp')).toBeVisible();
  });

  /**
   * P1-E2E-006: Modal tiene botones de acción
   *
   * AC2: Given modal abierto
   *       Then modal tiene botones: "Convertir a OT", "Descartar"
   */
  test('[P1-E2E-006] should have action buttons in modal', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // Then: Botones visibles
    await expect(page.getByTestId('convertir-a-ot-btn')).toBeVisible();
    await expect(page.getByTestId('descartar-btn')).toBeVisible();
  });

  /**
   * P2-E2E-007: Modal muestra foto si existe
   *
   * AC2: Given modal abierto
   *       When aviso tiene foto
   *       Then foto visible en modal
   */
  test('[P2-E2E-007] should show photo in modal if exists', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Click en tarjeta con foto (asumimos primera tiene foto)
    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // Then: Foto visible
    const modal = page.getByTestId('modal-averia-info');
    const photo = modal.getByTestId('foto');

    // Si hay foto, debería ser visible
    const photoExists = await photo.count() > 0;
    if (photoExists) {
      await expect(photo).toBeVisible();
    }
  });
});
