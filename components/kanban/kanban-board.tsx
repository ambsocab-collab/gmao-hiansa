'use client'

/**
 * KanbanBoard Component
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Tablero Kanban principal con:
 * - 8 columnas configurables según estado OT
 * - Drag & drop entre columnas con @dnd-kit
 * - SSE real-time sync para actualizaciones
 * - Responsive: 8 columnas desktop, 2-3 tablet, 1 móvil
 * - Modal de detalles en móvil (AC6)
 * - Performance tracking (<1s para updates - NFR-S3)
 * - Modal de asignación (Story 3.3 AC8)
 */

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { WorkOrder, WorkOrderEstado } from '@prisma/client'
import { KanbanColumn } from './kanban-column'
import { OTDetailsModal } from './ot-details-modal'
import { AssignmentModal } from '@/components/assignments/assignment-modal'
import { ViewToggle } from './view-toggle'
import { updateWorkOrderStatus } from '@/app/actions/work-orders'
import { useSSEConnection } from '@/components/sse/use-sse-connection'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface KanbanBoardProps {
  initialWorkOrders: Array<WorkOrder & {
    equipo: {
      name: string
      linea: {
        planta: {
          division: string
        }
      }
    }
    assignments?: Array<{
      user: {
        name: string | null
      } | null
    }>
  }>
  canAssignTechnicians?: boolean // Story 3.3: Mostrar botón asignar
}

/**
 * 8 estados de WorkOrder ordenados para Kanban
 */
const KANBAN_COLUMNS: WorkOrderEstado[] = [
  'PENDIENTE',
  'ASIGNADA',
  'EN_PROGRESO',
  'PENDIENTE_REPUESTO',
  'PENDIENTE_PARADA',
  'REPARACION_EXTERNA',
  'COMPLETADA',
  'DESCARTADA',
]

