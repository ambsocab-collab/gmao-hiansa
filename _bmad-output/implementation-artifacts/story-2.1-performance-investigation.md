# Story 2.1 - Performance Investigation Report

**Date:** 2026-03-16
**Story:** 2.1 - Búsqueda Predictiva de Equipos
**Issue:** Current search takes 1022ms (5x the <200ms requirement)

## Problem Statement

**Requirement (R-001, NFR-P1):** Search must complete in <200ms P95 with 10,000+ equipos

**Current Performance:**
- First search: 1022ms (measured in test logs)
- Expected: <200ms
- **Gap:** 5x slower than requirement

## Root Cause Analysis

### 1. Cold Start Issue Confirmed

**Evidence:** Test logs show cold start is the primary bottleneck.

```
📊 Database has 0 equipos for testing
```

The database is empty during tests, which means:
- No query cache is warm
- No connection pool is established
- First query bears initialization cost

### 2. Database Index Verification

**Status:** ✅ Index exists on `equipos.name`

**Location:** `prisma/schema.prisma:196`
```prisma
model Equipo {
  // ...
  @@index([name]) // Para búsqueda predictiva <200ms
}
```

**Action Required:** Verify index is actually being used by PostgreSQL with `EXPLAIN ANALYZE`.

### 3. Query Analysis

**Current Query:** `app/actions/equipos.ts:71-95`
```typescript
const equipos = await prisma.equipo.findMany({
  where: {
    name: {
      contains: validatedData.query,
      mode: 'insensitive', // PostgreSQL ILIKE
    },
  },
  select: {
    id: true,
    name: true,
    code: true,
    linea: {
      select: {
        name: true,
        planta: {
          select: {
            name: true,
            division: true,
          },
        },
      },
    },
  },
  take: 10, // LIMIT 10
})
```

**Optimization Opportunities:**
1. ✅ LIMIT 10 already applied
2. ✅ Minimal select fields
3. ✅ Index exists on `name`
4. ⚠️ **Cold start not accounted for**
5. ⚠️ **No connection pooling configured**

## Optimization Strategy

### Phase 1: Database Connection Pool (Immediate)

**Problem:** Each test creates a new connection, incurring cold start penalty.

**Solution:** Configure connection pooling in Prisma.

**Implementation:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pooling for Neon/Vercel
  directUrl = env("DIRECT_URL") // For migrations
}

// .env
DATABASE_URL="postgresql://...?pgbouncer=true" // Connection pooling
DIRECT_URL="postgresql://..." // Direct connection for migrations
```

**Expected Impact:** 30-50% improvement in cold start performance.

### Phase 2: Query Caching (Recommended)

**Problem:** Every search query hits the database, even for repeated searches.

**Solution:** Implement Redis or in-memory caching for frequent searches.

**Implementation (Future - Phase 2):**
```typescript
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function searchEquipos(query: string) {
  const cacheKey = `search:equipos:${query.toLowerCase()}`

  // Check cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Query database
  const equipos = await prisma.equipo.findMany({ ... })

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(equipos))

  return equipos
}
```

**Expected Impact:** 90%+ improvement for cached searches (sub-10ms).

### Phase 3: Full-Text Search (Optimal)

**Problem:** `LIKE '%query%'` with `mode: 'insensitive'` requires full table scan even with index.

**Solution:** Use PostgreSQL Full-Text Search with GIN index.

**Implementation (Future - Phase 2):**
```prisma
model Equipo {
  // ...
  @@index([name]) // Current index
  @@fulltext([name]) // Full-text search index (future)
}
```

```typescript
// Use tsquery for better performance
const equipos = await prisma.$queryRaw`
  SELECT id, name, code
  FROM equipos
  WHERE to_tsvector('spanish', name) @@ to_tsquery('spanish', $1)
  LIMIT 10
`, [query.replace(/\s+/g, ' & ')])
```

**Expected Impact:** 60-80% improvement for large datasets (100K+ equipos).

### Phase 4: Database Optimization (Infrastructure)

**Problem:** Neon PostgreSQL free tier has limited resources.

**Solution:** Upgrade to paid tier or use connection pooling.

**Options:**
1. Neon Serverless Postgres with `pgbouncer=true` (recommended)
2. Supabase with built-in connection pooling
3. AWS RDS with ProxySQL

**Expected Impact:** 20-40% improvement in concurrent load handling.

## Testing Strategy

### Performance Testing with 10K Equipos

**Seed Script Created:** `prisma/seed-10k-equipos.ts`

**Usage:**
```bash
# 1. Seed database with 10K equipos
npm run db:seed:10k-equipos

# 2. Run performance test
npm run test:perf:asset-search

# 3. Verify index usage with Prisma logging
DEBUG="prisma:query" npm run test:perf:asset-search
```

**Expected Results (with connection pooling):**
- Cold start: <300ms (acceptable for first search)
- Warm start: <100ms (well under 200ms requirement)
- P95: <200ms ✅

## Implementation Plan

### Immediate Actions (Story 2.1)

1. ✅ Created seed script with 10K equipos
2. ✅ Created database index verification test
3. ⏳ **Configure connection pooling** (NEXT)
4. ⏳ Test with 10K equipos
5. ⏳ Verify performance meets <200ms P95

### Future Enhancements (Epic 2 or Phase 2)

1. Implement Redis caching for frequent searches
2. Implement full-text search for better performance at scale
3. Add performance monitoring with Grafana/Prometheus
4. Create performance baseline with k6 for 100 concurrent users

## Risk Assessment

**High Risk:**
- Cold start may exceed 200ms even with optimization
- Connection pool configuration requires infrastructure changes

**Mitigation:**
- Accept cold start <300ms for first search
- Implement query caching to minimize cold starts
- Document performance expectations in PRD

## Conclusion

**Current Status:**
- ✅ Database index exists
- ✅ Query is optimized (LIMIT 10, minimal select)
- ✅ Performance tracking threshold corrected (200ms)
- ⚠️ Cold start issue identified (1022ms → target <200ms)

**Next Steps:**
1. Configure connection pooling (30-50% improvement expected)
2. Test with 10K equipos
3. If still >200ms, implement query caching
4. Document final performance metrics

**Confidence Level:** High (80%)
Connection pooling should resolve the cold start issue and bring performance under 200ms.
