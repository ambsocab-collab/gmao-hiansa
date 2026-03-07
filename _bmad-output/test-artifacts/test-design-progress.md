---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-07'
workflowType: 'testarch-test-design'
inputDocuments: ['prd.md', 'architecture.md', 'test-levels-framework.md', 'risk-governance.md', 'test-quality.md', 'adr-quality-readiness-checklist.md', 'playwright-cli.md', 'pactjs-utils-overview.md', 'pactjs-utils-consumer-helpers.md', 'pactjs-utils-provider-verifier.md', 'pactjs-utils-request-filter.md', 'pact-mcp.md']
mode: 'system-level'
---

# Test Design Progress - gmao-hiansa

**Workflow:** Test Architect - Test Design (System-Level)
**Date:** 2026-03-07
**Author:** Bernardo
**Project:** gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

---

## Step 1: Mode Detection & Prerequisites - COMPLETED ✓

### Mode Selected: SYSTEM-LEVEL MODE

**Rationale:**
- User explicitly requested "system level" test design
- PRD and Architecture documents are available and validated
- This mode produces TWO documents:
  1. **Architecture Document** (test-design-architecture.md) - For Architecture/Dev teams
  2. **QA Document** (test-design-qa.md) - For QA team

### Prerequisites Verified ✓

**Required Documents (System-Level):**
- ✅ **PRD:** `/planning-artifacts/archive/prd.md` (123 Functional Requirements, 37 Non-Functional Requirements)
- ✅ **Architecture:** `/planning-artifacts/archive/architecture.md` (Architecture Decision Record)
- ✅ **UX Design:** Available (referenced in architecture)

**Document Quality:**
- PRD Validation Rating: 4.5/5 EXCELLENT (validated 2026-03-07)
- Architecture Status: Complete (8 steps completed)
- Project Type: Web App Responsiva (Single-tenant, greenfield)

### Project Context Summary

**Business Domain:**
- GMAO (Gestión de Mantenimiento Asistido por Ordenador) para empresa metalúrgica
- Transforma departamento de mantenimiento reactivo a proactivo
- Single-tenant optimizado (no SaaS multi-tenant)

**Core Features (MVP - Phase 1):**
1. Gestión de Averías (reporte <30 segundos)
2. Gestión de Órdenes de Trabajo (8 estados, Kanban 8 columnas)
3. Gestión de Activos (jerarquía 5 niveles, 10,000+ activos)
4. Gestión de Repuestos (stock en tiempo real)
5. PBAC con 15 capacidades granulares (no roles predefinidos)
6. Proveedores (mantenimiento y repuestos)
7. Rutinas de mantenimiento (generación automática de OTs)
8. Dashboard KPIs (MTTR, MTBF, drill-down)
9. PWA (Progressive Web App) con SSE (30s heartbeat)
10. Reportes automáticos por email (PDF)
11. Componentes multi-equipos (relaciones muchos-a-muchos)
12. Reparación dual (interna/externa)
13. Sincronización multi-dispositivo real-time

**Tech Stack (from Architecture):**
- Frontend: Next.js 14+ (App Router), React 18+, TypeScript
- UI: shadcn/ui + Tailwind CSS
- Backend: Next.js API Routes (tRPC)
- Database: PostgreSQL (hosted: Supabase, local: Docker)
- Real-time: Server-Sent Events (SSE) - NO WebSockets
- PWA: next-pwa plugin
- Testing: Playwright (E2E, API, Unit)
- Deployment: Vercel (serverless)

**Key Non-Functional Requirements:**
- Performance: Búsqueda predictiva <200ms, first paint <3s
- Scalability: 10,000+ activos, 100 usuarios concurrentes
- Real-time: SSE heartbeat 30s (compatible con Vercel serverless)
- Security: PBAC, HTTPS/TLS 1.3, bcrypt/argon2, rate limiting
- Accessibility: WCAG AA (4.5:1), 16px text, 44x44px touch targets

**Key Architectural Decisions:**
- Single-tenant (no multi-tenant complexity)
- SSE instead of WebSockets (Vercel serverless compatible)
- Next.js API Routes instead of separate backend (simpler deployment)
- tRPC for type-safe API calls
- PostgreSQL with Prisma ORM
- Playwright for all testing levels (E2E, API, Unit)

### Next Steps

Proceeding to Step 2: Load Context...

---

## Step 2: Load Context & Knowledge Base - COMPLETED ✓

### Configuration Loaded

