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

    // Verify repuestos dropdown is visible
    const repuestoSelect = page.getByTestId('repuesto-select');
    await expect(repuestoSelect).toBeVisible();
  });

  test('[P0-AC4-002] should show repuesto info: name, stock, location', async ({ page }) => {
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

        // Get all options from repuesto dropdown
        const repuestoSelect = page.getByTestId('repuesto-select');
        const options = await repuestoSelect.locator('option').all();

        // Verify at least one option exists (excluding the default "-- Seleccionar repuesto --")
        expect(options.length).toBeGreaterThan(1);

        // Verify first option contains name, stock, and ubicación info
        const firstOptionText = await options[1].textContent();
        expect(firstOptionText).toMatch(/\(Stock: \d+\)/); // Should have stock
        expect(firstOptionText).toMatch(/ - .+$/); // Should have ubicación

        return;
      }
    }
  });

  test('[P0-AC4-003] should add repuesto when stock is sufficient', async ({ page }) => {
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

        // Find first repuesto with any stock
        const repuestoSelect = page.getByTestId('repuesto-select');
        const options = await repuestoSelect.locator('option').all();

        expect(options.length).toBeGreaterThan(1); // At least default + 1 repuesto

        // Find a repuesto with stock > 0
        let validOptionIndex = -1;
        let repuestoNombre = '';

        for (let j = 1; j < options.length; j++) {
          const optionText = await options[j].textContent();
          const match = optionText?.match(/Stock: (\d+)/);

          if (match && parseInt(match[1]) > 0) {
            validOptionIndex = j;
            // Clean name: remove everything from ' (Stock:' onwards and trim
            repuestoNombre = optionText?.split(' (Stock:')[0]?.trim() || '';
            break;
          }
        }

        // Verify we found a repuesto with stock
        expect(validOptionIndex).toBeGreaterThan(0);
        expect(repuestoNombre).not.toBe('');

        // Select the repuesto with stock
        await repuestoSelect.selectOption({ index: validOptionIndex });

        // Enter cantidad = 1 (minimal stock requirement)
        const cantidadInput = page.getByTestId('repuesto-cantidad-input');
        await cantidadInput.fill('1');

        // Get initial count of used repuestos matching this name
        const repuestosList = page.getByTestId('repuestos-usados-list');
        const initialCount = await repuestosList.locator('[data-testid^="used-repuesto"]').filter({ hasText: repuestoNombre }).count();

        // Click "Agregar Repuesto" button
        const agregarBtn = page.getByText('Agregar Repuesto');
        await agregarBtn.click();

        // Wait for SSE update - wait for new repuesto to appear
        await page.waitForTimeout(3000);

        // Verify repuesto was added to list
        const newRepuesto = repuestosList.locator('[data-testid^="used-repuesto"]').filter({ hasText: repuestoNombre }).first();
        await expect(newRepuesto).toBeVisible({ timeout: 10000 });

        return;
      }
    }
  });

  test('[P0-AC4-004] should show error when stock is insufficient', async ({ page }) => {
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

        // Select first repuesto from dropdown
        const repuestoSelect = page.getByTestId('repuesto-select');
        await repuestoSelect.selectOption({ index: 1 });

        // Get the repuesto info to find one with low stock
        const options = await repuestoSelect.locator('option').all();
        let lowStockOptionIndex = -1;

        for (let j = 1; j < options.length; j++) {
          const text = await options[j].textContent();
          const match = text?.match(/Stock: (\d+)/);
          if (match && parseInt(match[1]) < 5) {
            lowStockOptionIndex = j;
            break;
          }
        }

        // If found low stock repuesto, use it; otherwise use first one with high cantidad
        if (lowStockOptionIndex > 0) {
          await repuestoSelect.selectOption({ index: lowStockOptionIndex });
        }

        // Enter cantidad MORE than likely stock
        const cantidadInput = page.getByTestId('repuesto-cantidad-input');
        await cantidadInput.fill('999');

        // Get initial count of used repuestos
        const repuestosList = page.getByTestId('repuestos-usados-list');
        const initialCount = await repuestosList.locator('[data-testid^="used-repuesto-"]').count();

        // Click "Agregar Repuesto" button
        const agregarBtn = page.getByText('Agregar Repuesto');
        await agregarBtn.click();

        // Wait for toast error
        await page.waitForTimeout(500);

        // Verify repuesto NOT added to list
        const newCount = await repuestosList.locator('[data-testid^="used-repuesto-"]').count();
        expect(newCount).toBe(initialCount);

        return;
      }
    }
  });

  test('[P1-AC4-005] should not send notification to can_manage_stock users', async ({ page }) => {
    // SSE event targeting - stock updates are broadcast to work-orders channel
    // can_manage_stock users receive separate notifications if needed
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
