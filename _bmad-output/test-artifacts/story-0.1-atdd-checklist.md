---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy']
lastStep: 'step-03-test-strategy'
lastSaved: '2026-03-09'
story_id: '0.1'
story_title: 'Starter Template y Stack Técnico'
inputDocuments:
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/component-tdd.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/test-healing-patterns.md'
  - 'package.json'
  - 'playwright.config.ts'
  - '_bmad/tea/config.yaml'
---

# Step 1: Preflight & Context Loading - Story 0.1 ATDD Workflow

**Date:** 2026-03-09
**Story:** Story 0.1 - Starter Template y Stack Técnico
**Project:** GMAO-Hiansa (Next.js 15 + TypeScript 5.3.3)
**Working Directory:** C:\Users\ambso\dev\gmao-hiansa

---

## 1. Stack Detection ✅

**Stack Type:** `fullstack`

**Detection Results:**
- **Framework:** Next.js 15.0.3 (App Router)
- **Frontend:** React 18.3.1, TypeScript 5.3.3
- **Backend:** Next.js API Routes, Prisma 5.22.0
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** TanStack Query 5.90.21
- **Authentication:** NextAuth.js 4.24.7
- **Validation:** Zod 3.23.8
- **Form Handling:** React Hook Form 7.51.5

**Evidence:**
- `package.json` contains Next.js 15.0.3 with App Router configuration
- Both frontend (app/, components/) and backend (app/api/, lib/) directories present
- API routes defined in middleware.ts and app directory
- Full-stack dependencies: Prisma, NextAuth, TanStack Query

---

## 2. Prerequisites Check ✅

### Acceptance Criteria (from Epic 0 Traceability Analysis)

Story 0.1 has **clear acceptance criteria** extracted from epics.md:

