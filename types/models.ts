// types/models.ts
// Domain model types - Re-exports from Prisma Client
// Story 0.2: Database Schema con Jerarquía 5 Niveles

import {
  User,
  Capability,
  UserCapability,
  Planta,
  Linea,
  Equipo,
  Componente,
  EquipoComponente,
  Repuesto,
  WorkOrder,
  WorkOrderAssignment,
  FailureReport,
  Division,
  WorkOrderTipo,
  WorkOrderEstado,
  EquipoEstado,
  AssignmentRole,
  FailureReportEstado,
  Provider,
} from '@prisma/client'

// Re-export all Prisma models for easy import
export type {
  User,
  Capability,
  UserCapability,
  Planta,
  Linea,
  Equipo,
  Componente,
  EquipoComponente,
  Repuesto,
  WorkOrder,
  WorkOrderAssignment,
  FailureReport,
  Division,
  WorkOrderTipo,
  WorkOrderEstado,
  EquipoEstado,
  AssignmentRole,
  FailureReportEstado,
  Provider,
}

// Legacy type aliases for backward compatibility with existing code
// TODO: Eventually migrate all code to use Prisma types directly

// Work Order status (8 states) - mapped to Prisma enum
export type WorkOrderStatus = WorkOrderEstado

// Work Order type - mapped to Prisma enum
export type WorkOrderType = WorkOrderTipo

// Asset hierarchy (5 levels)
export type AssetLevel = 'Planta' | 'Linea' | 'Equipo' | 'Componente' | 'Repuesto'

// Failure Report status - mapped to Prisma enum
export type FailureReportStatus = FailureReportEstado

// Division types - mapped to Prisma enum
export type DivisionType = Division

// User capabilities (15 granular capabilities) - use Prisma Capability model
// Capabilities are now stored in the database, not as a TypeScript enum
// To use: import { Capability } from '@prisma/client'

// Helper type for User with capabilities
export type UserWithCapabilities = User & {
  user_capabilities: Array<{
    capability: Capability
  }>
}

// Helper type for Equipo with full hierarchy
export type EquipoWithLinea = Equipo & {
  linea: Linea & {
    planta: Planta
  }
}

// Helper type for WorkOrder with assignments (Story 3.3: user ahora es opcional, provider added)
export type WorkOrderWithAssignments = WorkOrder & {
  assignments: Array<{
    user: User | null
    provider: Provider | null
  }>
  equipo: Equipo
}

// Helper type for FailureReport with reporter
export type FailureReportWithReporter = FailureReport & {
  reportadoPor: User // Named relation in schema
  equipo: Equipo
}
