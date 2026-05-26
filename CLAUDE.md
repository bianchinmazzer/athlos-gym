# ATHLOS GYM — CLAUDE.md

Guía completa para continuar el desarrollo en Claude Code.

---

## ¿Qué es este proyecto?

Web app para **Athlos Gym** (Monte Hermoso, Buenos Aires). Tiene dos partes:

1. **Landing pública** — presenta el gimnasio, historia del fundador, servicios, galería y contacto.
2. **App privada** — admin panel para gestionar usuarios/ejercicios/rutinas, y dashboard de usuario para ver y descargar sus rutinas.

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 15 (App Router) | Framework full-stack |
| TypeScript | Tipado |
| Tailwind CSS | Utilidades CSS |
| Supabase | DB (PostgreSQL) + Auth |
| Resend | Envío de emails del formulario |
| jsPDF + jspdf-autotable | Generación de PDF en el browser |
| Lucide React | Iconos |

---

## Setup inicial (primera vez)

### 1. Clonar e instalar
```bash
git clone https://github.com/TU_USUARIO/athlos-gym.git
cd athlos-gym
npm install
```

### 2. Variables de entorno
Copiá `.env.local.example` a `.env.local` y completá:

```bash
cp .env.local.example .env.local
```

| Variable | Dónde conseguirla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (⚠️ nunca exponerla al cliente) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `CONTACT_EMAIL` | El email donde llegan los mensajes del form |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número sin + ni espacios (ej: 5492914123456) |

### 3. Base de datos en Supabase
En el **SQL Editor** de Supabase, ejecutar el archivo completo:
```
supabase/schema.sql
```

Esto crea todas las tablas, RLS policies y el trigger que auto-crea el perfil al registrarse.

### 4. Crear el primer admin
En **Supabase → Authentication → Users**, crear un usuario con:
- Email del admin
- Password seguro
- Luego en la tabla `profiles`, cambiar `role` a `admin` para ese usuario.

También podés ejecutar esto en el SQL Editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'tu@email.com';
```

### 5. Correr en desarrollo
```bash
npm run dev
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  # Landing pública
│   ├── login/page.tsx            # Login único (redirige por rol)
│   ├── admin/
│   │   ├── layout.tsx            # Layout admin con sidebar
│   │   ├── page.tsx              # Redirect → /admin/users
│   │   ├── users/page.tsx        # CRUD de usuarios
│   │   ├── exercises/page.tsx    # CRUD de ejercicios
│   │   └── routines/page.tsx     # Builder de rutinas + asignación
│   ├── dashboard/
│   │   ├── layout.tsx            # Layout usuario con header
│   │   └── page.tsx              # Rutinas del usuario + PDF
│   └── api/
│       ├── contact/route.ts      # POST → email via Resend
│       ├── admin/
│       │   ├── users/route.ts    # CRUD users via Supabase Admin API
│       │   ├── exercises/route.ts
│       │   └── routines/
│       │       ├── route.ts      # CRUD rutinas
│       │       └── assign/route.ts # Asignar rutina a usuario
│       └── user/
│           └── routines/route.ts # Rutinas del usuario autenticado
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── FounderStory.tsx
│   │   ├── Services.tsx
│   │   ├── Gallery.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloat.tsx
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── dashboard/
│       └── LogoutButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client + admin client
│   └── pdf.ts                    # Generador de PDF con jsPDF
├── types/index.ts                # Tipos TypeScript
└── middleware.ts                 # Protección de rutas
```

---

## Paleta de colores (del logo)

```css
--athlos-dark:   #0f0f1a   /* fondo principal */
--athlos-navy:   #16213e   /* fondo secundario / sidebar */
--athlos-coral:  #e8533a   /* acento primario */
--athlos-orange: #f4a340   /* acento secundario */
--athlos-gold:   #f4c842   /* acento terciario */
--athlos-teal:   #4ecdc4   /* acento frío */
--athlos-sky:    #45b7d1   /* acento frío secundario */
--athlos-white:  #f0f0f0   /* texto principal */
--athlos-muted:  #8a8a9a   /* texto secundario */
```

Tipografías: **Bebas Neue** (display/titulos) + **DM Sans** (body). Cargadas desde Google Fonts en `globals.css`.

---

## Flujo de autenticación

```
/ (landing) → cualquiera puede verla
/login      → login único
    ├── rol == "admin" → /admin/users
    └── rol == "user"  → /dashboard

