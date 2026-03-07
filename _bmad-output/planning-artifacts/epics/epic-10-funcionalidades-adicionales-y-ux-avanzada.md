# Epic 10: Funcionalidades Adicionales y UX Avanzada

Implementar funcionalidades que mejoran significativamente la experiencia del usuario: rechazo de reparaciones con re-trabajo automático, búsqueda universal predictiva, preferencias de notificación personalizables, comentarios con timestamp, fotos antes/después de reparaciones y códigos QR para equipos.

**Actor Principal:** Todos los usuarios (Carlos, María, Elena, Javier, Pedro)

**FRs Cubiertas:** FR101, FR102, FR104, FR105, FR106, FR107, FR108 (7 FRs)

**Dependencias:**
- Depende de: Epic 1 (Usuarios), Epic 2 (Assets), Epic 3 (Avisos), Epic 4 (OTs)
- Complementa a: Todos los epics (mejoras de UX generales)

---

## Story 10.1: Rechazo de Reparación por Carlos

**Como** Carlos (Operario con capability `can_create_failure_report`),
**quiero poder rechazar una reparación si el equipo no funciona correctamente después de ser marcada como completada,
**para** generar automáticamente una OT de re-trabajo con prioridad alta que asegure que el problema se solucione.

**Acceptance Criteria - UI de Rechazo:**

**Given** que una OT fue completada por María (Técnica)
**When** Carlos (Operario) verifica que el equipo sigue fallando
**Then** en la vista detalle de la OT `/ordenes-trabajo/{otId}`, Carlos ve:

```tsx
// Vista Detalle de OT Completada
<OTDetail ot={ot}>
  {/* ... otros detalles ... */}

  {/* FR101: Botón de rechazo visible para can_create_failure_report */}
  {ot.estado === 'COMPLETADA' && canCreateFailureReport && ot.creadorId === session.user.id && (
    <RejectSection>
      <Alert variant="info">
        <strong>¿El equipo no funciona correctamente?</strong><br />
        Puede rechazar esta reparación. Se generará automáticamente una nueva OT de re-trabajo con prioridad ALTA.
      </Alert>

      <Button variant="destructive" onClick={openRejectModal}>
        ❌ Rechazar Reparación
      </Button>
    </RejectSection>
  )}
</OTDetail>
```

**Given** que hago clic en "Rechazar Reparación"
**When** el modal se abre
**Then** veo el formulario de rechazo:

```tsx
<Modal title="Rechazar Reparación - OT {ot.codigo}">
  <form onSubmit={handleRechazo}>
    <FormField
      name="motivo"
      label="Motivo del Rechazo"
      type="textarea"
      required
      placeholder="Describa por qué el equipo no funciona correctamente después de la reparación..."
      helpText="Este motivo se incluirá en la nueva OT de re-trabajo"
      minLength={20}
      maxLength={500}
    />

    <FormField
      name="verificacion"
      label="¿Qué verificó?"
      type="select"
      required
      options={[
        { value: 'equipo_no_enciende', label: 'El equipo no enciende' },
        { value: 'mismo_fallo_persiste', label: 'El mismo fallo persiste' },
        { value: 'nuevo_fallo', label: 'Apareció un nuevo fallo relacionado' },
        { value: 'ruido_anormal', label: 'Ruido o vibración anormal' },
        { value: 'no_cumple_especificaciones', label: 'No cumple especificaciones técnicas' },
        { value: 'otro', label: 'Otro motivo' }
      ]}
    />

    <FormField
      name="prioridad"
      label="Prioridad de Re-trabajo"
      type="radio"
      required
      options={[
        { value: 'ALTA', label: 'Alta (re-trabajo urgente)', default: true },
        { value: 'MEDIA', label: 'Media (re-trabajo estándar)' },
        { value: 'BAJA', label: 'Baja (re-trabajo no urgente)' }
      ]}
      helpText="La prioridad ALTA asignará un técnico inmediatamente"
    />

    <Alert variant="warning">
      <strong>⚠️ Importante:</strong> Al rechazar esta reparación:
      <ul>
        <li>La OT actual se marcará como "RECHAZADA"</li>
        <li>Se generará automáticamente una nueva OT de re-trabajo</li>
        <li>María será notificada del rechazo</li>
        <li>La nueva OT tendrá prioridad {watch('prioridad')}</li>
      </ul>
    </Alert>

    <ButtonActions>
      <Button variant="outline" type="button" onClick={closeModal}>
        Cancelar
      </Button>
      <Button variant="destructive" type="submit">
        Confirmar Rechazo
      </Button>
    </ButtonActions>
  </form>
</Modal>
```

**Acceptance Criteria - Proceso de Rechazo:**

**Given** que completo el formulario y hago clic en "Confirmar Rechazo"
**When** el sistema procesa el rechazo
**Then** ejecuta el siguiente flujo en una transacción:

```typescript
// API Route: /api/ordenes-trabajo/{otId}/rechazar
export async function POST(
  request: Request,
  { params }: { params: { otId: string } }
) {
  const { motivo, verificacion, prioridad } = await request.json();
  const session = await getServerSession();

  // 1. Verificar permisos (FR101)
  if (!session.user.capabilities.includes('can_create_failure_report')) {
    return new Response('Unauthorized', { status: 403 });
  }

  // 2. Verificar que la OT existe y está completada
  const ot = await prisma.ordenTrabajo.findUnique({
    where: { id: params.otId },
    include: {
      equipo: true,
      tecnicoAsignado: true, // María
      creador: true // Carlos
    }
  });

  if (!ot || ot.estado !== 'COMPLETADA') {
    return new Response('OT no encontrada o no completada', { status: 404 });
  }

  // 3. Verificar que el creador es el usuario actual (solo el creador puede rechazar)
  if (ot.creadorId !== session.user.id) {
    return new Response('Solo el creador puede rechazar la reparación', { status: 403 });
  }

  // 4. Procesar rechazo y generación de re-trabajo en transacción
  const resultado = await prisma.$transaction(async (tx) => {
    // 4.1. Marcar OT actual como RECHAZADA
    const otRechazada = await tx.ordenTrabajo.update({
      where: { id: params.otId },
      data: {
        estado: 'RECHAZADA',
        rechazoMotivo: motivo,
        rechazoVerificacion: verificacion,
        rechazoFecha: new Date(),
        rechazadoPor: session.user.id
      }
    });

    // 4.2. Generar nueva OT de re-trabajo (FR101)
    const otRetrabajo = await tx.ordenTrabajo.create({
      data: {
        codigo: await generarCodigoOT(),
        titulo: `[RE-TRABAJO] ${ot.titulo}`,
        descripcion: `
**OT Original:** ${ot.codigo}
**Motivo de Rechazo:** ${verificacion}
**Descripción del Problema:**
${motivo}

