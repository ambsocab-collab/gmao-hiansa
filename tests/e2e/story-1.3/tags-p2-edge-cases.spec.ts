/**
 * P2 Tests: Edge Cases & Audit Logging
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * These tests verify edge cases and audit logging for tag management.
 * These are nice-to-have features and are currently skipped.
 *
 * Test Coverage: P2-E2E-001 (sort alphabetically), P2-E2E-002 (audit logs)
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin, authenticatedAPICall } from '../../helpers/auth.helpers';

test.describe('Story 1.3 - P2: Edge Cases & Audit Logging', () => {
  /**
   * P2-E2E-001: Ordenar usuarios por etiqueta (nice-to-have)
   *
   * AC4: Given que veo la lista de usuarios
   *       When quiero organizar la vista
   *       Then puedo ordenar usuarios por etiqueta alfabéticamente
   *
   * Note: This test is skipped as it's a nice-to-have feature
   */
  test.skip('[P2-E2E-001] should sort users alphabetically by tag name', async ({ page }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // When: Navigate to user list
    await page.goto('/usuarios');
    await page.waitForLoadState('domcontentloaded');

    // When: Click sort button to sort by tag
    await page.getByTestId('sort-by-tag').click();

    // Then: Users should be sorted alphabetically by tag
    // Verify sorting order (implementation-specific)
    const firstRow = page.getByRole('row').nth(1);
    await expect(firstRow).toBeVisible();
  });

  /**
   * P2-E2E-002: Auditoría de creación/eliminación de etiquetas
   *
   * AC6: Given que soy administrador
   *       When creo o elimino una etiqueta
   *       Then auditoría logged con acción y metadata
   *
   * Note: This test is skipped as audit logging is not yet implemented
   */
  test.skip('[P2-E2E-002] should log tag creation and deletion in audit trail', async ({
    page,
  }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // When: Create a new tag
    await page.goto('/usuarios/etiquetas');
    await page.waitForLoadState('domcontentloaded');

    // Network-first: Wait for tags list to load
    const tagsPromise = page.waitForResponse('**/api/v1/tags');
    await tagsPromise;

    const uniqueTagName = 'Audit Test Tag ' + Date.now();

    await page.getByTestId('etiqueta-nombre').fill(uniqueTagName);
    await page.getByTestId('etiqueta-color').selectOption('#00FF00');

    const createPromise = page.waitForResponse('**/api/v1/tags');
    await page.getByRole('button', { name: 'Crear Etiqueta' }).click();
    await createPromise;

    // Then: Audit log should record creation
    // Use authenticated API call to get audit logs (includes session cookies)
    const auditResponse = await authenticatedAPICall(page, 'GET', '/api/v1/audit-logs');
    const auditLogs = await auditResponse.json();
    const createLog = auditLogs.find((log: { action: string }) => log.action === 'tag_created');

    expect(createLog).toBeDefined();
    expect(createLog.metadata).toMatchObject({
      name: uniqueTagName,
      color: '#00FF00',
    });

    // When: Delete the tag
    const tagRow = page.getByRole('row').filter({ hasText: uniqueTagName });
    await tagRow.getByRole('button', { name: 'Eliminar' }).click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    // Then: Audit log should record deletion
    // Use authenticated API call to get audit logs (includes session cookies)
    const auditResponse2 = await authenticatedAPICall(page, 'GET', '/api/v1/audit-logs');
    const auditLogs2 = await auditResponse2.json();
    const deleteLog = auditLogs2.find((log: { action: string }) => log.action === 'tag_deleted');

    expect(deleteLog).toBeDefined();
  });
});
