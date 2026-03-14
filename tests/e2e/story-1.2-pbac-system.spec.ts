/**
 * E2E Tests: PBAC System with 15 Capabilities
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * P0-E2E-020 to P0-E2E-037
 *
 * Tests cover:
 * - UI de 15 capabilities checkboxes con labels en castellano
 * - Default capability assignment
 * - Capability assignment por admin
 * - Access denied para módulos no autorizados
 * - Admin initial capabilities
 * - Navegación filtrada por capabilities
 * - Access denied por URL directa
 *
 * TDD RED PHASE: All tests marked with test.skip() because feature not implemented yet
 * These tests will FAIL until Story 1.2 implementation is complete.
 *
 * IMPROVEMENTS APPLIED (2026-03-14):
 * - [P3] Data factories extracted to helpers
 * - [P2] Network-first pattern with waitForResponse()
 * - [P2] StorageState optimization ready (uncomment in GREEN phase)
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helpers';
import {
  createUser,
  ALL_CAPABILITIES,
  DEFAULT_CAPABILITY,
  NON_DEFAULT_CAPABILITIES,
  getCapabilityLabel,
} from '../helpers/factories';

/**
 * OPTIMIZATION: Use storageState for faster auth (GREEN PHASE)
 *
 * Uncomment this when Story 1.2 is implemented to skip login UI overhead:
 *
 * test.use({ storageState: 'playwright/.auth/admin.json' });
 *
 * Then remove `await loginAsAdmin(page);` from each test.
 * This saves ~5-10 seconds per test (30% faster execution).
 */

