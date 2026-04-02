'use client'

/**
 * MyWorkOrdersList - Client Component para Story 3.2
 *
 * Muestra lista de OTs asignadas al usuario actual (técnico).
 * Se suscribe a eventos SSE para actualizaciones en tiempo real.
 *
 * AC1: Vista de "Mis OTs" filtrada por asignaciones
 */

import { useState } from 'react'
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
    id: string
    userId: string | null
    providerId: string | null
    user: {
      id: string
      name: string
    } | null
    provider: {
      id: string
      name: string
    } | null
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

interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface MyWorkOrdersListProps {
  initialWorkOrders: WorkOrderWithRelations[]
  initialPagination?: PaginationMetadata
  allRepuestos?: Repuesto[]
}

/**
 * MyWorkOrdersList Component
 *
 * - Muestra lista de OT cards
 * - SSE subscription para actualizaciones
 * - Modal de detalles al hacer click
 * - Paginación con navegación
 */
export function MyWorkOrdersList({
  initialWorkOrders,
  initialPagination,
  allRepuestos = []
}: MyWorkOrdersListProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrderWithRelations[]>(initialWorkOrders)
  const [selectedOT, setSelectedOT] = useState<WorkOrderWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Paginación: usar initialPagination si está disponible
  const [currentPage, setCurrentPage] = useState(initialPagination?.page || 1)
  const pagination = initialPagination || {
    page: 1,
    limit: 20,
    total: workOrders.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  }

  const router = useRouter()

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

      // Optimistic update: work_order_comment_added
      if (message.type === 'work_order_comment_added') {
        const data = message.data as {
          workOrderId?: string
          commentId: string
          texto: string
          createdAt: string
          userName: string
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (data.workOrderId === ot.id) {
              const updatedOt = {
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
              if (selectedOT?.id === ot.id) {
                setSelectedOT(updatedOt)
              }
              return updatedOt
            }
            return ot
          })
        )
      }

      // Optimistic update: work_order_photo_added
      if (message.type === 'work_order_photo_added') {
        const data = message.data as {
          workOrderId?: string
          photoId: string
          tipo: 'ANTES' | 'DESPUES'
          url: string
          createdAt: string
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (data.workOrderId === ot.id) {
              const updatedOt = {
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
              if (selectedOT?.id === ot.id) {
                setSelectedOT(updatedOt)
              }
              return updatedOt
            }
            return ot
          })
        )
      }

      // Optimistic update: work_order_repuesto_added
      if (message.type === 'work_order_repuesto_added') {
        const data = message.data as {
          workOrderId?: string
          usedRepuestoId: string
          repuestoNombre: string
          cantidad: number
        }
        setWorkOrders((prevOrders) =>
          prevOrders.map((ot) => {
            if (data.workOrderId === ot.id) {
              const updatedOt = {
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
              // Also update selectedOT if it's the same OT
              if (selectedOT?.id === ot.id) {
                setSelectedOT(updatedOt)
              }
              return updatedOt
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
   * Cambiar a la página anterior
   */
  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      // Update URL without full page reload
      router.push(`/mis-ots?page=${newPage}`)
    }
  }

  /**
   * Cambiar a la página siguiente
   */
  const handleNextPage = () => {
    if (pagination.hasNext) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      // Update URL without full page reload
      router.push(`/mis-ots?page=${newPage}`)
    }
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

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
          </div>

          <div className="flex gap-2">
            {/* Botón Previous */}
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              aria-label="Página anterior"
            >
              Anterior
            </button>

            {/* Page numbers (simplified) */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum)
                      router.push(`/mis-ots?page=${pageNum}`)
                    }}
                    disabled={pageNum === pagination.page}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={`Página ${pageNum}`}
                    aria-current={pageNum === pagination.page ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            {/* Botón Next */}
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

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
