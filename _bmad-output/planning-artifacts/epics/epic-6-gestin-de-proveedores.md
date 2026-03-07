# Epic 6: Gestión de Proveedores

Permitir a Elena (Jefe de Mantenimiento) gestionar el catálogo de proveedores de mantenimiento y repuestos con un formulario unificado, asociación de tipos de servicio y control completo del ciclo de vida de los proveedores.

**Actor Principal:** Elena (Jefe de Mantenimiento, capability `can_manage_providers`)

**FRs Cubiertas:** FR77, FR78, FR78-A, FR79, FR80 (5 FRs)

**Dependencias:**
- Depende de: Epic 1 (Usuarios y Roles - PBAC), Epic 2 (Assets - Modelo de Datos)
- Es prerequisito de: Epic 4 (Órdenes de Trabajo - asignación a proveedores), Epic 5 (Stock - proveedores de repuestos)

---

## Story 6.1: Modelo de Datos de Proveedores

**Como** Desarrollador/Arquitecto del Sistema,
**quiero** definir el modelo de datos completo para gestionar proveedores en Prisma,
**para** soportar todas las funcionalidades de gestión de proveedores con un esquema robusto y normalizado.

**Acceptance Criteria:**

**Given** que estoy definiendo el schema de Prisma en `prisma/schema.prisma`
**When** creo el modelo `Proveedor`
**Then** el modelo tiene los siguientes campos:

```prisma
model Proveedor {
  id              String   @id @default(uuid())
  codigo          String   @unique // Código único interno (ej: "PROV-001")
  nombre          String   // Nombre legal del proveedor (ej: "Talleres Industriales S.A.")
  tipoProveedor   TipoProveedor @default(MANTENIMIENTO)

  // Información de contacto (FR79)
  contactoNombre  String?  // Nombre de la persona de contacto
  contactoEmail   String?  @db.VarChar(255)
  contactoTelefono String? @db.VarChar(50)
  direccion       String?  @db.VarChar(500)
  ciudad          String?  @db.VarChar(200)
  codigoPostal    String?  @db.VarChar(20)

  // Información comercial
  nifCif          String?  @unique @db.VarChar(20) // NIF/CIF para facturación
  emailFacturacion String? @db.VarChar(255)

  // Estado y control
  activo          Boolean  @default(true) // Soft delete

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?
  updatedBy       String?

  // Relaciones
  tiposServicio   ProveedorTipoServicio[] // FR80 - Tipos de servicio que ofrece
  repuestos       Repuesto[]              // Epic 5 - Repuestos que suministra
  ordenesTrabajo  OrdenTrabajo[]          // Epic 4 - OTs asignadas

  @@map("proveedores")
}

enum TipoProveedor {
  MANTENIMIENTO  // Proveedor de servicios de mantenimiento
  REPUESTOS      // Proveedor de repuestos/suministros
  AMBOS          // Ofrece ambos tipos de servicio (FR78-A)
}

model ProveedorTipoServicio {
  id              String      @id @default(uuid())
  proveedorId     String
  proveedor       Proveedor   @relation(fields: [proveedorId], references: [id], onDelete: Cascade)

  tipoServicio    TipoServicioProveedor // FR80 - 6 tipos predefinidos

  createdAt       DateTime    @default(now())

  @@unique([proveedorId, tipoServicio]) // Un proveedor no puede tener duplicados del mismo tipo
  @@index([proveedorId])
  @@map("proveedores_tipos_servicio")
}

enum TipoServicioProveedor {
  MANTENIMIENTO_CORRECTIVO      // FR80 - Mantenimiento Correctivo
  MANTENIMIENTO_PREVENTIVO      // FR80 - Mantenimiento Preventivo
  MANTENIMIENTO_REGLAMENTARIO   // FR80 - Mantenimiento Reglamentario
  SUMINISTRO_REPUESTOS          // FR80 - Suministro de Repuestos
  MANTENIMIENTO_EQUIPOS_ESPECIFICOS // FR80 - Equipos Específicos (soldadura, corte, etc.)
  SERVICIOS_EMERGENCIA          // FR80 - Servicios de Emergencia
}
```

