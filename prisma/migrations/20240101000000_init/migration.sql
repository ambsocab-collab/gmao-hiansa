-- CreateEnum
CREATE TYPE "Division" AS ENUM ('HIROCK', 'ULTRA');

-- CreateEnum
CREATE TYPE "EquipoEstado" AS ENUM ('OPERATIVO', 'AVERIADO', 'EN_REPARACION', 'RETIRADO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "WorkOrderTipo" AS ENUM ('PREVENTIVO', 'CORRECTIVO');

-- CreateEnum
CREATE TYPE "WorkOrderEstado" AS ENUM ('PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'PENDIENTE_REPUESTO', 'PENDIENTE_PARADA', 'REPARACION_EXTERNA', 'COMPLETADA', 'DESCARTADA');

-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('TECNICO', 'PROVEEDOR');

-- CreateEnum
CREATE TYPE "FailureReportEstado" AS ENUM ('RECIBIDO', 'AUTORIZADO', 'EN_PROGRESO', 'COMPLETADO', 'DESCARTADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "force_password_reset" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capabilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCapabilities" (
    "userId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userCapabilities_pkey" PRIMARY KEY ("userId","capabilityId")
);

-- CreateTable
CREATE TABLE "activityLogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activityLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditLogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_id" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userTags" (
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userTags_pkey" PRIMARY KEY ("userId","tagId")
);

-- CreateTable
CREATE TABLE "plantas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "division" "Division" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "planta_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lineas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "linea_id" TEXT NOT NULL,
    "estado" "EquipoEstado" NOT NULL DEFAULT 'OPERATIVO',
    "ubicacion_actual" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "componentes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "componentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipo_componentes" (
    "equipo_id" TEXT NOT NULL,
    "componente_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipo_componentes_pkey" PRIMARY KEY ("equipo_id","componente_id")
);

-- CreateTable
CREATE TABLE "repuestos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "componente_id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "ubicacion_fisica" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" "WorkOrderTipo" NOT NULL,
    "estado" "WorkOrderEstado" NOT NULL DEFAULT 'PENDIENTE',
    "descripcion" TEXT NOT NULL,
    "equipo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "failure_report_id" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workOrderAssignments" (
    "work_order_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AssignmentRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workOrderAssignments_pkey" PRIMARY KEY ("work_order_id","userId")
);

-- CreateTable
CREATE TABLE "failureReports" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto_url" TEXT,
    "equipo_id" TEXT NOT NULL,
    "estado" "FailureReportEstado" NOT NULL DEFAULT 'RECIBIDO',
    "reportado_por" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "failureReports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deleted_idx" ON "users"("deleted");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "capabilities_name_key" ON "capabilities"("name");

-- CreateIndex
CREATE INDEX "userCapabilities_userId_idx" ON "userCapabilities"("userId");

-- CreateIndex
CREATE INDEX "activityLogs_userId_timestamp_idx" ON "activityLogs"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "auditLogs_userId_timestamp_idx" ON "auditLogs"("userId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "userTags_userId_idx" ON "userTags"("userId");

-- CreateIndex
CREATE INDEX "userTags_tagId_idx" ON "userTags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "plantas_code_key" ON "plantas"("code");

-- CreateIndex
CREATE INDEX "plantas_code_idx" ON "plantas"("code");

-- CreateIndex
CREATE INDEX "lineas_planta_id_idx" ON "lineas"("planta_id");

-- CreateIndex
CREATE UNIQUE INDEX "lineas_planta_id_code_key" ON "lineas"("planta_id", "code");

-- CreateIndex
CREATE INDEX "equipos_linea_id_idx" ON "equipos"("linea_id");

-- CreateIndex
CREATE INDEX "equipos_name_idx" ON "equipos"("name");

-- CreateIndex
CREATE INDEX "equipos_linea_id_estado_idx" ON "equipos"("linea_id", "estado");

-- CreateIndex
CREATE INDEX "equipos_estado_idx" ON "equipos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "equipos_linea_id_code_key" ON "equipos"("linea_id", "code");

-- CreateIndex
CREATE INDEX "componentes_code_idx" ON "componentes"("code");

-- CreateIndex
CREATE INDEX "repuestos_componente_id_idx" ON "repuestos"("componente_id");

-- CreateIndex
CREATE INDEX "repuestos_code_idx" ON "repuestos"("code");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_numero_key" ON "work_orders"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_failure_report_id_key" ON "work_orders"("failure_report_id");

-- CreateIndex
CREATE INDEX "work_orders_equipo_id_idx" ON "work_orders"("equipo_id");

-- CreateIndex
CREATE INDEX "work_orders_numero_idx" ON "work_orders"("numero");

-- CreateIndex
CREATE INDEX "work_orders_estado_idx" ON "work_orders"("estado");

-- CreateIndex
CREATE INDEX "work_orders_equipo_id_estado_idx" ON "work_orders"("equipo_id", "estado");

-- CreateIndex
CREATE INDEX "work_orders_created_at_idx" ON "work_orders"("created_at");

-- CreateIndex
CREATE INDEX "workOrderAssignments_userId_idx" ON "workOrderAssignments"("userId");

-- CreateIndex
CREATE INDEX "workOrderAssignments_work_order_id_idx" ON "workOrderAssignments"("work_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "failureReports_numero_key" ON "failureReports"("numero");

-- CreateIndex
CREATE INDEX "failureReports_equipo_id_idx" ON "failureReports"("equipo_id");

-- CreateIndex
CREATE INDEX "failureReports_numero_idx" ON "failureReports"("numero");

-- CreateIndex
CREATE INDEX "failureReports_estado_idx" ON "failureReports"("estado");

-- CreateIndex
CREATE INDEX "failureReports_equipo_id_estado_idx" ON "failureReports"("equipo_id", "estado");

-- CreateIndex
CREATE INDEX "failureReports_reportado_por_idx" ON "failureReports"("reportado_por");

-- CreateIndex
CREATE INDEX "failureReports_created_at_idx" ON "failureReports"("created_at");

-- AddForeignKey
ALTER TABLE "userCapabilities" ADD CONSTRAINT "userCapabilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCapabilities" ADD CONSTRAINT "userCapabilities_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activityLogs" ADD CONSTRAINT "activityLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditLogs" ADD CONSTRAINT "auditLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTags" ADD CONSTRAINT "userTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTags" ADD CONSTRAINT "userTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineas" ADD CONSTRAINT "lineas_planta_id_fkey" FOREIGN KEY ("planta_id") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_linea_id_fkey" FOREIGN KEY ("linea_id") REFERENCES "lineas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo_componentes" ADD CONSTRAINT "equipo_componentes_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo_componentes" ADD CONSTRAINT "equipo_componentes_componente_id_fkey" FOREIGN KEY ("componente_id") REFERENCES "componentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repuestos" ADD CONSTRAINT "repuestos_componente_id_fkey" FOREIGN KEY ("componente_id") REFERENCES "componentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_failure_report_id_fkey" FOREIGN KEY ("failure_report_id") REFERENCES "failureReports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderAssignments" ADD CONSTRAINT "workOrderAssignments_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderAssignments" ADD CONSTRAINT "workOrderAssignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failureReports" ADD CONSTRAINT "failureReports_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failureReports" ADD CONSTRAINT "failureReports_reportado_por_fkey" FOREIGN KEY ("reportado_por") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

