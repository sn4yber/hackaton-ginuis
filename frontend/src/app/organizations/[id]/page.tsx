import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { formatDate } from "@/lib/format";
import { fetchOrganization } from "@/services/organizations.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const org = await fetchOrganization(id);
    return { title: org.name, description: org.description.slice(0, 160) };
  } catch {
    return { title: "Organizacion" };
  }
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let organization;
  try {
    organization = await fetchOrganization(id);
  } catch {
    notFound();
  }

  return (
    <PageShell>
      <Link href="/organizations" className="text-sm font-medium text-teal hover:underline">
        ← Volver a organizaciones
      </Link>

      <article className="mt-6">
        {organization.category && (
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-wood-900">
            {organization.category}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-bold text-wood-950">{organization.name}</h1>
        <p className="mt-4 leading-7 text-wood-800">{organization.description}</p>

        <dl className="mt-8 grid gap-4 rounded-xl border-2 border-sand bg-cream p-5 sm:grid-cols-2">
          {organization.location && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Ubicacion</dt>
              <dd className="mt-1">{organization.location}</dd>
            </div>
          )}
          {organization.email && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${organization.email}`} className="text-teal hover:underline">
                  {organization.email}
                </a>
              </dd>
            </div>
          )}
          {organization.website && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Web</dt>
              <dd className="mt-1">
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:underline"
                >
                  {organization.website}
                </a>
              </dd>
            </div>
          )}
          {organization.instagram && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Instagram</dt>
              <dd className="mt-1">{organization.instagram}</dd>
            </div>
          )}
        </dl>
      </article>

      {organization.opportunities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-wood-950">Oportunidades</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {organization.opportunities.map((item) => (
              <li key={item.id}>
                <ResourceCard
                  href={`/opportunities/${item.id}`}
                  title={item.title}
                  description={item.description}
                  badge={item.category}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {organization.events.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-wood-950">Eventos</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {organization.events.map((event) => (
              <li key={event.id}>
                <ResourceCard
                  href={`/events/${event.id}`}
                  title={event.title}
                  description={event.description}
                  meta={[event.location, formatDate(event.date)].filter(Boolean).join(" · ")}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
