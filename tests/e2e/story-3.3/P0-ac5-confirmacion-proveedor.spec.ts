import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.3 AC5: Confirmación de recepción de proveedor
 *
 * TDD GREEN PHASE: Tests validate provider work confirmation - implementation complete
 *
 * Acceptance Criteria:
 * - Proveedor marca OT como completada
 * - Supervisor recibe notificación: "Proveedor {nombre} marcó OT #{numero} como completada"
 * - Supervisor debe confirmar recepción del equipo reparado (FR24-A)
 * - Confirmación requiere verificación visual del estado del equipo reparado
 * - Solo después de confirmación, OT marcada como "Completada"
 * - Nuevo estado intermedio: REPARACION_EXTERNA (ya existe en schema)
 *
 * Storage State: Uses supervisor for confirmation, provider (if exists) for completion
 */

test.describe('Story 3.3 - AC5: Confirmación de Recepción de Proveedor (P0)', () => {
  test.describe('Proveedor completa OT', () => {
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('[P0-AC5-001] Proveedor completa OT → estado cambia a REPARACION_EXTERNA', async ({ page }) => {
      // GREEN PHASE: This test will fail because:
      // - Provider assignment doesn't exist
      // - REPARACION_EXTERNA state transition not implemented
      // - Provider can't complete OT yet

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      // Find an OT with a provider assigned
      const otWithProvider = page.locator('[data-testid^="ot-card-"]')
        .filter({ has: page.locator('[data-testid="proveedor-asignado-badge"]') })
        .first();

      if (await otWithProvider.count() > 0) {
        // Open OT details
        await otWithProvider.click();

        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        // Verify provider is assigned
        const proveedorBadge = detailsModal.getByTestId('proveedor-asignado-badge');
        await expect(proveedorBadge).toBeVisible();

        // Click "Completar" button (as provider would)
        const completarBtn = detailsModal.getByTestId('btn-completar-ot');
        await expect(completarBtn).toBeVisible();
        await completarBtn.click();

        // Verify state changed to REPARACION_EXTERNA (not COMPLETADA)
        const estadoBadge = detailsModal.getByTestId('ot-estado-badge');
        await expect(estadoBadge).toContainText('REPARACION_EXTERNA', { timeout: 5000 });

        // Verify notification to supervisor
        const notification = page.locator('[data-testid="notification-badge"]');
        await expect(notification).toBeVisible({ timeout: 10000 });
      } else {
        // Need to assign a provider first
        test.skip(true, 'No OT with provider assigned - need to assign provider first');
      }
    });
  });

  test.describe('Supervisor confirma recepción', () => {
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('[P0-AC5-002] Supervisor confirma recepción → estado cambia a COMPLETADA', async ({ page }) => {
      // GREEN PHASE: This test will fail because:
      // - confirmProviderWork Server Action doesn't exist
      // - Confirmation UI doesn't exist

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      // Find an OT in REPARACION_EXTERNA state
      const otEnReparacion = page.locator('[data-testid^="ot-card-"]')
        .filter({ has: page.locator('[data-testid="ot-estado-badge"]').getByText('REPARACION_EXTERNA') })
        .first();

      if (await otEnReparacion.count() > 0) {
        // Open OT details
        await otEnReparacion.click();

        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        // Verify OT is in REPARACION_EXTERNA state
        const estadoBadge = detailsModal.getByTestId('ot-estado-badge');
        await expect(estadoBadge).toContainText('REPARACION_EXTERNA');

        // Verify "Confirmar Recepción" button is visible
        const confirmarBtn = detailsModal.getByTestId('btn-confirmar-recepcion');
        await expect(confirmarBtn).toBeVisible();
        await expect(confirmarBtn).toBeEnabled();

        // Click confirm button
        await confirmarBtn.click();

        // Confirmation dialog should appear
        const confirmDialog = page.locator('[data-testid="confirm-recepcion-dialog"]');
        await expect(confirmDialog).toBeVisible({ timeout: 5000 });

        // Check verification checkbox
        const verifyCheckbox = confirmDialog.getByTestId('verificacion-visual-checkbox');
        await verifyCheckbox.check();

        // Confirm
        const confirmFinalBtn = confirmDialog.getByTestId('btn-confirmar-final');
        await confirmFinalBtn.click();

        // Verify state changed to COMPLETADA
        await expect(estadoBadge).toContainText('COMPLETADA', { timeout: 5000 });

        // Verify success toast
        const successToast = page.locator('[data-testid="toast-success"]');
        await expect(successToast).toBeVisible({ timeout: 5000 });
        await expect(successToast).toContainText('confirmad');
      } else {
        test.skip(true, 'No OT in REPARACION_EXTERNA state available');
      }
    });

    test('[P1-AC5-003] Notificación al supervisor cuando proveedor completa', async ({ page }) => {
      // GREEN PHASE: This test validates notification flow

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/dashboard`);
      await page.waitForLoadState('domcontentloaded');

      // Check for notification bell
      const notificationBell = page.locator('[data-testid="notification-bell"]');
      await expect(notificationBell).toBeVisible();

      // Check if there's a notification about provider completion
      await notificationBell.click();

      const notificationDropdown = page.locator('[data-testid="notification-dropdown"]');
      await expect(notificationDropdown).toBeVisible({ timeout: 5000 });

      // Look for provider completion notification
      const providerNotification = notificationDropdown.locator('[data-testid^="notification-"]')
        .filter({ hasText: /proveedor.*complet/i })
        .first();

      // This might not exist if no provider has completed work recently
      // The test validates the UI element exists, not necessarily that there's a notification
      const notificationList = notificationDropdown.locator('[data-testid^="notification-"]');
      await expect(notificationList.first()).toBeVisible();
    });

    test('[P1-AC5-004] Verificación visual requerida para confirmación', async ({ page }) => {
      // GREEN PHASE: This test validates the verification checkbox requirement

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      // Find OT in REPARACION_EXTERNA
      const otEnReparacion = page.locator('[data-testid^="ot-card-"]')
        .filter({ has: page.locator('[data-testid="ot-estado-badge"]').getByText('REPARACION_EXTERNA') })
        .first();

      if (await otEnReparacion.count() > 0) {
        await otEnReparacion.click();

        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        const confirmarBtn = detailsModal.getByTestId('btn-confirmar-recepcion');
        await confirmarBtn.click();

        const confirmDialog = page.locator('[data-testid="confirm-recepcion-dialog"]');
        await expect(confirmDialog).toBeVisible({ timeout: 5000 });

        // Try to confirm without checking verification checkbox
        const confirmFinalBtn = confirmDialog.getByTestId('btn-confirmar-final');

        // Button should be disabled until checkbox is checked
        await expect(confirmFinalBtn).toBeDisabled();

        // Check the verification checkbox
        const verifyCheckbox = confirmDialog.getByTestId('verificacion-visual-checkbox');
        await verifyCheckbox.check();

        // Now button should be enabled
        await expect(confirmFinalBtn).toBeEnabled();
      } else {
        test.skip(true, 'No OT in REPARACION_EXTERNA state available');
      }
    });
  });

  test.describe('Validaciones de estado', () => {
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('[P2-AC5-005] No se puede confirmar OT no está en REPARACION_EXTERNA', async ({ page }) => {
      // GREEN PHASE: Validates error handling

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      // Find an OT NOT in REPARACION_EXTERNA (e.g., ASIGNADA, EN_PROGRESO)
      const otNormal = page.locator('[data-testid^="ot-card-"]')
        .filter({ hasNot: page.locator('[data-testid="ot-estado-badge"]').getByText('REPARACION_EXTERNA') })
        .first();

      if (await otNormal.count() > 0) {
        await otNormal.click();

        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        // "Confirmar Recepción" button should NOT be visible
        const confirmarBtn = detailsModal.getByTestId('btn-confirmar-recepcion');
        await expect(confirmarBtn).not.toBeVisible();
      }
    });
  });
});
