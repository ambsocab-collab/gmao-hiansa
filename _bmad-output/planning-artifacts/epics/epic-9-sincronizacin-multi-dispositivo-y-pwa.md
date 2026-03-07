# Epic 9: Sincronización Multi-Dispositivo y PWA

Permitir que todos los usuarios accedan al sistema desde desktop, tablet y móvil con responsive design optimizado, capacidad de instalación como PWA en dispositivos móviles, sincronización en tiempo real vía SSE y notificaciones push para cambios críticos.

**Actor Principal:** Todos los usuarios del sistema (Carlos, María, Elena, Javier, Pedro)

**FRs Cubiertas:** FR96, FR97, FR98, FR99, FR100 (5 FRs)

**Dependencias:**
- Depende de: Todos los epics anteriores (funcionalidad core)
- Es prerequisito de: Phase 3 (funcionalidades avanzadas móviles)

---

## Story 9.1: Responsive Design con 3 Breakpoints

**Como** Usuario del sistema accediendo desde diferentes dispositivos (desktop, tablet, móvil),
**quiero que la interfaz se adapte automáticamente al tamaño de mi pantalla,
**para** tener una experiencia optimizada sin importar el dispositivo que uso.

**Acceptance Criteria - Breakpoints Definidos (FR98):**

**Given** que acceso al sistema desde diferentes dispositivos
**When** la interfaz se carga
**Then** aplica el layout correspondiente según el ancho de pantalla:

```css
/* breakpoints.css */
/* FR98: 3 breakpoints definidos */

/* Desktop: > 1200px */
@media (min-width: 1201px) {
  /* Layout completo con navegación lateral */
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr; /* Sidebar + Content */
    grid-template-rows: auto 1fr; /* Header + Main */
  }

  .sidebar {
    position: fixed;
    width: 250px;
    height: 100vh;
    /* Navegación lateral completa con todos los módulos */
  }

  .content {
    margin-left: 250px;
    padding: 2rem;
  }
}

/* Tablet: 768px - 1200px */
@media (min-width: 768px) and (max-width: 1200px) {
  /* Layout simplificado con navegación collapsible */
  .layout {
    display: grid;
    grid-template-columns: 60px 1fr; /* Sidebar colapsada + Content */
    grid-template-rows: auto 1fr;
  }

  .sidebar {
    position: fixed;
    width: 60px;
    /* Solo iconos, tooltips al hover */
  }

  .sidebar.expanded {
    width: 250px;
    /* Se expande al hacer hover/click */
  }

  .content {
    margin-left: 60px;
    padding: 1.5rem;
  }

  /* Componentes adaptados */
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en tablet */
  }

  .data-table {
    font-size: 0.875rem;
    /* Columnas menos detalladas */
  }
}

/* Móvil: < 768px */
@media (max-width: 767px) {
  /* Layout móvil con navegación inferior */
  .layout {
    display: flex;
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: white;
    border-top: 1px solid #e5e7eb;
    z-index: 50;
    /* Navegación tipo app móvil (bottom navigation) */
  }

  .content {
    margin-bottom: 60px; /* Espacio para nav inferior */
    padding: 1rem;
  }

  /* Componentes apilados verticalmente */
  .kpi-cards {
    grid-template-columns: 1fr; /* 1 columna */
  }

  .form-fields {
    flex-direction: column;
    gap: 1rem;
  }

  /* Botones y CTAs full width */
  .button {
    width: 100%;
    padding: 1rem;
  }

  /* Tablas con scroll horizontal */
  .data-table {
    overflow-x: auto;
  }

  .data-table table {
    min-width: 600px;
  }
}
```

**Acceptance Criteria - Desktop Layout (>1200px):**

**Given** que accedo desde un desktop (1920x1080)
**When** la página carga
**Then** veo:
- ✅ Navegación lateral fija a la izquierda (250px ancho)
- ✅ Todos los módulos visibles en el sidebar
- ✅ Header con nombre de usuario y breadcrumbs
- ✅ KPI cards en grid de 4 columnas
- ✅ Tablas de datos con todas las columnas visibles
- ✅ Modales centrados con tamaño máximo 800px

