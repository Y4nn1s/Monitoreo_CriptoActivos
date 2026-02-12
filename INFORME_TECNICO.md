# Informe Técnico: Plataforma de Monitoreo de Criptoactivos

## 1. Introducción

Este documento presenta un análisis detallado del desarrollo de una plataforma avanzada para el monitoreo de criptoactivos en tiempo real. En un entorno financiero digital donde la velocidad de la información es crítica, el objetivo principal de este proyecto fue construir una herramienta que no solo presentara datos precisos, sino que lo hiciera de manera visualmente impactante y técnicamente eficiente. La plataforma ha sido diseñada para manejar actualizaciones de alta frecuencia, garantizando que el usuario reciba retroalimentación instantánea sobre las fluctuaciones del mercado sin que el navegador experimente degradación en su rendimiento o fluidez.

---

**> COLOCAR CAPTURA DE PANTALLA AQUÍ: Vista general del Dashboard funcionando.**
_(Se recomienda una captura de alta resolución que muestre la totalidad del tablero, destacando la disposición organizada de las tarjetas de criptomonedas y los indicadores estadísticos superiores en plena actualización)._

---

## 2. Arquitectura Técnica y Selección de Herramientas

### 2.1 Framework y Filosofía de Diseño

Para la construcción de la base estructural, se seleccionó **Angular 21**. Esta elección no fue casual, ya que esta versión representa la vanguardia del framework, optimizando el motor de renderizado y consolidando la nueva sintaxis de control de flujo que simplifica el código y mejora sustancialmente la velocidad de ejecución.
En cuanto a la estética, se implementó **Tailwind CSS**, lo que permitió aplicar una filosofía de diseño conocida como "Glassmorphism". Esta técnica utiliza transparencias, desenfoques de fondo (backdrop-blur) y bordes sutiles para crear una interfaz de aspecto moderno y premium, facilitando una visualización clara del contenido en un entorno de modo oscuro (Dark Mode).

### 2.2 Reactividad de Última Generación: Angular Signals

El pilar fundamental de la interactividad de la plataforma es el uso de **Angular Signals**. A diferencia del sistema de detección de cambios tradicional, las señales permiten una reactividad granular, donde el framework sabe exactamente qué parte de la pantalla debe actualizarse cuando un dato cambia.

- **`crypto-data.ts`**: Este servicio actúa como el núcleo de datos, gestionando un `WritableSignal` que emite actualizaciones de precios de forma controlada cada 200 milisegundos. Esta frecuencia imita el comportamiento de los feeds de datos reales (WebSocket) utilizados en las casas de cambio profesionales.
- **Lógica Computada**: Mediante el uso de la función `computed`, el Dashboard es capaz de derivar nuevos estados a partir de los datos originales. Por ejemplo, la lista de "Principales Ganadores" no requiere un proceso de filtrado manual; se recalcula y reordena automáticamente en nanosegundos cada vez que los precios base fluctúan, manteniendo la lógica limpia y eficiente.

---

**> COLOCAR CAPTURA DE PANTALLA AQUÍ: Sección de "Principales Ganadores".**
_(Capture el área donde el sistema agrupa automáticamente aquellas monedas que han superado el 5% de crecimiento positivo, resaltando los colores verdes degradados y las etiquetas de porcentaje)._

---

## 3. Optimización del Rendimiento y Concurrencia

### 3.1 Web Workers: Computación en Hilos Separados e Historial Evolutivo

Uno de los mayores retos en aplicaciones que manejan datos constantes es el bloqueo del hilo principal (Main Thread). Para solucionar esto, implementamos un **Web Worker** avanzado en `stats.worker.ts`. A diferencia de una implementación simple, este Worker gestiona un **historial de estado** (últimas 50 cotizaciones por activo). Esto permite calcular el **Promedio Móvil Simple (SMA)** y la **Volatilidad Histórica** (Desviación Estándar sobre el tiempo) de forma individual para cada moneda. El procesamiento de estos arrays de datos en paralelo garantiza una UI fluida mientras se obtienen métricas financieras con valor real, superando la limitación de cálculos instantáneos triviales.

### 3.2 Estrategia `OnPush` y Rendimiento de Renderizado

Para maximizar la eficiencia, el componente `CryptoCard` utiliza la estrategia de detección de cambios **ChangeDetectionStrategy.OnPush**. Esto significa que Angular solo verificará y actualizará una tarjeta si sus propiedades de entrada (`@Input`) cambian explícitamente. En una cuadrícula con múltiples elementos actualizándose cinco veces por segundo, esta optimización es vital, ya que reduce drásticamente el uso de CPU y memoria, permitiendo que la aplicación se mantenga ágil incluso en dispositivos con recursos limitados.

---

**> COLOCAR CAPTURA DE PANTALLA AQUÍ: Barra de Estadísticas Avanzadas.**
_(Muestre los paneles superiores que indican el Promedio de Mercado, la Volatilidad y, de manera crucial, el "Tiempo de Procesamiento" en milisegundos, demostrando la eficiencia del Web Worker)._

---

## 4. Experiencia de Usuario y Funcionalidades Reactivas

### 4.1 Directiva Estructural para Animaciones Disparadas por Datos (`HighlightChange`)

La plataforma incorpora una **Directiva Estructural** denominada `HighlightChange` (`*appHighlightChange`). A diferencia de una directiva de atributo convencional, esta aprovecha las capacidades de `TemplateRef` y `ViewContainerRef` para gestionar el ciclo de vida de la vista. Su función es observar el precio y, mediante `ngOnChanges`, detectar tendencias. Cuando se detecta un cambio, la directiva manipula directamente la vista embebida para aplicar un **anillo de borde inteligente (ring)** en verde o rojo. Esta mejora arquitectónica no solo cumple con los estándares técnicos más estrictos, sino que proporciona un feedback visual mucho más robusto y distinguible para el usuario.

### 4.2 Sistema Proactivo de Alertas Dinámicas

Se integró un panel de control donde el usuario puede establecer un "Umbral de Alerta" monetario. El sistema vincula este valor con cada tarjeta de criptomoneda de forma reactiva. Cuando el precio de un activo cruza la barrera definida, la interfaz responde de tres maneras:

1. Cambia el color del borde de la tarjeta a un rojo intenso.
2. Aplica un fondo con brillo traslúcido.
3. Activa un indicador circular con una animación de pulso (`animate-ping`), notificando visualmente el evento de mercado crítico sin interrumpir la navegación.

---

**> COLOCAR CAPTURA DE PANTALLA AQUÍ: Demostración del Sistema de Alertas.**
_(Ajuste el umbral de alerta a un valor bajo para forzar la activación de múltiples tarjetas, capturando el efecto visual de los bordes rojos y las animaciones de advertencia)._

---

## 5. Conclusión

El desarrollo de esta plataforma de monitoreo de criptoactivos representa una integración exitosa entre diseño moderno y arquitectura de software de alto rendimiento. Mediante el uso estratégico de Angular Signals para la reactividad, Web Workers para la computación distribuida y directivas personalizadas para la experiencia de usuario, se ha logrado un producto final que satisface tanto las necesidades informativas como las expectativas visuales del sector financiero tecnológico. El proyecto no solo cumple con los requisitos técnicos establecidos, sino que establece un estándar de cómo las nuevas herramientas de desarrollo web pueden ser utilizadas para crear aplicaciones robustas, escalables y visualmente cautivadoras.

---

**Informe elaborado por:** Yannis Iturriago  
**Fecha de entrega:** 12 de febrero de 2026
