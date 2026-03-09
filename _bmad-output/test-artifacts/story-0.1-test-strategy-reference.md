# Story 0.1 Test Strategy - Quick Reference

## Test Statistics

| Metric | Value |
|--------|-------|
| **Total Tests** | 39 |
| **E2E Tests** | 26 (67%) |
| **Unit Tests** | 10 (26%) |
| **Integration Tests** | 3 (7%) |
| **P0 Tests** | 15 (38%) |
| **P1 Tests** | 14 (36%) |
| **P2 Tests** | 10 (26%) |
| **AC Coverage** | 100% (4/4) |
| **Execution Time** | ~45 seconds |

---

## Test ID Format

```
E0-1-X-NNN
│ │ │ │
│ │ │ └─ Sequential number (001-036)
│ │ └─── Test Level (E=E2E, U=Unit, I=Integration)
│ └───── Story 0.1
└─────── Epic 0 (Project Initialization)
```

---

## P0 Tests (Must Pass for Story 0.2)

### AC-0.1.1: Next.js Setup (3 tests)
- `E0-1-E-001`: Required directories exist
- `E0-1-E-002`: Next.js version is 15.0.3
- `E0-1-E-003`: TypeScript version is 5.3.3

### AC-0.1.2: Dependencies (2 tests)
- `E0-1-E-009`: All 9 critical dependencies installed
- `E0-1-E-010`: No dependency version conflicts

### AC-0.1.3: Tailwind Config (6 tests)
- `E0-1-E-015`: tailwind.config.js exists and valid
- `E0-1-E-016`: Custom brand colors configured (#7D1220, #FFD700, #8FBC8F)
- `E0-1-E-017`: 8 OT status colors configured
- `E0-1-E-018`: Inter font family configured
- `E0-1-E-019`: Font scale 12px-36px configured
- `E0-1-E-020`: Spacing system 8px grid configured

### AC-0.1.4: shadcn/ui Components (3 tests)
- `E0-1-E-025`: All base components exist (Button, Card, Dialog, Form, Table, Toast)
- `E0-1-E-026`: @/components/ui alias configured
- `E0-1-E-027`: components/ui directory exists

### Testability (1 test)
- `E0-1-E-032`: .env.example exists with all variables

---

## Test Commands

```bash
# Run all tests
npm run test:ci

# Run only P0 tests (blockers)
npm run test:e2e:p0

# Run E2E tests only
npm run test:e2e

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage
```

---

## Red-Green-Refactor

### Red Phase (Before Implementation)
```bash
$ npm run test:e2e:p0
E0-1-E-001: ✗ Required directories exist
E0-1-E-002: ✗ Next.js version is 15.0.3
...
Tests: 0 passed, 15 failed
```

### Green Phase (After Implementation)
```bash
$ npm run test:e2e:p0
E0-1-E-001: ✓ Required directories exist
E0-1-E-002: ✓ Next.js version is 15.0.3
...
Tests: 15 passed (P0)
✓ Ready for Story 0.2
```

---

## File Structure

```
tests/
├── e2e/
│   ├── story-0.1-project-setup.spec.ts      (8 tests)
│   ├── story-0.1-dependencies.spec.ts        (6 tests)
│   ├── story-0.1-tailwind-config.spec.ts     (10 tests)
│   ├── story-0.1-shadcn-components.spec.ts   (7 tests)
│   └── story-0.1-testability.spec.ts         (5 tests)
├── unit/
│   ├── story-0.1-package-json.test.ts        (4 tests)
│   ├── story-0.1-tailwind-config.test.ts     (3 tests)
│   ├── story-0.1-tsconfig.test.ts            (2 tests)
│   └── story-0.1-env-example.test.ts         (1 test)
└── integration/
    ├── story-0.1-tailwind-integration.test.ts (1 test)
    ├── story-0.1-shadcn-integration.test.ts   (1 test)
    └── story-0.1-alias-integration.test.ts    (1 test)
```

---

## Key Files Validated

| File | Validated By | Tests |
|------|--------------|-------|
| `package.json` | E0-1-E-002, E0-1-E-003, E0-1-E-009, E0-1-E-010 | 4 |
| `tailwind.config.js` | E0-1-E-015 through E0-1-E-024 | 10 |
| `tsconfig.json` | E0-1-E-026, E0-1-E-029 | 2 |
| `.env.example` | E0-1-E-032, E0-1-E-036 | 2 |
| `components/ui/*.tsx` | E0-1-E-025, E0-1-E-027, E0-1-E-030 | 3 |

---

## Success Criteria

- ✅ All 15 P0 tests pass
- ✅ Test execution time < 60 seconds
- ✅ 100% AC coverage (4/4 ACs tested)
- ✅ Clear error messages for failures
- ✅ Tests run in CI/CD pipeline

---

## Common Failure Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Expected directory 'lib' to exist` | Missing directory | Create required directory |
| `Expected Next.js version to be '15.0.3', found '14.0.0'` | Wrong version | Update package.json |
| `Expected Tailwind color 'gmao.hirock' to be '#FFD700'` | Missing color | Add to tailwind.config.js |
| `Expected component file 'button.tsx' to exist` | Missing component | Run `npx shadcn-ui@latest add button` |
| `Expected tsconfig.json to have path alias '@/*'` | Missing alias | Add to tsconfig.json paths |

---

## Next Steps

1. ✅ Create `tests/e2e/` directory
2. ✅ Generate 39 test files
3. ✅ Run tests (all should fail - Red phase)
4. ✅ Implement Story 0.1 (make tests pass - Green phase)
5. ✅ Proceed to Story 0.2

---

*Quick Reference Generated: 2026-03-09*
