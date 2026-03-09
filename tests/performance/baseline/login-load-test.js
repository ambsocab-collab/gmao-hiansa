/**
 * Login Load Test
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * k6 load test para el endpoint de login
 * Baseline: 100 usuarios concurrentes
 * Target: p95 < 500ms
 */

import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.APP_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 50 },     // Ramp up to 50 users
    { duration: '1m', target: 100 },    // Ramp up to 100 users
    { duration: '2m', target: 100 },    // Stay at 100 users
    { duration: '30s', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% de requests deben completar en <500ms
    http_req_failed: ['rate<0.05'],     // Error rate debe ser <5%
  },
}

export default function () {
  const credentials = {
    email: 'test@example.com',
    password: 'testpassword123',
  }

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Attempt login
  const res = http.post(`${BASE_URL}/api/auth/callback/credentials`, JSON.stringify(credentials), params)

  // Validate response
  check(res, {
    'status is 200 or 302': (r) => r.status === 200 || r.status === 302,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1) // Pause entre iterations (1 segundo)
}
