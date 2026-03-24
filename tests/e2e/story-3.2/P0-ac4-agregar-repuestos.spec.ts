import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.2 AC4: Agregar repuestos usados con validación de stock
 *
 * TDD RED PHASE: Tests validate repuesto management - all tests will FAIL
 * Expected Failures: Dropdown doesn't exist, validation not implemented
 *
 * Acceptance Criteria:
 * - OT en estado "EN_PROGRESO"
 * - Dropdown de repuestos visible (data-testid="repuesto-select")
 * - Dropdown muestra: nombre repuesto, stock actual, ubicación física
 * - Selecciono repuesto y cantidad
 * - Validación: cantidad <= stock actual (NFR-S16)
 * - Si hay stock suficiente: stock actualizado en tiempo real <1s
 * - Lista de repuestos usados actualizada con data-testid="repuestos-usados-list"
 * - NO se envía notificación a usuarios can_manage_stock (actualizaciones silenciosas)
 * - Si NO hay stock suficiente (race condition): error mostrado
 * - Transacción revertida (optimistic locking aplicado)
 *
 * CRITICAL: R-011 (DATA, Score 4): Stock update race conditions
 * CRITICAL: NFR-S16: Stock actualizado en <1s con optimistic locking
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.2 - AC4: Agregar Repuestos (P0)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P0-AC4-001] should show repuestos dropdown when OT is EN_PROGRESO', async ({ page }) => {
    // THIS TEST WILL FAIL - Modal doesn't have repuesto dropdown
    // Expected: Dropdown visible with repuestos list
    // Actual: Dropdown doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify repuestos dropdown is visible
    const repuestoSelect = page.getByTestId('repuesto-select');
    await expect(repuestoSelect).toBeVisible();
  });

  test('[P0-AC4-002] should show repuesto info: name, stock, location', async ({ page }) => {
    // THIS TEST WILL FAIL - Dropdown doesn't show repuesto details
    // Expected: Each option shows name, stock, ubicación
    // Actual: Dropdown doesn't exist or has no options

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click on repuesto dropdown to open it
    const repuestoSelect = page.getByTestId('repuesto-select');
    await repuestoSelect.click();

    // Verify first repuesto option shows required info
    const firstOption = page.locator('[data-testid^="repuesto-option-"]').first();

    // Should show repuesto name
    await expect(firstOption.getByTestId('repuesto-nombre')).toBeVisible();

    // Should show stock actual
    await expect(firstOption.getByTestId('repuesto-stock')).toBeVisible();

    // Should show ubicación física
    await expect(firstOption.getByTestId('repuesto-ubicacion')).toBeVisible();
  });

  test('[P0-AC4-003] should add repuesto when stock is sufficient', async ({ page }) => {
    // THIS TEST WILL FAIL - Add repuesto action not implemented
    // Expected: Repuesto added to list, stock decreased
    // Actual: 404 or no action

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Select repuesto with sufficient stock (e.g., stock=10)
    const repuestoSelect = page.getByTestId('repuesto-select');
    await repuestoSelect.click();

    const repuestoOption = page.locator('[data-testid="repuesto-option-bearing-001"]');
    await repuestoOption.click();

    // Enter cantidad (less than stock)
    const cantidadInput = page.getByTestId('repuesto-cantidad-input');
    await cantidadInput.fill('2');

    // Click "Agregar" button
    const agregarBtn = page.getByTestId('agregar-repuesto-btn');
    await agregarBtn.click();

    // Wait for stock update (NFR-S16: <1s)
    await page.waitForTimeout(200);

    // Verify repuesto added to list
    const repuestosList = page.getByTestId('repuestos-usados-list');
    await expect(repuestosList).toBeVisible();

    const addedRepuesto = repuestosList.locator('[data-testid^="used-repuesto-"]').first();
    await expect(addedRepuesto).toBeVisible();

    // Verify stock updated in dropdown
    await repuestoSelect.click();
    await expect(repuestoOption.getByTestId('repuesto-stock')).toContainText('8'); // 10 - 2 = 8
  });

  test('[P0-AC4-004] should show error when stock is insufficient', async ({ page }) => {
    // THIS TEST WILL FAIL - Validation not implemented
    // Expected: Error message "Stock insuficiente"
    // Actual: No validation or wrong error

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Select repuesto with LOW stock (e.g., stock=1)
    const repuestoSelect = page.getByTestId('repuesto-select');
    await repuestoSelect.click();

    const lowStockRepuesto = page.locator('[data-testid="repuesto-option-low-stock"]');
    await lowStockRepuesto.click();

    // Enter cantidad MORE than stock
    const cantidadInput = page.getByTestId('repuesto-cantidad-input');
    await cantidadInput.fill('5'); // Request 5, but only 1 in stock

    // Click "Agregar" button
    const agregarBtn = page.getByTestId('agregar-repuesto-btn');
    await agregarBtn.click();

    // Verify error message
    const errorMessage = page.getByTestId('repuesto-error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Stock insuficiente');
    await expect(errorMessage).toContainText('Stock actual: 1, solicitado: 5');

    // Verify repuesto NOT added to list (transaction rolled back)
    const repuestosList = page.getByTestId('repuestos-usados-list');
    const repuestosCount = await repuestosList.locator('[data-testid^="used-repuesto-"]').count();

    // Should still be 0 (no repuestos added)
    expect(repuestosCount).toBe(0);
  });

  test('[P1-AC4-005] should not send notification to can_manage_stock users', async ({ page }) => {
    // THIS TEST WILL FAIL - SSE filtering not implemented
    // Expected: SSE event only to can_view_own_ots users
    // Actual: No SSE or wrong targeting

    // This test would require SSE subscription verification
    test.skip(true, 'SSE event targeting requires SSE listener setup - verified in integration tests');
  });

  test('[P2-AC4-006] should handle race condition with optimistic locking', async ({ page }) => {
    // THIS TEST WILL FAIL - Optimistic locking not implemented
    // Expected: One request succeeds, one fails with 409 Conflict
    // Actual: No race condition handling implemented yet

    // CRITICAL: R-011 DATA requirement - Must validate optimistic locking
    // Implementation pattern when GREEN phase:
    //
    // const repuesto = await createTestRepuesto(1); // Only 1 in stock
    //
    // // Launch CONCURRENT requests (race condition)
    // const [result1, result2] = await Promise.all([
    //   apiRequest.addUsedRepuesto(otId, repuesto.id, 1),
    //   apiRequest.addUsedRepuesto(otId, repuesto.id, 1)
    // ]);
    //
    // // One should succeed (200), one should fail (409 Conflict)
    // const successCount = [result1, result2].filter(r => r.ok()).length;
    // expect(successCount).toBe(1); // Only one should succeed

    test.skip(true, 'Optimistic locking not implemented - requires concurrent requests with Promise.all()');
  });
});
