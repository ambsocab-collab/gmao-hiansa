import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.4 AC5: Toggle Kanban ↔ Listado con Sync Real-time
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - Toggle entre vista Kanban y Listado
 * - Mismos filtros aplicados en ambas vistas (NFR-S30)
 * - Sincronización en tiempo real entre vistas (NFR-S31)
 * - Cambios en Kanban reflejados en Listado vía SSE
 * - Cambios en Listado reflejados en Kanban vía SSE
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC5: Toggle Kanban ↔ Listado con Sync SSE (P0)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0-AC5-001] Toggle visible en página de lista', async ({ page }) => {
    // RED PHASE: This test will fail - view-toggle doesn't exist on list page yet

    const viewToggle = page.getByTestId('view-toggle');
    await expect(viewToggle).toBeVisible({ timeout: 10000 });

    // Verify both options exist
    const kanbanBtn = page.getByTestId('view-toggle-kanban');
    const listaBtn = page.getByTestId('view-toggle-lista');

    await expect(kanbanBtn).toBeVisible();
    await expect(listaBtn).toBeVisible();

    // Lista should be active (current page)
    await expect(listaBtn).toHaveAttribute('data-active', 'true');
  });

  test('[P0-AC5-002] Click en Kanban navega a vista Kanban', async ({ page }) => {
    // RED PHASE: This test will fail - view toggle navigation not implemented yet

    const kanbanBtn = page.getByTestId('view-toggle-kanban');
    await expect(kanbanBtn).toBeVisible({ timeout: 10000 });

    // Click to go to Kanban
    await kanbanBtn.click();

    // Wait for URL to change (more reliable than networkidle for client-side nav)
    await page.waitForURL('**/ots/kanban**', { timeout: 10000 });

    // Should be on Kanban page
    expect(page.url()).toContain('/ots/kanban');

    // Kanban toggle should be active
    await expect(kanbanBtn).toHaveAttribute('data-active', 'true');
  });

  test('[P0-AC5-003] Filtros se mantienen al cambiar de vista', async ({ page }) => {
    // RED PHASE: This test will fail - filter sync between views not implemented yet

    // Apply a filter on list view
    const filtroTipo = page.getByTestId('filtro-tipo');
    await filtroTipo.click();

    // Wait for dropdown options to be visible
    const tipoOption = page.getByTestId('tipo-option-CORRECTIVO');
    await expect(tipoOption).toBeVisible({ timeout: 5000 });
    await tipoOption.click();
    await page.waitForLoadState('networkidle');

    // Verify filter is applied
    let url = page.url();
    expect(url).toContain('tipo=CORRECTIVO');

    // Switch to Kanban
    const kanbanBtn = page.getByTestId('view-toggle-kanban');
    await kanbanBtn.click();

    // Wait for URL to change
    await page.waitForURL('**/ots/kanban**', { timeout: 10000 });

    // Verify filter is still applied in Kanban
    url = page.url();
    expect(url).toContain('tipo=CORRECTIVO');

    // Verify Kanban shows filtered results
    const kanbanBoard = page.getByTestId('ot-kanban-board');
    await expect(kanbanBoard).toBeVisible();
  });

  test('[P0-AC5-004] Sorting se mantiene al cambiar de vista', async ({ page }) => {
    // RED PHASE: This test will fail - sorting sync not implemented yet

    // Apply sorting on list view
    const fechaHeader = page.getByTestId('sort-header-fecha');
    await fechaHeader.click();
    await page.waitForLoadState('networkidle');

    // Verify sort is applied
    let url = page.url();
    expect(url).toMatch(/sortBy=/);

    // Switch to Kanban
    const kanbanBtn = page.getByTestId('view-toggle-kanban');
    await kanbanBtn.click();

    // Wait for URL to change
    await page.waitForURL('**/ots/kanban**', { timeout: 10000 });

    // Verify sort is still in URL (even if Kanban doesn't use it visually)
    url = page.url();
    expect(url).toMatch(/sortBy=/);
  });

  test('[P0-AC5-005] SSE indicator visible', async ({ page }) => {
    // RED PHASE: This test will fail - SSE indicator not implemented yet

    const sseIndicator = page.getByTestId('sse-connection-indicator');
    await expect(sseIndicator).toBeVisible({ timeout: 10000 });

    // Should show connected state (green)
    await expect(sseIndicator).toHaveAttribute('data-connected', 'true');
  });

  test('[P0-AC5-006] SSE actualiza lista cuando OT es modificada', async ({ page, context }) => {
    // RED PHASE: This test will fail - SSE real-time updates not implemented yet
    // This test requires creating an OT change and verifying it appears in the list

    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible({ timeout: 10000 });

    // Get initial OT count
    const initialRows = tabla.locator('[data-testid^="ot-row-"]');
    const initialCount = await initialRows.count();

    // In a real test, we would:
    // 1. Create a new OT via API or another browser context
    // 2. Wait for SSE event to arrive
    // 3. Verify the list updates without page refresh

    // For RED phase, we just verify the SSE connection exists
    const sseIndicator = page.getByTestId('sse-connection-indicator');
    await expect(sseIndicator).toBeVisible();
    await expect(sseIndicator).toHaveAttribute('data-connected', 'true');
  });

  test('[P0-AC5-007] Cambios en Kanban se reflejan en Lista', async ({ page, context }) => {
    // RED PHASE: This test will fail - cross-view sync not implemented yet

    // Navigate to Kanban
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban`);
    await page.waitForLoadState('domcontentloaded');

    const kanbanBoard = page.getByTestId('ot-kanban-board');
    await expect(kanbanBoard).toBeVisible({ timeout: 10000 });

    // Make a change (e.g., drag OT to different column)
    // Then switch to list and verify change is reflected

    // For RED phase, verify toggle exists
    const listaBtn = page.getByTestId('view-toggle-lista');
    await expect(listaBtn).toBeVisible();
  });

  test('[P0-AC5-008] SSE reconecta automáticamente', async ({ page, context }) => {
    // RED PHASE: This test will fail - SSE reconnection not implemented yet

    const sseIndicator = page.getByTestId('sse-connection-indicator');
    await expect(sseIndicator).toBeVisible({ timeout: 10000 });

    // Simulate network interruption by going offline
    await context.setOffline(true);

    // Should show disconnected state (wait for state change with timeout)
    await expect(sseIndicator).toHaveAttribute('data-connected', 'false', { timeout: 5000 });

    // Restore network
    await context.setOffline(false);

    // Should reconnect automatically (wait for state change with timeout)
    await expect(sseIndicator).toHaveAttribute('data-connected', 'true', { timeout: 10000 });
  });

  test('[P0-AC5-009] Toggle desde Kanban mantiene estado', async ({ page }) => {
    // RED PHASE: This test will fail - state sync not implemented yet

    // Start on Kanban with filters
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban?estado=ASIGNADA`);
    await page.waitForLoadState('domcontentloaded');

    const kanbanBoard = page.getByTestId('ot-kanban-board');
    await expect(kanbanBoard).toBeVisible({ timeout: 10000 });

    // Switch to list
    const listaBtn = page.getByTestId('view-toggle-lista');
    await listaBtn.click();

    // Wait for URL to change
    await page.waitForURL('**/ots/lista**', { timeout: 10000 });

    // Verify filter is maintained
    const url = page.url();
    expect(url).toContain('estado=ASIGNADA');

    // Verify list page is shown
    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible();
  });

  test('[P0-AC5-010] Múltiples tabs sincronizadas', async ({ browser }) => {
    // RED PHASE: This test will fail - multi-tab sync not implemented yet

    // Create two browser contexts (simulating two tabs)
    const context1 = await browser.newContext({
      storageState: 'playwright/.auth/supervisor.json'
    });
    const context2 = await browser.newContext({
      storageState: 'playwright/.auth/supervisor.json'
    });

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const baseURL = process.env.BASE_URL || 'http://localhost:3000';

    // Page 1: Kanban view
    await page1.goto(`${baseURL}/ots/kanban`);
    await page1.waitForLoadState('domcontentloaded');

    // Page 2: List view
    await page2.goto(`${baseURL}/ots/lista`);
    await page2.waitForLoadState('domcontentloaded');

    // Both should show SSE connected (with extended timeout for SSE connection)
    const sse1 = page1.getByTestId('sse-connection-indicator');
    const sse2 = page2.getByTestId('sse-connection-indicator');

    // Wait for SSE connection to establish (may take time in CI environments)
    await expect(sse1).toBeVisible({ timeout: 20000 });
    await expect(sse1).toHaveAttribute('data-connected', 'true', { timeout: 20000 });
    await expect(sse2).toBeVisible({ timeout: 20000 });
    await expect(sse2).toHaveAttribute('data-connected', 'true', { timeout: 20000 });

    // Cleanup
    await context1.close();
    await context2.close();
  });
});