**Comentarios de la OT Original:**
${ot.comentarios || 'Sin comentarios'}
        `.trim(),
        tipo: 'CORRECTIVO', // Re-trabajo es correctivo
        prioridad: prioridad, // ALTA por defecto
        estado: 'PENDIENTE',

        // Asociación
        equipoId: ot.equipoId,
        otPadreId: ot.id, // Referencia a OT rechazada

        // Asignación: NO asignar automáticamente, dejar que Elena asigne
        tecnicoAsignadoId: null,

        // Fechas
        fechaCreacion: new Date(),
        fechaLimite: calcularFechaLimite(prioridad), // 24h para ALTA, 48h para MEDIA, 72h para BAJA
        duracionEstimadaMinutos: ot.duracionEstimadaMinutos || 60,

        // Metadata
        creadoPor: session.user.id,
        etiquetas: ['RETRABAJO', 'RECHAZO', prioridad]
      }
    });

    // 4.3. Crear comentarios en la OT rechazada
    await tx.comentario.create({
      data: {
        ordenTrabajoId: ot.id,
        usuarioId: session.user.id,
        contenido: `Reparación rechazada. Motivo: ${verificacion}. Se generó OT de re-trabajo: ${otRetrabajo.codigo}`,
        tipo: 'RECHAZO'
      }
    });

    return { otRechazada, otRetrabajo };
  });

  // 5. Notificar a María (técnico que hizo la reparación) y a Elena
  await Promise.all([
    sendNotification(ot.tecnicoAsignadoId, {
      tipo: 'OT_RECHAZADA',
      titulo: `⚠️ Reparación Rechazada: ${ot.codigo}`,
      mensaje: `Carlos rechazó la reparación de ${ot.equipo?.nombre}. Motivo: ${verificacion}. Se generó OT de re-trabajo ${resultado.otRetrabajo.codigo}.`,
      actionUrl: `/ordenes-trabajo/${resultado.otRetrabajo.id}`,
      prioridad: 'ALTA'
    }),
    sendNotification(usersWithCapability('can_view_all_ots'), {
      tipo: 'OT_RETRABAJO_CREADA',
      titulo: `🔄 OT de Re-trabajo Creada: ${resultado.otRetrabajo.codigo}`,
      mensaje: `Se generó OT de re-trabajo para ${ot.equipo?.nombre} con prioridad ${prioridad}.`,
      actionUrl: `/ordenes-trabajo/${resultado.otRetrabajo.id}`,
      prioridad: prioridad === 'ALTA' ? 'ALTA' : 'MEDIA'
    })
  ]);

  return Response.json({
    success: true,
    otRechazada: resultado.otRechazada,
    otRetrabajo: resultado.otRetrabajo
  });
}

function calcularFechaLimite(prioridad: string): Date {
  const ahora = new Date();
  const horas = prioridad === 'ALTA' ? 24 : prioridad === 'MEDIA' ? 48 : 72;
  return new Date(ahora.getTime() + horas * 60 * 60 * 1000);
}
```

**Acceptance Criteria - Resultado del Rechazo:**

**Given** que el rechazo se procesa exitosamente
**When** la operación se completa
**Then**:
1. La OT original cambia a estado "RECHAZADA"
2. Se crea una nueva OT con:
   - Título prefijado con "[RE-TRABAJO]"
   - Tipo: CORRECTIVO
   - Prioridad: seleccionada en el formulario (ALTA por defecto)
   - Estado: PENDIENTE
   - `otPadreId` apunta a la OT rechazada
   - Descripción incluye motivo y verificación
3. María (Técnica) recibe notificación push
4. Elena recibe notificación de la nueva OT
5. Veo toast de éxito: "Reparación rechazada. Se generó OT {codigo}"

**Given** que voy a la OT de re-trabajo
**When** la vista detalle carga
**Then** veo un banner destacado:

```tsx
<RetrabajoBanner variant="warning">
  <strong>🔄 Esta es una OT de Re-trabajo</strong><br />
  OT Original: <Link to={`/ordenes-trabajo/${ot.otPadreId}`}>{ot.otPadre?.codigo}</Link><br />
  Motivo de Rechazo: {ot.otPadre?.rechazoVerificacion}<br />
  Rechazada por: {ot.otPadre?.rechazadoPor?.nombre} el {ot.otPadre?.rechazoFecha?.toLocaleString()}
</RetrabajoBanner>
```

**Validaciones de Reglas de Negocio:**

**Given** que intento rechazar una OT
**When** la OT NO está en estado "COMPLETADA"
**Then** el botón "Rechazar Reparación" no se muestra
**And** veo mensaje: "Solo se pueden rechazar reparaciones completadas"

**Given** que intento rechazar una OT
**When** NO soy el creador de la OT
**Then** no veo el botón "Rechazar Reparación"
**And** veo mensaje: "Solo el creador del aviso puede rechazar la reparación"

**Given** que intento rechazar una OT ya rechazada anteriormente
**When** la OT ya tiene estado "RECHAZADA"
**Then** veo mensaje: "Esta reparación ya fue rechazada previamente"

**Escenarios de Error:**

**Given** que intento rechazar una OT
**When** no completo el campo obligatorio "motivo"
**Then** veo validación inline: "El motivo es obligatorio (mínimo 20 caracteres)"
**And** el botón "Confirmar Rechazo" permanece deshabilitado

**Consideraciones de UX:**

- El botón de rechazo solo es visible para el creador de la OT
- Se requiere explicación detallada del problema (mínimo 20 caracteres)
- La prioridad ALTA asigna la OT inmediatamente al primer técnico disponible
- Historial completo de rechazos visible en la OT original

---

## Story 10.2: Búsqueda Universal Predictiva

**Como** Usuario del sistema (cualquier rol),
**quiero tener un campo de búsqueda universal que me permita buscar equipos, componentes, repuestos, OTs, técnicos y usuarios en tiempo real,
**para** encontrar rápidamente cualquier entidad sin necesidad de navegar por múltiples menús.

**Acceptance Criteria - Campo de Búsqueda Universal:**

**Given** que estoy logueado en el sistema (cualquier usuario, sin capability específica - FR102)
**When** veo el header de la aplicación
**Then** hay un campo de búsqueda universal siempre visible:

