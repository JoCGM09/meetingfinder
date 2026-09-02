# Plan de Implementación: Salas por URL y Centro Geométrico

## 1. Configuración de Google Maps API (COMPLETADO)
- [x] **Tarea 1.1:** Obtener y configurar la API Key de Google Maps (Maps JavaScript API, Places API, Geocoding API). Asegurar que la key esté protegida en `.env` y restringida por HTTP Referrers.
- [x] **Tarea 1.2:** Crear un componente base `MapViewer` utilizando `@vis.gl/react-google-maps` (o la librería decidida) soportando Modo Claro y Oscuro según los tokens de la marca definidos en `brand-definition.md`.
- **Nota sobre Skills:** Se recomienda ejecutar la skill `generador-de-skills` para crear una convención/skill (`google-maps-api`) que estandarice cómo cargar los scripts de Google, manejar el estado de carga y validar las keys en este proyecto sin exponerlas, garantizando así un uso seguro y DRY a futuro.

## 2. Creación de la Sala y Base de Datos (Prisma) (COMPLETADO)
- [x] **Tarea 2.1:** Definir el modelo `Room` en Prisma (`id`, `createdAt`, `status`).
- [x] **Tarea 2.2:** Definir el modelo `Participant` ligado a `Room` (`id`, `roomId`, `nickname`, `lat`, `lng`, `color` o `avatar`).
- [x] **Tarea 2.3:** Crear el Server Action para generar una sala y redirigir al usuario a `/room/[id]`.

## 3. Ingreso de Apodo (UX/Sesión) (COMPLETADO)
- [x] **Tarea 3.1:** Crear la UI del Modal o Pantalla de Ingreso (`NicknameForm`) en la ruta `/room/[id]`.
- [x] **Tarea 3.2:** Guardar el participante registrado temporalmente en `localStorage` o `cookies` (usando un UUID de sesión de invitado) para evitar pedir el apodo en recargas sucesivas de la página.

## 4. Mapa Reactivo y Algoritmo de Centro Geométrico (COMPLETADO)
- [x] **Tarea 4.1:** Desarrollar Server Actions o API routes para mutar (agregar/mover pin) y leer los participantes de una sala.
- [x] **Tarea 4.2:** Implementar un mecanismo de polling corto (SWR o React Query) o en su defecto Server-Sent Events (SSE) en el cliente para refrescar la lista de pines cada 3 segundos sin saturar la DB.
- [x] **Tarea 4.3:** Crear la función de cálculo `calculateGeometricCenter(participants: Participant[])` que promedie `lat` y `lng`.
- [x] **Tarea 4.4:** Renderizar en el mapa los marcadores de los participantes y un marcador especial (con estilo destacado) para el centro geométrico.
