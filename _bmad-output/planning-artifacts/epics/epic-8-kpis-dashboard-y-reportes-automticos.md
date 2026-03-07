# Epic 8: KPIs, Dashboard y Reportes Automáticos

Permitir a Elena (Jefe de Mantenimiento) y todos los usuarios acceder a un dashboard común con KPIs en tiempo real (MTTR, MTBF), navegación drill-down por jerarquía de activos, alertas accionables, exportación a Excel y reportes automáticos en PDF enviados por email.

**Actor Principal:** Elena (Jefe de Mantenimiento, capability `can_view_kpis`)
**Actores Secundarios:** Todos los usuarios (dashboard común), Pedro (Stock, `can_manage_stock`), María (Técnica)

**FRs Cubiertas:** FR85, FR86, FR87, FR87-A, FR88, FR89, FR90, FR90-A, FR90-B, FR90-C, FR90-D, FR90-E, FR91, FR91-A, FR104 (15 FRs)

**Dependencias:**
- Depende de: Epic 1 (Usuarios y Roles), Epic 2 (Assets - Jerarquía), Epic 3 (Avisos), Epic 4 (OTs), Epic 5 (Stock), Epic 7 (Rutinas)
- Es prerequisito de: Epic 10 (Funcionalidades Avanzadas - optimizaciones basadas en KPIs)

---

## Story 8.1: Dashboard Común para Todos los Usuarios

**Como** Usuario del sistema (cualquier rol),
**quiero** ver un dashboard común con KPIs básicos de la planta al hacer login,
**para** tener visibilidad inmediata del estado de mantenimiento y los módulos accesibles según mis capacidades.

**Acceptance Criteria - Dashboard al Login:**

**Given** que estoy logueado en el sistema (cualquier usuario con cualquier rol)
**When** accedo a la ruta `/` o hago login
**Then** veo el dashboard común con la siguiente estructura:

```tsx
// Page Layout: / (Dashboard Común)
<PageLayout title="Dashboard de Mantenimiento">
  {/* FR91, FR91-A: KPIs Básicos - Visibles para TODOS */}
  <KPICardsRow>
    <KPICard
      title="MTTR (Tiempo Medio de Reparación)"
      value={mttrActual}
      unit="horas"
      trend={mttrTrend}
      lastUpdated={ultimaActualizacion}
      format="decimal"
      description="Tiempo promedio para reparar averías"
      href={canViewKPIs ? "/dashboard/kpis/mttr" : undefined}
      drilldownable={canViewKPIs}
    />
    <KPICard
      title="MTBF (Tiempo Medio Entre Fallos)"
      value={mtbfActual}
      unit="horas"
      trend={mtbfTrend}
      lastUpdated={ultimaActualizacion}
      format="decimal"
      description="Tiempo promedio entre averías"
      href={canViewKPIs ? "/dashboard/kpis/mtbf" : undefined}
      drilldownable={canViewKPIs}
    />
    <KPICard
      title="OTs Abiertas"
      value={otsAbiertas}
      trend={otsAbiertasTrend}
      format="number"
      description="Órdenes de trabajo pendientes"
      href={canViewAllOTs ? "/ordenes-trabajo?estado=abierta" : undefined}
    />
    <KPICard
      title="Stock Crítico"
      value={stockCriticoCount}
      format="number"
      status={stockCriticoCount > 0 ? 'warning' : 'success'}
      description="Repuestos bajo stock mínimo"
      href={canManageStock ? "/repuestos?stock=critico" : undefined}
    />
  </KPICardsRow>

  {/* FR91: Accesos a Módulos según Capacidades */}
  <Section title="Accesos Rápidos">
    <ModuleGrid>
      {canCreateFailureReport && (
        <ModuleCard
          title="Reportar Avería"
          description="Crear nuevo aviso de avería en 30 segundos"
          icon="warning"
          href="/avisos/nuevo"
          color="red"
        />
      )}
      {canViewAssignedOTs && (
        <ModuleCard
          title="Mis OTs"
          description="Ver mis órdenes de trabajo asignadas"
          icon="clipboard"
          href="/ordenes-trabajo?asignadas=me"
          color="blue"
        />
      )}
      {canViewAllOTs && (
        <ModuleCard
          title="Ver Kanban"
          description="Ver tablero Kanban de OTs"
          icon="columns"
          href="/ordenes-trabajo/kanban"
          color="purple"
        />
      )}
      {canManageStock && (
        <ModuleCard
          title="Gestionar Stock"
          description="Ver stock de repuestos y ajustes"
          icon="box"
          href="/repuestos"
          color="orange"
        />
      )}
      {canManageRoutines && (
        <ModuleCard
          title="Rutinas"
          description="Configurar rutinas de mantenimiento"
          icon="calendar"
          href="/rutinas"
          color="green"
        />
      )}
      {canViewKPIs && (
        <ModuleCard
          title="Análisis Avanzado"
          description="Ver KPIs con drill-down completo"
          icon="chart-line"
          href="/dashboard/kpis"
          color="indigo"
        />
      )}
    </ModuleGrid>
  </Section>

  {/* FR87-A: Drill-down solo para usuarios con can_view_kpis */}
  {canViewKPIs && (
    <Section title="Análisis por Jerarquía">
      <HierarchicalDrillDown
        levels={['GLOBAL', 'PLANTA', 'LINEA', 'EQUIPO']}
        onLevelChange={handleLevelChange}
        currentLevel={currentLevel}
        currentEntity={currentEntity}
      />
    </Section>
  )}
</PageLayout>
```

**Acceptance Criteria - KPIs Visibles para Todos:**

**Given** que soy Carlos (Operario, solo tiene `can_create_failure_report`)
**When** accedo al dashboard
**Then** veo los 4 KPIs básicos:
1. MTTR: 8.5 horas ↑ 5% (solo lectura, sin drill-down)
2. MTBF: 120 horas ↓ 3% (solo lectura, sin drill-down)
3. OTs Abiertas: 15 (solo lectura)
4. Stock Crítico: 3 (solo lectura)

**And** solo veo módulos accesibles según mis capacidades:
- ✅ "Reportar Avería" (tengo `can_create_failure_report`)
- ✅ "Mis OTs" (tengo `can_view_assigned_ots`)
- ❌ "Ver Kanban" (no tengo `can_view_all_ots`)
- ❌ "Gestionar Stock" (no tengo `can_manage_stock`)
- ❌ "Rutinas" (no tengo `can_manage_routines`)
- ❌ "Análisis Avanzado" (no tengo `can_view_kpis`)

**Given** que soy Elena (Jefe de Mantenimiento, tiene `can_view_kpis`)
**When** accedo al dashboard
**Then** veo los mismos 4 KPIs básicos PERO con drill-down habilitado
**And** al hacer clic en un KPI, navego a `/dashboard/kpis/{kpi}` con análisis detallado
**And** veo sección de "Análisis por Jerarquía" con selector de niveles

**Acceptance Criteria - Cálculo de MTTR:**

**Given** que el sistema calcula MTTR (FR85)
**When** ejecuta el cálculo
**Then** usa la siguiente fórmula:

```typescript
// Cálculo de MTTR (Mean Time To Repair)
async function calcularMTTR(filtros?: FiltrosKPI): Promise<number> {
  // MTTR = Sum(Tiempo de Reparación) / Número de Averías Reparadas
  // Tiempo de Reparación = fechaCompletacion - fechaCreacion de la OT

  const otsCompletadas = await prisma.ordenTrabajo.findMany({
    where: {
      estado: 'COMPLETADA',
      fechaCompletacion: { not: null },
      tipo: 'CORRECTIVO', // Solo averías correctivas
      ...filtros // Filtros opcionales por planta, línea, equipo
    },
    select: {
      fechaCreacion: true,
      fechaCompletacion: true
    }
  });

  if (otsCompletadas.length === 0) return 0;

  const totalHorasReparacion = otsCompletadas.reduce((sum, ot) => {
    const horas = differenceInHours(ot.fechaCompletacion, ot.fechaCreacion);
    return sum + horas;
  }, 0);

  return totalHorasReparacion / otsCompletadas.length;
}

// Actualizar cada 30 segundos (FR85, FR86)
setInterval(async () => {
  const mttr = await calcularMTTR();
  const mtbf = await calcularMTBF();

  // Guardar en cache (Redis/Upstash)
  await cache.set('kpi:mttr', mttr, { ex: 30 }); // Expira en 30s
  await cache.set('kpi:mtbf', mtbf, { ex: 30 });
}, 30000); // Ejecutar cada 30 segundos
```

**Acceptance Criteria - Cálculo de MTBF:**

**Given** que el sistema calcula MTBF (FR86)
**When** ejecuta el cálculo
**Then** usa la siguiente fórmula:

```typescript
// Cálculo de MTBF (Mean Time Between Failures)
async function calcularMTBF(filtros?: FiltrosKPI): Promise<number> {
  // MTBF = Tiempo Total de Operación / Número de Averías
  // Tiempo Total de Operación = Sum(tiempo entre averías consecutivas)

  // 1. Obtener todas las averías (OTs correctivas completadas) ordenadas por fecha
  const averias = await prisma.ordenTrabajo.findMany({
    where: {
      tipo: 'CORRECTIVO',
      estado: 'COMPLETADA',
      fechaCreacion: { not: null }
    },
    orderBy: { fechaCreacion: 'asc' },
    select: {
      id: true,
      fechaCreacion: true,
      equipoId: true
    },
    ...filtros
  });

  if (averias.length < 2) return 0; // Necesitamos al menos 2 averías

  // 2. Calcular tiempo entre averías consecutivas
  let totalHorasEntreFallas = 0;

  for (let i = 1; i < averias.length; i++) {
    const tiempoEntreFallas = differenceInHours(
      averias[i].fechaCreacion,
      averias[i-1].fechaCreacion
    );
    totalHorasEntreFallas += tiempoEntreFallas;
  }

  // 3. MTBF = Total Horas / (Número de Averías - 1)
  return totalHorasEntreFallas / (averias.length - 1);
}
```

**Acceptance Criteria - Métricas Adicionales (FR88):**

**Given** que el dashboard carga las métricas adicionales
**When** ejecuta las consultas
**Then** calcula:

```typescript
// Métricas Adicionales (FR88)
const metricasAdicionales = {
  // OTs Abiertas
  otsAbiertas: await prisma.ordenTrabajo.count({
    where: {
      estado: { in: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO'] }
    }
  }),

  // OTs Completadas (últimas 24h)
  otsCompletadas: await prisma.ordenTrabajo.count({
    where: {
      estado: 'COMPLETADA',
      fechaCompletacion: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  }),

  // Técnicos Activos (con OTs en progreso)
  tecnicosActivos: await prisma.ordenTrabajo.groupBy({
    by: ['tecnicoAsignadoId'],
    where: {
      estado: 'EN_PROGRESO',
      tecnicoAsignadoId: { not: null }
    }
  }).then(groups => groups.length),

  // Stock Crítico (FR88)
  stockCritico: await prisma.repuesto.count({
    where: {
      stockActual: { lte: prisma.repuesto.fields.stockMinimo }
    }
  })
};
```

**Validaciones de Performance:**

**Given** que el dashboard tiene que cargar KPIs
**When** el usuario accede a `/`
**Then** el tiempo de carga inicial es < 1 segundo
**And** los KPIs se actualizan cada 30 segundos vía SSE (sin recargar página)

**Consideraciones de Cache:**

- MTTR y MTBF se cachean por 30 segundos (Redis/Upstash)
- Las métricas adicionales (OTs abiertas, stock crítico) se calculan en tiempo real
- Usar Server-Sent Events (SSE) para actualizar KPIs sin refrescar

---

## Story 8.2: Drill-down Multi-Nivel de KPIs

**Como** Elena (Jefe de Mantenimiento con capability `can_view_kpis`),
**quiero** navegar los KPIs con drill-down por jerarquía de activos (Global → Planta → Línea → Equipo),
**para** identificar cuellos de botella y equipos problemáticos que degradan los KPIs globales.

**Acceptance Criteria - Navegación Drill-down:**

**Given** que estoy en `/dashboard/kpis/mttr` (vista detallada de MTTR)
**When** la página carga
**Then** veo una interfaz de drill-down con 4 niveles:

```tsx
// Page Layout: /dashboard/kpis/mttr
<PageLayout title="MTTR - Análisis Detallado">
  {/* Breadcrumb de Jerarquía */}
  <HierarchyBreadcrumb
    levels={[
      { label: 'Global', value: 'GLOBAL', href: '/dashboard/kpis/mttr?level=GLOBAL' },
      currentLevel === 'PLANTA' && { label: plantaSeleccionada?.nombre, value: 'PLANTA', href: `/dashboard/kpis/mttr?level=PLANTA&id=${plantaId}` },
      currentLevel === 'LINEA' && { label: lineaSeleccionada?.nombre, value: 'LINEA', href: `/dashboard/kpis/mttr?level=LINEA&id=${lineaId}` },
      currentLevel === 'EQUIPO' && { label: equipoSeleccionada?.nombre, value: 'EQUIPO' }
    ].filter(Boolean)}
  />

  {/* Selector de Nivel Actual */}
  <LevelSelector
    currentLevel={currentLevel}
    onSelect={handleLevelSelect}
    options={[
      { value: 'GLOBAL', label: 'Global (Todas las Plantas)' },
      { value: 'PLANTA', label: 'Por Planta' },
      { value: 'LINEA', label: 'Por Línea' },
      { value: 'EQUIPO', label: 'Por Equipo' }
    ]}
  />

  {/* KPI Principal */}
  <KPICard
    title={`MTTR - ${getLevelLabel(currentLevel, currentEntity)}`}
    value={mttrActual}
    unit="horas"
    trend={mttrTrend}
    format="decimal"
    lastUpdated={ultimaActualizacion}
  />

  {/* Desglose según nivel */}
  {currentLevel === 'GLOBAL' && (
    <PlantasTable
      title="MTTR por Planta"
      data={mttrPorPlanta}
      columns={[
        { key: 'planta', label: 'Planta', sortable: true },
        {
          key: 'mttr',
          label: 'MTTR (horas)',
          render: (row) => (
            <MTTRBar value={row.mttr} average={mttrGlobal} />
          )
        },
        { key: 'otsCompletadas', label: 'OTs Completadas' },
        {
          key: 'acciones',
          label: 'Drill-down',
          render: (row) => (
            <Button onClick={() => router.push(`/dashboard/kpis/mttr?level=PLANTA&id=${row.id}`)}>
              Ver Líneas →
            </Button>
          )
        }
      ]}
    />
  )}

  {currentLevel === 'PLANTA' && (
    <LineasTable
      title={`MTTR por Línea - ${plantaSeleccionada.nombre}`}
      data={mttrPorLinea}
      columns={[
        { key: 'linea', label: 'Línea', sortable: true },
        {
          key: 'mttr',
          label: 'MTTR (horas)',
          render: (row) => (
            <MTTRBar value={row.mttr} average={mttrPlanta} />
          )
        },
        { key: 'otsCompletadas', label: 'OTs Completadas' },
        {
          key: 'acciones',
          label: 'Drill-down',
          render: (row) => (
            <Button onClick={() => router.push(`/dashboard/kpis/mttr?level=LINEA&id=${row.id}`)}>
              Ver Equipos →
            </Button>
          )
        }
      ]}
    />
  )}

  {currentLevel === 'LINEA' && (
    <EquiposTable
      title={`MTTR por Equipo - ${lineaSeleccionada.nombre}`}
      data={mttrPorEquipo}
      columns={[
        { key: 'equipo', label: 'Equipo', sortable: true },
        {
          key: 'mttr',
          label: 'MTTR (horas)',
          render: (row) => (
            <MTTRBar value={row.mttr} average={mttrLinea} highlight={row.mttr > mttrLinea * 1.5} />
          )
        },
        { key: 'otsCompletadas', label: 'OTs Completadas' },
        { key: 'ultimaAveria', label: 'Última Avería', format: 'datetime' },
        {
          key: 'acciones',
          label: 'Acciones',
          render: (row) => (
            <>
              <Button onClick={() => router.push(`/equipos/${row.id}`)}>
                Ver Equipo
              </Button>
              <Button onClick={() => router.push(`/ordenes-trabajo?equipo=${row.id}`)}>
                Ver OTs
              </Button>
            </>
          )
        }
      ]}
    />
  )}

  {currentLevel === 'EQUIPO' && (
    <EquipoDetailView
      equipo={equipoSeleccionado}
      mttr={mttrEquipo}
      mtbf={mtbfEquipo}
      otsHistoricas={otsEquipo}
    />
  )}
</PageLayout>
```