```tsx
// Header con Búsqueda Universal
<Header>
  <Logo />

  {/* FR102: Búsqueda universal sin capability específica */}
  <GlobalSearch>
    <SearchInput
      placeholder="Buscar equipos, repuestos, OTs, técnicos..."
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={expandResults}
      onBlur={collapseResults}
      autoFocus={false}
      debounceMs={200} // FR102: <200ms
    />

    {/* Resultados en dropdown */}
    {searchQuery.length >= 2 && (
      <SearchResults>
        {isLoading ? (
          <SearchLoading>
            <Spinner />
            Buscando...
          </SearchLoading>
        ) : results.length > 0 ? (
          <>
            <ResultsGroup title="Equipos y Componentes">
              {results.equipos.slice(0, 3).map(equipo => (
                <SearchResultItem
                  key={equipo.id}
                  icon="box"
                  title={`${equipo.codigo} - ${equipo.nombre}`}
                  subtitle={equipo.jerarquia}
                  onClick={() => navigate(`/equipos/${equipo.id}`)}
                />
              ))}
              {results.equipos.length > 3 && (
                <ViewAll onClick={() => navigate(`/busqueda?q=${searchQuery}&type=equipos`)}>
                  Ver todos los equipos ({results.equipos.length})
                </ViewAll>
              )}
            </ResultsGroup>

            <ResultsGroup title="Repuestos">
              {results.repuestos.slice(0, 3).map(repuesto => (
                <SearchResultItem
                  key={repuesto.id}
                  icon="package"
                  title={`${repuesto.codigo} - ${repuesto.nombre}`}
                  subtitle={`Stock: ${repuesto.stockActual} | Ubicación: ${repuesto.ubicacionAlmacen}`}
                  onClick={() => navigate(`/repuestos/${repuesto.id}`)}
                />
              ))}
              {results.repuestos.length > 3 && (
                <ViewAll onClick={() => navigate(`/busqueda?q=${searchQuery}&type=repuestos`)}>
                  Ver todos los repuestos ({results.repuestos.length})
                </ViewAll>
              )}
            </ResultsGroup>

            <ResultsGroup title="Órdenes de Trabajo">
              {results.ots.slice(0, 3).map(ot => (
                <SearchResultItem
                  key={ot.id}
                  icon="clipboard"
                  title={`${ot.codigo} - ${ot.titulo}`}
                  subtitle={`Estado: ${ot.estado} | Prioridad: ${ot.prioridad}`}
                  onClick={() => navigate(`/ordenes-trabajo/${ot.id}`)}
                />
              ))}
              {results.ots.length > 3 && (
                <ViewAll onClick={() => navigate(`/busqueda?q=${searchQuery}&type=ots`)}>
                  Ver todas las OTs ({results.ots.length})
                </ViewAll>
              )}
            </ResultsGroup>

            <ResultsGroup title="Técnicos y Usuarios">
              {results.usuarios.slice(0, 3).map(usuario => (
                <SearchResultItem
                  key={usuario.id}
                  icon="user"
                  title={usuario.nombre}
                  subtitle={usuario.role}
                  avatar={usuario.avatar}
                  onClick={() => navigate(`/usuarios/${usuario.id}`)}
                />
              ))}
              {results.usuarios.length > 3 && (
                <ViewAll onClick={() => navigate(`/busqueda?q=${searchQuery}&type=usuarios`)}>
                  Ver todos los usuarios ({results.usuarios.length})
                </ViewAll>
              )}
            </ResultsGroup>

            <ViewAllResults onClick={() => navigate(`/busqueda?q=${searchQuery}`)}>
              Ver todos los resultados ({results.totalCount})
            </ViewAllResults>
          </>
        ) : (
          <NoResults>
            No se encontraron resultados para "{searchQuery}"
          </NoResults>
        )}
      </SearchResults>
    )}
  </GlobalSearch>

  <UserMenu />
</Header>
```

**Acceptance Criteria - API de Búsqueda Universal:**

**Given** que escribo en el campo de búsqueda
**When** paso el debounce de 200ms (FR102)
**Then** el sistema ejecuta la búsqueda en todas las entidades:

```typescript
// API Route: /api/busqueda/universal
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const tipos = searchParams.get('type')?.split(',') || ['equipos', 'repuestos', 'ots', 'usuarios'];

  if (q.length < 2) {
    return Response.json({ resultados: {} });
  }

  // Buscar en paralelo todas las entidades (FR102)
  const resultados = await Promise.all([
    // 1. Buscar Equipos y Componentes
    tipos.includes('equipos') ? buscarEquipos(q) : Promise.resolve([]),

    // 2. Buscar Repuestos
    tipos.includes('repuestos') ? buscarRepuestos(q) : Promise.resolve([]),

    // 3. Buscar OTs
    tipos.includes('ots') ? buscarOTs(q) : Promise.resolve([]),

    // 4. Buscar Usuarios y Técnicos
    tipos.includes('usuarios') ? buscarUsuarios(q) : Promise.resolve([])
  ]);

  const [equipos, repuestos, ots, usuarios] = resultados;

  return Response.json({
    equipos,
    repuestos,
    ots,
    usuarios,
    totalCount: equipos.length + repuestos.length + ots.length + usuarios.length
  });
}

// Búsqueda de Equipos
async function buscarEquipos(q: string) {
  const equipos = await prisma.equipo.findMany({
    where: {
      OR: [
        { codigo: { contains: q, mode: 'insensitive' } },
        { nombre: { contains: q, mode: 'insensitive' } },
        { descripcion: { contains: q, mode: 'insensitive' } },
        // Búsqueda en jerarquía (ej: "planta1 linea1")
        {
          linea: {
            planta: {
              OR: [
                { nombre: { contains: q, mode: 'insensitive' } },
                { codigo: { contains: q, mode: 'insensitive' } }
              ]
            }
          }
        }
      ],
      activo: true
    },
    include: {
      linea: {
        include: {
          planta: true
        }
      },
      componente: true
    },
    take: 10 // Limitar a 10 resultados por entidad en búsqueda rápida
  });

  return equipos.map(equipo => ({
    id: equipo.id,
    codigo: equipo.codigo,
    nombre: equipo.nombre,
    tipo: equipo.tipo,
    jerarquia: `${equipo.linea?.planta?.nombre} > ${equipo.linea?.nombre} > ${equipo.nombre}`,
    icon: 'box'
  }));
}

// Búsqueda de Repuestos
async function buscarRepuestos(q: string) {
  const repuestos = await prisma.repuesto.findMany({
    where: {
      OR: [
        { codigo: { contains: q, mode: 'insensitive' } },
        { nombre: { contains: q, mode: 'insensitive' } },
        { descripcion: { contains: q, mode: 'insensitive' } },
        { fabricante: { contains: q, mode: 'insensitive' } }
      ],
      activo: true
    },
    include: {
      proveedor: true
    },
    take: 10
  });

  return repuestos.map(repuesto => ({
    id: repuesto.id,
    codigo: repuesto.codigo,
    nombre: repuesto.nombre,
    stockActual: repuesto.stockActual,
    stockMinimo: repuesto.stockMinimo,
    ubicacionAlmacen: repuesto.ubicacionAlmacen,
    icon: 'package'
  }));
}

// Búsqueda de OTs
async function buscarOTs(q: string) {
  const ots = await prisma.ordenTrabajo.findMany({
    where: {
      OR: [
        { codigo: { contains: q, mode: 'insensitive' } },
        { titulo: { contains: q, mode: 'insensitive' } },
        { descripcion: { contains: q, mode: 'insensitive' } }
      ]
    },
    include: {
      equipo: true,
      tecnicoAsignado: true
    },
    orderBy: { fechaCreacion: 'desc' },
    take: 10
  });

  return ots.map(ot => ({
    id: ot.id,
    codigo: ot.codigo,
    titulo: ot.titulo,
    estado: ot.estado,
    prioridad: ot.prioridad,
    equipo: ot.equipo?.nombre,
    tecnico: ot.tecnicoAsignado?.nombre,
    icon: 'clipboard'
  }));
}

// Búsqueda de Usuarios
async function buscarUsuarios(q: string) {
  const usuarios = await prisma.user.findMany({
    where: {
      OR: [
        { nombre: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } }
      ],
      activo: true
    },
    take: 10
  });

  return usuarios.map(usuario => ({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.role,
    avatar: usuario.avatar,
    icon: 'user'
  }));
}
```