**From `config.yaml`:**
- `tea_use_playwright_utils`: true
- `tea_use_pactjs_utils`: true
- `tea_pact_mcp`: mcp
- `tea_browser_automation`: auto
- `test_stack_type`: fullstack
- `test_artifacts`: `{project-root}/_bmad-output/test-artifacts`
- `user_name`: Bernardo
- `communication_language`: Español
- `document_output_language`: Español

**Stack Detection:** fullstack (explicitly configured)

---

### Project Artifacts (System-Level Mode)

**Documents Loaded:**
- ✅ PRD (123 Functional Requirements, 37 Non-Functional Requirements)
- ✅ Architecture Decision Record (8 steps complete)
- ✅ UX Design Specification (referenced)

**Tech Stack Extracted:**
- Frontend: Next.js 14+, React 18+, TypeScript, shadcn/ui, Tailwind CSS
- Backend: Next.js API Routes, tRPC, Prisma ORM
- Database: PostgreSQL (Supabase/Docker)
- Real-time: Server-Sent Events (SSE) with 30s heartbeat
- Testing: Playwright (E2E, API, Unit), Playwright Utils enabled
- Contract Testing: Pact.js enabled, Pact MCP enabled
- PWA: next-pwa plugin
- Deployment: Vercel (serverless)

**Integration Points:**
- Email service (reportes automáticos)
- Multi-device synchronization (SSE)
- CSV import/export (activos, repuestos)
- PDF generation (reportes)
- Future: ERP integration, IoT integration (Phase 3+)

---

### Knowledge Base Fragments Loaded

**Required (System-Level):**
- ✅ `adr-quality-readiness-checklist.md` - 8 categories, 29 criteria for NFR assessment
- ✅ `test-levels-framework.md` - Unit/Integration/E2E decision matrix
- ✅ `risk-governance.md` - Risk scoring (Probability × Impact), gate decisions
- ✅ `test-quality.md` - Definition of Done (<300 lines, <1.5min, no hard waits)

**Playwright CLI (auto-enabled):**
- ✅ `playwright-cli.md` - Browser automation patterns

**Pact.js Utils (enabled):**
- ✅ `pactjs-utils-overview.md` - Consumer testing helpers
- ✅ `pactjs-utils-consumer-helpers.md` - Contract test patterns
- ✅ `pactjs-utils-provider-verifier.md` - Provider verification
- ✅ `pactjs-utils-request-filter.md` - Request filtering

**Pact MCP (enabled):**
- ✅ `pact-mcp.md` - SmartBear MCP integration for contract landscape

---

### Loaded Inputs Summary

**Total Documents:** 13 files loaded
- 2 Project artifacts (PRD, Architecture)
- 4 Core knowledge fragments
- 1 Playwright CLI guide
- 4 Pact.js Utils fragments
- 1 Pact MCP guide
- 1 Config file

**Key Capabilities Available:**
- Risk assessment framework (1-9 scoring, P0-P3 priorities)
- Test quality standards (deterministic, isolated, fast)
- NFR evaluation criteria (29 checklist items across 8 categories)
- Test level selection guidance (unit vs integration vs E2E)
- Playwright testing patterns (network-first, fixtures, auto-cleanup)
- Contract testing strategies (Pact.js, MCP provider states)

---

### Next Steps

Proceeding to Step 3: Risk Assessment & Testability Analysis...

---

## Step 3: Testability & Risk Assessment - COMPLETED ✓

### 1. Testability Review (System-Level Mode)

#### 🚨 Testability Concerns (ACTIONABLE - BLOCKERS)

**1. Test Data Seeding APIs Missing (BLOCKER)**
- **Problem:** PRD doesn't specify endpoints for test data injection
- **Impact:** Slow tests requiring manual UI setup
- **Category:** CONTROLLABILITY
- **Action Required:** Implement `/api/test-data` endpoints (dev/staging only)
- **Owner:** Backend Dev
- **Timeline:** Pre-implementation (Phase 1)

**2. SSE Mocking Complexity**
- **Problem:** SSE for real-time updates (30s heartbeat) is hard to mock
- **Impact:** Non-deterministic real-time tests, arbitrary delays
- **Category:** CONTROLLABILITY
- **Action Required:** Provide SSE mock layer for test environment
- **Owner:** Backend Dev + QA
- **Timeline:** Pre-implementation (Phase 1)

**3. Data Isolation (Single-Tenant)**
- **Problem:** Single-tenant without native multi-tenancy requires manual cleanup
- **Impact:** Tests can pollute data without auto-cleanup
- **Category:** RELIABILITY
- **Action Required:** Implement auto-cleanup in Playwright fixtures
- **Owner:** QA
- **Timeline:** Pre-implementation (Phase 1)