```tsx
// Desktop Layout Example
<DesktopLayout>
  <Sidebar>
    <SidebarNav>
      <NavItem icon="dashboard" label="Dashboard" href="/" />
      <NavItem icon="clipboard" label="Mis OTs" href="/ordenes-trabajo?asignadas=me" />
      <NavItem icon="columns" label="Kanban" href="/ordenes-trabajo/kanban" />
      <NavItem icon="warning" label="Reportar Avería" href="/avisos/nuevo" />
      <NavItem icon="box" label="Stock" href="/repuestos" />
      <NavItem icon="calendar" label="Rutinas" href="/rutinas" />
      <NavItem icon="chart-line" label="KPIs" href="/dashboard/kpis" />
      <NavItem icon="users" label="Usuarios" href="/usuarios" />
    </SidebarNav>
  </Sidebar>

  <TopBar>
    <Breadcrumb />
    <UserMenu />
  </TopBar>

  <MainContent>
    {children}
  </MainContent>
</DesktopLayout>
```

**Acceptance Criteria - Tablet Layout (768-1200px):**

**Given** que accedo desde un tablet (iPad, 1024x768)
**When** la página carga
**Then** veo:
- ✅ Navegación lateral colapsada (60px ancho, solo iconos)
- ✅ Tooltip al hacer hover sobre iconos mostrando etiqueta
- ✅ Sidebar expandible al hacer click (250px)
- ✅ KPI cards en grid de 2 columnas
- ✅ Tablas con columnas no críticas ocultas
- ✅ Modales con 90% de ancho
- ✅ Typography ligeramente más pequeña (0.875rem)

```tsx
// Tablet Layout Example
<TabletLayout>
  <Sidebar collapsible>
    <Collapsed>
      <NavItem icon="dashboard" tooltip="Dashboard" />
      <NavItem icon="clipboard" tooltip="Mis OTs" />
      <NavItem icon="columns" tooltip="Kanban" />
      {/* Iconos sin texto, solo tooltips */}
    </Collapsed>

    <Expanded>
      {/* Al hacer click/tap, se expande */}
      <NavItem icon="dashboard" label="Dashboard" />
      <NavItem icon="clipboard" label="Mis OTs" />
    </Expanded>
  </Sidebar>

  <MainContent>
    <KPICards columns={2}>
      <KPICard />
      <KPICard />
    </KPICards>
  </MainContent>
</TabletLayout>
```

**Acceptance Criteria - Móvil Layout (<768px):**

**Given** que accedo desde un móvil (iPhone 14, 390x844)
**When** la página carga
**Then** veo:
- ✅ Navegación inferior fija (bottom navigation, 60px alto)
- ✅ 5 iconos principales en nav inferior
- ✅ Header simplificado (solo título, sin breadcrumbs largos)
- ✅ KPI cards apilados verticalmente (1 columna)
- ✅ Formularios con campos apilados
- ✅ Botones full width
- ✅ Tablas con scroll horizontal (swipe)
- ✅ Drawer lateral para menú hamburguesa

```tsx
// Mobile Layout Example
<MobileLayout>
  <TopBar compact>
    <HamburgerMenu onClick={openDrawer} />
    <Title>Dashboard</Title>
    <NotificationBell />
  </TopBar>

  <MainContent>
    <KPICards columns={1}>
      <KPICard fullWidth />
      <KPICard fullWidth />
      <KPICard fullWidth />
      <KPICard fullWidth />
    </KPICards>

    <Form stacked>
      <FormField fullWidth />
      <FormField fullWidth />
      <Button fullWidth>Guardar</Button>
    </Form>
  </MainContent>

  <BottomNav>
    <NavItem icon="home" label="Inicio" href="/" active={pathname === '/'} />
    <NavItem icon="clipboard" label="Mis OTs" href="/mis-ots" />
    <NavItem icon="plus" label="Crear" href="/avisos/nuevo" prominent />
    <NavItem icon="bell" label="Alertas" href="/alertas" />
    <NavItem icon="user" label="Perfil" href="/perfil" />
  </BottomNav>
</MobileLayout>
```

**Validaciones de Responsive:**

**Given** que cambio el tamaño de la ventana del navegador
**When** redimensiono de desktop a tablet a móvil
**Then** el layout se reorganiza fluidamente sin recargar la página
**And** las transiciones son animadas (300ms ease-in-out)

**Given** que roto un tablet de vertical a horizontal
**When** la orientación cambia
**Then** el layout se ajusta inmediatamente
**And** los componentes se reorganizan según el nuevo ancho

**Consideraciones de Performance:**

