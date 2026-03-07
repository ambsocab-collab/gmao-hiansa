# Testing Guide for gmao-hiansa

**GMAO (Gestión de Mantenimiento Asistido por Ordenador)**

Framework: Next.js 15.0.3 (App Router) + TypeScript
Testing: Playwright (E2E/API) + Vitest (Unit/Integration)

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

### Playwright E2E Tests

**Run all E2E tests:**

```bash
npx playwright test
```

**Run specific test file:**

```bash
npx playwright test tests/e2e/example-login.spec.ts
```

**Run with UI (headed mode):**

```bash
npx playwright test --ui
```

**Run in debug mode:**

```bash
npx playwright test --debug
```

**Run specific tests by grep:**

```bash
# Run tests matching pattern
npx playwright test -g "login"

# Run only P0 tests
npx playwright test -g "P0-"
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

### Contract Tests (Pact)

**Run consumer contract tests:**

```bash
npm run test:pact:consumer
```

**Publish pacts to broker:**

```bash
npm run publish:pact
```

---

## Test Architecture

### Directory Structure

```
tests/
├── e2e/                          # Playwright E2E tests
│   └── example-login.spec.ts     # Sample E2E test
├── integration/                  # Vitest integration tests
├── unit/                         # Vitest unit tests
│   └── example-utils.test.ts     # Sample unit test
├── fixtures/                     # Playwright test fixtures
│   └── test.fixtures.ts         # Custom fixtures (login, cleanup)
├── helpers/                      # Test helper functions
│   └── api.helpers.ts            # API utilities
├── factories/                    # Test data factories
│   └── data.factories.ts        # Faker.js based factories
└── contract/                     # Pact.js contract tests
    ├── consumer/                 # Consumer contract tests
    │   └── auth-api.pacttest.ts  # Sample Pact test
    └── support/                  # Pact configuration
        ├── pact-config.ts
        └── provider-states.ts
```

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

**Last Updated:** 2026-03-07
**Generated By:** BMad TEA Agent
**Workflow:** Test Architect - Framework Initialization