**Validaciones:**

**Given** el modelo de datos definido
**When** creo o actualizo un proveedor
**Then** el sistema valida que:
- `codigo` es único y obligatorio
- `nombre` es obligatorio (máximo 200 caracteres)
- `nifCif` es único si se proporciona
- `contactoEmail` tiene formato válido si se proporciona
- `tipoProveedor` tiene uno de los 3 valores permitidos

**Escenarios de Error:**

**Given** que intento crear un proveedor
**When** el `codigo` ya existe en otro proveedor
**Then** el sistema retorna error `P2002` (unique constraint violation)
**And** muestra mensaje: "El código de proveedor ya existe. Use otro código."

**Given** que intento crear un proveedor
**When** el `nifCif` ya existe en otro proveedor
**Then** el sistema retorna error `P2002`
**And** muestra mensaje: "El NIF/CIF ya está registrado para otro proveedor."

**Given** que intento crear un proveedor
**When** el `contactoEmail` tiene formato inválido
**Then** el sistema valida antes de insertar en DB
**And** muestra mensaje de validación: "El formato del email no es válido."

**Consideraciones de Performance:**

- Agregar índice en `activo` para filtrar proveedores activos/inactivos rápidamente
- Agregar índice en `nombre` para búsqueda full-text (si se implementa búsqueda global)
- Usar `@@index([activo, tipoProveedor])` para consultas combinadas frecuentes

---

## Story 6.2: CRUD Unificado de Proveedores con Tipo

**Como** Elena (Jefe de Mantenimiento con capability `can_manage_providers`),
**quiero** gestionar el catálogo de proveedores mediante un formulario único que soporte ambos tipos (Mantenimiento y Repuestos),
**para** centralizar la gestión de todos los proveedores en una sola interfaz sin duplicar información.

**Acceptance Criteria - Crear Proveedor:**

**Given** que estoy logueado como Elena con capability `can_manage_providers`
**When** accedo a la ruta `/proveedores/nuevo`
**Then** veo el formulario de creación de proveedor con los siguientes campos:

```tsx
// Campos del formulario
<form onSubmit={handleSubmit}>
  {/* Identificación */}
  <FormField name="codigo" label="Código Proveedor" required autoFocus />
  <FormField name="nombre" label="Nombre Legal" required maxLength={200} />

  {/* FR78-A: Tipo de Proveedor - Selector único */}
  <FormField
    name="tipoProveedor"
    label="Tipo de Proveedor"
    required
    type="select"
    options={[
      { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
      { value: 'REPUESTOS', label: 'Repuestos' },
      { value: 'AMBOS', label: 'Ambos (Mantenimiento y Repuestos)' }
    ]}
    helpText="Un proveedor puede ofrecer ambos tipos de servicio"
  />

  {/* FR79: Información de Contacto */}
  <Section title="Información de Contacto">
    <FormField name="contactoNombre" label="Persona de Contacto" maxLength={200} />
    <FormField name="contactoEmail" label="Email de Contacto" type="email" />
    <FormField name="contactoTelefono" label="Teléfono" type="tel" maxLength={50} />
    <FormField name="direccion" label="Dirección" type="textarea" maxLength={500} />
    <FormField name="ciudad" label="Ciudad" maxLength={200} />
    <FormField name="codigoPostal" label="Código Postal" maxLength={20} />
  </Section>

  {/* Información Comercial */}
  <Section title="Información Facturación">
    <FormField name="nifCif" label="NIF/CIF" maxLength={20} unique />
    <FormField name="emailFacturacion" label="Email de Facturación" type="email" />
  </Section>

  <Button type="submit">Crear Proveedor</Button>
  <Button type="button" variant="secondary" onClick={() => router.back()}>
    Cancelar
  </Button>
</form>
```

**Given** que completo el formulario con datos válidos
**When** selecciono "Tipo de Proveedor = AMBOS" (FR78-A)
**Then** el proveedor se crea con `tipoProveedor: AMBOS`
**And** puede aparecer en catálogos de mantenimiento y repuestos

