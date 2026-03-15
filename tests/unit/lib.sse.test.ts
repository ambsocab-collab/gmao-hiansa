/**
 * Unit Tests for lib/sse.ts
 * Story 0.4: SSE Infrastructure con Heartbeat
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing Server-Sent Events utilities
 */

import { describe, it, expect, vi } from 'vitest';
import { createSSEStream } from '@/lib/sse';
import { sendSSEEvent } from '@/lib/sse/utils';

describe('lib/sse - SSE Utilities', () => {
  describe('createSSEStream', () => {
    it('[P1] 0.4-UNIT-001: should create a ReadableStream', () => {
      const stream = createSSEStream();
      expect(stream).toBeDefined();
      expect(stream).toBeInstanceOf(ReadableStream);
    });

    it('[P2] 0.4-UNIT-002: should have readable stream properties', () => {
      const stream = createSSEStream();
      expect(stream).toHaveProperty('getReader');
      expect(stream).toHaveProperty('cancel');
      expect(typeof stream.getReader).toBe('function');
      expect(typeof stream.cancel).toBe('function');
    });

    it('[P1] 0.4-UNIT-003: should create independent streams', () => {
      const stream1 = createSSEStream();
      const stream2 = createSSEStream();

      expect(stream1).not.toBe(stream2);
    });

    it('[P2] 0.4-UNIT-004: should allow getting reader from stream', () => {
      const stream = createSSEStream();
      const reader = stream.getReader();

      expect(reader).toBeDefined();
      expect(reader).toHaveProperty('read');
      expect(reader).toHaveProperty('releaseLock');

      reader.releaseLock();
    });

    // Note: Testing actual heartbeat requires longer timeouts or mock timers
    // The heartbeat interval is 30 seconds as per AC 9
    // Integration tests will verify full SSE functionality
  });

  describe('sendSSEEvent', () => {
    it('[P0] 0.4-UNIT-005: should format SSE event correctly', () => {
      const eventData = { test: 'data', id: 123 };
      const sseEvent = sendSSEEvent('test_event', eventData);

      expect(sseEvent).toContain('event: test_event');
      expect(sseEvent).toContain('data: {"test":"data","id":123}');
      expect(sseEvent).toContain('\n\n'); // Events end with double newline
    });

    it('[P1] 0.4-UNIT-006: should format event correctly', () => {
      const eventData = { message: 'Hello SSE' };
      const sseEvent = sendSSEEvent('message', eventData);

      // SSE format: event: <type>\ndata: <json>\n\n
      expect(sseEvent).toMatch(/^event: message\n/);
      expect(sseEvent).toMatch(/data: \{.*\}\n\n$/);
    });

    it('[P2] 0.4-UNIT-007: should handle complex JSON data', () => {
      const complexData = {
        user: { id: '123', name: 'Test User' },
        items: [1, 2, 3],
        nested: { a: { b: 'c' } }
      };

      const sseEvent = sendSSEEvent('complex', complexData);

      expect(sseEvent).toContain('event: complex');
      expect(sseEvent).toContain('data: {');
      expect(sseEvent).toContain('"user"');
      expect(sseEvent).toContain('"items"');
      expect(sseEvent).toContain('"nested"');
    });

    it('[P2] 0.4-UNIT-008: should handle event ID', () => {
      const eventData = { message: 'test' };
      const sseEvent = sendSSEEvent('test_event', eventData, 'evt-123');

      expect(sseEvent).toContain('id: evt-123');
      expect(sseEvent).toContain('event: test_event');
      expect(sseEvent).toContain('data: {"message":"test"}');
    });

    it('[P2] 0.4-UNIT-009: should handle numeric data', () => {
      const sseEvent = sendSSEEvent('number', 42);

      expect(sseEvent).toContain('event: number');
      expect(sseEvent).toContain('data: 42');
    });

    it('[P2] 0.4-UNIT-010: should handle boolean data', () => {
      const sseEvent = sendSSEEvent('bool', true);

      expect(sseEvent).toContain('event: bool');
      expect(sseEvent).toContain('data: true');
    });

    it('[P2] 0.4-UNIT-011: should handle null data', () => {
      const sseEvent = sendSSEEvent('null', null);

      expect(sseEvent).toContain('event: null');
      expect(sseEvent).toContain('data: null');
    });
  });

  describe('SSE Integration', () => {
    it('[P2] 0.4-UNIT-012: should create stream and controller independently', () => {
      const stream = createSSEStream();
      const mockController = {
        enqueue: vi.fn()
      };

      // These are independent utilities
      expect(stream).toBeInstanceOf(ReadableStream);
      expect(mockController.enqueue).toBeDefined();

      const reader = stream.getReader();
      reader.releaseLock();
    });

    it('[P2] 0.4-UNIT-013: should handle Unicode characters in data', () => {
      const unicodeData = {
        message: 'Hola Mundo 🌍',
        emoji: '🚀🔥💻',
        special: 'ñáéíóú'
      };

      const sseEvent = sendSSEEvent('unicode', unicodeData);

      expect(sseEvent).toContain('Hola Mundo 🌍');
      expect(sseEvent).toContain('🚀🔥💻');
      expect(sseEvent).toContain('ñáéíóú');
    });

    it('[P2] 0.4-UNIT-014: should handle event names with special characters', () => {
      const event1 = sendSSEEvent('event-with-dash', { data: 1 });
      const event2 = sendSSEEvent('event_with_underscore', { data: 2 });
      const event3 = sendSSEEvent('event.with.dots', { data: 3 });

      expect(event1).toContain('event: event-with-dash');
      expect(event2).toContain('event: event_with_underscore');
      expect(event3).toContain('event: event.with.dots');
    });

    it('[P2] 0.4-UNIT-015: should handle empty object data', () => {
      const sseEvent = sendSSEEvent('empty', {});

      expect(sseEvent).toContain('event: empty');
      expect(sseEvent).toContain('data: {}');
    });

    it('[P2] 0.4-UNIT-016: should handle array data', () => {
      const arrayData = [1, 2, 3, 'four', { five: 5 }];
      const sseEvent = sendSSEEvent('array', arrayData);

      expect(sseEvent).toContain('event: array');
      expect(sseEvent).toContain('data: [');
      expect(sseEvent).toContain('1');
      expect(sseEvent).toContain('2');
      expect(sseEvent).toContain('3');
    });
  });

  describe('SSE Event Format Compliance', () => {
    it('[P1] 0.4-UNIT-017: should follow SSE format specification', () => {
      const sseEvent = sendSSEEvent('test', { msg: 'hello' });

      // SSE spec: each line ends with \n, final blank line
      const lines = sseEvent.split('\n');
      expect(lines[0]).toBe('event: test');
      expect(lines[1]).toMatch(/^data: /);
      expect(lines[2]).toBe(''); // Empty line at end
    });

    it('[P2] 0.4-UNIT-018: should properly escape JSON in data field', () => {
      const dataWithQuotes = { text: 'He said "hello"' };
      const sseEvent = sendSSEEvent('quoted', dataWithQuotes);

      // JSON should be properly escaped
      expect(() => JSON.parse(sseEvent.split('\n')[1].substring(6))).not.toThrow();
    });
  });
});
