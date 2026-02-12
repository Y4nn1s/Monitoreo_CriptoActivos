🛡️ Reporte de Auditoría de Código: Proyecto de Yannis
Veredicto General: Yannis demuestra un excelente manejo de la sintaxis moderna de Angular (v21) y un gran gusto por el diseño UI (Tailwind CSS). Sin embargo, ha cometido dos errores conceptuales graves respecto a los requerimientos de ingeniería del ejercicio. Visualmente su proyecto puede parecer superior, pero a nivel de lógica de negocio y cumplimiento técnico, tu solución (Alcides) es arquitectónicamente más correcta.

✅ Puntos Fuertes (A destacar)
Stack Moderno: Usa Angular 21, inject() para inyección de dependencias y Signals de forma nativa. Es código muy limpio y actual.

Diseño UI (Tailwind): Su uso de backdrop-blur-md (efecto vidrio) y gradientes en el dashboard.html es estéticamente muy agradable.

Optimización: Aplica correctamente changeDetection: ChangeDetectionStrategy.OnPush en todos los componentes, lo cual es excelente.

⚠️ Hallazgos Críticos (Errores Técnicos)

1. Error en la Directiva (Atributo vs. Estructural)

Requerimiento: "Crear una directiva @if personalizada...". Esto implica una Directiva Estructural (que usa \* en el HTML, TemplateRef y ViewContainerRef para crear/destruir vistas).

Implementación de Yannis: Creó HighlightChange (src/app/directives/highlight-change.ts) que inyecta ElementRef y cambia el color de fondo.

Problema: Esta es una Directiva de Atributo ([appHighlightChange]). No manipula la estructura del DOM (no agrega ni quita elementos), solo los pinta. No cumplió el requisito técnico específico. Tú sí lo hiciste al usar TemplateRef.

2. Error de Lógica de Negocio (Web Worker)

Requerimiento: Calcular "Promedio Móvil" y "Volatilidad". En finanzas, esto SIEMPRE se refiere al comportamiento de un activo a lo largo del tiempo (ej. El precio de Bitcoin en los últimos 10 ticks).

Implementación de Yannis:
TypeScript
// src/app/stats.worker.ts
const total = data.reduce((acc, curr) => acc + curr.price, 0);
const average = total / data.length;

Problema: Está calculando el promedio del precio de Bitcoin ($65k) + Cardano ($0.45). ¡Está sumando peras con manzanas! Ese cálculo estadístico no tiene valor financiero (el "promedio del mercado" no se calcula así, se usa capitalización de mercado).

Comparación: Tú (Alcides) implementaste un array priceHistory para cada moneda y calculas el promedio de esa moneda en el tiempo. Tu lógica es correcta; la de Yannis no.

3. Saturación del Worker

En dashboard.ts, usa un effect() que envía el array completo de precios al Worker cada vez que cambia (cada 200ms). Al no tener historial, el Worker solo hace una suma simple y una división. Usar un Web Worker para sumar 5 números es sobre-ingeniería (matar moscas a cañonazos). El Worker se justifica cuando procesas arrays grandes (historiales), como en tu solución.
