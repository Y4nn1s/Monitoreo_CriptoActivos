# Plataforma de Monitoreo de Criptomonedas

Este proyecto es una aplicación web interactiva desarrollada en **Angular** para el monitoreo en tiempo real de precios de criptomonedas. Utiliza tecnologías modernas como **Angular Signals**, **Web Workers** para cálculos estadísticos intensivos y **Tailwind CSS**.

## 🚀 Guía de Instalación (Windows)

Para clonar este proyecto en otro computador con Windows, sigue estos pasos:

### 1. Requisitos Previos

Asegurarse de tener instalado lo siguiente en tu sistema:

- **Node.js**: Descargar la versión LTS desde [nodejs.org](https://nodejs.org/).
- **Angular CLI**: Una vez instalado Node.js, abrir una terminal (PowerShell o CMD) y ejecutar:
  ```powershell
  npm install -g @angular/cli
  ```

### 2. Clonar el Proyecto

Abrir tu terminal en la carpeta donde desees guardar el proyecto y ejecutar:

```powershell
git clone https://github.com/Y4nn1s/MonitoreoCriptoActivos.git
cd MonitoreoCriptoActivos
```

### 3. Instalar Dependencias

Entrar en la carpeta del proyecto de Angular e instalar los paquetes necesarios:

```powershell
cd crypto-monitoring-platform
npm install
```

---

## 💻 Ejecución del Proyecto

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando dentro de la carpeta `crypto-monitoring-platform`:

```powershell
ng serve
```

Una vez que el comando termine de compilar, abre tu navegador y navega a:
`http://localhost:4200/`

---

## 🛠️ Tecnologías Utilizadas

- **Angular 19**: Framework principal.
- **Signals**: Gestión del estado reactiva y eficiente.
- **Web Workers**: Procesamiento de datos estadísticos en segundo plano (para no bloquear la interfaz).
- **Tailwind CSS**: Estilizado moderno y utilitario.
- **RxJS**: Manejo de flujos de datos asíncronos para la simulación de precios.

## 📝 Notas de Desarrollo

- La aplicación simula cambios de precio cada 200ms para demostrar la capacidad de respuesta de la interfaz.
- Incluye un sistema de alertas visuales configurable por el usuario.
- El código está debidamente comentado en español siguiendo estándares profesionales.

---

**Desarrollado por:** Yannis Iturriago  
**Institución:** UNETI - Programación III
