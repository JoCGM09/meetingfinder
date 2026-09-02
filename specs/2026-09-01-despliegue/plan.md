# Plan de Implementacion: Despliegue

## 1. Configuracion de CI/CD
- [x] 1.1. Crear archivo `.github/workflows/preview.yml` para ejecutar lint, formateo, pruebas (Playwright) y validacion de build en cada Pull Request.
- [x] 1.2. Crear archivo `.github/workflows/production.yml` para chequeos finales y notificar sobre el despliegue a Vercel al hacer merge en la rama principal.
- [ ] 1.3. Configurar reglas de proteccion de rama en GitHub requiriendo que los checks pasen antes del merge. (Pendiente por usuario)

## 2. Configuracion de Entornos
- 2.1. Crear y enlazar el proyecto en Vercel con el repositorio de GitHub.
- 2.2. Configurar dominios personalizados en Vercel (`meetingfinder.vercel.app` y comodin `*.vercel.app`).
- 2.3. Habilitar la integracion de Vercel con GitHub para generar URLs de Preview automaticas.
- 2.4. Crear dos proyectos separados en Supabase: uno para Produccion y otro para Preview.

## 3. Sincronizacion y Deploy
- 3.1. Cargar las variables de entorno en el panel de Vercel, separando los valores por entorno (Production vs Preview).
- 3.2. Cargar los secretos necesarios en GitHub Actions (`Settings > Secrets and variables > Actions`).
- 3.3. Ejecutar las migraciones de Prisma contra la base de datos de Produccion en Supabase.
- 3.4. Forzar un despliegue inicial manual a Produccion para validar conectividad.
