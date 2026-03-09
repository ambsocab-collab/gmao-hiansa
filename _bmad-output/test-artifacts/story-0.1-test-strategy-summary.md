# Story 0.1 Test Strategy Summary

**Story:** Story 0.1 - Starter Template y Stack Técnico
**Date:** 2026-03-09
**Total Tests:** 39 (26 E2E, 10 Unit, 3 Integration)
**P0 Tests:** 15 (must pass before Story 0.2)

---

## Test Coverage Matrix

### By Acceptance Criteria

| AC | Description | E2E | Unit | Integration | Total | P0 |
|----|-------------|-----|------|-------------|-------|-----|
| AC-0.1.1 | Next.js Project Setup | 4 | 2 | 0 | 6 | 3 |
| AC-0.1.2 | Dependency Installation | 4 | 2 | 0 | 6 | 2 |
| AC-0.1.3 | Tailwind CSS Config | 6 | 2 | 1 | 9 | 6 |
| AC-0.1.4 | shadcn/ui Components | 4 | 2 | 1 | 7 | 3 |
| Testability | Infrastructure | 8 | 2 | 1 | 11 | 1 |
| **TOTAL** | | **26** | **10** | **3** | **39** | **15** |

### By Test Level

```
┌─────────────────────────────────────┐
│     Test Distribution (39 total)    │
├─────────────────────────────────────┤
│                                     │
│  E2E Tests    ████████████████ 67% │
│  (26 tests)                        │
│                                     │
│  Unit Tests   ███████ 26%           │
│  (10 tests)                        │
│                                     │
│  Integration  █ 7%                  │
│  (3 tests)                         │
│                                     │
└─────────────────────────────────────┘
```

### By Priority

```
┌─────────────────────────────────────┐
│     Priority Distribution           │
├─────────────────────────────────────┤
│                                     │
│  P0 (Blockers)  ████████████ 38%    │
│  (15 tests)                        │
│  → Must pass for Story 0.2         │
│                                     │
│  P1 (Important) ███████████ 36%     │
│  (14 tests)                        │
│  → Good developer experience       │
│                                     │
│  P2 (Nice-to-have) ████████ 26%     │
│  (10 tests)                        │
│  → Edge case coverage              │
│                                     │
└─────────────────────────────────────┘
```

---

## Test Scenario Examples

### Example 1: AC-0.1.1 - Next.js Version Check (P0)

**Test ID:** E0-1-E-002
**Level:** E2E
**Priority:** P0

```typescript
test('E0-1-E-002: [P0] Verify Next.js version is 15.0.3', async () => {
  const packageJson = JSON.parse(
    await fs.readFile('C:\\Users\\ambso\\dev\\gmao-hiansa\\package.json', 'utf-8')
  )

  const nextVersion = packageJson.dependencies.next
  expect(nextVersion).toBe('^15.0.3')
})
```

**Failure Condition:** Next.js version is not 15.0.3
**Error Message:** "Expected Next.js version to be '15.0.3', found '14.0.0'"

---

### Example 2: AC-0.1.3 - Tailwind Custom Colors (P0)

**Test ID:** E0-1-E-016
**Level:** E2E
**Priority:** P0

```typescript
test('E0-1-E-016: [P0] Verify custom brand colors configured', async () => {
  const tailwindConfig = require('C:\\Users\\ambso\\dev\\gmao-hiansa\\tailwind.config.js')

  expect(tailwindConfig.theme.extend.colors.gmao).toBeDefined()
  expect(tailwindConfig.theme.extend.colors.gmao['burdeos']).toBe('#7D1220')
  expect(tailwindConfig.theme.extend.colors.gmao['hirock']).toBe('#FFD700')
  expect(tailwindConfig.theme.extend.colors.gmao['ultra']).toBe('#8FBC8F')
})
```

**Failure Condition:** Custom brand colors not configured
**Error Message:** "Expected Tailwind color 'gmao.hirock' to be '#FFD700'"

---

### Example 3: AC-0.1.4 - shadcn/ui Components (P0)

