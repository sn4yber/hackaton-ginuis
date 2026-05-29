import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { SearchBar } from "@/components/shared/SearchBar";
import { globalSearch } from "@/services/search.service";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca oportunidades, organizaciones y eventos en Cartagena.",
};

export const dynamic = "force-dynamic";

const typeLabels = {
  opportunity: "Oportunidad",
  organization: "Organizacion",
  event: "Evento",
} as const;

function resultHref(type: keyof typeof typeLabels, id: string) {
  if (type === "organization") return `/organizations/${id}`;
  if (type === "event") return `/events/${id}`;
  return `/opportunities/${id}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = query.length >= 2 ? await globalSearch(query) : null;

  return (
    <PageShell title="Buscar" subtitle="Encuentra oportunidades, organizaciones y eventos.">
      <SearchBar defaultQuery={query} />

      {!query && (
        <p className="mt-8 text-muted">Escribe al menos 2 caracteres para buscar.</p>
      )}

      {query && query.length < 2 && (
        <p className="mt-8 text-muted">La busqueda debe tener al menos 2 caracteres.</p>
      )}

      {results && (
        <section className="mt-8">
          <p className="text-sm text-muted">
            {results.results.length} resultado(s) para &quot;{results.query}&quot;
          </p>

          {results.results.length === 0 ? (
            <p className="mt-4 text-muted">No encontramos coincidencias.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {results.results.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    href={resultHref(item.type, item.id)}
                    className="block rounded-xl border-2 border-sand bg-cream p-4 transition hover:border-teal"
                  >
                    <span className="text-xs font-semibold uppercase text-teal">
                      {typeLabels[item.type]}
                    </span>
                    <h2 className="mt-1 font-semibold text-wood-950">{item.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                    {(item.category || item.location) && (
                      <p className="mt-2 text-xs text-wood-800">
                        {[item.category, item.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </PageShell>
  );
}
