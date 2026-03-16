# Testing Guide for gmao-hiansa

**GMAO (Gestión de Mantenimiento Asistido por Ordenador)**

Framework: Next.js 15.0.3 (App Router) + TypeScript
Testing: **Playwright (E2E-Primary)** + Vitest (Unit/Integration)

---

## ⚠️ IMPORTANT: Testing Strategy

### Multi-Layered Testing Approach

This project uses a **multi-layered testing strategy** with complementary test types:

**E2E Tests (Playwright) - CRITICAL for User Journeys** ✅
- Tests complete user workflows from login to completion
- Validates UI, API routes, authentication, authorization, and error handling
- Covers PBAC authorization checks and access control
- **59 E2E test files** covering all epics and stories
- **WHY CRITICAL**: Catches integration issues that unit/integration tests miss

**Integration Tests (Vitest) - CRITICAL for Business Logic** ✅
- Tests Server Actions, middleware, and business rules
- Validates PBAC middleware logic and authorization checks
- Tests database operations and data transformations
- Tests state management and data fetching logic
- **~5 integration test files** for cross-feature validation
- **WHY CRITICAL**: Fast feedback on business logic without browser overhead

**Unit Tests (Vitest) - CRITICAL for Utilities** ✅
- Tests pure functions, validation schemas, and utilities
- Tests formatters, transformers, and helpers
- Tests Zod schemas and type definitions
- **~10 unit test files** for isolated function testing
- **WHY CRITICAL**: Fastest feedback, catches bugs at function level

**API Tests (Playwright) - MINIMAL** ⚠️
- Only **1 test file** with 7 tests for public `/api/v1/capabilities` endpoint
- Tests endpoints that DON'T require authentication
- **WHY MINIMAL**: NextAuth makes authenticated API testing complex:
  - NextAuth uses JWT + CSRF tokens that are hard to manage in API-only tests
  - Most endpoints require session management that only works in browser context
  - E2E tests naturally handle auth flow, cookies, and session state
  - API tests for authenticated endpoints are error-prone and brittle

### What This Means

- ✅ **DO**: Write E2E tests for all user-facing features
- ✅ **DO**: Write integration tests for Server Actions, middleware, and business logic
- ✅ **DO**: Write unit tests for pure functions, utilities, validation schemas
- ❌ **DON'T**: Write API tests for authenticated endpoints (use E2E + Integration instead)
- ❌ **DON'T**: Try to test NextAuth flows with API-only tests (won't work reliably)