**4. Limited Observability**
- **Problem:** Architecture doesn't mention structured logging, metrics, tracing
- **Impact:** Hard to debug failed tests in CI/CD
- **Category:** OBSERVABILITY
- **Action Required:** Add structured logging (JSON), correlation IDs
- **Owner:** Backend Dev
- **Timeline:** Phase 1 (MVP)

**5. Multi-Device Sync Determinism**
- **Problem:** SSE 30s heartbeat + eventual consistency creates race conditions
- **Impact:** Flaky tests dependent on timing
- **Category:** RELIABILITY
- **Action Required:** Implement "fast-forward" mechanism for tests (instant SSE)
- **Owner:** Backend Dev
- **Timeline:** Phase 1 (MVP)

#### ✅ Testability Assessment Summary (FYI - Strengths)

**What Works Well:**
- ✅ **API-first design:** All business flows accessible via API (Next.js API Routes)
- ✅ **Type-safe communication:** tRPC eliminates API contract ambiguity
- ✅ **PostgreSQL with Prisma:** Stable ORM with excellent testing support
- ✅ **Playwright selected:** Modern framework with fixtures, parallelization, network-first patterns
- ✅ **Stateless backend (Next.js serverless):** Easy to scale, no session state
- ✅ **HTTP-only:** No complex WebSockets, SSE is simple and testable with patches

**Accepted Trade-offs (Phase 1 MVP):**
- ⚠️ **No multi-tenancy:** Single-tenant acceptable for MVP (one company)
- ⚠️ **SSE instead of WebSockets:** Less real-time but sufficient for 30s heartbeat
- ⚠️ **No ERP/IoT integration initially:** Later phases (Phase 3+)

---

### 2. Risk Assessment

**Total Risks Identified:** 20 real risks (not features)

#### High-Priority Risks (Score ≥ 6) - IMMEDIATE ATTENTION REQUIRED

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|-------------|--------|-------|------------|-------|
| **R-001** | PERF | Predictive search >200ms with 10K+ assets degrades UX | 3 (High) | 3 (High) | **9** | Implement debouncing, cache, optimized DB indexes | Backend Dev |
| **R-002** | DATA | Race conditions in multi-device sync (SSE 30s) | 3 (High) | 3 (High) | **9** | Implement conflict strategy (last-write-wins + merge), versioning | Backend Dev |
| **R-003** | OPS | Monolithic deployment on Vercel without blue/green | 2 (Medium) | 3 (High) | **6** | Implement automated rollback, feature flags | DevOps |
| **R-004** | PERF | PDF generation blocks server (automatic reports) | 3 (High) | 2 (Medium) | **6** | Offload to background job, generation queue, async | Backend Dev |
| **R-005** | SEC | Incorrect PBAC implementation exposes sensitive data | 2 (Medium) | 3 (High) | **6** | Exhaustive security testing, code review, P0 security tests | Backend Dev + QA |
| **R-006** | PERF | 100 concurrent users degrade performance | 2 (Medium) | 3 (High) | **6** | Load testing before GA, query optimization, connection pooling | Backend Dev |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation |
|---------|----------|-------------|-------------|--------|-------|------------|
| **R-007** | PERF | Universal search >500ms with large datasets | 2 | 2 | 4 | Implement pagination, incremental predictive search |
| **R-008** | PERF | 10K asset import >5 minutes | 2 | 2 | 4 | Batch processing, progress bar, early validation |
| **R-009** | PERF | KPI calculation (MTTR/MTBF) slow with large history | 2 | 2 | 4 | Materialized views, cached calculations, pre-aggregation |
| **R-010** | PERF | Poor PWA performance on low-end mobile devices | 2 | 2 | 4 | Optimize bundle size, lazy loading, progressive rendering |
| **R-011** | DATA | Data loss in stock update concurrency | 2 | 2 | 4 | Implement optimistic locking, DB transactions |
| **R-012** | PERF | Database connection pool exhaustion | 2 | 2 | 4 | Configure connection pooling, monitor connections |
| **R-013** | TECH | Many-to-many relationships (multi-equipment components) complex | 2 | 2 | 4 | Prisma with junction tables, exhaustive integration tests |
| **R-014** | OPS | Email service failure (automatic reports) | 1 | 3 | 5 | Queue with retry, fallback (manual download), monitoring |
| **R-015** | OPS | Backup restore not tested (RTO 4h not validated) | 1 | 3 | 5 | Quarterly restore exercises, document procedure |
| **R-016** | PERF | Tests cannot run in parallel (data pollution) | 2 | 2 | 4 | Auto-cleanup fixtures, unique data with faker |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
|---------|----------|-------------|-------------|--------|-------|--------|
| **R-017** | OPS | Third-party failure (Supabase, Vercel) | 1 | 2 | 2 | Monitor |
| **R-018** | TECH | Only Chrome/Edge supported (no Firefox/Safari) | 1 | 2 | 2 | Document |
| **R-019** | TECH | Localization only Spanish (no i18n) | 1 | 1 | 1 | N/A |
| **R-020** | PERF | Old mobile devices don't support PWA | 1 | 1 | 1 | N/A |