**Acceptance Criteria - Flujo de Navegación:**

**Given** que estoy en nivel GLOBAL
**When** la tabla de plantas carga
**Then** veo filas ordenadas por MTTR (peores primero):

| Planta | MTTR (horas) | OTs Completadas | Acciones |
|--------|--------------|-----------------|----------|
| Planta Madrid | ████░░░░ 12.5 | 45 | Ver Líneas → |
| Planta Barcelona | ███░░░░░ 9.8 | 32 | Ver Líneas → |
| Planta Valencia | ██░░░░░░ 7.2 | 28 | Ver Líneas → |

**Given** que hago clic en "Ver Líneas" de Planta Madrid (MTTR 12.5h)
**When** navego a nivel PLANTA
**Then** veo desglose por líneas de esa planta:

| Línea | MTTR (horas) | OTs Completadas | Acciones |
|-------|--------------|-----------------|----------|
| Línea Ensamblaje-1 | ██████░░ 15.2 | 18 | Ver Equipos → |
| Línea Pintura-2 | ████░░░░ 11.8 | 14 | Ver Equipos → |
| Línea Empaque-3 | ██░░░░░░ 6.5 | 13 | Ver Equipos → |

**Given** que identifico que Línea Ensamblaje-1 tiene el MTTR más alto (15.2h)
**When** hago clic en "Ver Equipos"
**Then** veo desglose por equipos:

| Equipo | MTTR (horas) | OTs Completadas | Última Avería | Acciones |
|--------|--------------|-----------------|---------------|----------|
| **Prensa Hidráulica-01** | ████████░ 22.5 | 8 | 2026-03-05 | Ver Equipo |
| Robot Soldadura-03 | ████░░░░ 12.0 | 6 | 2026-03-06 | Ver Equipo |
| Transportadora-02 | ██░░░░░░ 5.5 | 4 | 2026-03-07 | Ver Equipo |

**Given** que identifico que Prensa Hidráulica-01 tiene MTTR 22.5h (muy alto)
**When** hago clic en "Ver Equipo"
**Then** navego a vista detallada del equipo con:
- Historial de averías
- Análisis de causas raíz
- Recomendaciones de acción

**Acceptance Criteria - Cálculo de MTTR por Nivel:**

**Given** que estoy en nivel EQUIPO
**When** el sistema calcula MTTR para un equipo específico
**Then** filtra OTs por `equipoId`:

```typescript
async function calcularMTTRPorNivel(
  nivel: 'GLOBAL' | 'PLANTA' | 'LINEA' | 'EQUIPO',
  entityId?: string
): Promise<{ mttr: number; otsCount: number }> {

  const whereClause = {
    estado: 'COMPLETADA',
    fechaCompletacion: { not: null },
    tipo: 'CORRECTIVO',
    ...(nivel === 'EQUIPO' && { equipoId: entityId }),
    ...(nivel === 'LINEA' && {
      equipo: {
        lineaId: entityId
      }
    }),
    ...(nivel === 'PLANTA' && {
      equipo: {
        linea: {
          plantaId: entityId
        }
      }
    })
    // GLOBAL no tiene filtro
  };

  const ots = await prisma.ordenTrabajo.findMany({
    where: whereClause,
    select: {
      fechaCreacion: true,
      fechaCompletacion: true
    }
  });

  if (ots.length === 0) return { mttr: 0, otsCount: 0 };

  const totalHoras = ots.reduce((sum, ot) => {
    return sum + differenceInHours(ot.fechaCompletacion, ot.fechaCreacion);
  }, 0);

  return {
    mttr: totalHoras / ots.length,
    otsCount: ots.length
  };
}
```

**Validaciones de UX:**

- Breadcrumb navegable para volver a niveles anteriores
- Tablas ordenables por cualquier columna
- Highlight en filas con KPI > 150% del promedio (indicador de problema)
- Click en nombre de equipo abre sidebar con detalles rápidos

---

## Story 8.3: Alertas Accionables en Tiempo Real

**Como** Elena (Jefe de Mantenimiento con capability `can_view_kpis`),
**quiero** recibir alertas automáticas en tiempo real cuando se detecten anomalías (stock mínimo, MTFR alto, rutinas no completadas),
**para** tomar acciones correctivas inmediatas y evitar degradaciones en los KPIs.

**Acceptance Criteria - Tipos de Alertas (FR89):**

**Given** que estoy logueado como usuario con capabilities necesarias
**When** se generan alertas
**Then** el sistema envía 3 tipos de alertas:

1. **Alerta de Stock Mínimo** (requiere `can_manage_stock`):
   - Se activa cuando `repuesto.stockActual <= repuesto.stockMinimo`
   - Se envía a Pedro (Stock Manager) y Elena (Jefe Mantenimiento)

2. **Alerta de MTFR Alto** (Mean Time To Fix Response):
   - MTFR = Tiempo desde aviso de avería hasta que OT pasa a EN_PROGRESO
   - Se activa cuando MTFR > 150% del promedio de los últimos 30 días
   - Se envía a Elena (Jefe Mantenimiento) y Javier (Triage)

3. **Alerta de Rutinas No Completadas**:
   - Se activa cuando una OT preventiva generada desde rutina vence sin completarse
   - Se envía al técnico asignado y Elena (Jefe Mantenimiento)

**Acceptance Criteria - Implementación de Alertas:**

**Given** que el sistema monitorea alertas en tiempo real
**When** detecta una condición de alerta
**Then** ejecuta el siguiente flujo:

