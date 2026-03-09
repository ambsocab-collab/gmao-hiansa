/**
 * Create Work Order Load Test
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * k6 load test para creación de Órdenes de Trabajo
 * Baseline: 20 usuarios concurrentes
 * Target: p95 < 1000ms ( Writes son más lentas)
 */

import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.APP_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '10s', target: 5 },    // Ramp up to 5 users
    { duration: '30s', target: 10 },    // Ramp up to 10 users
    { duration: '1m', target: 20 },     // Ramp up to 20 users
    { duration: '2m', target: 20 },     // Stay at 20 users
    { duration: '10s', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% de requests deben completar en <1000ms
    http_req_failed: ['rate<0.05'],     // Error rate debe ser <5%
  },
}

// Helper function para generar fechas aleatorias
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export default function () {
  const workOrderData = {
    titulo: `Test OT ${Math.floor(Math.random() * 10000)}`,
    descripcion: 'Test work order for performance testing',
    tipo: 'Correctivo',
    urgencia: ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)],
    fechaInicio: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(),
    equipoId: 'test-equipo-id', // Debería ser reemplazado con ID real en testing
  }

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const res = http.post(`${BASE_URL}/api/v1/work-orders`, JSON.stringify(workOrderData), params)

  // Validate response
  check(res, {
    'status is 201 or 200': (r) => r.status === 201 || r.status === 200,
    'has work order data': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.id || body.data?.id
      } catch {
        return false
      }
    },
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  })

  sleep(3) // Pause entre iterations (3 segundos para writes)
}
