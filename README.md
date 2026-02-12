# Plataforma de Monitoreo de Criptoactivos

[![Angular](https://img.shields.io/badge/Angular-21+-DD0031.svg?logo=angular&logoColor=white)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Esta es una aplicación de grado profesional desarrollada para el monitoreo en tiempo real del mercado de criptomonedas. La plataforma ha sido diseñada bajo estándares de alta disponibilidad y rendimiento, utilizando las últimas innovaciones de **Angular** para garantizar una experiencia de usuario fluida y reactiva.

## ✨ Características Principales

- **📈 Feed en Tiempo Real:** Actualización dinámica de precios cada 200ms con simulaciones de mercado realistas.
- **⚡ Arquitectura Multihilo:** Utiliza **Web Workers** para delegar el cálculo de estadísticas complejas (SMA, Volatilidad) fuera del hilo principal, manteniendo la interfaz a 60 FPS.
- **� Feedback Visual Inteligente:**
  - Directiva estructural personalizada (`*appHighlightChange`) para animaciones de fluctuación.
  - Alertas configurables por el usuario con indicadores visuales de alta visibilidad (bordes amarillos, iconos de advertencia y destellos).
- **💪 Gestión de Estado con Signals:** Flujo de datos optimizado mediante **Angular Signals**, eliminando ciclos de detección de cambios innecesarios.
- **🔝 Indicadores de Mercado:** Visualización destacada del "Líder de Mercado" (activo con mayor crecimiento) y promedios globales.
- **🔍 Filtrado Instantáneo:** Buscador integrado que actualiza métricas y visuales en tiempo real mediante Signals computadas.
- **🎨 Diseño Premium:** Interfaz moderna con modo oscuro, tipografía optimizada y diseño responsivo utilizando **Tailwind CSS**.

## 🛠️ Stack Tecnológico

- **Core:** Angular 21 (Signals, Components, Directives, Services).
- **Procesamiento:** Web Workers API.
- **Estilos:** Tailwind CSS / CSS3 Moderno.
- **Reactividad:** RxJS (Control de intervalos y flujos asíncronos).
- **Tipado:** TypeScript (Estricto).

## 🚀 Instalación y Despliegue Local

### Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **npm**: Gestor de paquetes incluido con Node.js.
- **Angular CLI**: Instalación global (`npm install -g @angular/cli`).

### Pasos para el Despliegue

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Y4nn1s/MonitoreoCriptoActivos.git
   cd MonitoreoCriptoActivos
   ```

2. **Instalar dependencias:**

   ```bash
   cd crypto-monitoring-platform
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   ng serve
   ```
   Accede a la plataforma en `http://localhost:4200/`.

## � Estructura del Proyecto

- `src/app/services/`: Lógica central y simulación de datos.
- `src/app/components/`: Componentes de UI (Dashboard, CryptoCard).
- `src/app/directives/`: Directivas estructurales para animaciones.
- `src/app/stats.worker.ts`: Hilo de procesamiento estadístico independiente.

---

**Desarrollado por:** Yannis Iturriago  
**Institución:** UNETI - Programación III (Trayecto 3, Semestre 5)  
**Proyecto:** Monitor de Criptoactivos con Angular Signals y Web Workers.
