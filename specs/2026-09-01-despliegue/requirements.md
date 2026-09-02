# Requirements: Despliegue y CI/CD

## Alcance
Implementar el pipeline de despliegue continuo (CI/CD) para MeetingFinder. Incluye la automatizacion de pruebas y el despliegue en entornos de Produccion y Preview.

## Contexto
- Dominios: meetingfinder.vercel.app y *.vercel.app.
- Base de datos: Supabase (PostgreSQL).
- Integracion: GitHub Actions.
- Entornos: Production (rama main/master) y Preview (Pull Requests).

## Variables de Entorno Necesarias
Las siguientes variables deben configurarse tanto en Vercel (Production/Preview) como en los flujos de GitHub Actions cuando aplique:
- `DATABASE_URL`: URL de conexion a la base de datos Supabase (transaccional).
- `DIRECT_URL`: URL de conexion directa a Supabase (requerida por Prisma).
- `NEXT_PUBLIC_SUPABASE_URL`: URL de la API de Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave publica anonima de Supabase.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Clave de API de Google Maps (restringida a *.vercel.app).
- `NEXT_PUBLIC_APP_URL`: URL base de la aplicacion (depende del entorno).
