import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { fetchMapPoints } from "@/services/map.service";
import { MapPageClient } from "./MapPageClient";

export const metadata: Metadata = {
  title: "Mapa juvenil",
  description: "Mapa territorial de oportunidades, organizaciones y eventos en Cartagena.",
};

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const points = await fetchMapPoints();

  return (
    <PageShell
      title="Mapa juvenil"
      subtitle={`${points.length} puntos en Cartagena: oportunidades, organizaciones y eventos.`}
    >
      <MapPageClient points={points} />
    </PageShell>
  );
}