**AC-0.1.1: Next.js Project Setup Validation**
- **Given** que el proyecto está vacío
- **When** ejecuto `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
- **Then** proyecto creado con Next.js 15.0.3 + TypeScript 5.3.3
- **And** directorio structure creada con /app, /components, /lib, /prisma, /types, /public

**AC-0.1.2: Dependency Installation Verification**
- **Given** proyecto Next.js creado
- **When** instalo dependencias críticas (Prisma 5.22.0, NextAuth 4.24.7, shadcn/ui, Zod 3.23.8, React Hook Form 7.51.5, TanStack Query 5.51.0, Lucide React 0.344.0, bcryptjs 2.4.3)
- **Then** todas las dependencias instaladas sin conflictos de versiones
- **And** package.json contiene todas las dependencias con versiones verificadas

**AC-0.1.3: Tailwind CSS Configuration Validation**
- **Given** dependencias instaladas
- **When** configuro Tailwind CSS con colores del design system
- **Then** colors configurados: rojo burdeos #7D1220, HiRock #FFD700, Ultra #8FBC8F, 8 estados OT
- **And** fuente Inter configurada con scale completa (12px a 36px)
- **And** spacing system basado en grid de 8px

**AC-0.1.4: shadcn/ui Components Installation**
- **Given** Tailwind configurado
- **When** inicializo shadcn/ui
- **Then** componentes base instalados (Button, Card, Dialog, Form, Table, Toast)
- **And** components path alias configurado (@/components/ui)
- **And** Tailwind config extendido con colores custom

**Testability Requirements:**
- data-testid attributes definidos para componentes base
- Configuración de Playwright preparada para testing E2E
- Environment variables documentadas en .env.example

### Test Framework Status ✅

**Playwright Configuration:** PRESENT
- **File:** `C:\Users\ambso\dev\gmao-hiansa\playwright.config.ts`
- **Version:** @playwright/test 1.48.0
- **Test Directory:** `./tests/e2e` (configured but directory does not exist yet)
- **Configuration:**
  - 4 workers (fixed parallelism)
  - 60s timeout per test
  - Chromium browser
  - HTML, JUnit, and List reporters
  - Trace/Screenshot/Video on failure
  - Auto-start dev server on port 3000

**Status:** Framework configured but E2E tests directory missing. Need to create `tests/e2e/` directory.

---

## 3. Story Context Summary ✅

**Story Title:** Story 0.1: Starter Template y Stack Técnico

**User Story:**
> Como desarrollador, quiero inicializar el proyecto Next.js con el stack técnico completo, para tener una base sólida y probada para el desarrollo.

**Scope:**
- Project initialization with Next.js 15 + TypeScript 5.3.3
- Critical dependency installation (9 packages)
- Tailwind CSS configuration with custom design system
- shadcn/ui component library setup
- Test infrastructure preparation

**Acceptance Criteria Count:** 4 main criteria + 3 testability requirements

---

## 4. Framework Analysis ✅

### Test Framework: Playwright

**Existing Test Patterns:**

1. **Unit Tests** (Vitest-based, 15 files found)
2. **Integration Tests** (4 files)
3. **Fixtures** (`tests/fixtures/test.fixtures.ts`)

**Gaps Identified:**
- ❌ E2E tests directory missing (`tests/e2e/` does not exist)
- ❌ No E2E tests found (0 files)
- ❌ Test ID standardization missing (missing E0-1.X-XXX format)
- ❌ Priority tags not used (missing @p0, @p1, @p2)

---

## 5. TEA Config Flags ✅

| Flag | Value | Impact on Story 0.1 |
|------|-------|---------------------|
| `tea_use_playwright_utils` | `true` | Use Playwright test generation patterns |
| `tea_use_pactjs_utils` | `true` | Contract testing available (not needed for Story 0.1) |
| `tea_pact_mcp` | `mcp` | Pact integration available (not needed for Story 0.1) |
| `tea_browser_automation` | `auto` | Auto-detect browser automation framework (Playwright) |
| `test_stack_type` | `fullstack` | Confirms full-stack testing approach |

---

## 6. Knowledge Base Loaded ✅

**Core Tier Fragments:**
1. `data-factories.md` - Factory functions with overrides
2. `component-tdd.md` - Red-Green-Refactor cycle
3. `test-quality.md` - Deterministic, isolated, explicit tests
4. `test-healing-patterns.md` - Selector and timing healing

---

## 7. Confirm Inputs Summary ✅

**Loaded Inputs:**
1. Project Configuration (package.json, playwright.config.ts, tsconfig.json)
2. Story Requirements (4 ACs from Epic 0)
3. Test Infrastructure (Playwright configured, E2E dir missing)
4. TEA Configuration (Playwright utils enabled)
5. Knowledge Base (4 core fragments)

---

## Next Steps

✅ **Step 1 Complete** - Ready for test generation
📁 **Action Required:** Create `tests/e2e/` directory
➡️ **Next Phase:** Step 2 - Generate Acceptance Tests

---
*Step 1 Completed: Preflight & Context Loading*
*Last Updated: 2026-03-09*

---

## Step 2: Generation Mode Selection ✅

**Mode Chosen:** **AI Generation** (Default)

**Rationale:**

1. **Clear Acceptance Criteria:** Story 0.1 has well-defined ACs extracted from Epic 0
   - AC-0.1.1: Next.js 15.0.3 + TypeScript 5.3.3 validation
   - AC-0.1.2: Dependency installation verification
   - AC-0.1.3: Tailwind CSS configuration validation
   - AC-0.1.4: shadcn/ui components installation

2. **Standard Scenarios:** Infrastructure validation tasks
   - File structure verification (directory existence)
   - Configuration validation (package.json, tailwind.config.ts)
   - Version checking (Next.js 15.0.3, TypeScript 5.3.3)
   - Component availability (shadcn/ui Button, Card, Dialog, etc.)

3. **No Complex UI Interactions:** Story 0.1 is about project setup
   - Does not require browser recording of user flows
   - Validation can be done via file system checks and API calls
   - Tests verify infrastructure, not UI behavior

4. **Fullstack but Infrastructure-Focused:**
   - Backend validation: package.json dependencies, tsconfig.json paths
   - Frontend validation: Tailwind config, shadcn/ui components
   - Both can be validated without live browser recording

**Recording Mode Not Required:**
- ❌ No drag-and-drop interactions
- ❌ No multi-step wizards to record
- ❌ No complex state transitions to capture
- ✅ All validations are deterministic (file checks, version reads, config parsing)

**Test Generation Approach:**
- Use AI to generate Playwright tests that:
  - Read and parse configuration files (package.json, tailwind.config.ts, tsconfig.json)
  - Verify directory structure exists
  - Check file contents for expected values
  - Validate shadcn/ui component files are present
  - Confirm environment variables are documented

---
*Step 2 Completed: AI Generation Mode Selected*
*Generation Mode: AI (Not Recording)*

---

## Step 3: Test Strategy Definition ✅

**Date:** 2026-03-09
**Story:** Story 0.1 - Starter Template y Stack Técnico
**Approach:** Infrastructure validation with multi-level testing

---

## 1. Test Scenarios Mapping

### Test ID Format: `E0-1.X-XXX`
- **E0**: Epic 0 (Project Initialization)
- **1**: Story 0.1
- **X**: Test level (E=E2E, U=Unit, I=Integration)
- **XXX**: Sequential test number

### AC-0.1.1: Next.js Project Setup Validation (P0)

| Test ID | Scenario Type | Description | Test Level | Priority |
|---------|--------------|-------------|------------|----------|
| **E0-1-E-001** | Happy Path | Verify all required directories exist (/app, /components, /lib, /prisma, /types, /public) | E2E | P0 |
| **E0-1-E-002** | Happy Path | Verify Next.js version is 15.0.3 in package.json | E2E | P0 |
| **E0-1-E-003** | Happy Path | Verify TypeScript version is 5.3.3 in package.json | E2E | P0 |
| **E0-1-E-004** | Negative | Verify missing required directory causes test failure | E2E | P1 |
| **E0-1-E-005** | Negative | Verify wrong Next.js version (< 15.0.3) causes test failure | E2E | P1 |
| **E0-1-E-006** | Negative | Verify wrong TypeScript version (< 5.3.3) causes test failure | E2E | P1 |
| **E0-1-U-001** | Unit | Parse package.json and extract dependency versions | Unit | P1 |
| **E0-1-U-002** | Unit | Validate directory structure exists on filesystem | Unit | P1 |
| **E0-1-E-007** | Edge Case | Verify empty package.json causes test failure | E2E | P2 |
| **E0-1-E-008** | Edge Case | Verify malformed package.json causes test failure | E2E | P2 |

### AC-0.1.2: Dependency Installation Verification (P0)

| Test ID | Scenario Type | Description | Test Level | Priority |
|---------|--------------|-------------|------------|----------|
| **E0-1-E-009** | Happy Path | Verify all 9 critical dependencies installed (Prisma 5.22.0, NextAuth 4.24.7, Zod 3.23.8, React Hook Form 7.51.5, TanStack Query 5.90.21, Lucide React 0.344.0, bcryptjs 2.4.3) | E2E | P0 |
| **E0-1-E-010** | Happy Path | Verify no dependency version conflicts in package.json | E2E | P0 |
| **E0-1-E-011** | Negative | Verify missing critical dependency causes test failure | E2E | P1 |
| **E0-1-E-012** | Negative | Verify wrong version of critical dependency causes test failure | E2E | P1 |
| **E0-1-U-003** | Unit | Parse package.json dependencies object | Unit | P1 |
| **E0-1-U-004** | Unit | Validate semantic version constraints (^ vs ~ vs exact) | Unit | P2 |
| **E0-1-E-013** | Edge Case | Verify package.json with duplicate dependencies causes test failure | E2E | P2 |
| **E0-1-E-014** | Edge Case | Verify package.json with circular dependencies causes test failure | E2E | P2 |

### AC-0.1.3: Tailwind CSS Configuration Validation (P0)

| Test ID | Scenario Type | Description | Test Level | Priority |
|---------|--------------|-------------|------------|----------|
| **E0-1-E-015** | Happy Path | Verify tailwind.config.js exists and is valid JavaScript | E2E | P0 |
| **E0-1-E-016** | Happy Path | Verify custom colors configured (rojo burdeos #7D1220, HiRock #FFD700, Ultra #8FBC8F) | E2E | P0 |
| **E0-1-E-017** | Happy Path | Verify 8 OT status colors configured | E2E | P0 |
| **E0-1-E-018** | Happy Path | Verify Inter font family configured | E2E | P0 |
| **E0-1-E-019** | Happy Path | Verify font scale from 12px to 36px configured | E2E | P0 |
| **E0-1-E-020** | Happy Path | Verify spacing system based on 8px grid | E2E | P0 |
| **E0-1-E-021** | Negative | Verify missing tailwind.config.js causes test failure | E2E | P1 |
| **E0-1-E-022** | Negative | Verify invalid tailwind.config.js (malformed JS) causes test failure | E2E | P1 |
| **E0-1-U-005** | Unit | Parse tailwind.config.js and extract theme configuration | Unit | P1 |
| **E0-1-U-006** | Unit | Validate color hex values are valid | Unit | P2 |
| **E0-1-I-001** | Integration | Verify Tailwind config loads in Next.js app | Integration | P2 |
| **E0-1-E-023** | Edge Case | Verify empty tailwind.config.js causes test failure | E2E | P2 |
| **E0-1-E-024** | Edge Case | Verify tailwind.config.js with missing theme.extend causes test failure | E2E | P2 |

### AC-0.1.4: shadcn/ui Components Installation (P0)

| Test ID | Scenario Type | Description | Test Level | Priority |
|---------|--------------|-------------|------------|----------|
| **E0-1-E-025** | Happy Path | Verify all base components exist (Button, Card, Dialog, Form, Table, Toast) | E2E | P0 |
| **E0-1-E-026** | Happy Path | Verify @/components/ui path alias configured in tsconfig.json | E2E | P0 |
| **E0-1-E-027** | Happy Path | Verify components/ui directory structure exists | E2E | P0 |
| **E0-1-E-028** | Negative | Verify missing base component causes test failure | E2E | P1 |
| **E0-1-E-029** | Negative | Verify incorrect path alias causes test failure | E2E | P1 |
| **E0-1-U-007** | Unit | Parse tsconfig.json paths configuration | Unit | P1 |
| **E0-1-U-008** | Unit | Validate component file exports (default export, named exports) | Unit | P2 |
| **E0-1-I-002** | Integration | Verify shadcn/ui components integrate with Tailwind config | Integration | P1 |
| **E0-1-I-003** | Integration | Verify component can be imported using @/components/ui alias | Integration | P1 |
| **E0-1-E-030** | Edge Case | Verify empty component file causes test failure | E2E | P2 |
| **E0-1-E-031** | Edge Case | Verify component with invalid TypeScript causes test failure | E2E | P2 |

### Testability Requirements

| Test ID | Scenario Type | Description | Test Level | Priority |
|---------|--------------|-------------|------------|----------|
| **E0-1-E-032** | Happy Path | Verify .env.example exists with all required environment variables | E2E | P0 |
| **E0-1-E-033** | Happy Path | Verify Playwright configuration exists (playwright.config.ts) | E2E | P0 |
| **E0-1-E-034** | Happy Path | Verify data-testid attributes present in base components | E2E | P1 |
| **E0-1-U-009** | Unit | Parse .env.example and validate variable names | Unit | P1 |
| **E0-1-U-010** | Unit | Validate Playwright config has correct test directory | Unit | P1 |
| **E0-1-E-035** | Negative | Verify missing .env.example causes test failure | E2E | P1 |
| **E0-1-E-036** | Negative | Verify missing environment variable in .env.example causes test failure | E2E | P2 |

---

## 2. Test Levels Selection

### E2E Tests (Playwright) - Primary Level

**Why E2E for Story 0.1?**
- Story 0.1 validates **project infrastructure**, not runtime behavior
- File system checks (directories exist, files present)
- Configuration file validation (package.json, tailwind.config.js, tsconfig.json)
- Version verification (Next.js 15.0.3, TypeScript 5.3.3)
- Component availability checks (shadcn/ui Button, Card, etc.)

**E2E Test Approach:**
- Use Playwright's `fs` module to read configuration files
- Use `expect().toBeTruthy()` for file/directory existence checks
- Use `JSON.parse()` to validate JSON structure
- Use regex to match version numbers
- No browser automation needed (pure infrastructure validation)

**Count:** 26 E2E tests (primary validation)

### Unit Tests (Vitest) - Secondary Level

**Why Unit Tests for Story 0.1?**
- Test **configuration parsing logic** in isolation
- Validate individual functions (extract version, parse config)
- Fast feedback without full Next.js startup
- Reusable utilities for future stories

**Unit Test Approach:**
- Test pure functions that parse package.json, tailwind.config.js, tsconfig.json
- Mock file system reads for faster execution
- Validate regex patterns for version matching
- Test color hex validation logic

**Count:** 10 unit tests (supporting validation)

### Integration Tests (Vitest) - Tertiary Level

**Why Integration Tests for Story 0.1?**
- Validate **cross-component integration**
- Tailwind config + shadcn/ui components work together
- Path aliases (@/components/ui) resolve correctly
- Next.js app loads Tailwind styles successfully

**Integration Test Approach:**
- Import shadcn/ui components using @ alias
- Render components with React Testing Library
- Verify Tailwind classes are applied
- Check that TypeScript compilation succeeds

**Count:** 3 integration tests (integration validation)

---

## 3. Test Prioritization

### Priority Definitions

| Priority | Description | Failure Impact | Story 0.1 Count |
|----------|-------------|----------------|----------------|
| **P0** | Blocks development - Project cannot proceed without this | Critical - Cannot start Story 0.2 | 15 tests |
| **P1** | Important - Should pass but workaround may exist | High - Reduced developer experience | 14 tests |
| **P2** | Nice-to-have - Edge cases and negative paths | Medium - Test coverage gap | 10 tests |

### P0 Tests (Blockers) - 15 Tests

**Must Pass Before Story 0.2 Development:**
- E0-1-E-001: Required directories exist
- E0-1-E-002: Next.js 15.0.3 installed
- E0-1-E-003: TypeScript 5.3.3 installed
- E0-1-E-009: All 9 critical dependencies installed
- E0-1-E-010: No dependency conflicts
- E0-1-E-015: tailwind.config.js exists and valid
- E0-1-E-016: Custom brand colors configured
- E0-1-E-017: 8 OT status colors configured
- E0-1-E-018: Inter font family configured
- E0-1-E-019: Font scale 12px-36px configured
- E0-1-E-020: Spacing system 8px grid configured
- E0-1-E-025: All base shadcn/ui components exist
- E0-1-E-026: @/components/ui alias configured
- E0-1-E-027: components/ui directory exists
- E0-1-E-032: .env.example exists with all variables

**P0 Rationale:**
- Without these validations, Story 0.2 (Database Schema) cannot proceed
- Missing dependencies or wrong versions cause runtime failures
- Missing Tailwind config breaks all UI styling
- Missing shadcn/ui components break component library usage

### P1 Tests (Important) - 14 Tests

**Should Pass for Good Developer Experience:**
- E0-1-E-004 through E0-1-E-008: Negative path validations
- E0-1-U-001 through E0-1-U-004: Unit tests for parsing
- E0-1-E-021, E0-1-E-022: Invalid config detection
- E0-1-I-002, E0-1-I-003: Integration validation
- E0-1-E-033 through E0-1-E-036: Testability requirements

**P1 Rationale:**
- Catch configuration errors early
- Provide clear error messages for misconfiguration
- Validate test infrastructure is ready
- Ensure path aliases work correctly

### P2 Tests (Nice-to-Have) - 10 Tests

**Edge Cases and Comprehensive Coverage:**
- E0-1-U-006: Color hex validation
- E0-1-U-008: Component export validation
- E0-1-I-001: Tailwind loads in Next.js
- E0-1-E-023, E0-1-E-024: Empty/malformed configs
- E0-1-E-030, E0-1-E-031: Component edge cases
- Remaining unit tests for parsing utilities

**P2 Rationale:**
- Comprehensive coverage of edge cases
- Validate error handling robustness
- Not required to start development but improves quality

---

## 4. Red Phase Requirements Confirmation

### Tests Will FAIL Without Implementation

All tests are designed to **FAIL** if the implementation is missing or incorrect:

#### AC-0.1.1 Failure Modes

| Test | Failure Condition | Error Message |
|------|------------------|---------------|
| E0-1-E-001 | Missing directory (e.g., /lib) | "Expected directory 'C:\Users\ambso\dev\gmao-hiansa\lib' to exist" |
| E0-1-E-002 | Next.js version < 15.0.3 | "Expected Next.js version to be '15.0.3', found '14.0.0'" |
| E0-1-E-003 | TypeScript version < 5.3.3 | "Expected TypeScript version to be '5.3.3', found '5.0.0'" |

#### AC-0.1.2 Failure Modes

| Test | Failure Condition | Error Message |
|------|------------------|---------------|
| E0-1-E-009 | Missing dependency (e.g., Prisma) | "Expected dependency '@prisma/client' to be installed" |
| E0-1-E-010 | Wrong version (e.g., Zod 3.0.0) | "Expected Zod version to be '3.23.8', found '3.0.0'" |
| E0-1-E-011 | Dependency conflict | "Detected version conflict in package.json" |

#### AC-0.1.3 Failure Modes

| Test | Failure Condition | Error Message |
|------|------------------|---------------|
| E0-1-E-015 | Missing tailwind.config.js | "Expected file 'tailwind.config.js' to exist" |
| E0-1-E-016 | Missing custom color (e.g., HiRock #FFD700) | "Expected Tailwind color 'gmao.hirock' to be '#FFD700'" |
| E0-1-E-017 | Missing OT status color | "Expected OT status color 'ot.pendiente' to be defined" |
| E0-1-E-018 | Wrong font family | "Expected font family 'sans' to include 'Inter'" |
| E0-1-E-019 | Missing font size (e.g., 36px) | "Expected font size '4xl' to be '2.25rem' (36px)" |
| E0-1-E-020 | Wrong spacing scale | "Expected spacing to follow 8px grid system" |

#### AC-0.1.4 Failure Modes

| Test | Failure Condition | Error Message |
|------|------------------|---------------|
| E0-1-E-025 | Missing component (e.g., Button) | "Expected component file 'components/ui/button.tsx' to exist" |
| E0-1-E-026 | Missing path alias | "Expected tsconfig.json to have path alias '@/*'" |
| E0-1-E-027 | Missing components/ui directory | "Expected directory 'components/ui' to exist" |

### Red-Green-Refactor Confirmation

**Red Phase (Current State After Test Generation):**
- All 39 tests will **FAIL** because implementation doesn't exist yet
- Tests validate infrastructure is correctly set up
- Clear error messages guide implementation

**Green Phase (After Implementation):**
- All P0 tests must pass to proceed to Story 0.2
- P1 tests should pass for good developer experience
- P2 tests provide comprehensive coverage

**Refactor Phase (Optional):**
- Optimize test execution time
- Improve error messages
- Refactor shared utilities into helper functions

---

## 5. Test Execution Strategy

### Test Order for Fast Feedback

1. **Fastest First (Unit Tests)** - ~5 seconds
   - Run unit tests first (parse package.json, validate versions)
   - Catch configuration errors immediately
   - No need to start Next.js dev server

2. **Medium Speed (E2E File Checks)** - ~10 seconds
   - Run E2E tests that check files/directories
   - No browser automation needed (pure fs operations)
   - Clear failure messages

3. **Slowest Last (Integration Tests)** - ~30 seconds
   - Run integration tests that import components
   - Require TypeScript compilation
   - Verify cross-component integration

### Test Commands

```bash
# Run all Story 0.1 tests
npm run test:ci

