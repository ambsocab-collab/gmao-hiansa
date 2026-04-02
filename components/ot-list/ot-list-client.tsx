'use client'

/**
 * OTListClient Component
 * Story 3.4: Vista de Listado de OTs con Filtros y Paginación
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WorkOrder } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { AssignmentBadge } from '@/components/assignments/assignment-badge'
import { AssignmentModal } from '@/components/assignments/assignment-modal'
import { OTDetailsModal } from '@/components/kanban/ot-details-modal'
import { ViewToggle } from '@/components/kanban/view-toggle'
import { FilterBar } from '@/components/ot-list/filter-bar'
import { SortableHeader } from '@/components/ot-list/sortable-header'
import { BatchCheckbox, SelectAllCheckbox, BatchActionsBar, BatchAssignDialog, BatchStatusDialog, BatchCommentDialog } from '@/components/ot-list/batch-actions'
import { SSEConnectionIndicator } from '@/components/sse/sse-connection-indicator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Wrench, UserPlus, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortOrder = 'asc' | 'desc' | null

type WorkOrderWithRelations = WorkOrder & {
  equipo: {
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
  assignments: Array<{
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
  origin?: 'failure_report' | 'rutina' | null
  created_at: Date | null
  updated_at: Date | null
}

interface PaginationMetadata {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface FilterOption {
  id: string
  name: string
}

interface OTListClientProps {
  workOrders: WorkOrderWithRelations[]
  canAssignTechnicians: boolean
  pagination?: PaginationMetadata
  filterOptions?: {
    tecnicos: FilterOption[]
    equipos: FilterOption[]
  }
}

export function OTListClient({ workOrders, canAssignTechnicians, pagination, filterOptions }: OTListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderWithRelations | null>(null)
  const [assignmentModalWorkOrder, setAssignmentModalWorkOrder] = useState<WorkOrderWithRelations | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [batchAssignOpen, setBatchAssignOpen] = useState(false)
  const [batchStatusOpen, setBatchStatusOpen] = useState(false)
  const [batchCommentOpen, setBatchCommentOpen] = useState(false)

  const urlSortBy = searchParams.get('sortBy')
  const sortBy = urlSortBy === 'created_at' ? 'fecha' : urlSortBy
  const sortOrder = searchParams.get('sortOrder') as SortOrder | null

  const currentPage = pagination?.page || 1
  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || workOrders.length
  const pageSize = pagination?.pageSize || 100
  const hasNext = pagination?.hasNext || false
  const hasPrev = pagination?.hasPrev || false

  const allIds = workOrders.map(wo => wo.id)
  const selectedCount = selectedIds.size

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, workOrder: WorkOrderWithRelations) => {
    // Don't open modal if clicking on checkbox, button, or interactive elements
    const target = e.target as HTMLElement
    if (
      target.closest('[data-testid^="ot-checkbox-"]') ||
      target.closest('[role="checkbox"]') ||
      target.closest('button') ||
      target.closest('[data-testid="select-all-checkbox"]')
    ) {
      return
    }
    setSelectedWorkOrder(workOrder)
  }

  const handleAssignClick = (e: React.MouseEvent, workOrder: WorkOrderWithRelations) => {
    e.stopPropagation()
    setAssignmentModalWorkOrder(workOrder)
  }

  const handleAssignmentComplete = () => {
    setRefreshKey(prev => prev + 1)
    window.location.reload()
  }

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newIds = new Set(prev)
      if (newIds.has(id)) {
        newIds.delete(id)
      } else {
        newIds.add(id)
      }
      return newIds
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(allIds))
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
    setSelectedWorkOrder(null)
    setAssignmentModalWorkOrder(null)
    setBatchAssignOpen(false)
    setBatchStatusOpen(false)
    setBatchCommentOpen(false)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/ots/lista?${params.toString()}`)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return format(new Date(date), 'dd MMM yyyy', { locale: es })
  }

  const tipoColors: Record<string, { bg: string; text: string }> = {
    PREVENTIVO: { bg: 'bg-green-100', text: 'text-green-700' },
    CORRECTIVO: { bg: 'bg-red-100', text: 'text-red-700' },
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  const handleBatchAssignSuccess = () => {
    setSelectedIds(new Set())
    window.location.reload()
  }

  const handleBatchStatusSuccess = () => {
    setSelectedIds(new Set())
    window.location.reload()
  }

  const handleBatchCommentSuccess = () => {
    setSelectedIds(new Set())
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50" key={refreshKey}>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lista de Órdenes de Trabajo
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {total} órdenes de trabajo
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SSEConnectionIndicator channel="work-orders" />
            <ViewToggle currentView="list" />
          </div>
        </div>
      </div>

      <FilterBar
        tecnicoOptions={filterOptions?.tecnicos || []}
        equipoOptions={filterOptions?.equipos || []}
      />

      {selectedCount > 0 && (
        <BatchActionsBar
          selectedCount={selectedCount}
          onClearSelection={handleClearSelection}
          onBatchAssign={() => setBatchAssignOpen(true)}
          onBatchStatus={() => setBatchStatusOpen(true)}
          onBatchComment={() => setBatchCommentOpen(true)}
        />
      )}

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border shadow-sm" data-testid="ots-lista-tabla-container">
          <Table data-testid="ots-lista-tabla">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <SelectAllCheckbox
                    allIds={allIds}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onClearAll={handleClearSelection}
                  />
                </TableHead>
                <SortableHeader column="numero" label="Número" sortBy={sortBy} sortOrder={sortOrder} className="w-[100px]" />
                <SortableHeader column="equipo" label="Equipo" sortBy={sortBy} sortOrder={sortOrder} />
                <SortableHeader column="estado" label="Estado" sortBy={sortBy} sortOrder={sortOrder} className="w-[140px]" />
                <SortableHeader column="tipo" label="Tipo" sortBy={sortBy} sortOrder={sortOrder} className="w-[120px]" />
                <SortableHeader column="asignados" label="Asignados" sortBy={sortBy} sortOrder={sortOrder} className="w-[140px]" />
                <SortableHeader column="fecha" label="Fecha Creación" sortBy={sortBy} sortOrder={sortOrder} className="w-[120px]" />
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((wo) => {
                const tipoInfo = tipoColors[wo.tipo]
                const isSelected = selectedIds.has(wo.id)

                return (
                  <TableRow
                    key={wo.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-blue-50"
                    )}
                    onClick={(e) => handleRowClick(e, wo)}
                    data-testid={`ot-row-${wo.id}`}
                  >
                    <TableCell>
                      <BatchCheckbox
                        id={wo.id}
                        isSelected={isSelected}
                        onToggle={handleToggleSelection}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <span data-testid={`ot-numero-${wo.id}`}>
                        {wo.numero}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate" data-testid={`ot-equipo-${wo.id}`}>
                          {wo.equipo?.name || '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge estado={wo.estado} data-testid={`estado-badge-${wo.id}`} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${tipoInfo.bg} ${tipoInfo.text}`}
                        variant="outline"
                        data-testid={`ot-tipo-${wo.id}`}
                      >
                        {wo.tipo === 'PREVENTIVO' ? 'Preventivo' : 'Correctivo'}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid="asignaciones-column">
                      <AssignmentBadge
                        assignments={wo.assignments}
                        workOrderId={wo.id}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span data-testid={`ot-fecha-${wo.id}`}>
                          {formatDate(wo.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell data-testid="acciones-ot">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedWorkOrder(wo)
                          }}
                          data-testid="btn-ver-detalles"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canAssignTechnicians && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleAssignClick(e, wo)}
                            data-testid="btn-asignar"
                            title="Asignar técnicos"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4" data-testid="pagination-controls">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600" data-testid="pagination-info">
            Mostrando {startItem}-{endItem} de {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={!hasPrev}
              data-testid="btn-first-page"
              title="Primera página"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrev}
              data-testid="btn-prev-page"
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNext}
              data-testid="btn-next-page"
              title="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={!hasNext}
              data-testid="btn-last-page"
              title="Última página"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedWorkOrder && (
        <OTDetailsModal
          workOrder={selectedWorkOrder}
          open={!!selectedWorkOrder}
          onOpenChange={(open) => !open && setSelectedWorkOrder(null)}
        />
      )}

      {assignmentModalWorkOrder && (
        <AssignmentModal
          workOrder={assignmentModalWorkOrder}
          open={!!assignmentModalWorkOrder}
          onOpenChange={(open) => !open && setAssignmentModalWorkOrder(null)}
          onAssignmentComplete={handleAssignmentComplete}
        />
      )}

      <BatchAssignDialog
        open={batchAssignOpen}
        selectedIds={selectedIds}
        tecnicoOptions={filterOptions?.tecnicos || []}
        onSuccess={handleBatchAssignSuccess}
        onOpenChange={setBatchAssignOpen}
      />

      <BatchStatusDialog
        open={batchStatusOpen}
        selectedIds={selectedIds}
        onSuccess={handleBatchStatusSuccess}
        onOpenChange={setBatchStatusOpen}
      />

      <BatchCommentDialog
        open={batchCommentOpen}
        selectedIds={selectedIds}
        onSuccess={handleBatchCommentSuccess}
        onOpenChange={setBatchCommentOpen}
      />
    </div>
  )
}
