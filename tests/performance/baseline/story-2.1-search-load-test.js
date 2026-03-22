/**
 * k6 Load Test: Story 2.1 - Search Performance (R-001 PERF score=8)
 *
 * Purpose: Validate search performance P95 <200ms with 10K assets
 *
 * Test Configuration:
 * - Scenarios: 3 stages (ramp up, sustained, ramp down)
 * - Target: P95 response time <200ms
 * - Error rate: <5%
 * - Endpoint: /api/equipos/search (autocomplete)
 *
 * Prerequisites:
 * - Database seeded with 10,000+ assets
 * - Admin user credentials available
 * - Server running at BASE_URL
 *
 * R-001: PERF score=8 (HIGH) - Performance degradation with large datasets
 * This test prevents search performance issues as asset count grows.
 *
 * Usage:
 *   npm run test:perf:asset-search
 *   or
 *   k6 run tests/performance/baseline/story-2.1-search-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const searchDuration = new Trend('search_duration_ms');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },     // Sustained load: 50 concurrent users
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200'], // CRITICAL: P95 <200ms (R-001)
    'http_req_duration': ['p(50)<100'], // Median <100ms
    'errors': ['rate<0.05'],            // Error rate <5%
    'search_duration_ms': ['p(95)<200'], // Custom metric: P95 <200ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = __ENV.ADMIN_EMAIL || 'admin@gmao-hiansa.com';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || 'admin123';

// Search terms to test (partial matches)
const SEARCH_TERMS = ['pren', 'motor', 'bomb', 'comp', 'veh', 'trans'];

/**
 * Login and get session cookie
 */
function login() {
  const loginPayload = JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    redirect: false,
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/api/auth/callback/credentials`, loginPayload, loginParams);

  const success = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has session cookie': (r) => r.cookies.find(c => c.name === 'next-auth.session-token') !== undefined,
  });

  errorRate.add(!success);

  if (!success) {
    console.error('Login failed:', loginRes.status);
  }

  return loginRes;
}

/**
 * Search for assets
 */
function searchForAssets(sessionCookies, searchTerm) {
  const searchUrl = `${BASE_URL}/api/equipos/search?q=${encodeURIComponent(searchTerm)}`;

  const searchParams = {
    headers: {
      'Accept': 'application/json',
    },
    cookies: sessionCookies,
  };

  const startTime = Date.now();
  const searchRes = http.get(searchUrl, searchParams);
  const endTime = Date.now();

  const duration = endTime - startTime;
  searchDuration.add(duration);

  const success = check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search response time <200ms p95': (r) => r.timings.duration < 200,
    'search has results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length > 0;
      } catch (e) {
        console.error('Failed to parse search response:', e);
        return false;
      }
    },
    'search results have required fields': (r) => {
      try {
        const body = JSON.parse(r.body);
        if (body.length === 0) return false;
        const firstResult = body[0];
        return (
          firstResult.hasOwnProperty('id') &&
          firstResult.hasOwnProperty('name') &&
          firstResult.hasOwnProperty('linea')
        );
      } catch (e) {
        return false;
      }
    },
  });

  errorRate.add(!success);

  if (!success) {
    console.error(`Search failed for term "${searchTerm}":`, searchRes.status, searchRes.status_text);
  }

  return { success, duration };
}

/**
 * Main test scenario
 */
export default function () {
  // Login once per VU
  const loginRes = login();

  if (loginRes.status !== 200) {
    console.error('Cannot proceed without login');
    return;
  }

  // Extract session cookies
  const sessionCookies = loginRes.cookies;

  // Perform multiple searches per VU
  const searchesPerIteration = 3;

  for (let i = 0; i < searchesPerIteration; i++) {
    // Pick random search term
    const searchTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];

    // Search
    const { success, duration } = searchForAssets(sessionCookies, searchTerm);

    // Log slow searches (>200ms)
    if (duration > 200) {
      console.warn(`Slow search detected: ${duration}ms for term "${searchTerm}"`);
    }

    // Small delay between searches (simulating user typing)
    sleep(Math.random() * 2 + 1); // 1-3 seconds
  }
}

/**
 * Setup function: Verify database has 10K+ assets
 */
export function setup() {
  console.log('Setup: Verifying database has 10,000+ assets...');

  // Login first
  const loginPayload = JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    redirect: false,
  });

  const loginRes = http.post(
    `${BASE_URL}/api/auth/callback/credentials`,
    loginPayload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (loginRes.status !== 200) {
    console.error('Setup failed: Cannot login');
    return;
  }

  // Get asset count via search API (search for empty string returns all)
  const searchRes = http.get(`${BASE_URL}/api/equipos/search?q=`, {
    headers: {
      'Accept': 'application/json',
    },
    cookies: loginRes.cookies,
  });

  if (searchRes.status === 200) {
    const assets = JSON.parse(searchRes.body);
    const assetCount = Array.isArray(assets) ? assets.length : 0;

    console.log(`Database has ${assetCount} assets`);

    if (assetCount < 10000) {
      console.warn(`WARNING: Database has only ${assetCount} assets (10,000+ recommended for R-001 validation)`);
      console.warn('Consider running seed script to add more assets');
    } else {
      console.log('✅ Database has sufficient assets for load testing');
    }
  } else {
    console.error('Setup failed: Cannot query asset count');
  }
}

/**
 * Teardown function
 */
export function teardown(data) {
  console.log('Teardown: Load test completed');
  console.log('Check k6 summary for P95 duration and error rate');
  console.log('P95 duration should be <200ms to pass R-001 threshold');
}
