import { apiFetch } from "@/lib/api";
import type { MapPoint } from "@/types/common";

export async function fetchMapPoints(): Promise<MapPoint[]> {
  const data = await apiFetch<{ points: MapPoint[] }>("/api/map");
  return data.points;
}
