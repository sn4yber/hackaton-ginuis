"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/opportunities", label: "Oportunidades" },
  { href: "/organizations", label: "Organizaciones" },
  { href: "/events", label: "Eventos" },
  { href: "/map", label: "Mapa" },
  { href: "/search", label: "Buscar" },
];

export function SiteHeader() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="bg-wood-900 text-cream">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className="text-base font-bold">
          conecta<span className="text-gold-light">joven</span>
        </Link>

        <nav aria-label="Navegacion" className="flex flex-wrap items-center gap-4 text-sm text-sand">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-gold-light">
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className="transition hover:text-gold-light">
              Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {isLoading ? (
            <span className="text-sand">...</span>
          ) : user ? (
            <>
              <span className="hidden text-sand sm:inline">{user.name.split(" ")[0]}</span>
              <button
                type="button"
                onClick={logout}
                className="font-medium text-gold-light hover:text-cream"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sand hover:text-cream">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-teal px-3 py-1.5 font-semibold text-white hover:bg-teal-light"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
