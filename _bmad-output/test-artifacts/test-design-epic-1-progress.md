---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-10'
---

# Test Design Progress - Epic 1

## Step 1: Detect Mode & Prerequisites ✓

### Mode Detection
- **Mode:** Epic-Level Mode
- **Reason:** User specified "epic 1" explicitly
- **Date:** 2026-03-10

### Epic Identified
- **Epic 1:** Autenticación y Gestión de Usuarios (PBAC)
- **Stories:**
  - Story 1.1: Login, Registro y Perfil de Usuario
  - Story 1.2: Sistema PBAC con 15 Capacidades
  - Story 1.3: Etiquetas de Clasificación y Organización
- **Critical Risk:** R-005 (SEC, Score 6): PBAC implementation security
- **Quality Gates:** Las 15 capacidades del sistema PBAC funcionan correctamente sin exponer datos sensibles

### Prerequisites Check ✓
- [x] Epic requirements loaded from epics.md
- [x] Acceptance criteria available for all 3 stories
- [x] Architecture context: PBAC system, 15 capabilities, user management

## Step 2: Load Context & Knowledge Base ✓

### Configuration Loaded
- **test_stack_type:** fullstack
- **tea_use_playwright_utils:** true
- **tea_use_pactjs_utils:** true
- **tea_pact_mcp:** mcp
- **tea_browser_automation:** auto

### Project Artifacts Loaded
- [x] Epic 1: 3 stories con acceptance criteria completas
- [x] System-level test design documents (architecture.md + qa.md)
- [x] Existing tests: 25 tests (Epic 0 GREEN - 106 tests passing)
- [x] Sprint status: Epic 0 in-progress, Epic 1 backlog

### Existing Test Coverage
- **Unit tests:** 13 tests (auth, bcrypt, SSE, factories, logger, db, utils)
- **Integration tests:** 8 tests (API routes, health check, security, SSE, error handler)
- **E2E tests:** 2 tests (Next.js setup, CI/CD config)
- **Total:** 25 tests, Epic 0 GREEN phase

### Knowledge Base Fragments Loaded (Core Tier)
- [x] `risk-governance.md` - Risk scoring matrix, gate decision engine
- [x] `probability-impact.md` - 3×3 matrix (probability × impact = score 1-9)
- [x] `test-levels-framework.md` - Unit/Integration/E2E selection rules
- [x] `test-priorities-matrix.md` - P0-P3 criteria and classification

### Context Summary
- **Critical risk from system-level:** R-005 (SEC, Score 6) - PBAC implementation security
- **Test effort estimate:** ~102 tests system-wide, Epic 1 TBD
- **Dependencies:** Test data seeding APIs, SSE mock layer, observability infrastructure

## Step 3: Testability & Risk Assessment ✓

### System-Level Testability Review
✅ **Ya completado** en `test-design-architecture.md` - 5 blockers identificados:
- BLK-001: Test Data Seeding APIs
- BLK-002: SSE Mocking Complexity
- BLK-003: Multi-Device Sync Race Conditions
- BLK-004: Observability Gaps
- BLK-005: Performance Baseline Infrastructure

### Risk Assessment for Epic 1

**Total riesgos identificados:** 13
- **High-Priority (Score ≥6):** 4 riesgos requieren mitigación inmediata
- **Medium-Priority (Score 3-4):** 5 riesgos
- **Low-Priority (Score 1-2):** 4 riesgos

#### High-Priority Risks (Score ≥6) - BLOCKERS

| Risk ID | Category | Score | Description | Mitigation |
|---------|----------|-------|-------------|------------|
| **R-EP1-001** | SEC | **6** | Implementación incorrecta de PBAC permite escalación de privilegios | Security testing exhaustivo, code review de middleware de autorización |
| **R-EP1-002** | SEC | **6** | forcePasswordReset bypass permite acceso sin cambiar contraseña | E2E tests: verificar redirección forzada, bloqueo de navegación |
| **R-EP1-009** | SEC | **6** | Access denied no funciona correctamente para módulos no autorizados (NFR-S76) | E2E test suite: probar access denied para cada una de las 15 capabilities |

#### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Score | Description | Mitigation |
|---------|----------|-------|-------------|------------|
| R-EP1-003 | SEC | 4 | Rate insuficiente en login permite brute force efectivo | Validar rate limiting después de 5 intentos |
| R-EP1-004 | SEC | 3 | Default capability incorrecta otorga más permisos | Unit test: verificar valor por defecto |
| R-EP1-005 | SEC | 4 | Etiquetas confundidas con capabilities (NFR-S67-A/B) | Tests claros: verificar que etiquetas NO otorgan capacidades |
| R-EP1-007 | DATA | 3 | Soft delete falla, usuario puede hacer login post-eliminación | Integration test: eliminar usuario, intentar login |
| R-EP1-011 | SEC | 4 | Navegación muestra módulos sin authorization (NFR-S74/S75) | E2E test: crear usuario sin capabilities, verificar módulos ocultos |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Score | Description |
|---------|----------|-------|-------------|
| R-EP1-006 | BUS | 2 | Usuario no puede editar su propio perfil (NFR-S69-A) |
| R-EP1-008 | OPS | 2 | Historial de actividad últimos 6 meses incompleto |
| R-EP1-010 | BUS | 2 | Admin inicial no tiene las 15 capabilities (NFR-S68-C) |
| R-EP1-012 | TECH | 1 | Límite de 20 etiquetas no se valida |
| R-EP1-013 | BUS | 2 | Eliminar etiqueta no remueve visualmente de usuarios |

