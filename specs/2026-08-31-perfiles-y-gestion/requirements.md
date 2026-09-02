# Requerimientos: Perfiles y Gestión de Usuarios

## Resumen
Implementar un sistema de autenticación y perfiles de usuario que permita a los usuarios registrarse, iniciar sesión y acceder a un historial de todas las salas de encuentro (reuniones) a las que se han unido o han creado. Además, se debe permitir que un usuario invitado conserve el historial generado durante su sesión anónima al registrarse o iniciar sesión. Se integrará de manera híbrida Supabase (Auth y Realtime) con Prisma.

## Casos de Uso
- **Autenticación de Usuarios:** Ingreso a la plataforma mediante Supabase Auth (Google OAuth o Magic Link vía correo electrónico).
- **Historial de Salas:** Acceso a un panel personal (Dashboard) donde el usuario puede visualizar todas las salas en las que ha participado.
- **Transición de Invitado a Usuario:** Un usuario no autenticado (invitado) puede interactuar con una sala, y al momento de iniciar sesión, esa sala se vincula permanentemente al historial de su cuenta en base a su identificador de sesión.
- **Sincronización en Tiempo Real:** Soporte para eventos de sala y presencia en tiempo real con Supabase Realtime, permitiendo ver las interacciones de otros participantes de forma fluida.

## Requerimientos Técnicos y Funcionales
- **Sistema de Autenticación y Eventos:** Supabase Auth y Realtime utilizando `@supabase/ssr` y `@supabase/supabase-js`.
- **Persistencia de Lógica y Datos:** Prisma ORM. No se utilizarán los clientes de base de datos de Supabase para consultas relacionales o de dominio.
- **Consolidación de Datos:** Mapeo y transferencia de actividad basada en `sessionId` (invitado) hacia el UUID proporcionado por Supabase (`userId`).
- **Interfaz de Usuario:** Dashboard de historial y pantalla de autenticación.

## Reglas de Marca y Diseño visual
- **Estilo:** Minimalista, claro y conciso.
- **Marca:** Uso estricto de colores y directrices de la marca.
- **Restricción:** Prohibido el uso de emojis en las interfaces de usuario.

## Fuera de Alcance
- Gestión avanzada de perfiles (cambio de foto de perfil, edición de nombre nativa, etc.).
- Roles y permisos avanzados más allá de la distinción entre invitado y usuario registrado.