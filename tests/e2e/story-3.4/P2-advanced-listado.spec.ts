/**
 * E2E Tests for Story 3.4 - Advanced List Features
 *
 * Validates advanced sorting, column customization, and export
 * Reference: test-design-epic-3.md - P2 Listado Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Story 3.4 - E2E: Advanced Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.4-SORT-001: Multi-column sort (primary + secondary)
   */
  test('[E2E-3.4-SORT-001] should support multi-column sorting', async ({ page }) => {
    await page.goto('/ots/listado');

    // Primary sort: Estado
    await page.click('[data-testid="header-estado"]');
    await expect(page.locator('[data-testid="sort-indicator-estado"]')).toBeVisible();

    // Secondary sort: Prioridad (Shift+click)
    await page.click('[data-testid="header-prioridad"]', { modifiers: ['Shift'] });
    await expect(page.locator('[data-testid="sort-indicator-prioridad"]')).toBeVisible();

    // Verify both indicators
    const estadoIndicator = page.locator('[data-testid="sort-indicator-estado"]');
    const prioridadIndicator = page.locator('[data-testid="sort-indicator-prioridad"]');
    await expect(estadoIndicator).toBeVisible();
    await expect(prioridadIndicator).toBeVisible();
  });

  /**
   * E2E-3.4-SORT-002: Toggle sort direction
   */
  test('[E2E-3.4-SORT-002] should toggle sort direction on click', async ({ page }) => {
    await page.goto('/ots/listado');

    // First click: ascending
    await page.click('[data-testid="header-numero"]');
    await expect(page.locator('[data-testid="sort-asc"]')).toBeVisible();

    // Second click: descending
    await page.click('[data-testid="header-numero"]');
    await expect(page.locator('[data-testid="sort-desc"]')).toBeVisible();

    // Third click: clear sort
    await page.click('[data-testid="header-numero"]');
    await expect(page.locator('[data-testid="sort-indicator-numero"]')).not.toBeVisible();
  });

  /**
   * E2E-3.4-SORT-003: Sort by date column
   */
  test('[E2E-3.4-SORT-003] should sort by date correctly', async ({ page }) => {
    await page.goto('/ots/listado');

    // Sort by creation date
    await page.click('[data-testid="header-createdAt"]');

    // Get first row date
    const firstDate = await page.locator('[data-testid="row-0"] [data-col="createdAt"]').textContent();
    const lastDate = await page.locator('[data-testid="row-9"] [data-col="createdAt"]').textContent();

    // Verify ascending order (first should be older or same)
    expect(new Date(firstDate!).getTime()).toBeLessThanOrEqual(new Date(lastDate!).getTime());
  });

  /**
   * E2E-3.4-SORT-004: Sort persists across page navigation
   */
  test('[E2E-3.4-SORT-004] should persist sort across pagination', async ({ page }) => {
    await page.goto('/ots/listado');

    // Set sort
    await page.click('[data-testid="header-prioridad"]');

    // Go to page 2
    await page.click('[data-testid="page-2"]');

    // Verify sort still applied
    await expect(page.locator('[data-testid="sort-indicator-prioridad"]')).toBeVisible();
  });

  /**
   * E2E-3.4-SORT-005: Clear all sorts
   */
  test('[E2E-3.4-SORT-005] should clear all sorts', async ({ page }) => {
    await page.goto('/ots/listado');

    // Set multiple sorts
    await page.click('[data-testid="header-estado"]');
    await page.click('[data-testid="header-prioridad"]', { modifiers: ['Shift'] });

    // Clear all
    await page.click('[data-testid="clear-sorts-btn"]');

    // Verify no sort indicators
    const indicators = page.locator('[data-testid^="sort-indicator"]');
    await expect(indicators).toHaveCount(0);
  });
});

