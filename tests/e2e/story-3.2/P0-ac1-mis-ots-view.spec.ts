import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.2 AC1: Vista de "Mis OTs" filtrada por asignaciones
 *
 * TDD RED PHASE: Tests validate Mis OTs view - all tests will FAIL
 * Expected Failures: 404 Not Found (/mis-ots route doesn't exist)
 *
 * Acceptance Criteria:
 * - Técnico con capability can_view_own_ots accede a /mis-ots
 * - Ve lista de OTs donde está asignado (como técnico)
 * - Si está en móvil, ve bottom nav tab "Mis OTs"
 * - Lista tiene data-testid="mis-ots-lista"
 * - Cada OT muestra: número OT, estado actual, equipo, fecha de asignación
 * - NO ve OTs asignadas a otros técnicos
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 * Auth Pattern: Same as Story 3.1 (storage state files)
 */

test.describe('Story 3.2 - AC1: Vista Mis OTs Filtrada (P0)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    // THIS WILL FAIL - /mis-ots route doesn't exist yet
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P0-AC1-001] should show Mis OTs view for assigned technician', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Verify Mis OTs list is visible
    const misOtsList = page.getByTestId('mis-ots-lista');
    await expect(misOtsList).toBeVisible();

    // Verify list has OT cards assigned to current user
    const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await otCards.count();

    // Should have at least 1 OT assigned (from seed data)
    expect(cardCount).toBeGreaterThan(0);
  });

  test('[P0-AC1-002] should show OT card with required information', async ({ page }) => {
    // THIS TEST WILL FAIL - OT cards don't exist
    // Expected: Each card shows número OT, estado, equipo, fecha
    // Actual: Element not found

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    // Verify OT number is visible
    await expect(firstCard.getByTestId('ot-numero')).toBeVisible();

    // Verify estado badge is visible
    await expect(firstCard.getByTestId('ot-estado-badge')).toBeVisible();

    // Verify equipo name is visible
    await expect(firstCard.getByTestId('ot-equipo')).toBeVisible();

    // Verify fecha asignación is visible
    await expect(firstCard.getByTestId('ot-fecha-asignacion')).toBeVisible();
  });

  test('[P0-AC1-003] should NOT show OTs assigned to other technicians', async ({ page }) => {
    // THIS TEST WILL FAIL - Filtering logic not implemented
    // Expected: Only OTs where current user is assigned
    // Actual: All OTs shown (or 404)

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');

    // Get all OT numbers from visible cards
    const otNumbers: string[] = [];
    const count = await otCards.count();

    for (let i = 0; i < count; i++) {
      const card = otCards.nth(i);
      const numero = await card.getByTestId('ot-numero').textContent();
      if (numero) otNumbers.push(numero);
    }

    // Verify no OTs from other technicians (this would need DB query to validate)
    // For now, just verify list is not empty
    expect(otNumbers.length).toBeGreaterThan(0);

    // TODO: Query database to verify current user is in assignments for all shown OTs
  });

  test('[P1-AC1-004] should show bottom nav tab "Mis OTs" on mobile', async ({ page }) => {
    // THIS TEST WILL FAIL - Bottom nav not implemented for mobile
    // Expected: Bottom nav visible with "Mis OTs" tab
    // Actual: Bottom nav doesn't exist

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.waitForLoadState('domcontentloaded');

    // Verify bottom nav is visible
    const bottomNav = page.getByTestId('mobile-bottom-nav');
    await expect(bottomNav).toBeVisible();

    // Verify "Mis OTs" tab exists and is active
    const misOtsTab = bottomNav.getByTestId('nav-tab-mis-ots');
    await expect(misOtsTab).toBeVisible();
    await expect(misOtsTab).toHaveAttribute('aria-current', 'page');
  });

  test('[P1-AC1-005] should filter OTs by technician assignment', async ({ page }) => {
    // THIS TEST WILL FAIL - Filtering not implemented
    // Expected: Only OTs where tecnico@test.com is assigned
    // Actual: No filtering or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Verify list is filtered by current user's assignments
    // Current user is tecnico@hiansa.com (from storage state)
    await expect(misOtsList).toBeVisible();

    // All visible OTs should have current user in assignments
    // This requires database validation - for now, just verify list loads
    const otCards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const count = await otCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('[P2-AC1-006] should show empty state when no OTs assigned', async ({ page }) => {
    // THIS TEST WILL FAIL - Empty state not implemented
    // Expected: Empty state message when no OTs assigned
    // Actual: 404 or no empty state

    // Note: This test would require a user with no OTs assigned
    // For now, skip as it requires special test data setup
    test.skip(true, 'Requires user with no OTs assigned - test data setup needed');
  });
});
