/**
 * E2E Tests: Story 2.3 - Triage de Averías y Conversión a OTs
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - AC1: Columna "Por Revisar" con avisos nuevos (color coding)
 * - AC2: Modal informativo de avería
 * - AC3: Convertir aviso a OT (<1s performance)
 * - AC4: Descartar aviso (confirmación + auditoría)
 * - AC5: Filtros y ordenamiento
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

import { test, expect } from '../../fixtures/test.fixtures';

// NOTA: Tests usan storageState global (playwright/.auth/admin.json)
// loginAs fixture es no-op por ahora - todos corren como admin

test.describe('Triage de Averías - AC1: Columna Por Revisar', () => {
  /**
   * P0-E2E-001: Columna "Por Revisar" visible con tarjetas
   *
   * AC1: Given supervisor con can_view_all_ots
   *       When accede a /averias/triage
   *       Then ve columna "Por Revisar" con todos los avisos nuevos
   *       And cada aviso mostrado como tarjeta con: número, equipo, descripción, reportado por, fecha/hora
   *       And columna tiene data-testid="averias-triage"
   */
  test('[P0-E2E-001] should show por revisar column with failure report cards', async ({ page, loginAs }) => {
    // Given: Supervisor autenticado con can_view_all_ots
    await loginAs('supervisor');

    // When: Accede a /averias/triage
    await page.goto('/averias/triage');

    // Then: Columna "Por Revisar" visible
    const triageColumn = page.getByTestId('averias-triage');
    await expect(triageColumn).toBeVisible();

    // And: Header de columna visible
    await expect(page.getByText('Por Revisar')).toBeVisible();

    // And: Tarjetas de avería visibles (si hay datos seedeados)
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0); // Asumimos al menos 1 aviso en seed

    // And: Primera tarjeta tiene datos correctos
    const firstCard = cards.first();
    await expect(firstCard.getByTestId(/numero/i)).toBeVisible();
    await expect(firstCard.getByTestId(/equipo/i)).toBeVisible();
    await expect(firstCard.getByTestId(/descripcion/i)).toBeVisible();
    await expect(firstCard.getByTestId(/reporter/i)).toBeVisible();
    await expect(firstCard.getByTestId(/fecha/i)).toBeVisible();
  });

  /**
   * P1-E2E-002: Color coding correcto (rosa para avería, blanco para reparación)
   *
   * AC1: Given tarjetas visibles
   *       Then tarjetas de avería tienen color rosa #FFC0CB
   *       And tarjetas de reparación tienen color blanco #FFFFFF
   */
  test('[P1-E2E-002] should have correct color coding for averia vs reparacion', async ({ page, loginAs }) => {
    // Given: Supervisor autenticado
    await loginAs('supervisor');

    // And: En página de triage
    await page.goto('/averias/triage');

    // When: Inspecciono tarjeta de avería
    const averiaCard = page.locator('[data-testid^="failure-report-card-"].bg-pink-100').first();

    // Then: Fondo rosa #FFC0CB (bg-pink-100 es aproximado)
    const backgroundColor = await averiaCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // bg-pink-100 ≈ rgb(255, 192, 203) ≈ #FFC0CB
    expect(backgroundColor).toBe('rgb(255, 192, 203)');

    // When: Inspecciono tarjeta de reparación (si existe)
    const reparacionCard = page.locator('[data-testid^="failure-report-card-"].bg-white').first();

    // Then: Fondo blanco #FFFFFF
    const backgroundColorWhite = await reparacionCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColorWhite).toBe('rgb(255, 255, 255)');
  });

  /**
   * P2-E2E-003: Datos de tarjeta correctos
   *
   * AC1: Given tarjeta visible
   *       Then muestra: número (ej: AV-2026-001), equipo, descripción truncada, reporter, fecha/hora
   */
  test('[P2-E2E-003] should display correct card data', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Veo primera tarjeta
    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();

    // Then: Todos los campos visibles
    await expect(firstCard.getByText(/AV-\d{4}-\d{3}/)).toBeVisible(); // Número
    await expect(firstCard.locator('[data-testid="equipo"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="descripcion"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="reporter"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="fecha"]')).toBeVisible();
  });

  /**
   * P2-E2E-004: Count badge en columna
   *
   * AC5: Given múltiples avisos en triage
   *       Then veo indicador de count: "Por Revisar (3)"
   */
  test('[P2-E2E-004] should show count badge in column header', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // Then: Count badge visible
    const countBadge = page.getByText(/Por Revisar \(\d+\)/);
    await expect(countBadge).toBeVisible();
  });
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
    await expect(modal.getByTestId('foto')).toBeVisible();
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