**Acceptance Criteria - Búsqueda por Tipo de Entidad:**

**Given** que escribo "prensa" en el buscador
**When** los resultados se muestran
**Then** veo resultados de múltiples entidades:

```tsx
// Resultados para "prensa"
{
  equipos: [
    { codigo: 'EQ-001', nombre: 'Prensa Hidráulica-01', jerarquia: 'Planta Madrid > Línea Ensamblaje' }
  ],
  repuestos: [
    { codigo: 'REP-123', nombre: 'Prensa Hidráulica 50T', stockActual: 2 }
  ],
  ots: [
    { codigo: 'OT-4567', titulo: 'Mantenimiento de prensa hidráulica', estado: 'EN_PROGRESO' }
  ],
  usuarios: []
}
```

**Given** que escribo "maría"
**When** los resultados se muestran
**Then** busca en todos los campos donde pueda aparecer "maría":
- Usuarios con nombre "María"
- OTs creadas o asignadas a María
- Equipos donde María es responsable
- Repuestos donde María aparece en comentarios

**Acceptance Criteria - Pagina de Búsqueda Avanzada:**

**Given** que hago clic en "Ver todos los resultados"
**When** navego a `/busqueda?q={query}`
**Then** veo una página con todos los resultados organizados:

```tsx
// Page: /busqueda
<SearchPage query={searchQuery}>
  <SearchFilters>
    <FilterToggle
      label="Tipo de Entidad"
      options={[
        { value: 'todos', label: 'Todos' },
        { value: 'equipos', label: 'Equipos y Componentes' },
        { value: 'repuestos', label: 'Repuestos' },
        { value: 'ots', label: 'Órdenes de Trabajo' },
        { value: 'usuarios', label: 'Usuarios' }
      ]}
    />

    <FilterToggle
      label="Ordenar por"
      options={[
        { value: 'relevancia', label: 'Relevancia' },
        { value: 'fecha', label: 'Fecha de creación' },
        { value: 'alfabetico', label: 'A-Z' }
      ]}
    />
  </SearchFilters>

  <ResultsSummary>
    Se encontraron {totalCount} resultados para "{searchQuery}"
  </ResultsSummary>

  <ResultsGrid>
    {allResults.map(result => (
      <ResultCard key={result.id} result={result} />
    ))}
  </ResultsGrid>
</SearchPage>
```

**Validaciones de Performance:**

**Given** que escribo en el campo de búsqueda
**When** paso el debounce de 200ms
**Then** la búsqueda responde en < 200ms (FR102)

**Given** que busco con 1000 usuarios y 10000 entidades
**When** la búsqueda se ejecuta
**Then** los resultados se muestran en < 300ms usando índices de BD

**Consideraciones de UX:**

- Atajo de teclado: "/" abre la búsqueda universal (como cmd+k en Mac)
- Highlight de términos coincidentes en los resultados
- Búsqueda fuzzy para errores tipográficos (ej: "prensa hidraulica" encuentra "prensa hidráulica")
- Historial de búsquedas recientes

---

## Story 10.3: Preferencias de Notificación Personalizables

**Como** Usuario del sistema,
**quiero configurar mis preferencias de notificación por tipo de evento,
**para** recibir solo las notificaciones que me interesan y evitar spam de notificaciones irrelevantes.

**Acceptance Criteria - Configuración de Preferencias:**

**Given** que accedo a `/perfil/notificaciones`
**When** la página carga
**Then** veo un formulario con preferencias de notificación:

```tsx
// Page: /perfil/notificaciones
<PageLayout title="Preferencias de Notificación">
  <form onSubmit={handleGuardarPreferencias}>
    <Section title="Notificaciones Push (PWA/Móvil)">
      <FormField
        name="pushEnabled"
        label="Recibir notificaciones push en mi dispositivo"
        type="toggle"
        defaultValue={preferencias.pushEnabled}
        helpText="Las notificaciones push se muestran en tu dispositivo incluso cuando la app está cerrada"
      />

      {preferencias.pushEnabled && (
        <NotificationTypes>
          <h3>Tipos de Notificación</h3>

          {/* FR105: habilitar/deshabilitar por tipo */}
          <NotificationGroup title="Ordenes de Trabajo">
            <NotificationToggle
              name="ot_recibido"
              label="Recibido"
              description="Cuando me asignan una nueva OT"
              checked={preferencias.ot_recibido}
              onChange={(checked) => updatePreferencia('ot_recibido', checked)}
            />

            <NotificationToggle
              name="ot_autorizado"
              label="Autorizado"
              description="Cuando mi OT se autoriza (pasa a ASIGNADA)"
              checked={preferencias.ot_autorizado}
              onChange={(checked) => updatePreferencia('ot_autorizado', checked)}
            />

            <NotificationToggle
              name="ot_en_progreso"
              label="En Progreso"
              description="Cuando mi OT pasa a EN_PROGRESO"
              checked={preferencias.ot_en_progreso}
              onChange={(checked) => updatePreferencia('ot_en_progreso', checked)}
            />

            <NotificationToggle
              name="ot_completado"
              label="Completado"
              description="Cuando mi OT se completa"
              checked={preferencias.ot_completado}
              onChange={(checked) => updatePreferencia('ot_completado', checked)}
            />

            <NotificationToggle
              name="ot_rechazado"
              label="Rechazado"
              description="Cuando mi reparación es rechazada"
              checked={preferencias.ot_rechazado}
              onChange={(checked) => updatePreferencia('ot_rechazado', checked)}
            />
          </NotificationGroup>

          <NotificationGroup title="Alertas de Stock">
            <NotificationToggle
              name="stock_minimo"
              label="Stock Mínimo"
              description="Cuando un repuesto baja de stock mínimo"
              checked={preferencias.stock_minimo}
              onChange={(checked) => updatePreferencia('stock_minimo', checked)}
              capability="can_manage_stock"
            />

            <NotificationToggle
              name="stock_alerta_pedidos"
              label="Pedidos Generados"
              description="Cuando se genera un pedido de repuestos"
              checked={preferencias.stock_alerta_pedidos}
              onChange={(checked) => updatePreferencia('stock_alerta_pedidos', checked)}
              capability="can_manage_stock"
            />
          </NotificationGroup>

          <NotificationGroup title="Rutinas de Mantenimiento">
            <NotificationToggle
              name="rutina_asignada"
              label="Rutina Asignada"
              description="Cuando se asigna una rutina a mi nombre"
              checked={preferencias.rutina_asignada}
              onChange={(checked) => updatePreferencia('rutina_asignada', checked)}
            />

            <NotificationToggle
              name="rutina_vencida"
              label="Rutina Vencida"
              description="Cuando una OT preventiva vence"
              checked={preferencias.rutina_vencida}
              onChange={(checked) => updatePreferencia('rutina_vencida', checked)}
            />
          </NotificationGroup>

          <NotificationGroup title="Sistema">
            <NotificationToggle
              name="sistema_mantenimiento"
              label="Mantenimiento Programado"
              description="Notificaciones sobre mantenimiento del sistema"
              checked={preferencias.sistema_mantenimiento}
              onChange={(checked) => updatePreferencia('sistema_mantenimiento', checked)}
            />

            <NotificationToggle
              name="sistema_seguridad"
              label="Seguridad"
              description="Alertas de seguridad y cambios de contraseña"
              checked={preferencias.sistema_seguridad}
              onChange={(checked) => updatePreferencia('sistema_seguridad', checked)}
            />
          </NotificationGroup>
        </NotificationTypes>
      )}
    </Section>

    <Section title="Horario Silencioso">
      <FormField
        name="modoSilencioso"
        label="Activar Modo Silencioso"
        type="toggle"
        defaultValue={preferencias.modoSilencioso}
        helpText="No recibir notificaciones push en horario silencioso"
      />

      {modoSilencioso && (
        <SilenciosoConfig>
          <FormField
            name="silenciosoInicio"
            label="Desde"
            type="time"
            defaultValue="22:00"
          />

          <FormField
            name="silenciosoFin"
            label="Hasta"
            type="time"
            defaultValue="07:00"
          />
        </SilenciosoConfig>
      )}
    </Section>

    <Section title="Resumen">
      <NotificationSummary>
        <SummaryItem>
          <Icon>🔔</Icon>
          Notificaciones activas: {countActivas()}
        </SummaryItem>
        <SummaryItem>
          <Icon>🔕</Icon>
          Notificaciones desactivadas: {countDesactivadas()}
        </SummaryItem>
      </NotificationSummary>
    </Section>

    <Button type="submit">Guardar Preferencias</Button>
  </form>
</PageLayout>
```

