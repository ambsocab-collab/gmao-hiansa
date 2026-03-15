/**
 * P0 Tests: Tag Security - CRITICAL SECURITY TESTS
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * These tests verify that tags (labels) are completely independent
 * from the PBAC (Permission-Based Access Control) system.
 *
 * CRITICAL SECURITY REQUIREMENT:
 * 🔥 Las etiquetas son SOLO VISUALES - NO otorgan capabilities
 * - Dos usuarios con la misma etiqueta pueden tener diferentes capabilities
 * - Eliminar una etiqueta NO afecta las capabilities de los usuarios
 *
 * Test Coverage: P0-E2E-001, P0-E2E-002, P0-E2E-003
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAs, authenticatedAPICall } from '../../helpers/auth.helpers';
import {
  createUser,
  createUserWithCapabilities,
  ALL_CAPABILITIES,
} from '../../helpers/factories';

test.describe('Story 1.3 - P0: Tag Security (CRITICAL)', () => {
  // Track created users for cleanup
  const createdUserEmails: string[] = [];

  test.afterAll(async ({ request }) => {
    // Cleanup: Delete all test users created during this test suite
    for (const email of createdUserEmails) {
      try {
        const searchResponse = await request.get(
          `http://localhost:3000/api/v1/users?email=${encodeURIComponent(email)}`
        );
        if (searchResponse.ok()) {
          const users = await searchResponse.json();
          if (users && users.length > 0 && users[0].id) {
            await request.delete(`http://localhost:3000/api/v1/users/${users[0].id}`);
            console.log(`Cleaned up test user: ${email}`);
          }
        }
      } catch (error) {
        console.warn(`Failed to cleanup test user ${email}:`, error);
      }
    }
    createdUserEmails.length = 0;
  });

  /**
   * P0-E2E-001: Etiquetas NO otorgan capabilities
   *
   * AC5: Given que estoy asignando capabilities
   *       When asigno o removo capabilities
   *       Then las etiquetas de clasificación NO otorgan ni removen capabilities
   *       And capabilities y etiquetas son completamente independientes
   */
  test('[P0-E2E-001] should not grant capabilities when tag is assigned', async ({ page }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // Wait for page stabilization using network-first approach
    const dashboardPromise = page.waitForResponse('**/api/dashboard').catch(() => null);
    await page.waitForLoadState('domcontentloaded');
    await dashboardPromise; // Wait for dashboard API if it exists

    // And: Create a user with limited capabilities
    const limitedUser = createUserWithCapabilities(['can_create_failure_report']);
    createdUserEmails.push(limitedUser.email);

    // Use authenticated API call to create user (includes session cookies)
    const createResponse = await authenticatedAPICall(page, 'POST', '/api/v1/users', limitedUser);
    expect(createResponse.ok()).toBeTruthy();
    const response = await createResponse.json();
    const userId = response.user?.id;

    // Create "Supervisor" tag if it doesn't exist (makes test independent of seed)
    const tagResponse = await authenticatedAPICall(page, 'POST', '/api/v1/tags', {
      name: 'Supervisor',
      color: '#F59E0B',
      description: 'Personal de supervisión',
    });

    // Ignore 409 (conflict) if tag already exists - test can proceed
    const tagStatus = tagResponse.status();
    if (tagStatus !== 201 && tagStatus !== 409) {
      console.log('Tag creation response status:', tagStatus);
      console.log('Tag creation response body:', await tagResponse.text());
    }

    // When: Assign "Supervisor" tag to user (which might suggest elevated access)
    await page.goto(`/usuarios/${userId}`);

    // Network-first: Wait for user data to load
    const userPromise = page.waitForResponse('**/api/v1/users/**');
    await userPromise;

    // Select "Supervisor" tag using checkbox
    await page.getByTestId('tag-checkbox-Supervisor').click();

    // Wait for tag assignment to complete
    const updatePromise = page.waitForResponse('**/api/v1/users/**/tags');
    await page.getByRole('button', { name: 'Guardar Etiquetas' }).click();
    await updatePromise;

    // Then: User capabilities should remain unchanged
    // Use authenticated API call to get user (includes session cookies)
    const userResponse = await authenticatedAPICall(page, 'GET', `/api/v1/users/${userId}`);
    const userData = await userResponse.json();
    const user = userData.user;
    expect(user.capabilities).toEqual(['can_create_failure_report']);
    expect(user.capabilities).not.toContain('can_view_kpis');
    expect(user.capabilities).not.toContain('can_manage_users');

    // And: User should NOT have access to protected routes
    // Log out as admin and log in as the created user to verify access
    await page.getByTestId('logout-button').click();
    // NextAuth shows a confirmation page - click to confirm
    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.waitForURL('/login', { timeout: 5000 });

    // Log in as the created user
    await loginAs(page, limitedUser.email, limitedUser.password);

    // Wait for login to complete
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL('/', { timeout: 5000 });

    // Try to access KPIs page - should be denied
    await page.goto('/kpis');
    await expect(page.getByText('No tienes permiso para ver KPIs')).toBeVisible();
  });

  /**
   * P0-E2E-002: Misma etiqueta, diferentes capabilities
   *
   * AC5: Given que dos usuarios tienen la misma etiqueta
   *       When tienen diferentes capabilities asignadas
   *       Then cada usuario mantiene sus propias capabilities
   *       And la etiqueta no sincroniza capabilities entre usuarios
   */
  test('[P0-E2E-002] should allow same tag with different capabilities', async ({ page }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // Wait for page stabilization
    await page.waitForLoadState('domcontentloaded');

    // And: Two users with same tag "Operario" but different capabilities
    const operario1 = createUserWithCapabilities(['can_create_failure_report']);
    const operario2 = createUserWithCapabilities([
      'can_create_failure_report',
      'can_view_all_ots',
      'can_complete_ot',
    ]);
    createdUserEmails.push(operario1.email, operario2.email);

    // Create first user
    const createResponse1 = await authenticatedAPICall(page, 'POST', '/api/v1/users', operario1);
    expect(createResponse1.ok()).toBeTruthy();
    const response1 = await createResponse1.json();
    const userId1 = response1.user?.id;

    // Create second user
    const createResponse2 = await authenticatedAPICall(page, 'POST', '/api/v1/users', operario2);
    expect(createResponse2.ok()).toBeTruthy();
    const response2 = await createResponse2.json();
    const userId2 = response2.user?.id;

    // Create "Operario" tag if it doesn't exist (makes test independent of seed)
    const tagResponse = await authenticatedAPICall(page, 'POST', '/api/v1/tags', {
      name: 'Operario',
      color: '#3B82F6',
      description: 'Personal de operaciones básicas',
    });

    // Ignore 409 (conflict) if tag already exists - test can proceed
    const tagStatus = tagResponse.status();
    if (tagStatus !== 201 && tagStatus !== 409) {
      console.log('Tag creation response status:', tagStatus);
      console.log('Tag creation response body:', await tagResponse.text());
    }

    // When: Assign "Operario" tag to both users
    await page.goto(`/usuarios/${userId1}`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for user data to load
    const user1Promise = page.waitForResponse('**/api/v1/users/**');
    await user1Promise;

    await page.getByTestId('tag-checkbox-Operario').click();

    // Wait for tag update to complete
    const update1Promise = page.waitForResponse('**/api/v1/users/**/tags');
    await page.getByRole('button', { name: 'Guardar Etiquetas' }).click();
    await update1Promise;

    await page.goto(`/usuarios/${userId2}`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for user data to load
    const user2Promise = page.waitForResponse('**/api/v1/users/**');
    await user2Promise;

    await page.getByTestId('tag-checkbox-Operario').click();

    // Wait for tag update to complete
    const update2Promise = page.waitForResponse('**/api/v1/users/**/tags');
    await page.getByRole('button', { name: 'Guardar Etiquetas' }).click();
    await update2Promise;

    // Then: Users should have different capabilities despite same tag
    // Use authenticated API calls to get users (includes session cookies)
    const user1Response = await authenticatedAPICall(page, 'GET', `/api/v1/users/${userId1}`);
    const user2Response = await authenticatedAPICall(page, 'GET', `/api/v1/users/${userId2}`);

    const userData1 = await user1Response.json();
    const userData2 = await user2Response.json();
    const user1 = userData1.user;
    const user2 = userData2.user;

    expect(user1.capabilities).toHaveLength(1);
    expect(user2.capabilities).toHaveLength(3);
    expect(user1.capabilities).not.toEqual(user2.capabilities);

    // And: Both users should show "Operario" tag in profile
    // Navigate back to user list first to avoid server issues
    await page.goto('/usuarios');
    await page.waitForLoadState('domcontentloaded');

    await page.goto(`/usuarios/${userId1}`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByTestId('usuario-etiquetas')).toContainText('Operario');

    // Navigate back to user list first to avoid server issues
    await page.goto('/usuarios');
    await page.waitForLoadState('domcontentloaded');

    await page.goto(`/usuarios/${userId2}`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByTestId('usuario-etiquetas')).toContainText('Operario');
  });

  /**
   * P0-E2E-003: Eliminar etiqueta NO afecta capabilities
   *
   * AC5: Given que un usuario tiene una etiqueta asignada
   *       When elimino la etiqueta
   *       Then las capabilities del usuario se mantienen intactas
   */
  test('[P0-E2E-003] should preserve capabilities when tag is deleted', async ({ page }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // Wait for page stabilization
    await page.waitForLoadState('domcontentloaded');

    // And: User with specific capabilities
    const tecnico = createUserWithCapabilities(['can_view_all_ots']);
    createdUserEmails.push(tecnico.email);

    // Create user with authenticated API call
    const createResponse = await authenticatedAPICall(page, 'POST', '/api/v1/users', tecnico);
    expect(createResponse.ok()).toBeTruthy();
    const response = await createResponse.json();
    const userId = response.user?.id;

    // Verify user capabilities before tag deletion
    // Use authenticated API call to get user (includes session cookies)
    const beforeResponse = await authenticatedAPICall(page, 'GET', `/api/v1/users/${userId}`);
    const userBeforeData = await beforeResponse.json();
    const userBefore = userBeforeData.user;
    expect(userBefore.capabilities).toEqual(['can_view_all_ots']);

    // Create "Supervisor" tag if it doesn't exist (makes test independent of seed)
    // Use authenticated API call to create tag (includes session cookies)
    const tagResponse = await authenticatedAPICall(page, 'POST', '/api/v1/tags', {
      name: 'Supervisor',
      color: '#F59E0B',
      description: 'Personal de supervisión',
    });

    // Ignore 409 (conflict) if tag already exists - test can proceed
    const tagStatus = tagResponse.status();
    if (tagStatus !== 201 && tagStatus !== 409) {
      console.log('Tag creation response status:', tagStatus);
      console.log('Tag creation response body:', await tagResponse.text());
    }

    // When: Delete "Supervisor" tag from system
    await page.goto('/usuarios/etiquetas');
    await page.waitForLoadState('domcontentloaded');

    // Find "Supervisor" tag card using data-testid or fallback to text-based locator
    const supervisorCard = page.locator('[data-testid="tag-card-Supervisor"]').or(
      page.locator('div').filter({ hasText: 'Supervisor' }).filter({ hasText: /eliminar|delete/i })
    );

    // Handle native confirm dialog BEFORE clicking
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Supervisor');
      dialog.accept();
    });

    await supervisorCard.getByRole('button', { name: 'Eliminar' }).click();

    // Wait for deletion to complete - wait for tag list to reload
    await page.waitForResponse('**/api/v1/tags');
    await page.waitForLoadState('domcontentloaded');

    // Then: User capabilities should remain unchanged
    // Use authenticated API call to get user (includes session cookies)
    const afterResponse = await authenticatedAPICall(page, 'GET', `/api/v1/users/${userId}`);
    const userAfterData = await afterResponse.json();
    const userAfter = userAfterData.user;
    expect(userAfter.capabilities).toEqual(['can_view_all_ots']);
  });
});