```typescript
// Sistema de Alertas en Tiempo Real
// Archivo: app/api/alertas/check/route.ts

export async function POST(request: Request) {
  const ahora = new Date();

  // 1. Alertas de Stock Mínimo (FR89)
  await checkStockMinimoAlerts();

  // 2. Alertas de MTFR Alto (FR89)
  await checkMTFRAltoAlerts();

  // 3. Alertas de Rutinas No Completadas (FR89)
  await checkRutinasNoCompletadasAlerts();

  return Response.json({ success: true, ejecutado: ahora.toISOString() });
}

// 1. Check Stock Mínimo
async function checkStockMinimoAlerts() {
  // Buscar repuestos bajo stock mínimo
  const repuestosBajoStock = await prisma.repuesto.findMany({
    where: {
      stockActual: { lte: prisma.repuesto.fields.stockMinimo }
    },
    include: {
      proveedor: true
    }
  });

  for (const repuesto of repuestosBajoStock) {
    // Verificar si ya enviamos alerta recientemente (últimas 24h)
    const alertaReciente = await prisma.alertaEnviada.findFirst({
      where: {
        tipo: 'STOCK_MINIMO',
        entityId: repuesto.id,
        enviadaEn: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    if (alertaReciente) continue; // Ya enviamos alerta, skip

    // Buscar usuarios con can_manage_stock
    const usuarios = await prisma.user.findMany({
      where: {
        capabilities: { has: 'can_manage_stock' }
      }
    });

    // Enviar alerta a cada usuario
    for (const usuario of usuarios) {
      await sendNotification(usuario.id, {
        tipo: 'STOCK_MINIMO',
        titulo: `📦 Stock Crítico: ${repuesto.nombre}`,
        mensaje: `El repuesto "${repuesto.nombre}" está bajo stock mínimo. Actual: ${repuesto.stockActual}, Mínimo: ${repuesto.stockMinimo}.`,
        actionUrl: `/repuestos/${repuesto.id}`,
        prioridad: 'ALTA',
        acciones: [
          { label: 'Ver Repuesto', href: `/repuestos/${repuesto.id}` },
          { label: 'Generar Pedido', href: `/repuestos/${repuesto.id}/pedir` }
        ]
      });

      // Registrar alerta enviada
      await prisma.alertaEnviada.create({
        data: {
          tipo: 'STOCK_MINIMO',
          entityId: repuesto.id,
          enviadaA: usuario.id,
          enviadaEn: new Date()
        }
      });
    }
  }
}

// 2. Check MTFR Alto (Mean Time To Fix Response)
async function checkMTFRAltoAlerts() {
  // Calcular MTFR promedio últimos 30 días
  const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const otsCompletadas = await prisma.ordenTrabajo.findMany({
    where: {
      tipo: 'CORRECTIVO',
      estado: 'COMPLETADA',
      fechaCreacion: { gte: hace30Dias },
      fechaInicio: { not: null } // Tiempo hasta EN_PROGRESO
    },
    select: {
      fechaCreacion: true,
      fechaInicio: true
    }
  });

  if (otsCompletadas.length === 0) return;

  // Calcular MTFR promedio = Tiempo hasta EN_PROGRESO
  const mtpromedio30Dias = otsCompletadas.reduce((sum, ot) => {
    const tiempo = differenceInHours(ot.fechaInicio, ot.fechaCreacion);
    return sum + tiempo;
  }, 0) / otsCompletadas.length;

  const umbralAlerta = mtpromedio30Dias * 1.5; // 150% del promedio

  // Buscar OTs recientes con MTFR > umbral
  const otsConMTFRAlto = await prisma.ordenTrabajo.findMany({
    where: {
      tipo: 'CORRECTIVO',
      estado: { in: ['ASIGNADA', 'EN_PROGRESO', 'COMPLETADA'] },
      fechaInicio: { not: null },
      fechaCreacion: { gte: hace30Dias }
    },
    include: {
      equipo: true,
      tecnicoAsignado: true
    }
  });

  for (const ot of otsConMTFRAlto) {
    const mtfr = differenceInHours(ot.fechaInicio, ot.fechaCreacion);

    if (mtfr <= umbralAlerta) continue; // No supera umbral

    // Verificar si ya enviamos alerta para esta OT
    const alertaReciente = await prisma.alertaEnviada.findFirst({
      where: {
        tipo: 'MTFR_ALTO',
        entityId: ot.id,
        enviadaEn: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    if (alertaReciente) continue;

    // Enviar alerta a Elena y Javier
    const usuarios = await prisma.user.findMany({
      where: {
        OR: [
          { capabilities: { has: 'can_view_kpis' } }, // Elena
          { capabilities: { has: 'can_triage_avisos' } } // Javier
        ]
      }
    });

    for (const usuario of usuarios) {
      await sendNotification(usuario.id, {
        tipo: 'MTFR_ALTO',
        titulo: `⚠️ MTFR Alto: OT ${ot.codigo}`,
        mensaje: `La OT "${ot.titulo}" tiene un MTFR de ${mtfr.toFixed(1)}h, superando el umbral de ${umbralAlerta.toFixed(1)}h (150% del promedio).`,
        actionUrl: `/ordenes-trabajo/${ot.id}`,
        prioridad: 'MEDIA',
        datos: {
          otId: ot.id,
          mtfr: mtfr,
          umbral: umbralAlerta,
          equipo: ot.equipo?.nombre,
          tecnico: ot.tecnicoAsignado?.nombre
        }
      });

      await prisma.alertaEnviada.create({
        data: {
          tipo: 'MTFR_ALTO',
          entityId: ot.id,
          enviadaA: usuario.id,
          enviadaEn: new Date()
        }
      });
    }
  }
}

// 3. Check Rutinas No Completadas
async function checkRutinasNoCompletadasAlerts() {
  // Buscar OTs preventivas vencidas sin completar
  const otsVencidas = await prisma.ordenTrabajo.findMany({
    where: {
      tipo: 'PREVENTIVO',
      rutinaId: { not: null },
      estado: { in: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO'] },
      fechaLimite: { lt: new Date() } // Vencidas
    },
    include: {
      tecnicoAsignado: true,
      rutina: true
    }
  });

  for (const ot of otsVencidas) {
    // Verificar si ya enviamos alerta hoy
    const alertaReciente = await prisma.alertaEnviada.findFirst({
      where: {
        tipo: 'RUTINA_NO_COMPLETADA',
        entityId: ot.id,
        enviadaEn: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    if (alertaReciente) continue;

    // Enviar alerta al técnico asignado y Elena
    const usuarios = await prisma.user.findMany({
      where: {
        OR: [
          { id: ot.tecnicoAsignadoId }, // Técnico asignado
          { capabilities: { has: 'can_view_kpis' } } // Elena
        ]
      }
    });

    for (const usuario of usuarios) {
      await sendNotification(usuario.id, {
        tipo: 'RUTINA_NO_COMPLETADA',
        titulo: `🔴 Rutina Vencida: OT ${ot.codigo}`,
        mensaje: `La OT preventiva "${ot.titulo}" venció el ${ot.fechaLimite.toLocaleDateString()} y aún no se ha completado.`,
        actionUrl: `/ordenes-trabajo/${ot.id}`,
        prioridad: 'ALTA'
      });

      await prisma.alertaEnviada.create({
        data: {
          tipo: 'RUTINA_NO_COMPLETADA',
          entityId: ot.id,
          enviadaA: usuario.id,
          enviadaEn: new Date()
        }
      });
    }
  }
}
```

**Acceptance Criteria - UI de Alertas:**

**Given** que recibo una alerta en tiempo real (SSE)
**When** la notificación llega
**Then** veo un toast no intrusivo en pantalla:

```tsx
<Toast
  type={alerta.prioridad === 'ALTA' ? 'error' : 'warning'}
  title={alerta.titulo}
  message={alerta.mensaje}
  duration={10000} // 10 segundos
  actions={
    <>
      <Button size="sm" onClick={() => router.push(alerta.actionUrl)}>
        Ver
      </Button>
      <Button size="sm" variant="ghost" onClick={dismiss}>
        Descartar
      </Button>
    </>
  }
/>
```

**Given** que estoy en el dashboard
**When** hay alertas activas sin leer
**Then** veo un "campanita" con badge de número de alertas:
- Rojo: 5+ alertas de alta prioridad
- Amarillo: 1-4 alertas
- Gris: Sin alertas

**Given** que hago clic en la campanita
**When** se abre el panel de alertas
**Then** veo listado de alertas recientes con filtros:
- Todas
- Stock Crítico
- MTFR Alto
- Rutinas Vencidas

**Validaciones de Performance:**

- El cron job de alertas se ejecuta cada 5 minutos
- Las alertas se entregan vía SSE en < 5 segundos
- Máximo 1 alerta por entidad cada 24 horas (evitar spam)

