/**
 * Tag Scenario Fixture
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Reusable fixture for common tag testing scenarios.
 * Eliminates code duplication across E2E tests.
 *
 * Provides:
 * - createTestUser(): Create a user with specified capabilities
 * - createTag(): Create a tag via API
 * - ensureStandardTagsExist(): Ensure standard test tags exist
 */

import { test as base } from '@playwright/test';
import { createUserWithCapabilities } from '../helpers/factories';
import { authenticatedAPICall } from '../helpers/auth.helpers';

export type TagScenarioFixture = {
  createTestUser: (capabilities?: string[]) => Promise<{
    email: string;
    password: string;
    id: string;
    capabilities: string[];
  }>;
  createTag: (name: string, color?: string, description?: string) => Promise<void>;
  ensureStandardTagsExist: () => Promise<void>;
};

export const test = base.extend<TagScenarioFixture>({
  /**
   * Create a test user with specified capabilities
   * Returns user data for use in tests
   */
  createTestUser: async ({ page }, use) => {
    const createdUsers: Array<{ email: string; id: string }> = [];

    const createTestUser = async (capabilities = ['can_create_failure_report']) => {
      const testUser = createUserWithCapabilities(capabilities);

      // Create user via API (faster than UI)
      const createResponse = await authenticatedAPICall(page, 'POST', '/api/v1/users', testUser);
      if (!createResponse.ok()) {
        throw new Error(`Failed to create test user: ${createResponse.status()}`);
      }

      const response = await createResponse.json();
      const userId = response.user?.id;

      if (!userId) {
        throw new Error('User ID not found in response');
      }

      // Track for cleanup
      createdUsers.push({ email: testUser.email, id: userId });

      return {
        email: testUser.email,
        password: testUser.password,
        id: userId,
        capabilities: testUser.capabilities || [],
      };
    };

    // Note: Cleanup happens in test.afterAll hooks, not here
    // This fixture just provides helper functions for test setup
    await use(createTestUser);
  },

  /**
   * Create a tag via API (faster than UI)
   */
  createTag: async ({ page }, use) => {
    const createdTags: string[] = [];

    const createTag = async (
      name: string,
      color = '#3B82F6',
      description = ''
    ) => {
      const tagResponse = await authenticatedAPICall(page, 'POST', '/api/v1/tags', {
        name,
        color,
        description,
      });

      const status = tagResponse.status();

      // Ignore 409 (tag already exists) - not an error for tests
      if (status !== 201 && status !== 409) {
        console.warn(`Unexpected tag creation status: ${status}`);
      }

      createdTags.push(name);
    };

    await use(createTag);
  },

  /**
   * Ensure standard test tags exist
   * Creates Supervisor, Operario, Técnico if they don't exist
   * Useful for tests that depend on these tags being available
   */
  ensureStandardTagsExist: async ({ page }, use) => {
    const ensureStandardTagsExist = async () => {
      const standardTags = [
        { name: 'Supervisor', color: '#F59E0B', description: 'Personal de supervisión' },
        { name: 'Operario', color: '#3B82F6', description: 'Personal de operaciones básicas' },
        { name: 'Técnico', color: '#10B981', description: 'Personal técnico' },
        { name: 'Gerente', color: '#8B5CF6', description: 'Personal gerencial' },
        { name: 'Jefe de Planta', color: '#EF4444', description: 'Jefe de planta' },
      ];

      for (const tag of standardTags) {
        try {
          await authenticatedAPICall(page, 'POST', '/api/v1/tags', tag);
        } catch (error) {
          // Ignore 409 conflicts (tag already exists)
          const errorMsg = (error as Error).message;
          if (!errorMsg.includes('409') && !errorMsg.includes('409')) {
            console.warn(`Failed to ensure tag ${tag.name} exists:`, error);
          }
        }
      }
    };

    await use(ensureStandardTagsExist);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