**Given** que completo el formulario
**When** dejo campos obligatorios vacíos (código, nombre, tipo)
**Then** el sistema muestra validación inline bajo cada campo requerido
**And** el botón "Crear Proveedor" permanece deshabilitado hasta que se completen los campos requeridos

**Given** que ingreso un `nifCif` que ya existe en otro proveedor
**When** intento guardar
**Then** el sistema muestra error: "El NIF/CIF ya está registrado para otro proveedor"
**And** el formulario no se envía

**Given** que creo un proveedor exitosamente
**When** la operación se completa
**Then** veo un toast de éxito: "Proveedor {nombre} creado correctamente"
**And** el sistema me redirige a `/proveedores/{id}` (vista detalle del proveedor)

**Acceptance Criteria - Editar Proveedor:**

**Given** que estoy en `/proveedores/{id}` (vista detalle de un proveedor)
**When** hago clic en el botón "Editar" (solo visible con `can_manage_providers`)
**Then** el formulario se carga con los datos actuales del proveedor
**And** todos los campos son editables excepto `id` y `codigo`

**Given** que estoy editando un proveedor
**When** modifico el `tipoProveedor` de MANTENIMIENTO a AMBOS
**Then** el sistema guarda el cambio
**And** el proveedor ahora aparece en catálogos de repuestos también

**Given** que edito un proveedor con cambios
**When** guardo exitosamente
**Then** veo un toast de éxito: "Proveedor {nombre} actualizado"
**And** la vista detalle se actualiza con los nuevos valores

**Acceptance Criteria - Desactivar Proveedor:**

**Given** que estoy en `/proveedores/{id}`
**When** hago clic en el botón "Desactivar" (solo visible si `activo: true`)
**Then** el sistema muestra un modal de confirmación:

```tsx
<ConfirmationModal
  title="¿Desactivar Proveedor?"
  message={`¿Está seguro que desea desactivar ${proveedor.nombre}? El proveedor no será eliminado pero ya no aparecerá en listados ni podrá ser seleccionado para nuevas órdenes de trabajo.`}
  confirmLabel="Desactivar"
  cancelLabel="Cancelar"
  onConfirm={handleDesactivar}
/>
```

**Given** que confirmo la desactivación
**When** la operación se completa
**Then** el campo `activo` se establece en `false`
**And** veo un toast: "Proveedor desactivado correctamente"
**And** el botón cambia a "Reactivar"

**Given** que un proveedor está desactivado (`activo: false`)
**When** lo busco en listados de proveedores
**Then** no aparece en resultados por defecto
**And** solo aparece si activo el filtro "Mostrar inactivos"

**Escenarios de Error:**

**Given** que intento crear un proveedor con `codigo` duplicado
**When** envío el formulario
**Then** veo error: "El código {codigo} ya existe. Use otro código."
**And** el formulario permanece con los datos ingresados

**Given** que intento crear un proveedor con `nifCif` duplicado
**When** envío el formulario
**Then** veo error: "El NIF/CIF ya está registrado para otro proveedor."

**Given** que intento crear un proveedor
**When** `contactoEmail` tiene formato inválido
**Then** veo validación inline: "Formato de email inválido"

**Validaciones de Performance:**

**Given** que guardo un proveedor
**When** la operación se ejecuta
**Then** el tiempo de respuesta es < 500ms para crear
**And** < 300ms para actualizar (sin fotos/adjuntos)

**Consideraciones de Accesibilidad:**

- El formulario es navegable por teclado (Tab, Enter, Escape)
- Campos obligatorios marcados con asterisco (*) y aria-required
- Mensajes de error con aria-live para screen readers
- Focus management: al crear, el focus va al primer campo; al editar, al primer campo editable

---

## Story 6.3: Asociación de Tipos de Servicio (6 Tipos Predefinidos)

**Como** Elena (Jefe de Mantenimiento con capability `can_manage_providers`),
**quiero** asociar cada proveedor con los tipos de servicio que ofrece de un catálogo de 6 tipos predefinidos,
**para** clasificar correctamente los proveedores y facilitar su selección al crear órdenes de trabajo o pedidos de repuestos.

**Acceptance Criteria - Vista de Asociación de Tipos de Servicio:**