---

## Story 8.4: Exportación de KPIs a Excel

**Como** Elena (Jefe de Mantenimiento con capability `can_view_kpis`),
**quiero** exportar reportes de KPIs a Excel en formato .xlsx compatible con Microsoft Excel 2016+,
**para** compartir análisis con stakeholders que no tienen acceso al sistema y hacer presentaciones offline.

**Acceptance Criteria - Funcionalidad de Exportación:**

**Given** que estoy en `/dashboard/kpis` o cualquier vista de KPIs
**When** hago clic en el botón "Exportar Excel"
**Then** el sistema genera un archivo `.xlsx` con múltiples hojas:

```typescript
// Endpoint: /api/dashboard/kpis/export
// Archivo: app/api/dashboard/kpis/export/route.ts

import { ExcelJS } from 'exceljs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kpis = searchParams.get('kpis')?.split(',') || ['mttr', 'mtbf', 'ots_abiertas', 'stock_critico'];
  const nivel = searchParams.get('level') || 'GLOBAL';
  const entityId = searchParams.get('entityId');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GMAO Hiansa';
  workbook.created = new Date();

  // Hoja 1: Resumen Ejecutivo
  const hojaResumen = workbook.addWorksheet('Resumen Ejecutivo');
  await generarHojaResumen(hojaResumen, kpis);

  // Hoja 2: MTTR (si solicitado)
  if (kpis.includes('mttr')) {
    const hojaMTTR = workbook.addWorksheet('MTTR');
    await generarHojaMTTR(hojaMTTR, nivel, entityId);
  }

  // Hoja 3: MTBF (si solicitado)
  if (kpis.includes('mtbf')) {
    const hojaMTBF = workbook.addWorksheet('MTBF');
    await generarHojaMTBF(hojaMTBF, nivel, entityId);
  }

  // Hoja 4: OTs Abiertas (si solicitado)
  if (kpis.includes('ots_abiertas')) {
    const hojaOTs = workbook.addWorksheet('OTs Abiertas');
    await generarHojaOTsAbiertas(hojaOTs);
  }

  // Hoja 5: Stock Crítico (si solicitado)
  if (kpis.includes('stock_critico')) {
    const hojaStock = workbook.addWorksheet('Stock Crítico');
    await generarHojaStockCritico(hojaStock);
  }

  // Generar archivo
  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="KPIs_GMAO_${new Date().toISOString().split('T')[0]}.xlsx"`
    }
  });
}

// Hoja de Resumen Ejecutivo
async function generarHojaResumen(hoja: ExcelJS.Worksheet) {
  // Título
  hoja.mergeCells('A1:D1');
  const titulo = hoja.getCell('A1');
  titulo.value = 'Reporte de KPIs - GMAO Hiansa';
  titulo.font = { size: 16, bold: true };
  titulo.alignment = { horizontal: 'center' };

  // Fecha de generación
  hoja.mergeCells('A2:D2');
  const fecha = hoja.getCell('A2');
  fecha.value = `Generado: ${new Date().toLocaleString('es-ES')}`;
  fecha.alignment = { horizontal: 'center' };

  // KPIs principales
  const kpis = await obtenerKPIsPrincipales();

  hoja.getCell('A4').value = 'KPI';
  hoja.getCell('B4').value = 'Valor Actual';
  hoja.getCell('C4').value = 'Tendencia';
  hoja.getCell('D4').value = 'Última Actualización';

  // Formato de encabezados
  ['A4', 'B4', 'C4', 'D4'].forEach(cell => {
    hoja.getCell(cell).font = { bold: true };
    hoja.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
  });

  // Datos
  let row = 5;
  kpis.forEach(kpi => {
    hoja.getCell(`A${row}`).value = kpi.nombre;
    hoja.getCell(`B${row}`).value = kpi.valor;
    hoja.getCell(`C${row}`).value = kpi.tendencia;
    hoja.getCell(`D${row}`).value = kpi.actualizado;
    row++;
  });

  // Auto-adjust columnas
  hoja.columns.forEach(column => {
    column.width = 20;
  });
}