- Usar CSS Grid y Flexbox en lugar de floats
- Imágenes responsive con srcset y sizes
- Lazy loading de componentes pesados en móvil
- Optimizar critical CSS para first paint < 1s

---

## Story 9.2: Kanban Responsive con Swipe

**Como** María (Técnica) usando el Kanban en diferentes dispositivos,
**quiero que el tablero Kanban se adapte al tamaño de pantalla manteniendo la funcionalidad de drag-and-drop,
**para** gestionar OTs eficientemente desde cualquier dispositivo.

**Acceptance Criteria - Kanban Desktop (>1200px):**

**Given** que accedo al Kanban desde desktop
**When** la vista carga
**Then** veo 8 columnas horizontalmente:

```tsx
// Desktop Kanban: 8 columnas
<KanbanBoard layout="desktop">
  {OT_ESTADOS.map(estado => (
    <KanbanColumn key={estado} title={estado} width="250px">
      {otsPorEstado[estado].map(ot => (
        <KanbanCard key={ot.id} ot={ot} draggable />
      ))}
    </KanbanColumn>
  ))}
</KanbanBoard>
```

**Given** que estoy en desktop
**When** veo el Kanban
**Then** las columnas son:
1. PENDIENTE (250px)
2. ASIGNADA (250px)
3. EN_PROGRESO (250px)
4. PENDIENTE_REPUESTO (250px)
5. PENDIENTE_PARADA (250px)
6. REPARACION_EXTERNA (250px)
7. COMPLETADA (250px)
8. DESCARTADA (250px)
- Total width: 2000px con scroll horizontal

**Acceptance Criteria - Kanban Tablet (768-1200px):**

**Given** que accedo al Kanban desde tablet
**When** la vista carga
**Then** veo 2 columnas visibles con swipe horizontal para ver más:

```tsx
// Tablet Kanban: 2 columnas visibles, scroll horizontal
<KanbanBoard layout="tablet" columnsPerView={2}>
  {OT_ESTADOS.map(estado => (
    <KanbanColumn key={estado} title={estado}>
      {otsPorEstado[estado].map(ot => (
        <KanbanCard key={ot.id} ot={ot} draggable />
      ))}
    </KanbanColumn>
  ))}
</KanbanBoard>
```

**Given** que estoy en tablet
**When** hago swipe horizontal
**Then** el Kanban se desplaza suavemente
**And** veo las siguientes 2 columnas
**And** indicador de progreso muestra "Columnas 3-4 de 8"

**Given** que quiero mover una OT de columna
**When** arrastro la tarjeta
**Then** puedo soltarla en cualquier columna visible
**Or** soltarla en el borde derecho para scroll a la siguiente columna

**Acceptance Criteria - Kanban Móvil (<768px):**

**Given** que accedo al Kanban desde móvil
**When** la vista carga
**Then** veo 1 columna a la vez con swipe horizontal:

```tsx
// Mobile Kanban: 1 columna visible, swipe completo
<KanbanBoard layout="mobile" columnsPerView={1}>
  {OT_ESTADOS.map(estado => (
    <KanbanColumn key={estado} title={estado} fullHeight>
      {otsPorEstado[estado].map(ot => (
        <KanbanCard
          key={ot.id}
          ot={ot}
          compact
          onLongPress={openMoveMenu}
        />
      ))}
    </KanbanColumn>
  ))}
</KanbanBoard>

<ColumnIndicator>
  Estado: EN_PROGRESO (3 de 8)
  ← Swipe para más columnas
</ColumnIndicator>
```

**Given** que estoy en móvil
**When** hago swipe horizontal
**Then** la vista cambia a la columna siguiente con animación de slide
**And** el indicador muestra "Columna 4 de 8: PENDIENTE_REPUESTO"

**Given** que quiero mover una OT en móvil
**When** hago long press (2 segundos) en la tarjeta
**Then** se abre un modal con:

```tsx
<MoveToColumnModal>
  <h3>Mover OT a:</h3>
  <ListGroup>
    <ListGroupItem onClick={() => moveToColumn('PENDIENTE')}>
      PENDIENTE (3 OTs)
    </ListGroupItem>
    <ListGroupItem onClick={() => moveToColumn('ASIGNADA')}>
      ASIGNADA (5 OTs)
    </ListGroupItem>
    <ListGroupItem onClick={() => moveToColumn('EN_PROGRESO')}>
      EN_PROGRESO (2 OTs)
    </ListGroupItem>
    {/* ... resto de columnas */}
  </ListGroup>
</MoveToColumnModal>
```

