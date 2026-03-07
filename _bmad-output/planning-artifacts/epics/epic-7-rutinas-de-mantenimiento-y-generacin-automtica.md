# Epic 7: Rutinas de Mantenimiento y Generación Automática

Permitir a Elena (Jefe de Mantenimiento) configurar rutinas de mantenimiento preventivo que generan automáticamente órdenes de trabajo 24 horas antes del vencimiento, con alertas de recordatorio y dashboard de cumplimiento para asegurar que el mantenimiento programado se complete oportunamente.

**Actor Principal:** Elena (Jefe de Mantenimiento, capability `can_manage_routines`)

**FRs Cubiertas:** FR81, FR81-A, FR81-B, FR82, FR83, FR84 (6 FRs)

**Dependencias:**
- Depende de: Epic 1 (Usuarios y Roles - PBAC), Epic 2 (Assets - Equipos), Epic 4 (Órdenes de Trabajo - OTs)
- Es prerequisito de: Epic 8 (Dashboard y KPIs - métricas de cumplimiento)

---

## Story 7.1: Modelo de Datos de Rutinas de Mantenimiento

**Como** Desarrollador/Arquitecto del Sistema,
**quiero** definir el modelo de datos completo para gestionar rutinas de mantenimiento en Prisma,
**para** soportar rutinas por equipo específico y rutinas customizables con todas sus configuraciones.

**Acceptance Criteria:**

**Given** que estoy definiendo el schema de Prisma en `prisma/schema.prisma`
**When** creo el modelo `RutinaMantenimiento`
**Then** el modelo tiene los siguientes campos:

```prisma
model RutinaMantenimiento {
  id              String   @id @default(uuid())
  codigo          String   @unique // Código único (ej: "RUT-001")

  // Información básica
  titulo          String   // Título descriptivo (ej: "Revisión mensual de prensa hidráulica")
  descripcion     String?  @db.Text // Descripción detallada de tareas

  // FR81-A: Tipo de rutina
  tipoRutina      TipoRutina @default(POR_EQUIPO) // POR_EQUIPO o CUSTOMIZABLE

  // FR81: Frecuencia
  frecuencia      FrecuenciaRutina // DIARIA, SEMANAL, MENSUAL
  horaEjecucion   String?  @db.VarChar(5) // Hora de ejecución (ej: "08:00") - para rutinas diarias

  // FR81-A: Para rutinas POR_EQUIPO
  equipoId        String?  // FK a Equipo (NULL para CUSTOMIZABLE)
  equipo          Equipo?  @relation(fields: [equipoId], references: [id], onDelete: Cascade)

  // FR81-B: Configuración de la rutina
  tareas          Json     // Array de tareas: [{descripcion: "Cambiar aceite", cumplida: false}]
  tecnicoId       String?  // Técnico responsable (opcional, se puede asignar al generar OT)
  tecnico         User?    @relation("RutinasTecnico", fields: [tecnicoId], references: [id])
  duracionEstimadaMinutos Int? // Duración estimada en minutos

  // Control de programación
  fechaUltimaEjecucion DateTime? // Última vez que se generó OT
  fechaProximaEjecucion DateTime  // Próxima fecha programada
  activa          Boolean  @default(true) // Soft delete / pausa

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?
  updatedBy       String?

  // Relaciones
  ordenesTrabajo  OrdenTrabajo[] // OTs generadas desde esta rutina
  repuestos       RutinaRepuesto[] // FR81-B: Repuestos necesarios

  @@index([equipoId])
  @@index([tecnicoId])
  @@index([fechaProximaEjecucion])
  @@index([activa])
  @@map("rutinas_mantenimiento")
}

enum TipoRutina {
  POR_EQUIPO      // FR81-A: Asociada a un equipo específico
  CUSTOMIZABLE    // FR81-A: General (orden, limpieza, etc.) con campos variables
}

enum FrecuenciaRutina {
  DIARIA          // FR81: Se ejecuta todos los días
  SEMANAL         // FR81: Se ejecuta semanalmente (se configura el día de la semana)
  MENSUAL         // FR81: Se ejecuta mensualmente (se configura el día del mes)
}

// FR81-B: Repuestos necesarios para una rutina
model RutinaRepuesto {
  id              String      @id @default(uuid())
  rutinaId        String
  rutina          RutinaMantenimiento @relation(fields: [rutinaId], references: [id], onDelete: Cascade)

  repuestoId      String
  repuesto        Repuesto   @relation(fields: [repuestoId], references: [id])

  cantidad        Float      // Cantidad estimada necesaria

  createdAt       DateTime    @default(now())

  @@unique([rutinaId, repuestoId])
  @@index([rutinaId])
  @@map("rutinas_repuestos")
}
```

**Validaciones:**

**Given** el modelo de datos definido
**When** creo o actualizo una rutina
**Then** el sistema valida que:
- `codigo` es único y obligatorio
- `titulo` es obligatorio (máximo 200 caracteres)
- `tipoRutina = POR_EQUIPO` requiere `equipoId` obligatorio
- `tipoRutina = CUSTOMIZABLE` requiere `equipoId = NULL`
- `frecuencia` tiene uno de los 3 valores permitidos
- `fechaProximaEjecucion` es obligatoria y en el futuro
- `tareas` es un array JSON válido con al menos 1 tarea

