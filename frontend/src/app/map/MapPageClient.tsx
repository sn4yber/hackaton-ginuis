"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/types/common";

const MapView = dynamic(() => import("@/components/map/MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-xl border-2 border-sand bg-cream text-muted">
      Cargando mapa...
    </div>
  ),
});

export function MapPageClient({ points }: { points: MapPoint[] }) {
  return <MapView points={points} />;
}
