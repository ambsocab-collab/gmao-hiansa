/**
 * E2E Tests for Story 3.3 - Bulk Assignment & Provider Workflow
 *
 * Validates bulk assignment and external provider workflows
 * Reference: test-design-epic-3.md - P2 Assignment Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Story 3.3 - E2E: Bulk Assignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.3-BULK-001: Assign multiple OTs to single technician
   */
  test('[E2E-3.3-BULK-001] should assign multiple OTs to single technician', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Select multiple OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Click bulk assign
    await page.click('[data-testid="bulk-assign-btn"]');

    // Select technician
    await page.fill('[name="tecnico-search"]', 'Juan');
    await page.click('[data-testid="tecnico-option-juan"]');

    // Confirm
    await page.click('[data-testid="confirm-btn"]');

    // Verify success
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('3 OTs asignadas a Juan');
  });

  /**
   * E2E-3.3-BULK-002: Distribute OTs among multiple technicians
   */
  test('[E2E-3.3-BULK-002] should distribute OTs among technicians', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Select OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await checkboxes.nth(3).check();

    // Click auto-distribute
    await page.click('[data-testid="auto-distribute-btn"]');

    // Verify distribution preview
    const distributionPreview = page.locator('[data-testid="distribution-preview"]');
    await expect(distributionPreview).toBeVisible();

    // Confirm distribution
    await page.click('[data-testid="confirm-btn"]');

    // Verify success
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('4 OTs distribuidas');
  });

  /**
   * E2E-3.3-BULK-003: Reassign all OTs from one technician to another
   */
  test('[E2E-3.3-BULK-003] should reassign all OTs from one technician', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Select technician to reassign from
    await page.click('[data-testid="filter-tecnico"]');
    await page.click('[data-testid="tecnico-option-juan"]');

    // Select all shown OTs
    await page.check('[data-testid="select-all-checkbox"]');

    // Click reassign
    await page.click('[data-testid="reassign-btn"]');

    // Select new technician
    await page.fill('[name="nuevo-tecnico-search"]', 'Pedro');
    await page.click('[data-testid="tecnico-option-pedro"]');

    // Confirm
    await page.click('[data-testid="confirm-btn"]');

    // Verify success
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('reasignadas');
  });

  /**
   * E2E-3.3-BULK-004: Show overload warning before assignment
   */
  test('[E2E-3.3-BULK-004] should warn about technician overload', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Select many OTs
    const checkboxes = page.locator('[data-testid="ot-checkbox"]');
    for (let i = 0; i < 6; i++) {
      await checkboxes.nth(i).check();
    }

    // Select technician with 4 active OTs
    await page.click('[data-testid="bulk-assign-btn"]');
    await page.fill('[name="tecnico-search"]', 'Carlos');
    await page.click('[data-testid="tecnico-option-carlos"]');

    // Verify warning appears
    const warning = page.locator('[data-testid="overload-warning"]');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('sobrecarga');
  });
});

