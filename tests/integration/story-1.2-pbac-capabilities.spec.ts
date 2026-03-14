/**
 * Integration Tests: PBAC Capabilities System
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * P0-API-010 to P0-API-011
 *
 * Tests cover:
 * - Default capability assignment for new users
 * - Audit logging for capability changes
 *
 * TDD RED PHASE: All tests marked with test.skip() because feature not implemented yet
 * These tests will FAIL until Story 1.2 implementation is complete.
 *
 * IMPROVEMENTS APPLIED (2026-03-14):
 * - [P3] Data factories extracted to helpers
 * - [P2] API mocking examples added (comments for GREEN phase)
 */

import { test, expect } from '@playwright/test';
import {
  createUser,
  createAdminUser,
  createUserWithCapabilities,
  DEFAULT_CAPABILITY,
  NON_DEFAULT_CAPABILITIES,
} from '../helpers/factories';

test.describe('Story 1.2: PBAC Capabilities System (ATDD - RED PHASE)', () => {
  // Track created users for cleanup
  const createdUserIds: string[] = [];

  test.afterAll(async ({ request }) => {
    // Cleanup: Delete all test users created during this test suite
    for (const userId of createdUserIds) {
      try {
        await request.delete(`http://localhost:3000/api/v1/users/${userId}`);
        console.log(`Cleaned up test user: ${userId}`);
      } catch (error) {
        console.warn(`Failed to cleanup test user ${userId}:`, error);
      }
    }
    createdUserIds.length = 0;
  });

  /**
   * P0-API-010: Usuario nuevo creado tiene solo can_create_failure_report
   *
   * AC2: Given que estoy creando un nuevo usuario
   *       When creo el usuario
   *       Then usuario nuevo tiene ÚNICAMENTE can_create_failure_report seleccionado por defecto
   *       And las otras 14 capabilities están desmarcadas por defecto
   *
   * Expected Failure:
   * - Server action createUser no implementa default capability
   * - API returns user without capabilities or with wrong capabilities
   */
  test.skip('[P0-API-010] should create new user with only can_create_failure_report capability by default', async ({ request }) => {
    // Use factory for unique test data
    const userData = createUser();

    /**
     * API MOCKING EXAMPLE (GREEN PHASE):
     *
     * Uncomment to mock API response for faster, more reliable tests:
     *
     * await request.post('**/api/v1/users', async (route) => {
     *   route.fulfill({
     *     status: 201,
     *     contentType: 'application/json',
     *     body: JSON.stringify({
     *       id: 'test-user-123',
     *       email: userData.email,
     *       name: userData.name,
     *       capabilities: [
     *         { name: DEFAULT_CAPABILITY, label: 'Reportar averías' }
     *       ]
     *     })
     *   });
     * });
     */

    // Create user via API (endpoint may not exist yet)
    const response = await request.post('http://localhost:3000/api/v1/users', {
      data: userData,
    });

    // Expect 201 Created
    expect(response.status()).toBe(201);

    const createdUser = await response.json();
    createdUserIds.push(createdUser.id); // Track for cleanup

    // Verify user has exactly 1 capability
    expect(createdUser.capabilities).toBeDefined();
    expect(createdUser.capabilities).toHaveLength(1);

    // Verify it's can_create_failure_report
    expect(createdUser.capabilities[0].name).toBe(DEFAULT_CAPABILITY);

    // Verify the other 14 capabilities are NOT assigned
    const allCapabilityNames = createdUser.capabilities.map((c: any) => c.name);
    for (const absentCapability of NON_DEFAULT_CAPABILITIES) {
      expect(allCapabilityNames).not.toContain(absentCapability);
    }
  });

  /**
   * P0-API-011: Auditoría registra cambios de capabilities
   *
   * AC3: Given que estoy editando un usuario
   *       When asigno o removo capabilities
   *       Then auditoría logged: "Capabilities actualizadas para usuario {id} por {adminId}"
   *
   * Expected Failure:
   * - Server action updateUserCapabilities no existe
   * - AuditLog entry not created
   */
  test.skip('[P0-API-011] should log audit entry when user capabilities are updated', async ({ request }) => {
    // Given: Create admin user with can_manage_users capability
    const adminData = createAdminUser({
      capabilities: ['can_manage_users', DEFAULT_CAPABILITY],
    });

    const adminResponse = await request.post('http://localhost:3000/api/v1/users', {
      data: adminData,
    });
    const admin = await adminResponse.json();
    createdUserIds.push(admin.id);

    // Create target user
    const userData = createUser();

    const userResponse = await request.post('http://localhost:3000/api/v1/users', {
      data: userData,
    });
    const user = await userResponse.json();
    createdUserIds.push(user.id);

    // When: Admin assigns multiple capabilities to user
    const capabilitiesToUpdate = [
      'can_view_kpis',
      'can_manage_assets',
      'can_view_repair_history',
    ];

    /**
     * API MOCKING EXAMPLE (GREEN PHASE):
     *
     * Uncomment to mock both the update and audit log APIs:
     *
     * // Mock update capabilities endpoint
     * await request.post(`**/api/v1/users/${user.id}/capabilities`, async (route) => {
     *   route.fulfill({
     *     status: 200,
     *     contentType: 'application/json',
     *     body: JSON.stringify({
     *       success: true,
     *       message: 'Capabilities actualizadas correctamente'
     *     })
     *   });
     * });
     *
     * // Mock audit log endpoint
     * await request.get('**/api/v1/audit-logs*', async (route) => {
     *   route.fulfill({
     *     status: 200,
     *     contentType: 'application/json',
     *     body: JSON.stringify([
     *       {
     *         id: 'audit-123',
     *         action: 'capability_changed',
     *         userId: admin.id,
     *         metadata: {
     *           targetUserId: user.id,
     *           oldCapabilities: [DEFAULT_CAPABILITY],
     *           newCapabilities: capabilitiesToUpdate
     *         },
     *         timestamp: new Date().toISOString()
     *       }
     *     ])
     *   });
     * });
     */

    const updateResponse = await request.post(
      `http://localhost:3000/api/v1/users/${user.id}/capabilities`,
      {
        data: {
          capabilities: capabilitiesToUpdate,
          adminId: admin.id,
        },
      }
    );

    // Then: Update succeeds
    expect(updateResponse.status()).toBe(200);

    // And: AuditLog entry created
    const auditResponse = await request.get(
      `http://localhost:3000/api/v1/audit-logs?userId=${admin.id}&action=capability_changed`
    );

    expect(auditResponse.status()).toBe(200);
    const auditLogs = await auditResponse.json();

    expect(auditLogs.length).toBeGreaterThan(0);

    // Verify audit log structure
    const latestAuditLog = auditLogs[0];
    expect(latestAuditLog.action).toBe('capability_changed');
    expect(latestAuditLog.userId).toBe(admin.id);
    expect(latestAuditLog.metadata.targetUserId).toBe(user.id);
    expect(latestAuditLog.metadata.oldCapabilities).toBeDefined();
    expect(latestAuditLog.metadata.newCapabilities).toEqual(
      expect.arrayContaining(capabilitiesToUpdate)
    );
  });
});