**Given** una rutina de tipo POR_EQUIPO
**When** se elimina el equipo asociado
**Then** todas las rutinas asociadas se eliminan en cascade (onDelete: Cascade)

**Escenarios de Error:**

**Given** que intento crear una rutina POR_EQUIPO
**When** no especifico `equipoId`
**Then** el sistema valida antes de insertar en DB
**And** muestra mensaje: "Las rutinas por equipo deben tener un equipo asociado"

**Given** que intento crear una rutina CUSTOMIZABLE
**When** especifico `equipoId`
**Then** el sistema valida y rechaza
**And** muestra mensaje: "Las rutinas customizables no pueden tener equipo asociado"

**Consideraciones de Performance:**

- Índice compuesto en `[fechaProximaEjecucion, activa]` para el cron job que busca rutinas a ejecutar
- Índice en `equipoId` para consultas de rutinas por equipo
- Índice en `tecnicoId` para dashboard de rutinas asignadas

---

## Story 7.2: CRUD de Rutinas (Por Equipo y Customizables)

**Como** Elena (Jefe de Mantenimiento con capability `can_manage_routines`),
**quiero** crear y gestionar rutinas de mantenimiento con configuración de tareas, técnico responsable, repuestos y frecuencia,
**para** automatizar la generación de órdenes de trabajo preventivas y asegurar que el mantenimiento se realice oportunamente.

**Acceptance Criteria - Crear Rutina POR_EQUIPO:**

**Given** que estoy logueado como Elena con capability `can_manage_routines`
**When** accedo a la ruta `/rutinas/nuevo`
**Then** veo el formulario de creación de rutina con los siguientes campos:

```tsx
<form onSubmit={handleSubmit}>
  {/* Identificación */}
  <FormField name="codigo" label="Código Rutina" required autoFocus />
  <FormField name="titulo" label="Título" required maxLength={200} />
  <FormField name="descripcion" label="Descripción" type="textarea" />

  {/* FR81-A: Tipo de Rutina */}
  <FormField
    name="tipoRutina"
    label="Tipo de Rutina"
    required
    type="radio"
    options={[
      {
        value: 'POR_EQUIPO',
        label: 'Por Equipo Específico',
        description: 'Rutina asociada a un equipo particular de la jerarquía de activos'
      },
      {
        value: 'CUSTOMIZABLE',
        label: 'Customizable (General)',
        description: 'Rutina general como orden y limpieza con campos variables'
      }
    ]}
    onChange={handleTipoRutinaChange}
  />

  {/* FR81-A: Para rutinas POR_EQUIPO */}
  {tipoRutina === 'POR_EQUIPO' && (
    <FormField
      name="equipoId"
      label="Equipo"
      required
      type="search"
      placeholder="Buscar equipo por código, nombre o jerarquía..."
      searchUrl="/api/equipos/search"
      resultTemplate={(equipo) => `${equipo.codigo} - ${equipo.nombre}`}
      helpText="Seleccione el equipo al que se aplicará esta rutina"
    />
  )}

  {/* FR81: Frecuencia */}
  <FormField
    name="frecuencia"
    label="Frecuencia"
    required
    type="select"
    options={[
      { value: 'DIARIA', label: 'Diaria' },
      { value: 'SEMANAL', label: 'Semanal' },
      { value: 'MENSUAL', label: 'Mensual' }
    ]}
    onChange={handleFrecuenciaChange}
  />

  {/* Configuración según frecuencia */}
  {frecuencia === 'DIARIA' && (
    <FormField
      name="horaEjecucion"
      label="Hora de Ejecución"
      type="time"
      required
      helpText="Hora a la que se generará la OT cada día"
    />
  )}

  {frecuencia === 'SEMANAL' && (
    <>
      <FormField
        name="diaSemana"
        label="Día de la Semana"
        type="select"
        required
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
        name="horaEjecucion"
        label="Hora de Ejecución"
        type="time"
        required
      />
    </>
  )}

  {frecuencia === 'MENSUAL' && (
    <>
      <FormField
        name="diaMes"
        label="Día del Mes"
        type="number"
        min="1"
        max="31"
        required
        helpText="Día del mes en que se ejecutará la rutina (1-31)"
      />
      <FormField
        name="horaEjecucion"
        label="Hora de Ejecución"
        type="time"
        required
      />
    </>
  )}

  {/* FR81-B: Tareas */}
  <Section title="Tareas a Realizar">
    <TareasArray
      name="tareas"
      fields={[
        {
          name: 'descripcion',
          label: 'Descripción de Tarea',
          required: true,
          placeholder: 'ej: Cambiar aceite del motor'
        }
      ]}
      helpText="Agregue todas las tareas que debe realizar el técnico"
    />
  </Section>

  {/* FR81-B: Técnico Responsable */}
  <FormField
    name="tecnicoId"
    label="Técnico Responsable (Opcional)"
    type="select"
    options={tecnicosOptions}
    helpText="Si no selecciona técnico, se asignará manualmente al generar la OT"
  />

  {/* FR81-B: Repuestos Necesarios */}
  <Section title="Repuestos Necesarios (Opcional)">
    <RepuestosArray
      name="repuestos"
      searchUrl="/api/repuestos/search"
      fields={[
        {
          name: 'repuestoId',
          label: 'Repuesto',
          type: 'search',
          required: true
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          type: 'number',
          min: 0.01,
          step: 0.01,
          required: true
        }
      ]}
      helpText="Repuestos que se utilizarán en esta rutina"
    />
  </Section>

  {/* FR81-B: Duración Estimada */}
  <FormField
    name="duracionEstimadaMinutos"
    label="Duración Estimada (minutos)"
    type="number"
    min="1"
    helpText="Tiempo estimado para completar todas las tareas"
  />

  <Button type="submit">Crear Rutina</Button>
  <Button type="button" variant="secondary" onClick={() => router.back()}>
    Cancelar
  </Button>
</form>
```