test.describe('Story 3.3 - E2E: Provider Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.3-PROV-001: Assign OT to external provider
   */
  test('[E2E-3.3-PROV-001] should assign OT to external provider', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Select OT
    await page.click('[data-testid="ot-card"]:first-child');

    // Click assign to provider
    await page.click('[data-testid="assign-provider-btn"]');

    // Select provider
    await page.fill('[name="provider-search"]', 'TecnoService');
    await page.click('[data-testid="provider-option-tecnoservice"]');

    // Set deadline
    await page.fill('[name="deadline"]', '2024-02-15');

    // Add notes
    await page.fill('[name="notes"]', 'Urgente - equipo crítico');

    // Confirm
    await page.click('[data-testid="confirm-btn"]');

    // Verify assignment
    const providerBadge = page.locator('[data-testid="provider-badge"]');
    await expect(providerBadge).toContainText('TecnoService');
  });

  /**
   * E2E-3.3-PROV-002: Provider receives notification
   */
  test('[E2E-3.3-PROV-002] should notify provider of new assignment', async ({ page, context }) => {
    // Login as supervisor
    await page.goto('/ots/asignacion');
    await page.click('[data-testid="ot-card"]:first-child');
    await page.click('[data-testid="assign-provider-btn"]');
    await page.fill('[name="provider-search"]', 'TecnoService');
    await page.click('[data-testid="provider-option-tecnoservice"]');
    await page.click('[data-testid="confirm-btn"]');

    // Open new page as provider
    const providerPage = await context.newPage();
    await providerPage.goto('/login');
    await providerPage.fill('[name="email"]', 'proveedor@tecnoservice.com');
    await providerPage.fill('[name="password"]', 'test-password');
    await providerPage.click('button[type="submit"]');

    // Check notification
    const notification = providerPage.locator('[data-testid="notification-badge"]');
    await expect(notification).toBeVisible();
  });

  /**
   * E2E-3.3-PROV-003: Provider confirms assignment
   */
  test('[E2E-3.3-PROV-003] should allow provider to confirm assignment', async ({ page }) => {
    // Login as provider
    await page.goto('/login');
    await page.fill('[name="email"]', 'proveedor@tecnoservice.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');

    // Go to pending assignments
    await page.click('[data-testid="pending-assignments"]');

    // Confirm assignment
    await page.click('[data-testid="confirm-assignment-btn"]');

    // Verify confirmed status
    const status = page.locator('[data-testid="assignment-status"]');
    await expect(status).toContainText('Confirmada');
  });

  /**
   * E2E-3.3-PROV-004: Provider rejects assignment with reason
   */
  test('[E2E-3.3-PROV-004] should allow provider to reject with reason', async ({ page }) => {
    // Login as provider
    await page.goto('/login');
    await page.fill('[name="email"]', 'proveedor@tecnoservice.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');

    await page.click('[data-testid="pending-assignments"]');

    // Reject assignment
    await page.click('[data-testid="reject-assignment-btn"]');

    // Provide reason
    await page.fill('[name="rejection-reason"]', 'No disponemos de personal con la certificación requerida');
    await page.click('[data-testid="confirm-btn"]');

    // Verify rejection
    const status = page.locator('[data-testid="assignment-status"]');
    await expect(status).toContainText('Rechazada');
  });

  /**
   * E2E-3.3-PROV-005: Supervisor notified of provider confirmation
   */
  test('[E2E-3.3-PROV-005] should notify supervisor of provider confirmation', async ({ page, context }) => {
    // Setup: Login as provider and confirm
    const providerPage = await context.newPage();
    await providerPage.goto('/login');
    await providerPage.fill('[name="email"]', 'proveedor@tecnoservice.com');
    await providerPage.fill('[name="password"]', 'test-password');
    await providerPage.click('button[type="submit"]');
    await providerPage.click('[data-testid="pending-assignments"]');
    await providerPage.click('[data-testid="confirm-assignment-btn"]');

    // Check supervisor notifications
    await page.goto('/dashboard');
    const notification = page.locator('[data-testid="notification-item"]').first();
    await expect(notification).toContainText('confirmó');
  });

  /**
   * E2E-3.3-PROV-006: Track provider OT progress
   */
  test('[E2E-3.3-PROV-006] should track provider OT progress', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Filter by provider
    await page.click('[data-testid="filter-provider"]');
    await page.click('[data-testid="provider-option-tecnoservice"]');

    // Verify provider OTs shown with status
    const providerOTs = page.locator('[data-testid="provider-ot"]');
    await expect(providerOTs.first()).toBeVisible();

    // Check progress indicator
    const progress = page.locator('[data-testid="ot-progress"]');
    await expect(progress.first()).toBeVisible();
  });
});

test.describe('Story 3.3 - E2E: Assignment Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'supervisor@test.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  /**
   * E2E-3.3-ANALYTICS-001: View technician workload chart
   */
  test('[E2E-3.3-ANALYTICS-001] should display technician workload chart', async ({ page }) => {
    await page.goto('/ots/asignacion');

    // Click analytics tab
    await page.click('[data-testid="analytics-tab"]');

    // Verify workload chart
    const chart = page.locator('[data-testid="workload-chart"]');
    await expect(chart).toBeVisible();
  });

  /**
   * E2E-3.3-ANALYTICS-002: Filter analytics by date range
   */
  test('[E2E-3.3-ANALYTICS-002] should filter analytics by date range', async ({ page }) => {
    await page.goto('/ots/asignacion');
    await page.click('[data-testid="analytics-tab"]');

    // Set date range
    await page.fill('[name="date-from"]', '2024-01-01');
    await page.fill('[name="date-to"]', '2024-01-31');

    // Apply filter
    await page.click('[data-testid="apply-filter-btn"]');

    // Verify chart updated
    const chart = page.locator('[data-testid="workload-chart"]');
    await expect(chart).toBeVisible();
  });

  /**
   * E2E-3.3-ANALYTICS-003: Export assignment report
   */
  test('[E2E-3.3-ANALYTICS-003] should export assignment report', async ({ page }) => {
    await page.goto('/ots/asignacion');
    await page.click('[data-testid="analytics-tab"]');

    // Click export
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-report-btn"]');

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('asignaciones');
  });
});