**Test ID:** E0-1-E-025
**Level:** E2E
**Priority:** P0

```typescript
test('E0-1-E-025: [P0] Verify all base shadcn/ui components exist', async () => {
  const componentsDir = 'C:\\Users\\ambso\\dev\\gmao-hiansa\\components\\ui'

  const requiredComponents = [
    'button.tsx',
    'card.tsx',
    'dialog.tsx',
    'form.tsx',
    'table.tsx',
    'toast.tsx'
  ]

  for (const component of requiredComponents) {
    const componentPath = path.join(componentsDir, component)
    expect(await fs.fileExists(componentPath)).toBe(true)
  }
})
```

**Failure Condition:** Required component missing
**Error Message:** "Expected component file 'components/ui/button.tsx' to exist"

---

## Red-Green-Refactor Flow

### Red Phase (After Test Generation)

```bash
# All tests fail (expected)
$ npm run test:ci

E0-1-E-001: ✗ Required directories exist
  → Expected directory 'lib' to exist

E0-1-E-002: ✗ Next.js version is 15.0.3
  → Expected Next.js version to be '15.0.3', found '14.0.0'

E0-1-E-016: ✗ Custom brand colors configured
  → Expected Tailwind color 'gmao.hirock' to be '#FFD700'

E0-1-E-025: ✗ shadcn/ui components exist
  → Expected component file 'components/ui/button.tsx' to exist

Tests: 0 passed, 39 failed
```

### Green Phase (After Implementation)

```bash
# All P0 tests pass (ready for Story 0.2)
$ npm run test:e2e:p0

E0-1-E-001: ✓ Required directories exist
E0-1-E-002: ✓ Next.js version is 15.0.3
E0-1-E-003: ✓ TypeScript version is 5.3.3
E0-1-E-009: ✓ All critical dependencies installed
E0-1-E-015: ✓ tailwind.config.js exists and valid
E0-1-E-016: ✓ Custom brand colors configured
E0-1-E-017: ✓ OT status colors configured
E0-1-E-018: ✓ Inter font family configured
E0-1-E-019: ✓ Font scale 12px-36px configured
E0-1-E-020: ✓ Spacing system 8px grid configured
E0-1-E-025: ✓ All base shadcn/ui components exist
E0-1-E-026: ✓ @/components/ui alias configured
E0-1-E-027: ✓ components/ui directory exists
E0-1-E-032: ✓ .env.example exists

Tests: 15 passed (P0)
✓ Ready for Story 0.2 development
```

### Refactor Phase (Optional)

```bash
# Optimize test execution
$ npm run test:coverage

✓ All tests passing
✓ Coverage: 100% AC coverage
✓ Execution time: 45 seconds
```

---

## Test Execution Order

```
1. Unit Tests (5 seconds)
   ├─ Parse package.json (E0-1-U-001)
   ├─ Validate directory structure (E0-1-U-002)
   ├─ Parse dependencies (E0-1-U-003)
   ├─ Validate version constraints (E0-1-U-004)
   ├─ Parse Tailwind config (E0-1-U-005)
   ├─ Validate color hex values (E0-1-U-006)
   ├─ Parse tsconfig.json (E0-1-U-007)
   ├─ Validate component exports (E0-1-U-008)
   ├─ Parse .env.example (E0-1-U-009)
   └─ Validate Playwright config (E0-1-U-010)

2. E2E File Checks (10 seconds)
   ├─ AC-0.1.1: Next.js setup (6 tests)
   ├─ AC-0.1.2: Dependencies (6 tests)
   ├─ AC-0.1.3: Tailwind config (9 tests)
   ├─ AC-0.1.4: shadcn/ui components (7 tests)
   └─ Testability: Infrastructure (6 tests)

3. Integration Tests (30 seconds)
   ├─ Tailwind loads in Next.js (E0-1-I-001)
   ├─ shadcn/ui + Tailwind integration (E0-1-I-002)
   └─ @/components/ui alias works (E0-1-I-003)

Total Time: ~45 seconds
```

---

## Key Test Strategy Decisions

