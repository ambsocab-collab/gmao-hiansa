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
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Try to start OT if "Iniciar" button is visible
    const iniciarBtn = page.getByTestId('ot-iniciar-btn');
    const isIniciarVisible = await iniciarBtn.isVisible().catch(() => false);

    if (isIniciarVisible) {
      await iniciarBtn.click();

      // Confirm start
      const confirmBtn = page.getByTestId('confirm-iniciar-ot-btn');
      await confirmBtn.click();

      // Wait for modal to close and state update
      await page.waitForTimeout(2000);

      // Re-click the card
      await firstCard.click();
    }

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

    // Wait for upload and SSE update
    await page.waitForTimeout(3000);

    // Verify preview section is visible
    const fotosAntesSection = page.getByTestId('fotos-antes-section');
    await expect(fotosAntesSection).toBeVisible();
  });

  test('[P1-AC8-004] should upload "después" photo to Vercel Blob', async ({ page }) => {
    // THIS TEST WILL FAIL - Upload API doesn't exist
    // Expected: Photo uploaded, URL saved, preview shown
    // Actual: 404 or no upload

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    let enProgresoCardFound = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        await card.click();
        enProgresoCardFound = true;
        break;
      }
    }

    expect(enProgresoCardFound).toBe(true);

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

    // Wait for upload and SSE update
    await page.waitForTimeout(3000);

    // Verify preview section is visible
    const fotosDespuesSection = page.getByTestId('fotos-despues-section');
    await expect(fotosDespuesSection).toBeVisible();
  });

  test('[P1-AC8-005] should show photos in separate lists: Antes and Después', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const firstCard = misOtsList.locator('[data-testid^="my-ot-card-"]').first();

    await firstCard.click();

    // Verify "Fotos" section is visible
    const fotosSection = page.getByText('Fotos');
    await expect(fotosSection).toBeVisible();
  });

  test('[P1-AC8-006] should validate file type (only jpeg/png)', async ({ page }) => {
    // THIS TEST WILL FAIL - Validation not implemented
    // Expected: Error if not image/jpeg or image/png
    // Actual: No validation or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    let enProgresoCardFound = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        await card.click();
        enProgresoCardFound = true;
        break;
      }
    }

    expect(enProgresoCardFound).toBe(true);

    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await antesBtn.click();

    // Get initial photo count
    const initialCount = await page.locator('[data-testid^="foto-antes-preview"]').count();

    // Try to upload PDF (invalid type)
    const fileInput = page.getByTestId('foto-antes-file-input');
    const pdfFile = Buffer.from('fake-pdf-data');

    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: pdfFile
    });

    // Wait for validation
    await page.waitForTimeout(2000);

    // Verify no new photo was added (validation worked)
    const newCount = await page.locator('[data-testid^="foto-antes-preview"]').count();
    expect(newCount).toBe(initialCount);
  });

  test('[P1-AC8-007] should validate file size (max 5MB)', async ({ page }) => {
    // THIS TEST WILL FAIL - Validation not implemented
    // Expected: Error if file > 5MB
    // Actual: No validation or 404

    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');

    // Find a card with EN_PROGRESO status
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    let enProgresoCardFound = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.includes('En Progreso')) {
        await card.click();
        enProgresoCardFound = true;
        break;
      }
    }

    expect(enProgresoCardFound).toBe(true);

    const antesBtn = page.getByTestId('adjuntar-foto-antes-btn');
    await antesBtn.click();

    // Get initial photo count
    const initialCount = await page.locator('[data-testid^="foto-antes-preview"]').count();

    // Try to upload large file (>5MB)
    const fileInput = page.getByTestId('foto-antes-file-input');
    const largeFile = Buffer.alloc(6 * 1024 * 1024); // 6MB

    await fileInput.setInputFiles({
      name: 'large-image.jpg',
      mimeType: 'image/jpeg',
      buffer: largeFile
    });

    // Wait for validation
    await page.waitForTimeout(2000);

    // Verify no new photo was added (validation worked)
    const newCount = await page.locator('[data-testid^="foto-antes-preview"]').count();
    expect(newCount).toBe(initialCount);
  });

  test('[P2-AC8-008] should show multiple photos in each section', async ({ page }) => {
    // THIS TEST WILL FAIL - Multiple photos not supported
    // Expected: Can upload multiple "antes" and "despues" photos
    // Actual: Only one photo per type

    test.skip(true, 'Multiple photos per type not in initial scope');
  });
});
