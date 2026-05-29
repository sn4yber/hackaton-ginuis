import type { Organization } from "./organization.js";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string | null;
  date: Date | null;
  latitude: number | null;
  longitude: number | null;
  organizationId: string;
}

export interface EventRow {
  id: string;
  title: string;
  description: string;
  location: string | null;
  date: Date | null;
  latitude: number | null;
  longitude: number | null;
  organization_id: string;
}

export interface EventWithOrganization extends Event {
  organization: Pick<Organization, "id" | "name" | "logoUrl">;
}

export interface EventFilters {
  organizationId?: string;
  search?: string;
  upcoming?: boolean;
}

export interface CreateEventInput {
  title: string;
  description: string;
  organizationId: string;
  location?: string | null;
  date?: Date | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdateEventInput = Partial<Omit<CreateEventInput, "organizationId">> & {
  organizationId?: string;
};

export function mapEventRow(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date,
    latitude: row.latitude,
    longitude: row.longitude,
    organizationId: row.organization_id,
  };
}
