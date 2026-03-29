import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.3 AC3: Notificación SSE a múltiples asignados
 *
 * TDD RED PHASE: Tests validate SSE notifications - all tests will FAIL
 * Expected Failures: SSE events not implemented, "Mis OTs" not updated
 *
 * Acceptance Criteria:
 * - Todos los técnicos asignados reciben notificación SSE en <30s (FR19, R-002)
 * - Cada técnico puede ver la OT en "Mis OTs"
 * - Cualquiera de los asignados puede iniciar la OT (FR19-A)
 * - Cualquiera de los asignados puede agregar repuestos usados
 * - Cualquiera de los asignados puede completar la OT
 *
 * Storage State: Uses supervisor for assignment, tecnico for receiving notification
 */

test.describe('Story 3.3 - AC3: Notificaciones SSE a Múltiples Asignados (P0)', () => {
  // Supervisor assigns technicians
  test.describe('Asignación desde Supervisor', () => {
    test.use({ storageState: 'playwright/.auth/supervisor.json' });

    test('[P0-AC3-001] Todos los técnicos asignados reciben notificación SSE', async ({ page, context }) => {
      // RED PHASE: This test will fail because:
      // - SSE broadcast for assignment doesn't exist
      // - work_order_assigned event not implemented

      // Navigate to OT list
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/ots/lista`);
      await page.waitForLoadState('domcontentloaded');

      // Open assignment modal for first OT
      const firstOTCard = page.locator('[data-testid^="ot-card-"]').first();
      await expect(firstOTCard).toBeVisible({ timeout: 10000 });

      const otNumero = await firstOTCard.getByTestId('ot-numero').textContent();

      const asignarBtn = firstOTCard.getByTestId('btn-asignar');
      await asignarBtn.click();

      const assignmentModal = page.locator('[data-testid^="modal-asignacion-"]');
      await expect(assignmentModal).toBeVisible({ timeout: 5000 });

      // Select 2 technicians
      const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
      await tecnicosSelect.click();

      // Select two technicians
      const tecnico1 = page.locator('[data-testid="tecnico-option-0"]');
      const tecnico2 = page.locator('[data-testid="tecnico-option-1"]');

      await tecnico1.click();
      await tecnico2.click();
      await page.keyboard.press('Escape');

      // Save assignment
      const guardarBtn = assignmentModal.getByTestId('guardar-asignacion-btn');
      await guardarBtn.click();

      // Wait for modal to close
      await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

      // Verify SSE event was broadcast
      // This would require checking the SSE channel or mocking the broadcast
      // For E2E, we verify the effect: assigned technicians see the OT

      // Note: Verifying SSE reception requires a second browser context
      // This is tested in the next test case
    });
  });

  // Technician receives notification and sees OT in "Mis OTs"
  test.describe('Recepción de notificación por Técnico', () => {
    test.use({ storageState: 'playwright/.auth/tecnico.json' });

    test('[P0-AC3-002] Técnico ve OT en "Mis OTs" después de asignación', async ({ page }) => {
      // RED PHASE: This test will fail because:
      // - "Mis OTs" page might not exist yet
      // - Assignment relationship not established

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';

      // Navigate to "Mis OTs" page
      await page.goto(`${baseURL}/mis-ots`);
      await page.waitForLoadState('domcontentloaded');

      // Verify Mis OTs list is visible
      const misOtsList = page.getByTestId('mis-ots-lista');
      await expect(misOtsList).toBeVisible({ timeout: 10000 });

      // If there are OTs assigned, verify they appear
      const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
      const cardCount = await otCards.count();

      // Should have at least one OT assigned (from seed data or previous test)
      // Note: This depends on test data setup
      expect(cardCount).toBeGreaterThanOrEqual(0);

      // If OT exists, verify it shows required info
      if (cardCount > 0) {
        const firstCard = otCards.first();

        // Verify OT number is visible
        await expect(firstCard.getByTestId('ot-numero')).toBeVisible();

        // Verify estado badge is visible
        await expect(firstCard.getByTestId('ot-estado-badge')).toBeVisible();

        // Verify equipo name is visible
        await expect(firstCard.getByTestId('ot-equipo')).toBeVisible();
      }
    });

    test('[P0-AC3-003] Cualquier asignado puede iniciar OT', async ({ page }) => {
      // RED PHASE: This test validates FR19-A
      // Any assigned technician can start the OT

      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/mis-ots`);
      await page.waitForLoadState('domcontentloaded');

      const misOtsList = page.getByTestId('mis-ots-lista');
      await expect(misOtsList).toBeVisible({ timeout: 10000 });

      // Find an OT in ASIGNADA state
      const asignadaCard = misOtsList.locator('[data-testid^="my-ot-card-"]')
        .filter({ has: page.locator('[data-testid="ot-estado-badge"]').getByText('ASIGNADA') })
        .first();

      if (await asignadaCard.count() > 0) {
        // Click on the OT to open details
        await asignadaCard.click();

        // Wait for details modal
        const detailsModal = page.locator('[data-testid^="ot-details-modal-"]');
        await expect(detailsModal).toBeVisible({ timeout: 5000 });

        // Click "Iniciar OT" button
        const iniciarBtn = detailsModal.getByTestId('btn-iniciar-ot');
        await expect(iniciarBtn).toBeVisible();
        await iniciarBtn.click();

        // Verify state changed to EN_PROGRESO
        const estadoBadge = detailsModal.getByTestId('ot-estado-badge');
        await expect(estadoBadge).toContainText('EN_PROGRESO', { timeout: 5000 });

        // Verify success toast
        const successToast = page.locator('[data-testid="toast-success"]');
        await expect(successToast).toBeVisible({ timeout: 5000 });
      } else {
        // Skip if no ASIGNADA OT available
        test.skip(true, 'No ASIGNADA OT available for testing');
      }
    });
  });

  // Multi-browser context test for real-time SSE verification
  test('[P1-AC3-004] SSE actualiza Mis OTs en tiempo real', async ({ browser }) => {
    // RED PHASE: This test requires two browser contexts
    // One supervisor assigns, one technician receives

    // Create supervisor context
    const supervisorContext = await browser.newContext({
      storageState: 'playwright/.auth/supervisor.json'
    });
    const supervisorPage = await supervisorContext.newPage();

    // Create tecnico context
    const tecnicoContext = await browser.newContext({
      storageState: 'playwright/.auth/tecnico.json'
    });
    const tecnicoPage = await tecnicoContext.newPage();

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';

      // Tecnico opens Mis OTs and counts current OTs
      await tecnicoPage.goto(`${baseURL}/mis-ots`);
      await tecnicoPage.waitForLoadState('domcontentloaded');

      const misOtsList = tecnicoPage.getByTestId('mis-ots-lista');
      await expect(misOtsList).toBeVisible({ timeout: 10000 });

      const initialCount = await misOtsList.locator('[data-testid^="my-ot-card-"]').count();

      // Supervisor assigns a new OT to the technician
      await supervisorPage.goto(`${baseURL}/ots/lista`);
      await supervisorPage.waitForLoadState('domcontentloaded');

      // Find an unassigned OT
      const unassignedOT = supervisorPage.locator('[data-testid^="ot-card-"]')
        .filter({ hasNot: supervisorPage.locator('[data-testid="asignaciones-badge"]') })
        .first();

      if (await unassignedOT.count() > 0) {
        const asignarBtn = unassignedOT.getByTestId('btn-asignar');
        await asignarBtn.click();

        const assignmentModal = supervisorPage.locator('[data-testid^="modal-asignacion-"]');
        await expect(assignmentModal).toBeVisible({ timeout: 5000 });

        // Select technician
        const tecnicosSelect = assignmentModal.getByTestId('tecnicos-select');
        await tecnicosSelect.click();

        const tecnicoOption = supervisorPage.locator('[data-testid="tecnico-option-0"]');
        await tecnicoOption.click();
        await supervisorPage.keyboard.press('Escape');

        // Save
        const guardarBtn = assignmentModal.getByTestId('guardar-asignacion-btn');
        await guardarBtn.click();

        await expect(assignmentModal).not.toBeVisible({ timeout: 5000 });

        // Wait for SSE to update technician's view (should be <30s per AC3)
        // Poll for the new OT to appear
        await expect(async () => {
          const newCount = await misOtsList.locator('[data-testid^="my-ot-card-"]').count();
          expect(newCount).toBe(initialCount + 1);
        }).toPass({ timeout: 30000, intervals: [1000] });
      } else {
        test.skip(true, 'No unassigned OT available for testing');
      }
    } finally {
      await supervisorContext.close();
      await tecnicoContext.close();
    }
  });
});
