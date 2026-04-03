/**
 * E2E Tests for Story 3.2 - Batch Operations
 *
 * Validates batch operations on Mis OTs view
 * Reference: test-design-epic-3.md - P2 Batch Operations
 */

import { test, expect } from '@playwright/test';

test.describe('Story 3.2 - E2E: Batch Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'tecnico@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.2-BATCH-001: Select multiple OTs
   */
  test('[E2E-3.2-BATCH-001] should select multiple OTs with checkboxes', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select 3 OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Verify selection count
    const selectedCount = page.locator('[data-testid="selected-count"]');
    await expect(selectedCount).toContainText('3');
  });

  /**
   * E2E-3.2-BATCH-002: Batch start multiple OTs
   */
  test('[E2E-3.2-BATCH-002] should start multiple OTs at once', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select 2 ASIGNADA OTs
    const asignadasTab = page.locator('[data-testid="tab-ASIGNADA"]');
    await asignadasTab.click();

    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();

    // Click batch start button
    await page.click('[data-testid="batch-iniciar-btn"]');

    // Confirm action
    await page.click('[data-testid="confirm-btn"]');

    // Verify success toast
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('2 OTs iniciadas');
  });

  /**
   * E2E-3.2-BATCH-003: Batch add same repuesto to multiple OTs
   */
  test('[E2E-3.2-BATCH-003] should add repuesto to multiple OTs', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();

    // Click batch add repuesto
    await page.click('[data-testid="batch-repuesto-btn"]');

    // Select repuesto
    await page.fill('[name="repuesto-search"]', 'REP-001');
    await page.click('[data-testid="repuesto-option-REP-001"]');
    await page.fill('[name="cantidad"]', '2');

    // Confirm
    await page.click('[data-testid="confirm-btn"]');

    // Verify success
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('Repuesto agregado a 2 OTs');
  });

  /**
   * E2E-3.2-BATCH-004: Select all OTs in view
   */
  test('[E2E-3.2-BATCH-004] should select all OTs with select all checkbox', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Click select all
    await page.check('[data-testid="select-all-checkbox"]');

    // Verify all checkboxes are checked
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });

  /**
   * E2E-3.2-BATCH-005: Deselect all OTs
   */
  test('[E2E-3.2-BATCH-005] should deselect all OTs', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select all
    await page.check('[data-testid="select-all-checkbox"]');

    // Deselect all
    await page.uncheck('[data-testid="select-all-checkbox"]');

    // Verify none checked
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
  });

  /**
   * E2E-3.2-BATCH-006: Batch operation shows progress
   */
  test('[E2E-3.2-BATCH-006] should show progress during batch operation', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select 5 OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    for (let i = 0; i < 5; i++) {
      await checkboxes.nth(i).check();
    }

    // Start batch
    await page.click('[data-testid="batch-iniciar-btn"]');
    await page.click('[data-testid="confirm-btn"]');

    // Verify progress indicator
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
  });

  /**
   * E2E-3.2-BATCH-007: Cancel batch operation
   */
  test('[E2E-3.2-BATCH-007] should allow canceling batch operation', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();

    // Start batch
    await page.click('[data-testid="batch-iniciar-btn"]');

    // Cancel in confirmation dialog
    await page.click('[data-testid="cancel-btn"]');

    // Verify no changes
    const startedOTs = page.locator('[data-estado="EN_PROGRESO"]');
    await expect(startedOTs).toHaveCount(0);
  });

  /**
   * E2E-3.2-BATCH-008: Batch operation handles partial failure
   */
  test('[E2E-3.2-BATCH-008] should handle partial failure in batch operation', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Select OTs (some valid, some invalid for operation)
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check(); // Valid
    await checkboxes.nth(1).check(); // Invalid state

    // Attempt batch start
    await page.click('[data-testid="batch-iniciar-btn"]');
    await page.click('[data-testid="confirm-btn"]');

    // Verify partial success message
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('1 de 2 OTs iniciadas');
  });
});

test.describe('Story 3.2 - E2E: Time Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'tecnico@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.2-TIME-001: Elapsed time shown for in-progress OT
   */
  test('[E2E-3.2-TIME-001] should show elapsed time for in-progress OT', async ({ page }) => {
    await page.goto('/ots/mis-ots');

    // Go to EN_PROGRESO tab
    await page.click('[data-testid="tab-EN_PROGRESO"]');

    // Find OT with elapsed time
    const elapsedTime = page.locator('[data-testid="elapsed-time"]').first();
    await expect(elapsedTime).toBeVisible();

    // Should show time format like "02:34:15"
    const timeText = await elapsedTime.textContent();
    expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  /**
   * E2E-3.2-TIME-002: Pause and resume OT
   */
  test('[E2E-3.2-TIME-002] should pause and resume OT', async ({ page }) => {
    await page.goto('/ots/mis-ots');
    await page.click('[data-testid="tab-EN_PROGRESO"]');

    // Click pause button
    await page.click('[data-testid="pause-btn"]');

    // Verify paused state
    const pausedBadge = page.locator('[data-testid="paused-badge"]');
    await expect(pausedBadge).toBeVisible();

    // Resume
    await page.click('[data-testid="resume-btn"]');

    // Verify resumed
    await expect(pausedBadge).not.toBeVisible();
  });

  /**
   * E2E-3.2-TIME-003: Total work time calculated on completion
   */
  test('[E2E-3.2-TIME-003] should calculate total work time on completion', async ({ page }) => {
    await page.goto('/ots/mis-ots');
    await page.click('[data-testid="tab-EN_PROGRESO"]');

    // Open OT details
    await page.click('[data-testid="ot-card"]:first-child');

    // Complete OT
    await page.click('[data-testid="completar-btn"]');
    await page.fill('[name="solucion"]', 'Reparación completada');
    await page.click('[data-testid="confirm-btn"]');

    // Verify total time shown
    const totalTime = page.locator('[data-testid="total-work-time"]');
    await expect(totalTime).toBeVisible();
  });
});
