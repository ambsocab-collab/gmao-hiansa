import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Rate Limiting Integration Tests
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Integration tests for rate limiting functionality
 * Tests the rate limiting endpoint directly
 */

const BASE_URL = 'http://localhost:3000';

describe('Story 1.1 - Rate Limiting API', () => {
  const rateLimitAPI = `${BASE_URL}/api/v1/auth/rate-limit`;
  const resetAPI = `${BASE_URL}/api/v1/test/reset-rate-limit`;

  // Reset rate limit state before each test
  beforeEach(async () => {
    await fetch(resetAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearAll: true })
    });
  });

  it('[API-P0-INT-001] should return initial rate limit status', async () => {
    const response = await fetch(rateLimitAPI);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('remaining');
    expect(data).toHaveProperty('maxAttempts', 5);
    expect(data).toHaveProperty('blocked', false);
    expect(data.remaining).toBe(5);
    expect(data.maxAttempts).toBe(5);
    expect(data.blocked).toBe(false);
  });

  it('[API-P0-INT-002] should track failed login attempts', async () => {
    const testEmail = `test-${Date.now()}@example.com`;

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`${BASE_URL}/api/v1/auth/simulate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          shouldFail: true
        })
      });

      // Each attempt should fail with 401
      expect(response.status).toBe(401);
    }

    // Check rate limit status - should have 0 remaining
    const response = await fetch(rateLimitAPI);
    const data = await response.json();

    expect(data.blocked).toBe(false);
    expect(data.remaining).toBe(0);
  });

  it('[API-P0-INT-003] should block after 5 failed attempts', async () => {
    const testEmail = `block-test-${Date.now()}@example.com`;

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await fetch(`${BASE_URL}/api/v1/auth/simulate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          shouldFail: true
        })
      });
    }

    // Check rate limit status - should have 0 remaining but not blocked yet
    let response = await fetch(rateLimitAPI);
    let data = await response.json();
    expect(data.blocked).toBe(false);
    expect(data.remaining).toBe(0);

    // 6th attempt should be blocked
    const blockResponse = await fetch(`${BASE_URL}/api/v1/auth/simulate-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        shouldFail: true
      })
    });

    expect(blockResponse.status).toBe(429);

    const blockData = await blockResponse.json();
    expect(blockData.error).toBe('RATE_LIMITED');
    expect(blockData.rateLimit.blocked).toBe(true);

    // Check rate limit status - should now be blocked
    response = await fetch(rateLimitAPI);
    data = await response.json();

    expect(data.blocked).toBe(true);
    expect(data.remaining).toBe(0);
  });

  it('[API-P0-INT-004] should allow only 5 attempts per 15 minutes', async () => {
    const testEmail = `limits-test-${Date.now()}@example.com`;

    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`${BASE_URL}/api/v1/auth/simulate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          shouldFail: true
        })
      });

      // First 5 attempts should return 401 (invalid credentials)
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.rateLimit.blocked).toBe(false);
    }

    // Check rate limit status - should have 0 remaining but not blocked yet
    const response = await fetch(rateLimitAPI);
    const data = await response.json();

    expect(data.blocked).toBe(false);
    expect(data.remaining).toBe(0); // 0 remaining means 5 attempts made

    // 6th attempt should block
    const blockResponse = await fetch(`${BASE_URL}/api/v1/auth/simulate-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        shouldFail: true
      })
    });

    expect(blockResponse.status).toBe(429);

    const blockData = await blockResponse.json();
    expect(blockData.error).toBe('RATE_LIMITED');
    expect(blockData.rateLimit.blocked).toBe(true);

    // Verify final rate limit status
    const response2 = await fetch(rateLimitAPI);
    const data2 = await response2.json();

    expect(data2.blocked).toBe(true);
    expect(data2.remaining).toBe(0);
  });
});