**Given** que estoy en la vista detalle de un proveedor `/proveedores/{id}`
**When** el proveedor es de tipo MANTENIMIENTO o AMBOS
**Then** veo una sección "Tipos de Servicio Ofrecidos" con un selector múltiple:

```tsx
<section>
  <h3>Tipos de Servicio Ofrecidos</h3>
  <p className="text-sm text-gray-500">
    Seleccione todos los tipos de servicio que este proveedor ofrece.
  </p>

  <MultiSelect
    name="tiposServicio"
    label="Tipos de Servicio"
    options={[
      {
        value: 'MANTENIMIENTO_CORRECTIVO',
        label: 'Mantenimiento Correctivo',
        description: 'Reparación de averías y fallos operativos'
      },
      {
        value: 'MANTENIMIENTO_PREVENTIVO',
        label: 'Mantenimiento Preventivo',
        description: 'Mantenimiento programado para prevenir fallos'
      },
      {
        value: 'MANTENIMIENTO_REGLAMENTARIO',
        label: 'Mantenimiento Reglamentario',
        description: 'Inspecciones obligatorias por normativa'
      },
      {
        value: 'SUMINISTRO_REPUESTOS',
        label: 'Suministro de Repuestos',
        description: 'Proveeduría de repuestos y consumibles'
      },
      {
        value: 'MANTENIMIENTO_EQUIPOS_ESPECIFICOS',
        label: 'Mantenimiento de Equipos Específicos',
        description: 'Servicios especializados (soldadura, corte, etc.)'
      },
      {
        value: 'SERVICIOS_EMERGENCIA',
        label: 'Servicios de Emergencia',
        description: 'Atención urgente 24/7 o tiempos de respuesta reducidos'
      }
    ]}
    value={proveedor.tiposServicio}
    onChange={handleTiposServicioChange}
    helpText="Puede seleccionar múltiples tipos de servicio"
    required={proveedor.tipoProveedor !== 'REPUESTOS'}
  />

  {proveedor.tiposServicio.length === 0 && (
    <Alert variant="warning">
      Este proveedor no tiene tipos de servicio asociados. No aparecerá en búsquedas filtradas por tipo de servicio.
    </Alert>
  )}
</section>
```

**Given** que estoy editando un proveedor de tipo MANTENIMIENTO o AMBOS
**When** la sección de tipos de servicio se carga
**Then** veo los tipos de servicio ya asociados con checkboxes marcados
**And** puedo seleccionar/deseleccionar múltiples tipos

**Given** que estoy en un proveedor de tipo REPUESTOS
**When** veo la sección de tipos de servicio
**Then** el sistema preselecciona automáticamente "Suministro de Repuestos"
**And** el campo viene deshabilitado (no se puede cambiar)

**Acceptance Criteria - Guardar Asociación:**

**Given** que estoy editando un proveedor
**When** selecciono tipos de servicio y hago clic en "Guardar Cambios"
**Then** el sistema:
1. Elimina todas las asociaciones existentes en `proveedores_tipos_servicio`
2. Crea nuevas filas con los tipos seleccionados
3. Actualiza `updatedAt` en el proveedor

**Given** que guardo tipos de servicio exitosamente
**When** la operación se completa
**Then** veo un toast: "Tipos de servicio actualizados correctamente"
**And** la vista detalle refleja los nuevos tipos

**Given** que intento guardar un proveedor de MANTENIMIENTO
**When** no selecciono ningún tipo de servicio
**Then** el sistema muestra error de validación: "Debe seleccionar al menos un tipo de servicio para proveedores de mantenimiento"
**And** el formulario no se guarda

**Acceptance Criteria - Visualización en Lista de Proveedores:**

**Given** que estoy en `/proveedores` (listado de proveedores)
**When** la lista se carga
**Then** cada fila de proveedor muestra una columna "Tipos de Servicio" con badges:

```tsx
<TableRow>
  <TableCell>{proveedor.codigo}</TableCell>
  <TableCell>{proveedor.nombre}</TableCell>
  <TableCell>
    <Badge variant={proveedor.tipoProveedor === 'AMBOS' ? 'purple' : 'default'}>
      {proveedor.tipoProveedor}
    </Badge>
  </TableCell>
  <TableCell>
    <div className="flex gap-1 flex-wrap">
      {proveedor.tiposServicio.map(ts => (
        <Badge key={ts} variant="outline" size="sm">
          {ts}
        </Badge>
      ))}
    </div>
  </TableCell>
  <TableCell>{proveedor.contactoEmail}</TableCell>
  <TableCell>{proveedor.contactoTelefono}</TableCell>
  <TableCell>
    <Badge variant={proveedor.activo ? 'success' : 'secondary'}>
      {proveedor.activo ? 'Activo' : 'Inactivo'}
    </Badge>
  </TableCell>
  <TableCell>
    <Button onClick={() => router.push(`/proveedores/${proveedor.id}`)}>
      Ver
    </Button>
  </TableCell>
</TableRow>
```

**Escenarios de Error:**

**Given** que intento asociar un tipo de servicio que ya existe
**When** la operación se ejecuta
**Then** el sistema usa `@@unique([proveedorId, tipoServicio])` para prevenir duplicados
**And** silenciosamente ignora el duplicado (idempotente)

**Given** que intento guardar sin seleccionar tipos de servicio
**When** el proveedor es de tipo MANTENIMIENTO
**Then** el sistema muestra error: "Debe seleccionar al menos un tipo de servicio"

**Validaciones de Performance:**

**Given** que guardo tipos de servicio
**When** la operación se ejecuta
**Then** el tiempo de respuesta es < 200ms (independientemente de la cantidad de tipos)

**Consideraciones de UX:**

- El multiselect permite búsqueda/filtrado de tipos por texto
- Cada tipo tiene tooltip con descripción explicativa
- Visualización compacta en listados con badges truncados si hay muchos (mostrar primeros 3 + "X más")

---

## Story 6.4: Vista de Catálogo de Proveedores con Filtros y Búsqueda

**Como** Elena (Jefe de Mantenimiento con capability `can_manage_providers`),
**quiero** ver el catálogo completo de proveedores con filtros por tipo, servicio y estado,
**para** encontrar rápidamente proveedores específicos según mis necesidades (mantenimiento, repuestos, emergency, etc.).

**Acceptance Criteria - Listado de Proveedores:**

**Given** que estoy logueado como usuario con capability `can_manage_providers`
**When** accedo a la ruta `/proveedores`
**Then** veo una vista de catálogo con:

