import type { EventWithOrganization } from "./event";
import type { OpportunityWithOrganization } from "./opportunity";

export interface Organization {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  location: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface OrganizationDetail extends Organization {
  opportunities: OpportunityWithOrganization[];
  events: EventWithOrganization[];
}

export interface CreateOrganizationInput {
  name: string;
  description: string;
  logoUrl?: string | null;
  website?: string | null;
  instagram?: string | null;
  email?: string | null;
  location?: string | null;
  category?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