**Acceptance Criteria - Guardar Preferencias:**

**Given** que configuro mis preferencias y hago clic en "Guardar"
**When** la operación se completa
**Then** las preferencias se guardan en BD:

```typescript
// API Route: /api/usuario/preferencias
export async function POST(request: Request) {
  const session = await getServerSession();
  const preferencias = await request.json();

  const preferenciasActualizadas = await prisma.usuarioPreferencias.upsert({
    where: { usuarioId: session.user.id },
    create: {
      usuarioId: session.user.id,
      ...preferencias,
      updatedAt: new Date()
    },
    update: {
      ...preferencias,
      updatedAt: new Date()
    }
  });

  return Response.json({ success: true, preferencias: preferenciasActualizadas });
}
```

**Acceptance Criteria - Filtrado de Notificaciones:**

**Given** que Elena me asigna una OT
**When** mi preferencia `ot_autorizado` está desactivada
**Then** NO recibo notificación push
**But** la OT aparece en "Mis OTs" en la app

**Given** que estoy en modo silencioso (22:00 - 07:00)
**When** ocurre un evento que generaría notificación
**Then** la notificación se suprime temporalmente
**And** se acumula en "Notificaciones perdidas" para mostrarlas después del horario silencioso

```typescript
// Verificar si se debe enviar notificación
async function shouldSendNotification(
  userId: string,
  tipoNotificacion: string
): Promise<boolean> {
  // 1. Obtener preferencias del usuario
  const preferencias = await prisma.usuarioPreferencias.findUnique({
    where: { usuarioId }
  });

  if (!preferencias) return true; // Sin preferencias = enviar todas

  // 2. Verificar si el tipo está habilitado
  if (!preferencias[tipoNotificacion]) {
    return false; // Desactivado
  }

  // 3. Verificar modo silencioso
  if (preferencias.modoSilencioso) {
    const ahora = new Date();
    const hora = ahora.getHours() * 60 + ahora.getMinutes();
    const inicio = parseTime(preferencias.silenciosoInicio); // 22:00 = 1320
    const fin = parseTime(preferencias.silenciosoFin); // 07:00 = 420

    if (hora >= inicio || hora < fin) {
      // Está en horario silencioso
      await prisma.notificacionPerdida.create({
        data: {
          usuarioId,
          tipoNotificacion,
          datos: notificationData,
          acumuladoEn: new Date()
        }
      });
      return false;
    }
  }

  return true;
}
```

**Validaciones de UX:**

- Preferencias se aplican inmediatamente al guardar
- Validación: al menos 1 tipo de notificación debe estar activo
- Opción "Activar todas" / "Desactivar todas" para cambios masivos
- Reset a valores por defecto disponibles

---

## Story 10.4: Comentarios con Timestamp en OTs

**Como** María (Técnica con capability `can_update_own_ot`),
**quiero agregar comentarios con timestamp a las OTs que tengo asignadas y están en progreso,
**para** documentar el progreso de la reparación y mantener un registro comunicativo con otros usuarios.

**Acceptance Criteria - Sección de Comentarios:**

**Given** que estoy en una OT asignada en estado EN_PROGRESO
**When** voy a la sección de comentarios
**Then** veo:

```tsx
// Vista de OT: Sección de Comentarios (FR106)
<OTDetail ot={ot}>
  {/* ... otras secciones ... */}

  <Section title="Comentarios y Progreso">
    <CommentsList>
      {/* Comentarios existentes ordenados por timestamp */}
      {ot.comentarios.map(comentario => (
        <Comment key={comentario.id}>
          <CommentHeader>
            <Avatar user={comentario.usuario} size="sm" />
            <CommentMeta>
              <CommentAuthor>{comentario.usuario.nombre}</CommentAuthor>
              <CommentTimestamp>
                {formatRelativeTime(comentario.creadoEn)}
                {comentario.creadoEn.toLocaleString()}
              </CommentTimestamp>
            </CommentMeta>
          </CommentHeader>

          <CommentBody>
            {comentario.contenido}
          </CommentBody>

          {comentario.adjuntos && comentario.adjuntos.length > 0 && (
            <CommentAttachments>
              {comentario.adjuntos.map(adjunto => (
                <AttachmentPreview key={adjunto.id}>
                  {adjunto.tipo === 'foto' ? (
                    <img src={adjunto.url} alt="Adjunto" />
                  ) : (
                    <FileIcon fileName={adjunto.nombre} />
                  )}
                </AttachmentPreview>
              ))}
            </CommentAttachments>
          )}

          <CommentActions>
            {comentario.usuarioId === session.user.id && (
              <Button size="xs" variant="ghost" onClick={() => editComment(comentario.id)}>
                Editar
              </Button>
            )}
          </CommentActions>
        </Comment>
      ))}
    </CommentsList>

    {/* Formulario para agregar comentario */}
    <AddCommentForm>
      <FormField
        name="contenido"
        label="Agregar Comentario"
        type="textarea"
        placeholder="Documente el progreso, problemas encontrados, observaciones..."
        rows={3}
        required
        autoFocus={false}
      />

      <AttachmentSection>
        <Button variant="outline" size="sm" onClick={triggerFileUpload}>
          📎 Adjuntar Fotos
        </Button>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </AttachmentSection>

      <ButtonActions>
        <Button type="submit" disabled={!contenido}>
          Publicar Comentario
        </Button>
      </ButtonActions>
    </AddCommentForm>
  </Section>
</OTDetail>
```

**Acceptance Criteria - Crear Comentario:**

**Given** que estoy en una OT EN_PROGRESO
**When** escribo un comentario y hago clic en "Publicar"
**Then** el comentario se crea:

```typescript
// API Route: /api/ordenes-trabajo/{otId}/comentarios
export async function POST(
  request: Request,
  { params }: { params: { otId: string } }
) {
  const session = await getServerSession();
  const { contenido, adjuntos } = await request.json();

  // 1. Verificar permisos (FR106)
  if (!session.user.capabilities.includes('can_update_own_ot')) {
    return new Response('Unauthorized', { status: 403 });
  }

  // 2. Verificar que la OT existe y está asignada a mi
  const ot = await prisma.ordenTrabajo.findUnique({
    where: { id: params.otId }
  });

  if (!ot || ot.tecnicoAsignadoId !== session.user.id) {
    return new Response('No puedes comentar en esta OT', { status: 403 });
  }

  if (ot.estado === 'COMPLETADA' || ot.estado === 'DESCARTADA') {
    return new Response('No se pueden agregar comentarios a OTs completadas o descartadas', { status: 400 });
  }

  // 3. Crear comentario
  const comentario = await prisma.comentario.create({
    data: {
      ordenTrabajoId: params.otId,
      usuarioId: session.user.id,
      contenido,
      tipo: 'PROGRESO', // Tipos: PROGRESO, FOTO, NOTA, RECHAZO, etc.
      creadoEn: new Date()
    }
  });

  // 4. Procesar adjuntos (fotos, archivos)
  if (adjuntos && adjuntos.length > 0) {
    for (const adjunto of adjuntos) {
      await prisma.comentarioAdjunto.create({
        data: {
          comentarioId: comentario.id,
          tipo: adjunto.tipo,
          nombre: adjunto.nombre,
          url: adjunto.url,
          tamañoBytes: adjunto.tamañoBytes
        }
      });
    }
  }

  // 5. Actualizar `updatedAt` de la OT
  await prisma.ordenTrabajo.update({
    where: { id: params.otId },
    data: { updatedAt: new Date() }
  });

  // 6. Notificar a usuarios interesados
  await notifyOTComment(params.otId, comentario);

  return Response.json({ success: true, comentario });
}
```

**Acceptance Criteria - Visualización de Timestamps:**

**Given** que veo el listado de comentarios
**When** los comentarios se muestran
**Then** cada comentario tiene un timestamp relativo:

```tsx
// Formatos de timestamp
<CommentTimestamp>
  {/* Formato relativo (hace X tiempo) */}
  <RelativeTime>hace 5 minutos</RelativeTime>

  {/* Formato completo al hacer hover */}
  <FullTime title={comentario.creadoEn.toLocaleString()}>
    {comentario.creadoEn.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short'
    })}
  </FullTime>
</CommentTimestamp>
```

**Given** que un comentario se hace hace 5 minutos
**When** lo veo en pantalla
**Then** muestra: "hace 5 minutos"

**Given** que un comentario se hizo hace 2 horas
**When** lo veo en pantalla
**Then** muestra: "hace 2 horas"

**Given** que un comentario se hizo ayer
**When** lo veo en pantalla
**Then** muestra: "ayer a las 15:30"

**Acceptance Criteria - Comentarios Automáticos del Sistema:**

**Given** que ocurre un evento importante en la OT
**When** el estado cambia
**Then** el sistema agrega automáticamente comentarios de tracking:

```typescript
// Comentarios automáticos por eventos del sistema
async function addSystemComment(otId: string, evento: string, datos: any) {
  const comentariosAutomaticos = {
    'OT_ASIGNADA': `OT asignada a ${datos.tecnico?.nombre}`,
    'OT_EN_PROGRESO': `OT pasó a EN_PROGRESO. Técnico: ${datos.tecnico?.nombre}`,
    'OT_PENDIENTE_REPUESTO': `OT en PENDIENTE_REPUESTO. Esperando: ${datos.repuesto?.nombre}`,
    'OT_COMPLETADA': `OT completada. Duración: ${datos.duracionReal} minutos`,
    'OT_RECHAZADA': `❌ Reparación rechazada. Motivo: ${datos.motivo}`,
    'OT_REPUESTO_USADO': `Repuesto usado: ${datos.repuesto?.nombre} (${datos.cantidad} u.)`,
    'OT_FOTO_ADJUNTA': `📷 Foto adjuntada: ${datos.fotoNombre}`
  };

  const comentario = comentariosAutomaticos[evento];
  if (!comentario) return;

  await prisma.comentario.create({
    data: {
      ordenTrabajoId: otId,
      usuarioId: null, // Comentario del sistema (sin usuario)
      contenido: comentario,
      tipo: 'SISTEMA',
      creadoEn: new Date()
    }
  });
}
```

**Validaciones de Performance:**

**Given** que agrego un comentario
**When** la operación se ejecuta
**Then** aparece en pantalla inmediatamente (actualización vía SSE)
**And** el tiempo de respuesta es < 300ms

---

## Story 10.5: Fotos Antes/Después en Reparaciones

**Como** María (Técnica con capability `can_update_own_ot`),
**quiero adjuntar fotos antes y después de la reparación a las OTs,
**para** documentar visualmente el estado del equipo y cumplir con requerimientos de auditoría y calidad.

**Acceptance Criteria - UI de Adjunto de Fotos:**

**Given** que estoy en una OT EN_PROGRESO
**When** voy a la sección de fotos
**Then** veo:

```tsx
// Vista de OT: Sección de Fotos (FR107)
<OTDetail ot={ot}>
  <Section title="Fotos de la Reparación">
    <FotosGrid>
      {/* FR107: Fotos ANTES de la reparación */}
      <FotoSection title="Antes de la Reparación">
        {fotosAntes.length > 0 ? (
          fotosAntes.map(foto => (
            <FotoCard key={foto.id}>
              <FotoPreview src={foto.url} alt="Antes" onClick={() => openLightbox(foto)} />
              <FotoMeta>
                <FotoTimestamp>
                  {formatRelativeTime(foto.creadoEn)}
                </FotoTimestamp>
                <FotoUser>
                  Subida por {foto.usuario.nombre}
                </FotoUser>
              </FotoMeta>
            </FotoCard>
          ))
        ) : (
          <EmptyState icon="camera" message="No hay fotos 'antes'" />
        )}

        {puedeAgregarFoto && ot.estado === 'EN_PROGRESO' && (
          <UploadButton variant="outline" onClick={() => uploadFoto('ANTES')}>
            📷 Agregar Foto "Antes"
          </UploadButton>
        )}
      </FotoSection>

      {/* FR107: Fotos DESPUÉS de la reparación */}
      <FotoSection title="Después de la Reparación">
        {fotosDespues.length > 0 ? (
          fotosDespues.map(foto => (
            <FotoCard key={foto.id}>
              <FotoPreview src={foto.url} alt="Después" onClick={() => openLightbox(foto)} />
              <FotoMeta>
                <FotoTimestamp>
                  {formatRelativeTime(foto.creadoEn)}
                </FotoTimestamp>
                <FotoUser>
                  Subida por {foto.usuario.nombre}
                </FotoUser>
              </FotoMeta>
            </FotoCard>
          ))
        ) : (
          <EmptyState icon="camera" message="No hay fotos 'después'" />
        )}

        {puedeAgregarFoto && (ot.estado === 'EN_PROGRESO' || ot.estado === 'COMPLETADA') && (
          <UploadButton variant="outline" onClick={() => uploadFoto('DESPUES')}>
            📷 Agregar Foto "Después"
          </UploadButton>
        )}
      </FotoSection>
    </FotosGrid>

    {/* Lightbox para ver fotos en pantalla completa */}
    {lightboxOpen && (
      <Lightbox>
        <LightboxImage src={currentFoto.url} alt="Foto" />
        <LightboxControls>
          <Button onClick={previousFoto}>← Anterior</Button>
          <Button onClick={closeLightbox}>✕ Cerrar</Button>
          <Button onClick={nextFoto}>Siguiente →</Button>
        </LightboxControls>
      </Lightbox>
    )}
  </Section>
</OTDetail>
```

