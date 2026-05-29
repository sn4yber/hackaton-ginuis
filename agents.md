# AGENT.md — Conecta Joven Cartagena

## Contexto del problema

Cartagena enfrenta una baja participación juvenil causada por:

- Información dispersa entre redes sociales, grupos de WhatsApp, formularios aislados, páginas institucionales y contactos informales.
- Baja articulación institucional entre organizaciones y jóvenes.
- Falta de centralización de convocatorias y espacios de participación.

**Objetivo:** Transformar esa información dispersa en rutas claras de participación e incidencia juvenil.

---

## Objetivo del sistema

Construir una plataforma digital que permita a jóvenes de Cartagena:

- Descubrir oportunidades y convocatorias.
- Encontrar organizaciones juveniles.
- Conocer eventos, espacios y procesos de formación.
- Conectarse con iniciativas territoriales.

**Públicos:**
- Primario: jóvenes entre 14 y 28 años en Cartagena.
- Secundario: fundaciones, colectivos, universidades, organizaciones sociales, entidades públicas y programas de juventud.

---

## MVP del Hackatón

> Centralizar oportunidades juveniles en un solo lugar. No construir una plataforma completa.

### Funcionalidades principales

**1. Feed de oportunidades**

Mostrar: convocatorias, becas, eventos, talleres, empleos, voluntariados y espacios de liderazgo.

Cada oportunidad incluye: título, organización, categoría, fecha, ubicación, descripción, contacto o enlace.

**2. Directorio de organizaciones**

Lista con: nombre, descripción, área de trabajo, redes sociales, ubicación y contacto.

**3. Mapa interactivo**

Espacios juveniles, centros culturales, fundaciones, eventos y lugares de participación.

**4. Filtros y categorías**

Filtrar por: empleo, educación, cultura, tecnología, liderazgo, emprendimiento y participación ciudadana.

---

## Requerimientos funcionales

| ID    | Descripción |
|-------|-------------|
| RF01  | Mostrar oportunidades juveniles disponibles. |
| RF02  | Filtrar oportunidades por categoría. |
| RF03  | Ver información detallada de cada oportunidad. |
| RF04  | Visualizar organizaciones juveniles. |
| RF05  | Mostrar un mapa georreferenciado. |
| RF06  | Buscar oportunidades. |
| RF07  | Ver información de contacto. |

## Requerimientos no funcionales

| ID     | Descripción |
|--------|-------------|
| RNF01  | Plataforma responsive. |
| RNF02  | Funciona correctamente en dispositivos móviles. |
| RNF03  | Interfaz intuitiva y moderna. |
| RNF04  | Información clara y accesible. |
| RNF05  | Tiempo de carga rápido. |

---

## Stack tecnológico

```
Frontend + Backend (monolito moderno)
├── Next.js 15 (App Router + API Routes + Server Actions)
├── React + TypeScript
├── TailwindCSS + shadcn/ui
└── Prisma ORM

Base de datos
└── PostgreSQL
    ├── Local: Docker o Neon
    └── Producción: Neon / Railway / Render

Mapa
└── Leaflet + OpenStreetMap (gratuito, rápido, sencillo)

Autenticación
└── Auth.js (NextAuth) — Google, GitHub o Email

Hosting
├── Frontend/Backend: Vercel
└── BD: Neon o Railway
```

---

## Arquitectura

```
[ Usuario ]
     ↓
[ Next.js — Frontend + API Routes ]
     ↓
[ Prisma ORM ]
     ↓
[ PostgreSQL ]
```

> No se usan microservicios, Docker complejo, GraphQL ni arquitectura hexagonal.
> Monolito moderno: Next.js + PostgreSQL. Eso es exactamente lo que usan muchas startups early-stage.

---

## Modelo de base de datos (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      String   @default("user")
  city      String?
  interests String[]
  createdAt DateTime @default(now())
}

model Organization {
  id            String        @id @default(cuid())
  name          String
  description   String
  logoUrl       String?
  website       String?
  instagram     String?
  email         String?
  location      String?
  category      String?
  createdAt     DateTime      @default(now())
  opportunities Opportunity[]
  events        Event[]
}

