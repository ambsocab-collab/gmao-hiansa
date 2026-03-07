# Epic 2: Gestión de Activos y Jerarquía de 5 Niveles

Permitir a los usuarios gestionar la estructura completa de activos con jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), relaciones muchos-a-muchos entre componentes y equipos, historial completo de reparaciones por equipo, 5 estados de equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado), stock de equipos completos reutilizables, importación masiva de hasta 10,000 activos desde CSV y códigos QR para identificación.

**FRs cubiertos:** FR32-FR43, FR108 (13 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con can_manage_assets), técnicos con can_view_repair_history
**Valor entregado:**
- Jerarquía completa de 5 niveles navegable en cualquier dirección
- Relaciones muchos-a-muchos (un componente sirve a múltiples equipos)
- Historial de reparaciones por equipo con fechas, repuestos usados, técnicos
- 5 estados de equipos con visualización de stock de reutilizables
- Importación CSV masiva con validación estructural automática
- Códigos QR para identificación rápida de equipos

**Dependencias:** Epic 1 (requiere autenticación y capabilities)

---

## Story 2.1: Modelo de Datos de Jerarquía de 5 Niveles

As a developer of the system,
I want to create the Prisma data model with the 5 asset hierarchy tables (Planta, Linea, Equipo, Componente, Repuesto) with foreign key relationships and structural validations,
So that the system can store and manage the complete asset hierarchy structure of the metalworking company.

**Acceptance Criteria:**

**Given** that I am defining the Prisma schema in `prisma/schema.prisma`
**When** I create the Planta model
**Then** the Planta model has fields:
- id (UUID, primary key)
- nombre (String, required, unique, max 200 characters)
- descripcion (String, optional, max 500 characters)
- direccion (String, optional)
- ciudad (String, optional)
- codigo (String, optional, unique for short identification)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "plantas" table

**Given** that the Planta model is created
**When** I create the Linea model
**Then** the Linea model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 500 characters)
- codigo (String, optional, unique within the plant)
- plantaId (UUID, foreign key → Planta.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "lineas" table
- And there is a many-to-one relationship from Linea to Planta (plantaId → Planta.id)

**Given** that the Linea model is created
**When** I create the Equipo model
**Then** the Equipo model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the line)
- numeroSerie (String, optional, unique in entire system)
- modelo (String, optional)
- fabricante (String, optional)
- añoFabricacion (Int, optional)
- lineaId (UUID, foreign key → Linea.id)
- estado (Enum EquipoEstado, default OPERATIVO)
- ubicacionActual (String, optional, for reusable equipment)
- esReutilizable (Boolean, default false)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "equipos" table
- And there is a many-to-one relationship from Equipo to Linea (lineaId → Linea.id)
- And there is an EquipoEstado enum with values: OPERATIVO, AVERIADO, EN_REPARACION, RETIRADO, BLOQUEADO

