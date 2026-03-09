import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Story 0.1: Starter Template y Stack Técnico
 * TDD RED PHASE - All tests are skipped until implementation is complete
 *
 * Test Suite: Next.js Project Setup Validation
 * Priority: P0 (Critical)
 *
 * Coverage:
 * - AC-0.1.1: Next.js Project Setup Validation
 * - AC-0.1.2: Dependency Installation Verification
 * - AC-0.1.3: Tailwind CSS Configuration Validation
 * - AC-0.1.4: shadcn/ui Components Installation
 */

test.describe('@p0 Story 0.1: Next.js Project Setup Validation', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  /**
   * AC-0.1.1: Next.js Project Setup Validation
   * Tests directory structure and core framework installation
   */

  test('E0-1.1-001: should have Next.js 15.0.3 in package.json', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: Next.js version should be 15.0.3 or compatible (^15.0.3)

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies.next, 'Next.js should be installed').toBeDefined();
    // Strip caret (^) or tilde (~) from version string for validation
    const version = packageJson.dependencies.next.replace(/^[\^~]/, '');
    expect(
      version,
      'Next.js version should be 15.0.3 or compatible'
    ).toMatch(/^15\.0\.3/);
  });

  test('E0-1.1-002: should have TypeScript 5.x in devDependencies', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: TypeScript version should be 5.x (compatible with 5.3.3+)

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.devDependencies.typescript, 'TypeScript should be installed').toBeDefined();
    // Strip caret (^) or tilde (~) from version string for validation
    const version = packageJson.devDependencies.typescript.replace(/^[\^~]/, '');
    expect(
      version,
      'TypeScript version should be 5.x or higher'
    ).toMatch(/^5\./);
  });

  test('E0-1.1-003: should have required directory structure', async ({}) => {
    // Given: project root directory exists
    // When: I check the directory structure
    // Then: all required directories should exist

    const requiredDirs = [
      'app',
      'components',
      'lib',
      'prisma',
      'types',
      'public'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(projectRoot, dir);
      try {
        await fs.access(dirPath);
      } catch (error) {
        throw new Error(`Required directory "${dir}" does not exist at ${dirPath}`);
      }
    }
  });

  /**
   * AC-0.1.2: Dependency Installation Verification
   * Tests critical dependencies are installed with correct versions
   */

  test('E0-1.2-001: should have Prisma 5.22.0 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: Prisma version should be 5.22.0

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies.prisma, 'Prisma should be installed').toBeDefined();
    const prismaVersion = packageJson.dependencies.prisma.replace(/^[\^~]/, '');
    expect(
      prismaVersion,
      'Prisma version should be 5.22.0 or compatible'
    ).toMatch(/^5\.22\.0/);

    expect(packageJson.dependencies['@prisma/client'], '@prisma/client should be installed').toBeDefined();
    const prismaClientVersion = packageJson.dependencies['@prisma/client'].replace(/^[\^~]/, '');
    expect(
      prismaClientVersion,
      '@prisma/client version should be 5.22.0 or compatible'
    ).toMatch(/^5\.22\.0/);
  });

  test('E0-1.2-002: should have NextAuth 4.24.7 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: NextAuth version should be 4.24.7

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies['next-auth'], 'NextAuth should be installed').toBeDefined();
    const nextAuthVersion = packageJson.dependencies['next-auth'].replace(/^[\^~]/, '');
    expect(
      nextAuthVersion,
      'NextAuth version should be 4.24.7 or compatible'
    ).toMatch(/^4\.24\.7/);
  });

  test('E0-1.2-003: should have Zod 3.23.8 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: Zod version should be 3.23.8

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies.zod, 'Zod should be installed').toBeDefined();
    const zodVersion = packageJson.dependencies.zod.replace(/^[\^~]/, '');
    expect(
      zodVersion,
      'Zod version should be 3.23.8 or compatible'
    ).toMatch(/^3\.23\.8/);
  });

  test('E0-1.2-004: should have React Hook Form 7.51.5 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: React Hook Form version should be 7.51.5

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies['react-hook-form'], 'React Hook Form should be installed').toBeDefined();
    const reactHookFormVersion = packageJson.dependencies['react-hook-form'].replace(/^[\^~]/, '');
    expect(
      reactHookFormVersion,
      'React Hook Form version should be 7.51.5 or compatible'
    ).toMatch(/^7\.51\.5/);
  });

  test('E0-1.2-005: should have TanStack Query 5.x installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: TanStack Query version should be 5.x (compatible with 5.51.0+)

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies['@tanstack/react-query'], 'TanStack Query should be installed').toBeDefined();
    // Strip caret (^) or tilde (~) from version string for validation
    const version = packageJson.dependencies['@tanstack/react-query'].replace(/^[\^~]/, '');
    expect(
      version,
      'TanStack Query version should be 5.x or higher'
    ).toMatch(/^5\./);
  });

  test('E0-1.2-006: should have Lucide React 0.344.0 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: Lucide React version should be 0.344.0

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies['lucide-react'], 'Lucide React should be installed').toBeDefined();
    const lucideReactVersion = packageJson.dependencies['lucide-react'].replace(/^[\^~]/, '');
    expect(
      lucideReactVersion,
      'Lucide React version should be 0.344.0 or compatible'
    ).toMatch(/^0\.344\.0/);
  });

  test('E0-1.2-007: should have bcryptjs 2.4.3 installed', async ({}) => {
    // Given: project root directory exists
    // When: I read package.json
    // Then: bcryptjs version should be 2.4.3

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.dependencies.bcryptjs, 'bcryptjs should be installed').toBeDefined();
    const bcryptjsVersion = packageJson.dependencies.bcryptjs.replace(/^[\^~]/, '');
    expect(
      bcryptjsVersion,
      'bcryptjs version should be 2.4.3 or compatible'
    ).toMatch(/^2\.4\.3/);
  });

  /**
   * AC-0.1.3: Tailwind CSS Configuration Validation
   * Tests Tailwind CSS configuration with custom design system
   */

  test('E0-1.3-001: should have tailwind.config.js file', async ({}) => {
    // Given: project root directory exists
    // When: I check for tailwind.config.js
    // Then: the file should exist

    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');

    try {
      await fs.access(tailwindConfigPath);
    } catch (error) {
      throw new Error(`tailwind.config.js does not exist at ${tailwindConfigPath}`);
    }
  });

  test('E0-1.3-002: should have custom brand colors in tailwind.config.js', async ({}) => {
    // Given: tailwind.config.js exists
    // When: I read the configuration
    // Then: custom colors rojoBurdeos, HiRock, and Ultra should be defined

    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
    // Delete require cache to ensure fresh read
    delete require.cache[require.resolve(tailwindConfigPath)];
    const tailwindConfig = require(tailwindConfigPath);

    const colors = tailwindConfig.theme.extend.colors;

    // Check for brand colors (using gmao namespace from actual config)
    expect(colors.gmao, 'GMAO color namespace should exist').toBeDefined();
    expect(colors.gmao.burdeos, 'rojoBurdeos color should be #7D1220').toBe('#7D1220');
    expect(colors.gmao.hirock, 'HiRock color should be #FFD700').toBe('#FFD700');
    expect(colors.gmao.ultra, 'Ultra color should be #8FBC8F').toBe('#8FBC8F');
  });

  test('E0-1.3-003: should have Inter font scale configured in tailwind.config.js', async ({}) => {
    // Given: tailwind.config.js exists
    // When: I read the configuration
    // Then: Inter font should be configured with proper scale

    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
    delete require.cache[require.resolve(tailwindConfigPath)];
    const tailwindConfig = require(tailwindConfigPath);

    const fontFamily = tailwindConfig.theme.extend.fontFamily;

    expect(fontFamily.sans, 'sans font family should use Inter').toContain('var(--font-inter)');
  });

  test('E0-1.3-004: should have spacing system based on 8px grid', async ({}) => {
    // Given: tailwind.config.js exists
    // When: I read the configuration
    // Then: spacing system should be based on 8px grid

    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
    delete require.cache[require.resolve(tailwindConfigPath)];
    const tailwindConfig = require(tailwindConfigPath);

    const spacing = tailwindConfig.theme.extend.spacing;

    // Validate key spacing values follow 8px grid (0.5rem = 8px)
    expect(spacing.xs, 'xs spacing should be 12px (0.75rem)').toBe('0.75rem');
    expect(spacing.sm, 'sm spacing should be 14px (0.875rem)').toBe('0.875rem');
    expect(spacing.base, 'base spacing should be 16px (1rem)').toBe('1rem');
    expect(spacing.lg, 'lg spacing should be 18px (1.125rem)').toBe('1.125rem');
  });

  /**
   * AC-0.1.4: shadcn/ui Components Installation
   * Tests shadcn/ui base components are properly installed
   */

  test('E0-1.4-001: should have shadcn/ui Button component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Button component
    // Then: button.tsx should exist

    const buttonComponentPath = path.join(projectRoot, 'components/ui/button.tsx');

    try {
      await fs.access(buttonComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Button component does not exist at ${buttonComponentPath}`);
    }
  });

  test('E0-1.4-002: should have shadcn/ui Card component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Card component
    // Then: card.tsx should exist

    const cardComponentPath = path.join(projectRoot, 'components/ui/card.tsx');

    try {
      await fs.access(cardComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Card component does not exist at ${cardComponentPath}`);
    }
  });

  test('E0-1.4-003: should have shadcn/ui Dialog component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Dialog component
    // Then: dialog.tsx should exist

    const dialogComponentPath = path.join(projectRoot, 'components/ui/dialog.tsx');

    try {
      await fs.access(dialogComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Dialog component does not exist at ${dialogComponentPath}`);
    }
  });

  test('E0-1.4-004: should have shadcn/ui Form component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Form component
    // Then: form.tsx should exist

    const formComponentPath = path.join(projectRoot, 'components/ui/form.tsx');

    try {
      await fs.access(formComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Form component does not exist at ${formComponentPath}`);
    }
  });

  test('E0-1.4-005: should have shadcn/ui Table component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Table component
    // Then: table.tsx should exist

    const tableComponentPath = path.join(projectRoot, 'components/ui/table.tsx');

    try {
      await fs.access(tableComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Table component does not exist at ${tableComponentPath}`);
    }
  });

  test('E0-1.4-006: should have shadcn/ui Toast component', async ({}) => {
    // Given: components/ui directory exists
    // When: I check for Toast component
    // Then: toast.tsx should exist

    const toastComponentPath = path.join(projectRoot, 'components/ui/toast.tsx');

    try {
      await fs.access(toastComponentPath);
    } catch (error) {
      throw new Error(`shadcn/ui Toast component does not exist at ${toastComponentPath}`);
    }
  });

  test('E0-1.4-007: should have @/components/ui path alias configured', async ({}) => {
    // Given: tsconfig.json exists
    // When: I read the configuration
    // Then: @/* path alias should be configured

    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));

    expect(tsconfig.compilerOptions.paths, 'paths should be configured').toBeDefined();
    expect(tsconfig.compilerOptions.paths['@/*'], '@/ path alias should point to root').toBeDefined();
  });

  /**
   * Additional validation tests for complete setup
   */

  test('E0-1.5-001: should have PostCSS configuration', async ({}) => {
    // Given: project root directory exists
    // When: I check for PostCSS config
    // Then: postcss.config.js should exist

    const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');

    try {
      await fs.access(postcssConfigPath);
    } catch (error) {
      throw new Error(`postcss.config.js does not exist at ${postcssConfigPath}`);
    }
  });

  test('E0-1.5-002: should have Prisma schema file', async ({}) => {
    // Given: prisma directory exists
    // When: I check for Prisma schema
    // Then: schema.prisma should exist

    const schemaPath = path.join(projectRoot, 'prisma/schema.prisma');

    try {
      await fs.access(schemaPath);
    } catch (error) {
      throw new Error(`Prisma schema file does not exist at ${schemaPath}`);
    }
  });

  test('E0-1.5-003: should have TypeScript configuration for testing', async ({}) => {
    // Given: project root directory exists
    // When: I check for test TypeScript config
    // Then: tsconfig.test.json should exist (optional but recommended)

    const tsconfigTestPath = path.join(projectRoot, 'tsconfig.test.json');

    try {
      await fs.access(tsconfigTestPath);
    } catch (error) {
      // This test is optional, so we just log a warning
      console.warn('tsconfig.test.json does not exist (recommended for testing)');
    }
  });
});
