import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P1 E2E Tests for Story 3.2 AC8: Adjuntar fotos antes/después de reparación
 *
 * TDD RED PHASE: Tests validate photo upload - all tests will FAIL
 * Expected Failures: Photo upload buttons don't exist, API doesn't exist
 *
 * Acceptance Criteria:
 * - OT en progreso
 * - Botón "Adjuntar foto antes" visible (data-testid="adjuntar-foto-antes-btn")
 * - Botón "Adjuntar foto después" visible (data-testid="adjuntar-foto-despues-btn")
 * - Cuando selecciono foto → foto subida a Vercel Blob storage (usar patrón Story 2.2)
 * - URL almacenada en tabla WorkOrderPhoto (work_order_id, tipo, url, created_at)
 * - Preview visible en modal de detalles
 * - Fotos mostradas en lista separada: "Antes" y "Después"
 *
 * Storage State: Uses tecnico auth from playwright/.auth/tecnico.json
 */

test.describe('Story 3.2 - AC8: Fotos Antes/Después (P1)', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/mis-ots`);
  });

  test('[P1-AC8-001] should show "Adjuntar foto antes" button', async ({ page }) => {
    // THIS TEST WILL FAIL - Photo buttons don't exist
    // Expected: Button visible for uploading "antes" photo
    // Actual: Button doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify "Adjuntar foto antes" button is visible
    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await expect(antesBtn).toBeVisible();
  });

  test('[P1-AC8-002] should show "Adjuntar foto después" button', async ({ page }) => {
    // THIS TEST WILL FAIL - Photo buttons don't exist
    // Expected: Button visible for uploading "despues" photo
    // Actual: Button doesn't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify "Adjuntar foto después" button is visible
    const despuesBtn = page.getByTestId('adjuntar-foto-despues-btn');
    await expect(despuesBtn).toBeVisible();
  });

  test('[P1-AC8-003] should upload "antes" photo to Vercel Blob', async ({ page }) => {
    // THIS TEST WILL FAIL - Upload API doesn't exist
    // Expected: Photo uploaded, URL saved, preview shown
    // Actual: 404 or no upload

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click "Adjuntar foto antes" button
    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await antesBtn.click();

    // Trigger file input (create a fake file for testing)
    const fileInput = page.getByTestId('foto-antes-file-input');

    // Create a small test image buffer
    const testFile = Buffer.from('fake-image-data');

    await fileInput.setInputFiles({
      name: 'foto-antes-test.jpg',
      mimeType: 'image/jpeg',
      buffer: testFile
    });

    // Wait for upload
    await page.waitForTimeout(1000);

    // Verify preview is visible
    const preview = page.getByTestId('foto-antes-preview');
    await expect(preview).toBeVisible();
  });

  test('[P1-AC8-004] should upload "después" photo to Vercel Blob', async ({ page }) => {
    // THIS TEST WILL FAIL - Upload API doesn't exist
    // Expected: Photo uploaded, URL saved, preview shown
    // Actual: 404 or no upload

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Click "Adjuntar foto después" button
    const despuesBtn = page.getByTestId('adjuntar-foto-despues-btn');
    await despuesBtn.click();

    // Trigger file input
    const fileInput = page.getByTestId('foto-despues-file-input');
    const testFile = Buffer.from('fake-image-data');

    await fileInput.setInputFiles({
      name: 'foto-despues-test.jpg',
      mimeType: 'image/jpeg',
      buffer: testFile
    });

    // Wait for upload
    await page.waitForTimeout(1000);

    // Verify preview is visible
    const preview = page.getByTestId('foto-despues-preview');
    await expect(preview).toBeVisible();
  });

  test('[P1-AC8-005] should show photos in separate lists: Antes and Después', async ({ page }) => {
    // THIS TEST WILL FAIL - Photo lists don't exist
    // Expected: Two sections: "Fotos Antes" and "Fotos Después"
    // Actual: Sections don't exist

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify "Fotos Antes" section
    const fotosAntesSection = page.getByTestId('fotos-antes-section');
    await expect(fotosAntesSection).toBeVisible();

    // Verify "Fotos Después" section
    const fotosDespuesSection = page.getByTestId('fotos-despues-section');
    await expect(fotosDespuesSection).toBeVisible();
  });

  test('[P1-AC8-006] should validate file type (only jpeg/png)', async ({ page }) => {
    // THIS TEST WILL FAIL - Validation not implemented
    // Expected: Error if not image/jpeg or image/png
    // Actual: No validation or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await antesBtn.click();

    // Try to upload PDF (invalid type)
    const fileInput = page.getByTestId('foto-antes-file-input');
    const pdfFile = Buffer.from('fake-pdf-data');

    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: pdfFile
    });

    // Verify error message
    const errorMessage = page.getByTestId('foto-error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Solo se permiten imágenes');
  });

  test('[P1-AC8-007] should validate file size (max 5MB)', async ({ page }) => {
    // THIS TEST WILL FAIL - Validation not implemented
    // Expected: Error if file > 5MB
    // Actual: No validation or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await antesBtn.click();

    // Try to upload large file (>5MB)
    const fileInput = page.getByTestId('foto-antes-file-input');
    const largeFile = Buffer.alloc(6 * 1024 * 1024); // 6MB

    await fileInput.setInputFiles({
      name: 'large-image.jpg',
      mimeType: 'image/jpeg',
      buffer: largeFile
    });

    // Verify error message
    const errorMessage = page.getByTestId('foto-error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('menos de 5MB');
  });

  test('[P2-AC8-008] should show multiple photos in each section', async ({ page }) => {
    // THIS TEST WILL FAIL - Multiple photos not supported
    // Expected: Can upload multiple "antes" and "despues" photos
    // Actual: Only one photo per type

    test.skip(true, 'Multiple photos per type not in initial scope');
  });
});