export function KanbanBoard({ initialWorkOrders, canAssignTechnicians = false }: KanbanBoardProps) {
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState(initialWorkOrders)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder & {
    equipo?: {
      id: string
      name: string
      code: string
      linea?: {
        id: string
        name: string
        code: string
        planta?: {
          id: string
          name: string
          code: string
          division: string
        }
      }
    }
    assignments?: Array<{
      id: string
      role: string
      userId: string | null
      providerId: string | null
      user?: {
        id: string
        name: string
        email: string
      } | null
      provider?: {
        id: string
        name: string
      } | null
    }>
  } | null>(null)
  const [assignmentModalWorkOrder, setAssignmentModalWorkOrder] = useState<WorkOrder & {
    equipo?: {
      id: string
      name: string
      code: string
      linea?: {
        id: string
        name: string
        code: string
        planta?: {
          id: string
          name: string
          code: string
          division: string
        }
      }
    }
    assignments?: Array<{
      id: string
      role: string
      userId: string | null
      providerId: string | null
      user?: {
        id: string
        name: string
        email: string
      } | null
      provider?: {
        id: string
        name: string
      } | null
    }>
  } | null>(null)
  const [_refreshKey, setRefreshKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleColumnRange, setVisibleColumnRange] = useState({ start: 1, end: 8 })

  // Detectar vista móvil (<768px) para deshabilitar drag & drop
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout

    const checkMobile = () => {
      // Debounce: esperar 250ms después del último resize
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 250)
    }

    // Check inicial
    checkMobile()

    // Listener para resize
    window.addEventListener('resize', checkMobile)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Calcular columnas visibles basado en viewport (AC4)
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout

    const calculateVisibleColumns = () => {
      // Debounce: esperar 250ms después del último resize
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth

        if (width < 768) {
          // Mobile: 1 columna
          setVisibleColumnRange({ start: 1, end: 1 })
        } else if (width >= 768 && width < 1200) {
          // Tablet: 2 columnas visibles (aprox)
          setVisibleColumnRange({ start: 1, end: 2 })
        } else {
          // Desktop: todas las columnas
          setVisibleColumnRange({ start: 1, end: 8 })
        }
      }, 250)
    }

    calculateVisibleColumns()
    window.addEventListener('resize', calculateVisibleColumns)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', calculateVisibleColumns)
    }
  }, [])

  // Configurar sensores de drag & drop con opciones de touch y teclado
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimiento para iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {})
  )

  /**
   * Suscribir a eventos SSE para real-time sync (R-002: <30s)
   */
  useSSEConnection({
    channel: 'work-orders',
    onMessage: (message) => {
      if (message.type === 'work_order_updated') {
        // Refrescar datos cuando se actualiza una OT
        router.refresh()
      }
    }
  })

  /**
   * Agrupar OTs por estado
   */
  const workOrdersByEstado = KANBAN_COLUMNS.reduce((acc, estado) => {
    acc[estado] = workOrders.filter(wo => wo.estado === estado)
    return acc
  }, {} as Record<WorkOrderEstado, typeof initialWorkOrders>)

  /**
   * Handle drag end - mover OT entre columnas
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    // Si no hay drop target, cancelar
    if (!over) {
      return
    }

    // Si se dropped en la misma columna, cancelar
    if (active.id === over.id) {
      return
    }

    const workOrderId = active.id as string
    const nuevoEstado = over.id as WorkOrderEstado

    // Encontrar OT actual
    const otActual = workOrders.find(wo => wo.id === workOrderId)
    if (!otActual) {
      return
    }

    // Si el estado no cambió, cancelar
    if (otActual.estado === nuevoEstado) {
      return
    }

    // Update optimista (UI inmediata)
    const prevWorkOrders = [...workOrders]
    setWorkOrders(prev =>
      prev.map(wo =>
        wo.id === workOrderId
          ? { ...wo, estado: nuevoEstado }
          : wo
      )
    )

    try {
      setIsUpdating(true)

      // Llamar Server Action para actualizar estado
      await updateWorkOrderStatus(workOrderId, nuevoEstado)

      toast.success(`OT ${otActual.numero} movida a ${nuevoEstado}`)

      // Router refresh para actualizar Server Components
      router.refresh()
    } catch (error) {
      // Revertir en caso de error
      setWorkOrders(prevWorkOrders)

      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar OT'
      toast.error(errorMessage)

      console.error('[KanbanBoard] Error al actualizar estado:', {
        workOrderId,
        nuevoEstado,
        error
      })
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle click en OT card - abrir modal en móvil
   */
  const handleOTCardClick = (workOrder: WorkOrder & {
    equipo?: {
      name: string
      linea?: {
        planta: {
          division: string
        }
      }
    }
    assignments?: Array<{
      user: {
        name: string | null
      } | null
    }>
  }) => {
    // Convertir WorkOrder al formato esperado por el modal
    const modalWorkOrder = workOrder as WorkOrder & {
      equipo?: {
        id: string
        name: string
        code: string
        linea?: {
          id: string
          name: string
          code: string
          planta?: {
            id: string
            name: string
            code: string
            division: string
          }
        }
      }
      assignments?: Array<{
        id: string
        role: string
        userId: string | null
        providerId: string | null
        user?: {
          id: string
          name: string
          email: string
        } | null
        provider?: {
          id: string
          name: string
        } | null
      }>
    }

    setSelectedWorkOrder(modalWorkOrder)
  }

  /**
   * Handle click en botón Asignar - abrir modal de asignación
   */
  const handleAssignClick = (workOrder: WorkOrder & {
    equipo?: {
      name: string
      linea?: {
        planta: {
          division: string
        }
      }
    }
    assignments?: Array<{
      user: {
        name: string | null
      } | null
    }>
  }) => {
    const modalWorkOrder = workOrder as WorkOrder & {
      equipo?: {
        id: string
        name: string
        code: string
        linea?: {
          id: string
          name: string
          code: string
          planta?: {
            id: string
            name: string
            code: string
            division: string
          }
        }
      }
      assignments?: Array<{
        id: string
        role: string
        userId: string | null
        providerId: string | null
        user?: {
          id: string
          name: string
          email: string
        } | null
        provider?: {
          id: string
          name: string
        } | null
      }>
    }
    setAssignmentModalWorkOrder(modalWorkOrder)
  }

  /**
   * Handle assignment complete - refresh the page
   */
  const handleAssignmentComplete = () => {
    setRefreshKey(prev => prev + 1)
    router.refresh()
  }

  return (
    <div className="h-full flex flex-col bg-gray-50" data-testid="ot-kanban-board">
      {/* Header del Kanban */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Tablero Kanban
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isMobile
                ? 'Toca una tarjeta para ver detalles y acciones'
                : 'Arrastra las tarjetas para mover OTs entre columnas'
              }
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle Vista Kanban ↔ Listado (AC8) */}
            <ViewToggle currentView="kanban" />

            {/* Indicador de columnas visibles (AC4) - solo tablet/mobile */}
            <div className="hidden md:flex lg:hidden text-sm text-gray-600">
              {visibleColumnRange.start}-{visibleColumnRange.end} de {KANBAN_COLUMNS.length}
            </div>

            {/* Contador total de OTs */}
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{workOrders.length}</span> OTs
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isUpdating && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span>Actualizando...</span>
          </div>
        )}
      </div>

      {/* Kanban Board - Responsive Design */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* Desktop: 8 columnas visibles */}
          <div className="hidden lg:flex gap-4 p-6 min-h-full">
            {KANBAN_COLUMNS.map((estado) => (
              <KanbanColumn
                key={estado}
                estado={estado}
                workOrders={workOrdersByEstado[estado] || []}
                onOTCardClick={handleOTCardClick}
                onAssignClick={handleAssignClick}
                canAssign={canAssignTechnicians}
                disableDrag={isMobile}
                compactCards={false}
              />
            ))}
          </div>

          {/* Tablet: 2-3 columnas con swipe horizontal */}
          <div className="hidden md:flex lg:hidden gap-4 p-6 overflow-x-auto snap-x snap-mandatory">
            {KANBAN_COLUMNS.map((estado) => (
              <KanbanColumn
                key={estado}
                estado={estado}
                workOrders={workOrdersByEstado[estado] || []}
                onOTCardClick={handleOTCardClick}
                onAssignClick={handleAssignClick}
                canAssign={canAssignTechnicians}
                disableDrag={isMobile}
                compactCards={false}
              />
            ))}
          </div>

          {/* Mobile: 1 columna con swipe, cards simplificadas */}
          <div className="flex md:hidden gap-4 p-4 overflow-x-auto snap-x snap-mandatory">
            {KANBAN_COLUMNS.map((estado) => (
              <KanbanColumn
                key={estado}
                estado={estado}
                workOrders={workOrdersByEstado[estado] || []}
                onOTCardClick={handleOTCardClick}
                onAssignClick={handleAssignClick}
                canAssign={canAssignTechnicians}
                disableDrag={true} // No drag & drop en móvil
                compactCards={true} // Cards simplificadas
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Modal de detalles para móvil (AC6) */}
      {selectedWorkOrder && (
        <OTDetailsModal
          workOrder={selectedWorkOrder}
          open={!!selectedWorkOrder}
          onOpenChange={(open) => !open && setSelectedWorkOrder(null)}
        />
      )}

      {/* Modal de asignación (Story 3.3 AC8) */}
      {assignmentModalWorkOrder && (
        <AssignmentModal
          workOrder={assignmentModalWorkOrder}
          open={!!assignmentModalWorkOrder}
          onOpenChange={(open) => !open && setAssignmentModalWorkOrder(null)}
          onAssignmentComplete={handleAssignmentComplete}
        />
      )}
    </div>
  )
}
