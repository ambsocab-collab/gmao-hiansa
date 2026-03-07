---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-07'
---

# Test Design: Epic 1 - Autenticación y Gestión de Usuarios PBAC

**Date:** 2026-03-07
**Author:** Bernardo
**Status:** Draft

---

## Executive Summary

**Scope:** Epic-level test design for Epic 1 - Autenticación y Gestión de Usuarios PBAC

**Epic Overview:**
Establecer la infraestructura técnica base del proyecto y el sistema de autenticación con gestión flexible de usuarios usando 15 capacidades individuales (PBAC - Permission-Based Access Control). El epic incluye 11 historias de usuario que cubren registro, login, cambio de contraseña obligatorio, gestión de capabilities, etiquetas de clasificación visual, perfiles, historial de actividad, eliminación y control de acceso por módulos.

**Risk Summary:**

- Total risks identified: 18
- High-priority risks (≥6): 7 (1 critical score 9, 6 high score 6)
- Critical categories: SEC (Security) - 44% of all risks

**Coverage Summary:**

- P0 scenarios: 37 (~25-40 hours)
- P1 scenarios: 19 (~15-25 hours)
- P2/P3 scenarios: 1 (~1-2 hours)
- **Total effort**: ~40-70 hours (~1-2 weeks for 1 QA engineer)

**Key Highlights:**
- 57 test scenarios across 11 user stories
- 44 E2E tests (user journeys, auth flows, UI workflows)
- 12 API tests (business logic, data persistence, authorization)
- 1 Unit test (password hash utilities)
- 1 critical blocker risk (E1-R001: PBAC unauthorized access) must be mitigated before GA

---

## Not in Scope

| Item | Reasoning | Mitigation |
|------|-----------|------------|
| **Profile photo upload** | Marked as "optional, not in MVP" in Epic | Defer to Phase 2 or future epic |
| **Multi-tenant architecture** | Single-tenant architecture acceptable for MVP | Test assumes single-company context |
| **Browser compatibility (Firefox/Safari)** | Epic specifies Chrome/Edge only support for MVP | Warning message sufficient for unsupported browsers |
| **Email service implementation** | Third-party email service for password delivery | Mock email service in tests, verify integration points |
| **Password reset flow** | "Forgot password" link disabled in MVP | Test disabled state only |
| **Internationalization (i18n)** | Spanish-only localization acceptable for MVP | No i18n testing required |

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|-------------|--------|-------|------------|-------|----------|
| **E1-R001** | SEC | Incorrect PBAC implementation allows unauthorized access | 3 (High) | 3 (Critical) | **9** | Security testing, code review, exhaustive authorization tests | Backend Dev + QA | Pre-implementation + Phase 1 |
| **E1-R002** | SEC | Password hashing algorithm weak/compromised | 2 (Medium) | 3 (Critical) | **6** | Use bcrypt/argon2 with proper salt, verify hash strength | Backend Dev | Phase 1 |
| **E1-R003** | SEC | Session hijacking via httpOnly cookie bypass | 2 (Medium) | 3 (Critical) | **6** | Enforce secure=true, sameSite=strict, validate cookie config | Backend Dev | Phase 1 |
| **E1-R004** | PERF | Login response time >3s with 100 concurrent users | 3 (High) | 2 (Medium) | **6** | Load testing, query optimization, connection pooling | Backend Dev | Phase 1 |
| **E1-R005** | SEC | Rate limiting bypass allows brute force attacks | 2 (Medium) | 3 (Critical) | **6** | Implement rate limiting per NFR-S9, test bypass scenarios | Backend Dev + QA | Phase 1 |
| **E1-R006** | DATA | Race condition in capability assignment causes data loss | 2 (Medium) | 3 (Critical) | **6** | Implement transactions, optimistic locking, integration tests | Backend Dev | Phase 1 |
| **E1-R007** | SEC | First-login password change not enforced (security hole) | 2 (Medium) | 3 (Critical) | **6** | E2E test for mandatory redirect, verify bypass attempts blocked | QA | Phase 1 |

### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|-------------|--------|-------|------------|-------|
| **E1-R008** | PERF | Activity history query >5s with 6 months data | 2 (Medium) | 2 (Medium) | 4 | Pagination, indexed queries, materialized views | Backend Dev |
| **E1-R009** | UX | User deletion workflow confusing (OT reassignment unclear) | 2 (Medium) | 2 (Medium) | 4 | UX testing, clear confirmation modal, preview of OTs affected | QA |
| **E1-R010** | DATA | Soft delete (isActive=false) not respected in queries | 2 (Medium) | 2 (Medium) | 4 | Integration tests for all user queries verify isActive filter | QA |
| **E1-R011** | OPS | Email service failure prevents password delivery | 1 (Low) | 3 (Critical) | 3 | Queue with retry, fallback (manual delivery), monitoring | Backend Dev |
| **E1-R012** | SEC | XSS vulnerability in user profile (name/description fields) | 2 (Medium) | 2 (Medium) | 4 | Input sanitization, output encoding, security tests | Backend Dev + QA |
| **E1-R013** | PERF | SSE 30s heartbeat creates stale UI for capability changes | 2 (Medium) | 2 (Medium) | 4 | Implement fast-forward mode for tests, verify real-time updates | QA |
| **E1-R014** | DATA | User tag limit (20) not enforced causes performance issues | 1 (Low) | 3 (Critical) | 3 | Backend validation test, verify limit enforced | Backend Dev + QA |
| **E1-R015** | SEC | CSRF token missing/invalid on critical actions | 1 (Low) | 3 (Critical) | 3 | Security tests for all state-changing operations | QA |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
|---------|----------|-------------|-------------|--------|-------|--------|
| **E1-R016** | OPS | Vercel serverless cold start >5s | 1 (Low) | 2 (Medium) | 2 | Monitor, acceptable for MVP |
| **E1-R017** | PERF | Profile image upload slows loading (future feature) | 1 (Low) | 1 (Minor) | 1 | Defer to Phase 2 |
| **E1-R018** | UX | Accessibility issue with color contrast (tags) | 1 (Low) | 2 (Medium) | 2 | WCAG AA verification |

### Risk Category Legend

- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **OPS**: Operations (deployment, config, monitoring)
- **UX**: User Experience (workflow confusion, usability)

---

## Entry Criteria

- [ ] Epic 1 requirements agreed by QA, Dev, PM
- [ ] Test environments provisioned (local, CI/CD, staging)
- [ ] Test data factories ready or seed data available
- [ ] NextAuth configured for test environment
- [ ] Prisma migrations executed in test database
- [ ] Vercel deployment pipeline configured

**Epic-Specific Entry Criteria:**
- [ ] 15 PBAC capabilities defined and documented
- [ ] User model with UserCapability and UserTag models migrated
- [ ] SSE infrastructure available for real-time updates testing

---

## Exit Criteria

- [ ] 100% P0 tests passing (no exceptions)
- [ ] ≥95% P1 tests passing (triaged and accepted failures allowed)
- [ ] No open high-priority/high-severity bugs
- [ ] Test coverage agreed as sufficient by QA Lead and Dev Lead
- [ ] Login performance <3s (NFR-P2 validated)
- [ ] E1-R001 (PBAC unauthorized access, Score 9) mitigated
- [ ] All 7 high risks (E1-R002 through E1-R007) have documented mitigation

---

## Project Team (Optional)

