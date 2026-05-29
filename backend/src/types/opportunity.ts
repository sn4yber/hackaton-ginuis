import type { Organization } from "./organization.js";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  startDate: Date | null;
  endDate: Date | null;
  link: string | null;
  imageUrl: string | null;
  organizationId: string;
  createdAt: Date;
}

export interface OpportunityRow {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  start_date: Date | null;
  end_date: Date | null;
  link: string | null;
  image_url: string | null;
  organization_id: string;
  created_at: Date;
}

export interface OpportunityWithOrganization extends Opportunity {
  organization: Pick<Organization, "id" | "name" | "logoUrl" | "location">;
}

export interface OpportunityFilters {
  category?: string;
  organizationId?: string;
  search?: string;
  mapOnly?: boolean;
}

export interface CreateOpportunityInput {
  title: string;
  description: string;
  category: string;
  organizationId: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  link?: string | null;
  imageUrl?: string | null;
}

export type UpdateOpportunityInput = Partial<
  Omit<CreateOpportunityInput, "organizationId">
> & {
  organizationId?: string;
};

export interface MapPoint {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  location: string | null;
  organizationId: string;
  organizationName: string;
}

export function mapOpportunityRow(row: OpportunityRow): Opportunity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    link: row.link,
    imageUrl: row.image_url,
    organizationId: row.organization_id,
    createdAt: row.created_at,
  };
}
