---
name: supabase-nextjs
description: Estándares para configurar Supabase SSR en Next.js 15, integración con Prisma y Realtime para actualizaciones en vivo. Úsala cuando necesites configurar auth, bases de datos o suscripciones a cambios de Postgres en el cliente o servidor.
---

# Supabase + Next.js 15

Guía para la implementación de Supabase utilizando `@supabase/ssr`, integración con Prisma y uso de Realtime.

## Manejo de Comandos Bloqueantes y DB

Para evitar que la terminal del agente se bloquee o espere confirmaciones invisibles:

1.  **Prisma DB Push**: Si el comando `npx prisma db push` falla o se detiene, el agente debe:
    - Explicar al usuario que el comando requiere confirmación manual (ej. pérdida de datos).
    - Solicitar al usuario que ejecute `npx prisma db push` en su terminal local.
    - Esperar la confirmación del usuario antes de proceder con tests.

2.  **Procesos en Segundo Plano**: Comandos que deben quedar abiertos (como `npx prisma studio`) deben ejecutarse siempre con `&` al final para no bloquear el flujo.

3.  **Verificación de Sincronización**: Antes de ejecutar tests E2E que dependan de la DB, verificar el estado con `npx prisma db push --force-reset` solo si es un entorno de pruebas desechable, o pedir sincronización al usuario.

## Configuración de Clientes (SSR)

Instala las dependencias necesarias:
`pnpm add @supabase/ssr @supabase/supabase-js`

### Cliente de Navegador (Client Components)
Archivo: `utils/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Cliente de Servidor (Server Components / Actions)
Archivo: `utils/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El middleware se encarga de las cookies si esto falla en Server Components
          }
        },
      },
    }
  )
}
```

### Middleware de Autenticación
Archivo: `middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Realtime (Postgres Changes)

Para actualizar pines en un mapa u otros datos en vivo.

1. Habilita Realtime en la tabla desde el Dashboard de Supabase (Database -> Replication -> Table -> Enable Realtime).
2. Suscríbete en el componente cliente:

```typescript
'use client'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function RealtimeComponent() {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // 'INSERT', 'UPDATE', 'DELETE'
          schema: 'public',
          table: 'pines',
        },
        (payload) => {
          console.log('Cambio detectado:', payload)
          // Actualizar estado local del mapa
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
```

## Conexión con Prisma

Supabase provee dos formas de conexión. En entornos serverless (Next.js), se recomienda el Transaction Pooler o la conexión directa si la escala es pequeña.

### Variables de Entorno (.env)
```env
# Direct connection (usada para migraciones)
DIRECT_URL="postgres://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Transaction Pooler (usada en la app para evitar agotar conexiones)
DATABASE_URL="postgres://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Schema Prisma (schema.prisma)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Notas de Seguridad
- No exponer el `SERVICE_ROLE_KEY` en el cliente.
- Configurar Row Level Security (RLS) para proteger las tablas de acceso no autorizado, incluso si se usa Prisma desde el servidor.
