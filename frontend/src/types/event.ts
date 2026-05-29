export interface EventOrganizationSummary {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string | null;
  date: string | null;
  latitude: number | null;
  longitude: number | null;
  organizationId: string;
}

export interface EventWithOrganization extends Event {
  organization: EventOrganizationSummary;
}

export interface CreateEventInput {
  title: string;
  description: string;
  organizationId: string;
  location?: string | null;
  date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