// Hoja de MTTR con drill-down
async function generarHojaMTTR(hoja: ExcelJS.Worksheet, nivel: string, entityId?: string) {
  // Encabezados
  hoja.getRow(1).values = ['Nivel', 'Entidad', 'MTTR (horas)', 'OTs Completadas', 'Tendencia'];

  // Formato
  hoja.getRow(1).font = { bold: true };
  hoja.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFED7D31' }
  };

  // Datos según nivel
  const datos = await obtenerMTTRPorNivel(nivel, entityId);

  let row = 2;
  datos.forEach(item => {
    hoja.getCell(`A${row}`).value = item.nivel;
    hoja.getCell(`B${row}`).value = item.entidad;
    hoja.getCell(`C${row}`).value = item.mttr;
    hoja.getCell(`C${row}`).numFmt = '0.00';
    hoja.getCell(`D${row}`).value = item.otsCount;
    hoja.getCell(`E${row}`).value = item.tendencia;

    // Color condicional: MTFR > promedio
    if (item.mttr > datos.promedio * 1.2) {
      hoja.getCell(`C${row}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
      };
    }

    row++;
  });

  // Gráfico de líneas
  const chart = hoja.addChart(ExcelJS.Chart.line, {
    labels: datos.map(d => d.entidad),
    datasets: [{
      label: 'MTTR (horas)',
      values: datos.map(d => d.mttr)
    }]
  });
  chart.setPosition('A' + (row + 2), 'E' + (row + 15));
}
```

**Acceptance Criteria - UI de Exportación:**

**Given** que estoy en una vista de KPIs
**When** veo la barra de herramientas
**Then** hay botón "Exportar":

```tsx
<Toolbar>
  <Dropdown label="Exportar">
    <DropdownItem onClick={() => exportarExcel(['mttr', 'mtbf'])}>
      📊 Resumen (MTTR + MTBF)
    </DropdownItem>
    <DropdownItem onClick={() => exportarExcel(['mttr', 'mtbf', 'ots_abiertas'])}>
      📋 KPIs Operacionales
    </DropdownItem>
    <DropdownItem onClick={() => exportarExcel(['mttr', 'mtbf', 'ots_abiertas', 'stock_critico'])}>
      📁 Reporte Completo
    </DropdownItem>
    <DropdownSeparator />
    <DropdownItem onClick={() => abrirConfiguracionExportacion()}>
      ⚙️ Configurar Exportación...
    </DropdownItem>
  </Dropdown>
</Toolbar>
```

**Given** que selecciono "Reporte Completo"
**When** hago clic
**Then** el sistema:
1. Muestra spinner "Generando Excel..."
2. Genera el archivo con todas las hojas
3. Descarga automáticamente: `KPIs_GMAO_2026-03-07.xlsx`
4. Muestra toast: "Reporte exportado correctamente"

**Acceptance Criteria - Formato del Archivo Excel:**

**Given** que abro el archivo Excel en Microsoft Excel 2016+
**When** el archivo se carga
**Then** veo:
- ✅ Hoja 1: "Resumen Ejecutivo" con KPIs principales
- ✅ Hoja 2: "MTTR" con datos por nivel seleccionado
- ✅ Hoja 3: "MTBF" con datos por nivel seleccionado
- ✅ Hoja 4: "OTs Abiertas" con listado
- ✅ Hoja 5: "Stock Crítico" con repuestos bajo stock mínimo
- ✅ Gráficos incrustados en cada hoja
- ✅ Formato condicional (rojo para valores críticos)
- ✅ Filtros en encabezados de tabla
- ✅ Columnas con auto-ajuste de ancho

**Validaciones de Performance:**

**Given** que exporto un reporte con 1000 filas de datos
**When** el archivo se genera
**Then** el tiempo de generación es < 5 segundos
**And** el tamaño del archivo es < 2 MB

**Consideraciones de Compatibilidad:**

- Formato `.xlsx` (Office Open XML)
- Compatible con Microsoft Excel 2016+
- Compatible con Google Sheets
- Compatible con LibreOffice Calc

---

## Story 8.5: Configuración de Reportes Automáticos por Email

**Como** Usuario con capability `can_receive_reports`,
**quiero** configurar la recepción de reportes automáticos en PDF con los KPIs que me interesan y la frecuencia que prefiera,
**para** recibir análisis periódicos sin tener que acceder al sistema manualmente.

**Acceptance Criteria - Interfaz de Configuración:**

**Given** que estoy logueado con capability `can_receive_reports`
**When** accedo a `/mis-reportes`
**Then** veo la página de configuración de reportes:

```tsx
// Page Layout: /mis-reportes
<PageLayout title="Mis Reportes Automáticos">
  <Section title="Configuración de Reportes por Email">
    <form onSubmit={handleGuardarConfig}>
      {/* KPIs a Incluir */}
      <FormField
        name="kpis"
        label="KPIs a Incluir en el Reporte"
        type="multiselect"
        options={[
          { value: 'mttr', label: 'MTTR (Mean Time To Repair)' },
          { value: 'mtbf', label: 'MTBF (Mean Time Between Failures)' },
          { value: 'ots_abiertas', label: 'OTs Abiertas' },
          { value: 'ots_completadas', label: 'OTs Completadas' },
          { value: 'stock_critico', label: 'Stock Crítico' },
          { value: 'tecnicos_activos', label: 'Técnicos Activos' },
          { value: 'rutinas_completadas', label: 'Porcentaje de Rutinas Completadas' },
          { value: 'usuarios_por_ot', label: 'Promedio de Usuarios por OT' }
        ]}
        defaultValue={config.kpis}
        helpText="Seleccione todos los KPIs que desea recibir"
      />

      {/* Frecuencia de Reportes */}
      <FormField
        name="frecuencia"
        label="Frecuencia de Reportes"
        type="select"
        options={[
          { value: 'diario', label: 'Diario (todos los días a las 8:00 AM)' },
          { value: 'semanal', label: 'Semanal (todos los lunes a las 8:00 AM)' },
          { value: 'mensual', label: 'Mensual (primer lunes del mes a las 9:00 AM)' },
          { value: 'personalizado', label: 'Personalizado...' }
        ]}
        defaultValue={config.frecuencia}
        onChange={handleFrecuenciaChange}
      />

      {/* Configuración Personalizada (opcional) */}
      {frecuencia === 'personalizado' && (
        <>
          <FormField
            name="diasSemana"
            label="Días de la Semana"
            type="multiselect"
            options={[
              { value: '1', label: 'Lunes' },
              { value: '2', label: 'Martes' },
              { value: '3', label: 'Miércoles' },
              { value: '4', label: 'Jueves' },
              { value: '5', label: 'Viernes' },
              { value: '6', label: 'Sábado' },
              { value: '0', label: 'Domingo' }
            ]}
          />

          <FormField
            name="horaEnvio"
            label="Hora de Envío"
            type="time"
            defaultValue="08:00"
          />
        </>
      )}

      {/* Formato del Reporte */}
      <FormField
        name="formato"
        label="Formato del Reporte"
        type="radio"
        options={[
          { value: 'pdf', label: 'PDF (Portable Document Format)' },
          { value: 'html', label: 'HTML (Email con formato rico)' },
          { value: 'ambos', label: 'Ambos (PDF adjunto + HTML en cuerpo)' }
        ]}
        defaultValue={config.formato}
      />

      <Button type="submit">Guardar Configuración</Button>
    </form>
  </Section>

  {/* Reportes Configurados */}
  <Section title="Mis Reportes Activos">
    <DataTable
      data={misReportes}
      columns={[
        { key: 'nombre', label: 'Nombre del Reporte' },
        { key: 'kpis', label: 'KPIs', render: (row) => row.kpis.join(', ') },
        { key: 'frecuencia', label: 'Frecuencia' },
        { key: 'proximoEnvio', label: 'Próximo Envío', format: 'datetime' },
        {
          key: 'activo',
          label: 'Estado',
          render: (row) => (
            <Toggle
              checked={row.activo}
              onChange={(activo) => toggleReporte(row.id, activo)}
            />
          )
        },
        {
          key: 'acciones',
          label: 'Acciones',
          render: (row) => (
            <>
              <Button size="sm" onClick={() => editarReporte(row.id)}>
                Editar
              </Button>
              <Button size="sm" variant="outline" onClick={() => previsualizarReporte(row.id)}>
                Previsualizar
              </Button>
            </>
          )
        }
      ]}
    />
  </Section>
</PageLayout>
```

**Acceptance Criteria - Guardar Configuración:**

**Given** que configuro un reporte diario
**When** selecciono:
- KPIs: MTTR, MTBF, OTs Abiertas
- Frecuencia: Diario a las 8:00 AM
- Formato: PDF

**And** hago clic en "Guardar Configuración"
**Then** el sistema guarda en la tabla `usuarioReporteConfig`:

```typescript
await prisma.usuarioReporteConfig.create({
  data: {
    usuarioId: userId,
    nombre: 'Reporte Diario de KPIs',
    kpis: ['mttr', 'mtbf', 'ots_abiertas'],
    frecuencia: 'DIARIO',
    diasSemana: null, // Diario no requiere días específicos
    horaEnvio: '08:00',
    formato: 'PDF',
    activo: true,
    proximoEnvio: calcularProximoEnvio('DIARIO', '08:00')
  }
});

function calcularProximoEnvio(frecuencia: string, hora: string): Date {
  const ahora = new Date();
  const [hh, mm] = hora.split(':').map(Number);

  switch (frecuencia) {
    case 'DIARIO':
      // Mañana a la hora configurada
      const manana = new Date(ahora);
      manana.setDate(manana.getDate() + 1);
      manana.setHours(hh, mm, 0, 0);
      return manana;

    case 'SEMANAL':
      // Próximo lunes a la hora configurada
      const proximoLunes = new Date(ahora);
      proximoLunes.setDate(proximoLunes.getDate() + (1 + 7 - proximoLunes.getDay()) % 7);
      proximoLunes.setHours(hh, mm, 0, 0);
      return proximoLunes;

    case 'MENSUAL':
      // Primer lunes del próximo mes a las 9:00 AM (FR90-D)
      const proximoMes = new Date(ahora);
      proximoMes.setMonth(proximoMes.getMonth() + 1, 1);
      proximoMes.setDate(1 + (1 + 7 - proximoMes.getDay()) % 7); // Primer lunes
      proximoMes.setHours(9, 0, 0, 0);
      return proximoMes;
  }
}
```

**Acceptance Criteria - Previsualización:**

**Given** que hago clic en "Previsualizar"
**When** se genera la previsualización
**Then** veo el reporte tal como se enviará por email:

```tsx
<Modal title="Previsualización del Reporte">
  <PDFViewer>
    <ReportePDF
      kpis={config.kpis}
      datos={datosActuales}
      fechaGeneracion={new Date()}
      formato={config.formato}
    />
  </PDFViewer>

  <Button onClick={() => descargarPDF()}>
    Descargar PDF (FR90-E)
  </Button>
</Modal>
```

**Validaciones de Performance:**

**Given** que guardo una configuración de reporte
**When** la operación se ejecuta
**Then** el tiempo de respuesta es < 300ms

---

## Story 8.6: Generación y Envío Automático de Reportes PDF

**Como** Sistema (Cron Job programado),
**quiero** generar automáticamente reportes PDF según las configuraciones de los usuarios y enviarlos por email,
**para** que los stakeholders reciban análisis periódicos sin intervención manual.

**Acceptance Criteria - Cron Job de Reportes:**

**Given** que el cron job se ejecuta cada hora
**When** busca reportes que deben enviarse
**Then** ejecuta la siguiente lógica:

```typescript
// Cron Job: Generación y Envío de Reportes Automáticos
// Ejecuta: Cada hora (cron: 0 * * * *)
// Archivo: app/api/cron/send-reports/route.ts

export async function GET(request: Request) {
  const ahora = new Date();

  // 1. Buscar configuraciones de reporte que deben enviarse ahora
  const reportesParaEnviar = await prisma.usuarioReporteConfig.findMany({
    where: {
      activo: true,
      proximoEnvio: { lte: ahora }
    },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      }
    }
  });

  const resultados = {
    procesados: 0,
    exitosos: 0,
    fallidos: 0,
    errores: []
  };

  for (const config of reportesParaEnviar) {
    resultados.procesados++;

    try {
      // 2. Generar PDF del reporte
      const pdfBuffer = await generarPDFReporte(config);

      // 3. Enviar email
      await enviarEmailReporte(config.usuario, pdfBuffer, config);

      // 4. Actualizar próximo envío
      const siguienteEnvio = calcularProximoEnvio(config.frecuencia, config.horaEnvio);

      await prisma.usuarioReporteConfig.update({
        where: { id: config.id },
        data: {
          ultimoEnvio: ahora,
          proximoEnvio: siguienteEnvio
        }
      });

      resultados.exitosos++;

    } catch (error) {
      resultados.fallidos++;
      resultados.errores.push({
        configId: config.id,
        usuarioEmail: config.usuario.email,
        error: error.message
      });

      console.error(`[CRON] Error enviando reporte a ${config.usuario.email}:`, error);
    }
  }

  return Response.json({
    ejecutado: ahora.toISOString(),
    ...resultados
  });
}

// Generar PDF del reporte
async function generarPDFReporte(config: UsuarioReporteConfig): Promise<Buffer> {
  const { kpis, usuario, formato } = config;

  // Obtener datos de KPIs
  const datos = await obtenerDatosKPIs(kpis);

  // Generar HTML del reporte
  const html = await renderizarTemplateReporte({
    usuarioNombre: usuario.nombre,
    kpis: kpis,
    datos: datos,
    fechaGeneracion: new Date(),
    periodo: obtenerPeriodoReporte(config.frecuencia)
  });

  // Convertir HTML a PDF usando Puppeteer o jsPDF
  const pdf = await convertHTMLToPDF(html);

  return pdf;
}

// Enviar email con PDF adjunto
async function enviarEmailReporte(
  usuario: { email: string; nombre: string },
  pdfBuffer: Buffer,
  config: UsuarioReporteConfig
) {
  const periodo = obtenerPeriodoReporte(config.frecuencia);

  await sendEmail({
    to: usuario.email,
    subject: `📊 Reporte ${config.frecuencia} de KPIs - ${periodo}`,
    html: `
      <h2>Hola ${usuario.nombre},</h2>
      <p>Adjunto encontrarás el reporte ${config.frecuencia.toLowerCase()} de KPIs correspondiente al periodo ${periodo}.</p>
      <p><strong>KPIs incluidos:</strong></p>
      <ul>
        ${config.kpis.map(kpi => `<li>${formatearNombreKPI(kpi)}</li>`).join('')}
      </ul>
      <p>Próximo reporte: <strong>${config.proximoEnvio.toLocaleDateString('es-ES')}</strong></p>
      <hr />
      <p style="font-size: 12px; color: #666;">
        Este email se genera automáticamente. Si no deseas recibir estos reportes,
        accede a <a href="${process.env.NEXT_PUBLIC_APP_URL}/mis-reportes">Mis Reportes</a>
        y desactiva la configuración.
      </p>
    `,
    attachments: [
      {
        filename: `Reporte_${config.frecuencia}_${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

// Obtener datos de KPIs
async function obtenerDatosKPIs(kpis: string[]): Promise<DatosKPIs> {
  const datos: any = {};

  for (const kpi of kpis) {
    switch (kpi) {
      case 'mttr':
        datos.mttr = await cache.get('kpi:mttr') || await calcularMTTR();
        break;

      case 'mtbf':
        datos.mtbf = await cache.get('kpi:mtbf') || await calcularMTBF();
        break;

      case 'ots_abiertas':
        datos.ots_abiertas = await prisma.ordenTrabajo.count({
          where: { estado: { in: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO'] } }
        });
        break;

      case 'ots_completadas':
        datos.ots_completadas = await prisma.ordenTrabajo.count({
          where: {
            estado: 'COMPLETADA',
            fechaCompletacion: {
              gte: inicioPeriodo()
            }
          }
        });
        break;

      case 'stock_critico':
        datos.stock_critico = await prisma.repuesto.count({
          where: {
            stockActual: { lte: prisma.repuesto.fields.stockMinimo }
          }
        });
        break;

      case 'tecnicos_activos':
        datos.tecnicos_activos = await prisma.ordenTrabajo.groupBy({
          by: ['tecnicoAsignadoId'],
          where: {
            estado: 'EN_PROGRESO',
            tecnicoAsignadoId: { not: null }
          }
        }).then(groups => groups.length);
        break;

      case 'rutinas_completadas':
        const inicioMes = startOfMonth(new Date());
        const finMes = endOfMonth(new Date());

        const totalOTs = await prisma.ordenTrabajo.count({
          where: {
            tipo: 'PREVENTIVO',
            rutinaId: { not: null },
            fechaLimite: { gte: inicioMes, lte: finMes }
          }
        });

        const otsCompletadasATiempo = await prisma.ordenTrabajo.count({
          where: {
            tipo: 'PREVENTIVO',
            rutinaId: { not: null },
            fechaLimite: { gte: inicioMes, lte: finMes },
            estado: 'COMPLETADA',
            fechaCompletacion: { lte: prisma.ordenTrabajo.fields.fechaLimite }
          }
        });

        datos.rutinas_completadas = totalOTs > 0
          ? Math.round((otsCompletadasATiempo / totalOTs) * 100)
          : 100;
        break;

      case 'usuarios_por_ot':
        const promedio = await prisma.ordenTrabajo.aggregate({
          where: {
            estado: 'COMPLETADA',
            fechaCompletacion: {
              gte: inicioPeriodo()
            }
          },
          _avg: {
            tecnicoAsignadoId: true // Placeholder, lógica real es más compleja
          }
        });
        break;
    }
  }

  return datos;
}
```

**Acceptance Criteria - Formato del PDF:**

**Given** que se genera el PDF del reporte
**When** se renderiza
**Then** sigue este formato:

```pdf
# Reporte Diario de KPIs
## GMAO Hiansa - Mantenimiento

---
Fecha de Generación: 07/03/2026 08:00
Periodo: 06/03/2026 - 07/03/2026
Usuario: Elena Gómez (Jefe de Mantenimiento)
---

## 1. MTTR (Mean Time To Repair)

Valor Actual: 8.5 horas
Tendencia: ↑ 5% vs período anterior
Objetivo: < 10 horas

[Gráfico de líneas mostrando MTTR últimos 30 días]

## 2. MTBF (Mean Time Between Failures)

Valor Actual: 120 horas
Tendencia: ↓ 3% vs período anterior
Objetivo: > 100 horas

[Gráfico de barras mostrando MTBF por planta]

## 3. OTs Abiertas

Total: 15 OTs abiertas
- PENDIENTE: 8
- ASIGNADA: 5
- EN_PROGRESO: 2

[Tabla de OTs abiertas con prioridad]

## 4. Stock Crítico

Total: 3 repuestos bajo stock mínimo

| Repuesto | Stock Actual | Mínimo | Proveedor |
|----------|--------------|--------|-----------|
| Filtro Aceite-001 | 2 | 5 | Proveedor A |
| Juego Tornillos-02 | 8 | 10 | Proveedor B |
| Correa V-03 | 0 | 3 | Proveedor C |

---

Generado automáticamente por GMAO Hiansa
```

**Acceptance Criteria - Descarga Manual (FR90-E):**

**Given** que estoy en `/mis-reportes`
**When** hago clic en "Descargar PDF" de un reporte
**Then** el sistema genera el PDF al momento
**And** descarga el archivo directamente sin enviar email

**Validaciones de Performance:**

**Given** que el cron job genera 50 reportes
**When** se ejecuta
**Then** el tiempo total de ejecución es < 5 minutos
**And** cada reporte se genera en < 6 segundos

**Consideraciones de Escalabilidad:**

- Usar cola de trabajos (BullMQ/Redis) para procesar reportes en background
- Limitar concurrencia a 5 reportes simultáneos
- Retry automático si falla envío de email (3 reintentos con backoff exponencial)

---

## Story 8.7: Historial de Acciones de Usuario

**Como** Usuario del sistema,
**quiero** ver mi historial de acciones de los últimos 30 días (login, cambios de perfil, acciones críticas),
**para** tener trazabilidad de mi actividad y poder auditar cambios realizados.

**Acceptance Criteria - Historial Propio:**

**Given** que estoy logueado
**When** accedo a `/mi-perfil/historial`
**Then** veo mi historial de acciones de los últimos 30 días:

```tsx
// Page Layout: /mi-perfil/historial
<PageLayout title="Mi Historial de Acciones">
  <DataTable
    data={misAcciones}
    columns={[
      { key: 'fecha', label: 'Fecha Hora', format: 'datetime', sortable: true },
      { key: 'accion', label: 'Acción', sortable: true },
      { key: 'entidad', label: 'Entidad' },
      { key: 'detalles', label: 'Detalles' },
      { key: 'ipAddress', label: 'Dirección IP' },
      { key: 'userAgent', label: 'Navegador/Dispositivo' }
    ]}
    filters={[
      {
        key: 'tipo',
        label: 'Tipo de Acción',
        options: [
          { value: 'LOGIN', label: 'Login' },
          { value: 'CREATE', label: 'Creación' },
          { value: 'UPDATE', label: 'Actualización' },
          { value: 'DELETE', label: 'Eliminación' },
          { value: 'CRITICA', label: 'Acción Crítica' }
        ]
      },
      {
        key: 'fecha',
        label: 'Rango de Fechas',
        type: 'dateRange'
      }
    ]}
    defaultSort={{ column: 'fecha', direction: 'desc' }}
    pagination={{ pageSize: 50 }}
  />
</PageLayout>
```

**Given** que veo mi historial
**When** la tabla carga
**Then** veo filas como:

| Fecha Hora | Acción | Entidad | Detalles | IP | Navegador |
|------------|--------|---------|----------|-----|-----------|
| 07/03/2026 10:23 | UPDATE | OrdenTrabajo OT-1234 | Cambió estado de EN_PROGRESO a COMPLETADA | 192.168.1.50 | Chrome/Windows |
| 07/03/2026 09:15 | CREATE | Repuesto REP-045 | Creó repuesto "Filtro de Aire" | 192.168.1.50 | Chrome/Windows |
| 07/03/2026 08:00 | LOGIN | Sistema | Login exitoso | 192.168.1.50 | Chrome/Windows |
| 06/03/2026 18:30 | CRITICA | Usuario USR-007 | Cambió rol de OPERARIO a TECNICO | 192.168.1.50 | Chrome/Windows |

**Acceptance Criteria - Historial de Otros Usuarios (Admins):**

**Given** que soy Elena (Jefe de Mantenimiento con `can_manage_users`)
**When** accedo a `/usuarios/{usuarioId}/historial`
**Then** veo el historial de acciones de ese usuario

**Given** que busco el historial de Carlos (Operario)
**When** la página carga
**Then** veo todas sus acciones de los últimos 30 días
**And** puedo filtrar por tipo de acción y rango de fechas
**And** puedo exportar a CSV

**Acceptance Criteria - Registro de Acciones:**

**Given** que el sistema registra acciones automáticamente
**When** un usuario realiza una acción
**Then** crea un registro en `auditoria`:

```typescript
// Middleware de registro de auditoría
async function registrarAccion(
  usuarioId: string,
  accion: string,
  entidad: string,
  entidadId: string,
  detalles?: any
) {
  await prisma.auditoria.create({
    data: {
      usuarioId,
      accion, // 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'CRITICA'
      entidad, // 'OrdenTrabajo', 'Repuesto', 'Usuario', etc.
      entidadId,
      detalles: detalles ? JSON.stringify(detalles) : null,
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent'),
      fecha: new Date()
    }
  });
}

// Ejemplo de uso en código
await prisma.ordenTrabajo.update({
  where: { id: otId },
  data: { estado: 'COMPLETADA' }
});

await registrarAccion(
  userId,
  'UPDATE',
  'OrdenTrabajo',
  otId,
  { cambios: { estado: { de: 'EN_PROGRESO', a: 'COMPLETADA' } } }
);
```

**Validaciones de Retención:**

**Given** que el historial se almacena en BD
**When** pasa 30 días
**Then** las acciones más antiguas se archivan o eliminan automáticamente
**And** solo se mantienen los últimos 30 días en la tabla principal

**Consideraciones de Privacidad:**

- Los usuarios solo pueden ver su propio historial
- Solo usuarios con `can_manage_users` pueden ver historial de otros
- El historial incluye IP address y User Agent para auditoría de seguridad

---

## Resumen de Historias de Usuario

| Story | Título | Actor | FRs | Complejidad |
|-------|--------|-------|-----|-------------|
| 8.1 | Dashboard Común para Todos los Usuarios | Todos | FR85, FR86, FR88, FR91, FR91-A | Alta |
| 8.2 | Drill-down Multi-Nivel de KPIs | Elena | FR87, FR87-A | Alta |
| 8.3 | Alertas Accionables en Tiempo Real | Elena, Pedro, María | FR89 | Media |
| 8.4 | Exportación de KPIs a Excel | Elena | FR90 | Media |
| 8.5 | Configuración de Reportes Automáticos | Usuarios con `can_receive_reports` | FR90-A | Media |
| 8.6 | Generación y Envío Automático de PDFs | Sistema | FR90-B, FR90-C, FR90-D, FR90-E | Alta |
| 8.7 | Historial de Acciones de Usuario | Usuarios, Admins | FR104 | Baja |

**Total Estimado:** 7 historias de usuario

---

## Criterios de Éxito del Epic

**Métricas de Éxito:**
- El dashboard carga KPIs en < 1 segundo
- Los KPIs se actualizan cada 30 segundos con 99.9% de éxito
- Las alertas se entregan en < 5 segundos
- Los reportes PDF se generan en < 6 segundos
- El 90% de los usuarios con `can_receive_reports` tienen configurado al menos 1 reporte automático

**Validación de Integración:**
- ✅ Epic 1: PBAC controls access to KPIs and reports
- ✅ Epic 2: Drill-down uses asset hierarchy (Planta → Línea → Equipo)
- ✅ Epic 4: MTTR/MTBF calculated from OT data
- ✅ Epic 5: Stock critical alerts integrate with inventory
- ✅ Epic 7: Routine completion percentage for reports

**Próximos Pasos:**
- Epic 9: Sincronización Multi-Dispositivo (SSE para KPIs en tiempo real)
- Epic 10: Funcionalidades Avanzadas (optimizaciones basadas en KPIs históricos)

---

**Versión:** 2.0 (Historias completas en formato Given/When/Then)
**Fecha:** 2026-03-07
**Estado:** ✅ Completado - Listo para implementación