**Given** que completo el formulario para una rutina POR_EQUIPO
**When** selecciono frecuencia DIARIA y hora "08:00"
**Then** el sistema calcula `fechaProximaEjecucion` = mañana a las 08:00
**And** guarda la rutina con `fechaUltimaEjecucion = NULL`

**Given** que completo el formulario para una rutina SEMANAL
**When** selecciono día "Lunes" y hora "08:00"
**Then** el sistema calcula `fechaProximaEjecucion` = próximo lunes a las 08:00

**Given** que completo el formulario para una rutina MENSUAL
**When** selecciono día "15" y hora "08:00"
**Then** el sistema calcula `fechaProximaEjecucion` = próximo día 15 del mes a las 08:00

**Acceptance Criteria - Crear Rutina CUSTOMIZABLE:**

**Given** que selecciono tipoRutina = CUSTOMIZABLE
**When** el formulario se actualiza
**Then** el campo `equipoId` desaparece (no se muestra)
**And** veo campos adicionales personalizables:

```tsx
{tipoRutina === 'CUSTOMIZABLE' && (
  <>
    <FormField
      name="ubicacion"
      label="Ubicación (Opcional)"
      placeholder="ej: Planta 1 - Zona de Producción"
      helpText="Lugar donde se debe realizar la rutina"
    />

    <FormField
      name="area"
      label="Área (Opcional)"
      placeholder="ej: Almacén de Materias Primas"
    />

    <FormField
      name="instruccionesAdicionales"
      label="Instrucciones Adicionales"
      type="textarea"
      placeholder="ej: Coordinar con operarios de turno para acceder a maquinaria"
    />
  </>
)}
```

**Given** que creo una rutina CUSTOMIZABLE
**When** guardo exitosamente
**Then** la rutina se crea sin `equipoId`
**And** las OTs generadas no estarán asociadas a ningún equipo específico

**Acceptance Criteria - Editar Rutina:**

**Given** que estoy en `/rutinas/{id}` (vista detalle de rutina)
**When** hago clic en "Editar"
**Then** el formulario se carga con los datos actuales
**And** puedo modificar todos los campos excepto `id` y `codigo`

**Given** que edito una rutina activa
**When** modifico la frecuencia de DIARIA a SEMANAL
**Then** el sistema recalcula `fechaProximaEjecucion` según la nueva frecuencia
**And** actualiza `updatedAt`

**Acceptance Criteria - Desactivar Rutina:**

**Given** que estoy en la vista detalle de una rutina
**When** hago clic en "Pausar" (solo visible si `activa: true`)
**Then** el sistema muestra modal de confirmación:

```tsx
<ConfirmationModal
  title="¿Pausar Rutina?"
  message={`¿Está seguro que desea pausar la rutina "${rutina.titulo}"? No se generarán más órdenes de trabajo automáticamente hasta que la reactive.`}
  confirmLabel="Pausar"
  cancelLabel="Cancelar"
  onConfirm={handlePausar}
/>
```

**Given** que confirmo la pausa
**When** la operación se completa
**Then** el campo `activa` se establece en `false`
**And** el botón cambia a "Reactivar"
**And** veo toast: "Rutina pausada correctamente"

**Given** que una rutina está pausada (`activa: false`)
**When** el cron job ejecuta
**Then** la rutina NO se procesa (no genera OTs)

**Escenarios de Error:**

**Given** que intento crear una rutina POR_EQUIPO
**When** no selecciono un equipo
**Then** veo validación inline: "Debe seleccionar un equipo para rutinas por equipo"

**Given** que intento crear una rutina
**When** no agrego ninguna tarea
**Then** veo validación: "Debe agregar al menos una tarea"

**Given** que intento crear una rutina diaria
**When** no especifico la hora de ejecución
**Then** veo validación: "Debe especificar la hora de ejecución"

**Validaciones de Performance:**

**Given** que guardo una rutina
**When** la operación se ejecuta
**Then** el tiempo de respuesta es < 500ms

---

## Story 7.3: Cron Job de Generación Automática de OTs Preventivas

**Como** Sistema (Cron Job programado),
**quiero** ejecutar un job cada hora que busque rutinas cuya próxima ejecución sea en las próximas 24 horas,
**para** generar automáticamente las órdenes de trabajo preventivas correspondientes.

**Acceptance Criteria - Ejecución del Cron Job:**

