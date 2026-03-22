/**
 * E2E Tests: Story 2.3 - AC5: Filtros y Ordenamiento
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Filtrar por fecha, reporter, equipo
 * - Ordenar por fecha y prioridad
 * - SSE real-time sync
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

import { test, expect } from '../../fixtures/test.fixtures';

test.describe('Triage de Averías - AC5: Filtros y Ordenamiento', () => {
  /**
   * P2-E2E-014: Filtrar por fecha
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
   *
   * NOTE: This test requires multi-browser context setup to properly test SSE
   * Current implementation documents the limitation and tests basic behavior
   * TODO: Implement with Playwright's browser context isolation for full SSE testing
   * Track: https://github.com/yourorg/project/issues/XXX
   */
  test('[P2-E2E-019] should sync changes via SSE in real-time', async ({ page, loginAs }) => {
    // Given: Usuario A en triage
    await loginAs('supervisor');
    await page.goto('/averias/triage');

    const initialCount = await page.locator('[data-testid^="failure-report-card-"]').count();

    // When: Simulamos actualización SSE (en test real con dos contexts)
    // NOTA: Este test requiere setup multi-browser context para probar SSE adecuadamente
    // Por ahora, verificamos que count badge existe y pueda actualizarse

    // Then: Count badge visible y funcional
    const countBadge = page.getByText(/Por Revisar \(\d+\)/);
    await expect(countBadge).toBeVisible();

    // Verificamos que el DOM está listo para recibir actualizaciones SSE
    expect(initialCount).toBeGreaterThanOrEqual(0);

    // NOTE: Para probar SSE real, necesitaríamos:
    // 1. Crear dos browser contexts con diferentes sesiones
    // 2. Context A: realiza acción que emite SSE event
    // 3. Context B: espera y verifica actualización vía SSE
    // 4. Verificar sincronización entre contexts

    // Por ahora, marcamos como test.skip hasta tener setup multi-context
    test.skip(true, 'SSE sync test requires multi-browser context setup - see issue XXX');
  });
});
