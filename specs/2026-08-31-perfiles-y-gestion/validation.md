# Validación: Perfiles y Gestión

## Criterios de Aceptación (QA)

1. **Flujos de Autenticación:**
   - Un usuario puede registrarse e iniciar sesión exitosamente utilizando su cuenta de Google.
   - Un usuario puede solicitar un Magic Link, recibirlo en su correo y usarlo para iniciar sesión.

2. **Transición Invitado a Usuario Registrado:**
   - Si un usuario ingresa a una sala como invitado (estado no autenticado) y luego inicia sesión, esa sala debe aparecer en el historial permanente de su cuenta sin perder información.

3. **Dashboard e Historial de Salas:**
   - El dashboard solo debe ser accesible para usuarios autenticados (rutas protegidas).
   - El dashboard muestra una lista completa de todas las salas creadas o a las que el usuario se ha unido exitosamente.

4. **Reglas de UI/UX:**
   - Las interfaces de Login y Dashboard cumplen estrictamente con un diseño minimalista.
   - No existe ningún emoji presente en las vistas implementadas para estas funcionalidades.

## Estrategia de Pruebas
- **Testing E2E (Playwright):** 
  - Cubrir el flujo de acceso anónimo, visita a la sala y posterior inicio de sesión (mockeando el callback de OAuth) para confirmar que la sala se asocia al perfil.
- **Testing Manual:**
  - Envío real del Magic Link a una bandeja de entrada temporal (o herramientas locales como Mailhog) y confirmación de redirección segura.