**Given** que el cron job se ejecuta cada hora (ej: todos los días a las XX:00)
**When** busca rutinas para procesar
**Then** ejecuta la siguiente lógica:

```typescript
// Cron Job: Generación de OTs Preventivas
// Ejecuta: Cada hora (cron: 0 * * * *)
// Archivo: app/api/cron/generate-ot-preventivas/route.ts

export async function GET(request: Request) {
  // 1. Verificar autorización (solo sistema o cron)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // 2. Buscar rutinas activas cuya próxima ejecución es en las próximas 24h
  const rutinasToProcess = await prisma.rutinaMantenimiento.findMany({
    where: {
      activa: true,
      fechaProximaEjecucion: {
        gte: now,
        lte: in24Hours
      }
    },
    include: {
      equipo: true,
      tecnico: true,
      repuestos: {
        include: {
          repuesto: true
        }
      }
    }
  });

  const resultados = {
    procesadas: 0,
    exitosas: 0,
    fallidas: 0,
    errores: []
  };

  // 3. Para cada rutina, generar OT preventiva
  for (const rutina of rutinasToProcess) {
    resultados.procesadas++;

    try {
      // 3.1 Calcular próxima fecha de ejecución (para la siguiente OT)
      const fechaSiguienteEjecucion = calcularProximaEjecucion(
        rutina.frecuencia,
        rutina.fechaProximaEjecucion
      );

      // 3.2 Generar código de OT
      const otCodigo = await generarCodigoOT();

      // 3.3 Crear OT preventiva
      const ot = await prisma.ordenTrabajo.create({
        data: {
          codigo: otCodigo,
          titulo: rutina.titulo,
          descripcion: rutina.descripcion || '',
          tipo: 'PREVENTIVO', // FR82: Etiqueta "Preventivo"
          estado: 'PENDIENTE', // FR82: Estado "Pendiente"
          prioridad: 'MEDIA', // Preventivas son prioridad media por defecto

          // Asociación
          equipoId: rutina.equipoId,
          rutinaId: rutina.id,

          // Asignación
          tecnicoAsignadoId: rutina.tecnicoId || null,

          // Fechas
          fechaCreacion: now,
          fechaLimite: rutina.fechaProximaEjecucion,
          duracionEstimadaMinutos: rutina.duracionEstimadaMinutos,

          // Tareas de la rutina
          tareas: rutina.tareas,

          // Repuestos necesarios (copiar de la rutina)
          repuestosNecesarios: rutina.repuestos.map(rr => ({
            repuestoId: rr.repuestoId,
            cantidad: rr.cantidad
          })),

          // Metadata
          createdBy: 'SYSTEM_CRON'
        }
      });

      // 3.4 Actualizar rutina
      await prisma.rutinaMantenimiento.update({
        where: { id: rutina.id },
        data: {
          fechaUltimaEjecucion: rutina.fechaProximaEjecucion,
          fechaProximaEjecucion: fechaSiguienteEjecucion,
          updatedAt: now
        }
      });

      resultados.exitosas++;

    } catch (error) {
      resultados.fallidas++;
      resultados.errores.push({
        rutinaId: rutina.id,
        rutinaCodigo: rutina.codigo,
        error: error.message
      });

      // Log del error para monitoreo
      console.error(`[CRON] Error generando OT para rutina ${rutina.codigo}:`, error);
    }
  }

  // 4. Retornar resumen de ejecución
  return Response.json({
    ejecutado: now.toISOString(),
    rutinasEncontradas: rutinasToProcess.length,
    ...resultados
  });
}

// Función auxiliar para calcular próxima ejecución
function calcularProximaEjecucion(
  frecuencia: FrecuenciaRutina,
  fechaActual: Date
): Date {
  const proxima = new Date(fechaActual);

  switch (frecuencia) {
    case 'DIARIA':
      // Sumar 1 día
      proxima.setDate(proxima.getDate() + 1);
      break;

    case 'SEMANAL':
      // Sumar 7 días
      proxima.setDate(proxima.getDate() + 7);
      break;

    case 'MENSUAL':
      // Sumar 1 mes
      proxima.setMonth(proxima.getMonth() + 1);
      break;
  }

  return proxima;
}
```

**Given** que el cron job se ejecuta
**When** encuentra una rutina DIARIA con `fechaProximaEjecucion` = mañana 08:00
**Then** genera una OT con:
- `estado = PENDIENTE`
- `tipo = PREVENTIVO`
- `fechaLimite = mañana 08:00`
- `titulo = rutina.titulo`
- `descripcion = rutina.descripcion`
- `tareas = rutina.tareas`
- `repuestosNecesarios = rutina.repuestos` (copiados)

**Given** que la OT se genera exitosamente
**When** la rutina se actualiza
**Then**:
- `fechaUltimaEjecucion` = fecha que acabamos de procesar
- `fechaProximaEjecucion` = fecha siguiente (según frecuencia)

**Acceptance Criteria - Prevención de Duplicados:**

**Given** que el cron job se ejecuta
**When** ya existe una OT generada para esta rutina con la misma `fechaLimite`
**Then** el sistema detecta el duplicado antes de crear
**And** salta esta rutina (no genera OT duplicada)