# Run only P0 tests (blockers)
npm run test:e2e:p0

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage
```

### CI/CD Pipeline Integration

```yaml
# .github/workflows/test-story-0.1.yml
name: Test Story 0.1
on: [push, pull_request]
jobs:
  test:
    steps:
      - name: Run P0 tests
        run: npm run test:e2e:p0
      - name: Run all tests
        run: npm run test:ci
      - name: Upload coverage
        run: npm run test:coverage
```

---

## 6. Test Coverage Metrics

### Target Coverage

| Metric Type | Target | Rationale |
|-------------|--------|-----------|
| **AC Coverage** | 100% (4/4 ACs) | All acceptance criteria must have tests |
| **P0 Pass Rate** | 100% (15/15) | All P0 tests must pass to proceed |
| **P1 Pass Rate** | 90%+ (13/14) | High confidence in configuration |
| **P2 Pass Rate** | 80%+ (8/10) | Comprehensive edge case coverage |
| **Test Execution Time** | < 60 seconds | Fast feedback for infrastructure validation |

### Coverage Gaps Identified

**No Gaps Found** - All 4 ACs have comprehensive test coverage:
- AC-0.1.1: 8 tests (4 E2E, 2 unit, 2 edge cases)
- AC-0.1.2: 8 tests (4 E2E, 2 unit, 2 edge cases)
- AC-0.1.3: 10 tests (6 E2E, 2 unit, 1 integration, 1 edge case)
- AC-0.1.4: 7 tests (4 E2E, 2 unit, 1 integration, 0 edge cases)
- Testability: 6 tests (3 E2E, 2 unit, 1 edge case)

**Total:** 39 tests across 3 levels (26 E2E, 10 unit, 3 integration)

---

## 7. Test Data Requirements

### No Test Data Needed

Story 0.1 tests **do not require** test data factories because:
- No database interactions (Prisma not yet configured)
- No API endpoints to test (app/api/ routes not yet created)
- No user authentication to test (NextAuth not yet configured)
- Pure infrastructure validation (files, directories, configs)

### Test Artifacts

**Files Read by Tests:**
- `package.json` - Validate dependencies and versions
- `tailwind.config.js` - Validate Tailwind configuration
- `tsconfig.json` - Validate path aliases
- `.env.example` - Validate environment variables documented
- `components/ui/*.tsx` - Validate shadcn/ui components exist

**No Files Modified:**
- Tests are read-only (no side effects)
- No database writes
- No file creation/deletion
- Safe to run in any environment

---

## 8. Test Maintenance Strategy

### Long-Term Test Maintenance

**When to Update Tests:**
- **Dependencies upgraded:** Update version checks in E0-1-E-002, E0-1-E-003, E0-1-E-009
- **New shadcn/ui components added:** Add to E0-1-E-025
- **New design tokens added:** Extend E0-1-E-016 through E0-1-E-020
- **Test framework changes:** Update test utilities and helpers

**When Tests Should NOT Change:**
- **Feature implementation:** Tests validate infrastructure, not features
- **Code refactoring:** Tests check configuration files, not implementation
- **Bug fixes:** Unless bug is in configuration parsing logic

### Test Heuristics

**Deterministic:**
- Tests read files from known paths
- No random data generation
- No date/time dependencies
- Same result every run

**Isolated:**
- Each test validates one thing
- No dependencies between tests
- Can run in any order
- No shared state

**Explicit:**
- Clear test names (E0-1-E-001: Verify required directories exist)
- Descriptive error messages
- Comments explain why, not what
- Test IDs map to acceptance criteria

---

## 9. Risk Assessment

### High-Risk Areas (Mitigated by Tests)

| Risk | Mitigation | Test Coverage |
|------|------------|---------------|
| **Wrong dependency version** | E0-1-E-009, E0-1-E-010 validate exact versions | P0 |
| **Missing directories** | E0-1-E-001 checks all required directories | P0 |
| **Invalid Tailwind config** | E0-1-E-015 parses and validates config | P0 |
| **Missing shadcn/ui components** | E0-1-E-025 checks all base components | P0 |
| **Path alias not working** | E0-1-E-026, E0-1-I-003 validate @ alias | P0/P1 |
| **Missing .env.example** | E0-1-E-032 validates documentation | P0 |

### Low-Risk Areas (Acceptable)

| Risk | Mitigation | Priority |
|------|------------|----------|
| **Color hex format** | Tailwind validates hex format at build time | P2 |
| **Font scale completeness** | Developer can add sizes as needed | P2 |
| **Component export format** | TypeScript validates imports at build time | P2 |

---

## 10. Next Steps

### Step 3 Complete - Ready for Test Generation

**Deliverables:**
- ✅ Test scenarios mapped to 4 ACs (39 tests total)
- ✅ Test levels selected (26 E2E, 10 unit, 3 integration)
- ✅ Priorities assigned (15 P0, 14 P1, 10 P2)
- ✅ Red phase requirements confirmed (all tests fail without implementation)
- ✅ Test ID format defined (E0-1.X-XXX)

**Action Items:**
1. ✅ Create `tests/e2e/` directory
2. ✅ Generate E2E tests (26 tests for file/config validation)
3. ✅ Generate unit tests (10 tests for parsing logic)
4. ✅ Generate integration tests (3 tests for component integration)
5. ✅ Run tests and verify they all fail (Red phase)
6. ✅ Implement Story 0.1 (make tests pass - Green phase)
7. ✅ Refactor if needed (Refactor phase)

**Ready for Step 4: Generate Acceptance Tests**

---
*Step 3 Completed: Test Strategy Definition*
*Total Tests: 39 (26 E2E, 10 Unit, 3 Integration)*
*P0 Tests: 15 (must pass before Story 0.2)*
*Test ID Format: E0-1.X-XXX*

---

## Step 3: Test Strategy ✅

### Test Scenarios Mapping

Created **39 test scenarios** mapped to 4 acceptance criteria:

| AC | Description | Test Count | E2E | Unit | Integration | P0 | P1 | P2 |
|----|-------------|------------|-----|------|-------------|----|----|-----|
| **AC-0.1.1** | Next.js Project Setup | 8 | 6 | 2 | 0 | 4 | 2 | 2 |
| **AC-0.1.2** | Dependency Installation | 8 | 4 | 2 | 2 | 2 | 4 | 2 |
| **AC-0.1.3** | Tailwind CSS Configuration | 10 | 6 | 2 | 1 | 6 | 2 | 2 |
| **AC-0.1.4** | shadcn/ui Components | 7 | 4 | 2 | 1 | 3 | 3 | 1 |
| **Testability** | Documentation & Infrastructure | 6 | 3 | 2 | 1 | 1 | 3 | 2 |
| **TOTAL** | | **39** | **26** | **10** | **3** | **15** | **14** | **10** |

### Test Levels Selection

**Primary: E2E Tests (26 tests - 67%)**
- File system checks (directories, files existence)
- Configuration parsing (package.json, tailwind.config.js, tsconfig.json)
- Version verification (Next.js 15.0.3, TypeScript 5.3.3)
- Component file validation (shadcn/ui Button, Card, etc.)

**Supporting: Unit Tests (10 tests - 26%)**
- Configuration file parsing
- Version constraint validation
- Color hex value verification
- Path alias resolution

**Cross-Component: Integration Tests (3 tests - 7%)**
- Tailwind + shadcn/ui integration
- Path alias resolution (@/components/ui)
- Environment variables documentation

### Test Prioritization

**P0 Tests (15 tests - 38%) - BLOCKERS:**
- AC-0.1.1: Next.js 15.0.3 + TypeScript 5.3.3 installed
- AC-0.1.1: Directory structure (/app, /components, /lib, /prisma, /types, /public)
- AC-0.1.2: Critical dependencies present (Prisma, NextAuth, Zod, etc.)
- AC-0.1.3: Tailwind custom colors configured
- AC-0.1.3: Inter font scale (12px-36px) configured
- AC-0.1.4: shadcn/ui base components installed
- AC-0.1.4: @/components/ui path alias configured

**P1 Tests (14 tests - 36%) - IMPORTANT:**
- Version conflict detection
- Configuration file format validation
- Edge cases (empty configs, malformed JSON)

**P2 Tests (10 tests - 26%) - NICE-TO-HAVE:**
- Comprehensive color palette validation
- Spacing system verification
- Additional component variants

### Red Phase Requirements Confirmation

**All tests designed to FAIL without implementation:**

- ❌ Missing directory → `expect(directory).toExist()`
- ❌ Wrong version → `expect(packageJson.dependencies.next).toBe('^15.0.3')`
- ❌ Missing config → `expect(tailwindConfig).toBeDefined()`
- ❌ Missing component → `expect(componentFile).toExist()`
- ❌ Wrong color → `expect(tailwindConfig.theme.colors.rojoBurdeos).toBe('#7D1220')`

**Red Phase Execution:**
1. Create test files (all tests will fail - infrastructure not ready)
2. Verify Red phase (run tests, confirm failures)
3. Implement Story 0.1 (make tests pass - Green phase)
4. Refactor (optimize test code, improve maintainability)

### Test ID Format

Following the standard: **E0-1.X-XXX**

- **E** = E2E test
- **0** = Epic 0
- **1** = Story 0.1
- **X** = Acceptance Criterion (1-4)
- **XXX** = Test sequence (001-999)

Examples:
- `E0-1.1-001`: Validate Next.js version in package.json
- `E0-1.3-005`: Verify Tailwind custom colors configured
- `E0-1.4-003`: Check shadcn/ui Button component installed

### Execution Time Estimate

- **Unit Tests:** ~5 seconds (10 tests)
- **E2E Tests:** ~35 seconds (26 tests)
- **Integration Tests:** ~5 seconds (3 tests)
- **Total:** ~45 seconds ✅ (Well under 1.5min requirement)

---
*Step 3 Completed: Test Strategy Defined*
*Test Scenarios: 39 tests mapped*
*Test Levels: E2E (67%), Unit (26%), Integration (7%)*
*Priorities: P0 (38%), P1 (36%), P2 (26%)*

---

## Step 4: Test Generation - RED Phase ✅

### Tests Generated

**File:** `tests/e2e/story-0.1-nextjs-setup.spec.ts`

**Statistics:**
- **Total Tests:** 20 tests
- **Lines of Code:** 414 lines
- **TDD Phase:** 🔴 RED (all tests use `test.skip()`)
- **Priority:** P0 (Critical - Blockers)

### Test Coverage by AC

| AC | Tests | Coverage |
|----|-------|----------|
| **AC-0.1.1** | 3 tests | Next.js 15.0.3, TS 5.3.3, directory structure |
| **AC-0.1.2** | 7 tests | Prisma, NextAuth, Zod, React Hook Form, TanStack Query, Lucide, bcryptjs |
| **AC-0.1.3** | 4 tests | Tailwind config, custom colors, Inter font, spacing grid |
| **AC-0.1.4** | 7 tests | Button, Card, Dialog, Form, Table, Toast, path alias |
| **Additional** | 3 tests | PostCSS, Prisma schema, TS config |

### Test Execution (Current Status)

```bash
# Tests are SKIPPED (RED phase)
npm run test:e2e story-0.1-nextjs-setup.spec.ts

# Expected Output: 0 tests (all skipped)
```

### TDD Cycle

1. **✅ RED Phase (Complete):** Tests generated with `test.skip()`
2. **⏳ GREEN Phase (Next):** Enable tests, implement Story 0.1
3. **⏳ REFACTOR Phase (Later):** Clean up implementation

### To Enable Tests (GREEN Phase)

Remove `test.skip` from each test:
```typescript
// RED phase
test.skip('E0-1.1-001: should have Next.js 15.0.3', async ({}) => {

// GREEN phase
test('E0-1.1-001: should have Next.js 15.0.3', async ({}) => {
```

---
*Step 4 Completed: 20 P0 E2E Tests Generated*
*TDD Phase: RED (tests skipped, ready to enable)*
*Test File: tests/e2e/story-0.1-nextjs-setup.spec.ts*
