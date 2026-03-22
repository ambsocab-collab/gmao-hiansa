/**
 * E2E Tests: Story 2.3 - Filtros y Ordenamiento (AC2.7)
 * TDD RED PHASE: Tests verify filter and sort functionality in triage
 *
 * Tests cover:
 * - P1-E2E-FILTROS-001: Filter by equipo
 * - P1-E2E-FILTROS-002: Filter by reporter
 * - P1-E2E-FILTROS-003: Filter by fecha
 * - P1-E2E-FILTROS-004: Sort by fecha (más reciente primero)
 * - P1-E2E-FILTROS-005: Sort by prioridad
 * - P1-E2E-FILTROS-006: Clear filters
 * - P1-E2E-FILTROS-007: Show/hide filters panel
 *
 * AC2.7 (AC5): Filtros y ordenamiento
 * - Filter avisos by fecha, reporter, equipo
 * - Sort by fecha (más reciente primero), prioridad
 * - URL search params synchronization
 *
 * Quality: Tests filter/sort UI interactions and URL state management
 */

import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/supervisor.json' });

test.describe('Story 2.3: Filtros y Ordenamiento (AC2.7)', () => {
  /**
   * P1-E2E-FILTROS-007: Show/hide filters panel
   *
   * AC2.7: Given supervisor en triage
   *         When click "Mostrar Filtros"
   *         Then panel de filtros visible
   */
  test('[P1-E2E-FILTROS-007] should show and hide filters panel', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Click "Mostrar Filtros"
    const toggleBtn = page.getByTestId('filtro-toggle-btn');
    await expect(toggleBtn).toHaveText('Mostrar Filtros');
    await toggleBtn.click();

    // Then: Panel de filtros visible
    const filtrosPanel = page.getByTestId('filtros-panel');
    await expect(filtrosPanel).toBeVisible();

    // And: Botón cambia a "Ocultar Filtros"
    await expect(toggleBtn).toHaveText('Ocultar Filtros');

    // When: Click "Ocultar Filtros"
    await toggleBtn.click();

    // Then: Panel oculto
    await expect(filtrosPanel).not.toBeVisible();
    await expect(toggleBtn).toHaveText('Mostrar Filtros');
  });

  /**
   * P1-E2E-FILTROS-001: Filter by equipo
   *
   * AC2.7: Given supervisor en triage con múltiples avisos
   *         When selecciona equipo específico
   *         Then solo muestra avisos de ese equipo
   *         And URL actualizada con ?filtro_equipo=X
   */
  test('[P1-E2E-FILTROS-001] should filter avisos by equipo', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Mostrar filtros y seleccionar equipo
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    // Get first equipo option (not "Todos")
    const equipoSelect = page.getByTestId('filtro-equipo-select');
    const options = await equipoSelect.locator('option').allTextContents();

    // Skip if no equipos available (except "Todos")
    if (options.length <= 1) {
      test.skip(true, 'No hay equipos disponibles para probar filtro');
      return;
    }

    // Select first equipo
    await equipoSelect.selectOption({ index: 1 });
    const selectedEquipo = await equipoSelect.inputValue();

    // Then: URL actualizada con filtro_equipo
    await expect(page).toHaveURL(/filtro_equipo=/);

    // And: Solo se muestran avisos de ese equipo
    // Note: No podemos verificar esto sin datos de prueba específicos
    // pero validamos que la interacción funciona

    console.log(`✅ Filtro por equipo aplicado: ${selectedEquipo}`);
  });

  /**
   * P1-E2E-FILTROS-002: Filter by reporter
   *
   * AC2.7: Given supervisor en triage con múltiples avisos
   *         When selecciona reporter específico
   *         Then solo muestra avisos de ese reporter
   *         And URL actualizada con ?filtro_reporter=X
   */
  test('[P1-E2E-FILTROS-002] should filter avisos by reporter', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Mostrar filtros y seleccionar reporter
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    // Get first reporter option (not "Todos")
    const reporterSelect = page.getByTestId('filtro-reporter-select');
    const options = await reporterSelect.locator('option').allTextContents();

    // Skip if no reporters available (except "Todos")
    if (options.length <= 1) {
      test.skip(true, 'No hay reporters disponibles para probar filtro');
      return;
    }

    // Select first reporter
    await reporterSelect.selectOption({ index: 1 });
    const selectedReporter = await reporterSelect.inputValue();

    // Then: URL actualizada con filtro_reporter
    await expect(page).toHaveURL(/filtro_reporter=/);

    console.log(`✅ Filtro por reporter aplicado: ${selectedReporter}`);
  });

  /**
   * P1-E2E-FILTROS-003: Filter by fecha
   *
   * AC2.7: Given supervisor en triage con múltiples avisos
   *         When selecciona fecha específica
   *         Then solo muestra avisos de esa fecha
   *         And URL actualizada con ?filtro_fecha=X
   */
  test('[P1-E2E-FILTROS-003] should filter avisos by fecha', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Mostrar filtros y seleccionar fecha
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    const fechaPicker = page.getByTestId('fecha-picker');

    // Set today's date and press Enter to trigger onChange
    const today = new Date().toISOString().split('T')[0];
    await fechaPicker.fill(today);
    await fechaPicker.press('Enter'); // Trigger onChange event

    // Then: URL actualizada con filtro_fecha
    await expect(page).toHaveURL(/filtro_fecha=/);

    console.log(`✅ Filtro por fecha aplicado: ${today}`);
  });

  /**
   * P1-E2E-FILTROS-004: Sort by fecha (más reciente primero)
   *
   * AC2.7: Given supervisor en triage con múltiples avisos
   *         When click "Ordenar por Fecha" dos veces
   *         Then avisos ordenados por fecha descendente (segundo click)
   *         And URL actualizada con ?ordenar_fecha=desc
   *         And botón muestra ↓
   */
  test('[P1-E2E-FILTROS-004] should sort avisos by fecha (más reciente primero)', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Mostrar filtros y click "Ordenar por Fecha"
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    const fechaSortBtn = page.getByTestId('ordenar-fecha-btn');

    // First click: sets to asc (default toggle behavior)
    await fechaSortBtn.click();
    await expect(page).toHaveURL(/ordenar_fecha=asc/);
    await expect(fechaSortBtn).toContainText('↑');
    console.log('✅ Ordenamiento por fecha (asc) aplicado');

    // Second click: toggles to desc
    await fechaSortBtn.click();
    await expect(page).toHaveURL(/ordenar_fecha=desc/);
    await expect(fechaSortBtn).toContainText('↓');
    console.log('✅ Ordenamiento por fecha (desc) aplicado - más reciente primero');
  });

  /**
   * P1-E2E-FILTROS-005: Sort by prioridad
   *
   * AC2.7: Given supervisor en triage con múltiples avisos
   *         When click "Ordenar por Prioridad"
   *         Then avisos ordenados por prioridad
   *         And URL actualiza con ?ordenar_prioridad=alta|media|baja
   */
  test('[P1-E2E-FILTROS-005] should sort avisos by prioridad', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Mostrar filtros y click "Ordenar por Prioridad"
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    const prioridadSortBtn = page.getByTestId('ordenar-prioridad-btn');

    // Click 1: alta
    await prioridadSortBtn.click();
    await expect(page).toHaveURL(/ordenar_prioridad=alta/);
    console.log('✅ Ordenamiento por prioridad (alta) aplicado');

    // Click 2: media
    await prioridadSortBtn.click();
    await expect(page).toHaveURL(/ordenar_prioridad=media/);
    console.log('✅ Ordenamiento por prioridad (media) aplicado');

    // Click 3: baja
    await prioridadSortBtn.click();
    await expect(page).toHaveURL(/ordenar_prioridad=baja/);
    console.log('✅ Ordenamiento por prioridad (baja) aplicado');

    // Click 4: limpiar
    await prioridadSortBtn.click();
    await expect(page).not.toHaveURL(/ordenar_prioridad=/);
    console.log('✅ Ordenamiento por prioridad limpiado');
  });

  /**
   * P1-E2E-FILTROS-006: Clear filters
   *
   * AC2.7: Given supervisor con filtros aplicados
   *         When click "Limpiar Filtros"
   *         Then todos los filtros removidos
   *         And URL limpia (/averias/triage)
   */
  test('[P1-E2E-FILTROS-006] should clear all filters', async ({ page }) => {
    // Given: Supervisor con filtros aplicados
    await page.goto('/averias/triage?filtro_fecha=2026-03-22&filtro_equipo=1&ordenar_fecha=desc');

    // When: Mostrar filtros y click "Limpiar Filtros"
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    const clearBtn = page.getByTestId('clear-filters-btn');
    await clearBtn.click();

    // Then: URL limpia (sin query params)
    await expect(page).toHaveURL('/averias/triage');

    console.log('✅ Todos los filtros limpiados');
  });

  /**
   * P1-E2E-FILTROS-008: Multiple filters combinados
   *
   * AC2.7: Given supervisor en triage
   *         When aplica múltiples filtros simultáneamente
   *         Then todos los filtros aplicados
   *         And URL contiene todos los query params
   */
  test('[P1-E2E-FILTROS-008] should apply multiple filters simultaneously', async ({ page }) => {
    // Given: Supervisor en triage
    await page.goto('/averias/triage');

    // When: Aplicar múltiples filtros
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    // Filtro por fecha
    const today = new Date().toISOString().split('T')[0];
    const fechaPicker = page.getByTestId('fecha-picker');
    await fechaPicker.fill(today);
    await fechaPicker.press('Enter'); // Trigger onChange event

    // Wait for URL to update with fecha filter
    await page.waitForURL(/filtro_fecha=/, { timeout: 5000 });

    // Ordenar por fecha (dos clicks para llegar a desc)
    await page.getByTestId('ordenar-fecha-btn').click(); // asc
    await page.waitForURL(/ordenar_fecha=asc/, { timeout: 5000 });
    await page.getByTestId('ordenar-fecha-btn').click(); // desc
    await page.waitForURL(/ordenar_fecha=desc/, { timeout: 5000 });

    // Then: URL contiene ambos query params
    await expect(page).toHaveURL(/filtro_fecha=/);
    await expect(page).toHaveURL(/ordenar_fecha=desc/);

    console.log('✅ Múltiples filtros aplicados simultáneamente');
  });

  /**
   * P1-E2E-FILTROS-009: URL search params persistence
   *
   * AC2.7: Given supervisor con filtros aplicados en URL
   *         When navega a otra página y vuelve
   *         Then filtros persisten (leídos de URL)
   */
  test('[P1-E2E-FILTROS-009] should persist filters from URL search params', async ({ page }) => {
    // Given: URL con filtros pre-aplicados
    await page.goto('/averias/triage?filtro_fecha=2026-03-22&ordenar_fecha=desc');

    // When: Mostrar filtros
    await page.getByTestId('filtro-toggle-btn').click();
    await page.getByTestId('filtros-panel').waitFor();

    // Then: Valores de filtros reflejan query params
    const fechaPicker = page.getByTestId('fecha-picker');
    await expect(fechaPicker).toHaveValue('2026-03-22');

    const fechaSortBtn = page.getByTestId('ordenar-fecha-btn');
    await expect(fechaSortBtn).toContainText('↓'); // desc

    console.log('✅ Filtros persistidos desde URL search params');
  });
});
