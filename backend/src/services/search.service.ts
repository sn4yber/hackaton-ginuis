import { searchEvents } from "../models/event.model.js";
import { searchOrganizations } from "../models/organization.model.js";
import { searchOpportunities } from "../models/opportunity.model.js";
import type { GlobalSearchResponse } from "../types/common.js";
import { AppError } from "../utils/errors.js";
import { requireNonEmpty } from "../utils/validation.js";

export async function globalSearch(query: Record<string, unknown>): Promise<GlobalSearchResponse> {
  const search = requireNonEmpty(query.q ?? query.search, "La búsqueda");

  if (search.length < 2) {
    throw new AppError("La búsqueda debe tener al menos 2 caracteres");
  }

  const [opportunities, organizations, events] = await Promise.all([
    searchOpportunities(search),
    searchOrganizations(search),
    searchEvents(search),
  ]);

  return {
    query: search,
    results: [
      ...opportunities.map((item) => ({
        type: "opportunity" as const,
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
      })),
      ...organizations.map((item) => ({
        type: "organization" as const,
        id: item.id,
        title: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
      })),
      ...events.map((item) => ({
        type: "event" as const,
        id: item.id,
        title: item.title,
        description: item.description,
        category: null,
        location: item.location,
      })),
    ],
  };
}
