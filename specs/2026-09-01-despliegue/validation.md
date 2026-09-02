# Criterios de Validacion: Despliegue y CI/CD

## 1. Validacion de CI (Github Actions)
- [ ] Abrir un Pull Request hacia `main` lanza el workflow de CI automaticamente.
- [ ] El linter y el type-check fallan de forma determinista y bloquean el merge si hay errores de sintaxis o tipado en el codigo introducido.
- [ ] Los tests de Playwright se ejecutan correctamente en el entorno virtual de Github Actions (sin interfaz grafica / modo headless).
- [ ] El PR no puede ser fusionado hasta que todos los checks esten completados de manera exitosa.

## 2. Validacion de Build y Base de Datos (Vercel)
- [ ] Durante el despliegue en Vercel, los logs muestran la ejecucion de `prisma generate` seguido de `prisma migrate deploy`.
- [ ] La base de datos de Supabase refleja el esquema mas reciente (tablas y relaciones creadas) sin intervencion manual desde un entorno local.

## 3. Validacion de Produccion (E2E)
- [ ] Al acceder a la URL de produccion generada por Vercel, la aplicacion carga sin errores de servidor (codigos HTTP 500).
- [ ] Las interacciones que requieren lectura/escritura en la base de datos (por ejemplo, crear una sala o agregar una ubicacion) operan correctamente, comprobando que las variables de entorno de base de datos fueron configuradas correctamente.
- [ ] Los mapas de Google cargan de forma visible sin errores de consola relacionados a "API Key invalida" o restricciones por dominio no permitido.