| Name | Role | Testing Responsibilities |
|------|------|------------------------|
| TBD | QA Lead | Review test design, approve coverage plan, sign-off on gate criteria |
| TBD | Backend Dev | Implement PBAC logic, setup test data seeding, configure NextAuth |
| TBD | Frontend Dev | Implement UI components, support E2E test selectors (data-testid) |

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Story 1.1: Prisma User model | E2E | E1-R006 | 1 | QA | Verify schema, enums, relationships |
| Story 1.1: NextAuth config | E2E | E1-R001, E1-R003 | 1 | QA | Verify provider, JWT, httpOnly cookies |
| Story 1.1: Password hash utilities | Unit | E1-R002 | 1 | QA | Test bcrypt hash/verify |
| Story 1.2: UserCapability unique constraint | API | E1-R006 | 1 | QA | Verify duplicate prevention |
| Story 1.3: Register user with capabilities | E2E | E1-R001 | 1 | QA | Full registration flow, capabilities saved |
| Story 1.3: Email duplicate validation | E2E | E1-R010 | 1 | QA | Error on duplicate, data preserved |
| Story 1.3: First admin gets all capabilities | E2E | E1-R001 | 1 | QA | Auto-detect empty system, assign 15 caps |
| Story 1.3: isFirstLogin flag enforcement | E2E | E1-R007 | 1 | QA | Verify redirect, navigation blocked |
| Story 1.4: Login with valid credentials | E2E | - | 1 | QA | Success, redirect to dashboard |
| Story 1.4: Login with invalid credentials | E2E | - | 1 | QA | Error, data preserved |
| Story 1.4: Rate limiting after 5 failed attempts | E2E | E1-R005 | 1 | QA | Verify 15min block, message |
| Story 1.4: isActive=false blocks login | E2E | E1-R001 | 1 | QA | Error, contact admin |
| Story 1.4: JWT session payload | API | E1-R001, E1-R003 | 1 | QA | Verify capabilities, httpOnly cookie |
| Story 1.5: First login mandatory redirect | E2E | E1-R007 | 1 | QA | Verify redirect, navigation blocked |
| Story 1.5: Password update sets isFirstLogin=false | E2E | E1-R007 | 1 | QA | Verify flag, navigation freed |
| Story 1.5: Password hash update | API | E1-R002 | 1 | QA | Verify bcrypt rehash |
| Story 1.6: Edit capabilities modal | E2E | E1-R001 | 1 | QA | Verify checkboxes, summary |
| Story 1.6: Save capabilities (delete+create) | E2E | E1-R006 | 1 | QA | Verify audit trail, timestamp |
| Story 1.6: Real-time navigation update | E2E | E1-R013, E1-R001 | 1 | QA | Verify SSE, modules appear/disappear |
| Story 1.7: Tag limit of 20 enforced | API | E1-R014 | 1 | QA | Verify constraint, error |
| Story 1.8: Unauthorized profile access blocked | E2E | E1-R001 | 1 | QA | Verify error, redirect |
| Story 1.9: Activity history limited for non-admin | E2E | E1-R001 | 1 | QA | Verify 30-day limit, own actions only |
| Story 1.10: Soft delete user | E2E | E1-R001 | 1 | QA | Verify isActive=false, deletedBy |
| Story 1.10: User deletion with OTs requires action | E2E | E1-R009 | 1 | QA | Verify modal, OT list, options |
| Story 1.10: Deleted user cannot login | E2E | E1-R001 | 1 | QA | Verify error, account deactivated |
| Story 1.10: Cannot delete last admin | E2E | E1-R001 | 1 | QA | Verify error, button disabled |
| Story 1.11: Navigation shows only authorized modules | E2E | E1-R001 | 1 | QA | Verify dynamic nav, capabilities→modules |
| Story 1.11: Single capability user sees minimal nav | E2E | E1-R001 | 1 | QA | Verify 1 module only |
| Story 1.11: Unauthorized URL access redirects | E2E | E1-R001 | 1 | QA | Verify error, redirect dashboard |
| Story 1.11: Capability assignment updates nav real-time | E2E | E1-R013, E1-R001 | 1 | QA | Verify SSE, no refresh needed |
| Story 1.11: Middleware checks capabilities | API | E1-R001 | 1 | QA | Verify auth check, 401 if no cap |
| Story 1.10: Reactivate user restores access | E2E | - | 1 | QA | Verify isActive=true, login works |
| Story 1.6: API capabilities update transaction | API | E1-R006 | 1 | QA | Verify rollback if fails |
| Story 1.2: Tag limit backend enforcement | API | E1-R014 | 1 | QA | Already counted above |
| Story 1.1: Prisma migrate TypeScript types | E2E | - | 1 | QA | Verify generated types |
| Story 1.3: Temporary password generation | API | E1-R002 | 1 | QA | Verify security, randomness |
| Story 1.5: Subsequent password change | E2E | E1-R002 | 1 | QA | Verify current password validation |
| Story 1.4: Session expiration 8h | E2E | E1-R003 | 1 | QA | Verify timeout, redirect |
| Story 1.6: Remove last can_manage_users blocked | E2E | - | 1 | QA | Verify error, checkbox disabled |
| Story 1.8: User profile view | E2E | - | 1 | QA | Verify badges, read-only caps |
| Story 1.9: Activity history pagination | API | E1-R008 | 1 | QA | Verify <5s response |
| Story 1.10: Soft delete preserves history | API | E1-R010 | 1 | QA | Verify data intact |
| Story 1.11: 10 unauthorized attempts IP block | E2E | E1-R005 | 1 | QA | Verify 5min block |

