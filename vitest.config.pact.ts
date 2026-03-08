import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration for Pact Contract Tests
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Minimal configuration for Pact consumer tests
 */
export default defineConfig({
  test: {
    include: ['tests/contract/**/*.pacttest.ts'],
    environment: 'node',
    globals: true,
    testTimeout: 30 * 1000,
  },
});
