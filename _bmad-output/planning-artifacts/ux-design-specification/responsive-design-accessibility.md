# Responsive Design & Accessibility

## Responsive Strategy

**Mobile-First + Adaptive by Context:**

gmao-hiansa adopta un enfoque **mobile-first** con layouts **adaptativos** según el dispositivo y rol del usuario.

**Mobile Strategy (<768px):**
- **Core experience**: "Reportar avería en 30 segundos" es la prioridad #1
- **Touch-first**: Todos los elementos son 44x44px minimum
- **Single column layouts**: Una columna para better readability
- **Bottom navigation**: 4 tabs máx para acceso rápido
- **Kanban**: 1 columna visible con swipe horizontal + indicador "1/8"
- **Formularios**: Labels encima de inputs, botones full-width
- **Modals**: Full-screen para contenido complejo

**Tablet Strategy (768px - 1200px):**
- **Híbrido Mobile-Desktop**: Combinación de patrones mobile y desktop
- **Touch-optimized**: Touch targets grandes + gestures soportados
- **Sidebar**: Icon-only, colapsable
- **Kanban**: 2-3 columnas visibles con swipe horizontal
- **Split views**: Content principal + detalles lado a lado

**Desktop Strategy (>1200px):**
- **Productivity**: Máxima información visible
- **Multi-column layouts**: Aprovechar screen real estate
- **Kanban**: 8 columnas completas visibles
- **Sidebar**: Full-width con icons + labels
- **Keyboard shortcuts**: Atajos para power users

---

## Breakpoint Strategy

**Breakpoints de Tailwind CSS (integrados en shadcn/ui):**

- **Mobile (<640px)**: Default styles (no media query)
- **Mobile Landscape (640px - 767px)**: sm breakpoint
- **Tablet Portrait (768px - 1023px)**: md breakpoint - 2-column layouts
- **Tablet Landscape / Small Desktop (1024px - 1279px)**: lg breakpoint
- **Desktop (1280px+)**: xl breakpoint - 4-column layouts, max-width 1280px
- **Large Desktop (1536px+)**: 2xl breakpoint - no max-width constraint

Usamos **breakpoints estándar de Tailwind** porque ya están integrados en shadcn/ui y cubren todos los use cases de los 5 user personas.

---

## Accessibility Strategy

**WCAG AA Compliance:**

gmao-hiansa cumple con **WCAG 2.1 Level AA** (industry standard).

**WCAG AA Requirements:**

**1. Perceivable:**
- **Color Contrast (4.5:1 minimum)**: Rojo burdeos #7D1220 sobre blanco = 7.8:1 ✅
- **Text Alternatives**: Alt text para imágenes, aria-label para iconos
- **Adaptable**: Layouts adaptan a zoom de texto 200%

**2. Operable:**
- **Keyboard Navigation**: Tab order lógico, focus indicators visibles
- **Skip Links**: "Saltar al contenido" para screen readers
- **No Keyboard Traps**: Tab no trapa al usuario
- **No Time Limits**: Reintentos automáticos sin intervención

**3. Understandable:**
- **Language**: Español (`lang="es"`), términos consistentes
- **Predictable**: CTAs descriptivos, focus visible
- **Input Assistance**: Labels, instrucciones, error messages específicos

**4. Robust:**
- **Semantic HTML**: Elementos HTML5 semánticos
- **ARIA**: Roles, labels, states cuando HTML no es suficiente
- **Screen Readers**: Compatibilidad con VoiceOver, NVDA, JAWS

---

## Testing Strategy

**Responsive Testing:**
- **Real Devices**: iPhone, Samsung Galaxy, iPad, Samsung Galaxy Tab
- **Browsers**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Network**: Test en 3G/4G para simular condiciones reales
- **Performance**: Load time <3s en 3G, Lighthouse score >90

**Accessibility Testing:**
- **Automated**: axe DevTools, Lighthouse, WAVE
- **Manual**: Screen readers (VoiceOver, NVDA, JAWS), keyboard-only testing
- **Color Blindness**: Protanopia, Deuteranopia, Tritanopia simulation
- **Focus Group**: Incluir usuarios con discapacidades en user testing

---

## Implementation Guidelines

**Responsive Development:**
- Use relative units (rem, %, vw, vh) over fixed pixels
- Mobile-first media queries
- Touch targets minimum 44x44px
- Optimize images con srcset y loading="lazy"

**Accessibility Development:**
- Semantic HTML structure (header, main, nav, footer)
- ARIA labels y roles
- Keyboard navigation implementation
- Focus management (trap focus en modals, return focus)
- Skip links para saltar al contenido
- High contrast mode support

---
