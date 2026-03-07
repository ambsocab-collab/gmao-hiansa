# Epic 1: Autenticación y Gestión de Usuarios PBAC

Establecer la infraestructura técnica base del proyecto (Story 1.1) y el sistema de autenticación con gestión flexible de usuarios usando 15 capacidades individuales (PBAC - Permission-Based Access Control), permitiendo a los administradores gestionar quién puede hacer qué en el sistema sin roles predefinidos. Incluye registro de usuarios, asignación individual de capabilities, etiquetas de clasificación visual, perfiles, cambio de contraseña obligatorio en primer acceso, historial de actividad y control de acceso por módulos.

**FRs cubiertos:** FR58-FR76 (19 requerimientos funcionales)
**Usuario principal:** Elena (Administrador / Jefa de Mantenimiento)
**Valor entregado:**
- Sistema completo de autenticación y autorización funcional
- Elena puede registrar usuarios con credenciales temporales
- Usuarios cambian contraseña obligatoriamente en primer acceso
- Elena asigna las 15 capabilities individualmente (no por roles)
- Elena crea hasta 20 etiquetas de clasificación visual (Operario, Técnico, Supervisor)
- Control de acceso granular por módulos según capabilities
- Historial de actividad de usuarios últimos 6 meses
- **Story 1.1 incluye:** Setup inicial completo (Next.js, Prisma, NextAuth, SSE, shadcn/ui, Vercel)

**Dependencias:** Ninguna (primer epic)

---

## Story 1.1: Puesta en Marcha y Configuración Inicial del Proyecto

As a developer of the gmao-hiansa project,
I want to establish the base technical infrastructure using Next.js 15, Prisma, NextAuth.js, SSE, shadcn/ui, and Vercel,
So that the project has a solid technical foundation on which to build all future functionalities.

**Acceptance Criteria:**

