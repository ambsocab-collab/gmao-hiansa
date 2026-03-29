import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.3 AC1: Seleccionar técnicos internos y/o proveedores externos
 *
 * TDD RED PHASE: Tests validate assignment functionality - all tests will FAIL
 * Expected Failures: Elements not found, routes don't exist
 *
 * Acceptance Criteria:
 * - Supervisor con capability can_assign_technicians puede asignar
 * - Seleccionar de 1 a 3 técnicos internos (FR17)
 * - Seleccionar 1 proveedor externo (FR18)
 * - Filtros disponibles: habilidades, ubicación, disponibilidad
 * - Lista de técnicos tiene data-testid="tecnicos-select"
 * - Lista de proveedores tiene data-testid="proveedores-select"
 * - Máximo total de asignados: 3 (técnicos + proveedor)
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 * Auth Pattern: Same as Story 3.2 (storage state files)
 */

test.describe('Story 3.3 - AC1: Asignación de Técnicos y Proveedores (P0)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    // Navigate to OT list page where assignment modal can be triggered
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0-AC1-001] Supervisor puede asignar 2 técnicos a una OT', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - Assignment modal doesn't exist
    // - TechnicianSelect component doesn't exist
    // - assignToWorkOrder Server Action doesn't exist

    // Find first OT card in the list
    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
    await expect(firstOTCard).toBeVisible({ timeout: 10000 });

    // Click "Asignar" button on the OT card
    const asignarBtn = firstOTCard.getByTestId('btn-asignar');
    await expect(asignarBtn).toBeVisible();
    await asignarBtn.click();

    // Wait for assignment modal to open
    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Verify technician select is present
    const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
    await expect(tecnicosSelect).toBeVisible();

    // Open technician dropdown and select 2 technicians
    await tecnicosSelect.click();

    // Select first technician (by checkbox in dropdown)
    const tecnicoOption1 = page.locator('[data-testid="tecnico-option-0"]');
    await expect(tecnicoOption1).toBeVisible();
    await tecnicoOption1.click();

    // Select second technician
    const tecnicoOption2 = page.locator('[data-testid="tecnico-option-1"]');
    await expect(tecnicoOption2).toBeVisible();
    await tecnicoOption2.click();

    // Close dropdown (click outside or press Escape)
    await page.keyboard.press('Escape');

    // Verify 2 technicians are selected
    const selectedTecnicos = assignmentModal.locator('[data-testid="selected-tecnico-badge"]');
    await expect(selectedTecnicos).toHaveCount(2);

    // Click "Guardar Asignación" button
    const guardarBtn = assignmentModal.getByTestId('guardar-asignacion-btn');
    await expect(guardarBtn).toBeEnabled();
    await guardarBtn.click();

    // Wait for modal to close
    await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

    // Verify success toast notification
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 5000 });
    await expect(successToast).toContainText('asignad');
  });

  test('[P0-AC1-002] Supervisor puede asignar 1 proveedor externo', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - Provider model doesn't exist
    // - ProviderSelect component doesn't exist
    // - getAvailableProviders Server Action doesn't exist

    // Find first OT card
    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
    await expect(firstOTCard).toBeVisible({ timeout: 10000 });

    // Click "Asignar" button
    const asignarBtn = firstOTCard.getByTestId('btn-asignar');
    await asignarBtn.click();

    // Wait for modal
    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Verify provider select is present
    const proveedoresSelect = assignmentModal.getByTestId('proveedores-select');
    await expect(proveedoresSelect).toBeVisible();

    // Open provider dropdown and select one
    await proveedoresSelect.click();

    const proveedorOption = page.locator('[data-testid="proveedor-option-0"]');
    await expect(proveedorOption).toBeVisible();
    await proveedorOption.click();

    // Verify provider is selected
    const selectedProveedor = assignmentModal.locator('[data-testid="selected-proveedor-badge"]');
    await expect(selectedProveedor).toHaveCount(1);

    // Save assignment
    const guardarBtn = assignmentModal.getByTestId('guardar-asignacion-btn');
    await guardarBtn.click();

    // Wait for modal to close
    await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

    // Verify success
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 5000 });
  });

  test('[P0-AC1-003] Validación máximo 3 asignados (técnicos + proveedor)', async ({ page }) => {
    // RED PHASE: This test will fail because:
    // - Validation logic doesn't exist
    // - Error handling UI doesn't exist

    // Find first OT card
    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
    await expect(firstOTCard).toBeVisible({ timeout: 10000 });

    // Click "Asignar" button
    const asignarBtn = firstOTCard.getByTestId('btn-asignar');
    await asignarBtn.click();

    // Wait for modal
    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Select 3 technicians
    const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
    await tecnicosSelect.click();

    // Select 3 technicians
    for (let i = 0; i < 3; i++) {
      const option = page.locator(`[data-testid="tecnico-option-${i}"]`);
      if (await option.isVisible()) {
        await option.click();
      }
    }
    await page.keyboard.press('Escape');

    // Verify 3 technicians selected
    const selectedTecnicos = assignmentModal.locator('[data-testid="selected-tecnico-badge"]');
    const tecnicoCount = await selectedTecnicos.count();
    expect(tecnicoCount).toBe(3);

    // Try to select a provider (should be disabled or show error)
    const proveedoresSelect = assignmentModal.getByTestId('proveedores-select');

    // Verify provider select is disabled when 3 technicians are selected
    await expect(proveedoresSelect).toBeDisabled();

    // Alternatively, if provider is selected first, technicians should be limited to 2
    // Close and reopen modal to test other scenario
    const cancelarBtn = assignmentModal.getByTestId('cancelar-asignacion-btn');
    await cancelarBtn.click();
    await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

    // Reopen modal
    await asignarBtn.click();
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Select provider first
    const proveedoresSelect2 = assignmentModal.getByTestId('proveedores-select');
    await proveedoresSelect2.click();
    const proveedorOption = page.locator('[data-testid="proveedor-option-0"]');
    await proveedorOption.click();

    // Now try to select 3 technicians (should only allow 2)
    const tecnicosSelect2 = assignmentModal.getByTestId('tecnicos-select');
    await tecnicosSelect2.click();

    // Select technicians - 3rd should be disabled
    for (let i = 0; i < 3; i++) {
      const option = page.locator(`[data-testid="tecnico-option-${i}"]`);
      if (i < 2) {
        // First 2 should be selectable
        await expect(option).toBeEnabled();
      } else {
        // 3rd should be disabled
        await expect(option).toBeDisabled();
      }
    }
  });

  test('[P1-AC1-004] Técnico sin capability no puede asignar', async ({ page }) => {
    // This test uses tecnico auth which doesn't have can_assign_technicians
    // Need to re-authenticate as tecnico
    // Note: This test should be in a separate describe block with tecnico storage state
    test.skip(true, 'Requires separate auth context - move to separate test file');
  });

  test('[P1-AC1-005] Filtros por habilidades disponibles', async ({ page }) => {
    // RED PHASE: This test will fail because filter UI doesn't exist

    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
    await expect(firstOTCard).toBeVisible({ timeout: 10000 });

    const asignarBtn = firstOTCard.getByTestId('btn-asignar');
    await asignarBtn.click();

    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Verify skill filter checkboxes exist
    const skills = ['eléctrica', 'mecánica', 'hidráulica', 'neumática', 'electrónica'];

    for (const skill of skills) {
      const skillCheckbox = assignmentModal.getByTestId(`filtro-skills-checkbox-${skill}`);
      await expect(skillCheckbox).toBeVisible();
    }

    // Click on "eléctrica" filter
    const electricaCheckbox = assignmentModal.getByTestId('filtro-skills-checkbox-eléctrica');
    await electricaCheckbox.check();

    // Verify technicians list is filtered
    const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
    await tecnicosSelect.click();

    // All visible technicians should have "eléctrica" skill
    const visibleOptions = page.locator('[data-testid^="tecnico-option-"]');
    const count = await visibleOptions.count();

    for (let i = 0; i < count; i++) {
      const option = visibleOptions.nth(i);
      const skillTag = option.locator('[data-testid="tecnico-skill-tag"]');
      // At least one skill tag should contain "eléctrica"
      await expect(skillTag).toContainText('eléctrica');
    }
  });

  test('[P1-AC1-006] Filtros por ubicación disponibles', async ({ page }) => {
    // RED PHASE: This test will fail because filter UI doesn't exist

    const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
    await expect(firstOTCard).toBeVisible({ timeout: 10000 });

    const asignarBtn = firstOTCard.getByTestId('btn-asignar');
    await asignarBtn.click();

    const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
    await expect(assignmentModal).toBeVisible({ timeout: 5000 });

    // Verify location filter dropdown exists
    const ubicacionSelect = assignmentModal.getByTestId('filtro-ubicacion-select');
    await expect(ubicacionSelect).toBeVisible();

    // Open and verify options
    await ubicacionSelect.click();

    const ubicaciones = ['Planta HiRock', 'Planta Ultra', 'Taller', 'Almacén'];
    for (const ubicacion of ubicaciones) {
      const option = page.locator(`[data-testid="ubicacion-option-${ubicacion.toLowerCase().replace(' ', '-')}"]`);
      await expect(option).toBeVisible();
    }

    // Select "Planta HiRock"
    const plantaHiRockOption = page.getByTestId('ubicacion-option-planta-hirock');
    await plantaHiRockOption.click();

    // Verify technicians list is filtered by location
    const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
    await tecnicosSelect.click();

    const visibleOptions = page.locator('[data-testid^="tecnico-option-"]');
    const count = await visibleOptions.count();

    for (let i = 0; i < count; i++) {
      const option = visibleOptions.nth(i);
      const locationTag = option.locator('[data-testid="tecnico-ubicacion-tag"]');
      await expect(locationTag).toContainText('Planta HiRock');
    }
  });
});