---

### 3. Risk Findings Summary

**Total Risks:** 20
- **Critical (Score = 9):** 2 (require MANDATORY mitigation before GA)
- **High (Score 6-8):** 4 (require planned mitigation)
- **Medium (Score 3-5):** 10 (should be monitored)
- **Low (Score 1-2):** 4 (acceptable)

**Testability Concerns (BLOCKERS):**
- **5 BLOCKERS** that architecture team must address pre-implementation
- Tests cannot be written efficiently without resolving these items

**ASRs (Architecturally Significant Requirements):**

**ACTIONABLE (require architecture attention):**
1. NFR-P1: Predictive search <200ms (R-001)
2. NFR-P3: SSE heartbeat 30s (R-002, testability concern)
3. NFR-SC1: 10,000+ assets without degradation (R-001, R-007, R-008, R-009)
4. NFR-SC2: 100 concurrent users (R-006)
5. NFR-S4: PBAC implementation (R-005)
6. Testability: Test data seeding APIs (blocker)
7. Testability: SSE mocking (blocker)

**FYI (informational, no immediate action):**
- Vercel serverless architecture is compatible with SSE
- Playwright is appropriate for fullstack tech stack
- Single-tenant is acceptable for MVP

---

### Next Steps

Proceeding to Step 4: Coverage Plan...

---

## Step 4: Coverage Plan & Execution Strategy - COMPLETED ✓

### Coverage Summary

**Total Test Scenarios:** 102 tests organized across 9 functional modules

| Module | P0 | P1 | P2 | P3 | Total |
|--------|----|----|----|----|-------|
| 1. Gestión de Averías | 9 | 2 | 0 | 0 | 11 |
| 2. Órdenes de Trabajo | 14 | 5 | 0 | 0 | 19 |
| 3. Gestión de Activos | 6 | 3 | 1 | 0 | 10 |
| 4. Gestión de Repuestos | 5 | 3 | 0 | 0 | 8 |
| 5. Usuarios y PBAC | 11 | 6 | 0 | 0 | 17 |
| 6. Dashboard KPIs | 5 | 3 | 0 | 0 | 8 |
| 7. Sincronización Multi-Device | 5 | 1 | 1 | 0 | 7 |
| 8. Seguridad y NFRs | 13 | 3 | 1 | 0 | 17 |
| 9. Testabilidad (Setup) | 5 | 0 | 0 | 0 | 5 |
| **TOTAL** | **73** | **26** | **3** | **0** | **102** |

**Note:** P3 (exploratory, benchmarks) not included in MVP Phase 1.

**Test Level Distribution:**
- E2E Tests: ~60 (user journeys, UI workflows)
- API Tests: ~30 (business logic, data persistence)
- Unit Tests: ~8 (pure functions, utilities)
- Load Tests: ~4 (performance, scalability)

---

### Execution Strategy

**Every Pull Request: Playwright Tests (~10-15 minutes)**
- All functional tests (P0, P1, P2) using Playwright
- Parallelized across 4-8 workers
- ~102 tests total
- Command: `npx playwright test --workers=4`
- P0-only: `npx playwright test --grep "@P0"`

**Nightly: k6 Performance Tests (~30-60 minutes)**
- Load tests: 50 and 100 concurrent users
- Performance: Predictive search <200ms
- Performance: 10K asset import <5min
- Performance: KPI calculation with large history
- ~6-8 k6 tests

**Weekly: Chaos & Long-Running (if applicable later phases)**
- Multi-region failover
- Disaster recovery (backup restore, 4+ hours)
- Endurance tests (4+ hours runtime)

---

### Resource Estimates (QA Test Development)

**QA test development effort only** (excludes DevOps, Backend, Data Eng):

