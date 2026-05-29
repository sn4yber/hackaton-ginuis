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
  createdAt: Date;
}

export interface OrganizationRow {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  location: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: Date;
}

export interface OrganizationFilters {
  category?: string;
  search?: string;
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

export type UpdateOrganizationInput = Partial<CreateOrganizationInput>;

export function mapOrganizationRow(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    logoUrl: row.logo_url,
    website: row.website,
    instagram: row.instagram,
    email: row.email,
    location: row.location,
    category: row.category,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
  };
}