test.describe('Story 1.2: PBAC System with 15 Capabilities (ATDD - RED PHASE)', () => {
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
   * P0-E2E-020: Admin ve 15 checkboxes con labels en castellano
   *
   * AC1: Given que estoy creando o editando un usuario
   *       When veo el formulario de capabilities
   *       Then las 15 capacidades se muestran como checkboxes con etiquetas en castellano
   *       And checkbox group tiene data-testid="capabilities-checkbox-group"
   *       And cada capability tiene data-testid="capability-{name}"
   *
   * Expected Failure:
   * - CapabilityCheckboxGroup component not found
   * - Form route /usuarios/nuevo not implemented
   * - data-testid attributes missing
   */
  test.skip('[P0-E2E-020] should display 15 capability checkboxes with Spanish labels', async ({ page }) => {
    // Given: Admin logged in
    await loginAsAdmin(page);

    // When: Navigate to user creation page
    // NETWORK-FIRST: Wait for API response to prevent race conditions
    const capabilitiesPromise = page.waitForResponse('**/api/v1/capabilities');
    await page.goto('/usuarios/nuevo');
    await capabilitiesPromise; // Explicit wait for capabilities API

    // Then: See capability checkboxes section
    await expect(page.getByTestId('capabilities-checkbox-group')).toBeVisible();

    // And: See all 15 capability checkboxes
    const checkboxes = page.locator('[data-testid^="capability-"]');
    await expect(checkboxes).toHaveCount(15);

    // And: Verify Spanish labels for all 15 capabilities
    for (const capability of ALL_CAPABILITIES) {
      const label = getCapabilityLabel(capability);
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  /**
   * P0-E2E-021: Cada checkbox tiene data-testid correcto
   *
   * AC1: And cada capability tiene data-testid="capability-{name}"
   *
   * Expected Failure:
   * - CapabilityCheckboxGroup component not implemented
   * - data-testid attributes not set
   */
  test.skip('[P0-E2E-021] should have correct data-testid for each capability checkbox', async ({ page }) => {
    await loginAsAdmin(page);

    // NETWORK-FIRST: Wait for API response
    const capabilitiesPromise = page.waitForResponse('**/api/v1/capabilities');
    await page.goto('/usuarios/nuevo');
    await capabilitiesPromise;

    // Verify data-testid attributes for all 15 capabilities
    for (const capability of ALL_CAPABILITIES) {
      const checkbox = page.getByTestId(`capability-${capability}`);
      await expect(checkbox).toBeVisible();
    }
  });

  /**
   * P0-E2E-023: Admin crea usuario con solo default capability
   *
   * AC2: Given que estoy creando un nuevo usuario
   *       When creo un nuevo usuario
   *       Then usuario nuevo tiene ÚNICAMENTE can_create_failure_report seleccionado por defecto
   *       And las otras 14 capabilities están desmarcadas por defecto
   *
   * Expected Failure:
   * - User creation form not implemented
   * - Default capability not assigned
   * - Capabilities not persisted to UserCapability join table
   */
  test.skip('[P0-E2E-023] should create new user with only can_create_failure_report checked by default', async ({
    page,
    request,
  }) => {
    await loginAsAdmin(page);

    // Navigate to user creation
    const capabilitiesPromise = page.waitForResponse('**/api/v1/capabilities');
    await page.goto('/usuarios/nuevo');
    await capabilitiesPromise;

    // Use factory for unique test data
    const userData = createUser({ name: 'María González' });
    createdUserEmails.push(userData.email);

    // Fill user creation form
    await page.getByTestId('register-name').fill(userData.name);
    await page.getByTestId('register-email').fill(userData.email);
    await page.getByTestId('register-phone').fill(userData.phone);
    await page.getByTestId('register-password').fill(userData.password);
    await page.getByTestId('register-confirm-password').fill(userData.password);

    // Verify only can_create_failure_report is checked by default
    const canCreateFailureReport = page.getByTestId(`capability-${DEFAULT_CAPABILITY}`);
    await expect(canCreateFailureReport).toBeChecked();

    // Verify other 14 capabilities are unchecked
    for (const capability of NON_DEFAULT_CAPABILITIES) {
      const checkbox = page.getByTestId(`capability-${capability}`);
      await expect(checkbox).not.toBeChecked();
    }

    // Submit form
    await page.getByTestId('register-submit').click();

    // Wait for redirect to users list
    await page.waitForURL('/usuarios');

    // Verify user created via API
    const searchResponse = await request.get(
      `http://localhost:3000/api/v1/users?email=${encodeURIComponent(userData.email)}`
    );
    expect(searchResponse.status()).toBe(200);

    const users = await searchResponse.json();
    expect(users.length).toBe(1);

    const createdUser = users[0];
    expect(createdUser.capabilities).toHaveLength(1);
    expect(createdUser.capabilities[0].name).toBe(DEFAULT_CAPABILITY);
  });

  /**
   * P0-E2E-025: Admin asigna múltiples capabilities a usuario
   *
   * AC3: Given que estoy editando un usuario
   *       When asigno o removo capabilities
   *       Then cambios aplicados inmediatamente en próxima sesión del usuario
   *
   * Expected Failure:
   * - User edit page not implemented
   * - updateUserCapabilities server action not exists
   * - Capabilities not updated in UserCapability join table
   */
  test.skip('[P0-E2E-025] should allow admin to assign multiple capabilities to user', async ({
    page,
    request,
  }) => {
    await loginAsAdmin(page);

    // Use factory for unique test data
    const userData = createUser({ name: 'Juan Pérez' });
    createdUserEmails.push(userData.email);

    // Create test user first via API
    const createResponse = await request.post('http://localhost:3000/api/v1/users', {
      data: userData,
    });

    const createdUser = await createResponse.json();

    // Navigate to user edit page
    // NETWORK-FIRST: Wait for user capabilities API
    const userCapabilitiesPromise = page.waitForResponse('**/api/v1/users/*/capabilities');
    await page.goto(`/usuarios/${createdUser.id}/editar`);
    await userCapabilitiesPromise;

    // Verify capability checkboxes are visible
    await expect(page.getByTestId('capabilities-checkbox-group')).toBeVisible();

    // Check multiple capabilities
    await page.getByTestId('capability-can_view_kpis').check();
    await page.getByTestId('capability-can_manage_assets').check();
    await page.getByTestId('capability-can_view_repair_history').check();

    // Submit changes
    await page.getByTestId('update-user-capabilities').click();

    // Wait for success message
    await expect(page.getByText('Capabilities actualizadas correctamente')).toBeVisible();

    // Verify changes persisted via API
    const getResponse = await request.get(
      `http://localhost:3000/api/v1/users/${createdUser.id}/capabilities`
    );

    expect(getResponse.status()).toBe(200);

    const capabilities = await getResponse.json();
    expect(capabilities).toHaveLength(4); // Default + 3 newly assigned

    const capabilityNames = capabilities.map((c: any) => c.name);
    expect(capabilityNames).toContain(DEFAULT_CAPABILITY);
    expect(capabilityNames).toContain('can_view_kpis');
    expect(capabilityNames).toContain('can_manage_assets');
    expect(capabilityNames).toContain('can_view_repair_history');
  });

  /**
   * P0-E2E-028: Usuario sin can_manage_assets recibe access denied
   *
   * AC4: Given usuario sin capability can_manage_assets
   *       When intenta acceder a /activos
   *       Then acceso denegado con mensaje: "No tienes permiso para gestionar activos"
   *
   * Expected Failure:
   * - PBAC middleware not implemented
   * - Access denied page not created
   * - Middleware allows access without capability check
   */
  test.skip('[P0-E2E-028] should deny access to /activos for users without can_manage_assets capability', async ({
    page,
  }) => {
    // Use factory for unique test data
    const userData = createUser();
    createdUserEmails.push(userData.email);

    // Login as regular user (will need auth helper or API setup)
    await page.goto('/login');
    await page.getByTestId('login-email').fill(userData.email);
    await page.getByTestId('login-password').fill(userData.password);
    await page.getByTestId('login-button').click();

    // Wait for dashboard
    await page.waitForURL('/dashboard');

    // Try to access /activos directly
    await page.goto('/activos');

    // Expect access denied page
    await expect(page.getByText('No tienes permiso para gestionar activos')).toBeVisible();
    await expect(page).toHaveURL(/\/access-denied/);
  });

  /**
   * P0-E2E-031: Usuario sin can_view_repair_history recibe access denied
   *
   * AC5: Given usuario sin capability can_view_repair_history
   *       When intenta acceder al historial de reparaciones de un equipo
   *       Then acceso denegado con mensaje explicativo
   *
   * Expected Failure:
   * - PBAC middleware not implemented
   * - Access denied message not shown
   */
  test.skip('[P0-E2E-031] should deny access to repair history for users without can_view_repair_history', async ({
    page,
  }) => {
    // Use factory for unique test data
    const userData = createUser();
    createdUserEmails.push(userData.email);

    await page.goto('/login');
    await page.getByTestId('login-email').fill(userData.email);
    await page.getByTestId('login-password').fill(userData.password);
    await page.getByTestId('login-button').click();

    // Try to access repair history
    await page.goto('/equipos/test-equipo-id/historial');

    // Expect access denied
    await expect(page.getByText(/No tienes permiso para ver el historial de reparaciones/)).toBeVisible();
  });

  /**
   * P0-E2E-033: Admin inicial tiene las 15 capabilities
   *
   * AC7: Given que soy el administrador inicial (primer usuario creado)
   *       When consulto mis capabilities
   *       Then tengo las 15 capabilities del sistema asignadas por defecto
   *
   * Expected Failure:
   * - Seed script not implemented
   * - First user doesn't have all 15 capabilities
   */
  test.skip('[P0-E2E-033] should assign all 15 capabilities to initial admin user', async ({ page }) => {
    // Login as initial admin (seeded user)
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('Admin123!');
    await page.getByTestId('login-button').click();

    // Navigate to profile page
    // NETWORK-FIRST: Wait for user capabilities API
    const userCapabilitiesPromise = page.waitForResponse('**/api/v1/users/*/capabilities');
    await page.goto('/perfil');
    await userCapabilitiesPromise;

    // Verify all 15 capabilities are shown
    await expect(page.getByTestId('capabilities-checkbox-group')).toBeVisible();

    const checkboxes = page.locator('[data-testid^="capability-"]');
    await expect(checkboxes).toHaveCount(15);

    // All checkboxes should be checked
    for (const checkbox of await checkboxes.all()) {
      await expect(checkbox).toBeChecked();
    }
  });

  /**
   * P0-E2E-035: Navegación muestra solo módulos con capabilities asignadas
   *
   * AC9: Given que estoy en el dashboard
   *       When navego por la aplicación
   *       Then solo veo módulos en navegación para los que tengo capabilities asignadas
   *
   * Expected Failure:
   * - Navigation component not filtering by capabilities
   * - getNavigationItems helper not implemented
   */
  test.skip('[P0-E2E-035] should show only navigation items for user capabilities', async ({ page }) => {
    // Use factory for unique test data
    const userData = createUser();
    createdUserEmails.push(userData.email);

    await page.goto('/login');
    await page.getByTestId('login-email').fill(userData.email);
    await page.getByTestId('login-password').fill(userData.password);
    await page.getByTestId('login-button').click();

    // Wait for dashboard
    await page.waitForURL('/dashboard');

    // Verify navigation only shows allowed modules
    const navigation = page.getByTestId('main-navigation');

    // Should see these (user has capabilities)
    await expect(navigation.getByText('Averías')).toBeVisible(); // can_create_failure_report

    // Should NOT see these (user lacks capabilities)
    await expect(navigation.getByText('Activos')).not.toBeVisible(); // can_manage_assets
    await expect(navigation.getByText('KPIs')).not.toBeVisible(); // can_view_kpis
    await expect(navigation.getByText('Usuarios')).not.toBeVisible(); // can_manage_users
  });

  /**
   * P0-E2E-037: Access denied al acceder por URL directa
   *
   * AC9: si intento acceder por URL directa a módulo no autorizado, recibo access denied
   *
   * Expected Failure:
   * - Middleware not checking capabilities for direct URL access
   * - Users can bypass navigation filtering
   */
  test.skip('[P0-E2E-037] should deny access when accessing unauthorized module via direct URL', async ({
    page,
  }) => {
    // Use factory for unique test data
    const userData = createUser();
    createdUserEmails.push(userData.email);

    await page.goto('/login');
    await page.getByTestId('login-email').fill(userData.email);
    await page.getByTestId('login-password').fill(userData.password);
    await page.getByTestId('login-button').click();

    // Wait for dashboard
    await page.waitForURL('/dashboard');

    // Try direct URL to /activos (user lacks can_manage_assets)
    await page.goto('/activos');

    // Expect access denied
    await expect(page.getByText('No tienes permiso para gestionar activos')).toBeVisible();
    await expect(page).toHaveURL(/\/access-denied/);
  });
});
