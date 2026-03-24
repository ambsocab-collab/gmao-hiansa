import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.2 AC7: Comentarios y comunicación en tiempo real
 *
 * TDD RED PHASE: Tests validate comment functionality - all tests will FAIL
 * Expected Failures: Comment section doesn't exist
 *
 * Acceptance Criteria:
 * - OT en progreso o cualquier estado activo
 * - Input de comentario visible con textarea (data-testid="comentario-input")
 * - Submit comentario → comentario agregado con timestamp (NFR-S106)
 * - Comentarios visibles en modal de detalles (lista con data-testid="comentarios-list")
 * - Notificación SSE enviada a otros asignados
 * - Comentarios persistidos en tabla WorkOrderComment
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.2 - AC7: Comentarios en Tiempo Real (P1)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P1-AC7-001] should show comment input in modal', async ({ page }) => {
    // THIS TEST WILL FAIL - Comment input doesn't exist
    // Expected: Textarea visible for entering comments
    // Actual: Comment section doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify comment input is visible
    const commentInput = page.getByTestId('comentario-input');
    await expect(commentInput).toBeVisible();

    // Verify submit button
    const submitBtn = page.getByTestId('submit-comentario-btn');
    await expect(submitBtn).toBeVisible();
  });

  test('[P1-AC7-002] should add comment with timestamp when submitted', async ({ page }) => {
    // THIS TEST WILL FAIL - Comment submission not implemented
    // Expected: Comment appears in list with timestamp
    // Actual: 404 or no action

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Enter comment text
    const commentInput = page.getByTestId('comentario-input');
    const commentText = 'Reemplazado bearing defectuoso, equipo funcionando correctamente';
    await commentInput.fill(commentText);

    // Submit comment
    const submitBtn = page.getByTestId('submit-comentario-btn');
    await submitBtn.click();

    // Wait for SSE update
    await page.waitForTimeout(500);

    // Verify comment appears in list
    const commentsList = page.getByTestId('comentarios-list');
    await expect(commentsList).toBeVisible();

    const newComment = commentsList.locator('[data-testid^="comentario-"]').first();
    await expect(newComment).toBeVisible();

    // Verify comment text
    await expect(newComment.getByTestId('comentario-texto')).toContainText(commentText);

    // Verify timestamp is visible
    await expect(newComment.getByTestId('comentario-timestamp')).toBeVisible();
  });

  test('[P1-AC7-003] should show all comments in modal', async ({ page }) => {
    // THIS TEST WILL FAIL - Comments list not implemented
    // Expected: List shows all comments for this OT
    // Actual: List doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    const commentsList = page.getByTestId('comentarios-list');

    // Verify comments list is visible
    await expect(commentsList).toBeVisible();

    // Count comments (may be 0 for new OTs)
    const commentCount = await commentsList.locator('[data-testid^="comentario-"]').count();

    // Just verify list is visible (count can be 0)
    expect(commentCount).toBeGreaterThanOrEqual(0);
  });

  test('[P1-AC7-004] should emit SSE event when comment added', async ({ page }) => {
    // THIS TEST WILL FAIL - SSE not implemented
    // Expected: SSE event sent to other assigned users
    // Actual: No SSE event

    test.skip(true, 'SSE event verification requires SSE listener setup - verified in integration tests');
  });

  test('[P2-AC7-005] should auto-scroll to latest comment', async ({ page }) => {
    // THIS TEST WILL FAIL - Auto-scroll not implemented
    // Expected: View scrolls to show newest comment
    // Actual: No scroll

    test.skip(true, 'Auto-scroll enhancement not implemented');
  });

  test('[P2-AC7-006] should clear input after submitting comment', async ({ page }) => {
    // THIS TEST WILL FAIL - Input clearing not implemented
    // Expected: Textarea cleared after submit
    // Actual: Input retains text

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    const commentInput = page.getByTestId('comentario-input');
    const submitBtn = page.getByTestId('submit-comentario-btn');

    // Enter and submit comment
    await commentInput.fill('Test comment');
    await submitBtn.click();

    // Wait for update
    await page.waitForTimeout(500);

    // Verify input is cleared
    await expect(commentInput).toHaveValue('');
  });

  test('[P2-AC7-007] should show commenter name and timestamp', async ({ page }) => {
    // THIS TEST WILL FAIL - Comment metadata not shown
    // Expected: Each comment shows user name and time
    // Actual: Metadata missing

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Add a comment
    const commentInput = page.getByTestId('comentario-input');
    await commentInput.fill('Test comment');
    await page.getByTestId('submit-comentario-btn').click();

    await page.waitForTimeout(500);

    // Verify comment shows user name
    const commentsList = page.getByTestId('comentarios-list');
    const newComment = commentsList.locator('[data-testid^="comentario-"]').first();

    await expect(newComment.getByTestId('comentario-autor')).toBeVisible();

    // Verify timestamp format
    await expect(newComment.getByTestId('comentario-timestamp')).toBeVisible();
  });
});
