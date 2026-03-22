/**
 * Server-Sent Events (SSE) Type Definitions
 *
 * This file contains all TypeScript types for the SSE infrastructure.
 * SSE is used instead of WebSockets for Vercel serverless compatibility.
 */

/**
 * Supported SSE channels for real-time updates
 * Each channel represents a different data domain
 */
export type SSEChannel = 'work-orders' | 'kpis' | 'stock'

/**
 * SSE event structure
 * Events are broadcast to subscribers on specific channels
 */
export interface SSEEvent {
  /** Event name in snake_case (e.g., 'work_order_updated', 'heartbeat') */
  name: string
  /** Event payload data in camelCase */
  data: Record<string, unknown>
  /** Unique event ID for replay buffer tracking */
  id?: string
}

/**
 * Subscriber function type
 * Called when an event is broadcast to a subscribed channel
 */
export type Subscriber = (event: SSEEvent) => void

/**
 * Work order update event payload
 * Sent when a work order is created, updated, or completed
 */
export interface WorkOrderUpdatedPayload {
  workOrderId: string
  numero: number
  estado: string
  updatedAt: string // ISO 8601 date string
}

/**
 * KPIs update event payload
 * Sent when KPIs are recalculated
 */
export interface KPIsUpdatedPayload {
  mttr: number // Mean Time To Repair (hours)
  mtbf: number // Mean Time Between Failures (hours)
  otsAbiertas: number
  disponibilidad: number // Percentage
  timestamp: string // ISO 8601 date string
}

/**
 * Failure report created event payload
 * Sent when a new avería is created by operario
 */
export interface FailureReportCreatedPayload {
  id: string
  numero: string // e.g., "AV-2026-001"
  descripcion: string
  equipoNombre: string
  equipoId: string
  reportadoPor: string
  createdAt: string // ISO 8601 date string
}

/**
 * Technician assigned event payload
 * Sent when a technician is assigned to a work order
 */
export interface TechnicianAssignedPayload {
  otNumero: string // e.g., "OT-2026-001"
  otId: string
  tecnicoId: string
  tecnicoNombre: string
  assignedAt: string // ISO 8601 date string
  estado: string // New state after assignment
}

/**
 * Heartbeat event payload
 * Sent every 30 seconds to keep connection alive
 */
export interface HeartbeatPayload {
  timestamp: number // Unix timestamp in milliseconds
  channel: SSEChannel
  correlationId: string // Unique ID for tracking
}

/**
 * SSE connection options for useSSEConnection hook
 */
export interface UseSSEConnectionOptions {
  channel: SSEChannel
  onMessage?: (message: SSEMessage) => void
  onError?: (error: Event) => void
  onOpen?: () => void
}

/**
 * SSE message received by client
 * Parsed event with type and data
 */
export interface SSEMessage {
  type: string
  data: unknown
}

/**
 * Event names for SSE events (snake_case)
 */
export const SSE_EVENT_NAMES = {
  HEARTBEAT: 'heartbeat',
  WORK_ORDER_UPDATED: 'work_order_updated',
  KPIS_UPDATED: 'kpis_updated',
  FAILURE_REPORT_CREATED: 'failure-report-created',
  TECHNICIAN_ASSIGNED: 'technician-assigned'
} as const

/**
 * Valid SSE channels
 */
export const SSE_CHANNELS: SSEChannel[] = ['work-orders', 'kpis', 'stock']
