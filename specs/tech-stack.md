# Tech Stack

<!-- Generado/actualizado por /constitution -->

## Stack elegido
| Capa        | Elección | Por qué |
|-------------|----------|---------|
| Frontend    | NextJS + TailwindCSS + shadcn/ui | SSR, App Router y componentes listos para usar garantizando buena DX y UI profesional y accesible. |
| Backend     | NextJS (API Routes / Server Actions) | Permite construir de forma integral frontend y backend en un mismo repositorio de manera ágil. |
| Base de datos | PostgreSQL con Prisma | Prisma ofrece una excelente experiencia de desarrollo (DX) por su tipado seguro; PostgreSQL garantiza integridad y escalabilidad. |
| Mapas       | Google Maps API | La mejor base de datos de lugares (POIs) a nivel mundial y precisión en el cálculo de distancias reales. |
| Testing/QA  | Playwright | Testing End-to-End confiable para flujos críticos (ej. unirse a una sala). |
| Paquetes    | pnpm | Gestión rápida y eficiente del espacio en disco para las dependencias. |

## Alternativas descartadas
- **Mapbox:** Descartado debido a la mayor complejidad de la base de datos de lugares/destinos y menor cobertura precisa en ciertas regiones o países comparado con Google Maps.

## Estándares técnicos de buenas prácticas y seguridad del stack
- Ningún secret, token o API Key (ej. Google Maps API, Prisma Database URL) debe ser expuesto en código. Uso estricto de `.env`.
- Todos los inputs de los usuarios deben ser validados antes de impactar en la base de datos (Zod o similar).
- Evitar PII en logs.
- Rutas protegidas mediante autorización explícita (en Fase 3).
