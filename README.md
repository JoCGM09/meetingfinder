# MeetingFinder

**MeetingFinder** es una aplicación web moderna que permite a grupos de personas (amigos, estudiantes, colegas o familias) encontrar el punto de encuentro más **equitativo y céntrico** para sus reuniones presenciales, considerando ubicaciones de origen diferentes y tiempos de viaje reales.

---

## Problema y Propuesta de Valor

Coordinar un lugar de reunión cuando cada integrante sale desde un punto distinto suele requerir estimaciones imprecisas y coordinaciones tediosas. 

MeetingFinder resuelve esto mediante:
* **Generación de Salas Instantáneas**: Creación de enlaces únicos para compartir sin necesidad de registro previo.
* **Cálculo Algorítmico de Equidad**: Utiliza la API de **Distance Matrix de Google Maps** para seleccionar el destino que **minimiza el tiempo máximo de viaje** de cualquier participante, garantizando que nadie sufra trayectos exagerados.
* **Sincronización en Tiempo Real**: Visualización en vivo de los puntos de origen y destinos propuestos usando **Supabase Realtime**.

---

## Características Principales

1. **Salas por URL e Identificación de Invitados**
   - Acceso inmediato mediante un enlace compartido.
   - Asignación de apodo y sesión local persistente.
   - Límite de hasta 20 participantes por sala.

2. **Propuesta de Destinos y Distancias Reales**
   - Buscador de lugares integrado con **Google Places Autocomplete** (restringido a máximo 5 destinos por sala).
   - Posibilidad de proponer destinos haciendo clic derecho sobre el mapa.
   - Algoritmo *Min-Max* con desempate por promedio de tiempos de viaje.
   - Reporte de equidad con desglose de tiempo individual por participante.

3. **Perfiles Opcionales y Gestión de Historial**
   - Autenticación opcional mediante **Google OAuth** y **Magic Link** (vía correo electrónico).
   - Transición automática: el historial generado como invitado se vincula permanentemente a la cuenta al iniciar sesión.
   - Dashboard personal para consultar salas anteriores.

4. **Seguridad y Protección de Costos**
   - **Rate Limiting Persistente**: Límite de 15 segundos entre cálculos por sala almacenado en base de datos PostgreSQL, protegiendo ante el agotamiento de presupuesto (*Denial of Wallet*).
   - **Sanitización de Datos (BOLA)**: Exclusión explícita de tokens privados (`sessionId`) en respuestas públicas.
   - **Validación Estricta**: Esquemas de **Zod** en todas las Server Actions y APIs.

---

## Tech Stack y Arquitectura

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 + React 19 + TailwindCSS | App Router, componentes de servidor/cliente y diseño minimalista. |
| **Mapas & POIs** | `@vis.gl/react-google-maps` | Integración reactiva con Google Maps JavaScript API, Places y Distance Matrix. |
| **Backend** | Next.js Server Actions | Funciones de servidor tipadas y seguras. |
| **Base de Datos** | PostgreSQL + Prisma ORM | Modelado relacional e integridad de datos. |
| **Auth & Realtime** | Supabase (`@supabase/ssr`) | Autenticación basada en cookies SSR y suscripciones `postgres_changes`. |
| **Testing / QA** | Playwright | Tests E2E e integración para flujos críticos. |
| **CI/CD / Deploy** | GitHub Actions + Vercel | Pipelines de validación automatizada y despliegue continuo. |

---

## Instrucciones de Uso Local

### Requisitos Previos
* **Node.js**: v20+
* **Gestor de Paquetes**: `pnpm` (`npm i -g pnpm`)
* **Cuentas en**: Supabase (PostgreSQL) y Google Cloud Platform (Maps API Key).

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/JoCGM09/meetingfinder.git
cd meetingfinder
pnpm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
# Base de Datos (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[ID]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ID]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase Auth & Realtime
NEXT_PUBLIC_SUPABASE_URL="https://[TU-PROYECTO].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-google-maps-api-key-publica"
GOOGLE_MAPS_SERVER_KEY="tu-google-maps-api-key-servidor"

# URL de la aplicación
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Sincronizar Base de Datos
```bash
npx prisma db push
```

### 4. Iniciar Servidor de Desarrollo
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## Pruebas y Validación (QA)

Para ejecutar la suite de pruebas con **Playwright**:

```bash
# Ejecutar todos los tests E2E e integración
pnpm test

# Ejecutar el linter de ESLint
pnpm run lint
```

---

## Despliegue en Producción (Vercel + Supabase)

1. **Configuración en Vercel**:
   - Conecta el repositorio de GitHub a Vercel.
   - Carga las variables de entorno en **Settings -> Environment Variables** (asegúrate de asignar `NEXT_PUBLIC_SITE_URL` con tu dominio de Vercel).
2. **Configuración en Google Cloud**:
   - Habilita las siguientes APIs: **Maps JavaScript API**, **Places API**, **Places API (New)** y **Distance Matrix API**.
   - Asigna una cuenta de facturación (*Billing*) al proyecto de GCP.
3. **Configuración en Supabase**:
   - En **Authentication -> URL Configuration**, añade `https://tu-app.vercel.app/api/auth/callback` a las *Redirect URLs*.

---

## Reglas Visuales y de Marca

* **Estilo**: Minimalista, claro y conciso.
* **Paleta de Color**:
  * Primario: `#E31C5F` (Rosa vibrante).
  * Fondo Claro: `#FFFFFF` / Fondo Oscuro: `#121212`.
  * Superficies: `#222222`.
* **Restricción**: Ausencia total de emojis en la interfaz de usuario para garantizar un aspecto profesional.