```typescript
// Verificar si ya existe OT para esta rutina en esta fecha
const otExistente = await prisma.ordenTrabajo.findFirst({
  where: {
    rutinaId: rutina.id,
    fechaLimite: rutina.fechaProximaEjecucion
  }
});

if (otExistente) {
  // Ya existe OT, saltar
  continue;
}
```

**Acceptance Criteria - Manejo de Errores:**

**Given** que el cron job falla al generar una OT
**When** ocurre un error (ej: BD caída, validación fallida)
**Then** el error se loguea pero NO detiene el procesamiento de otras rutinas
**And** la rutina fallida se intenta nuevamente en la próxima ejecución del cron (1 hora después)

**Validaciones de Performance:**

**Given** que el cron job se ejecuta
**When** procesa 100 rutinas
**Then** el tiempo total de ejecución es < 30 segundos
**And** cada rutina se procesa en < 300ms en promedio

**Consideraciones de Monitoreo:**

- El cron job retorna JSON con estadísticas (procesadas, exitosas, fallidas)
- Logs estructurados para monitoreo en Datadog/NewRelic
- Alerta si `fallidas > 10%` de procesadas

---

## Story 7.4: Alertas de Vencimiento de Rutinas

**Como** Técnico asignado a una rutina (María con capability `can_view_assigned_ots`),
**quiero** recibir alertas automáticas cuando una OT generada desde rutina está próxima a vencer o ya venció,
**para** priorizar las tareas preventivas y evitar incumplimientos en el mantenimiento programado.

**Acceptance Criteria - Tipos de Alertas:**

**Given** que existe una OT preventiva generada desde rutina
**When** se aproxima su fecha límite
**Then** el sistema envía 3 tipos de alertas (FR84):

1. **Alerta de Próximo Vencimiento:** 1 hora antes del vencimiento
2. **Alerta de Vencimiento:** En el momento del vencimiento
3. **Alerta de Vencimiento Tardío:** 24 horas después del vencimiento (si permanece incompleta)

**Acceptance Criteria - Implementación de Alertas:**

**Given** que el sistema genera alertas
**When** se configura el cron job de alertas
**Then** se ejecuta cada 10 minutos para verificar OTs que necesitan alertas:

```typescript
// Cron Job: Alertas de Vencimiento de Rutinas
// Ejecuta: Cada 10 minutos (cron: */10 * * * *)
// Archivo: app/api/cron/rutina-alertas/route.ts

export async function GET(request: Request) {
  const now = new Date();

  // 1. Buscar OTs preventivas pendientes que necesitan alerta
  const otsPendientes = await prisma.ordenTrabajo.findMany({
    where: {
      tipo: 'PREVENTIVO',
      estado: {
        in: ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO']
      },
      rutinaId: { not: null },
      tecnicoAsignadoId: { not: null }
    },
    include: {
      tecnicoAsignado: true,
      rutina: true
    }
  });

  const alertasEnviadas = [];

  for (const ot of otsPendientes) {
    const alertas = await calcularAlertasPendientes(ot, now);

    for (const alerta of alertas) {
      // Enviar notificación SSE al técnico
      await sendNotification(ot.tecnicoAsignadoId, {
        tipo: 'RUTINA_VENCIMIENTO',
        subtipo: alerta.tipo,
        titulo: alerta.titulo,
        mensaje: alerta.mensaje,
        orderId: ot.id,
        actionUrl: `/ordenes-trabajo/${ot.id}`
      });

      alertasEnviadas.push({
        otId: ot.id,
        tecnicoId: ot.tecnicoAsignadoId,
        tipo: alerta.tipo
      });
    }
  }

  return Response.json({
    ejecutado: now.toISOString(),
    alertasEnviadas: alertasEnviadas.length
  });
}

async function calcularAlertasPendientes(ot: OrdenTrabajo, now: Date): Promise<Alerta[]> {
  const alertas: Alerta[] = [];
  const unaHora = 60 * 60 * 1000;
  const veinticuatroHoras = 24 * 60 * 60 * 1000;

  // FR84: Alerta 1 hora antes
  const tiempoRestante = ot.fechaLimite.getTime() - now.getTime();

  if (tiempoRestante > 0 && tiempoRestante <= unaHora) {
    // Verificar si ya enviamos esta alerta (usar tabla de alertas enviadas)
    const yaEnviada = await alertaYaEnviada(ot.id, 'UNA_HORA_ANTES');

    if (!yaEnviada) {
      alertas.push({
        tipo: 'UNA_HORA_ANTES',
        titulo: `⏰ OT ${ot.codigo} vence en 1 hora`,
        mensaje: `La orden de trabajo "${ot.titulo}" vence en 1 hora. Priorice su completitud.`
      });
    }
  }

  // FR84: Alerta en el momento del vencimiento
  if (Math.abs(tiempoRestante) < 10 * 60 * 1000) { // Dentro de ventana de 10 min
    const yaEnviada = await alertaYaEnviada(ot.id, 'VENCIMIENTO');

    if (!yaEnviada) {
      alertas.push({
        tipo: 'VENCIMIENTO',
        titulo: `⚠️ OT ${ot.codigo} vence ahora`,
        mensaje: `La orden de trabajo "${ot.titulo}" está venciendo. Complete las tareas pendientes.`
      });
    }
  }

  // FR84: Alerta 24 horas después
  const tiempoDespues = now.getTime() - ot.fechaLimite.getTime();

  if (tiempoDespues >= veinticuatroHoras) {
    const yaEnviada = await alertaYaEnviada(ot.id, 'VEINTICUATRO_HORAS_DESPUES');

    if (!yaEnviada) {
      alertas.push({
        tipo: 'VEINTICUATRO_HORAS_DESPUES',
        titulo: `🔴 OT ${ot.codigo} vencida hace 24h`,
        mensaje: `La orden de trabajo "${ot.titulo}" está vencida hace 24 horas. Debe completarse urgentemente.`
      });
    }
  }

  return alertas;
}

async function alertaYaEnviada(otId: string, tipo: string): Promise<boolean> {
  const alerta = await prisma.alertaEnviada.findUnique({
    where: {
      ordenTrabajoId_tipo: {
        ordenTrabajoId: otId,
        tipo: tipo
      }
    }
  });

  return !!alerta;
}

async function sendNotification(userId: string, notificacion: any) {
  // 1. Registrar alerta en BD (para no duplicar)
  await prisma.alertaEnviada.create({
    data: {
      ordenTrabajoId: notificacion.orderId,
      tipo: notificacion.subtipo,
      enviadaA: userId,
      enviadaEn: new Date()
    }
  });

  // 2. Enviar vía SSE (Server-Sent Events)
  if (userConnections[userId]) {
    userConnections[userId].send(JSON.stringify(notificacion));
  }

  // 3. Opcional: Enviar email si el usuario tiene preferencias activadas
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.emailAlerts) {
    await sendEmailAlert(user.email, notificacion);
  }
}
```

