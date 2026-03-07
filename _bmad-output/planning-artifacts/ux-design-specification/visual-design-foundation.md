# Visual Design Foundation

## Color System

**Paleta de Colores de la Marca:**

**Colores Principales:**
- **Rojo Burdeos**: `#A51C30` - Color principal de la marca (header del sitio web, fondo del logo)
- **Fondo Blanco**: `#FFFFFF` - Fondo principal de la aplicación
- **Texto Negro**: `#000000` - Texto sobre fondo blanco
- **Texto Blanco**: `#FFFFFF` - Texto sobre fondo rojo burdeos

**Regla de Uso de Colores:**
- **Sobre fondo blanco**: Texto negro `#000000`
- **Sobre fondo rojo burdeos**: Texto blanco `#FFFFFF`

**Colores de División:**
- **HiRock**: `#FFD700` (Amarillo/Dorado) - Para elementos de la división HiRock
- **Ultra**: `#8FBC8F` (Verde Salvia) - Para elementos de la división Ultra

**Colores Semánticos (Estados de OT):**

Estos colores se usan para los 8 estados de las Órdenes de Trabajo en el Kanban:

- `pending-review`: `#6B7280` (Gris) - "Por Revisar"
- `pending-approval`: `#F59E0B` (Ámbar) - "Por Aprobar"
- `approved`: `#3B82F6` (Azul) - "Aprobada"
- `in-progress`: `#8B5CF6` (Púrpura) - "En Progreso"
- `paused`: `#EC4899` (Rosa) - "Pausada"
- `completed`: `#10B981` (Verde) - "Completada"
- `closed`: `#6B7280` (Gris) - "Cerrada"
- `cancelled`: `#EF4444` (Rojo) - "Cancelada"

**Colores de Feedback UI:**
- **Éxito**: `#10B981` (Verde) - Confirmaciones, acciones exitosas
- **Advertencia**: `#F59E0B` (Ámbar) - Requieren atención
- **Error**: `#EF4444` (Rojo) - Errores, acciones destructivas
- **Info**: `#3B82F6` (Azul) - Mensajes informativos

**Guías de Uso:**
- **Rojo Burdeos** se usa para: Header, botones principales, estados activos, fondo del logo
- **Blanco** se usa para: Fondo de la aplicación, tarjetas, modales
- **Negro** se usa para: Texto sobre fondo blanco, bordes, iconos
- **Blanco** se usa para: Texto sobre fondo rojo burdeos
- Colores de división (Amarillo/Verde) se usan para: Etiquetas de activos, indicadores de ubicación
- Colores semánticos se usan para: Badges de estado, notificaciones, validación de formularios

## Typography System