**Acceptance Criteria - Carga de Fotos:**

**Given** que hago clic en "Agregar Foto 'Antes'"
**When** se abre el selector de archivos
**Then** puedo seleccionar múltiples fotos de la galería:

```typescript
// Handler de selección de fotos
async function handleFotoSelect(event: React.ChangeEvent<HTMLInputElement>, tipo: 'ANTES' | 'DESPUES') {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  // 1. Subir fotos al servidor
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('fotos', files[i]);
  }
  formData.append('tipo', tipo);
  formData.append('otId', ot.id);

  const response = await fetch(`/api/ordenes-trabajo/${ot.id}/fotos`, {
    method: 'POST',
    body: formData
  });

  const { fotos } = await response.json();

  // 2. Agregar comentario automático (FR107 + Story 10.4)
  await addSystemComment(ot.id, 'OT_FOTO_ADJUNTA', {
    tipo,
    cantidad: fotos.length,
    fotoNombre: tipo === 'ANTES' ? 'Foto "Antes"' : 'Foto "Después"'
  });

  // 3. Actualizar lista de fotos vía SSE
  setFotosActuales(prev => [...prev, ...fotos]);
}
```

**Acceptance Criteria - API de Carga de Fotos:**

```typescript
// API Route: /api/ordenes-trabajo/{otId}/fotos
export async function POST(
  request: Request,
  { params }: { params: { otId: string } }
) {
  const session = await getServerSession();

  // 1. Verificar permisos (FR107)
  if (!session.user.capabilities.includes('can_update_own_ot')) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const tipo = formData.get('tipo') as 'ANTES' | 'DESPUES';
  const fotos = formData.getAll('fotos') as File[];

  // 2. Verificar que la OT existe y está asignada a mi
  const ot = await prisma.ordenTrabajo.findUnique({
    where: { id: params.otId }
  });

  if (!ot || ot.tecnicoAsignadoId !== session.user.id) {
    return new Response('No puedes adjuntar fotos a esta OT', { status: 403 });
  }

  // 3. Procesar cada foto
  const fotosProcesadas = [];

  for (const foto of fotos) {
    // 3.1. Validar que sea una imagen
    if (!foto.type.startsWith('image/')) {
      return new Response(`Solo se permiten imágenes. Recibido: ${foto.type}`, { status: 400 });
    }

    // 3.2. Validar tamaño (máximo 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (foto.size > MAX_SIZE) {
      return new Response(`La imagen excede el tamaño máximo de 10MB`, { status: 400 });
    }

    // 3.3. Optimizar imagen (redimensionar y comprimir)
    const imagenOptimizada = await optimizeImage(foto, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8
    });

    // 3.4. Subir a almacenamiento (S3, Azure Blob, etc.)
    const url = await uploadToStorage(imagenOptimizada, {
      path: `ots/${params.otId}/${tipo}/${Date.now()}-${foto.name}`
    });

    // 3.5. Guardar en BD
    const fotoDB = await prisma.otFoto.create({
      data: {
        ordenTrabajoId: params.otId,
        usuarioId: session.user.id,
        tipo, // ANTES o DESPUES
        url,
        nombreOriginal: foto.name,
        tamañoBytes: imagenOptimizada.size,
        mimeType: imagenOptimizada.type,
        ancho: imagenOptimizada.width,
        alto: imagenOptimizada.height,
        creadoEn: new Date()
      }
    });

    fotosProcesadas.push(fotoDB);
  }

  // 4. Actualizar `updatedAt` de la OT
  await prisma.ordenTrabajo.update({
    where: { id: params.otId },
    data: { updatedAt: new Date() }
  });

  return Response.json({
    success: true,
    fotos: fotosProcesadas
  });
}

// Optimizar imagen antes de subir
async function optimizeImage(file: File, options: { maxWidth: number; maxHeight: number; quality: number }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Crear canvas para redimensionar
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calcular dimensiones manteniendo aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > options.maxWidth) {
        height = (height * options.maxWidth) / width;
        width = options.maxWidth;
      }

      if (height > options.maxHeight) {
        width = (width * options.maxHeight) / height;
        height = options.maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a Blob con compresión
      canvas.toBlob((blob) => {
        resolve({
          file: new File([blob!], file.name, { type: 'image/jpeg' }),
          width,
          height,
          size: blob!.size
        });
      }, 'image/jpeg', options.quality);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Subir a almacenamiento (ej: S3)
async function uploadToStorage(file: { file: File; width: number; height: number; size: number }, path: string): Promise<string> {
  // Implementación con S3 SDK
  const s3Client = new S3Client({});

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: path,
    Body: file.file,
    ContentType: 'image/jpeg'
  });

  await s3Client.send(command);

  // Retornar URL pública
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${path}`;
}
```

**Validaciones de Calidad de Imagen:**

**Given** que intento subir una foto
**When** la imagen tiene resolución muy alta (4000x3000)
**Then** el sistema la redimensiona a máximo 1920px (manteniendo aspect ratio)
**And** la comprime con calidad 0.8
**And** el tamaño final es < 500KB

**Given** que intento subir una foto
**When** el archivo no es una imagen (ej: documento PDF)
**Then** veo error: "Solo se permiten imágenes (JPG, PNG, WebP)"

**Given** que intento subir una foto
**When** el archivo pesa más de 10MB
**Then** veo error: "La imagen excede el tamaño máximo de 10MB"

**Consideraciones de UX:**

- Vista previa de la foto inmediatamente después de seleccionarla
- Barra de progreso durante la subida
- Posibilidad de rotar la imagen antes de subir
- Opción de eliminar fotos ya subidas
- Contador de fotos: "3 antes, 2 después"

---

## Story 10.6: Códigos QR para Equipos (Funcionalidad Base)

**Como** Usuario del sistema accediendo desde móvil con cámara,
**quiero escanear el código QR de un equipo para ver sus detalles rápidamente o reportar una avería,
**para** acceder a la información del equipo sin tener que buscarlo manualmente.

**Acceptance Criteria - Generación de Códigos QR:**

**Given** que estoy en la vista detalle de un equipo
**When** el equipo tiene un código QR asociado
**Then** veo el QR y opciones para usarlo:

```tsx
// Vista de Equipo: Sección de Código QR (FR108)
<EquipoDetail equipo={equipo}>
  {/* ... otros detalles ... */}

  <Section title="Código QR">
    <QRContainer>
      <QRCode
        value={`https://gmao-hiansa.com/equipos/${equipo.id}`}
        size={200}
        level="M"
        renderAs="canvas"
      />

      <QRActions>
        <Button variant="outline" onClick={downloadQR}>
          📥 Descargar QR
        </Button>

        <Button variant="outline" onClick={printQR}>
          🖨️ Imprimir QR
        </Button>

        {canCreateFailureReport && (
          <Button onClick={() => navigate(`/avisos/nuevo?equipoId=${equipo.id}`)}>
            📝 Reportar Avería
          </Button>
        )}
      </QRActions>

      <QRInstructions>
        <h4>¿Cómo usar este código QR?</h4>
        <ol>
          <li>Abre la cámara de tu móvil</li>
          <li>Escanea este código QR</li>
          <li>Accede a los detalles del equipo</li>
          <li>O reporta una avería en 30 segundos</li>
        </ol>
      </QRInstructions>
    </QRContainer>
  </Section>
