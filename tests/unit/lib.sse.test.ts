/**
 * Unit Tests for lib/sse.ts
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Testing Server-Sent Events utilities
 */

import { describe, it, expect, vi } from 'vitest';
import { createSSEStream, sendSSEEvent } from '@/lib/sse';

describe('lib/sse - SSE Utilities', () => {
  describe('createSSEStream', () => {
    it('should create a ReadableStream', () => {
      const stream = createSSEStream();
      expect(stream).toBeDefined();
      expect(stream).toBeInstanceOf(ReadableStream);
    });

    it('should have readable stream properties', () => {
      const stream = createSSEStream();
      expect(stream).toHaveProperty('getReader');
      expect(stream).toHaveProperty('cancel');
      expect(typeof stream.getReader).toBe('function');
      expect(typeof stream.cancel).toBe('function');
    });

    it('should create independent streams', () => {
      const stream1 = createSSEStream();
      const stream2 = createSSEStream();

      expect(stream1).not.toBe(stream2);
    });

    it('should allow getting reader from stream', () => {
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
    it('should enqueue SSE event to controller', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const eventData = { test: 'data', id: 123 };
      sendSSEEvent(mockController as any, 'test_event', eventData);

      expect(mockController.enqueue).toHaveBeenCalledWith(
        expect.any(Uint8Array)
      );

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: test_event');
      expect(text).toContain('data: {"test":"data","id":123}');
    });

    it('should format event correctly', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const eventData = { message: 'Hello SSE' };
      sendSSEEvent(mockController as any, 'message', eventData);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      // SSE format: event: <type>\ndata: <json>\n\n
      expect(text).toMatch(/^event: message\n/);
      expect(text).toMatch(/data: \{.*\}\n\n$/);
    });

    it('should handle complex JSON data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const complexData = {
        user: { id: '123', name: 'Test User' },
        items: [1, 2, 3],
        nested: { a: { b: 'c' } }
      };

      sendSSEEvent(mockController as any, 'complex', complexData);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: complex');
      expect(text).toContain('data: {');
      expect(text).toContain('"user"');
      expect(text).toContain('"items"');
      expect(text).toContain('"nested"');
    });

    it('should handle string data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'simple', 'test string');

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: simple');
      expect(text).toContain('data: "test string"');
    });

    it('should handle numeric data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'number', 42);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: number');
      expect(text).toContain('data: 42');
    });

    it('should handle boolean data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'bool', true);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: bool');
      expect(text).toContain('data: true');
    });

    it('should handle null data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'null', null);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: null');
      expect(text).toContain('data: null');
    });
  });

  describe('SSE Integration', () => {
    it('should create stream and controller independently', () => {
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

    it('should handle Unicode characters in data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const unicodeData = {
        message: 'Hola Mundo 🌍',
        emoji: '🚀🔥💻',
        special: 'ñáéíóú'
      };

      sendSSEEvent(mockController as any, 'unicode', unicodeData);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('Hola Mundo 🌍');
      expect(text).toContain('🚀🔥💻');
      expect(text).toContain('ñáéíóú');
    });

    it('should handle event names with special characters', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'event-with-dash', { data: 1 });
      sendSSEEvent(mockController as any, 'event_with_underscore', { data: 2 });
      sendSSEEvent(mockController as any, 'event.with.dots', { data: 3 });

      expect(mockController.enqueue).toHaveBeenCalledTimes(3);
    });

    it('should handle empty object data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'empty', {});

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: empty');
      expect(text).toContain('data: {}');
    });

    it('should handle array data', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const arrayData = [1, 2, 3, 'four', { five: 5 }];

      sendSSEEvent(mockController as any, 'array', arrayData);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      expect(text).toContain('event: array');
      expect(text).toContain('data: [');
      expect(text).toContain('1');
      expect(text).toContain('2');
      expect(text).toContain('3');
    });
  });

  describe('SSE Event Format Compliance', () => {
    it('should follow SSE format specification', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      sendSSEEvent(mockController as any, 'test', { msg: 'hello' });

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      // SSE spec: each line ends with \n, final blank line
      const lines = text.split('\n');
      expect(lines[0]).toBe('event: test');
      expect(lines[1]).toMatch(/^data: /);
      expect(lines[2]).toBe(''); // Empty line at end
    });

    it('should properly escape JSON in data field', () => {
      const mockController = {
        enqueue: vi.fn()
      };

      const dataWithQuotes = { text: 'He said "hello"' };
      sendSSEEvent(mockController as any, 'quoted', dataWithQuotes);

      const enrolledData = mockController.enqueue.mock.calls[0][0];
      const decoder = new TextDecoder();
      const text = decoder.decode(enrolledData);

      // JSON should be properly escaped
      expect(() => JSON.parse(text.split('\n')[1].substring(6))).not.toThrow();
    });
  });
});