model Category {
  id            String        @id @default(cuid())
  name          String        // empleo, becas, cultura, liderazgo, tecnología...
  icon          String?
  opportunities Opportunity[]
}

model Opportunity {
  id             String       @id @default(cuid())
  title          String
  description    String
  category       String
  location       String?
  latitude       Float?
  longitude      Float?
  type           String?
  startDate      DateTime?
  endDate        DateTime?
  link           String?
  imageUrl       String?
  createdAt      DateTime     @default(now())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}

model Event {
  id             String       @id @default(cuid())
  title          String
  description    String
  location       String?
  date           DateTime?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}
```

**Relaciones clave:**
- `Organization` → muchas `Opportunity`
- `Organization` → muchos `Event`
- `Category` → muchas `Opportunity`

---

## Estructura de carpetas

```
src/
├── app/
│   ├── page.tsx                  # Home
│   ├── opportunities/page.tsx    # Feed de oportunidades
│   ├── organizations/page.tsx    # Directorio
│   ├── map/page.tsx              # Mapa interactivo
│   └── dashboard/page.tsx        # Panel de admin
├── components/
│   ├── OpportunityCard.tsx
│   ├── OrganizationCard.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── Filters.tsx
│   └── MapView.tsx
├── services/
│   ├── opportunities.service.ts
│   └── organizations.service.ts
├── actions/                      # Server Actions de Next.js
├── hooks/
├── types/
├── lib/
├── prisma/
│   └── schema.prisma
└── utils/
```

---

## Pantallas

| Pantalla | Contenido |
|----------|-----------|
| Home | Barra de búsqueda, categorías, oportunidades destacadas |
| Explorar oportunidades | Feed de oportunidades + filtros |
| Organizaciones | Directorio de organizaciones |
| Mapa | Espacios juveniles georreferenciados |
| Detalle oportunidad | Info completa + contacto |

---

## Flujos de usuario

**Caso 1 — Joven busca oportunidades:**
```
Usuario entra → Frontend pide datos a PostgreSQL vía Prisma
→ Se renderiza feed → Usuario filtra → Nueva consulta SQL automática
```

**Caso 2 — Organización publica convocatoria:**
```
Login → Formulario → Insert en tabla Opportunity → Feed se actualiza
```

**Caso 3 — Mapa interactivo:**
```
DB guarda lat/lng → Leaflet consume coordenadas → Pines en mapa
```

---

## Prioridades del hackatón

**Enfocarse en:**
1. UI clara y visualmente impactante.
2. Datos visibles (aunque sean mock al inicio).
3. Mapa funcionando.
4. Flujo funcional end-to-end.
5. Storytelling e impacto social visible.

**Evitar:**
- Backend complejo o microservicios.
- Docker, Kubernetes, RabbitMQ, Redis.
- GraphQL o arquitectura hexagonal.
- Funciones demasiado grandes o roles complejos.
- IA innecesaria.

> Una app simple extremadamente bien hecha gana sobre una app enorme rota.

---

## Roadmap futuro

**Fase 1 — MVP (Hackatón)**
- Centralización de oportunidades.
- Directorio de organizaciones.
- Mapa interactivo.

**Fase 2**
- Alertas personalizadas.
- Agenda juvenil.
- Reservas de espacios.
- Sistema de impacto.

**Fase 3**
- Integración institucional.
- Analítica territorial.
- Matching inteligente.
- Comunidad juvenil.

---

## Pitch

> **Conecta Joven Cartagena** es una plataforma digital que transforma información dispersa en oportunidades visibles para la juventud.
>
> Centraliza convocatorias, organizaciones y espacios de participación en un solo ecosistema accesible, permitiendo que más jóvenes puedan involucrarse, liderar e incidir en las decisiones de su territorio.

**Mensaje clave:** No buscamos crear más espacios. Buscamos organizar, centralizar y hacer visibles los que ya existen.

**Diferencial real:**
- Articulación juvenil.
- Democratización de la información.
- Visibilidad territorial.
- Accesibilidad.
- Conexión directa entre jóvenes y oportunidades.