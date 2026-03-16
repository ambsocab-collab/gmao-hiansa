# API Tests

Tests for Next.js API Routes using Playwright's APIRequestContext.

## ⚠️ Important Note on Authentication

Due to how NextAuth.js works (JWT strategy + CSRF tokens), **most endpoints cannot be tested via pure API calls**.

Endpoints that require authentication are tested via:
- **E2E Tests** (`tests/e2e/`) - Full browser automation
- **Integration Tests** (`tests/integration/`) - Server-side testing with Vitest

See `docs/e2e-testing-lessons-learned.md` for details on NextAuth authentication in tests.

## Test Files

- **`capabilities.spec.ts`** (7 tests) - Public endpoint, no auth required ✅

## Total Tests: 7

## Running Tests

### Run all API tests:
```bash
npm run test:api
```

### Run with UI:
```bash
npm run test:api:ui
```

### Run with debug:
```bash
npm run test:api:debug
```

## Test Coverage

### Capabilities Tests (`capabilities.spec.ts`)

#### P0 Tests (Critical)
- **P0-API-001**: Return all PBAC capabilities
- **P0-API-002**: Return capabilities sorted alphabetically by name
- **P0-API-003**: Return all expected capability names
- **P0-API-004**: Have Spanish labels for all capabilities

#### P1 Tests (Important)
- **P1-API-001**: Work without authentication (public endpoint)
- **P1-API-002**: Include all required capability fields
- **P1-API-003**: Return capabilities in correct format for dropdown/checkbox

## Why Only Capabilities?

Other endpoints require NextAuth session management:

| Endpoint | Auth Required | Test Strategy |
|----------|---------------|---------------|
| `/api/v1/capabilities` | ❌ No | ✅ API tests (here) |
| `/api/auth/*` | ✅ Yes (JWT) | E2E tests |
| `/api/v1/users` | ✅ Yes + PBAC | E2E + Integration |
| `/api/v1/users/[id]/capabilities` | ✅ Yes + PBAC | E2E + Integration |

## Authentication Flow (for reference)

When testing authenticated endpoints, use this pattern (from `docs/e2e-testing-lessons-learned.md`):

```typescript
// Step 1: Get CSRF token
const csrfResponse = await fetch('/api/auth/csrf');
const csrfData = await csrfResponse.json();

// Step 2: Login with API
const loginResponse = await fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    email: 'admin@hiansa.com',
    password: 'admin123',
    redirect: 'false',
    json: 'true'
  })
});

// Step 3: Extract cookies
const cookies = loginResponse.headers.get('set-cookie');
```

**This is complex and error-prone for API-only tests.** Use E2E tests instead.

## Configuration

These tests are included in Playwright's `testMatch`:
```typescript
testMatch: [
  '**/tests/e2e/**/*.spec.ts',
  '**/tests/api/**/*.spec.ts',
]
```

Run separately: `playwright test tests/api`
Run with E2E: `playwright test` (runs both)