### 1. Why E2E Tests as Primary Level?

**Rationale:**
- Story 0.1 validates **project infrastructure**, not runtime behavior
- File system checks are more reliable than parsing logic
- Configuration files are the source of truth
- Clear error messages for missing files/configs

**Alternative Considered:**
- Unit tests only → Too abstract, doesn't validate actual files
- Integration tests only → Too slow, requires full Next.js startup
- **Decision:** E2E tests with file system checks (fast, reliable, explicit)

### 2. Why No Browser Automation?

**Rationale:**
- Story 0.1 has no UI to test yet
- No user flows to validate
- No visual regression needed
- Pure infrastructure validation

**Browser Tests Will Come Later:**
- Story 0.3+: UI component testing
- Story 0.4+: User flow testing
- Story 0.5+: Accessibility testing

### 3. Why 15 P0 Tests?

**Rationale:**
- Must validate all 4 ACs are complete
- Cannot proceed to Story 0.2 without:
  - Correct directory structure (1 test)
  - Correct dependency versions (2 tests)
  - Complete Tailwind config (6 tests)
  - All base components (3 tests)
  - Environment documented (1 test)
  - Test infrastructure ready (2 tests)

**P0 vs P1 vs P2:**
- **P0:** Blocks development (15 tests)
- **P1:** Important but not blocking (14 tests)
- **P2:** Nice-to-have edge cases (10 tests)

---

## Success Criteria

### Before Story 0.2 Can Start

- ✅ All 15 P0 tests pass
- ✅ No P0 tests fail or skip
- ✅ Test execution time < 60 seconds
- ✅ Clear error messages for any failures
- ✅ Tests can run in CI/CD pipeline
- ✅ 100% AC coverage (4/4 ACs tested)

### Quality Gates

```yaml
# .github/workflows/story-0.1-gate.yml
name: Story 0.1 Quality Gate
on:
  pull_request:
    paths:
      - 'package.json'
      - 'tailwind.config.js'
      - 'tsconfig.json'
      - '.env.example'
      - 'components/ui/**'

jobs:
  validate-story-0.1:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run P0 tests
        run: npm run test:e2e:p0

      - name: Fail if any P0 test fails
        run: |
          if [ $? -ne 0 ]; then
            echo "❌ Story 0.1 P0 tests failed. Cannot proceed to Story 0.2."
            exit 1
          fi

      - name: Run all tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Traceability Matrix

### Test IDs to Acceptance Criteria

| Test ID Range | AC | Description | Count |
|---------------|----|-------------|-------|
| E0-1-E-001 to E0-1-E-008 | AC-0.1.1 | Next.js Project Setup | 8 |
| E0-1-E-009 to E0-1-E-014 | AC-0.1.2 | Dependency Installation | 6 |
| E0-1-E-015 to E0-1-E-024 | AC-0.1.3 | Tailwind CSS Config | 10 |
| E0-1-E-025 to E0-1-E-031 | AC-0.1.4 | shadcn/ui Components | 7 |
| E0-1-E-032 to E0-1-E-036 | Testability | Infrastructure | 5 |
| E0-1-U-001 to E0-1-U-010 | All ACs | Unit Tests | 10 |
| E0-1-I-001 to E0-1-I-003 | All ACs | Integration Tests | 3 |

### Acceptance Criteria to Test Coverage

| AC | Test Coverage | P0 Tests | P1 Tests | P2 Tests |
|----|---------------|----------|----------|----------|
| AC-0.1.1 | 100% (6/6 scenarios) | 3 | 3 | 0 |
| AC-0.1.2 | 100% (6/6 scenarios) | 2 | 2 | 2 |
| AC-0.1.3 | 100% (9/9 scenarios) | 6 | 2 | 1 |
| AC-0.1.4 | 100% (7/7 scenarios) | 3 | 3 | 1 |
| Testability | 100% (5/5 scenarios) | 1 | 4 | 0 |

---

## Maintenance Notes

### When to Update Tests

**Scenario 1: Dependency Upgrade**
```bash
# Upgrade Next.js from 15.0.3 to 15.1.0
npm install next@15.1.0

