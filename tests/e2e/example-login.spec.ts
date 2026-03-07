import { test, expect } from '@playwright/test';
import { userFactory, assetFactory } from '../factories/data.factories';
import { getByTestId } from '../helpers/api.helpers';

/**
 * Example E2E Test for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * This test demonstrates:
 * - Given/When/Then format
 * - data-testid selector strategy
 * - Factory usage
 * - Network interception pattern
 */

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
  });

  test('P0-001: Usuario inicia sesión correctamente', async ({ page }) => {
    // Given: Usuario existe en el sistema
    const testUser = userFactory({
      email: 'tecnico@example.com',
      nombre: 'María',
      capabilities: ['can_view_kanban'],
    });

    // When: Usuario ingresa credenciales válidas
    await page.fill(getByTestId('email-input'), testUser.email);
    await page.fill(getByTestId('password-input'), 'password123');
    await page.click(getByTestId('login-button'));

    // Then: Usuario es redirigido a dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(`Bienvenida, ${testUser.nombre}`)).toBeVisible();
  });

  test('P0-002: Usuario con credenciales inválidas recibe error', async ({ page }) => {
    // Given: Usuario intenta iniciar sesión
    // When: Usuario ingresa credenciales inválidas
    await page.fill(getByTestId('email-input'), 'invalid@example.com');
    await page.fill(getByTestId('password-input'), 'wrongpassword');
    await page.click(getByTestId('login-button'));

    // Then: Sistema muestra mensaje de error
    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
    await expect(page).toHaveURL('/login'); // Still on login page
  });
});

test.describe('Gestión de Averías', () => {
  test.beforeEach(async ({ page }) => {
    // Login as operario
    const testUser = userFactory({
      email: 'operario@example.com',
      capabilities: ['can_create_failure_report'],
    });

    await page.goto('/login');
    await page.fill(getByTestId('email-input'), testUser.email);
    await page.fill(getByTestId('password-input'), 'password123');
    await page.click(getByTestId('login-button'));
    await page.waitForURL('/dashboard');
  });

  test('P0-003: Operario reporta avería con búsqueda predictiva', async ({ page }) => {
    // Given: Equipo existe en el sistema
    const testAsset = assetFactory({
      nombre: 'Perfiladora-P201',
      planta: 'Planta Acero Perfilado',
      linea: 'Línea 1',
      tipo: 'Perfiladora',
    });

    // When: Operario busca equipo y reporta avería
    await page.click(getByTestId('reportar-averia-button'));

    // Use data-testid for search input
    const searchInput = getByTestId('equipo-search');
    await page.fill(searchInput, 'Perfiladora');

    // Wait for debounced search results
    await page.waitForTimeout(300); // Wait for debounce
    await page.waitForSelector(getByTestId('search-results'));

    // Select first result
    await page.click(getByTestId('equipo-result-0'));

    // Fill avería details
    await page.fill(getByTestId('averia-descripcion'), 'Ruido excesivo en rodillo principal');

    // Submit report
    await page.click(getByTestId('reportar-averia-submit'));

    // Then: Avería es creada exitosamente
    await expect(page.getByText('Avería reportada exitosamente')).toBeVisible();
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Kanban de Órdenes de Trabajo', () => {
  test.beforeEach(async ({ page }) => {
    // Login as supervisor
    const testUser = userFactory({
      email: 'supervisor@example.com',
      capabilities: ['can_view_kanban', 'can_assign_ot'],
    });

    await page.goto('/login');
    await page.fill(getByTestId('email-input'), testUser.email);
    await page.fill(getByTestId('password-input'), 'password123');
    await page.click(getByTestId('login-button'));
    await page.waitForURL('/kanban');
  });

  test('P0-004: Supervisor ve OTs en Kanban', async ({ page }) => {
    // Given: Supervisor está en vista Kanban
    // When: Supervisor carga la página
    await page.waitForSelector(getByTestId('kanban-board'));

    // Then: Kanban muestra 8 columnas
    const columns = await page.locator(getByTestId('kanban-column')).count();
    expect(columns).toBe(8);

    // Verify column names (example assertions)
    await expect(page.getByText('Triage')).toBeVisible();
    await expect(page.getByText('Pendiente')).toBeVisible();
    await expect(page.getByText('En Progreso')).toBeVisible();
    await expect(page.getByText('Completada')).toBeVisible();
  });

  test('P0-005: Supervisor asigna técnico a OT', async ({ page }) => {
    // Given: OT existe en estado Pendiente
    // When: Supervisor arrastra OT a "En Progreso" y asigna técnico
    await page.dragAndDrop(
      getByTestId('ot-card-pendiente-0'),
      getByTestId('kanban-column-en-progreso'),
    );

    // Open OT details modal
    await page.click(getByTestId('ot-card-pendiente-0'));
    await page.click(getByTestId('ot-details-assign-button'));

    // Select technician
    await page.click(getByTestId('tecnico-select'));
    await page.click(getByTestId('tecnico-maria-option'));

    // Confirm assignment
    await page.click(getByTestId('confirm-assignment'));

    // Then: OT muestra técnico asignado
    await expect(page.getByText('Asignado a María')).toBeVisible();
  });
});