**Acceptance Criteria - Experiencia de Usuario:**

**Given** que soy María (técnico asignada)
**When** recibo una alerta de "1 hora antes"
**Then** veo una notificación push en tiempo real (SSE) con:
- Título: "⏰ OT OT-1234 vence en 1 hora"
- Mensaje: "La orden de trabajo 'Revisión mensual de prensa' vence en 1 hora. Priorice su completitud."
- Botón: "Ver OT" que me lleva a `/ordenes-trabajo/OT-1234`

**Given** que hago clic en "Ver OT"
**When** la OT se carga
**Then** veo un banner destacado con:

```tsx
<Alert variant="warning" icon="clock">
  <strong>⏰ Esta OT vence en menos de 1 hora.</strong><br />
  Fecha límite: {ot.fechaLimite.toLocaleString()}<br />
  Complete las tareas pendientes para evitar vencimiento.
</Alert>
```

**Given** que la OT ya venció
**When** la abro
**Then** veo un banner rojo:

```tsx
<Alert variant="error" icon="exclamation-triangle">
  <strong>🔴 Esta OT está vencida.</strong><br />
  Venció: {ot.fechaLimite.toLocaleString()}<br />
  Tiempo vencido: {calcularTiempoVencido(ot.fechaLimite)}<br />
  Debe completarse urgentemente.
</Alert>
```

**Validaciones de Performance:**

**Given** que el cron job de alertas se ejecuta
**When** procesa 1000 OTs pendientes
**Then** el tiempo de ejecución es < 1 minuto

**Consideraciones de UX:**

- Las alertas son no intrusivas (no bloquean trabajo actual)
- El técnico puede "descartar" una alerta temporalmente (vuelve en 10 min)
- Historial de alertas visible en la OT (quién recibió qué alerta y cuándo)

---

## Story 7.5: Dashboard de Cumplimiento de Rutinas

**Como** Elena (Jefe de Mantenimiento con capability `can_view_all_ots`),
**quiero** ver un dashboard que muestre el porcentaje de rutinas completadas y el estado de cumplimiento del mantenimiento preventivo,
**para** identificar brechas en el mantenimiento programado y tomar acciones correctivas.

**Acceptance Criteria - Dashboard de Cumplimiento:**

**Given** que estoy logueado como Elena con capability `can_view_all_ots`
**When** accedo a la ruta `/dashboard/rutinas`
**Then** veo un dashboard con las siguientes métricas (FR83):