**Acceptance Criteria - Adaptación de Tarjetas:**

**Given** que estoy en desktop
**When** veo una tarjeta de OT en el Kanban
**Then** la tarjeta tiene:
- Ancho: 220px
- Título completo visible
- Tags de prioridad y tipo
- Asignado con avatar
- Badges de repuestos necesarios
- Fecha límite con badge si está próxima

**Given** que estoy en tablet
**When** veo una tarjeta de OT
**Then** la tarjeta tiene:
- Ancho: 90% del ancho de columna
- Información reducida (tags colapsados)
- Asignado con inicial en lugar de avatar completo
- Fecha límite como icono con tooltip

**Given** que estoy en móvil
**When** veo una tarjeta de OT
**Then** la tarjeta tiene:
- Ancho: 100% del ancho de pantalla
- Solo información crítica:
  - Código + Título (truncado a 2 líneas)
  - Prioridad como colored dot
  - Fecha límite con icono
- Al hacer clic, abre drawer lateral con detalles completos

```tsx
// Kanban Card responsive
<KanbanCard responsive>
  {/* Desktop: Completa */}
  <DesktopView>
    <CardTitle>{ot.codigo} - {ot.titulo}</CardTitle>
    <CardMeta>
      <PriorityBadge priority={ot.prioridad} />
      <TypeBadge type={ot.tipo} />
      <Avatar user={ot.tecnico} size="sm" />
      <FechaLimite date={ot.fechaLimite} />
      <RepuestosBadges repuestos={ot.repuestosNecesarios} />
    </CardMeta>
  </DesktopView>

  {/* Tablet: Reducida */}
  <TableView>
    <CardTitle compact>{ot.codigo}</CardTitle>
    <CardMeta compact>
      <PriorityDot priority={ot.prioridad} />
      <TypeIcon type={ot.tipo} />
      <UserInitial user={ot.tecnico} />
      <FechaIcon date={ot.fechaLimite} />
    </CardMeta>
  </TableView>

  {/* Móvil: Minimal */}
  <MobileView>
    <CardTitle minimal>{ot.codigo} - {truncate(ot.titulo, 50)}</CardTitle>
    <CardMeta minimal>
      <PriorityDot priority={ot.prioridad} />
      <FechaIcon date={ot.fechaLimite} />
    </CardMeta>
  </MobileView>
</KanbanCard>
```

**Validaciones de UX:**

- DND (drag and drop) funciona con mouse en desktop
- DND funciona con touch en tablet (swipe + tap to move)
- En móvil, long press activa modo "mover"
- Animaciones fluidas entre columnas (300ms)

---

## Story 9.3: PWA Instalable en Dispositivos Móviles

**Como** Usuario accediendo desde un móvil (Android o iOS),
**quiero poder instalar la aplicación como una app nativa,
**para** tener acceso directo desde el home screen sin abrir el navegador.

**Acceptance Criteria - Configuración PWA:**

**Given** que el sistema está configurado como PWA
**When** se cargan los archivos PWA
**Then** se requiere:

```json
// public/manifest.json
{
  "name": "GMAO Hiansa - Gestión de Mantenimiento",
  "short_name": "GMAO Hiansa",
  "description": "Sistema de gestión de mantenimiento de activos industriales",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["productivity", "business", "utilities"],
  "shortcuts": [
    {
      "name": "Reportar Avería",
      "short_name": "Avería",
      "description": "Reportar una avería en 30 segundos",
      "url": "/avisos/nuevo",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Mis OTs",
      "short_name": "OTs",
      "description": "Ver mis órdenes de trabajo",
      "url": "/ordenes-trabajo?asignadas=me",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Kanban",
      "short_name": "Kanban",
      "description": "Ver tablero Kanban",
      "url": "/ordenes-trabajo/kanban",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Stock",
      "short_name": "Stock",
      "description": "Ver stock de repuestos",
      "url": "/repuestos",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

```typescript
// next.config.js - Configuración PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'service-worker.js',
  buildExcludes: [/middleware-manifest\.json$/]
});

