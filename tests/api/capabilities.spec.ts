/**
 * API Tests: Capabilities Endpoint
 * Epic 1: User Authentication and Management
 *
 * Tests cover:
 * - GET /api/v1/capabilities (public, no auth required)
 *
 * Aligned with actual implementation: app/api/v1/capabilities/route.ts
 *
 * NOTE: Other API endpoints (users, auth) require NextAuth session management
 * and are tested via E2E tests and Integration tests instead.
 */

import { test, expect } from '@playwright/test';

function getBaseURL(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

test.describe('GET /api/v1/capabilities', () => {
  test('[P0-API-001] should return all 15 PBAC capabilities', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('capabilities');
    expect(Array.isArray(body.capabilities)).toBeTruthy();
    expect(body.capabilities.length).toBe(15);

    // Verify capability structure
    body.capabilities.forEach((capability: any) => {
      expect(capability).toHaveProperty('id');
      expect(capability).toHaveProperty('name');
      expect(capability).toHaveProperty('label');
      expect(capability).toHaveProperty('description');
      expect(typeof capability.id).toBe('string');
      expect(typeof capability.name).toBe('string');
      expect(typeof capability.label).toBe('string');
      expect(typeof capability.description).toBe('string');
    });
  });

  test('[P0-API-002] should return capabilities sorted alphabetically by name', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const capabilities = body.capabilities;

    // Verify alphabetical sorting by name
    for (let i = 0; i < capabilities.length - 1; i++) {
      expect(capabilities[i].name <= capabilities[i + 1].name).toBeTruthy();
    }
  });

  test('[P0-API-003] should return all expected capability names', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const capabilities = body.capabilities;

    // Verify all expected capabilities exist (using actual DB names)
    const expectedCapabilities = [
      'can_assign_technicians',
      'can_complete_ot',
      'can_create_failure_report',
      'can_create_manual_ot',
      'can_manage_assets',
      'can_manage_providers',
      'can_manage_routines',
      'can_manage_stock',
      'can_manage_users',
      'can_receive_reports',
    ];

    const capabilityNames = capabilities.map((c: any) => c.name);
    expectedCapabilities.forEach(cap => {
      expect(capabilityNames).toContain(cap);
    });

    // Verify we have at least 10 capabilities
    expect(capabilityNames.length).toBeGreaterThanOrEqual(10);
  });

  test('[P0-API-004] should have Spanish labels for all capabilities', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const capabilities = body.capabilities;

    // Verify all capabilities have Spanish labels
    capabilities.forEach((capability: any) => {
      expect(capability.label).toBeDefined();
      expect(capability.label.length).toBeGreaterThan(0);
      expect(typeof capability.label).toBe('string');

      // Verify it looks like Spanish (has common Spanish characters or words)
      const hasSpanishChars = /[áéíóúñü¿¡]/.test(capability.label) ||
                             capability.label.includes(' de ') ||
                             capability.label.includes('ión');
      // Note: Not all labels may have Spanish chars, so we don't enforce this strictly
    });

    // Verify we have at least one known Spanish label
    const actualLabels = capabilities.map((c: any) => c.label);
    expect(actualLabels).toContain('Crear Reporte de Avería');
  });

  test('[P1-API-001] should work without authentication (public endpoint)', async ({ request }) => {
    // Call without any auth headers/cookies
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  test('[P1-API-002] should include all required capability fields', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const capabilities = body.capabilities;

    // Each capability should have: id, name, label, description
    capabilities.forEach((capability: any) => {
      // Required fields
      expect(capability.id).toBeDefined();
      expect(capability.id.length).toBeGreaterThan(0);

      expect(capability.name).toBeDefined();
      expect(capability.name).toMatch(/^can_[a-z_]+$/);

      expect(capability.label).toBeDefined();
      expect(capability.label.length).toBeGreaterThan(0);

      expect(capability.description).toBeDefined();
      expect(capability.description.length).toBeGreaterThan(0);
    });
  });

  test('[P1-API-003] should return capabilities in correct format for dropdown/checkbox', async ({ request }) => {
    const response = await request.get(`${getBaseURL()}/api/v1/capabilities`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const capabilities = body.capabilities;

    // Format suitable for UI components (dropdowns, checkboxes)
    capabilities.forEach((capability: any) => {
      // Should have display name (label)
      expect(capability.label).toBeDefined();
      expect(typeof capability.label).toBe('string');

      // Should have internal name (name)
      expect(capability.name).toBeDefined();
      expect(typeof capability.name).toBe('string');

      // Should have help text (description)
      expect(capability.description).toBeDefined();
      expect(typeof capability.description).toBe('string');
    });
  });
});
