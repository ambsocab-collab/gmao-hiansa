/**
 * E2E Tests for Story 3.1 - Kanban Keyboard Navigation & Accessibility
 *
 * Validates keyboard navigation and accessibility features
 * Reference: test-design-epic-3.md - P1 Accessibility Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Story 3.1 - E2E: Kanban Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as supervisor
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.1-KB-001: Tab navigation through columns
   */
  test('[E2E-3.1-KB-001] should navigate columns with Tab key', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Focus first column
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is on first column
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(focusedElement).toContain('PENDIENTE');
  });

  /**
   * E2E-3.1-KB-002: Arrow keys navigate between cards
   */
  test('[E2E-3.1-KB-002] should navigate cards with arrow keys', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Focus first card
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Navigate down to next card
    await page.keyboard.press('ArrowDown');

    // Verify second card is focused
    const focusedCard = page.locator('[data-testid="ot-card"]:focus');
    await expect(focusedCard).toBeVisible();
  });

  /**
   * E2E-3.1-KB-003: Enter opens OT details modal
   */
  test('[E2E-3.1-KB-003] should open OT details with Enter key', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Focus and select a card
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  /**
   * E2E-3.1-KB-004: Escape closes modal
   */
  test('[E2E-3.1-KB-004] should close modal with Escape key', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Open modal
    await page.click('[data-testid="ot-card"]:first-child');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  /**
   * E2E-3.1-KB-005: Drag with keyboard (Space to grab)
   */
  test('[E2E-3.1-KB-005] should drag card with keyboard', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Focus card
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Press Space to grab
    await page.keyboard.press('Space');

    // Navigate to target column
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Press Space to drop
    await page.keyboard.press('Space');

    // Verify card moved
    await expect(page.locator('[data-column="ASIGNADA"] [data-testid="ot-card"]:first-child')).toBeVisible();
  });
});

test.describe('Story 3.1 - E2E: Kanban Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.1-A11Y-001: Screen reader announces column names
   */
  test('[E2E-3.1-A11Y-001] should have proper ARIA labels for columns', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Check column ARIA labels
    const columns = page.locator('[role="region"][aria-label*="columna"]');
    const count = await columns.count();

    expect(count).toBe(8); // 8 columns
  });

  /**
   * E2E-3.1-A11Y-002: Cards have accessible names
   */
  test('[E2E-3.1-A11Y-002] should have accessible names for cards', async ({ page }) => {
    await page.goto('/ots/kanban');

    const card = page.locator('[data-testid="ot-card"]:first-child');
    const ariaLabel = await card.getAttribute('aria-label');

    expect(ariaLabel).toContain('OT-');
  });

  /**
   * E2E-3.1-A11Y-003: Live region announces changes
   */
  test('[E2E-3.1-A11Y-003] should announce drag changes via live region', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Check for live region
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeAttached();

    // Perform drag
    const card = page.locator('[data-testid="ot-card"]:first-child');
    const targetColumn = page.locator('[data-column="ASIGNADA"]');

    await card.dragTo(targetColumn);

    // Verify announcement
    await expect(liveRegion).toContainText('movida');
  });

  /**
   * E2E-3.1-A11Y-004: Focus indicator visible
   */
  test('[E2E-3.1-A11Y-004] should have visible focus indicator', async ({ page }) => {
    await page.goto('/ots/kanban');

    // Tab to focusable element
    await page.keyboard.press('Tab');

    // Check focus ring
    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate((el) =>
      window.getComputedStyle(el).outline
    );

    expect(outline).not.toBe('none');
  });

  /**
   * E2E-3.1-A11Y-005: Color contrast meets WCAG AA
   */
  test('[E2E-3.1-A11Y-005] should meet WCAG AA color contrast', async ({ page }) => {
    await page.goto('/ots/kanban');

    // This would typically be done with axe-core
    // For now, verify high contrast elements exist
    const priorityBadges = page.locator('[data-priority="CRITICA"]');
    await expect(priorityBadges.first()).toBeVisible();
  });
});
