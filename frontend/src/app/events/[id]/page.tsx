import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { formatDate } from "@/lib/format";
import { fetchEvent } from "@/services/events.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await fetchEvent(id);
    return { title: event.title, description: event.description.slice(0, 160) };
  } catch {
    return { title: "Evento" };
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let event;
  try {
    event = await fetchEvent(id);
  } catch {
    notFound();
  }

  return (
    <PageShell>
      <Link href="/events" className="text-sm font-medium text-teal hover:underline">
        ← Volver a eventos
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-wood-950">{event.title}</h1>
        <p className="mt-4 leading-7 text-wood-800">{event.description}</p>

        <dl className="mt-8 grid gap-4 rounded-xl border-2 border-sand bg-cream p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">Organizacion</dt>
            <dd className="mt-1">
              <Link
                href={`/organizations/${event.organization.id}`}
                className="font-medium text-teal hover:underline"
              >
                {event.organization.name}
              </Link>
            </dd>
          </div>
          {event.date && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Fecha</dt>
              <dd className="mt-1">{formatDate(event.date)}</dd>
            </div>
          )}
          {event.location && (
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Ubicacion</dt>
              <dd className="mt-1">{event.location}</dd>
            </div>
          )}
        </dl>
      </article>
    </PageShell>
  );
}