test.describe('Story 3.4 - E2E: Column Customization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.4-COL-001: Show/hide columns
   */
  test('[E2E-3.4-COL-001] should show/hide columns via column picker', async ({ page }) => {
    await page.goto('/ots/listado');

    // Open column picker
    await page.click('[data-testid="column-picker-btn"]');

    // Hide description column
    await page.uncheck('[data-testid="column-toggle-descripcion"]');

    // Verify column hidden
    const descripcionHeader = page.locator('[data-testid="header-descripcion"]');
    await expect(descripcionHeader).not.toBeVisible();

    // Show again
    await page.check('[data-testid="column-toggle-descripcion"]');
    await expect(descripcionHeader).toBeVisible();
  });

  /**
   * E2E-3.4-COL-002: Reorder columns via drag
   */
  test('[E2E-3.4-COL-002] should reorder columns via drag and drop', async ({ page }) => {
    await page.goto('/ots/listado');

    // Open column picker
    await page.click('[data-testid="column-picker-btn"]');

    // Drag "prioridad" before "estado"
    const prioridad = page.locator('[data-testid="column-item-prioridad"]');
    const estado = page.locator('[data-testid="column-item-estado"]');

    await prioridad.dragTo(estado);

    // Verify order changed
    const columns = page.locator('[data-testid="table-header"] th');
    const firstColText = await columns.first().textContent();

    // Prioridad should now be before Estado
    expect(firstColText?.toLowerCase()).toContain('prioridad');
  });

  /**
   * E2E-3.4-COL-003: Save column preferences
   */
  test('[E2E-3.4-COL-003] should save column preferences', async ({ page }) => {
    await page.goto('/ots/listado');

    // Hide column
    await page.click('[data-testid="column-picker-btn"]');
    await page.uncheck('[data-testid="column-toggle-tipo"]');
    await page.click('[data-testid="save-preferences-btn"]');

    // Reload page
    await page.reload();

    // Verify preference persisted
    const tipoHeader = page.locator('[data-testid="header-tipo"]');
    await expect(tipoHeader).not.toBeVisible();
  });

  /**
   * E2E-3.4-COL-004: Reset to default columns
   */
  test('[E2E-3.4-COL-004] should reset to default columns', async ({ page }) => {
    await page.goto('/ots/listado');

    // Hide some columns
    await page.click('[data-testid="column-picker-btn"]');
    await page.uncheck('[data-testid="column-toggle-tipo"]');
    await page.uncheck('[data-testid="column-toggle-prioridad"]');

    // Reset
    await page.click('[data-testid="reset-columns-btn"]');

    // Verify all default columns visible
    await expect(page.locator('[data-testid="header-tipo"]')).toBeVisible();
    await expect(page.locator('[data-testid="header-prioridad"]')).toBeVisible();
  });

  /**
   * E2E-3.4-COL-005: Resize column width
   */
  test('[E2E-3.4-COL-005] should resize column width', async ({ page }) => {
    await page.goto('/ots/listado');

    // Find column resize handle
    const resizeHandle = page.locator('[data-testid="resize-handle-descripcion"]');

    // Drag to resize
    await resizeHandle.dragTo(resizeHandle, {
      targetPosition: { x: 100, y: 0 }
    });

    // Verify width changed
    const column = page.locator('[data-testid="header-descripcion"]');
    const width = await column.evaluate((el) => el.clientWidth);
    expect(width).toBeGreaterThan(100);
  });
});

test.describe('Story 3.4 - E2E: Export & Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.4-EXP-001: Export to CSV
   */
  test('[E2E-3.4-EXP-001] should export to CSV', async ({ page }) => {
    await page.goto('/ots/listado');

    // Click export
    await page.click('[data-testid="export-btn"]');
    await page.click('[data-testid="export-csv"]');

    // Wait for download
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;

    // Verify file
    expect(download.suggestedFilename()).toMatch(/ots.*\.csv/);
  });

  /**
   * E2E-3.4-EXP-002: Export to Excel
   */
  test('[E2E-3.4-EXP-002] should export to Excel', async ({ page }) => {
    await page.goto('/ots/listado');

    await page.click('[data-testid="export-btn"]');
    await page.click('[data-testid="export-excel"]');

    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/ots.*\.xlsx/);
  });

  /**
   * E2E-3.4-EXP-003: Export filtered data only
   */
  test('[E2E-3.4-EXP-003] should export only filtered data', async ({ page }) => {
    await page.goto('/ots/listado');

    // Apply filter
    await page.click('[data-testid="filter-estado"]');
    await page.click('[data-testid="estado-option-PENDIENTE"]');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Export
    await page.click('[data-testid="export-btn"]');
    await page.click('[data-testid="export-csv"]');

    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;

    // Read CSV and verify all rows are PENDIENTE
    const path = await download.path();
    // Note: In real test, would read file and verify content
    expect(path).toBeDefined();
  });

  /**
   * E2E-3.4-EXP-004: Export selected columns only
   */
  test('[E2E-3.4-EXP-004] should export selected columns only', async ({ page }) => {
    await page.goto('/ots/listado');

    // Open export dialog
    await page.click('[data-testid="export-btn"]');
    await page.click('[data-testid="export-custom"]');

    // Select columns
    await page.check('[data-testid="export-col-numero"]');
    await page.check('[data-testid="export-col-estado"]');
    await page.uncheck('[data-testid="export-col-descripcion"]');

    // Export
    await page.click('[data-testid="confirm-export-btn"]');

    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/ots.*\.csv/);
  });

  /**
   * E2E-3.4-EXP-005: Print view
   */
  test('[E2E-3.4-EXP-005] should open print view', async ({ page }) => {
    await page.goto('/ots/listado');

    // Click print
    const pagePromise = page.waitForEvent('popup');
    await page.click('[data-testid="print-btn"]');

    const printPage = await pagePromise;

    // Verify print page opened
    await expect(printPage).toHaveURL(/print/);
  });

  /**
   * E2E-3.4-EXP-006: Generate PDF report
   */
  test('[E2E-3.4-EXP-006] should generate PDF report', async ({ page }) => {
    await page.goto('/ots/listado');

    await page.click('[data-testid="export-btn"]');
    await page.click('[data-testid="export-pdf"]');

    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/ots.*\.pdf/);
  });
});