---

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Running Tests](#running-tests)
3. [Test Architecture](#test-architecture)
4. [Best Practices](#best-practices)
5. [CI Integration](#ci-integration)
6. [Knowledge Base](#knowledge-base)

---

## Setup Instructions

### Prerequisites

**Node.js Version:** 20+ (see `.nvmrc`)

**Install Dependencies:**

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Install testing dependencies
npm install -D @playwright/test vitest @vitest/ui @vitejs/plugin-react
npm install -D @faker-js/faker @seontechnologies/playwright-utils
npm install -D @pact-foundation/pact
npm install -D eslint-plugin-vitest
```

### Environment Configuration

**Copy environment template:**

```bash
cp .env.example .env.local
```

**Update `.env.local` with your test credentials:**

```env
# Test Environment
TEST_ENV=test
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api/v1

# Database (Supabase local)
DATABASE_URL="postgresql://user:password@localhost:5432/gmao_hiansa_test"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="test-secret-min-32-chars-for-testing"
```

---

## Running Tests

### Playwright E2E Tests (PRIMARY)

**Run all E2E tests:**

```bash
npx playwright test
```

**Run specific Epic tests:**

```bash
# Epic 0 (Infrastructure)
npx playwright test tests/e2e/story-0.*

# Epic 1 (Auth & PBAC) - Requires serial execution
npx playwright test --workers=1 tests/e2e/story-1.*

# All Epic 1 tests in serial mode (recommended)
npm run test:e2e:serial
```

**Run with UI (headed mode):**

```bash
npx playwright test --ui
```

**Run in debug mode:**

```bash
npx playwright test --debug
```

**Run specific test file:**

```bash
npx playwright test tests/e2e/story-1.1-login-auth.spec.ts
```

**Run specific tests by grep:**

```bash
# Run tests matching pattern
npx playwright test -g "login"

# Run only P0 tests
npx playwright test -g "P0-"

# Run only flaky tests
npx playwright test -g "flaky"
```

**Update snapshots:**

```bash
npx playwright test --update-snapshots
```

### Vitest Unit/Integration Tests

**Run all tests:**

```bash
npm test
```

**Run in watch mode:**

```bash
npm test --watch
```

**Run with coverage:**

```bash
npm run test:coverage
```

**Run specific test file:**

```bash
npm test tests/unit/example-utils.test.ts
```

### API Tests (MINIMAL)

**Run all API tests:**

```bash
npx playwright test tests/api
```

**Note:** This will only run 7 tests for the public `/api/v1/capabilities` endpoint. Authenticated endpoints are tested via E2E tests.

**Why so few API tests?** See "Why Only 1 API Test File?" section above.

---

### Contract Tests (Pact)

**Setup Pact environment:**

```bash
# Windows (PowerShell)
npm run pact:setup

# Or manually
pwsh scripts/env-setup.ps1
```

**Run consumer contract tests:**

```bash
npm run test:pact:consumer
```

**Publish pacts to broker:**

```bash
npm run publish:pact
```

**Verify deployment safety:**

```bash
npm run can:i:deploy:consumer
```

**Record deployment:**

```bash
npm run record:consumer:deployment
```

---

## Test Architecture

### Directory Structure

```
tests/
├── e2e/                          # Playwright E2E tests (PRIMARY STRATEGY)
│   ├── story-0.*.spec.ts          # Epic 0 E2E tests (infrastructure)
│   ├── story-1.*.spec.ts          # Epic 1 E2E tests (auth, PBAC, profile)
│   ├── helpers/                   # E2E test helpers
│   │   ├── auth.helpers.ts        # Login helpers (loginAsAdmin, etc.)
│   │   └── factories.ts           # Test data factories
│   └── fixtures/                  # Playwright test fixtures
├── unit/                         # Vitest unit tests
│   └── example-utils.test.ts     # Sample unit test
├── integration/                  # Vitest integration tests
│   └── pbac-middleware.test.ts   # PBAC middleware tests
├── api/                          # Playwright API tests (MINIMAL - public endpoints only)
│   ├── capabilities.spec.ts      # Public endpoint test (7 tests)
│   └── README.md                 # Why no more API tests?
├── fixtures/                     # Playwright test fixtures
│   └── test.fixtures.ts         # Custom fixtures (login, cleanup)
├── factories/                    # Test data factories
│   └── data.factories.ts        # Faker.js based factories
└── contract/                     # Pact.js contract tests
    ├── consumer/                 # Consumer contract tests
    │   └── auth-api.pacttest.ts  # Sample Pact test
    └── support/                  # Pact configuration
        ├── pact-config.ts
        └── provider-states.ts
```

### Test Type Breakdown

| Test Type | Count | Purpose | Examples |
|-----------|-------|---------|----------|
| **E2E** | **59 files** | **User journeys, auth flows, UI testing** | Login, create OT, PBAC checks |
| **Integration** | **~5 files** | **Server Actions, middleware, business logic** | PBAC middleware, auth, Server Actions |
| **Unit** | **~10 files** | **Pure functions, utilities, schemas** | Validation, formatters, Zod schemas |
| **API** | 1 file | Public endpoints only | Capabilities endpoint (7 tests) |
| Performance | 3 scripts | Load testing, baselines | Login, search, create OT |
| Contract | 1 file | Pact consumer tests | Auth API contract |

**NOTE:** E2E, Integration, and Unit tests are all CRITICAL and actively maintained. Only API tests are minimal due to NextAuth complexity.

### Why Only 1 API Test File?

**Question:** Why are there so few API tests?

**Answer:** NextAuth makes API testing complex and unreliable:

**The Problem:**
```typescript
// Required flow for authenticated API calls:
// 1. GET /api/auth/csrf → Get CSRF token
// 2. POST /api/auth/callback/credentials → Login with CSRF + credentials
// 3. Extract cookies from response headers (complex)
// 4. Manually manage session tokens
// 5. Handle token expiration and refresh
// This is brittle compared to E2E tests!
```

**The Solution - E2E Tests:**
```typescript
// E2E tests handle auth automatically:
test('user can create OT', async ({ page }) => {
  await loginAsAdmin(page); // One line handles all auth complexity
  await page.goto('/ordenes/nueva');
  await page.fill('[data-testid="ot-title"]', 'Avería P201');
  await page.click('[data-testid="create-ot-button"]');
  // Done! Auth, API call, and UI all tested together
});
```

**What Gets Tested Instead:**

| Endpoint | Auth Required | E2E Tests | Integration Tests | API Tests |
|----------|---------------|-----------|-------------------|-----------|
| `/api/v1/capabilities` | ❌ No | ✅ | ✅ | ✅ (only this one) |
| `/api/auth/*` | ✅ Yes (JWT) | ✅ | ✅ | ❌ (too complex) |
| `/api/v1/users` | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use E2E/Integration) |
| `/api/v1/users/[id]` | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use E2E/Integration) |
| `/api/v1/ots` | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use E2E/Integration) |
| Server Actions | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use Integration) |

**Key Point:** Authenticated endpoints are tested via **both** E2E (for full user flows) **and** Integration tests (for business logic validation). This provides comprehensive coverage without the complexity of API-only tests.

---

### Fixtures

**Playwright fixtures** provide reusable test setup:

```typescript
// Login as specific role
await loginAs('operario');  // operario, tecnico, supervisor, admin, stock_manager

// Auto-cleanup test data
testWithCleanup(async ({ page, cleanupTestData }) => {
  // Test implementation...
  // Auto-cleanup happens automatically
});
```

### Factories

**Data factories** generate unique test data:

```typescript
// Generate unique user
const testUser = userFactory({
  email: 'test@example.com',
  nombre: 'Juan',
  capabilities: ['can_create_failure_report'],
});

// Generate unique asset
const testAsset = assetFactory({
  nombre: 'Perfiladora-P201',
  planta: 'Planta Acero Perfilado',
  tipo: 'Perfiladora',
});

// Generate sequence of unique items
const assets = generateSequence(assetFactory, 5);
```

---

## Best Practices

### Selectors

**Use `data-testid` for user-visible elements:**

```tsx
// ✅ GOOD
<button data-testid="login-button">Iniciar Sesión</button>

// ❌ BAD
<button className="btn-primary">Iniciar Sesión</button>
```

**Avoid implementation details in selectors:**

```typescript
// ✅ GOOD
page.click('[data-testid="submit-button"]')

// ❌ BAD
page.click('.btn-primary') // Class names change
page.click('#submit-btn') // IDs may change
```

### Test Isolation

**Each test must be independent:**

```typescript
test('P0-001: Usuario reporta avería', async ({ page }) => {
  // Given: Unique data
  const testAsset = assetFactory(); // Generates unique asset per test

  // When: Test actions
  // ...

  // Then: Assertions
});
```

**Auto-cleanup is handled by fixtures:**

```typescript
testWithCleanup(async ({ page, cleanupTestData }) => {
  // Use cleanupTestData to register resources
  // Automatic cleanup after test
});
```

### Network-First Testing

**Intercept and assert on API calls:**

```typescript
// Intercept API call
await page.route('**/api/v1/ots', async (route) => {
  const response = await route.fetch();
  assertAPIResponse(response);
  await route.continue();
});
```

### Wait Strategies

**Use explicit waits instead of hard waits:**

```typescript
// ✅ GOOD - Wait for specific condition
await page.waitForSelector('[data-testid="search-results"]');
await page.waitForURL('**/dashboard');

// ❌ BAD - Hard timeout (brittle)
await page.waitForTimeout(5000);
```

---

## CI Integration

### GitHub Actions

**Playwright runs on:** Pull requests

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version-file: '.nvmrc'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Parallelization

**Playwright uses 4 workers in CI** (8 workers local)

```bash
# CI (faster, more consistent)
npx playwright test --workers=4

# Local (faster development iteration)
npx playwright test --workers=8
```

---

## Knowledge Base References

**TEA Knowledge Fragments Used:**

- **playwright-cli.md** - CLI patterns and commands
- **test-quality.md** - Definition of Done (<300 lines, <1.5min, no hard waits)
- **network-first.md** - Network interception patterns
- **data-factories.md** - Factory patterns with Faker.js
- **fixture-architecture.md** - Fixture composition and auto-cleanup

**Project Documentation:**

- `project-context.md` - 95 critical implementation rules
- `architecture.md` - Architecture Decision Document
- `prd.md` - Product Requirements Document (123 FRs)
- `ux-design-specification.md` - UX Design Specification

**Test Design:**

- `test-design-qa.md` - 102 test scenarios (73 P0, 26 P1, 3 P2)
- `test-design-architecture.md` - Architecture concerns and testability

---

## Troubleshooting

### Common Issues

**Issue: Tests fail locally but pass in CI**

**Solution:** Check environment variables in `.env.local`

---

**Issue: Timeout errors**

**Solution:** Increase timeout in `playwright.config.ts`:

```typescript
timeout: 120 * 1000, // Increase to 120 seconds
```

---

**Issue: Flaky tests**

**Solution:** Use `test.retry()` in Playwright or wait for specific conditions

```typescript
test('flaky test', async ({ page }) => {
  test.retry(3); // Retry up to 3 times
  // Test implementation...
});
```

---

**Issue: Tests run slowly**

**Solution:**
- Use parallel workers: `npx playwright test --workers=8`
- Use `test.describe.configure({ mode: 'parallel' })` for parallel test suites

---

## Resources

**Documentation:**
- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)
- [Pact.js Docs](https://docs.pact.io)
- [Faker.js Docs](https://fakerjs.dev)

**Project-Specific:**
- `project-context.md` - Critical rules for AI agents
- `test-design-qa.md` - Test plan with 102 scenarios
- `framework-setup-progress.md` - Framework setup progress

---

**Last Updated:** 2026-03-16
**Generated By:** BMad TEA Agent
**Workflow:** Test Architect - Framework Initialization

**Important Notes:**
- This project uses **E2E-first testing strategy** due to NextAuth authentication complexity
- API tests are minimal (only public endpoints) - authenticated endpoints tested via E2E
- See `tests/api/README.md` for detailed explanation of API testing limitations
- See `project-context.md` for complete testing rules and patterns
