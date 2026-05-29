import type { Metadata } from "next";
import { JsonLd } from "@/components/landing/JsonLd";
import { LandingHeroCta } from "@/components/landing/LandingHeroCta";
import { SiteHeader } from "@/components/shared/SiteHeader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Conecta Joven Cartagena | Oportunidades juveniles",
    template: "%s | Conecta Joven Cartagena",
  },
  description:
    "Plataforma para descubrir convocatorias, organizaciones y espacios de participacion juvenil en Cartagena de Indias.",
  keywords: [
    "oportunidades juveniles Cartagena",
    "convocatorias jovenes",
    "organizaciones juveniles Cartagena",
    "participacion juvenil",
    "mapa juvenil",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "Conecta Joven Cartagena",
    title: "Conecta Joven Cartagena",
    description: "Oportunidades juveniles centralizadas en Cartagena.",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main id="contenido-principal">
          <section
            aria-labelledby="hero-titulo"
            className="bg-gradient-to-br from-wood-800 via-teal to-wood-900 px-4 py-20 lg:px-8 lg:py-28"
          >
            <div className="mx-auto max-w-5xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-light">
                Cartagena · 14 a 28 anos
              </p>
              <h1
                id="hero-titulo"
                className="mt-5 max-w-3xl text-4xl font-bold leading-[1.12] text-cream sm:text-5xl lg:text-6xl"
              >
                Encuentra donde{" "}
                <span className="text-gold-light">participar</span>, crecer e incidir
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-sand">
                Convocatorias, organizaciones y mapa juvenil en un solo lugar. Menos buscar,
                mas hacer.
              </p>
              <LandingHeroCta />
            </div>
          </section>

          <section
            id="que-es"
            aria-label="Que es Conecta Joven"
            className="bg-gold px-4 py-6 lg:px-8"
          >
            <p className="mx-auto max-w-5xl text-center text-base font-semibold text-wood-950 sm:text-lg">
              Organizamos la info dispersa para que mas jovenes lleguen a las oportunidades
            </p>
          </section>

          <section
            id="como-funciona"
            className="bg-cream px-4 py-16 lg:px-8 lg:py-20"
          >
            <div className="mx-auto max-w-5xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-teal">
                Como funciona
              </h2>
              <p className="mt-6 max-w-2xl text-2xl font-bold leading-snug text-wood-950">
                Oportunidades, organizaciones y mapa.{" "}
                <span className="text-terracotta">Tres rutas</span>, una plataforma.
              </p>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-wood-800">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal" />
                  Convocatorias y becas
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  Directorio de organizaciones
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-terracotta" />
                  Mapa territorial
                </li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="bg-wood-950 px-4 py-8 text-center text-sm text-sand lg:px-8">
          <p className="font-medium text-cream">Conecta Joven Cartagena</p>
          <p className="mt-1">© {new Date().getFullYear()} · Cartagena, Colombia</p>
        </footer>
      </div>
    </>
  );
}