**Total P0**: 37 tests, ~25-40 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Story 1.1: Next.js project structure | E2E | - | 1 | QA | Verify directories, TypeScript config |
| Story 1.2: UserTagAssignment multiple tags | API | - | 1 | QA | Verify 3 tags saved |
| Story 1.2: UserTag 20 limit enforced | API | E1-R014 | 1 | QA | Already counted in P0 |
| Story 1.3: API creates UserCapability with audit | API | - | 1 | QA | Verify assignedBy, timestamp |
| Story 1.4: Unsupported browser warning | E2E | - | 1 | QA | Verify warning message (Firefox/Safari) |
| Story 1.6: Users list view with capabilities count | E2E | - | 1 | QA | Verify list, tags, caps count |
| Story 1.6: View profile read-only modal | E2E | - | 1 | QA | Verify read-only checkboxes |
| Story 1.6: Audit trail for capability changes | API | - | 1 | QA | Verify who, when, what added/removed |
| Story 1.7: Create tag with name and color | E2E | - | 1 | QA | Verify tag created, badge, createdBy |
| Story 1.7: Duplicate tag name error | E2E | - | 1 | QA | Verify error, modal stays |
| Story 1.7: Delete tag removes user assignments | E2E | - | 1 | QA | Verify confirmation, assignments removed |
| Story 1.8: Edit personal information | E2E | - | 1 | QA | Verify update, email validation |
| Story 1.8: Email unique validation on update | API | E1-R010 | 1 | QA | Verify error if exists |
| Story 1.9: View activity history timeline | E2E | E1-R008 | 1 | QA | Verify timeline, filters, export |
| Story 1.9: View work history with KPIs | E2E | - | 1 | QA | Verify OTs list, vs average |
| Story 1.9: Export to Excel | E2E | - | 1 | QA | Verify .xlsx file, sheets |
| Story 1.11: IP block message | E2E | E1-R005 | 1 | QA | Already counted in P0 |
| Story 1.10: Reactivate deleted user | E2E | - | 1 | QA | Already counted in P0 |

**Total P1**: 19 tests, ~15-25 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Story 1.9: Excel export edge cases | E2E | - | 1 | QA | Large dataset, formatting |

**Total P2**: 1 test, ~1-2 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

**Total P3**: 0 tests (not in scope for Epic 1)

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Login with valid credentials works (30s)
- [ ] Verify navigation loads for basic user (20s)
- [ ] Verify PBAC middleware blocks unauthorized access (20s)
- [ ] Verify NextAuth session created correctly (10s)

**Total**: 4 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] All 37 P0 scenarios (detailed in Coverage Plan above)

**Total**: 37 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] All 19 P1 scenarios (detailed in Coverage Plan above)

**Total**: 19 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] 1 P2 scenario (Excel export edge case)

**Total**: 1 scenario

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
|----------|-------|------------|-------------|-------|
| P0 | 37 | 0.7-1.1 | ~25-40 | Complex setup (security, PBAC, SSE, auth) |
| P1 | 19 | 0.8-1.3 | ~15-25 | Integration tests, API validation |
| P2 | 1 | 1-2 | ~1-2 | Edge case validation |
| **Total** | **57** | **-** | **~40-70** | **~1-2 weeks for 1 QA engineer** |