**Given** that the Equipo model is created
**When** I create the Componente model
**Then** the Componente model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the equipment)
- numeroParte (String, optional, manufacturer code)
- equipoId (UUID, foreign key → Equipo.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "componentes" table
- And there is a many-to-one relationship from Componente to Equipo (equipoId → Equipo.id)

**Given** that the Componente model is created
**When** I create the Repuesto model
**Then** the Repuesto model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the component)
- numeroParte (String, optional, manufacturer code)
- componenteId (UUID, foreign key → Componente.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "repuestos" table
- And there is a many-to-one relationship from Repuesto to Componente (componenteId → Componente.id)

**Given** that all 5 models are created
**When** I create the EquipoComponente model for many-to-many relationships
**Then** the EquipoComponente model has fields:
- id (UUID, primary key)
- equipoId (UUID, foreign key → Equipo.id)
- componenteId (UUID, foreign key → Componente.id)
- fechaAsignacion (DateTime, default now())
- notas (String, optional)
- @@map for "equipo_componentes" table
- And there is a unique composite index (equipoId, componenteId) to avoid duplicates
- And there is a many-to-one relationship from EquipoComponente to Equipo
- And there is a many-to-one relationship from EquipoComponente to Componente

**Given** that all models are defined
**When** I run `npx prisma migrate dev --name init_jerarquia_activos`
**Then** the initial migration is created with the 5 hierarchy models
**And** the tables plantas, lineas, equipos, componentes, repuestos are created in the database
**And** the equipo_componentes table is created for many-to-many relationships
**And** foreign keys are created correctly
**And** unique indexes are created correctly
**And** the EquipoEstado enum is created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
**And** TypeScript types are generated automatically
**And** Prisma helpers include the new models with their relationships

**Given** that models are generated
**When** I create the `types/assets.ts` file
**Then** TypeScript types derived from Prisma are exported for Planta, Linea, Equipo, Componente, Repuesto, EquipoComponente
**And** a JerarquíaActivo type is created representing the complete 5-level structure
**And** an EquipoEstado type is created with the 5 possible states

**Given** that I am using the generated models
**When** I query a Planta with Prisma
**Then** I can include its Lineas using `include: { lineas: true }`
**And** each Linea can include its Equipos
**And** each Equipo can include its Componentes
**And** each Componente can include its Repuestos
**And** the complete hierarchy can be queried in a single query

**FRs covered:** FR32 (5-level hierarchy), base structure for FR34 (many-to-many relationships), FR36 (5 equipment states)

---

## Story 2.2: Gestión de Plantas y Líneas

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Production Plants and Lines,
So that I can define the organizational structure of the metalworking company with its two specialized plants (profiled steel and sandwich panel).

**Acceptance Criteria:**

**Given** that I am a user with can_manage_assets capability
**When** I access the `/assets/plantas` route
**Then** I see a list of all system Plants
**And** each Plant row shows: name, city, code (optional), number of lines, status (active/inactive)
**And** there is a "Crear Nueva Planta" button
**And** each Plant has "Ver Detalles", "Editar", "Eliminar" buttons
**And** there is a search to filter Plants by name or city
**And** the list is paginated (20 plants per page)

**Given** that I am on the Plants list
**When** I click "Crear Nueva Planta"
**Then** a modal opens or I go to `/assets/plantas/new`
**And** I see a form with fields:
- Plant Name (text, required, max 200 characters)
- Description (optional text, max 500 characters)
- Address (optional text)
- City (optional text)
- Code (optional text, max 50 characters)
- "Cancelar" and "Crear Planta" buttons
**And** the Name field validates that it's not duplicated (case-insensitive)
**And** the Code field validates that it's not duplicated (if provided)

**Given** that I have completed the New Plant form
**When** I click "Crear Planta"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Planta record in the database
- Shows success message: "Planta [Nombre] creada exitosamente"
- Redirects to the Plants list
- The new Plant appears in the list
**And** if validation fails:
- Shows specific errors
- The form remains open for correction

**Given** that I want to see a Plant's details
**When** I click "Ver Detalles" on a Plant
**Then** I go to `/assets/plantas/[id]`
**And** I see the Plant's complete information:
- All Plant fields (name, description, address, city, code)
- List of Lines associated with this Plant
- Total number of Equipos in this Plant (summing all Lines)
- Total number of Componentes
- Total number of Repuestos
- Creation date
- Last update date
**And** there is a "Crear Nueva Línea" button to add lines to this Plant

**Given** that I am viewing a Plant's details
**When** I see the list of associated Lines
**Then** each Line shows: name, code, number of equipments, status
**And** there is a "Ver" button on each Line to navigate to Line details
**And** there are "Editar" and "Eliminar" buttons on each Line
**And** I can view Lines in table or card format (toggle)

**Given** that I am on a Plant's details page
**When** I click "Crear Nueva Línea"
**Then** a modal opens within the Plant page
**And** the form has fields:
- Line Name (text, required, max 200 characters)
- Description (optional text, max 500 characters)
- Code (optional text, max 50 characters, unique within the Plant)
- "Cancelar" and "Crear Línea" buttons
**And** the Code field validates that it's not duplicated within this Plant

**Given** that I have completed the New Line form
**When** I click "Crear Línea"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Linea record in the database with current Plant's plantaId
- Shows success message: "Línea [Nombre] creada exitosamente en Planta [Nombre Planta]"
- The new Line appears in the Plant's Lines list
**And** if validation fails:
- Shows specific errors

**Given** that I want to edit an existing Plant
**When** I click "Editar" on a Plant
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new name already exists in another Plant, shows error
- If the new code already exists in another Plant, shows error
- If validation is correct, updates the Planta record
- Logs the update in audit logs
- Shows success message: "Planta actualizada exitosamente"

**Given** that I want to delete a Plant
**When** I click "Eliminar" on a Plant
**Then** the system shows a confirmation dialog: "¿Eliminar Planta [Nombre]? This action will also delete all associated Lines, Equipos, Componentes, and Repuestos. This action is irreversible."
**And** if the Plant has associated Equipos
**Then** I see a summary: "This Plant has X Lines with Y Equipos in total."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará toda la jerarquía debajo de esta Planta."
**And** if I confirm:
- The system marks the Plant as isActive = false (soft delete)
- Marks all associated Lines as isActive = false
- Marks all associated Equipos as isActive = false
- Marks all Componentes and Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Planta eliminada exitosamente. X Líneas, Y Equipos eliminados."
**And** the Plant disappears from the main list (but can be seen by activating "Mostrar inactivos" filter)

**Given** that I am a user without can_manage_assets capability
**When** I attempt to access `/assets/plantas`
**Then** the system denies me access (per FR73)
**And** I see message: "No tiene permiso para acceder a este módulo. Contacte al administrador."
**And** I am redirected to the dashboard

**Given** that I have can_view_repair_history capability but NOT can_manage_assets
**When** I access `/assets/plantas`
**Then** I see Plants in read-only mode
**And** I do NOT see "Crear", "Editar" or "Eliminar" buttons
**And** I can navigate the hierarchy to view repair history

**Given** that I am navigating Plants and Lines
**When** I want to see the hierarchical structure
**Then** I can click on a Plant to see its Lines
**Then** I can click on a Line to see its Equipos
**Then** navigation is intuitive following the Plant → Line → Equipo hierarchy

**FRs covered:** FR33 (navigate hierarchy), FR32 (5-level structure), FR73 (access by capabilities)

---

## Story 2.3: Gestión de Equipos con Estados

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Equipos within Lines, managing their 5 states (Operativo, Averiado, En Reparación, Retirado, Bloqueado),
So that I can maintain the complete inventory of machinery and equipment in the plant with their current status.

**Acceptance Criteria:**

**Given** that I am on a Line's details page at `/assets/lineas/[id]`
**When** the page loads
**Then** I see the Line's information (name, description, code)
**And** I see a list of Equipos associated with this Line
**And** each Equipo shows: name, code, serial number, model, manufacturer, status (colored badge), current location (if reusable)
**And** there is a "Crear Nuevo Equipo" button
**And** each Equipo has "Ver Detalles", "Editar", "Cambiar Estado", "Eliminar" buttons
**And** there are filters by status and search by name or code
**And** the list is paginated (20 equipos per page)

**Given** that Equipo states are:
- OPERATIVO (green): Equipment is functioning normally
- AVERIADO (red): Equipment is reported as faulty and not operational
- EN_REPARACION (orange): Equipment is currently being repaired
- RETIRADO (gray): Equipment has been permanently retired from service
- BLOQUEADO (yellow): Equipment is blocked for safety or maintenance
**When** I see the Equipos list
**Then** each state is shown with a corresponding colored badge
**And** the badge has readable text and meets WCAG AA (4.5:1 contrast)

**Given** that I am on a Line's Equipos list
**When** I click "Crear Nuevo Equipo"
**Then** a modal opens or I go to `/assets/equipos/new?lineaId=[id]`
**And** I see a form with fields:
- Equipo Name (text, required, max 200 characters)
- Description (optional text, max 1000 characters)
- Code (optional text, max 50 characters, unique within the Line)
- Serial Number (optional text, unique in entire system)
- Model (optional text)
- Manufacturer (optional text)
- Year of Manufacture (optional number, between 1900 and current year)
- Estado (dropdown, required, options: OPERATIVO, AVERIADO, EN_REPARACION, RETIRADO, BLOQUEADO)
- Es Reutilizable (checkbox, default false)
- Ubicación Actual (optional text, required if reusable)
- "Cancelar" and "Crear Equipo" buttons
**And** the Code field validates that it's not duplicated within this Line
**And** the Serial Number field validates that it's not duplicated in the entire system
**And** the Year of Manufacture field validates that it's between 1900 and current year

**Given** that I check "Es Reutilizable" as true
**When** the form detects this change
**Then** the "Ubicación Actual" field becomes required
**And** I see a help message: "Especifique la ubicación actual del equipo (ej: Almacén Central, Planta A - Área de Producción)"
**And** the Estado field shows additional visible options: Disponible, En Uso, En Reparación, Descartado

**Given** that I have completed the New Equipo form
**When** I click "Crear Equipo"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Equipo record in the database with current Line's lineaId
- Default estado is OPERATIVO (if not specified otherwise)
- If reusable, marks esReutilizable = true
- Shows success message: "Equipo [Nombre] creado exitosamente en Línea [Nombre Línea]"
- The new Equipo appears in the list
**And** if validation fails:
- Shows specific errors

**Given** that I want to edit an existing Equipo
**When** I click "Editar" on an Equipo
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID and lineaId
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new code already exists in this Line, shows error
- If the new serial number already exists in the system, shows error
- If validation is correct, updates the Equipo record
- Logs the update in audit logs
- Shows success message: "Equipo actualizado exitosamente"

**Given** that I want to change an Equipo's status
**When** I click "Cambiar Estado" on an Equipo
**Then** a simple modal opens with:
- Equipo's current estado (colored badge)
- Dropdown to select new estado
- "Motivo del cambio" field (text, required, max 500 characters)
- "Cancelar" and "Cambiar Estado" buttons
**And** the dropdown only shows states that can be transitioned from the current estado:
- From OPERATIVO: → AVERIADO, EN_REPARACION, BLOQUEADO, RETIRADO
- From AVERIADO: → OPERATIVO (if repaired), EN_REPARACION, RETIRADO
- From EN_REPARACION: → OPERATIVO, AVERIADO, RETIRADO
- From RETIRADO: → (cannot change, final state)
- From BLOQUEADO: → OPERATIVO, AVERIADO, RETIRADO

**Given** that I have selected the new estado and provided the reason
**When** I click "Cambiar Estado"
**Then** the system:
- Updates the Equipo's estado field
- Logs the estado change in audit logs with reason
- Logs who made the change (my user ID)
- Logs the timestamp of the change
- Shows success message: "Estado del Equipo cambiado to [NEW STATE] exitosamente"
**And** the estado badge in the list updates immediately with the new color

**Given** that I change an Equipo's estado to AVERIADO
**When** the change is saved
**Then** the system checks if there is an open failure report for this equipment
**And** if a report exists, it automatically associates it
**And** if no report exists, the AVERIADO estado is saved without associated report

**Given** that I change an Equipo's estado from AVERIADO to OPERATIVO
**When** the change is saved
**Then** the system checks if there is an open OT for this equipment
**And** if an open OT exists with "En Progreso" or "Completada" status, it suggests completing the OT first

**Given** that I want to delete an Equipo
**When** I click "Eliminar" on an Equipo
**Then** the system shows a confirmation dialog: "¿Eliminar Equipo [Nombre]? This action will also delete all associated Componentes and Repuestos. This action is irreversible."
**And** if the Equipo has associated Componentes
**Then** I see a summary: "Este Equipo has X Componentes with Y Repuestos in total."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará toda la jerarquía beneath this Equipo."
**And** if I confirm:
- The system marks the Equipo as isActive = false (soft delete)
- Marks all associated Componentes and Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Equipo eliminado exitosamente. X Componentes, Y Repuestos eliminados."
**And** the Equipo disappears from the main list

**Given** that I am viewing the Equipos list
**When** I apply the "Estado: AVERIADO" filter
**Then** I see only Equipos with AVERIADO status
**And** I can quickly see which equipment needs attention

**Given** that I am viewing the Equipos list
**When** I apply the "Solo Reutilizables" filter
**Then** I see only Equipos with esReutilizable = true
**And** each Equipo shows its current location
**And** I can see the stock of reusable equipment by estado

**Given** that I want to see an Equipo's complete details
**When** I click "Ver Detalles" on an Equipo
**Then** I go to `/assets/equipos/[id]`
**And** I see all the Equipo's information:
- All Equipo fields
- Current estado with colored badge
- Estado change history last 6 months (timeline)
- List of associated Componentes
- List of associated OTs (if I have can_view_repair_history capability)
- If reusable: current location, location history
- Creation date
- Last update date

**FRs covered:** FR36 (5 equipment states), FR37 (change estado), FR38 (stock of reusable equipment), FR39 (track current location), FR33 (navigate hierarchy)

---

## Story 2.4: Gestión de Componentes con Relaciones Muchos-a-Muchos

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Componentes within Equipos, with the ability to associate a Componente to multiple Equipos (many-to-many relationship),
So that I can manage components that serve more than one equipment without duplicating information.

**Acceptance Criteria:**

**Given** that I am on an Equipo's details page at `/assets/equipos/[id]`
**When** the page loads
**Then** I see the Equipo's information
**And** I see a list of Componentes associated with this Equipo
**And** each Componente shows: name, code, part number, short description
**And** there is a "Crear Nuevo Componente" button
**And** each Componente has "Ver Detalles", "Editar", "Asignar a otro Equipo", "Eliminar" buttons
**And** there is a search to filter Componentes by name or code
**And** the list is paginated (20 componenti per page)

**Given** that I am on an Equipo's Componentes list
**When** I click "Crear Nuevo Componente"
**Then** a modal opens or I go to `/assets/componentes/new?equipoId=[id]`
**And** I see a form with fields:
- Componente Name (text, required, max 200 characters)
- Description (optional text, max 1000 characters)
- Code (optional text, max 50 characters, unique within the Equipo)
- Part Number (optional text, manufacturer code)
- "Cancelar" and "Crear Componente" buttons
**And** the Code field validates that it's not duplicated within this Equipo
**And** the componente is automatically associated with the current Equipo

**Given** that I have completed the New Componente form
**When** I click "Crear Componente"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Componente record in the database with current Equipo's equipoId
- Creates a record in EquipoComponente associating the Componente to the Equipo
- Shows success message: "Componente [Nombre] creado exitosamente en Equipo [Nombre Equipo]"
- The new Componente appears in the list
**And** if validation fails:
- Shows specific errors

**Given** that I want to see a Componente's details
**When** I click "Ver Detalles" on a Componente
**Then** I go to `/assets/componentes/[id]`
**And** I see all the Componente's information:
- All Componente fields
- List of Equipos to which it is associated (many-to-many relationship)
- For each associated Equipo: name, code, assignment date
- List of Repuestos within this Componente
- Creation date
- Last update date

**Given** that I am viewing a Componente's details
**When** I see the "Equipos Asociados" section
**Then** I see a list of all Equipos that use this Componente
**And** if the Componente is associated to multiple Equipos
**Then** I see more than one Equipo listed (e.g., "Motor eléctrico 50HP is in 3 equipos: Prensa PH-500, Prensa PH-600, Compresor C-100")
**And** this demonstrates the many-to-many relationship

**Given** that I want to associate an existing Componente to another Equipo
**When** I am on a Componente's details page
**Then** I see an "Asignar a otro Equipo" button
**And** when clicked, a modal opens with:
- List of all system Equipos (with filter by Planta/Línea)
- Checkboxes to select one or more Equipos
- "Notas de asignación" field (optional text, max 500 characters)
- "Cancelar" and "Asignar" buttons
**And** Equipos that already have this Componente associated appear marked/disabled

**Given** that I have selected one or more additional Equipos
**When** I click "Asignar"
**Then** the system:
- Creates EquipoComponente records for each new selected Equipo
- Registers the assignment date as current timestamp
- Saves assignment notes if provided
- Logs the association in audit logs
- Shows success message: "Componente assigned to X Equipos exitosamente"
**And** the Componente now appears in each selected Equipo's Componentes list

**Given** that I want to edit a Componente
**When** I click "Editar" on a Componente
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID
**And** NOTE: Changing the equipoId field is NOT the correct way to manage multiple associations
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new code already exists in this Equipo, shows error
- If validation is correct, updates the Componente record
- Logs the update in audit logs
- Shows success message: "Componente actualizado exitosamente"

**Given** that I want to dissociate a Componente from an Equipo
**When** I am on a Componente's details page
**Then** in the "Equipos Asociados" section, each Equipo has a "Desasociar" button
**And** when I click "Desasociar" on an Equipo
**Then** the system shows a confirmation dialog: "¿Desasociar Componente [Nombre] from Equipo [Nombre Equipo]? This action removes the relationship but does NOT delete the Componente nor the Equipo."
**And** if I confirm:
- Deletes the corresponding EquipoComponente record
- Logs the dissociation in audit logs
- Shows success message: "Componente dissociated from Equipo exitosamente"
**And** the Componente NO longer appears in that Equipo's Componentes list
**And** The Componente continues to exist and can remain associated to other Equipos

**Given** that I want to delete a Componente completely
**When** I click "Eliminar" on a Componente
**Then** the system shows a warning dialog: "¿Eliminar Componente [Nombre]? This action will remove the Componente from ALL associated Equipos (X equipos) and also delete all Repuestos beneath. This action is irreversible."
**And** I see a summary: "Este Componente is associated to X Equipos and has Y Repuestos."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará the Componente from all Equipos and its Repuestos."
**And** if I confirm:
- Deletes all associated EquipoComponente records
- Marks the Componente as isActive = false (soft delete)
- Marks all this Componente's Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Componente eliminado exitosamente. X associations deleted, Y Repuestos deleted."
**And** the Componente disappears from all Equipos

**Given** that I am viewing an Equipo
**When** I see a Componente with a "Multiple Equipos" badge
**Then** the Componente is associated to 2 or more Equipos
**And** on hover over the badge
**Then** I see a tooltip: "Este componente is in X equipos: [list of equipo names]"
**And** this helps me quickly understand that the Componente is shared

**Given** that I am creating a new Equipo
**When** I want to associate existing Componentes
**Then** I can select Componentes from other Equipos during creation
**And** I see a search of existing Componentes in the system
**And** I can select multiple Componentes to associate to the new Equipo
**And** When creating the Equipo, EquipoComponente relationships are created automatically

**Given** that I want to see all system Componentes
**When** I access `/assets/componentes`
**Then** I see a global Componentes list
**And** each Componente shows: name, number of associated equipos, number of repuestos
**And** there are filters by Planta/Línea/Equipo
**And** there is a global search
**And** I can see Componentes that are in multiple Equipos with a special badge

**FRs covered:** FR34 (componente to multiple equipos), FR33 (navigate hierarchy), FR32 (5-level structure)

---

## Story 2.6: Navegación Jerárquica de Activos

As a user with capabilities to view assets (can_manage_assets or can_view_repair_history),
I want to navigate the complete 5-level asset hierarchy (Planta → Línea → Equipo → Componente → Repuesto) using an interactive tree view and predictive search,
So that I can quickly find any asset in the system regardless of its position in the hierarchy.

**Acceptance Criteria:**

**Given** that I have can_manage_assets capability
**When** I access `/assets`
**Then** I see the Asset Management main page
**And** I see two main views: "Vista de Árbol Jerárquico" and "Vista de Listado"
**And** I can toggle between the two views
**And** The tree view is selected by default

**Given** that I am in "Vista de Árbol Jerárquico"
**When** the view loads
**Then** I see an expandable/collapsible tree structure
**And** The top level shows all Plantas as main nodes
**And** Each Planta has a [+] expansion icon
**And** Clicking [+] expands to show Líneas of that Planta
**And** Each Línea has a [+] expansion icon
**And** Expanding a Línea shows its Equipos
**And** Each Equipo can expand to show Componentes
**And** Each Componente can expand to show Repuestos
**And** The complete hierarchy is navigated by expanding/collapsing nodes

**Given** that I am navigating the hierarchical tree
**When** I click any node (Planta, Línea, Equipo, Componente, Repuesto)
**Then** A right side panel shows that node's details
**And** I see action buttons according to my capabilities (View, Edit, Delete)
**And** For Equipos: I see "Ver Historial de Reparaciones" if I have can_view_repair_history
**And** For Repuestos: I see "Ver Uso en OTs" if I have can_view_repair_history
**And** I can navigate quickly without changing pages

**Given** that I want to use predictive search
**When** I am at `/assets`
**Then** I see a search bar at the top
**And** The bar has placeholder: "Buscar activos (equipos, componentes, repuestos)..."
**And** When I start typing (debouncing 300ms)
**Then** The system searches in real-time and shows suggestions
**And** Suggestions show:
- Asset name
- Complete hierarchical path (e.g., "Prensa PH-500 (Panel Sandwich > Línea 2 > Equipos)")
- Asset type icon (distinct icon for Equipo/Componente/Repuesto)
**And** Suggestions appear in less than 200ms (NFR-P1)
**And** Maximum 10 suggestions shown

**Given** that I select a search suggestion
**When** I click the result
**Then** The hierarchical tree automatically expands to the selected asset's level
**And** The side panel shows that asset's details
**And** The path to the asset is highlighted in the tree

**Given** that I am in "Vista de Listado"
**When** the view loads
**Then** I see a paginated table with ALL system assets
**And** The table has columns: Type, Name, Hierarchical Path, Code, Status (for equipos), Actions
**And** There are advanced filters:
- Dropdown "Tipo": Todos, Plantas, Líneas, Equipos, Componentes, Repuestos
- Dropdown "Planta": All or specific plantas
- Dropdown "Estado": Todos, Operativo, Averiado, En Reparación, Retirado, Bloqueado
- Text search
**And** I can apply multiple filters simultaneously
**And** The list updates in real-time (SSE every 30s)

**Given** that I want to see only AVERIADO Equipos
**When** I apply filters "Tipo: Equipos" and "Estado: Averiado"
**Then** I see only Equipos with AVERIADO estado
**And** Each row shows the Equipo with red badge
**And** I can quickly see which equipment needs attention

**Given** that I want to navigate upwards from a Repuesto in the hierarchy
**When** I am viewing a Repuesto's details
**Then** I see breadcrumbs: "Assets > Plantas > [Planta] > Líneas > [Línea] > Equipos > [Equipo] > Componentes > [Componente] > Repuestos > [Repuesto]"
**And** Each breadcrumb level is a clickable link
**And** Clicking "Equipos > [Equipo]" takes me to the parent Equipo
**Then** I can continue going up levels: Equipo → Línea → Planta

**Given** that I want to navigate downwards from an Equipo in the hierarchy
**When** I am viewing an Equipo's details
**Then** I see sections for "Componentes" and "Repuestos"
**And** Each section shows a list with links to each child
**Then** I can click any Componente to navigate down
**Then** From the Componente, I can click any Repuesto to go down another level

**FRs covered:** FR33 (navigate hierarchy any direction), FR102 (predictive global search <200ms), NFR-P1 (<200ms search), NFR-P2 (<3s initial load), NFR-P5 (<100ms transitions)


---

## Story 2.7: Historial de Reparaciones por Equipo

As a user with can_view_repair_history capability (technicians, supervisors, administrators),
I want to view the complete repair history of any equipment, including all completed OTs with dates, spare parts used, and assigned technicians,
So that I can identify patterns of failures, most problematic equipment, and make informed maintenance decisions.

**Acceptance Criteria:**

**Given** that I have can_view_repair_history capability
**When** I view an Equipo's details page at `/assets/equipos/[id]`
**Then** I see a "Historial de Reparaciones" section
**And** This section shows a list of all completed OTs associated with this Equipo
**And** Each OT in the history shows:
- OT number (clickable link to OT details)
- Completion date
- Maintenance type (Preventivo/Correctivo)
- Assigned technician(s)
- Total repair time (hours)
- Spare parts used (list with quantities)
- Final Equipment estado after repair

**Given** that I am viewing the repair history
**When** The list loads
**Then** Most recent OTs appear first (descending chronological order)
**And** The list is paginated (20 OTs per page)
**And** There are filters by:
- Date range (from - to)
- Maintenance type (All, Preventivo, Correctivo)
- Assigned technician
- Final Equipment estado
**And** There is a search by OT number or description

**Given** that I apply a date range filter
**When** I select "Last 30 days"
**Then** I see only OTs completed in the last 30 days
**And** I see a summary: "X OTs found in this period"
**And** I see calculated KPIs for this period:
- Average MTTR of this Equipo in the period
- Total number of failures
- Most used spare parts (top 5)
- Trend: "↑ 20% more failures than previous period" or "↓ 15% less failures"

**FRs covered:** FR35 (complete OT history with dates, parts, technicians), FR102 (search), NFR-P2 (<3s load)

---

## Story 2.8: Importación Masiva CSV de Activos

As an Elena (Administrator with can_manage_assets capability),
I want to import up to 10,000 assets from a CSV file with automatic structural validation of the 5-level hierarchy,
So that I can quickly populate the system with all existing assets without manual data entry.

**Acceptance Criteria:**

**Given** that I have can_manage_assets capability
**When** I access `/assets/importar`
**Then** I see the bulk import page with sections:
- Step 1: Download CSV Template
- Step 2: Complete Template with Data
- Step 3: Upload CSV File
- Step 4: Validate and Confirm Import

**Given** that I click "Download CSV Template"
**When** The download starts
**Then** File `plantilla_importacion_activos.csv` downloads
**And** The file has columns for all 5 levels
**And** The file includes 5 example rows to illustrate format

**Given** that I upload the CSV file
**When** I click "Validate File"
**Then** The system validates:
- Correct CSV format
- Required columns present
- Valid hierarchical structure
- Unique codes within each level
- Valid equipment estados
- Maximum 10,000 rows
**And** Validation completes in less than 5 minutes for 10,000 rows (NFR-P7)

**Given** that validation completes with errors
**When** I see the results report
**Then** I see: "❌ Validation failed. [X] rows with errors found."
**And** I see a list of errors by line number with clear descriptions
**And** I can download an error report in Excel format

**Given** that validation succeeds
**When** I confirm the import
**Then** The system imports all rows in a single database transaction
**And** All Plantas, Líneas, Equipos, Componentes, Repuestos are created
**And** The process completes in less than 5 minutes (NFR-P7)
**And** I see a success message with counts of each asset type created

**FRs covered:** FR40 (bulk CSV import), FR41 (automatic structural validation), FR42 (results report), FR43 (download template), NFR-P7 (<5min for 10K assets)

---

## Story 2.9: Códigos QR para Identificación de Equipos

As an Elena (Administrator with can_manage_assets capability),
I want to generate QR codes for each equipment and print QR labels for identification,
So that operators can quickly scan equipment codes with mobile devices to view details or report failures.

**Acceptance Criteria:**

**Given** that I am viewing an Equipo's details at `/assets/equipos/[id]`
**When** The page loads
**Then** I see a "Código QR" section with:
- The generated QR code for the Equipo
- "Download QR" button (downloads PNG image)
- "Print QR Label" button
- "Print Batch of Labels" button

**Given** that I view the QR code
**When** The QR is displayed
**Then** The QR contains: Type "EQUIPO", Equipo ID, code, app URL
**And** The QR is a standard square scannable by any QR scanner
**And** The size is 300x300 pixels

**Given** that I click "Download QR"
**When** The download starts
**Then** File `qr_equipo_[codigo].png` downloads
**And** The image has white background, black QR, good contrast
**And** The image includes the Equipo name below the QR
**And** High resolution (300 DPI) for clear printing

**Given** that I click "Print QR Label"
**When** Print dialog opens
**Then** I see a label preview with:
- QR code (3x3 cm, centered)
- Equipo name (large, bold text)
- Equipo code (medium text)
- Línea and Planta (small text)
- Instruction: "Escanee para ver detalles en la app"
**And** Label dimensions are 10x6 cm

**Given** that I am Carlos (operario) with mobile
**When** I scan an Equipo's QR code
**Then** My mobile app opens/redirects to `/assets/equipos/[id]`
**And** I see equipment details
**And** I see "Reportar Avería" button if AVERIADO
**And** I can report failure in seconds from the scanned QR

**FRs covered:** FR108 (QR codes for equipment identification), base QR functionality for Phase 3 (advanced tracking)

---
