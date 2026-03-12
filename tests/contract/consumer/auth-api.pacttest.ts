import { PactV4 } from '@pact-foundation/pact';
import { pactConfig } from '../support/pact-config';

/**
 * Pact Consumer Test for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Consumer contract tests for API routes
 * Tests using PactV4 format with URL injection
 */

describe('Auth API', () => {
  const pact = new PactV4({
    consumer: pactConfig.consumer,
    provider: pactConfig.provider,
    spec: pactConfig.spec,
    logLevel: pactConfig.logLevel,
    dir: pactConfig.dir,
  });

  beforeAll(() => pact.setup());
  afterAll(() => pact.finalize());

  describe('POST /api/v1/auth/login', () => {
    it('P0-001: Returns token for valid credentials', async () => {
      await pact.addInteraction({
        uponReceiving: 'a request to login with valid credentials',
        withRequest: {
          method: 'POST',
          path: '/api/v1/auth/login',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            token: pactLike('jwt-token-xyz'),
            user: {
              id: pactLike('user-123'),
              email: 'test@example.com',
              nombre: 'Test User',
              capabilities: ['can_view_kanban'],
            },
          },
        },
      });

      // Test implementation with URL injection
      await pact.executeTest(async (mockUrl) => {
        const response = await fetch(`${mockUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.token).toBeDefined();

        return { token: data.token };
      });
    });

    it('P0-002: Returns 401 for invalid credentials', async () => {
      await pact.addInteraction({
        uponReceiving: 'a request to login with invalid credentials',
        withRequest: {
          method: 'POST',
          path: '/api/v1/auth/login',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            email: 'invalid@example.com',
            password: 'wrongpassword',
          },
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            error: 'Credenciales inválidas',
          },
        },
      });

      await pact.executeTest(async (mockUrl) => {
        const response = await fetch(`${mockUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'invalid@example.com',
            password: 'wrongpassword',
          }),
        });

        expect(response.status).toBe(401);

        const data = await response.json();
        expect(data.error).toBe('Credenciales inválidas');
      });
    });
  });

  describe('GET /api/v1/auth/session', () => {
    it('P0-003: Returns user session for authenticated user', async () => {
      await pact
        .given('usuario autenticado')
        .uponReceiving('a request to get user session')
        .withRequest({
          method: 'GET',
          path: '/api/v1/auth/session',
          headers: {
            Authorization: pactLike('Bearer jwt-token-xyz'),
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              nombre: 'Test User',
              capabilities: ['can_view_kanban'],
            },
          },
        });

      await pact.executeTest(async (mockUrl) => {
        const response = await fetch(`${mockUrl}/api/v1/auth/session`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer jwt-token-xyz',
          },
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.user).toBeDefined();
        expect(data.user.email).toBe('test@example.com');
      });
    });
  });

  describe('GET /api/v1/ots', () => {
    it('P0-004: Returns OTs for authenticated user', async () => {
      await pact
        .given('ots existentes')
        .uponReceiving('a request to get OTs')
        .withRequest({
          method: 'GET',
          path: '/api/v1/ots',
          headers: {
            Authorization: pactLike('Bearer jwt-token-xyz'),
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            ots: [
              {
                id: 'ot-123',
                estado: 'Pendiente',
                tipo_mantenimiento: 'Correctivo',
                prioridad: 'Media',
                equipo_id: 'asset-123',
              },
            ],
          },
        });

      await pact.executeTest(async (mockUrl) => {
        const response = await fetch(`${mockUrl}/api/v1/ots`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer jwt-token-xyz',
          },
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.ots).toBeDefined();
        expect(data.ots).toHaveLength(1);
      });
    });
  });
});
