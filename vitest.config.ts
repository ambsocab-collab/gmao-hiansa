import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Framework: Next.js 15.0.3 (App Router)
 * Stack: TypeScript, Prisma, NextAuth.js, SSE
 *
 * Testing Strategy:
 * - Unit tests: Pure functions, utilities, Zod schemas
 * - Integration tests: Server Actions, API routes
 * - Component tests: React components with Vitest
 *
 * Environment: jsdom (components) + node (API routes)
 */
export default defineConfig({
  // Plugins
  plugins: [react()],

  // TypeScript configuration for tests
  tsconfig: './tsconfig.test.json',

  // Test directories - only unit and integration tests
  // e2e tests are run by Playwright, NOT Vitest
  include: [
    'tests/unit/**/*.{test,spec}.{ts,tsx}',
    'tests/integration/**/*.{test,spec}.{ts,tsx}'
  ],

  // Exclude patterns - ensure e2e tests are NOT run by Vitest
  exclude: [
    'node_modules/**',
    'dist/**',
    '.next/**',
    'out/**',
    'tests/e2e/**',           // Exclude all e2e tests
    '**/tests/e2e/**',       // Exclude e2e tests anywhere
    '**/*.e2e.{test,spec}.{ts,tsx}',  // Exclude files with .e2e suffix
  ],

  // Test matching patterns
  testMatch: [
    'tests/unit/**/*.test.{ts,tsx}',
    'tests/unit/**/*.spec.{ts,tsx}',
    'tests/integration/**/*.test.{ts,tsx}',
    'tests/integration/**/*.spec.{ts,tsx}'
  ],

  // Environment
  environment: 'jsdom',

  // Setup files - ensure jest-dom matchers are loaded
  setupFiles: ['./tests/setup.ts'],

  // Coverage
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html', 'lcov'],
    exclude: [
      'node_modules/',
      'tests/',
      '**/*.config.{ts,js}',
      '**/types/**',
      '**/.next/**',
      'playwright.config.ts',
    ],
  },

  // Resolve aliases (match Next.js tsconfig.json)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/types': path.resolve(__dirname, './types'),
      '@/tests': path.resolve(__dirname, './tests'),
    },
  },

  // Global coverage thresholds (adjust after baseline)
  coverageThreshold: {
    lines: 70, // Will adjust after implementation
    functions: 70,
    branches: 70,
    statements: 70,
  },
});