module.exports = withPWA({
  // ... otras configuraciones de Next.js
});
```

**Acceptance Criteria - Service Worker:**

**Given** que el PWA se registra correctamente
**When** el service worker se instala
**Then** implementa las siguientes estrategias de cache:

```typescript
// public/sw.js (Service Worker)
const CACHE_NAME = 'gmao-hiansa-v1';
const RUNTIME_CACHE = 'gmao-hiansa-runtime';

// Archivos estáticos para cache inmediato
const STATIC_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Estrategia de cache: Network First para API, Cache First para estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API routes: Network First con fallback a cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Actualizar cache con respuesta fresca
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          // Fallback a cache si falla red
          return caches.match(request);
        })
    );
    return;
  }

  // Archivos estáticos: Cache First con fallback a red
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      });
    })
  );
});
```

**Acceptance Criteria - Prompt de Instalación:**

**Given** que accedo a la app por primera vez desde móvil
**When** el PWA es elegible para instalación
**Then** veo un prompt personalizado:

```tsx
// PWA Install Prompt
import { useEffect, useState } from 'react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <InstallBanner>
      <InstallIcon src="/icons/icon-192x192.png" alt="GMAO Hiansa" />
      <InstallText>
        <InstallTitle>Instalar GMAO Hiansa</InstallTitle>
        <InstallDescription>
          Acceso rápido desde tu home screen, sin abrir el navegador
        </InstallDescription>
      </InstallText>
      <InstallActions>
        <Button variant="outline" onClick={() => setShowPrompt(false)}>
          Ahora no
        </Button>
        <Button onClick={handleInstall}>
          Instalar
        </Button>
      </InstallActions>
      <DismissButton onClick={() => setShowPrompt(false)}>
        ×
      </DismissButton>
    </InstallBanner>
  );
}
```

**Given** que hago clic en "Instalar"
**When** completa el proceso
**Then** en Android:
- La app se instala en el home screen
- Se muestra splash screen con icono y nombre
- La app se abre en modo standalone (sin barra de direcciones del navegador)

**And** en iOS:
- Se muestra instrucciones: "Tap Share → Add to Home Screen"
- La app se agrega al home screen
- Se comporta como app nativa

**Acceptance Criteria - Funcionamiento Offline:**

**Given** que tengo la PWA instalada
**When** no tengo conexión a internet
**Then** la app:
- Muestra versión cacheada de páginas visitadas
- Permite navegar a secciones cacheadas
- Muestra indicador "Modo Offline" en header

```tsx
<OfflineIndicator>
  {isOnline ? (
    <OnlineBadge>🟢 Conectado</OnlineBadge>
  ) : (
    <OfflineBadge>🔴 Sin conexión - Modo offline</OfflineBadge>
  )}
</OfflineIndicator>
```

**Given** que estoy offline
**When** intento realizar una acción que requiere red (ej: crear OT)
**Then** veo mensaje: "Esta acción requiere conexión a internet"
**And** la acción se guarda en cola para sincronizar cuando vuelva la conexión

**Validaciones de PWA:**

- Lighthouse PWA score > 90
- Tiempo de carga < 3 segundos en 3G
- Funciona en Chrome Android, Safari iOS
- Shortcut icons funcionan correctamente

---

## Story 9.4: Notificaciones Push

**Como** Usuario con la PWA instalada,
**quiero recibir notificaciones push en mi dispositivo cuando ocurran eventos importantes (cambios de estado de OT, alertas de stock, etc.),
**para** estar informado en tiempo real sin tener la app abierta.

**Acceptance Criteria - Solicitud de Permiso:**

**Given** que instalo la PWA por primera vez
**When** abro la app
**Then** veo un modal solicitando permiso para notificaciones:

```tsx
<NotificationPermissionModal>
  <h2>Activar Notificaciones</h2>
  <p>
    Recibe alertas en tiempo real sobre:
  </p>
  <ul>
    <li>Cambios de estado de tus órdenes de trabajo</li>
    <li>Nuevas averías asignadas</li>
    <li>Alertas de stock crítico</li>
    <li>Recordatorios de rutinas de mantenimiento</li>
  </ul>
  <p>
    Puedes desactivar las notificaciones en cualquier momento desde Ajustes.
  </p>
  <ButtonActions>
    <Button variant="outline" onClick={denyPermission}>
      Ahora no
    </Button>
    <Button onClick={requestPermission}>
      Activar Notificaciones
    </Button>
  </ButtonActions>