```tsx
// Page Layout: /dashboard/rutinas
<PageLayout title="Dashboard de Rutinas de Mantenimiento">
  {/* KPIs Generales */}
  <KPICardsRow>
    <KPICard
      title="Cumplimiento Este Mes"
      value={cumplimientoMes}%
      trend={cumplimientoTrend}
      format="percentage"
      target={95}
      description="Porcentaje de rutinas completadas este mes"
    />
    <KPICard
      title="Rutinas Activas"
      value={rutinasActivas}
      format="number"
      description="Total de rutinas configuradas y activas"
    />
    <KPICard
      title="OTs Preventivas Pendientes"
      value={otsPendientes}
      format="number"
      status={otsPendientes > 10 ? 'warning' : 'success'}
      description="Órdenes de trabajo preventivas sin completar"
    />
    <KPICard
      title="OTs Vencidas"
      value={otsVencidas}
      format="number"
      status={otsVencidas > 0 ? 'error' : 'success'}
      description="Órdenes de trabajo vencidas (requieren atención urgente)"
    />
  </KPICardsRow>

  {/* Gráfico de Cumplimiento Mensual */}
  <Section title="Cumplimiento Mensual (Últimos 6 meses)">
    <BarChart
      data={cumplimientoMensual}
      xAxis="mes"
      yAxis="porcentaje"
      targetLine={95}
      height={300}
    />
  </Section>

  {/* Tabla de Rutinas con Estado */}
  <Section title="Estado de Rutinas por Equipo">
    <DataTable
      data={rutinasPorEquipo}
      columns={[
        { key: 'equipo', label: 'Equipo' },
        {
          key: 'cumplimiento',
          label: 'Cumplimiento',
          render: (row) => (
            <ProgressBar
              value={row.cumplimiento}
              max={100}
              target={95}
              color={row.cumplimiento >= 95 ? 'green' : row.cumplimiento >= 80 ? 'yellow' : 'red'}
            />
          )
        },
        { key: 'totalRutinas', label: 'Total Rutinas' },
        { key: 'completadas', label: 'Completadas' },
        { key: 'pendientes', label: 'Pendientes' },
        { key: 'vencidas', label: 'Vencidas' },
        { key: 'proximaEjecucion', label: 'Próxima Ejecución' }
      ]}
    />
  </Section>

  {/* Tabla: Mis Rutinas Asignadas (si soy técnico) */}
  {canViewAssignedOTs && (
    <Section title="Mis Rutinas Asignadas">
      <DataTable
        data={misRutinas}
        columns={[
          { key: 'rutina', label: 'Rutina' },
          { key: 'equipo', label: 'Equipo' },
          { key: 'proximaEjecucion', label: 'Próxima Ejecución' },
          {
            key: 'estado',
            label: 'Estado',
            render: (row) => (
              <Badge variant={row.estado === 'completada' ? 'success' : 'warning'}>
                {row.estado}
              </Badge>
            )
          },
          {
            key: 'acciones',
            label: 'Acciones',
            render: (row) => (
              <Button onClick={() => router.push(`/ordenes-trabajo/${row.otId}`)}>
                Ver OT
              </Button>
            )
          }
        ]}
      />
    </Section>
  )}
</PageLayout>
```

**Acceptance Criteria - Cálculo de Cumplimiento:**

**Given** que el dashboard calcula el cumplimiento del mes actual
**When** ejecuta la query
**Then** usa la siguiente lógica:

```typescript
// Cálculo de cumplimiento mensual
async function calcularCumplimientoMes(): Promise<number> {
  const inicioMes = startOfMonth(new Date());
  const finMes = endOfMonth(new Date());

  // 1. Total de OTs preventivas que vencieron en el mes
  const totalOTs = await prisma.ordenTrabajo.count({
    where: {
      tipo: 'PREVENTIVO',
      rutinaId: { not: null },
      fechaLimite: {
        gte: inicioMes,
        lte: finMes
      }
    }
  });

  // 2. OTs completadas antes o en la fecha límite
  const otsCompletadasATiempo = await prisma.ordenTrabajo.count({
    where: {
      tipo: 'PREVENTIVO',
      rutinaId: { not: null },
      fechaLimite: {
        gte: inicioMes,
        lte: finMes
      },
      estado: 'COMPLETADA',
      fechaCompletacion: {
        lte: prisma.ordenTrabajo.fields.fechaLimite // Completada antes o en fecha límite
      }
    }
  });

  // 3. Calcular porcentaje
  if (totalOTs === 0) return 100; // Si no hay OTs, cumplimiento 100%
  return Math.round((otsCompletadasATiempo / totalOTs) * 100);
}
```

**Given** que el cumplimiento del mes es 87%
**When** el KPI se muestra
**Then** veo:
- Valor: "87%"
- Color: Amarillo (warning, está bajo target de 95%)
- Trend: ↓ -3% comparado con mes anterior (si aplica)

**Acceptance Criteria - Desglose por Equipo:**

**Given** que veo la tabla "Rutinas por Equipo"
**When** la tabla carga datos
**Then** veo filas con:

| Equipo | Cumplimiento | Total Rutinas | Completadas | Pendientes | Vencidas |
|--------|--------------|---------------|-------------|------------|----------|
| Prensa Hidráulica-01 | ████████░░ 82% | 4 | 3 | 0 | 1 |
| Compresor Aire-01 | ██████████ 100% | 2 | 2 | 0 | 0 |
| Transportadora-01 | ██████░░░░ 60% | 5 | 3 | 1 | 1 |

**Given** que hago clic en una fila de equipo
**When** se expande
**Then** veo el desglose de cada rutina individual con su estado

**Acceptance Criteria - Mis Rutinas Asignadas:**

**Given** que soy María (técnico con `can_view_assigned_ots`)
**When** veo la sección "Mis Rutinas Asignadas"
**Then** veo solo las rutinas donde `tecnicoAsignadoId = miUserId`
**And** veo columnas: Rutina, Equipo, Próxima Ejecución, Estado, Acciones

**Validaciones de Performance:**

**Given** que el dashboard tiene 100 rutinas activas
**When** carga las métricas
**Then** el tiempo de respuesta es < 1 segundo
**And** las queries usan índices en `fechaLimite`, `rutinaId`, `tecnicoAsignadoId`