```tsx
// Page Layout: /proveedores
<PageLayout
  title="Catálogo de Proveedores"
  actions={
    <Button onClick={() => router.push('/proveedores/nuevo')}>
      <Icon name="plus" />
      Nuevo Proveedor
    </Button>
  }
>
  {/* Barra de Filtros */}
  <FiltersBar>
    <SearchInput
      placeholder="Buscar por nombre, código, NIF/CIF o contacto..."
      value={searchText}
      onChange={setSearchText}
      debounceMs={300}
    />

    <Select
      label="Tipo de Proveedor"
      value={filtroTipo}
      onChange={setFiltroTipo}
      options={[
        { value: 'todos', label: 'Todos los tipos' },
        { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
        { value: 'REPUESTOS', label: 'Repuestos' },
        { value: 'AMBOS', label: 'Ambos' }
      ]}
    />

    <MultiSelect
      label="Tipos de Servicio"
      value={filtroTiposServicio}
      onChange={setFiltroTiposServicio}
      options={[
        { value: 'MANTENIMIENTO_CORRECTIVO', label: 'Correctivo' },
        { value: 'MANTENIMIENTO_PREVENTIVO', label: 'Preventivo' },
        { value: 'MANTENIMIENTO_REGLAMENTARIO', label: 'Reglamentario' },
        { value: 'SUMINISTRO_REPUESTOS', label: 'Repuestos' },
        { value: 'MANTENIMIENTO_EQUIPOS_ESPECIFICOS', label: 'Equipos Específicos' },
        { value: 'SERVICIOS_EMERGENCIA', label: 'Emergencia' }
      ]}
      placeholder="Todos los servicios"
    />

    <Select
      label="Estado"
      value={filtroActivo}
      onChange={setFiltroActivo}
      options={[
        { value: 'activos', label: 'Solo activos' },
        { value: 'inactivos', label: 'Solo inactivos' },
        { value: 'todos', label: 'Todos' }
      ]}
    />

    <Button variant="outline" onClick={limpiarFiltros}>
      Limpiar Filtros
    </Button>
  </FiltersBar>

  {/* Tabla de Resultados */}
  <DataTable
    data={proveedores}
    columns={[
      { key: 'codigo', label: 'Código', sortable: true },
      { key: 'nombre', label: 'Nombre', sortable: true },
      {
        key: 'tipoProveedor',
        label: 'Tipo',
        render: (row) => <Badge>{row.tipoProveedor}</Badge>
      },
      {
        key: 'tiposServicio',
        label: 'Servicios',
        render: (row) => (
          <BadgesTruncadas
            badges={row.tiposServicio}
            maxShow={3}
            masTexto="+{resto} más"
          />
        )
      },
      { key: 'contactoEmail', label: 'Email' },
      { key: 'contactoTelefono', label: 'Teléfono' },
      {
        key: 'activo',
        label: 'Estado',
        render: (row) => (
          <Badge variant={row.activo ? 'success' : 'secondary'}>
            {row.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (row) => (
          <>
            <Button size="sm" onClick={() => router.push(`/proveedores/${row.id}`)}>
              Ver
            </Button>
            {canManageProviders && (
              <Button size="sm" variant="outline" onClick={() => router.push(`/proveedores/${row.id}/edit`)}>
                Editar
              </Button>
            )}
          </>
        )
      }
    ]}
    defaultSort={{ column: 'nombre', direction: 'asc' }}
    pagination={{ pageSize: 20 }}
  />

  {/* Resumen de Resultados */}
  <ResultsSummary>
    Mostrando {proveedores.length} de {totalProveedores} proveedores
  </ResultsSummary>
</PageLayout>
```

**Acceptance Criteria - Búsqueda:**

**Given** que estoy en el listado de proveedores
**When** escribo "soldadura" en el campo de búsqueda
**Then** el sistema filtra proveedores que coinciden con:
- `nombre` contiene "soldadura" (ej: "Talleres de Soldadura S.L.")
- `tiposServicio` contiene "MANTENIMIENTO_EQUIPOS_ESPECIFICOS" (description: "Servicios especializados (soldadura, corte, etc.)")
- Búsqueda es case-insensitive

**Given** que uso búsqueda con debouncing de 300ms
**When** escribo rápidamente "talleres ind"
**Then** el sistema no ejecuta búsqueda en cada tecla
**And** espera 300ms después del último caracter antes de buscar

**Given** que busco por código de proveedor
**When** escribo "PROV-001"
**Then** el sistema filtra por `codigo` exacto o partial match

**Given** que busco por NIF/CIF
**When** escribo "B12345678"
**Then** el sistema busca en `nifCif` campo

**Acceptance Criteria - Filtros Combinados:**

**Given** que aplico múltiples filtros simultáneamente
**When** selecciono "Tipo: Mantenimiento" + "Servicio: Correctivo" + "Estado: Activos"
**Then** la consulta SQL usa AND entre condiciones:

```sql
SELECT DISTINCT p.*
FROM proveedores p
LEFT JOIN proveedores_tipos_servicio pts ON p.id = pts.proveedorId
WHERE p.tipoProveedor IN ('MANTENIMIENTO', 'AMBOS')
  AND pts.tipoServicio = 'MANTENIMIENTO_CORRECTIVO'
  AND p.activo = true
  AND (
    p.nombre ILIKE '%soldadura%'
    OR p.codigo ILIKE '%soldadura%'
    OR p.nifCif ILIKE '%soldadura%'
    OR p.contactoNombre ILIKE '%soldadura%'
  )
ORDER BY p.nombre ASC
LIMIT 20
```

**Given** que aplico filtros
**When** no hay resultados
**Then** veo mensaje de empty state:

```tsx
<EmptyState
  title="No se encontraron proveedores"
  description="No hay proveedores que coincidan con los filtros aplicados. Intente con otros criterios."
  action={
    <Button onClick={limpiarFiltros}>
      Limpiar Filtros
    </Button>
  }
/>
```

