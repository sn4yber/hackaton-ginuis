"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function LandingHeroCta() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <p className="mt-8 rounded-lg bg-white/15 px-4 py-3 text-sm text-cream" role="status">
        Hola, {user.name.split(" ")[0]}. Tu cuenta ya esta activa.
      </p>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href="/register"
        className="inline-flex h-11 items-center rounded-lg bg-gold px-5 text-sm font-bold text-wood-950 transition hover:bg-gold-light"
      >
        Empezar gratis
      </Link>
      <Link
        href="/login"
        className="inline-flex h-11 items-center rounded-lg border-2 border-cream/40 px-5 text-sm font-semibold text-cream transition hover:bg-white/10"
      >
        Tengo cuenta
      </Link>
    </div>
  );
}
