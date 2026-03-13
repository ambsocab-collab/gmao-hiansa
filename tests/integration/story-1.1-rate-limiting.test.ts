import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, getRemainingAttempts, loginAttempts, RATE_LIMIT_CONFIG } from '@/lib/rate-limit';

/**
 * Rate Limiting Integration Tests
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Integration tests for rate limiting functionality
 * Tests the rate limiting functions directly (not via HTTP)
 */

describe('Story 1.1 - Rate Limiting API', () => {
  const originalEnv = process.env.NODE_ENV;

  // Reset rate limit state before each test
  beforeEach(async () => {
    loginAttempts.clear();
    // Disable test bypass for rate limiting tests
    process.env.NODE_ENV = 'development';
  });

  // Restore NODE_ENV after tests
  afterEach(async () => {
    process.env.NODE_ENV = originalEnv;
  });

  it('[API-P0-INT-001] should return initial rate limit status', async () => {
    const remaining = getRemainingAttempts('localhost');
    const record = loginAttempts.get('localhost');

    expect(remaining).toBe(RATE_LIMIT_CONFIG.MAX_ATTEMPTS);
    expect(RATE_LIMIT_CONFIG.MAX_ATTEMPTS).toBe(5);
    expect(record).toBeUndefined();
  });

  it('[API-P0-INT-002] should track failed login attempts', async () => {
    const testIP = 'localhost';
    // Don't bypass rate limiting - pass empty headers (not test mode)
    const testHeaders = new Headers();

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      const allowed = await checkRateLimit(testIP, testHeaders);
      expect(allowed).toBe(true);
    }

    // Check rate limit status - should have 0 remaining
    const remaining = getRemainingAttempts(testIP);
    expect(remaining).toBe(0);
  });

  it('[API-P0-INT-003] should block after 5 failed attempts', async () => {
    const testIP = 'localhost';
    const testHeaders = new Headers();

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIP, testHeaders);
    }

    // Check rate limit status - should have 0 remaining but not blocked yet
    let remaining = getRemainingAttempts(testIP);
    expect(remaining).toBe(0);

    // 6th attempt should be blocked
    const blocked = await checkRateLimit(testIP, testHeaders);
    expect(blocked).toBe(false);

    // Verify final rate limit status
    remaining = getRemainingAttempts(testIP);
    const record = loginAttempts.get(testIP);
    expect(record?.count).toBeGreaterThan(RATE_LIMIT_CONFIG.MAX_ATTEMPTS);
  });

  it('[API-P0-INT-004] should allow only 5 attempts per 15 minutes', async () => {
    const testIP = 'localhost';
    const testHeaders = new Headers();

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIP, testHeaders);
    }

    // Should have 0 remaining
    expect(getRemainingAttempts(testIP)).toBe(0);

    // 6th attempt should be blocked
    const blocked = await checkRateLimit(testIP, testHeaders);
    expect(blocked).toBe(false);

    // Verify blocked status
    const record = loginAttempts.get(testIP);
    expect(record?.count).toBeGreaterThan(RATE_LIMIT_CONFIG.MAX_ATTEMPTS);
  });
});