**Given** que tengo filtros aplicados
**When** hago clic en "Limpiar Filtros"
**Then** todos los filtros se resetean a valores por defecto:
- Búsqueda: texto vacío
- Tipo: "todos"
- Tipos de Servicio: array vacío
- Estado: "activos"

**Validaciones de Performance:**

**Given** que tengo 1000 proveedores en BD
**When** ejecuto una búsqueda con filtros
**Then** la query responde en < 300ms
**And** la query usa índices: `idx_proveedores_activo_tipo`, `idx_proveedores_tipos_servicio`

**Consideraciones de UX:**

- URL tiene query params con filtros: `/proveedores?tipo=MANTENIMIENTO&servicio=CORRECTIVO&estado=activos&busqueda=soldadura`
- Filtros son navegables vía browser (back/forward)
- Se puede compartir URL con filtros aplicados
- Filtros persistentes en localStorage (se recuerdan al volver a la página)

---

## Story 6.5: Validación de Desactivación (Uso en OTs o Repuestos)

**Como** Elena (Jefe de Mantenimiento),
**quiero** que el sistema me avise si intento desactivar un proveedor que está siendo usado en órdenes de trabajo activas o repuestos,
**para** evitar romper relaciones existentes y mantener la integridad referencial de los datos.

**Acceptance Criteria - Validación al Desactivar:**

**Given** que estoy en la vista detalle de un proveedor `/proveedores/{id}`
**When** el proveedor tiene OTs activas asignadas (`estado IN (ASIGNADA, EN_PROGRESO, PENDIENTE_REPUESTO, PENDIENTE_PARADA)`)
**And** hago clic en "Desactivar"
**Then** el sistema muestra un modal de advertencia:

```tsx
<WarningModal
  title="⚠️ No se puede desactivar este proveedor"
  message={
    <>
      <p>
        El proveedor <strong>{proveedor.nombre}</strong> no puede ser desactivado
        porque tiene <strong>{otsActivasCount} órdenes de trabajo activas</strong> asignadas.
      </p>
      <p className="mt-2">
        Órdenes de trabajo activas:
      </p>
      <ul className="list-disc ml-6 mt-1">
        {otsActivas.map(ot => (
          <li key={ot.id}>
            OT {ot.codigo} - {ot.titulo} ({ot.estado})
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-600">
        Para desactivar este proveedor, primero debe reasignar o completar las órdenes de trabajo.
      </p>
    </>
  }
  buttons={[
    {
      label: "Ver Órdenes de Trabajo",
      onClick: () => router.push(`/ordenes-trabajo?proveedor=${proveedor.id}`)
    },
    {
      label: "Cerrar",
      variant: "secondary",
      onClick: closeModal
    }
  ]}
/>
```

**Given** que el modal de advertencia se muestra
**When** hago clic en "Ver Órdenes de Trabajo"
**Then** el sistema me redirige a `/ordenes-trabajo?proveedor={proveedorId}&estado=activas`
**And** veo el listado filtrado de OTs asignadas a ese proveedor

**Acceptance Criteria - Proveedores de Repuestos:**

**Given** que estoy en la vista detalle de un proveedor de repuestos `/proveedores/{id}`
**When** el proveedor tiene repuestos asociados en el catálogo
**And** hago clic en "Desactivar"
**Then** el sistema muestra un modal informativo:

```tsx
<InfoModal
  title="ℹ️ Proveedor con repuestos asociados"
  message={
    <>
      <p>
        Este proveedor tiene <strong>{repuestosCount} repuestos</strong> en el catálogo
        que lo tienen como proveedor principal.
      </p>
      <p className="mt-2">
        Puede desactivar el proveedor. Los repuestos mantendrán la referencia,
        pero el proveedor ya no aparecerá en listados ni podrá ser seleccionado
        para nuevos repuestos.
      </p>
      <p className="mt-4">
        ¿Desea continuar con la desactivación?
      </p>
    </>
  }
  buttons={[
    {
      label: "Sí, desactivar",
      onClick: handleDesactivar,
      variant: "warning"
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: closeModal
    }
  ]}
/>
```

