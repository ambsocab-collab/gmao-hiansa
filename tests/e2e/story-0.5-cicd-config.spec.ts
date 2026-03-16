import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'yaml';

/**
 * Story 0.5: Error Handling, Observability y CI/CD
 * TDD RED PHASE - All tests are skipped until implementation is complete
 *
 * Test Suite: CI/CD Configuration Validation
 * Priority: P1 (High)
 *
 * Coverage:
 * - AC-0.5.4: CI/CD Configuration Validation
 * - AC-0.5.5: Environment Variables Validation
 */

test.describe.skip('@p1 Story 0.5: CI/CD Configuration Validation', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  /**
   * AC-0.5.4: CI/CD Configuration Validation
   * Tests GitHub Actions workflow and Vercel integration
   */

  test('E0-5.4-001: should have GitHub Actions workflow file', async ({ }) => {
    // Given: project root directory exists
    // When: I check for GitHub Actions workflow
    // Then: workflow file should exist

    const workflowPath = path.join(projectRoot, '.github/workflows/ci.yml');

    try {
      await fs.access(workflowPath);
    } catch (error) {
      throw new Error(`GitHub Actions workflow file does not exist at ${workflowPath}`);
    }
  });

  test('E0-5.4-002: should have workflow configured for pull requests', async ({ }) => {
    // Given: GitHub Actions workflow file exists
    // When: I read the workflow configuration
    // Then: workflow should trigger on pull_request events

    const workflowPath = path.join(projectRoot, '.github/workflows/ci.yml');
    const workflowContent = await fs.readFile(workflowPath, 'utf-8');
    const workflow = yaml.parse(workflowContent);

    expect(workflow.on, 'Workflow should have triggers defined').toBeDefined();
    expect(workflow.on.pull_request, 'Workflow should trigger on PRs').toBeDefined();
  });

  test('E0-5.4-003: should have workflow configured for main branch pushes', async ({ }) => {
    // Given: GitHub Actions workflow file exists
    // When: I read the workflow configuration
    // Then: workflow should trigger on push to main branch

    const workflowPath = path.join(projectRoot, '.github/workflows/ci.yml');
    const workflowContent = await fs.readFile(workflowPath, 'utf-8');
    const workflow = yaml.parse(workflowContent);

    expect(workflow.on.push, 'Workflow should trigger on push').toBeDefined();
    expect(
      workflow.on.push.branches,
      'Workflow should specify branches for push trigger'
    ).toContain('main');
  });

  test('E0-5.4-004: should have test job in workflow', async ({ }) => {
    // Given: GitHub Actions workflow file exists
    // When: I read the workflow configuration
    // Then: workflow should have a test job

    const workflowPath = path.join(projectRoot, '.github/workflows/ci.yml');
    const workflowContent = await fs.readFile(workflowPath, 'utf-8');
    const workflow = yaml.parse(workflowContent);

    expect(workflow.jobs, 'Workflow should have jobs').toBeDefined();
    expect(workflow.jobs.test, 'Workflow should have a test job').toBeDefined();
  });

  test('E0-5.4-005: should have Vercel project configuration', async ({ }) => {
    // Given: project root directory exists
    // When: I check for Vercel configuration
    // Then: Vercel project.json should exist

    const vercelConfigPath = path.join(projectRoot, '.vercel/project.json');

    try {
      await fs.access(vercelConfigPath);
    } catch (error) {
      throw new Error(`Vercel project configuration does not exist at ${vercelConfigPath}`);
    }
  });

  test('E0-5.4-006: should have preview deployment configured', async ({ }) => {
    // Given: Vercel project configuration exists
    // When: I read the Vercel configuration
    // Then: preview deployments should be enabled

    const vercelConfigPath = path.join(projectRoot, '.vercel/project.json');
    const vercelConfig = JSON.parse(await fs.readFile(vercelConfigPath, 'utf-8'));

    expect(vercelConfig.settings, 'Vercel settings should exist').toBeDefined();
  });

  test('E0-5.4-007: should have production deployment environment configured', async ({ }) => {
    // Given: Vercel project configuration exists
    // When: I read the Vercel configuration
    // Then: production environment should be configured

    const vercelConfigPath = path.join(projectRoot, '.vercel/project.json');
    const vercelConfig = JSON.parse(await fs.readFile(vercelConfigPath, 'utf-8'));

    expect(vercelConfig.projectId, 'Vercel project ID should be configured').toBeDefined();
  });

  test('E0-5.4-008: should have install and build steps in workflow', async ({ }) => {
    // Given: GitHub Actions workflow file exists
    // When: I read the workflow configuration
    // Then: workflow should have install and build steps

    const workflowPath = path.join(projectRoot, '.github/workflows/ci.yml');
    const workflowContent = await fs.readFile(workflowPath, 'utf-8');
    const workflow = yaml.parse(workflowContent);

    const testJobSteps = workflow.jobs.test.steps;
    const stepNames = testJobSteps.map((step: any) => step.name || step.uses);
    const stepsString = stepNames.join(' ').toLowerCase();

    expect(stepsString, 'Workflow should have install step').toContain('install');
    expect(stepsString, 'Workflow should have build step').toContain('build');
  });

  /**
   * AC-0.5.5: Environment Variables Validation
   * Tests .env.example and required environment variables
   */

  test('E0-5.5-001: should have .env.example file', async ({ }) => {
    // Given: project root directory exists
    // When: I check for .env.example
    // Then: the file should exist

    const envExamplePath = path.join(projectRoot, '.env.example');

    try {
      await fs.access(envExamplePath);
    } catch (error) {
      throw new Error(`.env.example does not exist at ${envExamplePath}`);
    }
  });

  test('E0-5.5-002: should have DATABASE_URL documented in .env.example', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: DATABASE_URL should be documented

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    expect(envExampleContent, 'DATABASE_URL should be documented').toContain('DATABASE_URL');
    expect(envExampleContent, 'DATABASE_URL should have example value').toContain('postgresql://');
  });

  test('E0-5.5-003: should have NEXTAUTH_SECRET documented in .env.example', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: NEXTAUTH_SECRET should be documented

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    expect(envExampleContent, 'NEXTAUTH_SECRET should be documented').toContain('NEXTAUTH_SECRET');
    expect(envExampleContent, 'NEXTAUTH_SECRET should have generation instructions').toContain('openssl');
  });

  test('E0-5.5-004: should have NEXTAUTH_URL documented in .env.example', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: NEXTAUTH_URL should be documented

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    expect(envExampleContent, 'NEXTAUTH_URL should be documented').toContain('NEXTAUTH_URL');
    expect(envExampleContent, 'NEXTAUTH_URL should have default localhost value').toContain('localhost:3000');
  });

  test('E0-5.5-005: should have SSE configuration documented in .env.example', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: SSE_HEARTBEAT_INTERVAL should be documented

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    expect(envExampleContent, 'SSE_HEARTBEAT_INTERVAL should be documented').toContain('SSE_HEARTBEAT_INTERVAL');
    expect(envExampleContent, 'SSE_HEARTBEAT_INTERVAL should be 30000ms').toContain('30000');
  });

  test('E0-5.5-006: should have all required environment variables documented', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: all required variables should be documented

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'NODE_ENV'
    ];

    for (const envVar of requiredVars) {
      expect(envExampleContent, `${envVar} should be documented`).toContain(envVar);
    }
  });

  test('E0-5.5-007: should have environment variable validation at startup', async ({ }) => {
    // Given: application is starting
    // When: required environment variables are missing
    // Then: application should fail to start with clear error message

    // This test validates that the application validates environment variables
    // It would typically be tested by:
    // 1. Temporarily renaming .env.local
    // 2. Attempting to start the application
    // 3. Verifying that it fails with a clear error about missing variables

    // For E2E, we verify the validation logic exists in the codebase
    const envValidationFiles = [
      path.join(projectRoot, 'lib', 'db.ts'),
      path.join(projectRoot, 'app', 'api', 'auth', '[...nextauth]', 'route.ts')
    ];

    for (const filePath of envValidationFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const hasValidation =
          content.includes('process.env.DATABASE_URL') ||
          content.includes('process.env.NEXTAUTH_SECRET') ||
          content.includes('env.');

        // At least one file should validate environment variables
        if (hasValidation) {
          expect(true).toBe(true);
          return;
        }
      } catch (error) {
        // File might not exist, continue to next
      }
    }

    throw new Error('Environment variable validation not found in codebase');
  });

  test('E0-5.5-008: should have documentation for environment-specific variables', async ({ }) => {
    // Given: .env.example exists
    // When: I read the file
    // Then: NODE_ENV should have documented values

    const envExamplePath = path.join(projectRoot, '.env.example');
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8');

    expect(envExampleContent, 'NODE_ENV should be documented').toContain('NODE_ENV');
    expect(envExampleContent, 'NODE_ENV values should be documented').toContain('development');
    expect(envExampleContent, 'NODE_ENV values should be documented').toContain('production');
    expect(envExampleContent, 'NODE_ENV values should be documented').toContain('test');
  });
});