</NotificationPermissionModal>
```

**Given** que hago clic en "Activar Notificaciones"
**When** el sistema solicita permiso al navegador
**Then** veo el prompt nativo del navegador:
- **Chrome Android:** "¿Quiere recibir notificaciones de gmao-hiansa.com?"
- **Safari iOS:** Prompt de iOS con botones "Permitir" y "Prohibir"

**Acceptance Criteria - Envío de Notificaciones:**

**Given** que he concedido permiso de notificaciones
**When** ocurre un evento importante
**Then** el sistema envía una notificación push:

```typescript
// Enviar notificación push
async function sendPushNotification(
  userId: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    actions?: NotificationAction[];
  }
) {
  // 1. Obtener suscripción push del usuario
  const subscription = await prisma.pushSubscription.findUnique({
    where: { userId }
  });

  if (!subscription) return;

  // 2. Enviar notificación via Web Push Protocol
  await webpush.sendNotification(
    subscription.subscription,
    JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/badge-72x72.png',
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions || [
        { action: 'view', title: 'Ver' },
        { action: 'dismiss', title: 'Descartar' }
      ]
    })
  );
}

// Ejemplo: Notificación de cambio de estado de OT
await sendPushNotification(usuarioId, {
  title: 'OT OT-1234 actualizada',
  body: 'La orden de trabajo pasó a estado: EN_PROGRESO',
  icon: '/icons/icon-192x192.png',
  tag: 'ot-1234', // Permite reemplazar notificaciones anteriores
  data: {
    type: 'OT_STATE_CHANGED',
    otId: 'ot-1234',
    nuevoEstado: 'EN_PROGRESO'
  },
  actions: [
    { action: 'view', title: 'Ver OT' },
    { action: 'respond', title: 'Aceptar' }
  ]
});
```

**Acceptance Criteria - Manejo de Click en Notificación:**

**Given** que recibo una notificación push
**When** hago clic en ella
**Then** la app PWA se abre y navega a la ruta correspondiente:

```typescript
// Service Worker: manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action, data } = event.notification;

  if (action === 'dismiss') {
    return; // No hacer nada
  }

  // Abrir la app y navegar a la ruta específica
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Buscar cliente ya abierto
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          if (data.type === 'OT_STATE_CHANGED') {
            client.navigate(`/ordenes-trabajo/${data.otId}`);
          }
          return client.focus();
        }
      }

      // Si no hay cliente abierto, abrir uno nuevo
      if (clients.openWindow) {
        return clients.openWindow(
          data.type === 'OT_STATE_CHANGED'
            ? `/ordenes-trabajo/${data.otId}`
            : '/'
        );
      }
    })
  );
});
```

**Acceptance Criteria - Suscripción Push:**

**Given** que concedo permiso de notificaciones
**When** la app registra la suscripción
**Then** guarda el push subscription en BD:

```typescript
// Registrar suscripción push
async function registerPushSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
  });

  // Enviar suscripción al servidor
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      userId: currentUserId
    })
  });
}

// API endpoint: /api/push/subscribe
export async function POST(request: Request) {
  const { subscription, userId } = await request.json();

  await prisma.pushSubscription.upsert({
    where: { userId },
    create: {
      userId,
      subscription: subscription,
      createdAt: new Date()
    },
    update: {
      subscription: subscription
    }
  });

  return Response.json({ success: true });
}
```

**Validaciones de Notificaciones:**

**Given** que estoy en Android con Chrome
**When** recibo una notificación
**Then** veo:
- Icono de la app (192x192)
- Título: "OT OT-1234 actualizada"
- Cuerpo: "La orden de trabajo pasó a estado: EN_PROGRESO"
- Badge con contador de notificaciones no leídas
- Acciones: "Ver OT", "Descartar"

**Given** que estoy en iOS con Safari
**When** recibo una notificación
**Then** veo:
- Notificación en Centro de Notificaciones
- Lock screen con notificación
- Banner en pantalla cuando estoy usando el dispositivo
- Actions no disponibles en iOS (limitación del sistema)

---

## Story 9.5: SSE para Sincronización en Tiempo Real

**Como** Usuario con múltiples dispositivos abiertos (desktop + móvil),
**quiero que los cambios se sincronicen automáticamente entre dispositivos en tiempo real,
**para** ver actualizaciones sin recargar la página.

**Acceptance Criteria - Conexión SSE:**

**Given** que abro la app en cualquier dispositivo
**When** la página carga
**Then** se establece una conexión SSE con el servidor:

```typescript
// Cliente SSE
import { useEffect, useState } from 'react';

