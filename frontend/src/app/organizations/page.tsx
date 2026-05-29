import type { Metadata } from "next";
import { FilterForm } from "@/components/shared/FilterForm";
import { PageShell } from "@/components/shared/PageShell";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { fetchCategories } from "@/services/categories.service";
import { fetchOrganizations } from "@/services/organizations.service";

export const metadata: Metadata = {
  title: "Organizaciones",
  description: "Directorio de organizaciones juveniles en Cartagena.",
};

export const dynamic = "force-dynamic";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [organizations, categories] = await Promise.all([
    fetchOrganizations({ category: params.category, search: params.search }),
    fetchCategories(),
  ]);

  return (
    <PageShell
      title="Organizaciones"
      subtitle="Conoce quienes impulsan la participacion juvenil en la ciudad."
    >
      <FilterForm
        action="/organizations"
        defaultSearch={params.search ?? ""}
        defaultCategory={params.category ?? ""}
        categories={categories}
        searchPlaceholder="Buscar organizaciones..."
      />

      {organizations.length === 0 ? (
        <p className="mt-10 text-muted">No hay organizaciones con esos filtros.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {organizations.map((org) => (
            <li key={org.id}>
              <ResourceCard
                href={`/organizations/${org.id}`}
                title={org.name}
                description={org.description}
                badge={org.category}
                meta={org.location ?? undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
