/**
 * E2E Tests: Epic 2 - PBAC Security (R-004 SEC score=9) - Operario Role
 * TDD RED PHASE: Tests verify access control for operario role
 *
 * Tests cover:
 * - P0-E2E-SEC-001: /averias/triage sin can_view_all_ots → 403/redirect
 * - P0-E2E-SEC-003: Convertir a OT sin can_view_all_ots → 403/redirect
 * - P0-E2E-SEC-004: Descartar aviso sin can_view_all_ots → 403/redirect
 * - P0-E2E-SEC-006: Operario CON can_create_failure_report puede crear reporte
 *
 * CRITICAL: R-004 (SEC score=9) - PBAC authorization bypass vulnerability
 * These tests prevent unauthorized users from accessing Epic 2 features.
 *
 * Quality: Uses storage state for operario role, validates 403/redirect
 */

import { test, expect } from '@playwright/test';

// ALL tests in this file run as operario (only has can_create_failure_report, NOT can_view_all_ots)
test.use({ storageState: 'playwright/.auth/operario.json' });

test.describe('Epic 2: PBAC Security (R-004 SEC score=9) - Operario Role', () => {
  /**
   * P0-E2E-SEC-001: /averias/triage sin can_view_all_ots → redirect to /unauthorized
   *
   * R-004: Given usuario sin capability can_view_all_ots
   *        When intenta acceder a /averias/triage
   *        Then es redirigido a /unauthorized (403 negado)
   */
  test('[P0-E2E-SEC-001] should deny triage access without can_view_all_ots', async ({ page }) => {
    // When: Intenta acceder a /averias/triage
    await page.goto('/averias/triage');

    // Then: Redirigido a /unauthorized (middleware PBAC behavior)
    await expect(page).toHaveURL(/\/unauthorized/);

    // And: Ve mensaje de acceso denegado (use first to avoid strict mode violation)
    await expect(page.getByText(/no tienes permiso|acceso denegado|unauthorized/i).first()).toBeVisible();
  });

  /**
   * P0-E2E-SEC-003: Convertir a OT sin can_view_all_ots → redirect to /unauthorized
   *
   * R-004: Given usuario sin capability can_view_all_ots
   *        When intenta convertir avería a OT
   *        Then acción denegada (redirigido a /unauthorized)
   */
  test('[P0-E2E-SEC-003] should deny OT conversion without can_view_all_ots', async ({ page }) => {
    // When: Intenta acceder a /averias/triage
    await page.goto('/averias/triage');

    // Then: Redirigido a /unauthorized (no puede ver triage)
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  /**
   * P0-E2E-SEC-004: Descartar aviso sin can_view_all_ots → redirect to /unauthorized
   *
   * R-004: Given usuario sin capability can_view_all_ots
   *        When intenta descartar avería
   *        Then acción denegada (redirigido a /unauthorized)
   */
  test('[P0-E2E-SEC-004] should deny failure report discard without can_view_all_ots', async ({ page }) => {
    // When: Intenta acceder a /averias/triage
    await page.goto('/averias/triage');

    // Then: Redirigido a /unauthorized (no puede ver triage)
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  /**
   * P0-E2E-SEC-006: Operario CON can_create_failure_report puede crear reporte
   *
   * Positive path test: Verify authorized access works
   */
  test('[P0-E2E-SEC-006] should allow report creation with can_create_failure_report', async ({ page }) => {
    // When: Accede a /averias/nuevo
    await page.goto('/averias/nuevo');

    // Then: Ve formulario de reporte sin redirección
    await expect(page).toHaveURL('/averias/nuevo');

    const formulario = page.getByTestId('averia-descripcion');
    await expect(formulario).toBeVisible();

    // And: Puede ver input de búsqueda de equipo
    const equipoSearch = page.getByTestId('equipo-search');
    await expect(equipoSearch).toBeVisible();

    // And: Puede ver botón submit
    const submitBtn = page.getByTestId('averia-submit');
    await expect(submitBtn).toBeVisible();
  });
});
