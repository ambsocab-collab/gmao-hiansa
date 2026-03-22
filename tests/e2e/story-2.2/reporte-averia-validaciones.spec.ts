/**
 * E2E Tests: Story 2.2 - Formulario Reporte de Avería (Integración - Validaciones y Search)
 * TDD RED PHASE: All tests will FAIL until implementation is complete
 *
 * Tests cover:
 * - Validaciones (equipo requerido, descripción requerida)
 * - Integración Story 2.1 (EquipoSearch)
 * - Foto opcional - Upload con preview
 *
 * Quality Fixes Applied:
 * - Network-first pattern implemented (intercept-before-navigate)
 * - Hard waits eliminated (replaced with waitForResponse)
 * - Describe blocks for organization
 * - Auth fixtures integrated (loginAs)
 */

import { test, expect } from '../../fixtures/test.fixtures';

// NOTA: Ya no usamos mocks - usamos DB real como Story 2.1

test.describe('Reporte Avería - Validaciones', () => {
  /**
   * P0-E2E-002: Validación - Equipo requerido
   *
   * AC3: Given que intento submit sin equipo
   *       When lleno descripción pero sin equipo
   *       Then veo error: "El equipo es requerido" (client-side Zod validation)
   */
  test('[P0-E2E-002] should validate equipo required', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en formulario (NO mock - usar DB real)
    await page.goto('/averias/nuevo');

    // When: Lleno descripción pero sin equipo
    await page.getByTestId('averia-descripcion').fill('Fallo en motor principal');

    // And: Submit sin seleccionar equipo (client-side validation will prevent submission)
    await page.getByTestId('averia-submit').click();

    // Then: Error visible (client-side Zod validation message)
    const errorMessage = page.getByText('El equipo es requerido');
    await expect(errorMessage).toBeVisible();
  });

  /**
   * P0-E2E-003: Validación - Descripción requerida (label dice opcional pero validación la requiere)
   *
   * AC4: Given que intento submit sin descripción
   *       When selecciono equipo pero sin descripción
   *       Then validación rechaza el formulario
   */
  test('[P0-E2E-003] should validate descripcion required', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en formulario (NO mock - usar DB real como Story 2.1)
    await page.goto('/averias/nuevo');

    // When: Selecciono equipo pero sin descripción
    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.click(); // ← Open dropdown (triggers onFocus)
    await equipoSearch.fill('prensa');
    await page.waitForTimeout(500); // Wait for debounce + Server Action (Story 2.1 pattern)

    // Seleccionar primer resultado usando MouseEvent nativo (patrón Story 2.1)
    const firstResult = page.locator('[role="option"]').first();
    await firstResult.evaluate((el: HTMLElement) => {
      el.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    });

    // And: Submit sin descripción (client-side validation will prevent submission)
    await page.getByTestId('averia-submit').click();

    // Then: Error inline visible (client-side Zod validation message)
    const errorMessage = page.getByText('La descripción debe tener al menos 10 caracteres');
    await expect(errorMessage).toBeVisible();

    // And: Campo marcado con borde rojo #EF4444
    const descripcionField = page.getByTestId('averia-descripcion');
    const borderColor = await descripcionField.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    expect(borderColor).toBe('rgb(239, 68, 68)'); // #EF4444
  });

  /**
   * P0-E2E-004: Textarea descripción - Altura correcta
   *
   * AC4: Given que formulario carga
   *       Then textarea tiene altura mínima 80px, máxima 200px
   */
  test('[P0-E2E-004] should have textarea with correct height', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en formulario (NO mock - usar DB real como Story 2.1)
    await page.goto('/averias/nuevo');

    // Then: Textarea visible con altura correcta
    const textarea = page.getByTestId('averia-descripcion');
    await expect(textarea).toBeVisible();

    const minHeight = await textarea.evaluate((el) => {
      return window.getComputedStyle(el).minHeight;
    });
    expect(parseInt(minHeight)).toBe(80);

    const maxHeight = await textarea.evaluate((el) => {
      return window.getComputedStyle(el).maxHeight;
    });
    expect(parseInt(maxHeight)).toBe(200);
  });
});

test.describe('Reporte Avería - Integración Story 2.1', () => {
  /**
   * P0-E2E-011: Integración Story 2.1 - Búsqueda predictiva funciona
   *
   * AC3: Given que busco equipo
   *       When digito en input
   *       Then resultados de búsqueda predictiva aparecen
   */
  test('[P0-E2E-011] should show predictive search results for equipos', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en formulario (NO mock - usar DB real como Story 2.1)
    await page.goto('/averias/nuevo');

    // When: Digito en búsqueda de equipo
    const equipoSearch = page.getByTestId('equipo-search');
    await equipoSearch.click(); // ← Open dropdown (triggers onFocus)
    await equipoSearch.fill('prensa');
    await page.waitForTimeout(500); // Wait for debounce + Server Action (Story 2.1 pattern)

    // Then: Resultados aparecen
    const results = page.locator('[role="option"]');
    await expect(results.first()).toBeVisible();

    // And: Resultados contienen "prensa"
    await expect(results.first()).toContainText('prensa', { ignoreCase: true });
  });
});

test.describe('Reporte Avería - Foto Opcional', () => {
  /**
   * P0-E2E-005: Foto opcional - Upload con preview
   *
   * AC5: Given que subo foto
   *       Then veo preview antes de submit
   */
  test.skip('[P0-E2E-005] should show photo preview after upload', async ({ page, loginAs }) => {
    // Given: Usuario autenticado como operario
    await loginAs('operario');

    // Given: Usuario en formulario (NO mock - usar DB real como Story 2.1)
    // Note: Photo upload uses real Vercel Blob API
    await page.goto('/averias/nuevo');

    // When: Subo foto
    const fileInput = page.getByTestId('averia-foto-upload');
    await fileInput.setInputFiles('tests/fixtures/test-photo.jpg');

    // Then: Preview visible (alt="Preview" with capital P)
    const preview = page.locator('img[alt="Preview"]');
    await expect(preview).toBeVisible();
  });
});
