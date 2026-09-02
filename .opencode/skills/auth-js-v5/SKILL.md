---
name: auth-js-v5
description: Estándares y flujos de trabajo para implementar Auth.js v5 (beta) en Next.js 15+ con App Router, Prisma Adapter, Google OAuth y Resend. Úsala cuando necesites configurar autenticación moderna, proteger rutas con middleware o manejar sesiones en componentes de servidor y cliente.
---

# Auth.js v5 (NextAuth.js) para Next.js 15+

Esta skill proporciona las pautas para implementar Auth.js v5 de manera idiomática en aplicaciones modernas de Next.js.

## 1. Instalación de dependencias

Instala los paquetes necesarios para Auth.js, el adaptador de Prisma y los proveedores:

```bash
pnpm add next-auth@beta @auth/prisma-adapter @prisma/client
pnpm add -D prisma
```

## 2. Esquema de Base de Datos (Prisma)

El `schema.prisma` debe incluir los modelos requeridos por el adaptador de Auth.js.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## 3. Configuración de `auth.ts`

Crea un archivo `auth.ts` (usualmente en la raíz o `src/`) para centralizar la configuración.

```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // Asegúrate de tener exportado tu cliente de prisma

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      from: "no-reply@tudominio.com",
    }),
  ],
  pages: {
    signIn: "/login", // Opcional: página personalizada
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
})
```

## 4. Middleware y Protección de Rutas

Configura el middleware en `middleware.ts` para proteger rutas de forma global o específica.

```typescript
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

Para lógica personalizada (ej. redirigir si no está autenticado):

```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isPublicRoute = ["/login", "/register", "/"].includes(nextUrl.pathname)

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }
})
```

## 5. Uso en Componentes y Server Actions

### Obtener sesión en Server Component
```typescript
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session) return <div>No autenticado</div>
  
  return <div>Hola {session.user?.name}</div>
}
```

### Sign In / Sign Out (Server Action)
```typescript
"use server"
import { signIn, signOut } from "@/auth"

export async function loginAction() {
  await signIn("google")
}

export async function logoutAction() {
  await signOut()
}
```

### Componente de Cliente
```tsx
"use client"
import { useSession } from "next-auth/react"

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Cargando...</p>
  if (!session) return <p>Inicia sesión</p>

  return <p>Logueado como {session.user?.email}</p>
}
```
Nota: Debes envolver tu aplicación en un `SessionProvider` si usas `useSession`.

## Variables de Entorno Requeridas
```env
AUTH_SECRET= # Generar con `npx auth secret`
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=
DATABASE_URL=
```