**Fuente:**
- **Principal**: `Inter` (stack de fuentes del sistema: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
  - Elección: Excelente legibilidad, aspecto industrial profesional, soporte completo de español

**Escala de Tamaños:**

```css
--font-size-xs: 0.75rem;    /* 12px - Rótulos, etiquetas */
--font-size-sm: 0.875rem;   /* 14px - Texto secundario, metadatos */
--font-size-base: 1rem;     /* 16px - Texto de cuerpo, inputs */
--font-size-lg: 1.125rem;   /* 18px - Subtítulos */
--font-size-xl: 1.25rem;    /* 20px - Títulos de tarjetas */
--font-size-2xl: 1.5rem;    /* 24px - Títulos de sección */
--font-size-3xl: 1.875rem;  /* 30px - Títulos de página */
--font-size-4xl: 2.25rem;   /* 36px - Hero/landing */
```

**Pesos de Fuente:**
- **Regular (400)**: Texto de cuerpo, descripciones
- **Medium (500)**: Subtítulos, texto enfatizado
- **Semibold (600)**: Títulos, botones, enlaces
- **Bold (700)**: Títulos de página, CTAs importantes

**Altura de Línea:**
- **Texto de cuerpo**: 1.5 (24px de leading para 16px de fuente) - Legibilidad óptima para contenido en español
- **Títulos**: 1.2 - Espaciado más ajustado para jerarquía visual
- **Elementos UI**: 1.25 - Botones, etiquetas, navegación

**Jerarquía Tipográfica:**

```
H1: 30px / Semibold / 1.2 line-height - Títulos de página
H2: 24px / Semibold / 1.2 line-height - Títulos de sección
H3: 20px / Medium / 1.3 line-height - Títulos de tarjetas
H4: 18px / Medium / 1.3 line-height - Subtítulos
Body: 16px / Regular / 1.5 line-height - Párrafos, contenido
Small: 14px / Regular / 1.5 line-height - Metadatos, captions
```

## Spacing & Layout Foundation

**Sistema de Espaciado (Grid de 8px):**

Usando la unidad base de 8px de Tailwind para espaciado consistente:

```css
--spacing-1: 0.25rem;  /* 4px - Espaciado compacto */
--spacing-2: 0.5rem;   /* 8px - Unidad base */
--spacing-3: 0.75rem;  /* 12px - Compacto */
--spacing-4: 1rem;     /* 16px - Por defecto */
--spacing-5: 1.25rem;  /* 20px - Cómodo */
--spacing-6: 1.5rem;   /* 24px - Secciones */
--spacing-8: 2rem;     /* 32px - Secciones grandes */
--spacing-10: 2.5rem;  /* 40px - Divisiones mayores */
--spacing-12: 3rem;    /* 48px - Márgenes de página */
```

**Guías de Uso de Espaciado:**
- **4px**: Padding de iconos, bordes compactos
- **8px**: Elementos relacionados (checkbox + label, icono + texto)
- **12px**: Grupos de formularios compactos, espaciado interno de tarjetas
- **16px**: Inputs de formulario por defecto, padding de botones, items de lista
- **24px**: Espaciado de secciones, márgenes de tarjetas
- **32px**: Secciones mayores, secciones de página
- **48px**: Márgenes superior/inferior de página

**Principios de Layout:**

1. **Jerarquía de Contenido**: Separación visual clara entre header, contenido principal, sidebar
2. **Espacio en Blanco**: Espaciado generoso para "respirar" (profesional, no saturado)
3. **Alineación**: Texto alineado a izquierda, canales de 24px consistentes para columnas
4. **Sistema de Grid**: Grid de 12 columnas para layouts complejos

**Breakpoints Responsivos:**

```css
--breakpoint-sm: 640px;   /* Móvil landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / Desktop pequeño */
--breakpoint-xl: 1200px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

**Estrategia de Contenedor:**
- **Móvil (<768px)**: 100% de ancho, 16px de padding lateral
- **Tablet (768-1200px)**: 90% de ancho máximo, centrado
- **Desktop (>1200px)**: 1280px de ancho máximo, centrado

**Estándares de Espaciado de Componentes:**
- **Inputs de formulario**: 16px de espaciado vertical entre campos
- **Tarjetas**: 16px de padding interno, 24px de márgenes
- **Botones**: 16px de padding (8px arriba/abajo, 16px izquierda/derecha)
- **Modal**: 24px de padding, 32px de espaciado entre secciones
- **Columnas Kanban**: 16px de espacio entre columnas

**Densidad de Layout:**
- **Espacioso y aireado** (vs denso y eficiente)
- Espacio en blanco generoso soporta el objetivo emocional "Qué Paz"
- Estética industrial profesional - no saturado como herramientas legacy

## Accessibility Considerations

**Contraste de Color:**
- Todo el texto cumple con WCAG AA 4.5:1 de contraste mínimo
- Texto grande (18px+) cumple con 3:1 de contraste
- Rojo burdeos #A51C30 sobre blanco = 6.3:1 ✅
- Texto blanco sobre rojo burdeos = 6.3:1 ✅
- Texto negro sobre blanco = 21:1 ✅

**Objetivos Táctiles:**
- Mínimo 44x44px para todos los elementos interactivos
- Botones: 40px de altura mínimo, con padding para touch
- Inputs de formulario: 44px de altura para tapping fácil en móvil
- Items de navegación: Objetivos touch de altura completa

**Navegación por Teclado:**
- Todos los elementos interactivos accesibles por teclado
- Indicadores de foco visibles (2px sólido rojo burdeos #A51C30)
- Orden de tab lógico (arriba a abajo, izquierda a derecha)
- Skip links para contenido principal

**Soporte de Screen Reader:**
- Elementos HTML5 semánticos
- Labels ARIA para botones solo-icono
- Alt text para todas las imágenes
- Regiones live para actualizaciones dinámicas (notificaciones, KPIs)
- Jerarquía de headings apropiada (h1 → h2 → h3)

**Claridad Visual:**
- Nunca usar color solo (icono + color + texto redundante)
- Mensajes de error mostrados inline con iconos
- Confirmaciones de éxito con texto claro + icono
- Badges de estado siempre incluyen etiqueta de texto

**Movimiento y Animación:**
- Respetar configuración `prefers-reduced-motion`
- No contenido parpadeante (>3Hz)
- Transiciones suaves (200-300ms) para cambios de estado
- Indicadores de carga para operaciones asíncronas

**Escalado de Fuente:**
- Soporte de 200% de zoom de texto sin scroll horizontal
- Layouts responsivos adaptan a texto más grande
- No contenedores de ancho fijo que rompan el escalado de texto
