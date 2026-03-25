'use client'

/**
 * MyWorkOrdersList - Client Component para Story 3.2
 *
 * Muestra lista de OTs asignadas al usuario actual (técnico).
 * Se suscribe a eventos SSE para actualizaciones en tiempo real.
 *
 * AC1: Vista de "Mis OTs" filtrada por asignaciones
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSSEConnection } from '@/components/sse/use-sse-connection'
import { MyOTCard } from './my-ot-card'
import { OTDetailsModal } from './ot-details-modal'
import type { WorkOrder } from '@prisma/client'

/**
 * Extended WorkOrder type with relations
 */
interface WorkOrderWithRelations extends WorkOrder {
  equipo: {
    id: string
    name: string
    linea?: {
      name: string
      planta?: {
        division: string
      }
    }
  }
  assignments: Array<{
    user: {
      id: string
      name: string
    }
  }>
  photos: Array<{
    id: string
    tipo: 'ANTES' | 'DESPUES'
    url: string
    created_at: Date
  }>
  comments: Array<{
    id: string
    texto: string
    created_at: Date
    user: {
      name: string
    }
  }>
  usedRepuestos: Array<{
    id: string
    cantidad: number
    repuesto: {
      name: string
    }
  }>
}

interface Repuesto {
  id: string
  name: string
  stock: number
  ubicacion_fisica: string | null
}

interface MyWorkOrdersListProps {
  initialWorkOrders: WorkOrderWithRelations[]
  allRepuestos?: Repuesto[]
}

/**
 * MyWorkOrdersList Component
 *
 * - Muestra lista de OT cards
 * - SSE subscription para actualizaciones
 * - Modal de detalles al hacer click
 */
export function MyWorkOrdersList({ initialWorkOrders, allRepuestos = [] }: MyWorkOrdersListProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrderWithRelations[]>(initialWorkOrders)
  const [selectedOT, setSelectedOT] = useState<WorkOrderWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * SSE Connection para real-time sync (R-002: <1s sync)
   *
   * Implementa optimistic updates para actualizar el state local sin recargar la página.
   * Esto mejora la experiencia de usuario y reduce la carga al servidor.
   */
  useSSEConnection({
    channel: 'work-orders',
    onMessage: (message) => {
      // Optimistic update: work_order_updated
      if (message.type === 'work_order_updated') {
        const data = message.data as { workOrderId: string; estado: string; updatedAt: string }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (ot.id === data.workOrderId) {
              return {
                ...ot,
                estado: data.estado as WorkOrderWithRelations['estado'],
                updated_at: new Date(data.updatedAt)
              }
            }
            return ot
          })
        )
      }

      // Optimistic update: work-order-comment-added
      if (message.type === 'work-order-comment-added') {
        const data = message.data as {
          workOrderId: string
          commentId: string
          texto: string
          createdAt: string
          userName: string
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (ot.id === data.workOrderId) {
              return {
                ...ot,
                comments: [
                  ...ot.comments,
                  {
                    id: data.commentId,
                    texto: data.texto,
                    created_at: new Date(data.createdAt),
                    user: { name: data.userName }
                  }
                ]
              }
            }
            return ot
          })
        )
      }

      // Optimistic update: work-order-photo-added
      if (message.type === 'work-order-photo-added') {
        const data = message.data as {
          workOrderId: string
          photoId: string
          tipo: 'ANTES' | 'DESPUES'
          url: string
          createdAt: string
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (ot.id === data.workOrderId) {
              return {
                ...ot,
                photos: [
                  ...ot.photos,
                  {
                    id: data.photoId,
                    tipo: data.tipo,
                    url: data.url,
                    created_at: new Date(data.createdAt)
                  }
                ]
              }
            }
            return ot
          })
        )
      }

      // Optimistic update: work-order-repuesto-added
      if (message.type === 'work-order-repuesto-added') {
        const data = message.data as {
          workOrderId: string
          usedRepuestoId: string
          repuestoNombre: string
          cantidad: number
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (ot.id === data.workOrderId) {
              return {
                ...ot,
                usedRepuestos: [
                  ...ot.usedRepuestos,
                  {
                    id: data.usedRepuestoId,
                    cantidad: data.cantidad,
                    repuesto: { name: data.repuestoNombre }
                  }
                ]
              }
            }
            return ot
          })
        )
      }
    }
  })

  /**
   * Maneja click en OT card → abrir modal
   */
  const handleOTClick = (ot: WorkOrderWithRelations) => {
    setSelectedOT(ot)
    setIsModalOpen(true)
  }

  /**
   * Cierra el modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOT(null)
  }

  /**
   * Empty state cuando no hay OTs asignadas
   */
  if (workOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No tienes OTs asignadas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cuando se te asignen órdenes de trabajo, aparecerán aquí.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Lista de OT cards */}
      <div
        className="space-y-3"
        data-testid="mis-ots-lista"
        role="list"
        aria-label="Mis Órdenes de Trabajo"
      >
        {workOrders.map((ot) => (
          <MyOTCard
            key={ot.id}
            ot={ot}
            onClick={() => handleOTClick(ot)}
          />
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedOT && (
        <OTDetailsModal
          ot={selectedOT}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          allRepuestos={allRepuestos}
        />
      )}
    </>
  )
}