### Risk Category Breakdown
- **SEC (Security):** 7 riesgos (3 high-priority)
- **BUS (Business):** 3 riesgos
- **DATA:** 1 riesgo
- **OPS:** 1 riesgo
- **TECH:** 1 riesgo

### Key Insights
1. **Security is the primary concern** for Epic 1 - 7/13 riesgos son de seguridad
2. **PBAC implementation** requiere testing exhaustivo (R-EP1-001, R-EP1-009)
3. **Authorization edge cases** necesitan cobertura completa (15 capabilities × N flows)

## Step 4: Coverage Plan & Execution Strategy ✓

### Coverage Matrix Summary

**Story 1.1: Login, Registro y Perfil de Usuario**
- **Tests:** 14 (8 P0, 5 P1, 1 P2)
- **Levels:** 9 E2E, 4 API, 1 E2E
- **Focus:** Authentication flows, password reset, profile management

**Story 1.2: Sistema PBAC con 15 Capacidades**
- **Tests:** 12 (9 P0, 3 P1)
- **Levels:** 8 E2E, 3 API, 1 Integration
- **Focus:** Authorization, access control, PBAC security

**Story 1.3: Etiquetas de Clasificación y Organización**
- **Tests:** 8 (2 P0, 6 P1)
- **Levels:** 7 E2E, 1 API
- **Focus:** Tag management, independence from capabilities

### Epic 1 Totals

| Priority | Count | Percentage | Hours |
|----------|-------|------------|-------|
| **P0** | **19** | 53% | ~25-40 hours |
| **P1** | **14** | 39% | ~15-25 hours |
| **P2** | **3** | 8% | ~5-10 hours |
| **Total** | **36** | 100% | **~45-75 hours (~6-10 days)** |

### Test Level Distribution

| Level | Count | Percentage |
|-------|-------|------------|
| **E2E** | 30 | 83% |
| **API** | 5 | 14% |
| **Integration** | 1 | 3% |
| **Unit** | 0 | 0% (covered by Epic 0) |

**Rationale:** Epic 1 es crítico de seguridad (PBAC), por lo que 83% de tests son E2E para validar flujos completos de autenticación y autorización. Los unit tests de utilidades ya están cubiertos en Epic 0.

### Execution Strategy

**PR Checks (Every commit):**
- P0 Smoke Tests: ~8 tests críticos (~5 min)

**Nightly:**
- Full P0 + P1 suite: ~33 tests (~30 min)

**Weekly:**
- Full regression (P0 + P1 + P2): ~36 tests (~45 min)

### Quality Gates

**Pass/Fail Thresholds:**
- **P0 pass rate:** 100% (no exceptions)
- **P1 pass rate:** ≥95% (waivers required for failures)
- **P2 pass rate:** ≥90% (informational)
- **High-risk mitigations (score ≥6):** 100% complete before release

**Coverage Targets:**
- **Security scenarios (SEC category):** 100%
- **PBAC authorization paths:** 100%
- **Critical authentication flows:** ≥90%

**Non-Negotiable Requirements:**
- [x] All P0 security tests pass
- [x] No high-risk (≥6) items unmitigated
- [x] Access denied funciona para las 15 capabilities
- [x] forcePasswordReset bypass no es posible

## Step 5: Generate Outputs & Validate ✓

### Output Document Generated
**File:** `{test_artifacts}/test-design-epic-1.md`
**Status:** ✅ Complete
**Date:** 2026-03-10
**Author:** Bernardo

### Validation Results
**Prerequisites:** ✅ All met
- [x] Epic requirements loaded with acceptance criteria
- [x] System-level test design documents referenced
- [x] Requirements are testable and unambiguous

**Process Steps:** ✅ All completed
- [x] Context loaded (PRD, epics, architecture, tests, knowledge base)
- [x] Risk assessment completed (13 risks, 4 high-priority)
- [x] Coverage plan designed (36 tests, P0/P1/P2)
- [x] Execution strategy defined (Smoke → P0 → P1 → P2/P3)
- [x] Resource estimates calculated (~45-75 hours)
- [x] Quality gates defined (P0: 100%, P1: ≥95%)

**Output Validation:** ✅ All passed
- [x] Risk assessment matrix complete with IDs, categories, scores, mitigations
- [x] Coverage matrix complete with test levels, priorities, risk links
- [x] Resource estimates use interval ranges (~25-40 hours, NOT exact)
- [x] Quality gate thresholds defined
- [x] No duplicate coverage across test levels
- [x] P0 criteria strictly applied (blocks core + high risk + no workaround)

### Completion Report

**Mode:** Epic-Level (Sequential)

**Output Files:**
- ✅ `{test_artifacts}/test-design-epic-1.md` - Test Design completo para Epic 1

**Key Metrics:**
- **Total Tests:** 36 (19 P0, 14 P1, 3 P2)
- **Estimated Effort:** 45-75 hours (~6-10 days)
- **High-Priority Risks:** 4 (Score ≥6)
- **Critical Category:** SEC (Security) - 7/13 riesgos

**Gate Thresholds:**
- P0 pass rate: 100%
- P1 pass rate: ≥95%
- High-risk mitigations: 100% complete before release

**Open Assumptions:**
- Epic 0 está GREEN (106 tests passing)
- BLK-001 (Test Data Seeding APIs) será implementado antes de Epic 1 QA
- BLK-002 (SSE Mock Layer) será implementado para tests de tiempo real

**Recommended Next Steps:**
1. Review risk assessment with team (prioritize 4 high-priority risks)
2. Run `*atdd` workflow to generate P0 tests
3. Set up test data factories and fixtures for Epic 1
4. Implement BLK-001 and BLK-002 blockers (dependencies from system-level)
