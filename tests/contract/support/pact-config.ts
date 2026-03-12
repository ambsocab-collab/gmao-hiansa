import { SpecificationVersion } from '@pact-foundation/pact';
import path from 'path';

/**
 * Pact Configuration for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Consumer contract testing configuration
 */

export const pactConfig = {
  consumer: 'gmao-frontend',
  provider: 'gmao-api',
  specVersion: SpecificationVersion.SPECIFICATION_VERSION_V4,
  spec: {
    description: 'API contract between Next.js frontend and API routes',
    version: '1.0.0',
  },
  logLevel: process.env.CI ? 'ERROR' : 'DEBUG',
  dir: path.resolve(__dirname, '../../pacts'),
  pactfileWriteMode: 'update',
  // Enable mock server for consumer testing
  host: '127.0.0.1',
  port: 9999,
};
