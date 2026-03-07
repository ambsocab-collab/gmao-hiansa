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

  // Test directories
  include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/integration/**/*.{test,spec}.{ts,tsx}'],

  // TypeScript configuration
  testMatch: ['**/__tests__/**/*.{test,spec}.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

  // Environment
  environment: 'jsdom',

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

  // Setup files
  setupFiles: ['./tests/setup.ts'],

  // Global coverage thresholds (adjust after baseline)
  coverageThreshold: {
    lines: 70, // Will adjust after implementation
    functions: 70,
    branches: 70,
    statements: 70,
  },
});