</EquipoDetail>
```

**Acceptance Criteria - Generación de QR:**

**Given** que creo o actualizo un equipo
**When** se guarda el equipo
**Then** el sistema genera automáticamente un código QR:

```typescript
// Generar código QR para un equipo
import QRCode from 'qrcode';

async function generateQRCode(equipoId: string): Promise<string> {
  // 1. Crear URL del equipo
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/equipos/${equipoId}`;

  // 2. Generar QR code
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M' // Alto nivel de corrección de errores
  });

  // 3. Subir QR a almacenamiento
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrUrl = await uploadToStorage(qrBuffer, {
    path: `equipos/${equipoId}/qr-code.png`,
    contentType: 'image/png'
  });

  // 4. Guardar URL en BD
  await prisma.equipo.update({
    where: { id: equipoId },
    data: { qrCodeUrl: qrUrl }
  });

  return qrUrl;
}
```

**Acceptance Criteria - Escaneo de QR desde Móvil:**

**Given** que estoy en móvil y abro la cámara
**When** escaneo el QR de un equipo
**Then** la app PWA detecta el QR y navega automáticamente:

```typescript
// Service Worker: Manejo de escaneo QR
// Nota: Esto se implementa en la app nativa que envuelve el PWA o usando una librería de escaneo

import { Html5Qrcode } from 'html5-qrcode';

export function QRScanner({ onScan }: { onScan: (data: string) => void }) {
  const scannerRef = useRef<Html5Qrcode>();

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    // Iniciar escaneo de cámara
    scanner.start(
      { facingMode: 'environment' }, // Cámara trasera
      {
        onSuccess: (decodedText) => {
          onScan(decodedText);
        },
        onFailure: (error) => {
          console.error('Error escaneando QR:', error);
        }
      }
    );

    return () => {
      scanner.stop();
    };
  }, [onScan]);

  return (
    <div id="qr-reader">
      <ScannerOverlay>
        <ScanFrame>
          <ScanLine />
        </ScanFrame>
        <ScanInstructions>
          Apunta el código QR al marco
        </ScanInstructions>
      </ScannerOverlay>
    </div>
  );
}
```

**Given** que escaneo exitosamente el QR
**When** el QR contiene `https://gmao-hiansa.com/equipos/{equipoId}`
**Then** la app navega a la vista del equipo
**And** si el usuario tiene `can_create_failure_report`, ve un botón flotante:

```tsx
// Botón flotante "Reportar Avería"
{canCreateFailureReport && (
  <FloatingActionButton
    icon="warning"
    onClick={() => navigate(`/avisos/nuevo?equipoId=${equipoId}&qr=true`)}
    position="bottom-right"
  >
    Reportar Avería
  </FloatingActionButton>
)}
```

**Acceptance Criteria - Pre-Llenado de Formulario con QR:**

**Given** que escaneo el QR de un equipo
**When** voy a "Reportar Avería"
**Then** el formulario ya tiene el equipo pre-seleccionado:

```tsx
// Formulario de aviso con QR
<AvisoForm initialValues={{ equipoId: equipoIdFromQR }}>
  <FormField
    name="equipoId"
    label="Equipo"
    type="search"
    value={equipoFromQR}
    disabled
    helpText="Equipo identificado por escaneo de código QR ✅"
  />

  <FormField
    name="descripcion"
    label="Descripción de la Avería"
    type="textarea"
    required
    placeholder="Describa el problema encontrado..."
    autoFocus
  />

  <Button type="submit">
    Reportar Avería
  </Button>
</AvisoForm>
```

**Validaciones de QR:**

**Given** que el QR se genera
**When** se imprime o se descarga
**Then** el QR es escaneable incluso con:
- 30% de la superficie cubierta (error correction level M)
- Tamaños mínimos de impresión: 2x2 cm
- Impresión en blanco y negro o color

**Given** que intento escanear un QR dañado
**When** el escáner no puede leerlo
**Then** veo mensaje: "No se pudo leer el código QR. Intente de nuevo."

**Consideraciones de Phase 3 (Funcionalidades Futuras):**

- FR108 menciona tracking avanzado con cadena de custodia (Phase 3)
- Mapa en tiempo real de ubicación de equipos (Phase 3)
- Cámara AR para superponer información del equipo sobre la vista real (Phase 3)

---

## Resumen de Historias de Usuario

| Story | Título | Actor | FRs | Complejidad |
|-------|--------|-------|-----|-------------|
| 10.1 | Rechazo de Reparación por Carlos | Carlos | FR101 | Media |
| 10.2 | Búsqueda Universal Predictiva | Todos | FR102 | Alta |
| 10.3 | Preferencias de Notificación | Todos | FR105 | Baja |
| 10.4 | Comentarios con Timestamp | María | FR106 | Baja |
| 10.5 | Fotos Antes/Después en Reparaciones | María | FR107 | Media |
| 10.6 | Códigos QR para Equipos (Base) | Todos | FR108 | Baja |

**Total Estimado:** 6 historias de usuario

---

## Criterios de Éxito del Epic

**Métricas de Éxito:**
- La búsqueda universal responde en < 200ms (FR102)
- El 80% de los usuarios configura preferencias de notificación
- El 60% de los equipos tienen códigos QR generados
- Las fotos se optimizan en < 3 segundos y < 500KB
- El rechazo de reparaciones se usa en < 5% de los casos (indica que la mayoría de reparaciones son exitosas)

**Validación de Integración:**
- ✅ Epic 1: PBAC controla acceso a rechazo (FR101)
- ✅ Epic 2: QR codes se asocian a Equipos
- ✅ Epic 3: Fotos se adjuntan a avisos (base para Story 10.5)
- ✅ Epic 4: Comentarios y fotos se integran en OTs
- ✅ Epic 9: Búsqueda universal funciona en todos los dispositivos

**Próximos Pasos:**
- Phase 3: Tracking avanzado con GPS y cadena de custodia
- Phase 3: Realidad Aumentada para mantenimiento asistido
- Phase 3: Firma digital en documentos de OT

---

**Versión:** 2.0 (Historias completas en formato Given/When/Then)
**Fecha:** 2026-03-07
**Estado:** ✅ Completado - Listo para implementación
