# Plan de Implementacion: Despliegue y CI/CD

## Fase 1: Configuracion del Build (Repositorio)
1. Actualizar el script `build` en `package.json` para asegurar que Prisma se prepare correctamente antes de construir la aplicacion NextJS.
   - Comando sugerido: `prisma generate && prisma migrate deploy && next build`.
2. Asegurar que las dependencias de Playwright esten correctamente configuradas para ejecutarse en un entorno CI.

## Fase 2: Pipeline de Integracion Continua (Github Actions)
1. Crear el archivo `.github/workflows/ci.yml`.
2. Configurar el entorno con `pnpm` (gestor de paquetes del proyecto).
3. Definir los siguientes pasos en el workflow para PRs dirigidos a `main`:
   - Instalacion de dependencias.
   - Ejecucion del linter (`pnpm lint`).
   - Ejecucion del type-check (`pnpm typecheck` o `tsc --noEmit`).
   - Instalacion de dependencias y navegadores de Playwright (`npx playwright install --with-deps`).
   - Ejecucion de tests E2E (`pnpm test:e2e`).
4. Proveer variables de entorno temporales o mockeadas en Github Secrets si los tests de Playwright requieren acceso a la base de datos o APIs durante el entorno CI.

## Fase 3: Configuracion en Produccion (Vercel y Supabase)
1. Crear el proyecto en Vercel y conectarlo al repositorio de Github.
2. Configurar el proyecto de Supabase para produccion y obtener las credenciales requeridas (`DATABASE_URL`, `DIRECT_URL`).
3. Cargar las variables de entorno manualmente en el dashboard de Vercel:
   - Credenciales de la base de datos.
   - Claves de Google Maps API.
4. Realizar el primer despliegue y monitorear los logs del build step para confirmar que las migraciones de Prisma se aplican exitosamente.
