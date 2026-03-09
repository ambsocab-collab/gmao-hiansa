/**
 * Asset Search Load Test
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * k6 load test para búsqueda de activos
 * Baseline: 50 usuarios concurrentes
 * Target: p95 < 300ms
 */

import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.APP_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '20s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 30 },     // Ramp up to 30 users
    { duration: '1m', target: 50 },     // Ramp up to 50 users
    { duration: '2m', target: 50 },     // Stay at 50 users
    { duration: '20s', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],  // 95% de requests deben completar en <300ms
    http_req_failed: ['rate<0.03'],     // Error rate debe ser <3%
  },
}

export default function () {
  // Search for activos with various filters
  const searchParams = new URLSearchParams({
    page: '1',
    limit: '20',
    search: 'test',
  })

  const res = http.get(`${BASE_URL}/api/v1/activos?${searchParams.toString()}`)

  // Validate response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has data array': (r) => {
      try {
        const body = JSON.parse(r.body)
        return Array.isArray(body.data) || Array.isArray(body)
      } catch {
        return false
      }
    },
    'response time < 300ms': (r) => r.timings.duration < 300,
  })

  sleep(2) // Pause entre iterations (2 segundos)
}
