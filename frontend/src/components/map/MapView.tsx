"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { MapPoint } from "@/types/common";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const typeLabels: Record<MapPoint["type"], string> = {
  opportunity: "Oportunidad",
  organization: "Organizacion",
  event: "Evento",
};

function detailPath(point: MapPoint): string {
  if (point.type === "organization") return `/organizations/${point.id}`;
  if (point.type === "event") return `/events/${point.id}`;
  return `/opportunities/${point.id}`;
}

export function MapView({ points }: { points: MapPoint[] }) {
  const center: [number, number] =
    points.length > 0 ? [points[0].latitude, points[0].longitude] : [10.391, -75.4794];

  return (
    <MapContainer center={center} zoom={13} className="h-[480px] w-full rounded-xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <Marker
          key={`${point.type}-${point.id}`}
          position={[point.latitude, point.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase text-teal">{typeLabels[point.type]}</p>
              <p className="font-semibold">{point.title}</p>
              {point.location && <p className="text-muted">{point.location}</p>}
              <Link href={detailPath(point)} className="text-teal underline">
                Ver detalle
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