**Assumptions:**
- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure ready (factories, fixtures, environments)
- Epic 1 has higher complexity due to security requirements

### Prerequisites

**Test Data:**

- `userFactory` factory (faker-based, auto-cleanup) - generates test users with capabilities
- `assetFactory` factory (faker-based) - generates test assets for context
- `authFixture` fixture (setup/teardown) - handles login/session setup for tests

**Tooling:**

- Playwright for E2E and API testing
- bcryptjs for password hash verification
- faker for test data generation
- Prisma with test database for data setup

**Environment:**

- Local development environment with Prisma test database
- CI/CD environment with Vercel deployment
- Staging environment for integration testing
- NextAuth configured for test environment (mock email if needed)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥80% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

**Critical Gate Rule:**
- **E1-R001 (Score 9)** must be mitigated before GA release
- All 7 high risks (score 6+) must have documented mitigation plan

### Coverage Targets

- **Critical paths**: ≥80%
- **Security scenarios**: 100%
- **Business logic**: ≥70%
- **Edge cases**: ≥50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] E1-R001 (PBAC unauthorized access) mitigated
- [ ] Security tests (SEC category) pass 100%
- [ ] Login performance <3s (NFR-P2)

---

## Mitigation Plans

### E1-R001: Incorrect PBAC implementation allows unauthorized access (Score: 9)

**Mitigation Strategy:**
- Implement exhaustive E2E tests for all 15 capability combinations
- Security testing: attempt unauthorized access, verify blocked
- Code review: ensure middleware checks capabilities on every protected route
- Test edge cases: capability removed while user logged in (SSE update)
- Document PBAC rules clearly for implementation

**Owner:** Backend Dev + QA
**Timeline:** Pre-implementation (design) + Phase 1 (testing)
**Status:** Planned
**Verification:** All P0 authorization tests pass, security review approved

### E1-R002: Password hashing algorithm weak/compromised (Score: 6)

**Mitigation Strategy:**
- Use bcryptjs with salt rounds ≥10
- Implement unit tests for hash/verify functions
- Verify hash length and format
- Test with weak/common passwords to ensure proper hashing

**Owner:** Backend Dev
**Timeline:** Phase 1
**Status:** Planned
**Verification:** Unit test E1-1.1-UNIT-001 passes, hash strength verified

### E1-R003: Session hijacking via httpOnly cookie bypass (Score: 6)

**Mitigation Strategy:**
- Enforce secure=true on HTTPS
- Enforce sameSite=strict
- Verify httpOnly flag set
- Test cookie cannot be accessed via JavaScript

**Owner:** Backend Dev
**Timeline:** Phase 1
**Status:** Planned
**Verification:** API test E1-1.4-API-001 passes, cookie config validated

### E1-R004: Login response time >3s with 100 concurrent users (Score: 6)

**Mitigation Strategy:**
- Load testing with k6 or similar tool
- Optimize database queries (indexes)
- Implement connection pooling
- Benchmark at 50, 100 concurrent users

**Owner:** Backend Dev
**Timeline:** Phase 1
**Status:** Planned
**Verification:** Load test passes, login <3s at 100 concurrent users

### E1-R005: Rate limiting bypass allows brute force attacks (Score: 6)

**Mitigation Strategy:**
- Implement rate limiting per NFR-S9 (5 attempts / 15min)
- Test bypass scenarios (IP spoofing, multiple user agents)
- Verify rate limit triggers correctly
- Test error message doesn't reveal account existence

**Owner:** Backend Dev + QA
**Timeline:** Phase 1
**Status:** Planned
**Verification:** E2E test E1-1.4-E2E-003 passes, bypass tests pass

### E1-R006: Race condition in capability assignment causes data loss (Score: 6)

