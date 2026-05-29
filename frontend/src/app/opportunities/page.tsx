import type { Metadata } from "next";
import { FilterForm } from "@/components/shared/FilterForm";
import { PageShell } from "@/components/shared/PageShell";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { formatDate } from "@/lib/format";
import { fetchCategories } from "@/services/categories.service";
import { fetchOpportunities } from "@/services/opportunities.service";

export const metadata: Metadata = {
  title: "Oportunidades",
  description: "Convocatorias y oportunidades juveniles en Cartagena.",
};

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [opportunities, categories] = await Promise.all([
    fetchOpportunities({ category: params.category, search: params.search }),
    fetchCategories(),
  ]);

  return (
    <PageShell
      title="Oportunidades"
      subtitle="Convocatorias, becas y programas para jovenes en Cartagena."
    >
      <FilterForm
        action="/opportunities"
        defaultSearch={params.search ?? ""}
        defaultCategory={params.category ?? ""}
        categories={categories}
        searchPlaceholder="Buscar oportunidades..."
      />

      {opportunities.length === 0 ? (
        <p className="mt-10 text-muted">No hay oportunidades con esos filtros.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {opportunities.map((item) => (
            <li key={item.id}>
              <ResourceCard
                href={`/opportunities/${item.id}`}
                title={item.title}
                description={item.description}
                badge={item.category}
                meta={[
                  item.organization.name,
                  item.location,
                  formatDate(item.endDate) ? `Cierra: ${formatDate(item.endDate)}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