| Priority | Count | Effort Range | Notes |
|-----------|-------|--------------|-------|
| **P0** | ~73 | ~6-9 weeks | Complex setup (security, performance, multi-step, testability blockers) |
| **P1** | ~26 | ~4-6 weeks | Standard coverage (integration, API tests) |
| **P2** | ~3 | ~3-5 days | Edge cases, simple validation |
| **TOTAL** | **~102** | **~10-15 weeks** | **1 QA engineer, full-time** |

**Assumptions:**
- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure ready (factories, fixtures, environments)

**Timeline by Phase:**
- **Phase 1 (Pre-implementation):** ~1-2 weeks - Testability setup (seeding APIs, mocks, fixtures, cleanup)
- **Phase 2 (Core P0):** ~4-6 weeks - P0 critical tests (security, PBAC, sync, performance)
- **Phase 3 (P1 coverage):** ~3-5 weeks - P1 integration and edge cases
- **Phase 4 (P2 + Polish):** ~1-2 weeks - P2 tests, refinement, documentation

---

### Quality Gates

**Entry Criteria (before QA starts testing):**
- [ ] All requirements and assumptions agreed by QA, Dev, PM
- [ ] Test environments provisioned and accessible (local, CI/CD, staging)
- [ ] Test data factories ready or seed data available
- [ ] **Pre-implementation blockers resolved** (5 testability concerns)
- [ ] Feature deployed to test environment
- [ ] Supabase local (Docker) configured for tests
- [ ] Vercel deployment pipeline configured

**Exit Criteria (testing phase complete):**
- [ ] **100% P0 tests passing** (no exceptions)
- [ ] **≥95% P1 tests passing** (triaged and accepted failures allowed)
- [ ] No open high-priority/high-severity bugs
- [ ] Test coverage agreed as sufficient by QA Lead and Dev Lead
- [ ] Performance baselines met (NFRs validated)
- [ ] **High-priority risks (score ≥6) mitigated** before release

**Quality Gate Metrics:**
- P0 pass rate = **100%** (mandatory)
- P1 pass rate ≥ **95%**
- P2 pass rate ≥ **80%**
- Test coverage target ≥ **80%** (adjustable if justified)
- **All score 9 risks (R-001, R-002) must have implemented and proven mitigation**

**Gate Decision Framework:**
- **PASS:** All P0 passing, ≥95% P1 passing, critical risks mitigated
- **CONCERNS:** ≥90% P0 passing, 80-95% P1 passing, critical risks with documented mitigation plan
- **FAIL:** <90% P0 passing, <80% P1 passing, critical risks without mitigation

---

### Next Steps

Proceeding to Step 5: Generate Output Documents...

---

## Step 5: Generate Outputs & Validate - COMPLETED ✓

### Execution Mode Used

**Mode:** Sequential (single-worker execution)
**Rationale:** Parallel worker modes not available in current environment

### Output Documents Generated

**System-Level Mode** - Two documents produced:

1. **test-design-architecture.md**
   - Location: `{test_artifacts}/test-design-architecture.md`
   - Purpose: Architectural concerns, testability gaps, and NFR requirements for Architecture/Dev teams
   - Length: 145 lines (actionable-focused, no bloat)
   - Status: Architecture Review Pending

2. **test-design-qa.md**
   - Location: `{test_artifacts}/test-design-qa.md`
   - Purpose: Test execution recipe with 102 scenarios, priorities, and effort estimates for QA team
   - Length: 102 test scenarios (73 P0, 26 P1, 3 P2)
   - Status: Draft - Ready for QA implementation planning

### Key Risks Summary

**Total Risks:** 20 identified, classified, and scored

| Priority | Count | Score Range | Status |
|----------|-------|-------------|--------|
| **Critical** | 2 | 9 | Mitigation REQUIRED before GA |
| **High** | 4 | 6-8 | Mitigation planificado |
| **Medium** | 10 | 3-5 | Monitoreo requerido |
| **Low** | 4 | 1-2 | Aceptable |

**Critical Risks (Score 9):**
- **R-001:** Predictive search performance >200ms (PERF)
- **R-002:** Multi-device sync race conditions (DATA)

### Quality Gate Thresholds

**P0 Pass Rate:** 100% (mandatory, no exceptions)
**P1 Pass Rate:** ≥95% (triaged and accepted failures allowed)
**P2 Pass Rate:** ≥80%
**Coverage Target:** ≥80% (adjustable if justified)