**Mitigation Strategy:**
- Implement database transactions
- Use optimistic locking if needed
- Integration tests for concurrent capability updates
- Verify all-or-nothing behavior

**Owner:** Backend Dev
**Timeline:** Phase 1
**Status:** Planned
**Verification:** API tests E1-1.6-API-001, E1-1.2-API-001 pass

### E1-R007: First-login password change not enforced (Score: 6)

**Mitigation Strategy:**
- E2E test for mandatory redirect on first login
- Test all navigation paths blocked until password changed
- Attempt direct URL access, verify redirect
- Verify bypass attempts (modify URL, direct API call) blocked

**Owner:** QA
**Timeline:** Phase 1
**Status:** Planned
**Verification:** E2E tests E1-1.5-E2E-001, E1-1.5-E2E-003 pass

---

## Assumptions and Dependencies

### Assumptions

1. Single-tenant architecture is acceptable for MVP (one company metalúrgica)
2. Chrome/Edge only browser support is acceptable for industrial environment
3. Spanish-only localization is acceptable for MVP initial release
4. Neon PostgreSQL (via Supabase or Docker) is sufficient for development/testing
5. Vercel serverless can handle 100 concurrent users without degradation
6. SSE with 30s heartbeat is sufficient for real-time requirements
7. 1 QA engineer is sufficient to implement 57 tests in 1-2 weeks
8. Test infrastructure (factories, fixtures) will be set up before QA starts

### Dependencies

1. Epic 1 stories implemented before QA can start testing - Required by Sprint 1
2. Prisma migrations executed in test database - Required by Sprint 1
3. NextAuth configured for test environment - Required by Sprint 1
4. Test data factories implemented - Required by Sprint 1

### Risks to Plan

- **Risk**: SSE real-time updates difficult to test deterministically
  - **Impact**: Flaky tests for capability assignment, navigation updates
  - **Contingency**: Implement "fast-forward" mode for tests, mock SSE layer

- **Risk**: Test data seeding not available (no `/api/test-data` endpoints)
  - **Impact**: Slow tests requiring manual UI setup
  - **Contingency**: Implement test data seeding APIs or use factory pattern with API calls

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests (separate workflow; not auto-run).
- Run `*automate` for broader coverage once implementation exists.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: ____________ Date: ____________
- [ ] Tech Lead: ____________ Date: ____________
- [ ] QA Lead: ____________ Date: ____________

**Comments:**

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope |
|-------------------|--------|------------------|
| **NextAuth** | Breaking change would block all authentication | All login/session tests (E1-1.4-* tests) |
| **Prisma User model** | Schema changes would break data layer | All user/credential tests (E1-1.2-*, E1-1.3-* tests) |
| **SSE infrastructure** | Failure would break real-time updates | All capability assignment tests (E1-1.6-*, E1-1.11-* tests) |
| **PBAC middleware** | Logic error would expose unauthorized access | All authorization tests (E1-1.11-* tests) |
| **Vercel deployment** | Deployment issues would block environment access | All E2E tests requiring staging/production environment |

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework (1-9 scoring, gate decisions)
- `probability-impact.md` - Risk scoring methodology (Probability × Impact)
- `test-levels-framework.md` - Test level selection (Unit/Integration/E2E)
- `test-priorities-matrix.md` - P0-P3 prioritization (business impact, risk)

### Related Documents

- Epic: `/planning-artifacts/epics/epic-1-autenticacin-y-gestin-de-usuarios-pbac.md`
- Sprint Status: `/implementation-artifacts/sprint-status.yaml`
- Architecture: Available in `/planning-artifacts/archive/architecture.md`
- PRD: Available in `/planning-artifacts/archive/prd.md`

### Test ID Format

`E1-{story_number}-{level}-{sequence}`

Examples:
- `E1-1.4-E2E-001` - Epic 1, Story 1.4, E2E Test, sequence 001
- `E1-1.6-API-001` - Epic 1, Story 1.6, API Test, sequence 001
- `E1-1.1-UNIT-001` - Epic 1, Story 1.1, Unit Test, sequence 001

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 4.0 (BMad v6)