**Given** that a new Next.js project is being started
**When** I execute `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
**Then** the project structure is created with Next.js 15.0.3, TypeScript 5.3.3, Tailwind CSS 3.4.1, and App Router enabled
**And** the `app/` directory is created without `src/` subdirectory
**And** import aliases `@/*` are configured in `tsconfig.json`

**Given** that the Next.js project is created
**When** I install critical dependencies with stable versions
**Then** Prisma 5.22.0, @prisma/client 5.22.0, @prisma/adapter-neon 5.22.0 are installed
**And** next-auth 4.24.7 is installed (NOT using v5 beta)
**And** bcryptjs 2.4.3 and @types/bcryptjs 2.4.6 are installed
**And** zod 3.23.8 is installed for schema validation
**And** date-fns 3.6.0 is installed for date handling
**And** @tanstack/react-query 5.51.0 is installed for data fetching

**Given** that dependencies are installed
**When** I configure Prisma with `npx prisma init`
**Then** the `prisma/schema.prisma` file is created
**And** the `.env` file is created with `DATABASE_URL` placeholder
**And** `DATABASE_URL` is configured to use Neon PostgreSQL

**Given** that Prisma is initialized
**When** I create the `lib/db.ts` file
**Then** a PrismaClient singleton is exported to avoid multiple instances in development
**And** the client is reused throughout the application

**Given** that NextAuth is installed
**When** I create `app/api/auth/[...nextauth]/route.ts`
**Then** NextAuth.js is configured with Credentials provider for email/password
**And** the provider is configured to use Prisma Adapter
**And** the session strategy is `jwt` (NextAuth default)
**And** sessions expire after 8 hours of inactivity

**Given** that NextAuth is configured
**When** I create the User model in `prisma/schema.prisma`
**Then** the User model has fields: id (UUID), name (String), email (String, unique), password (String), isFirstLogin (Boolean, default true), createdAt (DateTime), updatedAt (DateTime)
**And** the password field stores bcrypt hash (never plain text)
**And** the User model is configured with @@map for "users" table

**Given** that the User model is created
**When** I create the `lib/auth.ts` file
**Then** helper functions for hash and verify password using bcryptjs are exported
**And** a function to get current session from server is exported

**Given** that authentication is configured
**When** I create SSE infrastructure in `lib/sse.ts`
**Then** utilities for Server-Sent Events are implemented
**And** a heartbeat of 30 seconds is configured
**And** auto-reconnection logic <30s is implemented

**Given** that SSE infrastructure is created
**When** I create the `/api/v1/sse/route.ts` endpoint
**Then** the endpoint accepts SSE connections from authenticated clients
**And** the endpoint keeps connection alive with 30s heartbeat
**And** the endpoint can send real-time updates for OTs and KPIs

**Given** that base infrastructure is ready
**When** I initialize shadcn/ui with `npx shadcn-ui@latest init`
**Then** the `components.json` file is created with Tailwind configuration
**And** the `components/ui/` directory is created for base components
**And** design system colors are configured (Main Blue #0066CC, Warning/Orange #FD7E14, Success/Green #28A745, Danger/Red #DC3545)

**Given** that shadcn/ui is initialized
**When** I install necessary base components
**Then** Button, Card, Dialog, Form, Input, Label, Select, Toast are installed in `components/ui/`
**And** all components meet WCAG AA (minimum 4.5:1 contrast)
**And** components use minimum touch targets of 44x44px

**Given** that base components are installed
**When** I create the base layout in `app/layout.tsx`
**Then** the layout includes Header, Main, and Footer
**And** the layout uses the PRD design system
**And** the layout is responsive (3 breakpoints: >1200px, 768-1200px, <768px)
**And** base text is minimum 16px for WCAG AA compliance

**Given** that the project is configured locally
**When** I configure deployment on Vercel
**Then** the project is ready for deploy on Vercel
**And** the `DATABASE_URL` environment variable is configured in Vercel
**And** NextAuth.js is compatible with Vercel serverless
**And** SSE is compatible with Vercel serverless (simpler than WebSockets)

**NFRs covered:** NFR-S1, NFR-S2, NFR-S3, NFR-P2 (initial load <3s), Initial architecture requirements

---

## Story 1.2: Modelo de Datos de Usuarios y Capabilities PBAC

As a developer of the system,
I want to create the complete data model with 15 individual capabilities (PBAC) and visual classification tags in Prisma,
So that the system can store and manage users with granular capabilities without predefined roles.

**Acceptance Criteria:**

**Given** that the basic User model exists in `prisma/schema.prisma`
**When** I add additional fields to the User model
**Then** the User model has fields: phoneNumber (String, optional), isActive (Boolean, default true), lastLogin (DateTime, optional)
**And** the email field has format validation
**And** the email field is case-insensitive

**Given** that the User model is updated
**When** I create the Capability enum in `prisma/schema.prisma`
**Then** the enum has the 15 values: CREATE_FAILURE_REPORT, CREATE_MANUAL_OT, UPDATE_OWN_OT, VIEW_OWNS_OTS, VIEW_ALL_OTS, COMPLETE_OT, MANAGE_STOCK, ASSIGN_TECHNICIANS, VIEW_KPIS, MANAGE_ASSETS, VIEW_REPAIR_HISTORY, MANAGE_PROVIDERS, MANAGE_ROUTINES, MANAGE_USERS, RECEIVE_REPORTS
**And** each enum value represents a system capability

**Given** that the Capability enum is created
**When** I create the UserCapability model in `prisma/schema.prisma`
**Then** the UserCapability model has fields: id (UUID), userId (UUID, reference to User), capability (Capability, enum), assignedAt (DateTime), assignedBy (UUID, reference to User, optional)
**And** there is a many-to-one relationship from UserCapability to User (userId → User.id)
**And** there is a many-to-one relationship from UserCapability to User (assignedBy → User.id)
**And** there is a unique composite index (userId, capability) to avoid duplicates

**Given** that the UserCapability model is created
**When** I create the UserTag model in `prisma/schema.prisma`
**Then** the UserTag model has fields: id (UUID), name (String), description (String, optional), color (String, optional), createdAt (DateTime), createdBy (UUID, reference to User)
**And** the name field is unique (maximum 20 tags in the system)
**And** there is a many-to-one relationship from UserTag to User (createdBy → User.id)

**Given** that the UserTag model is created
**When** I create the UserTagAssignment model in `prisma/schema.prisma`
**Then** the UserTagAssignment model has fields: id (UUID), userId (UUID, reference to User), userTagId (UUID, reference to UserTag), assignedAt (DateTime)
**And** there is a many-to-one relationship from UserTagAssignment to User (userId → User.id)
**And** there is a many-to-one relationship from UserTagAssignment to UserTag (userTagId → UserTag.id)
**And** there is a unique composite index (userId, userTagId) to avoid duplicates
**And** a user can have multiple tags assigned simultaneously

**Given** that all models are created
**When** I run `npx prisma migrate dev --name init_user_models`
**Then** the initial migration is created with all models
**And** the tables users, UserCapability, UserTag, UserTagAssignment are created in the database
**And** unique indexes are created correctly
**And** foreign key relationships are created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
**And** TypeScript types are generated automatically
**And** Prisma helpers include the new models

**Given** that models are generated
**When** I create the `types/models.ts` file
**Then** TypeScript types derived from Prisma are exported for User, UserCapability, UserTag, UserTagAssignment
**And** a CapabilityLabel type is created mapping each capability to its readable Spanish label
**And** the mapping includes: CREATE_FAILURE_REPORT → "✅ Reportar averías", CREATE_MANUAL_OT → "Crear OTs manuales", UPDATE_OWN_OT → "Actualizar OTs propias", VIEW_OWNS_OTS → "Ver OTs asignadas", VIEW_ALL_OTS → "Ver todas las OTs", COMPLETE_OT → "Completar OTs", MANAGE_STOCK → "Gestionar stock", ASSIGN_TECHNICIANS → "Asignar técnicos a OTs", VIEW_KPIS → "Ver KPIs avanzados", MANAGE_ASSETS → "Gestionar activos", VIEW_REPAIR_HISTORY → "Ver historial de reparaciones", MANAGE_PROVIDERS → "Gestionar proveedores", MANAGE_ROUTINES → "Gestionar rutinas", MANAGE_USERS → "Gestionar usuarios y sus capacidades", RECEIVE_REPORTS → "Recibir reportes automáticos"

**Given** that types are created
**When** I create the helper function `getDefaultCapabilities()` in `lib/auth.ts`
**Then** the function returns an array with only Capability.CREATE_FAILURE_REPORT
**And** this capability is the default for all new users except the initial administrator

**Given** that default capabilities are defined
**When** I create the helper function `getAllCapabilities()` in `lib/auth.ts`
**Then** the function returns an array with the 15 system capabilities
**And** each capability has its readable Spanish label
**And** capabilities are ordered logically (basic first, then advanced)

**FRs covered:** FR58 (base structure), FR68 (15 capabilities defined), FR59-62 (classification tags), FR66 (default capability)

---

## Story 1.3: Registro de Usuarios por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to register new users in the system by assigning temporary credentials and selecting individual capabilities for each user,
So that I can control who has access to the system and what each user can do without depending on predefined roles.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users/register` route
**Then** I see the user registration form with fields: full name, email, phone (optional), list of 15 capabilities with checkboxes, list of visual classification tags (optional)
**And** the capability checkboxes show readable Spanish labels ("✅ Reportar averías", "✅ Ver todas las OTs", not the internal code names)
**And** the can_create_failure_report checkbox is checked by default (cannot be unchecked)
**And** the email field has format validation
**And** there is a "Generate temporary password" button that creates a secure random password
**And** there is a "Register User" button that creates the user

**Given** that I am on the registration form
**When** I fill in the fields and select the user's capabilities
**Then** I can select from 0 to 15 individual capabilities (except can_create_failure_report which is always checked)
**And** I can select 0 or more visual classification tags from the existing list
**And** the classification tags are completely independent of capabilities (selecting "Operario" does NOT automatically grant capabilities)
**And** I see a visual summary of selected capabilities before creating the user

**Given** that I have completed the form correctly
**When** I click "Register User"
**Then** the system creates the user in the database with isFirstLogin = true status
**And** the password is hashed using bcryptjs before storage (never plain text)
**And** the selected capabilities are saved in the UserCapability table with assignment timestamps
**And** the assignedBy field is registered with my user ID
**And** the selected classification tags are assigned in UserTagAssignment
**And** I see a confirmation message with the created user's name and email
**And** I see the temporary credentials (email and password) to share with the user

**Given** that the user was created successfully
**When** the new user attempts to login for the first time
**Then** the system detects that isFirstLogin = true
**And** the user is redirected to the mandatory password change page
**And** the user cannot navigate to other sections until changing the password

**Given** that I am registering the first user in the system (initial administrator)
**When** the system detects that no other users exist
**Then** the initial administrator is created automatically with all 15 system capabilities preassigned
**And** the initial administrator has can_create_failure_report + the other 14 capabilities
**And** the initial administrator does NOT have isFirstLogin = true (can login normally)
**And** this is the only special case of preassigned capabilities

**Given** that I attempt to register a user with an already existing email
**When** I click "Register User"
**Then** the system shows a validation error: "El email ya está registrado en el sistema"
**And** the user is not created
**And** the form remains with the entered data for correction

**Given** that I attempt to register a user without selecting any additional capability
**When** I click "Register User"
**Then** the system successfully creates the user with only can_create_failure_report (which is default)
**And** the user can report failures but has no other capabilities
**And** I see a warning message: "El usuario tiene solo la capacidad básica de reportar averías. Puede asignar más capabilities más tarde."

**FRs covered:** FR58, FR59, FR62, FR64, FR66, FR67, FR67-A, FR67-B, FR68, FR68-C

---

## Story 1.4: Login de Usuarios con NextAuth

As a user of the gmao-hiansa system (any role),
I want to login using my email and password,
So that I can access the system functionalities according to the capabilities assigned to me.

**Acceptance Criteria:**

**Given** that I am a registered user in the system
**When** I access the `/login` route
**Then** I see a login form with fields: email, password, "Iniciar Sesión" button, "¿Olvidaste tu contraseña?" link (disabled in MVP), "Volver" link
**And** the form uses the PRD design system (colors, typography, 44x44px touch targets)
**And** the form is responsive (3 breakpoints)
**And** the email field has type="email" for browser validation
**And** the password field has type="password" with show/hide button
**And** there is a "Volver" link that redirects to the home page

**Given** that I am on the login form
**When** I correctly fill in email and password
**Then** the "Iniciar Sesión" button is enabled
**And** when clicked, the system sends credentials to NextAuth Credentials provider
**And** NextAuth searches for the user by email in the database
**And** NextAuth compares the hashed password using bcryptjs
**And** if credentials are correct, NextAuth creates a JWT session
**And** the session expires after 8 hours of inactivity
**And** I am redirected to the common dashboard (`/dashboard`)
**And** I see my basic KPIs (MTTR, MTBF, open OTs, critical stock)

**Given** that I attempt to login with an incorrect email
**When** I click "Iniciar Sesión"
**Then** the system shows a generic error: "Credenciales inválidas"
**And** the error does NOT reveal whether the email exists or not (security)
**And** the form remains with entered data for correction
**And** the failed attempt is logged in audit logs

**Given** that I attempt to login with an incorrect password
**When** I click "Iniciar Sesión"
**Then** the system shows a generic error: "Credenciales inválidas"
**And** after 5 failed attempts in 15 minutes from the same IP
**Then** the system temporarily blocks the IP for 15 minutes (Rate Limiting per NFR-S9)
**And** I see a message: "Demasiados intentos fallidos. Intente nuevamente en 15 minutos."
**And** all failed attempts are logged in audit logs

**Given** that I successfully login
**When** NextAuth creates the session
**Then** the JWT session contains: user ID, email, name, list of capabilities, list of classification tags
**And** the last login is updated in the database with current timestamp
**And** the session is stored in an httpOnly cookie for security (NFR-S8)
**And** the cookie has security configuration: secure=true on HTTPS, sameSite=strict

**Given** that I already have an active session
**When** I access `/login` again
**Then** I am automatically redirected to the dashboard (`/dashboard`)
**And** I do not see the login form (already authenticated)

**Given** that I successfully login
**When** I am redirected to the dashboard
**Then** I see a Header with my name and a "Cerrar Sesión" button
**And** the side navigation shows only modules for which I have assigned capabilities (per FR73-74)
**And** if I have no capability beyond can_create_failure_report, I see only the "Reportar Avería" module

**Given** that I login on an unsupported browser (Firefox, Safari)
**When** the page loads
**Then** I see a warning message: "Este navegador no es soportado. Por favor use Chrome o Edge para una experiencia óptima."
**And** I can continue using the application at my own risk (not a block, just a warning)

**Given** that my user is marked as isActive = false
**When** I attempt to login
**Then** the system shows an error: "Su cuenta ha sido desactivada. Contacte al administrador."
**And** I cannot login until an administrator reactivates my account

**FRs covered:** FR58 (basic login), FR69 (profile access), NFR-S1 (mandatory authentication), NFR-S2 (hashed passwords), NFR-S3 (HTTPS/TLS), NFR-S6 (8h sessions), NFR-S9 (rate limiting)

---

## Story 1.5: Cambio de Contraseña Obligatorio en Primer Acceso

As a new user of the system who has just been registered,
I want to be forced to change my temporary password the first time I login,
So that my account has a secure password chosen by me and not the temporary password assigned by the administrator.

**Acceptance Criteria:**

**Given** that I am a user with isFirstLogin = true
**When** I successfully login with my temporary credentials
**Then** the system detects that isFirstLogin = true
**And** I am automatically redirected to the `/change-password` route
**And** I CANNOT navigate to other sections of the application until changing the password
**And** if I attempt to access any other route (e.g., `/dashboard`, `/assets`, `/work-orders`)
**Then** I am redirected back to `/change-password`
**And** I see an explanatory message: "Debe cambiar su contraseña temporal en el primer acceso antes de continuar."

**Given** that I am on the password change page
**When** the page loads
**Then** I see a form with fields: current password (optional for first access), new password, confirm new password, "Cambiar Contraseña" button
**And** I see visible password requirements: minimum 8 characters, at least one uppercase, one lowercase, one number
**And** I see a real-time password strength indicator (weak, medium, strong)
**And** the form uses the PRD design system
**And** password fields have show/hide button

**Given** that I am on the password change form
**When** I type the new password
**Then** I see real-time validation:
- If less than 8 characters: "Mínimo 8 caracteres requeridos"
- If no uppercase: "Al menos una mayúscula requerida"
- If no lowercase: "Al menos una minúscula requerida"
- If no number: "Al menos un número requerido"
- If meets all requirements: "Contraseña fuerte ✅"
**And** the "Cambiar Contraseña" button remains disabled until the password meets all requirements

**Given** that I have entered a valid new password
**When** I complete the "confirm new password" field
**Then** the system validates in real-time that both passwords match
**And** if they don't match: "Las contraseñas no coinciden"
**And** the "Cambiar Contraseña" button is disabled until they match

**Given** that I have completed the form correctly with matching passwords
**When** I click "Cambiar Contraseña"
**Then** the system hashes the new password using bcryptjs
**And** updates the user's password field with the new hash
**And** updates the isFirstLogin field to false
**And** logs the password change in audit logs
**And** displays a success message: "Contraseña cambiada exitosamente. Redirigiendo al dashboard..."
**And** automatically redirects me to the `/dashboard` dashboard after 2 seconds
**And** I can now freely navigate all modules according to my capabilities

**Given** that I have already changed my password (isFirstLogin = false)
**When** I login in the future
**Then** I am NO longer redirected to `/change-password`
**And** I can access the dashboard directly
**And** the login flow is normal

**Given** that I am the initial administrator with all 15 capabilities preassigned
**When** I login for the first time
**Then** I do NOT have isFirstLogin = true (special case per FR68-C)
**And** I can access the dashboard directly without changing password
**And** I can voluntarily change my password from my profile if desired

**Given** that I attempt to change my password later (not first access)
**When** I access `/change-password` from my profile
**Then** I must enter my current password to confirm my identity
**And** the "current password" field is required
**And** the system validates that the current password is correct before allowing the change
**And** the rest of the flow is the same as first access

**FRs covered:** FR58, FR71 (change password), FR72-A (mandatory change on first access), FR72-B (temporary credentials)

---

## Story 1.6: Gestión de Capabilities por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to edit any user's capabilities using a visual interface with readable Spanish checkboxes,
So that I can adjust what each user can do according to changing needs without depending on rigid roles.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users` route
**Then** I see a list of all system users
**And** the list shows: name, email, classification tags (colored badges), number of assigned capabilities, status (active/inactive), last login
**And** there is an "Editar Capabilities" button in each user row
**And** there is a "Ver Perfil Completo" button that opens a details modal

**Given** that I am on the users list
**When** I click "Editar Capabilities" for a user
**Then** a modal or page opens at `/users/[id]/edit-capabilities`
**And** I see the user's name and email in the header
**And** I see the 15 capabilities organized in a list with checkboxes
**And** each checkbox shows the readable Spanish label ("✅ Reportar averías", "Crear OTs manuales", "Actualizar OTs propias", etc.)
**And** the user's currently assigned capabilities are checked
**And** the can_create_failure_report checkbox is checked and cannot be unchecked (always default)
**And** there is a brief description of each capability on hover (tooltip)
**And** I see a visual summary of assigned capabilities: "7 of 15 capabilities selected"
**And** there are "Cancelar" and "Guardar Cambios" buttons

**Given** that I am editing a user's capabilities
**When** I check or uncheck boxes
**Then** the visual summary updates in real-time: "8 of 15 capabilities selected"
**And** capabilities are organized in logical groups:
- **Básicas:** Reportar averías (always checked), Ver OTs asignadas
- **Trabajo:** Actualizar OTs propias, Completar OTs, Crear OTs manuales
- **Visibilidad:** Ver todas las OTs, Ver historial reparaciones, Ver KPIs avanzados
- **Gestión:** Gestionar activos, Gestionar stock, Gestionar proveedores, Gestionar rutinas, Asignar técnicos a OTs
- **Administración:** Gestionar usuarios y sus capacidades, Recibir reportes automáticos
**And** I see a visual separator between groups
**And** there are "Marcar Todas" and "Desmarcar Todas" buttons for quick editing

**Given** that I have modified capabilities
**When** I click "Guardar Cambios"
**Then** the system shows a confirmation dialog: "¿Está seguro de cambiar las capabilities de este usuario? Esta acción afectará su acceso al sistema."
**And** if I confirm, the system:
- Deletes all current user capabilities (UserCapability records)
- Creates new UserCapability records for selected capabilities
- Registers assignedBy with my user ID
- Registers assignedAt timestamp
- Logs the change in audit logs with details: which capabilities were added, which were removed
- Shows success message: "Capabilities actualizadas exitosamente para [Nombre Usuario]"
**And** if I cancel, changes are discarded and modal closes

**Given** that I am editing my own capabilities (I am Elena editing myself)
**When** I uncheck the can_manage_users capability
**Then** the system shows a special warning: "ADVERTENCIA: Está a punto de quitarse la capability de gestionar usuarios. No podrá editar usuarios ni capabilities después de guardar. ¿Desea continuar?"
**And** I must explicitly confirm with a checkbox "Entiendo las consecuencias" before being able to save
**And** if I confirm and save, I lose access to `/users` immediately
**And** I am redirected to dashboard and navigation no longer shows "Usuarios"

**Given** that I am the only user with can_manage_users in the system
**When** I attempt to uncheck my own can_manage_users capability
**Then** the system shows a blocking error: "ERROR: No puede quitarse la última capability can_manage_users del sistema. Debe haber al menos un administrador."
**And** the can_manage_users checkbox remains checked and disabled
**And** I cannot save changes

**Given** that I have successfully saved capability changes
**When** the affected user is logged into the system
**Then** the user's session updates in real-time via SSE
**And** the user's navigation updates immediately (modules appear/disappear)
**And** if the user lost access to a module where they were, they see a message: "Sus permisos han cambiado. Ha sido redirigido."
**And** if the user gained access to a new module, it appears immediately in their navigation

**Given** that I am editing the initial administrator's capabilities
**When** I see their capabilities
**Then** all 15 capabilities are checked (special case FR68-C)
**And** I can uncheck capabilities except can_manage_users if they are the only admin
**And** the system functions the same as any other user

**Given** that I want to see what capabilities a user has without editing
**When** I click "Ver Perfil Completo"
**Then** a read-only modal opens with:
- User's basic information
- List of assigned capabilities with disabled checkboxes (read-only)
- List of assigned classification tags
- History of capability changes last 6 months
**And** there is no "Guardar" button (read-only)

**FRs covered:** FR58, FR67 (readable checkboxes), FR68 (15 capabilities), FR68-A, FR69-A (edit user info), NFR-S5 (audit logs for critical actions)

---

## Story 1.7: Etiquetas de Clasificación Visual

As an Elena (Administrator with can_manage_users capability),
I want to create, edit, and delete up to 20 visual classification tags (e.g., Operario, Técnico, Supervisor) and assign them to users for visual organization,
So that I can visually classify users without these tags affecting their capabilities (they are completely independent).

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users/tags` route
**Then** I see a visual classification tags management page
**And** I see a list of all existing tags
**And** each tag shows: name, color (badge), description (optional), number of users who have it assigned, creation date, creator
**And** there is a "Crear Nueva Etiqueta" button
**And** each tag has "Editar" and "Eliminar" buttons
**And** I see the total count: "X of 20 tags created"

**Given** that I am on the tags management page
**When** I click "Crear Nueva Etiqueta"
**Then** a modal opens with form:
- "Nombre de etiqueta" field (text, required, max 50 characters)
- "Descripción" field (optional text, max 200 characters)
- "Color" selector (7 predefined semaphore colors: green #28A745, orange #FD7E14, red #DC3545, blue #17A2B8, yellow #FFC107, gray #6C757D, purple #6F42C1)
- Badge preview with selected color
- "Cancelar" and "Crear Etiqueta" buttons
**And** the form validates that no other tag with the same name exists (case-insensitive)

**Given** that I have completed the new tag form
**When** I click "Crear Etiqueta"
**Then** the system validates:
- Name is not empty
- Name is not duplicated (case-insensitive)
- Does not exceed the limit of 20 tags in the system
**And** if validation passes:
- Creates the UserTag record in the database
- Registers createdBy with my user ID
- Registers createdAt with current timestamp
- Shows success message: "Etiqueta [Nombre] creada exitosamente"
- Closes the modal and updates the tag list
**And** if validation fails:
- Shows specific error
- The modal remains open for correction

**Given** that I want to edit an existing tag
**When** I click "Editar" on a tag
**Then** a modal opens with the pre-filled form:
- Tag name (editable)
- Description (editable)
- Color selector (editable)
- Updated badge preview
- "Cancelar" and "Guardar Cambios" buttons
**And** I see how many users have this tag assigned
**And** if there are assigned users, I see a warning: "X users have this tag assigned. Changes will affect all these users."

**Given** that I am editing a tag
**When** I change the name, description, or color
**Then** the badge preview updates in real-time
**And** when I click "Guardar Cambios":
- The system updates the UserTag record
- Users who have this tag assigned see the updated badge in real-time via SSE
- The change is logged in audit logs
- Shows success message: "Etiqueta [Nombre] actualizada exitosamente"

**Given** that I want to delete a tag
**When** I click "Eliminar" on a tag
**Then** the system shows a confirmation dialog: "¿Está seguro de eliminar la etiqueta [Nombre]? This action will unassign the tag from X users who have it assigned."
**And** if I confirm:
- Deletes the UserTag record
- Deletes all associated UserTagAssignment records (users lose the tag)
- Logs the deletion in audit logs
- Shows success message: "Etiqueta [Nombre] eliminada exitosamente"
**And** if I cancel, the action is cancelled

**Given** that I am creating a tag and 20 tags already exist in the system
**When** I click "Crear Nueva Etiqueta"
**Then** the button is disabled
**And** I see a message: "Ha alcanzado el límite máximo de 20 etiquetas. Elimine etiquetas existentes antes de crear nuevas."
**And** No more tags can be created

**Given** that I want to assign tags to a user
**When** I am on the user editing screen (Story 1.6)
**Then** I see a "Etiquetas de Clasificación Visual" section
**And** I see a multi-select list with existing tags
**And** The user's currently assigned tags are checked
**And** I can select or deselect multiple tags
**And** I see a preview of the badges the user will have assigned
**And** When saving user changes:
- Selected tags are assigned in UserTagAssignment
- Deselected tags are removed from UserTagAssignment
- The user sees their updated tags in their profile in real-time

**Given** that I am viewing a user's profile (not editing)
**When** I look at their classification tags
**Then** I see colored badges for each assigned tag
**And** On hover over a badge, I see tooltip with tag name and description
**And** Tags are SOLO visual for classification
**And** Tags do NOT grant, do NOT remove, do NOT modify capabilities

**Given** that I am any user (not administrator)
**When** I access my profile
**Then** I can see the tags I have assigned
**And** I CANNOT edit my own tags
**And** I CANNOT edit other users' tags (no access to `/users/tags`)

**Given** that I assign the "Operario" tag to Carlos
**When** Carlos has the can_create_failure_report capability
**Then** Carlos has the "Operario" badge as a visual tag in his profile
**And** Carlos can continue reporting failures (his capability)
**And** If I later also assign him the "Técnico" tag
**Then** Carlos has both badges: "Operario" and "Técnico"
**And** Tags do NOT grant new capabilities to Carlos

**FRs covered:** FR59 (create up to 20 tags), FR61 (delete tags), FR62 (multiple tags simultaneously), FR64 (assign tags), FR65 (remove tags), FR67-A (tags independent of capabilities), FR67-B (same tag does NOT grant same capabilities)

---

## Story 1.8: Perfil de Usuario y Gestión de Credenciales

As a user of the system (any role),
I want to access my personal profile to view and edit my information (name, email, phone) and change my password,
So that I can keep my data updated and maintain my account security.

**Acceptance Criteria:**

**Given** that I am an authenticated user
**When** I access the `/profile` route
**Then** I see the "Mi Perfil" page with sections:
- **Información Personal:** full name, email, phone (optional), last password change date
- **Mis Capabilities:** list of capabilities I have assigned (read-only, badges)
- **Mis Etiquetas:** badges of classification tags I have assigned (read-only)
- **Seguridad:** "Cambiar Contraseña" button
- **"Guardar Cambios"** button (to edit personal information)
**And** the page uses the PRD design system
**And** the page is responsive (3 breakpoints)

**Given** that I am on my profile
**When** I want to edit my personal information
**Then** the name, email, and phone fields are editable
**And** the email field has real-time format validation
**And** if I change the email to one that already exists in the system, I see error: "Este email ya está registrado"
**And** the "Guardar Cambios" button is only enabled when there are changes
**And** when I click "Guardar Cambios":
- The system validates the data
- Updates my User record in the database
- Logs the change in audit logs
- Shows success message: "Información actualizada exitosamente"
**And** if I change my email, my session updates with the new email

**Given** that I am on my profile
**When** I want to change my password
**Then** I click the "Cambiar Contraseña" button
**And** a modal opens or I go to `/profile/change-password`
**And** I see a form with fields:
- Current password (required to verify myself)
- New password
- Confirm new password
**And** I see password requirements: minimum 8 characters, one uppercase, one lowercase, one number
**And** I see real-time strength indicator
**And** fields have show/hide button
**And** when I complete the form and click "Cambiar Contraseña":
- The system validates that the current password is correct
- Hashes the new password with bcryptjs
- Updates the password field in the database
- Logs the change in audit logs
- Shows success message: "Contraseña cambiada exitosamente"
- Closes the modal

**Given** that I am Elena (administrator with can_manage_users capability)
**When** I access another user's profile at `/users/[id]/profile`
**Then** I can see all the user's information:
- Personal information (name, email, phone)
- Assigned capabilities (list with badges)
- Assigned classification tags
- Status (active/inactive)
- Last login
- Account creation date
**And** I see "Editar Información" and "Gestionar Capabilities" buttons (Story 1.6)
**And** The information is read-only in the profile view
**And** I can edit the user's personal information by clicking "Editar Información"

**Given** that Elena is editing another user's personal information
**When** she modifies name, email, or phone
**Then** The system allows editing the same fields that the user edits in their own profile
**And** Elena can view and edit any user's personal information
**And** Changes are logged in audit logs with "editedBy: Elena"

**Given** that I am a user without can_manage_users capability
**When** I attempt to access another user's profile at `/users/[id]/profile`
**Then** The system denies me access (FR73, FR75)
**And** I see a message: "No tiene permiso para ver perfiles de otros usuarios. Contacte al administrador."
**And** I am redirected to my own profile `/profile`
**And** The navigation does not show "Users" module (I don't have can_manage_users capability)

**Given** that I am on my profile
**When** I look at the "Mis Capabilities" section
**Then** I see a list of the capabilities I have assigned
**And** Each capability is shown as a badge with its Spanish label ("✅ Reportar averías", "Ver todas las OTs", etc.)
**And** Capabilities are read-only (I cannot edit them here, that's Story 1.6)
**And** I see a summary: "Tienes X of 15 system capabilities"

**Given** that I am on my profile
**When** I look at the "Mis Etiquetas" section
**Then** I see badges of classification tags I have assigned
**And** If I have "Operario" and "Técnico" tags, I see both badges
**And** Tags are read-only (I cannot edit them myself)
**And** I understand that tags are only visual for classification

**Given** that I want to change my profile photo (optional, not in MVP)
**When** I am on my profile
**Then** This functionality is NOT available in MVP (future)
**And** I see an avatar placeholder with my initials

**FRs covered:** FR69 (profile access), FR69-A (Elena edits any user's info), FR70 (user edits own info), FR71 (change password), FR73 (access by modules), FR74 (navigation by capabilities), FR75 (denied unauthorized access), FR76 (explanatory message)

---

## Story 1.9: Historial de Actividad de Usuarios

As an Elena (Administrator with can_manage_users capability),
I want to view the activity history of any user for the last 6 months and their completed work history (OTs, productivity),
So that I can audit the performance and activity of team members.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access a user's profile at `/users/[id]/profile`
**Then** I see an "Historial de Actividad" section with tabs:
- "Actividad de Sistema" (last 6 months)
- "Historial de Trabajos" (completed OTs, productivity)

**Given** that I am on the "Actividad de Sistema" tab
**When** the tab loads
**Then** I see a table or timeline with the user's actions from the last 6 months:
- Date and time of action
- Action type (login, profile change, capability change, tag assignment)
- Action details (e.g., "Capabilities changed: +Asignar técnicos, -Ver KPIs")
- Performed by (who did the action, if another administrator)
**And** There are filters by: action type, date range
**And** There is an "Exportar a Excel" button to download the history
**And** Most recent actions appear first (descending chronological order)

**Given** that I am filtering the activity history
**When** I select an action type (e.g., "Cambio de capabilities")
**Then** the table shows only actions of that type
**And** I see count: "X actions found in date range"
**And** I can apply multiple filters simultaneously

**Given** that I am on the "Historial de Trabajos" tab
**When** the tab loads
**Then** I see a summary of the user's performance:
- Total completed OTs (in selected date range)
- User's average MTTR (Mean Time To Repair)
- Completed OTs per week (average)
- Most frequently used spare parts
- Last completed OT (date and equipment)
**And** I see a bar chart with completed OTs per week
**And** I see a detailed list of completed OTs with:
- OT number
- Completion date
- Equipment
- Total repair time
- Spare parts used
- Link to the OT (to view details)

**Given** that I want to filter work history by date range
**When** I select a range (e.g., "Last 30 days", "Last 3 months", "Custom")
**Then** the KPIs are recalculated for the selected range
**And** the chart updates with range data
**And** the OT list is filtered by completion date

**Given** that I am Elena viewing María's work history
**When** I see that María has an MTTR of 3.5 hours (low average)
**Then** I see a positive indicator: "MTTR de 3.5h (18% faster than team average) 🟢"
**And** If María has an MTTR of 7 hours (high average)
**Then** I see an attention indicator: "MTTR de 7h (40% slower than team average) 🔴"
**And** Indicators compare with team average

**Given** that I am a user without can_manage_users capability
**When** I access my own profile `/profile`
**Then** I see a "Mi Actividad" section with:
- My last 30 days of activity (read-only)
- Recent logins
- Profile changes I made
- I do NOT see completed work history (need specific capability per FR72-C)
**And** The history is limited to my own actions
**And** The range is fixed to last 30 days (cannot see 6 months)

**Given** that I am a user with can_view_all_ots capability (but without can_manage_users)
**When** I am on my profile
**Then** I do NOT see the work history section (per FR72-C, that capability is different)
**And** I only see my system activity from last 30 days

**Given** that I want to view the activity history of a user with many records
**When** the table has more than 50 records
**Then** the table is paginated (50 records per page)
**And** I see pagination controls: "Anterior", "Page X of Y", "Siguiente"
**And** I can jump to a specific page
**And** Pagination does not affect Excel export (exports everything)

**Given** that I click "Exportar a Excel" on activity history
**When** the file is generated
**Then** a .xlsx file compatible with Microsoft Excel 2016+ is downloaded
**And** The file has separate sheets: "Actividad de Sistema", "Historial de Trabajos" (if applicable)
**And** Each sheet has corresponding columns with complete data
**And** The file includes the user's name and export date in the filename: "historial_juan_perez_2026-03-07.xlsx"

**Given** that a user has been deleted from the system
**When** I attempt to view their activity history
**Then** I see a message: "Este usuario ha sido eliminado del sistema. El historial no está disponible."
**And** The profile view option no longer exists in the user list

**FRs covered:** FR72 (activity history last 6 months), FR72-C (complete work history with completed OTs, user MTTR, spare parts used, productivity), NFR-S5 (audit logs for critical actions)

---

## Story 1.10: Eliminación de Usuarios por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to delete users from the system who no longer work at the company or no longer need access,
So that I can keep the user list updated and avoid orphaned accounts.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I am on the users list `/users`
**Then** each user row has an "Eliminar Usuario" button
**And** the button has a trash icon and warning color (red)
**And** on hover, I see tooltip: "Eliminar este usuario del sistema"

**Given** that I want to delete a user
**When** I click "Eliminar Usuario" on any row
**Then** a confirmation modal opens with:
- Title: "¿Eliminar Usuario?"
- Message: "Está a punto de eliminar al usuario [Nombre] ([Email]) del sistema. Esta acción es irreversible."
- Prominent warnings:
  - "⚠️ El usuario perderá todo acceso al sistema inmediatamente"
  - "⚠️ Las OTs asignadas al usuario se reasignarán o cancelarán"
  - "⚠️ El historial del usuario se mantendrá para auditoría"
- List of OTs currently assigned to the user (if any)
- "Motivo de eliminación" field (text, required, max 500 characters)
- OT handling options:
  - "Reasignar a:" [dropdown of other users]
  - "Cancelar OTs abiertas"
- Confirmation checkbox: "Entiendo que esta acción no se puede deshacer"
- Buttons: "Cancelar" (secondary), "Eliminar Usuario" (danger, disabled until confirmed)

**Given** that the user has OTs currently assigned
**When** I open the deletion modal
**Then** I see a summary: "Este usuario tiene X OTs asignadas:"
- List of OTs with number, equipment, status
- "X en En Progreso", "Y en Pendiente", "Z Pendiente Repuesto"
**And** I must select how to handle each OT before deleting
**And** The options are:
- Reassign to another user (I select from dropdown)
- Cancel OT (I check "Cancelar OTs abiertas" checkbox)
- For each OT, I choose individually or in bulk

**Given** that I have completed the deletion form
**When** I select to reassign OTs to another user
**Then** the dropdown shows only users with can_update_own_ot or can_complete_ot capability
**And** I see the number of OTs the selected user already has assigned
**And** If I reassign, OTs are transferred with history maintained (shows who worked on the OT before)

**Given** that I have completed all required fields
**When** I check the confirmation checkbox and click "Eliminar Usuario"
**Then** the system:
- Verifies that I completed deletion reason
- Verifies that I selected OT handling (if there are any)
- Marks the user as isActive = false (soft delete)
- Updates deletedAt field with current timestamp
- Registers deletedBy with my user ID
- Saves the deletion reason
- Reassigns or cancels OTs according to my selection
- Logs the deletion in audit logs
- Shows success message: "Usuario [Nombre] eliminado exitosamente. X OTs reasignadas, Y OTs canceladas."
**And** The user disappears from the active users list
**And** The user can no longer login (attempts login → "Cuenta desactivada")

**Given** that I have deleted a user
**When** I go to the users list
**Then** the deleted user NO longer appears in the main list
**And** If I activate a "Mostrar inactivos" filter, I see deleted users with "Inactivo" badge
**And** I can "Reactivar" a deleted user (marks them as isActive = true)

**Given** that I am the only user with can_manage_users capability
**When** I attempt to delete myself
**Then** the system shows a blocking error: "ERROR: No puede eliminarse a sí mismo si es el único administrador del sistema."
**And** The "Eliminar Usuario" button is disabled on my own row
**And** I must assign can_manage_users to another user before I can delete myself

**Given** that there are other users with can_manage_users capability
**When** I attempt to delete myself
**Then** the system shows a warning: "ADVERTENCIA: Está a punto de eliminarse a sí mismo del sistema. Perderá acceso inmediatamente. ¿Desea continuar?"
**And** I must explicitly confirm with an additional checkbox: "Entiendo que perderé acceso al sistema inmediatamente."
**And** If I confirm, I delete myself and am redirected to login (my session ends)

**Given** that I deleted a user by mistake
**When** I want to undo the deletion
**Then** there is NO "restore" function in the modal (the action is marked as irreversible)
**And** I can reactivate a deleted user from the inactive list (if I activate the filter)
**And** When reactivating, the user regains access with their previous credentials
**And** OTs that were cancelled during deletion are NOT restored (remain cancelled)

**Given** that a deleted user attempts to login
**When** they enter their credentials
**Then** the system detects that isActive = false or deletedAt is not null
**And** shows error: "Su cuenta ha sido desactivada o eliminada. Contacte al administrador."
**And** the user cannot access the system

**Given** that I am deleting a user with extensive history
**When** I confirm the deletion
**Then** the user's activity history is preserved in the database (for auditing)
**And** OTs completed by the user maintain the record that they worked on them
**And** The history can be consulted by activating "Mostrar inactivos" filters

**FRs covered:** FR70-A (delete users), NFR-S5 (audit logs for critical actions)

---

## Story 1.11: Control de Acceso por Módulos

As a user of the system with specific assigned capabilities,
I want to access only the modules for which I have capacities and see dynamic navigation based on my permissions,
So that the interface shows only what I can do and does not confuse me with unauthorized options.

**Acceptance Criteria:**

**Given** that I am an authenticated user with specific capabilities
**When** I successfully login
**Then** I am redirected to the common dashboard `/dashboard`
**And** I see the side navigation (or hamburger on mobile)
**And** the navigation shows ONLY the modules for which I have assigned capabilities
**And** modules without permissions do NOT appear in navigation
**And** The number of visible modules varies according to my capabilities

**Given** that I have only the can_create_failure_report capability (basic user like Carlos)
**When** I see the navigation
**Then** I see ONLY one visible module: "Reportar Avería"
**And** I do NOT see: "Órdenes de Trabajo", "Activos", "Repuestos", "Proveedores", "Rutinas", "KPIs", "Usuarios"
**And** The navigation is minimalist according to my permissions

**Given** that I have capabilities: can_create_failure_report, can_view_own_ots, can_update_own_ot, can_complete_ot (technician like María)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Mis Órdenes de Trabajo"
**And** I do NOT see management modules: "Activos", "Repuestos", "Proveedores", "Rutinas", "KPIs", "Usuarios"

**Given** that I have capabilities: can_view_all_ots, can_assign_technicians (supervisor like Javier)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Tablero Kanban" (all team OTs)
**And** I can view and manage OTs from the entire team

**Given** that I have capabilities: can_view_kpis, can_manage_users, can_manage_assets (administrator like Elena)
**When** I see the navigation
**Then** I see ALL system modules:
- "Reportar Avería"
- "Mis Órdenes de Trabajo"
- "Tablero Kanban"
- "Activos"
- "Repuestos"
- "Proveedores"
- "Rutinas"
- "Dashboard de KPIs"
- "Usuarios"
**And** I have complete access to all functionalities

**Given** that I have capability can_manage_stock (stock manager like Pedro)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Repuestos"
**And** I can manage stock but do NOT see other modules

**Given** that I am on the common dashboard
**When** I see the basic KPIs (MTTR, MTBF, open OTs, critical stock)
**Then** these KPIs are visible to ALL users (no specific capability required)
**And** If I have can_view_kpis capability
**Then** KPIs are interactive and I can drill-down (Global → Planta → Línea → Equipo)
**And** If I do NOT have can_view_kpis
**Then** KPIs are read-only (I cannot interact beyond the general view)

**Given** that I attempt to access an UNAUTHORIZED module
**When** I type the URL directly in the browser (e.g., `/assets` without can_manage_assets)
**Then** the system detects that I do not have the required capability
**And** shows an error message: "Acceso Denegado"
**And** shows an explanatory message: "No tiene permiso para acceder a este módulo. Contacte al administrador."
**And** I am redirected to the dashboard after 3 seconds
**And** The unauthorized access attempt is logged in audit logs

**Given** that I attempt to access multiple unauthorized routes
**When** the system detects the attempt pattern
**Then** after 10 failed attempts in 5 minutes from my IP
**Then** the system temporarily blocks my IP for 5 minutes
**And** I see message: "Demasiados intentos de acceso no autorizado. Intente nuevamente en 5 minutos."

**Given** that an administrator assigns me new capabilities
**When** the capabilities are saved
**Then** my session updates in real-time via SSE
**And** Navigation updates immediately (new modules appear, old ones disappear)
**And** If I am in a module I lost access to
**Then** I see a message: "Sus permisos han cambiado. Ha sido redirigido."
**And** I am automatically redirected to the dashboard

**Given** that I am using a tablet (768-1200px)
**When** I see the navigation
**Then** Navigation is simplified for medium screens
**And** Modules are organized in a compact menu
**And** Touch targets remain 44x44px minimum

**Given** that I am using a mobile (<768px)
**When** I see the navigation
**Then** Navigation is at the bottom of the screen
**And** Modules are organized in a horizontal menu with icons
**And** Touching an icon opens the corresponding module
**And** Touch targets are 44x44px minimum (WCAG AA)

**Given** that I have capability can_view_own_ots but NOT can_view_all_ots
**When** I access the Work Orders section
**Then** I see ONLY "Mis Órdenes de Trabajo" (those where I am assigned)
**And** I do NOT see the "Tablero Kanban" (requires can_view_all_ots)
**And** I cannot see other users' OTs

**Given** that I have capability can_view_all_ots
**When** I access the Work Orders section
**Then** I see BOTH options: "Mis Órdenes de Trabajo" and "Tablero Kanban"
**And** I can toggle between personal view and supervisor view
**And** The OTs module is complete

**Given** that I am on the "Reportar Avería" page
**When** the page loads
**Then** I can access because I have can_create_failure_report (all users have it)
**And** The form is available and functional

**Given** that an administrator removes my can_create_failure_report capability (extreme case, should not happen per FR66)
**When** I attempt to access any module
**Then** I have NO modules available in navigation
**And** I see a special message: "Su usuario no tiene capabilities asignadas. Contacte al administrador."
**And** I am redirected to the dashboard (which still shows basic KPIs)

**Given** that I am using the system
**When** my session expires after 8 hours of inactivity
**Then** I am redirected to `/login`
**And** I see a message: "Su sesión ha expirado. Por favor haga login nuevamente."

**FRs covered:** FR73 (access by modules according to capabilities), FR74 (navigation shows only authorized modules), FR75 (automatic denial of direct URL), FR76 (explanatory message for denied access), FR91 (common dashboard with basic KPIs for all), FR91-A (drill-down only with can_view_kpis), NFR-S6 (sessions expire 8h)

---