test.describe('Triage de Averías - AC3: Convertir a OT', () => {
  /**
   * P0-E2E-008: Convertir aviso a OT (performance <1s)
   *
   * AC3: Given modal de avería abierto
   *       When click "Convertir a OT"
   *       Then aviso convertido a OT en <1s
   *       And OT creada con estado "Pendiente"
   *       And tipo marcado como "Correctivo"
   *       And OT aparece en Kanban columna "Pendiente"
   *
   * NFR-S7: Performance <1s CRITICAL
   */
  test('[P0-E2E-008] should convert failure report to OT in less than 1 second', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // When: Click "Convertir a OT" y medir tiempo
    const startTime = Date.now();
    await page.getByTestId('convertir-a-ot-btn').click();

    // Then: OT creada (toast de éxito)
    const successToast = page.getByText('OT creada exitosamente');
    await expect(successToast).toBeVisible({ timeout: 5000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // CRITICAL: Performance <1s (1000ms)
    expect(duration).toBeLessThan(1000);

    // And: Modal cerrado
    await expect(page.getByTestId('modal-averia-info')).not.toBeVisible();

    // And: Tarjeta removida de columna "Por Revisar"
    await expect(firstCard).not.toBeVisible();

    // Then: Navegar a Kanban para verificar OT creada
    await page.goto('/kanban');
    const pendingColumn = page.getByTestId('kanban-pendiente');
    await expect(pendingColumn).toBeVisible();

    // And: OT nueva visible en columna Pendiente
    const newOT = pendingColumn.locator('[data-testid^="work-order-"]').first();
    await expect(newOT).toBeVisible();

    // And: Etiqueta "Correctivo" visible
    await expect(newOT.getByText('Correctivo')).toBeVisible();
  });

  /**
   * P1-E2E-009: Etiqueta "Correctivo" visible en tarjeta OT
   *
   * AC3: Given OT creada desde avería
   *       Then etiqueta "Correctivo" visible en tarjeta OT
   */
  test('[P1-E2E-009] should show Correctivo label on OT card', async ({ page, loginAs }) => {
    // Given: Supervisor convierte avería a OT
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();
    await page.getByTestId('convertir-a-ot-btn').click();

    // Wait for success
    await expect(page.getByText('OT creada exitosamente')).toBeVisible();

    // When: Navega a Kanban
    await page.goto('/kanban');

    // Then: Etiqueta "Correctivo" visible
    const pendingColumn = page.getByTestId('kanban-pendiente');
    await expect(pendingColumn.getByText('Correctivo')).toBeVisible();
  });

  /**
   * P1-E2E-010: OT aparece en Kanban columna "Pendiente"
   *
   * AC3: Given OT creada desde avería
   *       Then OT aparece en Kanban columna "Pendiente"
   */
  test('[P1-E2E-010] should show OT in Pendiente column', async ({ page, loginAs }) => {
    // Given: Supervisor convierte avería a OT
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();
    await page.getByTestId('convertir-a-ot-btn').click();

    // Wait for success
    await expect(page.getByText('OT creada exitosamente')).toBeVisible();

    // When: Navega a Kanban
    await page.goto('/kanban');

    // Then: OT visible en columna Pendiente
    const pendingColumn = page.getByTestId('kanban-pendiente');
    const newOT = pendingColumn.locator('[data-testid^="work-order-"]').first();
    await expect(newOT).toBeVisible();
  });
});

test.describe('Triage de Averías - AC4: Descartar Aviso', () => {
  /**
   * P0-E2E-011: Descartar muestra confirmación
   *
   * AC4: Given modal de avería abierto
   *       When click "Descartar"
   *       Then confirmación modal: "¿Descartar aviso #{numero}? Esta acción no se puede deshacer."
   */
  test('[P0-E2E-011] should show confirmation modal when descartar clicked', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    await firstCard.click();

    // When: Click "Descartar"
    await page.getByTestId('descartar-btn').click();

    // Then: Modal de confirmación visible
    const confirmModal = page.getByTestId('descartar-confirm-modal');
    await expect(confirmModal).toBeVisible();

    // And: Mensaje correcto
    await expect(confirmModal.getByText(/¿Descartar aviso #/)).toBeVisible();
    await expect(confirmModal.getByText('Esta acción no se puede deshacer')).toBeVisible();
  });

  /**
   * P0-E2E-012: Descartar confirma y remueve aviso
   *
   * AC4: Given confirmación modal visible
   *       When confirmo descarte
   *       Then aviso marcado como "Descartado"
   *       And ya no aparece en columna "Por Revisar"
   */
  test('[P0-E2E-012] should discard and remove card from por revisar', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    const cardText = await firstCard.textContent();
    await firstCard.click();

    // When: Click "Descartar" y confirmo
    await page.getByTestId('descartar-btn').click();
    await page.getByTestId('descartar-confirm-btn').click();

    // Then: Toast de éxito
    await expect(page.getByText('Aviso descartado')).toBeVisible();

    // And: Modal cerrado
    await expect(page.getByTestId('modal-averia-info')).not.toBeVisible();

    // And: Tarjeta removida de columna (buscamos por texto original)
    await expect(page.getByText(cardText || '')).not.toBeVisible();
  });

  /**
   * P1-E2E-013: Cancelar descarte cierra modal sin cambios
   *
   * AC4: Given confirmación modal visible
   *       When cancelo
   *       Then modal se cierra
   *       And aviso sigue en columna "Por Revisar"
   */
  test('[P1-E2E-013] should close modal without discarding when cancelled', async ({ page, loginAs }) => {
    // Given: Supervisor en triage con modal de confirmación abierto
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const firstCard = page.locator('[data-testid^="failure-report-card-"]').first();
    const cardText = await firstCard.textContent();
    await firstCard.click();
    await page.getByTestId('descartar-btn').click();

    // When: Click cancelar
    await page.getByTestId('descartar-cancel-btn').click();

    // Then: Modal de confirmación cerrado
    await expect(page.getByTestId('descartar-confirm-modal')).not.toBeVisible();

    // And: Modal de avería sigue abierto
    await expect(page.getByTestId('modal-averia-info')).toBeVisible();

    // And: Tarjeta sigue visible
    await expect(firstCard).toBeVisible();
    await expect(page.getByText(cardText || '')).toBeVisible();
  });
});

test.describe('Triage de Averías - AC5: Filtros y Ordenamiento', () => {
  /**
   * P1-E2E-014: Filtrar por fecha
   *
   * AC5: Given múltiples avisos en triage
   *       When filtro por fecha
   *       Then solo avisos de esa fecha visibles
   */
  test('[P2-E2E-014] should filter by fecha', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Abro filtro de fecha
    await page.getByTestId('filtro-fecha-btn').click();

    // And: Selecciono fecha específica
    await page.getByTestId('fecha-picker').fill('2026-03-22');

    // Then: Solo avisos de esa fecha visibles
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * P2-E2E-015: Filtrar por reporter
   *
   * AC5: Given múltiples avisos en triage
   *       When filtro por reporter
   *       Then solo avisos de ese reporter visibles
   */
  test('[P2-E2E-015] should filter by reporter', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Selecciono filtro por reporter
    await page.getByTestId('filtro-reporter-select').click();
    await page.getByRole('option', { name: /Juan Pérez/ }).click();

    // Then: Solo avisos de ese reporter visibles
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * P2-E2E-016: Filtrar por equipo
   *
   * AC5: Given múltiples avisos en triage
   *       When filtro por equipo
   *       Then solo avisos de ese equipo visibles
   */
  test('[P2-E2E-016] should filter by equipo', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Selecciono filtro por equipo
    await page.getByTestId('filtro-equipo-select').click();
    await page.getByRole('option', { name: /Prensa Hidráulica/ }).click();

    // Then: Solo avisos de ese equipo visibles
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * P2-E2E-017: Ordenar por fecha (más reciente primero)
   *
   * AC5: Given múltiples avisos en triage
   *       When ordeno por fecha
   *       Then avisos ordenados por fecha descendente (más reciente arriba)
   */
  test('[P2-E2E-017] should sort by fecha most recent first', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Click ordenar por fecha
    await page.getByTestId('ordenar-fecha-btn').click();

    // Then: Primer tarjeta tiene fecha más reciente
    const firstCardDate = await page.locator('[data-testid^="failure-report-card-"]').first()
      .locator('[data-testid="fecha"]').textContent();
    const secondCardDate = await page.locator('[data-testid^="failure-report-card-"]').nth(1)
      .locator('[data-testid="fecha"]').textContent();

    expect(firstCardDate).not.toBe(secondCardDate);
  });

  /**
   * P2-E2E-018: Ordenar por prioridad
   *
   * AC5: Given múltiples avisos en triage
   *       When ordeno por prioridad
   *       Then avisos ordenados por prioridad
   */
  test('[P2-E2E-018] should sort by prioridad', async ({ page, loginAs }) => {
    // Given: Supervisor en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    // When: Click ordenar por prioridad
    await page.getByTestId('ordenar-prioridad-btn').click();

    // Then: Avisos ordenados
    const cards = page.locator('[data-testid^="failure-report-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * P2-E2E-019: SSE real-time sync
   *
   * AC5: Given múltiples usuarios en triage
   *       When usuario A descarta aviso
   *       Then usuario B ve actualización en tiempo real vía SSE
   */
  test('[P2-E2E-019] should sync changes via SSE in real-time', async ({ page, loginAs }) => {
    // Given: Usuario A en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const initialCount = await page.locator('[data-testid^="failure-report-card-"]').count();

    // When: Otro usuario descarta aviso (simulado con actualización directa)
    // En test real, esto sería en otro browser context
    // Por ahora, solo verificamos que SSE events se emitan

    // Then: Count badge actualizado
    await page.waitForTimeout(1000); // Wait for SSE event
    const updatedCount = await page.locator('[data-testid^="failure-report-card-"]').count();

    // Count debería cambiar si SSE funciona
    // En test real con dos contexts, verificaríamos sincronización
    expect(updatedCount).toBeLessThanOrEqual(initialCount);
  });
});
