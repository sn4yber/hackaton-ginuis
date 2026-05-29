import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { formatDate } from "@/lib/format";
import { fetchOpportunity } from "@/services/opportunities.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const opportunity = await fetchOpportunity(id);
    return { title: opportunity.title, description: opportunity.description.slice(0, 160) };
  } catch {
    return { title: "Oportunidad" };
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let opportunity;
  try {
    opportunity = await fetchOpportunity(id);
  } catch {
    notFound();
  }

  return (
    <PageShell>
      <Link href="/opportunities" className="text-sm font-medium text-teal hover:underline">
        ← Volver a oportunidades
      </Link>

      <article className="mt-6">
        <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
          {opportunity.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-wood-950">{opportunity.title}</h1>
        <p className="mt-4 leading-7 text-wood-800">{opportunity.description}</p>

        <dl className="mt-8 grid gap-4 rounded-xl border-2 border-sand bg-cream p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">Organizacion</dt>
            <dd className="mt-1">
              <Link
                href={`/organizations/${opportunity.organization.id}`}
                className="font-medium text-teal hover:underline"
              >
                {opportunity.organization.name}
              </Link>
            </dd>
          </div>
          {opportunity.location && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Ubicacion</dt>
              <dd className="mt-1">{opportunity.location}</dd>
            </div>
          )}
          {opportunity.startDate && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Inicio</dt>
              <dd className="mt-1">{formatDate(opportunity.startDate)}</dd>
            </div>
          )}
          {opportunity.endDate && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Cierre</dt>
              <dd className="mt-1">{formatDate(opportunity.endDate)}</dd>
            </div>
          )}
          {opportunity.type && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Tipo</dt>
              <dd className="mt-1">{opportunity.type}</dd>
            </div>
          )}
        </dl>

        {opportunity.link && (
          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-light"
          >
            Ir a la convocatoria
          </a>
        )}
      </article>
    </PageShell>
  );
}
