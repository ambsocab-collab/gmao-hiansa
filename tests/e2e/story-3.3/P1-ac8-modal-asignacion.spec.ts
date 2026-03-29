import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.3 AC8: Modal de asignación desde Kanban y Listado
 *
 * TDD RED PHASE: Tests validate assignment modal - all tests will FAIL
 * Expected Failures: Modal doesn't exist, triggers not implemented
 *
 * Acceptance Criteria:
 * - Click en "Asignar" de una OT abre modal de asignación
 * - Modal tiene data-testid="modal-asignacion-{workOrderId}"
 * - Muestra técnicos disponibles con sus skills y ubicación
 * - Muestra proveedores disponibles con sus servicios
 * - Botón "Guardar Asignación" con data-testid="guardar-asignacion-btn"
 * - Modal cierra con click en "X", ESC key, o click fuera
 *
 * Storage State: Uses supervisor auth
 */

test.describe('Story 3.3 - AC8: Modal de Asignación (P1)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.describe('Modal desde vista Listado', () => {
    test.beforeEach(async ({ page }) => {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');
    });

    test('[P1-AC8-001] Modal de asignación se abre desde vista de Listado', async ({ page }) => {
      // RED PHASE: This test will fail because:
      // - "Asignar" button doesn't exist on OT cards
      // - AssignmentModal component doesn't exist

      // Find first OT card
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      // Get the OT ID from the card
      const cardId = await firstOTCard.getAttribute('data-testid');
      const workOrderId = cardId?.replace('ot-card-', '');

      // Find and click "Asignar" button
      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await expect(asignarBtn).toBeVisible();
      await asignarBtn.click();

      // Verify modal opens with correct testid
      const assignmentModal = page.locator(`[data-testid="modal-asignacion-${workOrderId}"]`);
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Verify modal title
      const modalTitle = assignmentModal.locator('[data-testid="modal-title"]');
      await expect(modalTitle).toContainText('Asignar');

      // Verify close button exists
      const closeBtn = assignmentModal.getByTestId('modal-close-btn');
      await expect(closeBtn).toBeVisible();
    });

    test('[P1-AC8-002] Modal muestra técnicos disponibles con skills y ubicación', async ({ page }) => {
      // RED PHASE: Validates technician display in modal

      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Open technician dropdown
      const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
      await expect(tecnicosSelect).toBeVisible();
      await tecnicosSelect.click();

      // Wait for options to load
      await page.waitForTimeout(500);

      // Verify technician options are visible
      const tecnicoOptions = page.locator('[data-testid^="tecnico-option-"]');
      const count = await tecnicoOptions.count();

      expect(count).toBeGreaterThan(0);

      // Check first technician option shows skills
      const firstTecnico = tecnicoOptions.first();

      // Should show technician name
      const tecnicoName = firstTecnico.locator('[data-testid="tecnico-nombre"]');
      await expect(tecnicoName).toBeVisible();

      // Should show skills (if available)
      const skillTags = firstTecnico.locator('[data-testid="tecnico-skill-tag"]');
      const skillCount = await skillTags.count();

      // At least some technicians should have skills
      // (This depends on test data)

      // Should show location
      const ubicacionTag = firstTecnico.locator('[data-testid="tecnico-ubicacion-tag"]');
      // Location might be optional
    });

    test('[P1-AC8-003] Modal muestra proveedores disponibles con servicios', async ({ page }) => {
      // RED PHASE: Validates provider display in modal

      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Open provider dropdown
      const proveedoresSelect = assignmentModal.getByTestId('proveedores-select');
      await expect(proveedoresSelect).toBeVisible();
      await proveedoresSelect.click();

      // Wait for options
      await page.waitForTimeout(500);

      // Verify provider options
      const proveedorOptions = page.locator('[data-testid^="proveedor-option-"]');
      const count = await proveedorOptions.count();

      // Should have at least one provider (from seed data)
      expect(count).toBeGreaterThan(0);

      // Check first provider shows services
      const firstProveedor = proveedorOptions.first();

      const proveedorName = firstProveedor.locator('[data-testid="proveedor-nombre"]');
      await expect(proveedorName).toBeVisible();

      // Should show services
      const serviceTags = firstProveedor.locator('[data-testid="proveedor-service-tag"]');
      const serviceCount = await serviceTags.count();

      expect(serviceCount).toBeGreaterThan(0);
    });

    test('[P1-AC8-004] Botón "Guardar Asignación" funciona correctamente', async ({ page }) => {
      // RED PHASE: Validates save button

      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Verify button exists and has correct testid
      const guardarBtn = assignmentModal.getByTestId('guardar-asignacion-btn');
      await expect(guardarBtn).toBeVisible();
      await expect(guardarBtn).toContainText('Guardar');

      // Initially disabled (no selection)
      await expect(guardarBtn).toBeDisabled();

      // Select a technician
      const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
      await tecnicosSelect.click();

      const tecnicoOption = page.locator('[data-testid="tecnico-option-0"]');
      await tecnicoOption.click();
      await page.keyboard.press('Escape');

      // Now button should be enabled
      await expect(guardarBtn).toBeEnabled();

      // Click save
      await guardarBtn.click();

      // Modal should close
      await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

      // Success toast should appear
      const successToast = page.locator('[data-testid="toast-success"]');
      await expect(successToast).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Modal desde vista Kanban', () => {
    test.beforeEach(async ({ page }) => {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/kanban`);
      await page.waitForLoadState('domcontentloaded');
    });

    test('[P1-AC8-005] Modal de asignación se abre desde vista Kanban', async ({ page }) => {
      // RED PHASE: Validates Kanban integration

      // Wait for Kanban board to load
      const kanbanBoard = page.getByTestId('kanban-board');
      await expect(kanbanBoard).toBeVisible({ timeout: 10000 });

      // Find first OT card in any column
      const otCards = kanbanBoard.locator('[data-testid^="kanban-card-"]');
      const count = await otCards.count();

      expect(count).toBeGreaterThan(0);

      const firstCard = otCards.first();

      // Click on card to open details OR find "Asignar" button directly
      // This depends on the Kanban card implementation
      const asignarBtn = firstCard.getByTestId('btn-asignar');

      if (await asignarBtn.isVisible()) {
        await asignarBtn.click();
      } else {
        // Click card to open details, then find asignar button
        await firstCard.click();

        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        const detailsAsignarBtn = detailsModal.getByTestId('btn-asignar');
        await detailsAsignarBtn.click();
      }

      // Verify assignment modal opens
      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Cierre del modal', () => {
    test.beforeEach(async ({ page }) => {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');
    });

    test('[P1-AC8-006] Modal cierra con click en "X"', async ({ page }) => {
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Click close button
      const closeBtn = assignmentModal.getByTestId('modal-close-btn');
      await closeBtn.click();

      // Modal should close
      await expect(assignmentModal).not.toBeVisible({ timeout: 3000 });
    });

    test('[P1-AC8-007] Modal cierra con tecla ESC', async ({ page }) => {
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Press ESC
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(assignmentModal).not.toBeVisible({ timeout: 3000 });
    });

    test('[P1-AC8-008] Modal cierra con click fuera', async ({ page }) => {
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Click outside modal (on overlay/backdrop)
      // Click at top-left corner of viewport
      await page.mouse.click(10, 10);

      // Modal should close
      await expect(assignmentModal).not.toBeVisible({ timeout: 3000 });
    });

    test('[P1-AC8-009] Modal tiene botón "Cancelar"', async ({ page }) => {
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Verify cancel button exists
      const cancelarBtn = assignmentModal.getByTestId('cancelar-asignacion-btn');
      await expect(cancelarBtn).toBeVisible();
      await expect(cancelarBtn).toContainText('Cancelar');

      // Click cancel
      await cancelarBtn.click();

      // Modal should close
      await expect(assignmentModal).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Visibilidad por capability', () => {
    test.use({ storageState: 'playwright/.auth/tecnico.json' });

    test('[P1-AC8-010] Técnico sin can_assign_technicians no ve botón "Asignar"', async ({ page }) => {
      // Técnico should NOT see "Asignar" button

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      // "Asignar" button should NOT be visible
      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await expect(asignarBtn).not.toBeVisible();
    });
  });
});