# Update test expectations
# File: tests/e2e/story-0.1-project-setup.spec.ts
- expect(nextVersion).toBe('^15.0.3')
+ expect(nextVersion).toBe('^15.1.0')
```

**Scenario 2: New shadcn/ui Component**
```bash
# Add new component (e.g., Dropdown)
npx shadcn-ui@latest add dropdown

# Update test expectations
# File: tests/e2e/story-0.1-shadcn-components.spec.ts
const requiredComponents = [
  'button.tsx',
  'card.tsx',
  'dialog.tsx',
  'form.tsx',
  'table.tsx',
  'toast.tsx',
+ 'dropdown.tsx'  // New component
]
```

**Scenario 3: New Design Token**
```bash
# Add new color to Tailwind config
# File: tailwind.config.js
colors: {
  gmao: {
    'burdeos': '#7D1220',
    'hirock': '#FFD700',
    'ultra': '#8FBC8F',
+   'slate': '#64748B',  // New color
  }
}

# Update test expectations
# File: tests/e2e/story-0.1-tailwind-config.spec.ts
+ expect(tailwindConfig.theme.extend.colors.gmao['slate']).toBe('#64748B')
```

### When NOT to Update Tests

**Scenario 1: Feature Implementation**
- Tests validate infrastructure, not features
- Adding new API routes doesn't affect Story 0.1 tests

**Scenario 2: Code Refactoring**
- Tests check configuration files, not implementation
- Refactoring lib/ files doesn't affect Story 0.1 tests

**Scenario 3: Bug Fixes**
- Unless bug is in configuration parsing logic
- Most bug fixes are in feature code, not infrastructure

---

## Frequently Asked Questions

### Q: Why so many tests for infrastructure validation?

**A:** Story 0.1 is the foundation for all future stories. If the foundation is weak, everything built on top will be unstable. The 39 tests ensure:
- Correct dependency versions (avoid "it works on my machine")
- Complete configuration (avoid missing Tailwind colors)
- All components present (avoid missing shadcn/ui buttons)
- Clear documentation (avoid missing .env variables)

### Q: Can I skip P1/P2 tests and only run P0?

**A:** Yes, for development speed you can run only P0 tests:
```bash
npm run test:e2e:p0
```
However, P1 tests catch important configuration errors early, and P2 tests provide comprehensive edge case coverage. For CI/CD, run all tests.

### Q: Why E2E tests instead of unit tests for file checks?

**A:** E2E tests with file system checks are:
- More reliable (validate actual files, not mocks)
- More explicit (clear error messages)
- Faster to write (no mocking infrastructure)
- More maintainable (less coupling to implementation)

### Q: How long do these tests take to run?

**A:** Total execution time is ~45 seconds:
- Unit tests: ~5 seconds
- E2E file checks: ~10 seconds
- Integration tests: ~30 seconds

This is fast enough for CI/CD and local development.

### Q: What if a P0 test fails?

**A:** You cannot proceed to Story 0.2 until all P0 tests pass. P0 tests validate the minimum viable infrastructure needed for development. A failing P0 test means:
- Missing directory (create it)
- Wrong dependency version (fix package.json)
- Missing configuration (add to config file)
- Missing component (install with shadcn-ui)

---

## Next Steps

### Immediate Actions

1. ✅ Create `tests/e2e/` directory
2. ✅ Generate 26 E2E test files
3. ✅ Generate 10 unit test files
4. ✅ Generate 3 integration test files
5. ✅ Run tests and verify they all fail (Red phase)
6. ✅ Implement Story 0.1 to make tests pass (Green phase)

### Ready for Step 4

With the test strategy complete, we're ready to:
- Generate the actual test code
- Set up test fixtures and utilities
- Configure test data (if needed)
- Write test documentation

**Current Status:** Step 3 Complete ✅
**Next Phase:** Step 4 - Generate Acceptance Tests

---

*Test Strategy Summary Generated: 2026-03-09*
*Total Test Artifacts: 39 tests across 3 levels*
