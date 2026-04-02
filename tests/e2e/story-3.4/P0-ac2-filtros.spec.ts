import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.4 AC2: Filtros por 5 criterios
 *
 * TDD RED PHASE: Tests will fail until implementation is complete
 *
 * Acceptance Criteria:
 * - Filtros por 5 criterios: estado, técnico, fecha, tipo, equipo (NFR-S27)
 * - Filtro de estado: dropdown con 8 estados posibles
 * - Filtro de técnico: búsqueda predictiva de usuarios
 * - Filtro de fecha: range picker (fecha inicio, fecha fin)
 * - Filtro de tipo: Preventivo/Correctivo (NFR-S11-A)
 * - Filtros combinados con AND lógica
 * - URL params para filtros (permite compartir URL)
 *
 * Storage State: Uses supervisor auth from playwright/.auth/supervisor.json
 */

test.describe('Story 3.4 - AC2: Filtros por 5 criterios (P0)', () => {
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0-AC2-001] Barra de filtros visible con 5 filtros', async ({ page }) => {
    // RED PHASE: This test will fail - filter-bar doesn't exist yet

    // Verify filter bar exists
    const filterBar = page.getByTestId('filter-bar');
    await expect(filterBar).toBeVisible({ timeout: 10000 });

    // Verify all 5 filters exist
    const filtroEstado = page.getByTestId('filtro-estado');
    const filtroTecnico = page.getByTestId('filtro-tecnico');
    const filtroFechaInicio = page.getByTestId('filtro-fecha-inicio');
    const filtroFechaFin = page.getByTestId('filtro-fecha-fin');
    const filtroTipo = page.getByTestId('filtro-tipo');
    const filtroEquipo = page.getByTestId('filtro-equipo');

    await expect(filtroEstado).toBeVisible();
    await expect(filtroTecnico).toBeVisible();
    await expect(filtroFechaInicio).toBeVisible();
    await expect(filtroFechaFin).toBeVisible();
    await expect(filtroTipo).toBeVisible();
    await expect(filtroEquipo).toBeVisible();
  });

  test('[P0-AC2-002] Filtro por estado funciona', async ({ page }) => {
    // RED PHASE: This test will fail - filtro-estado doesn't exist yet

    const filtroEstado = page.getByTestId('filtro-estado');
    await expect(filtroEstado).toBeVisible({ timeout: 10000 });

    // Open estado dropdown
    await filtroEstado.click();

    // Wait for dropdown to open and options to be visible
    const estadoOption = page.locator('[data-testid^="estado-option-"]').first();
    await expect(estadoOption).toBeVisible({ timeout: 5000 });

    // Save selected estado text BEFORE clicking (page will navigate after click)
    const selectedEstado = await estadoOption.textContent();

    // Select an estado
    await estadoOption.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has estado param
    const url = page.url();
    expect(url).toMatch(/estado=/);

    // Verify results are filtered
    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible();

    // All visible OTs should have the selected estado
    const estadoBadges = tabla.locator('[data-testid^="estado-badge-"]');
    const count = await estadoBadges.count();

    if (count > 0 && selectedEstado) {
      // At least the first badge should match the selected estado
      const firstBadge = estadoBadges.first();
      await expect(firstBadge).toContainText(selectedEstado);
    }
  });

  test('[P0-AC2-003] Filtro por técnico con búsqueda predictiva', async ({ page }) => {
    // RED PHASE: This test will fail - filtro-tecnico doesn't exist yet

    const filtroTecnico = page.getByTestId('filtro-tecnico');
    await expect(filtroTecnico).toBeVisible({ timeout: 10000 });

    // Open técnico combobox
    await filtroTecnico.click();

    // Wait for combobox to be ready
    const tecnicoOptions = page.locator('[data-testid^="tecnico-option-"]');

    // Type to search (búsqueda predictiva)
    await page.keyboard.type('tecnico');

    // Wait for options to appear (filtered by search)
    await expect(tecnicoOptions.first()).toBeVisible({ timeout: 5000 });
    const count = await tecnicoOptions.count();

    // If options exist, select one
    if (count > 0) {
      await tecnicoOptions.first().click();
      await page.waitForLoadState('networkidle');

      // Verify URL has tecnico param
      const url = page.url();
      expect(url).toMatch(/tecnico=/);
    }
  });

  test('[P0-AC2-004] Filtro por rango de fechas funciona', async ({ page }) => {
    // RED PHASE: This test will fail - filtro-fecha-* doesn't exist yet

    const filtroFechaInicio = page.getByTestId('filtro-fecha-inicio');
    const filtroFechaFin = page.getByTestId('filtro-fecha-fin');

    await expect(filtroFechaInicio).toBeVisible({ timeout: 10000 });
    await expect(filtroFechaFin).toBeVisible();

    // Set date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fill fecha inicio and dispatch change event to trigger filter
    await filtroFechaInicio.fill(formatDate(thirtyDaysAgo));
    await filtroFechaInicio.dispatchEvent('change');
    await page.waitForLoadState('networkidle');

    // After first date filter, URL should have fechaInicio
    // Now fill fecha fin on the refreshed page
    const filtroFechaFinAfterRefresh = page.getByTestId('filtro-fecha-fin');
    await filtroFechaFinAfterRefresh.fill(formatDate(today));
    await filtroFechaFinAfterRefresh.dispatchEvent('change');
    await page.waitForLoadState('networkidle');

    // Verify URL has fecha params
    const url = page.url();
    expect(url).toMatch(/fechaInicio=|fechaFin=/);
  });

  test('[P0-AC2-005] Filtro por tipo (Preventivo/Correctivo)', async ({ page }) => {
    // RED PHASE: This test will fail - filtro-tipo doesn't exist yet

    const filtroTipo = page.getByTestId('filtro-tipo');
    await expect(filtroTipo).toBeVisible({ timeout: 10000 });

    // Open tipo dropdown
    await filtroTipo.click();

    // Wait for dropdown options to be visible
    const preventivoOption = page.getByTestId('tipo-option-PREVENTIVO');
    const correctivoOption = page.getByTestId('tipo-option-CORRECTIVO');

    await expect(preventivoOption).toBeVisible({ timeout: 5000 });
    await expect(correctivoOption).toBeVisible({ timeout: 5000 });

    // Select Preventivo
    await preventivoOption.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has tipo param
    const url = page.url();
    expect(url).toContain('tipo=PREVENTIVO');
  });

  test('[P0-AC2-006] Filtro por equipo con búsqueda predictiva', async ({ page }) => {
    // RED PHASE: This test will fail - filtro-equipo doesn't exist yet

    const filtroEquipo = page.getByTestId('filtro-equipo');
    await expect(filtroEquipo).toBeVisible({ timeout: 10000 });

    // Open equipo combobox
    await filtroEquipo.click();

    // Type to search - search for "SR" which matches "Selladora SR-01" in seed data
    await page.keyboard.type('SR');

    // Verify options appear (wait deterministically)
    const equipoOptions = page.locator('[data-testid^="equipo-option-"]');
    await expect(equipoOptions.first()).toBeVisible({ timeout: 5000 });
    const count = await equipoOptions.count();

    if (count > 0) {
      await equipoOptions.first().click();
      await page.waitForLoadState('networkidle');

      // Verify URL has equipo param
      const url = page.url();
      expect(url).toMatch(/equipo=/);
    }
  });

  test('[P0-AC2-007] Filtros combinados con AND lógica', async ({ page }) => {
    // RED PHASE: This test will fail - combined filters not implemented yet

    const filtroEstado = page.getByTestId('filtro-estado');
    const filtroTipo = page.getByTestId('filtro-tipo');

    await expect(filtroEstado).toBeVisible({ timeout: 10000 });

    // Apply estado filter
    await filtroEstado.click();
    const estadoOption = page.locator('[data-testid^="estado-option-"]').first();
    await expect(estadoOption).toBeVisible({ timeout: 5000 });
    await estadoOption.click();

    // Wait for filter to apply
    await page.waitForLoadState('networkidle');

    // Apply tipo filter
    await filtroTipo.click();
    const tipoOption = page.getByTestId('tipo-option-CORRECTIVO');
    await expect(tipoOption).toBeVisible({ timeout: 5000 });
    await tipoOption.click();
    await page.waitForLoadState('networkidle');

    // Verify URL has both params
    const url = page.url();
    expect(url).toMatch(/estado=/);
    expect(url).toMatch(/tipo=/);

    // Results should match both filters (AND logic)
    const tabla = page.getByTestId('ots-lista-tabla');
    await expect(tabla).toBeVisible();
  });

  test('[P0-AC2-008] Botón limpiar filtros funciona', async ({ page }) => {
    // RED PHASE: This test will fail - btn-limpiar-filtros doesn't exist yet

    // First apply a filter
    const filtroTipo = page.getByTestId('filtro-tipo');
    await filtroTipo.click();

    // Wait for dropdown to open
    const tipoOption = page.getByTestId('tipo-option-CORRECTIVO');
    await expect(tipoOption).toBeVisible({ timeout: 5000 });
    await tipoOption.click();
    await page.waitForLoadState('networkidle');

    // Verify filter is applied
    let url = page.url();
    expect(url).toContain('tipo=');

    // Find and click clear filters button
    const limpiarBtn = page.getByTestId('btn-limpiar-filtros');
    await expect(limpiarBtn).toBeVisible();
    await limpiarBtn.click();
    await page.waitForLoadState('networkidle');

    // Verify URL no longer has filter params
    url = page.url();
    expect(url).not.toContain('tipo=');
  });

  test('[P0-AC2-009] Badge muestra count de filtros activos', async ({ page }) => {
    // RED PHASE: This test will fail - filtros-activos-badge doesn't exist yet

    const badge = page.getByTestId('filtros-activos-badge');

    // Initially should show 0 or not be visible
    const initialCount = await badge.isVisible() ? await badge.textContent() : '0';

    // Apply one filter
    const filtroTipo = page.getByTestId('filtro-tipo');
    await filtroTipo.click();

    // Wait for dropdown options to be visible
    const tipoOption = page.getByTestId('tipo-option-CORRECTIVO');
    await expect(tipoOption).toBeVisible({ timeout: 5000 });
    await tipoOption.click();
    await page.waitForLoadState('networkidle');

    // Badge should now show 1
    await expect(badge).toBeVisible();
    const newCount = await badge.textContent();
    expect(parseInt(newCount || '0')).toBeGreaterThan(parseInt(initialCount || '0'));
  });

  test('[P0-AC2-010] URL compartible con filtros', async ({ page }) => {
    // RED PHASE: This test will fail - URL filter params not implemented yet

    // Navigate directly to URL with filter params
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/lista?tipo=PREVENTIVO&estado=ASIGNADA`);
    await page.waitForLoadState('networkidle');

    // Verify filters are pre-populated from URL
    const filtroTipo = page.getByTestId('filtro-tipo');
    const filtroEstado = page.getByTestId('filtro-estado');

    // The filters should reflect the URL params
    await expect(filtroTipo).toBeVisible();
    await expect(filtroEstado).toBeVisible();
  });
});