**Consideraciones de UX:**

- El dashboard se actualiza automáticamente cada 30 segundos vía SSE
- Filtros por rango de fechas (este mes, últimos 3 meses, último año)
- Exportar a CSV/Excel para reportes
- Click en KPIs drill-down a listados filtrados

---

## Story 7.6: Integración de Repuestos en OTs Generadas desde Rutinas

**Como** María (Técnica con capability `can_execute_ot`),
**quiero** que las OTs preventivas generadas desde rutinas incluyan automáticamente los repuestos necesarios,
**para** no tener que buscarlos manualmente y poder usarlos directamente durante la ejecución de la OT.

**Acceptance Criteria - Repuestos en OTs Generadas:**

**Given** que una rutina tiene repuestos configurados
**When** el cron job genera la OT preventiva
**Then** la OT se crea con `repuestosNecesarios` poblado:

```json
{
  "repuestosNecesarios": [
    {
      "repuestoId": "uuid-repuesto-1",
      "codigo": "REP-001",
      "nombre": "Aceite Hidráulico ISO VG 46",
      "cantidad": 5.0,
      "unidad": "litros"
    },
    {
      "repuestoId": "uuid-repuesto-2",
      "codigo": "REP-045",
      "nombre": "Filtro de Aceite",
      "cantidad": 1.0,
      "unidad": "unidad"
    }
  ]
}
```

**Given** que estoy ejecutando una OT preventiva
**When** voy a la sección de Repuestos
**Then** veo los repuestos precargados:

```tsx
<Section title="Repuestos Necesarios">
  {ot.repuestosNecesarios.map(repuesto => (
    <RepuestoCard
      key={repuesto.repuestoId}
      repuesto={repuesto}
      stockActual={obtenerStockActual(repuesto.repuestoId)}
      onUse={(cantidad) => usarRepuesto(ot.id, repuesto.repuestoId, cantidad)}
    />
  ))}

  <Button variant="outline" onClick={agregarRepuestoAdicional}>
    + Agregar Repuesto Adicional
  </Button>
</Section>
```

**Given** que uso un repuesto necesario
**When** registro el consumo
**Then** el sistema actualiza el stock del repuesto (Epic 5)
**And** marca el repuesto como "usado" en la OT

**Acceptance Criteria - Validación de Stock:**

**Given** que una OT preventiva se genera
**When** uno de los repuestos necesarios tiene stockActual < cantidad
**Then** la OT se crea igualmente
**And** veo una alerta en la OT:

```tsx
<Alert variant="warning">
  <strong>⚠️ Stock Insuficiente</strong><br />
  Los siguientes repuestos no tienen stock suficiente:<br />
  - Aceite Hidráulico ISO VG 46: Necesitas 5.0 litros, Stock actual: 2.0 litros<br />
  <Button size="sm" onClick={() => router.push(`/repuestos/${repuesto.id}`)}>
    Ver Repuesto
  </Button>
</Alert>
```

**Consideraciones de Integración:**

- Los repuestos de la rutina se copian a la OT (no son referencias dinámicas)
- Si la rutina modifica sus repuestos, las OTs ya generadas no se afectan
- Al completar la OT, se puede validar si todos los repuestos necesarios fueron usados

---

## Resumen de Historias de Usuario

| Story | Título | Actor | FRs | Complejidad |
|-------|--------|-------|-----|-------------|
| 7.1 | Modelo de Datos de Rutinas | Sistema | Todas | Media |
| 7.2 | CRUD de Rutinas (Por Equipo y Customizables) | Elena | FR81, FR81-A, FR81-B | Alta |
| 7.3 | Cron Job de Generación Automática de OTs | Sistema | FR82 | Alta |
| 7.4 | Alertas de Vencimiento de Rutinas | Sistema, María | FR84 | Media |
| 7.5 | Dashboard de Cumplimiento de Rutinas | Elena | FR83 | Media |
| 7.6 | Integración de Repuestos en OTs Generadas | María | FR81-B | Baja |

**Total Estimado:** 6 historias de usuario

---

## Criterios de Éxito del Epic

**Métricas de Éxito:**
- El cron job genera OTs preventivas con 99.9% de disponibilidad
- El 95% de las OTs preventivas se completan antes de su fecha límite
- Las alertas de vencimiento se entregan en < 10 segundos
- El dashboard de cumplimiento carga en < 1 segundo

**Validación de Integración:**
- ✅ Epic 1: Users with `can_manage_routines` can configure maintenance routines
- ✅ Epic 2: Routines can be associated with Equipos (assets hierarchy)
- ✅ Epic 4: Generated OTs follow standard OT workflow (8 states)
- ✅ Epic 5: Repuestos from routines are automatically included in generated OTs

**Próximos Pasos:**
- Epic 8: KPIs y Reportes (métricas avanzadas de cumplimiento, MTBF, MTTR)
- Epic 10: Funcionalidades Adicionales (optimización de stock de repuestos según rutinas)

---

**Versión:** 2.0 (Historias completas en formato Given/When/Then)
**Fecha:** 2026-03-07
**Estado:** ✅ Completado - Listo para implementación