**High-Risk Mitigation Requirement:**
- All score 9 risks (R-001, R-002) MUST have implemented and proven mitigation before GA release

### Open Assumptions

1. Single-tenant architecture es aceptable para MVP (una empresa metalúrgica específica)
2. Chrome/Edge only browser support es aceptable para ambiente industrial controlado
3. Spanish-only localization es aceptable para MVP inicial
4. Supabase local (Docker) es suficiente para desarrollo y testing
5. Vercel serverless puede manejar 100 usuarios concurrentes sin degradación
6. SSE con 30s heartbeat es suficiente para real-time requirements
7. Playwright puede manejar 102 tests con paralelización en CI/CD sin timeouts
8. 1 QA engineer es suficiente para implementar 102 tests en 10-15 semanas

### Next Actions Required

**For Architecture Team:**
1. Review Quick Guide in test-design-architecture.md (🚨/⚠️/📋 sections)
2. Assign owners and timelines for high-priority risks (R-001 through R-006)
3. **CRITICAL:** Resolve 5 pre-implementation blockers (BLK-001 through BLK-005) before QA starts test development

**For QA Team:**
1. Wait for pre-implementation blockers to be resolved (see Dependencies section in test-design-qa.md)
2. Begin test infrastructure setup (factories, fixtures, environments)
3. Plan P0 test implementation (73 tests, ~6-9 weeks estimated effort)

**For Project Management:**
1. Prioritize epics and stories for alignment with test plan
2. Allocate resources: 1 QA engineer for 10-15 weeks
3. Schedule team review of both test design documents

---

## Workflow Completion Report

**Workflow:** Test Architect - Test Design (System-Level)
**Date Completed:** 2026-03-07
**Author:** Bernardo
**Project:** gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)
**Mode:** System-Level (Phase 3)

### Summary

Successfully completed System-Level Test Design workflow for gmao-hiansa GMAO application. Generated two comprehensive documents:

1. **Architecture Document:** 145 lines, actionable-focused, containing 5 pre-implementation blockers, 20 risk assessments, and architectural concerns for review by Architecture/Dev teams.

2. **QA Document:** 102 test scenarios (73 P0, 26 P1, 3 P2) organized across 9 functional modules, with effort estimates of 10-15 weeks for 1 QA engineer, execution strategy (PR/Nightly/Weekly), and detailed dependencies on other teams.

### Key Deliverables

- **Risk Assessment:** 20 risks identified, scored, and prioritized (2 critical, 4 high, 10 medium, 4 low)
- **Coverage Plan:** 102 test scenarios mapped to PRD requirements, prioritized by risk and business impact
- **Execution Strategy:** Playwright tests in PRs (~10-15 min), k6 performance tests nightly (~30-60 min)
- **Quality Gates:** P0 pass rate = 100%, P1 pass rate ≥95%, all score 9 risks mitigated before GA
- **Resource Estimates:** ~10-15 weeks for 1 QA engineer (6-9 weeks P0, 4-6 weeks P1, 3-5 days P2)

### Critical Path Items

**5 Pre-Implementation Blockers** (must be resolved before QA can start):
1. Test Data Seeding APIs (`/api/test-data` endpoints)
2. SSE Mock Layer (fast-forward mode for tests)
3. Multi-Device Sync Conflict Strategy (last-write-wins + merge)
4. Observability Infrastructure (structured logging, correlation IDs, metrics)
5. Performance Baseline Infrastructure (k6 load testing)

**2 Critical Risks** (score 9, mitigation mandatory before GA):
1. **R-001:** Predictive search performance >200ms (PERF) - Debouncing, caching, DB indexes
2. **R-002:** Multi-device sync race conditions (DATA) - Conflict strategy, versioning

### Validation Status

✅ All prerequisites met (PRD, Architecture documents available)
✅ All process steps completed (5/5 steps)
✅ Output validation passed (checklist reviewed)
✅ Quality checks passed (no bloat, actionable-focused, professional tone)
✅ Integration points verified (knowledge base references consistent)

---

**End of Workflow**

**Recommended Next Steps:**

1. Review both documents with Architecture and QA teams
2. Assign owners and timelines for 5 pre-implementation blockers
3. Schedule Architecture review meeting
4. Begin test infrastructure setup once blockers resolved
5. Plan P0 test implementation sprint (73 tests, ~6-9 weeks)

**Related Workflows:**
- Use `atdd` workflow to generate P0 tests (separate workflow, not auto-run)
- Use `framework` workflow if Playwright setup not complete
- Use `ci` workflow to configure pipeline stages

---