/admin/*    → requiere sesión + rol admin (middleware + layout)
/dashboard  → requiere sesión (middleware + layout)
```

El admin crea usuarios desde `/admin/users`. Los usuarios **no se registran solos**. El admin define email + password y el usuario recibe sus credenciales por el canal que el admin elija (no está automatizado aún — ver tareas pendientes).

---

## Modelo de datos

```
profiles          ← extiende auth.users (trigger automático)
exercises         ← biblioteca de ejercicios
routines          ← rutinas
routine_sections  ← secciones de cada rutina (entrada en calor, trabajo principal, etc)
routine_exercises ← ejercicios dentro de cada sección (con sets y reps)
user_routines     ← qué rutinas ve cada usuario
```

---

## Lo que falta completar

### Alta prioridad
- [ ] **Fotos de la galería** — reemplazar placeholders en `Gallery.tsx`. Subir fotos reales a `/public/images/` y actualizar el array `photos` con los `src` correspondientes. También se puede hacer que el admin suba fotos via Supabase Storage (pendiente).
- [ ] **Datos reales del fundador** — completar nombre real en `FounderStory.tsx`, foto del fundador (agregar `<Image>` en el bloque izquierdo), y ajustar la historia si hay algo que cambiar.
- [ ] **Número de WhatsApp real** — setear `NEXT_PUBLIC_WHATSAPP_NUMBER` en `.env.local` y en Vercel.
- [ ] **Email de contacto real** — setear `CONTACT_EMAIL` en `.env.local` y Vercel, y configurar el dominio en Resend.
- [ ] **Instagram real** — actualizar `@athlosgym` en `Contact.tsx` con el handle real.

### Media prioridad
- [ ] **Email automático al crear usuario** — cuando el admin crea un usuario, mandarle un email con sus credenciales. Implementar en `POST /api/admin/users/route.ts` llamando a Resend después de crear el user en Supabase.
- [ ] **Ver rutina individual** — página `/dashboard/[id]` con la rutina expandida en pantalla completa (bueno para mobile).
- [ ] **Editar rutina** — el admin actualmente solo puede crear/borrar. Agregar flujo de edición en `/admin/routines`.
- [ ] **Ver qué rutinas tiene asignadas cada usuario** — en `/admin/users`, botón para ver asignaciones.
- [ ] **Desasignar rutina** — en el dashboard o en admin, opción para quitar una rutina de un usuario.

### Baja prioridad / nice to have
- [ ] **Supabase Storage para fotos de galería** — panel en admin para subir/eliminar fotos de galería directamente desde la app.
- [ ] **Notas por ejercicio** — el campo `notes` ya existe en `routine_exercises`, solo falta mostrarlo en el builder y en el dashboard.
- [ ] **Ordenar ejercicios/secciones arrastrando** — mejorar UX del builder de rutinas con drag & drop (react-dnd o dnd-kit).
- [ ] **Dominio personalizado** — conectar dominio propio en Vercel.
- [ ] **SEO / og:image** — agregar imagen Open Graph para compartir en redes.

---

## Deploy en Vercel

1. Ir a vercel.com (con la cuenta del gym)
2. "Add New Project" → importar el repo de GitHub
3. Agregar todas las variables de `.env.local.example` en Vercel → Settings → Environment Variables
4. Deploy automático en cada push a `main`

---

## Comandos útiles

```bash
npm run dev       # Desarrollo local
npm run build     # Build de producción
npm run lint      # Lint
```

---

## Notas para Claude Code

- El proyecto usa **App Router** de Next.js 15. Todos los componentes son Server Components por defecto. Agregar `"use client"` solo cuando se necesita estado/interactividad.
- Los **Route Handlers** (API routes) viven en `src/app/api/`.
- El cliente de Supabase tiene dos versiones: `client.ts` (browser, para componentes cliente) y `server.ts` (server, para layouts/pages/API routes).
- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa en `createAdminClient()` para operaciones de admin (crear/eliminar users de auth). Nunca exponerlo al cliente.
- Las clases de Tailwind están disponibles para utilidades simples, pero la mayoría del styling está con `style={{}}` inline para control total de la paleta Athlos.
- Para agregar una nueva sección a la landing, crear componente en `src/components/landing/` e importarlo en `src/app/page.tsx`.
