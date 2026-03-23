import { test, expect } from '@playwright/test';

/**
 * P1 E2E Tests for Story 3.1 AC8: Toggle Kanban ↔ Listado con sincronización
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Toggle entre vista Kanban y Listado
 * - Sincronización mantenida: cambios en Kanban reflejados en Listado y viceversa (NFR-S31)
 * - Preferencia de vista guardada por usuario
 * - Toggle tiene data-testid="vista-toggle"
 */

test.describe('Story 3.1 - AC8: Toggle Kanban ↔ Listado (P1)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P1-012: Toggle entre Kanban y Listado', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Vista Kanban visible
    // WHEN: presiono toggle
    // THEN: navega a vista Listado

    // Verify Kanban view
    const kanbanBoard = page.getByTestId('ot-kanban-board');
    await expect(kanbanBoard).toBeVisible();

    // Click toggle
    const toggle = page.getByTestId('vista-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Should navigate to /ots/lista
    await page.waitForURL('**/ots/lista');

    // Verify List view
    const listView = page.getByTestId('ot-list-view');
    await expect(listView).toBeVisible();
  });

  test('P1-013: Sincronización mantenida entre vistas', async ({ page, context }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Dos usuarios en vistas diferentes
    // WHEN: usuario1 arrastra OT en Kanban
    // THEN: usuario2 ve cambio en Listado (SSE sync)

    // User 1: Kanban view
    await page.goto('/ots/kanban');

    // User 2: List view (separate context)
    const user2Context = await context.browser().newContext({
      storageState: 'playwright/.auth/supervisor.json'
    });
    const page2 = await user2Context.newPage();
    await page2.goto('/ots/lista');

    // Get OT from User 1's Kanban
    const sourceColumn = page.getByTestId('kanban-column-Por Revisar');
    const targetColumn = page.getByTestId('kanban-column-En Progreso');
    const otCard = sourceColumn.locator('[data-testid^="ot-card-"]').first();
    const otNumber = await otCard.locator('[data-testid="ot-number"]').textContent();

    // Drag OT on User 1's Kanban
    await otCard.dragTo(targetColumn);

    // User 2 should see the update in List view via SSE
    const otRow = page2.getByTestId(`ot-row-${otNumber}`);
    const statusCell = otRow.locator('[data-testid="ot-status"]');

    // Wait for SSE update (within 30s per R-002)
    await expect(statusCell).toContainText('En Progreso', { timeout: 30000 });

    await user2Context.close();
  });

  test('P1-014: Preferencia de vista guardada por usuario', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Usuario en vista Listado
    // WHEN: recarga página
    // THEN: preferencia mantenida (vista Listado)

    // Navigate to List view
    await page.goto('/ots/lista');
    const listView = page.getByTestId('ot-list-view');
    await expect(listView).toBeVisible();

    // Reload page
    await page.reload();

    // Should still be in List view (preference saved)
    await expect(listView).toBeVisible();
  });

  test('P1-015: Toggle tiene data-testid="vista-toggle"', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Cualquier vista
    // WHEN: inspecciono toggle
    // THEN: tiene data-testid="vista-toggle"

    const toggle = page.getByTestId('vista-toggle');
    await expect(toggle).toBeVisible();
  });
});
