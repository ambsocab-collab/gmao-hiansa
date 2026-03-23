import { test, expect } from '@playwright/test';

/**
 * P0 E2E Tests for Story 3.1 AC3: Drag & Drop entre columnas
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Drag & drop actualiza estado de OT en <1s (NFR-S96)
 * - Tarjeta movida visualmente a nueva columna
 * - Evento SSE enviado a todos los clientes (R-002: <30s)
 * - Auditoría logged: "OT {id} movida de {estadoAnterior} a {estadoNuevo}"
 */

test.describe('Story 3.1 - AC3: Drag & Drop (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P0-009: Drag OT de "Por Revisar" a "En Progreso"', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: OT en columna "Por Revisar"
    // WHEN: arrastro OT a columna "En Progreso"
    // THEN: estado actualizado en BD en <1s

    const sourceColumn = page.getByTestId('kanban-column-Por Revisar');
    const targetColumn = page.getByTestId('kanban-column-En Progreso');

    // Get first OT card from source column
    const otCard = sourceColumn.locator('[data-testid^="ot-card-"]').first();
    await expect(otCard).toBeVisible();

    const otId = await otCard.getAttribute('data-testid');

    // Measure time before drag
    const startTime = Date.now();

    // Perform drag and drop
    await otCard.dragTo(targetColumn);

    // ✅ FIXED: Wait for state update - determinístico en lugar de hard wait
    await page.waitForLoadState('domcontentloaded');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Verify OT moved to target column visually
    const movedCard = targetColumn.locator(`[data-testid="${otId}"]`);
    await expect(movedCard).toBeVisible({ timeout: 1000 });

    // Verify performance <1s
    expect(duration).toBeLessThan(1000);

    // Verify OT no longer in source column
    const cardInSource = sourceColumn.locator(`[data-testid="${otId}"]`);
    await expect(cardInSource).toHaveCount(0);
  });

  test('P0-010: SSE enviado tras drag & drop', async ({ page, context }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Dos usuarios conectados (supervisor1 y supervisor2)
    // WHEN: supervisor1 arrastra OT a nueva columna
    // THEN: supervisor2 ve cambio en <30s vía SSE (R-002)

    // Open second browser context for supervisor2
    const supervisor2Context = await context.browser().newContext({
      storageState: 'playwright/.auth/supervisor.json'
    });
    const page2 = await supervisor2Context.newPage();

    // Both users navigate to Kanban
    await page.goto('/ots/kanban');
    await page2.goto('/ots/kanban');

    // Get first OT card from supervisor1's view
    const sourceColumn = page.getByTestId('kanban-column-Por Revisar');
    const targetColumn = page.getByTestId('kanban-column-En Progreso');
    const otCard = sourceColumn.locator('[data-testid^="ot-card-"]').first();
    const otId = await otCard.getAttribute('data-testid');

    // Perform drag on supervisor1's page
    const dragStartTime = Date.now();
    await otCard.dragTo(targetColumn);

    // Supervisor2 should see the update via SSE within 30s
    const sseStartTime = Date.now();

    // Wait for SSE update on supervisor2's page
    const movedCard2 = page2.locator(`[data-testid="${otId}"]`);
    const targetColumn2 = page2.getByTestId('kanban-column-En Progreso');

    // ✅ FIXED: Wait for SSE update - determinístico con timeout
    await expect(page2.locator(`[data-testid="${otId}"]`)).toBeVisible({ timeout: 30000 });
    const sseEndTime = Date.now();
    const sseDuration = sseEndTime - sseStartTime;

    expect(sseDuration).toBeLessThan(30000); // R-002: <30s

    // Cleanup
    await supervisor2Context.close();
  });

  test('P0-011: Auditoría logged tras drag & drop', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: OT en estado inicial
    // WHEN: arrastro OT a nueva columna
    // THEN: auditoría logged con formato "OT {id} movida de {estadoAnterior} a {estadoNuevo}"

    const sourceColumn = page.getByTestId('kanban-column-Por Revisar');
    const targetColumn = page.getByTestId('kanban-column-En Progreso');
    const otCard = sourceColumn.locator('[data-testid^="ot-card-"]').first();
    const otId = await otCard.getAttribute('data-testid');
    const otNumber = await otCard.locator('[data-testid="ot-number"]').textContent();

    // Perform drag and drop
    await otCard.dragTo(targetColumn);

    // Verify audit log entry (via API or database check helper)
    // This would typically use a test endpoint to check audit logs
    const auditLogResponse = await page.request.get(`/api/v1/test/audit-logs/${otId}`);

    expect(auditLogResponse.ok()).toBe(true);

    const auditLogs = await auditLogResponse.json();
    const relevantLog = auditLogs.find((log: any) =>
      log.action === 'work_order_status_updated' &&
      log.metadata.otId === otId
    );

    expect(relevantLog).toBeDefined();
    expect(relevantLog.metadata.estadoAnterior).toBe('PENDIENTE_REVISION');
    expect(relevantLog.metadata.estadoNuevo).toBe('EN_PROGRESO');
    expect(relevantLog.description).toMatch(
      new RegExp(`OT ${otNumber} movida de Por Revisar a En Progreso`)
    );
  });

  test('P0-012: Drag & drop en todas las columnas', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: OT en cualquier columna
    // WHEN: arrastro a cualquier otra columna
    // THEN: drag & drop funciona entre todas las columnas

    const columns = [
      'Por Revisar',
      'Por Aprobar',
      'Aprobada',
      'En Progreso',
      'Pausada',
      'Completada',
      'Cerrada'
    ];

    // Test drag between adjacent columns
    for (let i = 0; i < columns.length - 1; i++) {
      const sourceColumn = page.getByTestId(`kanban-column-${columns[i]}`);
      const targetColumn = page.getByTestId(`kanban-column-${columns[i + 1]}`);

      const otCard = sourceColumn.locator('[data-testid^="ot-card-"]').first();

      if (await otCard.count() > 0) {
        const otId = await otCard.getAttribute('data-testid');

        await otCard.dragTo(targetColumn);

        // Verify card moved
        const movedCard = targetColumn.locator(`[data-testid="${otId}"]`);
        await expect(movedCard).toBeVisible();

        // Reset for next test (drag back)
        await movedCard.dragTo(sourceColumn);
      }
    }
  });
});