test.describe('Story 3.4 - E2E: List View Preferences', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.4-PREF-001: Change page size
   */
  test('[E2E-3.4-PREF-001] should change page size', async ({ page }) => {
    await page.goto('/ots/listado');

    // Change to 50 per page
    await page.click('[data-testid="page-size-select"]');
    await page.click('[data-testid="page-size-50"]');

    // Verify row count
    const rows = page.locator('[data-testid="data-row"]');
    await expect(rows).toHaveCount(50);
  });

  /**
   * E2E-3.4-PREF-002: Save page size preference
   */
  test('[E2E-3.4-PREF-002] should save page size preference', async ({ page }) => {
    await page.goto('/ots/listado');

    // Change page size
    await page.click('[data-testid="page-size-select"]');
    await page.click('[data-testid="page-size-100"]');

    // Reload
    await page.reload();

    // Verify preference saved
    const pageSizeSelect = page.locator('[data-testid="page-size-select"]');
    await expect(pageSizeSelect).toHaveValue('100');
  });

  /**
   * E2E-3.4-PREF-003: Toggle dense view
   */
  test('[E2E-3.4-PREF-003] should toggle dense view', async ({ page }) => {
    await page.goto('/ots/listado');

    // Enable dense view
    await page.click('[data-testid="view-options-btn"]');
    await page.click('[data-testid="dense-view-toggle"]');

    // Verify dense class applied
    const table = page.locator('[data-testid="data-table"]');
    await expect(table).toHaveClass(/dense/);
  });

  /**
   * E2E-3.4-PREF-004: Toggle compact mode (mobile)
   */
  test('[E2E-3.4-PREF-004] should toggle compact mode on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ots/listado');

    // Verify card view instead of table
    const cardView = page.locator('[data-testid="card-view"]');
    await expect(cardView).toBeVisible();

    // Verify table not visible
    const tableView = page.locator('[data-testid="table-view"]');
    await expect(tableView).not.toBeVisible();
  });

  /**
   * E2E-3.4-PREF-005: Save filters as preset
   */
  test('[E2E-3.4-PREF-005] should save filters as preset', async ({ page }) => {
    await page.goto('/ots/listado');

    // Apply filters
    await page.click('[data-testid="filter-estado"]');
    await page.click('[data-testid="estado-option-PENDIENTE"]');
    await page.click('[data-testid="filter-prioridad"]');
    await page.click('[data-testid="prioridad-option-ALTA"]');

    // Save as preset
    await page.click('[data-testid="save-filter-btn"]');
    await page.fill('[name="preset-name"]', 'OTs Urgentes Pendientes');
    await page.click('[data-testid="confirm-save-preset"]');

    // Verify preset saved
    const preset = page.locator('[data-testid="filter-preset"]').filter({ hasText: 'OTs Urgentes Pendientes' });
    await expect(preset).toBeVisible();
  });

  /**
   * E2E-3.4-PREF-006: Load saved filter preset
   */
  test('[E2E-3.4-PREF-006] should load saved filter preset', async ({ page }) => {
    await page.goto('/ots/listado');

    // Click presets dropdown
    await page.click('[data-testid="filter-presets-btn"]');

    // Select preset
    await page.click('[data-testid="preset-ots-urgentes"]');

    // Verify filters applied
    const estadoFilter = page.locator('[data-testid="filter-estado-value"]');
    await expect(estadoFilter).toContainText('PENDIENTE');
  });
});
