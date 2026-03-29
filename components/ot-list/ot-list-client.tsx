'use client'

/**
 * OTListClient Component
 * Story 3.3 AC4: Vista de listado de OTs
 *
 * Client Component que:
 * - Muestra tabla de OTs con columna de Asignaciones
 * - Incluye botón "Asignar" para usuarios con capability
 * - Modal de detalles al hacer click en fila
 * - Modal de asignación al hacer click en "Asignar"
 */

import { useState } from 'react'
import { WorkOrder, WorkOrderEstado, WorkOrderTipo } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DivisionTag } from '@/components/ui/division-tag'
import { AssignmentBadge } from '@/components/assignments/assignment-badge'
import { AssignmentModal } from '@/components/assignments/assignment-modal'
import { OTDetailsModal } from '@/components/kanban/ot-details-modal'
import { ViewToggle } from '@/components/kanban/view-toggle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Wrench, UserPlus, Eye } from 'lucide-react'

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
}

interface OTListClientProps {
  workOrders: WorkOrderWithRelations[]
  canAssignTechnicians: boolean
}

export function OTListClient({ workOrders, canAssignTechnicians }: OTListClientProps) {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderWithRelations | null>(null)
  const [assignmentModalWorkOrder, setAssignmentModalWorkOrder] = useState<WorkOrderWithRelations | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRowClick = (workOrder: WorkOrderWithRelations) => {
    setSelectedWorkOrder(workOrder)
  }

  const handleAssignClick = (e: React.MouseEvent, workOrder: WorkOrderWithRelations) => {
    e.stopPropagation()
    setAssignmentModalWorkOrder(workOrder)
  }

  const handleAssignmentComplete = () => {
    // Refresh the page to show updated assignments
    setRefreshKey(prev => prev + 1)
    window.location.reload()
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return format(new Date(date), 'dd MMM yyyy', { locale: es })
  }

  const tipoColors: Record<string, { bg: string; text: string }> = {
    PREVENTIVO: { bg: 'bg-green-100', text: 'text-green-700' },
    CORRECTIVO: { bg: 'bg-red-100', text: 'text-red-700' },
  }

  return (
    <div className="flex flex-col h-full bg-gray-50" key={refreshKey}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lista de Órdenes de Trabajo
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {workOrders.length} órdenes de trabajo
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ViewToggle currentView="list" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border shadow-sm">
          <Table data-testid="ot-list-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead className="w-[140px]">Estado</TableHead>
                <TableHead className="w-[150px]">Equipo</TableHead>
                <TableHead className="w-[100px]">División</TableHead>
                <TableHead className="w-[100px]">Fecha</TableHead>
                <TableHead className="w-[140px]">Asignaciones</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((wo) => {
                const tipoInfo = tipoColors[wo.tipo]

                return (
                  <TableRow
                    key={wo.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(wo)}
                    data-testid={`ot-card-${wo.id}`}
                  >
                    <TableCell className="font-medium">
                      <span data-testid={`ot-numero-${wo.id}`}>
                        {wo.numero}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-xs" data-testid={`ot-descripcion-${wo.id}`}>
                        {wo.descripcion}
                      </p>
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
                    <TableCell>
                      <StatusBadge estado={wo.estado} />
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
                      {wo.equipo?.linea?.planta?.division && (
                        <DivisionTag division={wo.equipo.linea.planta.division} />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span data-testid={`ot-fecha-${wo.id}`}>
                          {formatDate(wo.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell data-testid="asignaciones-column">
                      <AssignmentBadge
                        assignments={wo.assignments}
                        workOrderId={wo.id}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
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

      {/* Details Modal */}
      {selectedWorkOrder && (
        <OTDetailsModal
          workOrder={selectedWorkOrder}
          open={!!selectedWorkOrder}
          onOpenChange={(open) => !open && setSelectedWorkOrder(null)}
        />
      )}

      {/* Assignment Modal */}
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
