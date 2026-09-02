# Plan de Implementación: Perfiles y Gestión

## Fases del Desarrollo

### Tarea 3.1: Actualizar esquema Prisma y preparar el modelo híbrido (COMPLETADO)
- [x] Configurar variables de entorno requeridas para Supabase.
- [x] Modificar el esquema Prisma (`schema.prisma`) para que entidades como `RoomHistory` o `Session` referencien el identificador `userId` (UUID) generado por Supabase.
- [x] Cambiar el provider de `sqlite` a `postgresql` para Supabase.
- [ ] Ejecutar `prisma db push` (Pendiente: corregir DATABASE_URL en .env).

### Tarea 3.2: Configurar Supabase Auth con SSR y Middleware (COMPLETADO)
- [x] Instalar dependencias `@supabase/ssr` y `@supabase/supabase-js`.
- [x] Crear utilidades de generación de clientes de Supabase (Browser, Server, Middleware) basados en cookies.
- [x] Proteger rutas de perfil o dashboard mediante un middleware.
- [ ] Establecer los flujos de inicio de sesión por Magic Link y Google OAuth (Pendiente: UI y Actions).

### Tarea 3.3: Desarrollar UI de Autenticación y Dashboard (COMPLETADO)
- [x] Construir pantalla minimalista de Login/Registro (Google y Magic Link).
- [x] Construir la vista del Dashboard (panel principal) donde el usuario consulte sus salas anteriores.
- [x] Implementar Server Actions para login/logout y callback de Supabase Auth.
- [x] Asegurar la ausencia total de emojis y mantener un aspecto profesional.

### Tarea 3.4: Lógica de Negocio y Transición de Invitado a Usuario (COMPLETADO)
- [x] Desarrollar las funciones (Server Actions) para insertar interacciones en una sala (RoomHistory).
- [x] Manejar la lógica de transición en el callback de Auth: al detectar un inicio de sesión, buscar el historial asociado al `sessionId` previo y asignarlo al nuevo `userId`.
- [x] Implementar `transitionGuestToUser` en `actions.ts`.

### Tarea 3.5: Integrar Supabase Realtime en Salas (COMPLETADO)
- [x] Utilizar el cliente de Supabase en el lado del navegador para suscribirse a un canal `room:[roomId]`.
- [x] Reflejar inmediatamente en la UI cuando otro participante añade un punto de origen o un destino propuesto mediante suscripciones `postgres_changes`.
- [x] Optimizar la UI para eliminar el polling manual y usar el estado reactivo de Supabase.
