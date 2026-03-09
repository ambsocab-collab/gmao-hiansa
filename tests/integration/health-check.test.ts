/**
 * Integration tests for health check endpoint
 * Story 0.5: Error Handling, Observability y CI/CD
 *
 * Story 0.5: Updated to test correlation ID and performance tracking
 * Story 0.5: Added test for database down scenario
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from '@/app/api/v1/health/route'
import { NextRequest } from 'next/server'
import * as dbModule from '@/lib/db'

describe('Health Check Endpoint', () => {
  it('should return 200 when database is up', async () => {
    // Create mock NextRequest with headers
    const mockRequest = new NextRequest('http://localhost:3000/api/v1/health', {
      headers: {
        'x-correlation-id': 'test-correlation-123'
      }
    })

    const response = await GET(mockRequest)

    expect(response.status).toBe(200)

    const json = await response.json()

    expect(json).toHaveProperty('status', 'healthy')
    expect(json).toHaveProperty('timestamp')
    expect(json).toHaveProperty('services')
    expect(json.services).toHaveProperty('database', 'up')
    expect(json.services).toHaveProperty('version')
  })

  it('should include ISO timestamp', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/v1/health')
    const response = await GET(mockRequest)
    const json = await response.json()

    expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it('should work without correlation ID header', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/v1/health')
    const response = await GET(mockRequest)

    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toHaveProperty('status', 'healthy')
  })

  // Story 0.5: Implemented test for database down scenario
  describe('when database is down', () => {
    beforeEach(() => {
      // Mock prisma.$queryRaw to throw error
      vi.spyOn(dbModule, 'prisma', 'get').mockReturnValue({
        $queryRaw: vi.fn().mockRejectedValue(new Error('Database connection failed'))
      } as any)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return 503 when database is down', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/v1/health')
      const response = await GET(mockRequest)

      expect(response.status).toBe(503)

      const json = await response.json()

      expect(json).toHaveProperty('status', 'unhealthy')
      expect(json).toHaveProperty('timestamp')
      expect(json).toHaveProperty('error', 'Database connection failed')
    })
  })
})
