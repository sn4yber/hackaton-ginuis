import { findEventMapPoints } from "../models/event.model.js";
import { findOrganizationMapPoints } from "../models/organization.model.js";
import { findMapPoints } from "../models/opportunity.model.js";
import type { MapPoint } from "../types/common.js";

export async function getAllMapPoints(): Promise<MapPoint[]> {
  const [opportunities, organizations, events] = await Promise.all([
    findMapPoints(),
    findOrganizationMapPoints(),
    findEventMapPoints(),
  ]);

  return [
    ...opportunities.map((point) => ({
      id: point.id,
      type: "opportunity" as const,
      title: point.title,
      category: point.category,
      latitude: point.latitude,
      longitude: point.longitude,
      location: point.location,
      organizationId: point.organizationId,
      organizationName: point.organizationName,
    })),
    ...organizations.map((point) => ({
      id: point.id,
      type: "organization" as const,
      title: point.name,
      category: point.category,
      latitude: point.latitude,
      longitude: point.longitude,
      location: point.location,
      organizationId: point.id,
      organizationName: point.name,
    })),
    ...events.map((point) => ({
      id: point.id,
      type: "event" as const,
      title: point.title,
      category: null,
      latitude: point.latitude,
      longitude: point.longitude,
      location: point.location,
      organizationId: point.organizationId,
      organizationName: point.organizationName,
    })),
  ];
}
