# Design Direction Decision

## Design Directions Explored

Se generaron y evaluaron 6 direcciones de diseño en el showcase HTML interactivo (`ux-design-directions.html`):

**Dirección 1: Dashboard Clásico**
- Layout tradicional con sidebar fijo
- KPIs prominentes en dashboard principal
- Acceso rápido a funcionalidades principales
- **Contexto óptimo**: Desktop de Elena/Javier en oficina

**Dirección 2: Kanban First**
- El Kanban de 8 columnas es el protagonista central
- Panel lateral colapsable con KPIs
- Drag & drop visible
- **Contexto óptimo**: Desktop/tablet de Javier para control visual inmediato

**Dirección 3: Mobile First**
- Elementos táctiles grandes (44x44px)
- Navegación por gestos y vistas simplificadas
- Optimizado para tablets/móviles
- **Contexto óptimo**: Móvil de Carlos y tablet de María en piso de fábrica

**Dirección 4: Data Heavy**
- Múltiples gráficos y tablas densas
- Drill-down capabilities
- Métricas detalladas
- **Contexto óptimo**: Desktop de Elena para análisis y reportes a dirección

**Dirección 5: Minimal**
- Mucho whitespace, elementos reducidos
- Focus total en tarea actual
- Apoya objetivo emocional "Qué Paz"
- **Contexto óptimo**: Reducir sobrecarga cognitiva en tareas focales

**Dirección 6: Action Oriented**
- CTAs prominentes
- Flujos simplificados
- Shortcuts visibles
- **Contexto óptimo**: Core experience "Reportar avería en 30 segundos"

## Chosen Direction

**Decisión: Enfoque Multi-Direction por Contexto**

En lugar de elegir una única dirección de diseño, se adopta un enfoque adaptativo donde **cada dirección sirve a un contexto específico de usuario y dispositivo**.

**Justificación:**

Los 5 usuarios principales (Carlos, María, Javier, Elena, Pedro) tienen:
- **Dispositivos diferentes**: Móvil, tablet, desktop
- **Necesidades diferentes**: Reportar rápido, controlar OTs, analizar datos, gestionar stock
- **Contextos diferentes**: Piso de fábrica, oficina, taller
- **Niveles de expertise diferentes**: Operarios, técnicos, supervisores, administradores

Una sola dirección de diseño no puede optimizar la experiencia para todos estos contextos. Por lo tanto, **el sistema adaptará su layout y UX según el dispositivo y rol del usuario**.

## Design Rationale

**Principio de "Cada uno a su pantalla":**

1. **Responsive + Adaptive Design**: El layout se adapta no solo al tamaño de pantalla (responsive), sino también al contexto de uso y rol del usuario (adaptive)

2. **Componentes Compartidos**: Todas las direcciones usan el mismo sistema de diseño (shadcn/ui + Tailwind) con colores y tipografía consistentes, asegurando coherencia visual

3. **Experiencias Optimizadas por Contexto**:
   - **Móvil (<768px)**: Dirección 3 (Mobile First) para Carlos y María
   - **Tablet (768-1200px)**: Híbrido Dirección 2 + 3 (Kanban mobile-optimized)
   - **Desktop (>1200px)**: Dirección 1, 2, 4 o 6 según el rol y tarea actual

4. **User Personas Drive Layout**:
   - **Carlos (Operario)**: Siempre ve versión Mobile First + Action Oriented
   - **María (Técnica)**: Tablet = Kanban First, Móvil = Mobile First
   - **Javier (Supervisor)**: Desktop = Kanban First, Tablet = Dirección 1
   - **Elena (Administrador)**: Desktop = Data Heavy (por defecto), puede cambiar a Minimal
   - **Pedro (Stock)**: Desktop = Dirección 1 con foco en módulo Stock

## Implementation Approach

**Fase 1: Base Responsive (MVP)**

Implementar breakpoints responsivos que mapeen a las direcciones:

```css
/* Mobile: Carlos, María en piso de fábrica */
@media (max-width: 767px) {
  /* Dirección 3: Mobile First + elementos de Action Oriented */
  - Navegación inferior (bottom tabs)
  - Elementos táctiles 44x44px mínimo
  - Formularios simplificados
  - CTAs prominentes para acciones críticas
}

/* Tablet: María en campo, Javier en piso de fábrica */
@media (min-width: 768px) and (max-width: 1199px) {
  /* Híbrido Dirección 2 + 3: Kanban mobile-optimized */
  - Kanban de 8 columnas (2 visibles, swipe horizontal)
  - KPIs en panel lateral colapsable
  - Touch targets grandes
  - Sidebar simplificado
}

/* Desktop: Javier, Elena en oficina */
@media (min-width: 1200px) {
  /* Dirección 1 (default), puede cambiar según rol */
  - Sidebar completo
  - Dashboard con KPIs
  - Kanban de 8 columnas completo
  - Tablas densas con pagination
}
```

**Fase 2: Adaptive por Rol (Post-MVP)**

Detectar rol del usuario y aplicar layout por defecto:

```javascript
const layoutByRole = {
  'operario': 'mobile-first', // Carlos
  'tecnico': 'kanban-first', // María
  'supervisor': 'kanban-first', // Javier
  'admin': 'data-heavy', // Elena
  'stock': 'classic' // Pedro
};

// Permitir al usuario cambiar layout si lo prefiere
// Guardar preferencia en user settings
```

**Fase 3: Adaptive por Tarea (Opcional)**

Detectar contexto de tarea actual y ajustar UI:

```javascript
const layoutByTask = {
  'reportar-averia': 'action-oriented',
  'ver-kanban': 'kanban-first',
  'analizar-kpis': 'data-heavy',
  'gestionar-stock': 'classic'
};
```

**Componentes Compartidos:**

Todas las direcciones usan:
- **Color**: Rojo burdeos `#7D1220`, blanco `#FFFFFF`, negro `#000000`
- **Tipografía**: Inter font family con escala consistente
- **Espaciado**: 8px grid system
- **Componentes**: shadcn/ui + Tailwind CSS
- **Accesibilidad**: WCAG AA compliance en todas las direcciones

**Showcase HTML de Referencia:**

El archivo `ux-design-directions.html` contiene mockups visuales de las 6 direcciones que sirven como referencia durante la implementación. Los desarrolladores pueden consultar cada dirección para entender el layout esperado para cada contexto.

