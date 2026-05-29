export interface OrganizationSummary {
  id: string;
  name: string;
  logoUrl: string | null;
  location: string | null;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  startDate: string | null;
  endDate: string | null;
  link: string | null;
  imageUrl: string | null;
  organizationId: string;
  createdAt: string;
}

export interface OpportunityWithOrganization extends Opportunity {
  organization: OrganizationSummary;
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
  startDate?: string | null;
  endDate?: string | null;
  link?: string | null;
  imageUrl?: string | null;
}