export function useSSE() {
  const [events, setEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Crear conexión SSE
    const eventSource = new EventSource('/api/sse', {
      withCredentials: true
    });

    eventSource.onopen = () => {
      console.log('SSE conectado');
      setIsConnected(true);
    };

    eventSource.onerror = (error) => {
      console.error('Error SSE:', error);
      setIsConnected(false);
      // Reconexión automática después de 30s
      setTimeout(() => {
        eventSource.close();
        setIsConnected(false);
      }, 30000);
    };

    // Escuchar heartbeat (FR96: cada 30s)
    eventSource.addEventListener('heartbeat', (e) => {
      const data = JSON.parse(e.data);
      console.log('Heartbeat recibido:', data);
      setIsConnected(true);
    });

    // Escuchar actualizaciones de OTs
    eventSource.addEventListener('ot_updated', (e) => {
      const ot = JSON.parse(e.data);
      setEvents((prev) => [...prev, { type: 'OT_UPDATED', data: ot }]);
    });

    // Escuchar nuevas OTs asignadas
    eventSource.addEventListener('ot_assigned', (e) => {
      const ot = JSON.parse(e.data);
      setEvents((prev) => [...prev, { type: 'OT_ASSIGNED', data: ot }]);
    });

    // Escuchar alertas
    eventSource.addEventListener('alert', (e) => {
      const alert = JSON.parse(e.data);
      setEvents((prev) => [...prev, { type: 'ALERT', data: alert }]);
    });

    // Escuchar actualizaciones de KPIs
    eventSource.addEventListener('kpi_updated', (e) => {
      const kpi = JSON.parse(e.data);
      setEvents((prev) => [...prev, { type: 'KPI_UPDATED', data: kpi }]);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return { events, isConnected };
}
```

**Acceptance Criteria - Endpoint SSE del Servidor:**

**Given** que el cliente se conecta a `/api/sse`
**When** la conexión se establece
**Then** el servidor mantiene la conexión abierta y envía eventos:

```typescript
// API Route: /api/sse
export async function GET(request: Request) {
  // 1. Verificar autenticación
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Crear stream SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Enviar evento de conexión exitosa
      const data = `data: ${JSON.stringify({ connected: true, userId: session.user.id })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Heartbeat cada 30 segundos (FR96, FR100)
      const heartbeatInterval = setInterval(() => {
        const heartbeat = `event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`;
        controller.enqueue(encoder.encode(heartbeat));
      }, 30000);

      // Suscribirse a canal Redis de este usuario
      const redisClient = redis.duplicate();
      const channel = `user:${session.user.id}`;

      redisClient.subscribe(channel, (message) => {
        const event = `event: ${message.type}\ndata: ${JSON.stringify(message.data)}\n\n`;
        controller.enqueue(encoder.encode(event));
      });

      // Cleanup al cerrar la conexión
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        redisClient.unsubscribe(channel);
        redisClient.quit();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Deshabilitar buffering en nginx
    }
  });
}
```

**Acceptance Criteria - Publicación de Eventos:**

**Given** que ocurre un cambio en el sistema (ej: OT actualizada)
**When** el cambio se guarda en BD
**Then** el sistema publica el evento a Redis:

```typescript
// Middleware de publicación de eventos SSE
async function publishSSEEvent(userId: string, type: string, data: any) {
  const redisClient = redis.duplicate();
  const channel = `user:${userId}`;

  await redisClient.publish(channel, {
    type,
    data
  });

  await redisClient.quit();
}

// Ejemplo: Actualización de OT
await prisma.ordenTrabajo.update({
  where: { id: otId },
  data: { estado: 'EN_PROGRESO' }
});

// Publicar evento a todos los usuarios interesados
await Promise.all([
  publishSSEEvent(tecnicoAsignadoId, 'ot_updated', { otId, estado: 'EN_PROGRESO' }),
  publishSSEEvent(jefeMantenimientoId, 'ot_updated', { otId, estado: 'EN_PROGRESO' }),
  publishSSEEvent(creadorId, 'ot_updated', { otId, estado: 'EN_PROGRESO' })
]);
```

**Acceptance Criteria - Sincronización de OTs (<1s):**

**Given** que tengo la app abierta en desktop y móvil simultáneamente
**When** cambio el estado de una OT en desktop
**Then** veo el cambio reflejado en móvil en < 1 segundo

```typescript
// Componente que escucha cambios de OT
export function OTCard({ otId }: { otId: string }) {
  const { events } = useSSE();
  const [ot, setOt] = useState<OT | null>(null);

  useEffect(() => {
    // Escuchar eventos específicos de esta OT
    const otEvents = events.filter(e =>
      e.type === 'OT_UPDATED' && e.data.otId === otId
    );

    if (otEvents.length > 0) {
      // Recargar OT actualizada
      fetchOT(otId).then(updatedOT => {
        setOt(updatedOT);
      });
    }
  }, [events, otId]);

  return ot ? <OTCardView ot={ot} /> : <Loading />;
}
```

**Acceptance Criteria - Sincronización de KPIs (<30s):**

**Given** que estoy viendo el dashboard de KPIs
**When** los KPIs se actualizan en el servidor (cada 30s)
**Then** recibo el evento `kpi_updated` vía SSE
**And** los valores se actualizan en pantalla sin recargar

```typescript
// KPI Card con SSE
export function KPICard({ kpi }: { kpi: 'mttr' | 'mtbf' }) {
  const { events } = useSSE();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const kpiEvents = events.filter(e => e.type === 'KPI_UPDATED' && e.data.kpi === kpi);

    if (kpiEvents.length > 0) {
      setValue(kpiEvents[0].data.value);
    }
  }, [events, kpi]);

  return (
    <Card>
      <CardTitle>{kpi.toUpperCase()}</CardTitle>
      <CardValue>{value}</CardValue>
      <LastUpdated>hace menos de 30 segundos</LastUpdated>
    </Card>
  );
}
```

**Validaciones de Reconexión:**

**Given** que pierdo la conexión a internet
**When** el SSE detecta el error
**Then** muestra indicador "Reconectando..."
**And** se reconecta automáticamente en < 30 segundos

```tsx
<ConnectionIndicator>
  {isConnected ? (
    <Connected>🟢 Conectado</Connected>
  ) : (
    <Reconnecting>
      🔄 Reconectando...
      <ReconnectTimer>{secondsUntilReconnect}s</ReconnectTimer>
    </Reconnecting>
  )}
</ConnectionIndicator>
```

**Consideraciones de Performance:**

- Usar Redis Pub/Sub para escalabilidad horizontal
- Cada usuario tiene su propio canal de eventos
- Heartbeat cada 30s para detectar conexiones muertas
- Limpiar conexiones inactivas después de 5 minutos sin heartbeat

---

## Resumen de Historias de Usuario

| Story | Título | Actor | FRs | Complejidad |
|-------|--------|-------|-----|-------------|
| 9.1 | Responsive Design con 3 Breakpoints | Todos | FR97, FR98 | Alta |
| 9.2 | Kanban Responsive con Swipe | María | FR98 | Media |
| 9.3 | PWA Instalable en Móviles | Todos | FR99 | Alta |
| 9.4 | Notificaciones Push | Todos | FR100 | Media |
| 9.5 | SSE para Sincronización | Todos | FR96 | Alta |

**Total Estimado:** 5 historias de usuario

---

## Criterios de Éxito del Epic

**Métricas de Éxito:**
- Lighthouse Performance score > 90 en móvil
- Lighthouse PWA score > 90
- Tiempo de sincronización OTs < 1 segundo
- Tiempo de actualización KPIs < 30 segundos
- Tasa de instalación de PWA > 30% de usuarios móviles
- Reconexión automática en < 30 segundos después de corte de red

**Validación de Integración:**
- ✅ Epic 1: PBAC funciona en todos los dispositivos
- ✅ Epic 4: Kanban responsive mantiene funcionalidad DND
- ✅ Epic 8: KPIs se actualizan en tiempo real en todos los dispositivos
- ✅ Todas las features funcionan offline con cache

**Próximos Pasos:**
- Phase 3: Tracking avanzado con GPS, cámara AR para códigos QR
- Optimizaciones de performance para 3G
- Soporte offline completo con sincronización diferida

---

**Versión:** 2.0 (Historias completas en formato Given/When/Then)
**Fecha:** 2026-03-07
**Estado:** ✅ Completado - Listo para implementación
