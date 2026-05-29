import type { Metadata } from "next";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/shared/PageShell";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { formatDate } from "@/lib/format";
import { fetchEvents } from "@/services/events.service";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Eventos juveniles proximos en Cartagena.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; upcoming?: string }>;
}) {
  const params = await searchParams;
  const events = await fetchEvents({
    search: params.search,
    upcoming: params.upcoming ?? "true",
  });

  return (
    <PageShell title="Eventos" subtitle="Actividades y encuentros para jovenes en la ciudad.">
      <form action="/events" method="get" className="flex flex-wrap gap-3">
        <Input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Buscar eventos..."
          className="max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-wood-800">
          <input
            type="checkbox"
            name="upcoming"
            value="true"
            defaultChecked={params.upcoming !== "false"}
            className="rounded border-sand"
          />
          Solo proximos
        </label>
        <button
          type="submit"
          className="h-11 rounded-lg bg-wood-900 px-4 text-sm font-semibold text-cream hover:bg-wood-800"
        >
          Filtrar
        </button>
      </form>

      {events.length === 0 ? (
        <p className="mt-10 text-muted">No hay eventos con esos filtros.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <ResourceCard
                href={`/events/${event.id}`}
                title={event.title}
                description={event.description}
                meta={[event.organization.name, event.location, formatDate(event.date)]
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