**Given** que confirmo la desactivación de un proveedor de repuestos
**When** la operación se completa
**Then** el proveedor se marca como `activo: false`
**And** los repuestos asociados mantienen la relación (no se rompe el foreign key)
**And** los repuestos no pueden usar este proveedor para nuevas actualizaciones

**Acceptance Criteria - Proveedores Sin Uso:**

**Given** que estoy en la vista detalle de un proveedor
**When** el proveedor NO tiene OTs activas ni otros bloqueos
**And** hago clic en "Desactivar"
**Then** el sistema muestra el modal estándar de confirmación (sin advertencias):

```tsx
<ConfirmationModal
  title="¿Desactivar Proveedor?"
  message={`¿Está seguro que desea desactivar ${proveedor.nombre}?`}
  confirmLabel="Desactivar"
  cancelLabel="Cancelar"
/>
```

**Validaciones de Performance:**

**Given** que hago clic en "Desactivar"
**When** el sistema valida si hay OTs activas
**Then** la consulta para verificar uso es < 100ms:

```sql
-- Query para verificar OTs activas (usa índice compuesto)
SELECT COUNT(*)
FROM ordenes_trabajo
WHERE proveedorAsignadoId = $1
  AND estado IN ('ASIGNADA', 'EN_PROGRESO', 'PENDIENTE_REPUESTO', 'PENDIENTE_PARADA')
-- Usa índice: idx_ordenestrabajo_proveedor_estado
```

**Escenarios de Error:**

**Given** que intento desactivar un proveedor con OTs activas
**When** el sistema detecta el bloqueo
**Then** el botón de desactivación en el modal está deshabilitado
**And** solo puedo cerrar el modal o ir a ver las OTs

**Consideraciones de UX:**

- El modal de advertencia muestra hasta 5 OTs activas como ejemplos (si hay más, agrega "y X más")
- Link directo a filtrar OTs por proveedor para facilitar reasignación
- Color del modal: Amarillo/Naranja (warning) para bloqueos, Azul (info) para avisos informativos

**Query para contar repuestos asociados:**

```sql
-- Query para verificar repuestos asociados
SELECT COUNT(*)
FROM repuestos
WHERE proveedorId = $1
-- Usa índice: idx_repuestos_proveedor
```

---

## Resumen de Historias de Usuario

| Story | Título | Actor | FRs | Complejidad |
|-------|--------|-------|-----|-------------|
| 6.1 | Modelo de Datos de Proveedores | Sistema | Todas | Media |
| 6.2 | CRUD Unificado con Tipo | Elena | FR77, FR78, FR78-A, FR79 | Media |
| 6.3 | Asociación de Tipos de Servicio | Elena | FR80 | Baja |
| 6.4 | Vista de Catálogo con Filtros | Elena | FR77, FR78, FR79 | Media |
| 6.5 | Validación de Desactivación | Elena | FR77, FR78 | Baja |

**Total Estimado:** 5 historias de usuario

---

## Criterios de Éxito del Epic

**Métricas de Éxito:**
- Elena puede crear un proveedor en < 2 minutos usando el formulario unificado
- La búsqueda de proveedores responde en < 300ms incluso con 1000+ proveedores
- El 100% de los proveedores de mantenimiento tienen al menos 1 tipo de servicio asociado
- 0 proveedores son desactivados accidentalmente mientras tienen OTs activas

**Validación de Integración:**
- ✅ Epic 1: Users with `can_manage_providers` capability can access provider CRUD
- ✅ Epic 4: Providers can be assigned to OTs (Reparación Externa)
- ✅ Epic 5: Providers can be associated with Repuestos

**Próximos Pasos:**
- Epic 7: Rutinas de Mantenimiento (usa proveedores para Mantenimiento Reglamentario)
- Epic 8: KPIs y Reportes (métricas de proveedores: tiempo de respuesta, costes, etc.)

---

**Versión:** 2.0 (Historias completas en formato Given/When/Then)
**Fecha:** 2026-03-07
**Estado:** ✅ Completado - Listo para implementación
