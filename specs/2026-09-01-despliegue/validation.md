# Validacion: Despliegue

## Criterios de Exito
- La creacion de un PR hacia la rama principal dispara el workflow de CI de GitHub Actions (Lint, Test, Build).
- Vercel genera automaticamente una URL de Preview funcional por cada PR.
- El merge a la rama principal publica inmediatamente los cambios en `meetingfinder.vercel.app`.
- Los entornos operan de manera totalmente aislada (la URL de Preview apunta a la base de datos de desarrollo/preview y la URL de Produccion apunta a la base de datos transaccional).
- Ninguna variable de entorno sensible queda expuesta en el cliente.

## Procedimiento de QA
- 1. Levantar un PR de prueba con un cambio menor en el Frontend.
- 2. Observar el estado de GitHub Actions y verificar que finaliza correctamente.
- 3. Acceder al enlace de Preview generado por Vercel. Validar funcionamiento basico.
- 4. Mergear el PR.
- 5. Verificar que el despliegue en Vercel Produccion finaliza correctamente y que el cambio es visible en el dominio principal.
