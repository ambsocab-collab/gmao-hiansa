/**
 * E2E Tests: Epic 2 - PBAC Security (R-004 SEC score=9) - Admin Role
 * TDD RED PHASE: Tests verify access control for admin role
 *
 * Tests cover:
 * - P0-E2E-SEC-005: Admin CON can_view_all_ots puede acceder a triage
 *
 * CRITICAL: R-004 (SEC score=9) - PBAC authorization bypass vulnerability
 * These tests verify authorized users can access Epic 2 features.
 *
 * Quality: Uses storage state for admin role, validates successful access
 */

import { test, expect } from '@playwright/test';

// ALL tests in this file run as admin (has ALL capabilities including can_view_all_ots)
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Epic 2: PBAC Security (R-004 SEC score=9) - Admin Role', () => {
  /**
   * P0-E2E-SEC-005: Admin CON can_view_all_ots puede acceder a triage
   *
   * Positive path test: Verify authorized access works
   */
  test('[P0-E2E-SEC-005] should allow triage access with can_view_all_ots', async ({ page }) => {
    // When: Accede a /averias/triage
    await page.goto('/averias/triage');

    // Then: Ve columna "Por Revisar" sin redirección
    await expect(page).toHaveURL('/averias/triage');

    const triageColumn = page.getByTestId('averias-triage');
    await expect(triageColumn).toBeVisible();
  });
});
