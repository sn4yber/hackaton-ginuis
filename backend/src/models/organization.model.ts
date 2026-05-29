import { getPool } from "../lib/db.js";
import {
  mapOrganizationRow,
  type CreateOrganizationInput,
  type Organization,
  type OrganizationFilters,
  type OrganizationRow,
  type UpdateOrganizationInput,
} from "../types/organization.js";

const ORGANIZATION_COLUMNS = `
  id, name, description, logo_url, website, instagram, email, location, category,
  latitude, longitude, created_at
`;

function buildFilters(filters: OrganizationFilters) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (filters.category) {
    conditions.push(`category = $${index++}`);
    values.push(filters.category);
  }

  if (filters.search) {
    conditions.push(
      `(name ILIKE $${index} OR description ILIKE $${index} OR location ILIKE $${index})`
    );
    values.push(`%${filters.search}%`);
    index++;
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
}

export async function findAllOrganizations(
  filters: OrganizationFilters = {}
): Promise<Organization[]> {
  const { whereClause, values } = buildFilters(filters);

  const result = await getPool().query<OrganizationRow>(
    `SELECT ${ORGANIZATION_COLUMNS}
     FROM organizations
     ${whereClause}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows.map(mapOrganizationRow);
}

export async function findOrganizationById(id: string): Promise<Organization | null> {
  const result = await getPool().query<OrganizationRow>(
    `SELECT ${ORGANIZATION_COLUMNS} FROM organizations WHERE id = $1`,
    [id]
  );

  return result.rows[0] ? mapOrganizationRow(result.rows[0]) : null;
}

export async function findOrganizationByName(name: string): Promise<Organization | null> {
  const result = await getPool().query<OrganizationRow>(
    `SELECT ${ORGANIZATION_COLUMNS} FROM organizations WHERE LOWER(name) = LOWER($1)`,
    [name.trim()]
  );

  return result.rows[0] ? mapOrganizationRow(result.rows[0]) : null;
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<Organization> {
  const result = await getPool().query<OrganizationRow>(
    `INSERT INTO organizations
      (name, description, logo_url, website, instagram, email, location, category, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${ORGANIZATION_COLUMNS}`,
    [
      input.name,
      input.description,
      input.logoUrl ?? null,
      input.website ?? null,
      input.instagram ?? null,
      input.email ?? null,
      input.location ?? null,
      input.category ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
    ]
  );

  return mapOrganizationRow(result.rows[0]);
}

export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput
): Promise<Organization | null> {
  const result = await getPool().query<OrganizationRow>(
    `UPDATE organizations
     SET
       name = COALESCE($2, name),
       description = COALESCE($3, description),
       logo_url = COALESCE($4, logo_url),
       website = COALESCE($5, website),
       instagram = COALESCE($6, instagram),
       email = COALESCE($7, email),
       location = COALESCE($8, location),
       category = COALESCE($9, category),
       latitude = COALESCE($10, latitude),
       longitude = COALESCE($11, longitude)
     WHERE id = $1
     RETURNING ${ORGANIZATION_COLUMNS}`,
    [
      id,
      input.name ?? null,
      input.description ?? null,
      input.logoUrl ?? null,
      input.website ?? null,
      input.instagram ?? null,
      input.email ?? null,
      input.location ?? null,
      input.category ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
    ]
  );

  return result.rows[0] ? mapOrganizationRow(result.rows[0]) : null;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const result = await getPool().query("DELETE FROM organizations WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function organizationExists(id: string): Promise<boolean> {
  const result = await getPool().query("SELECT 1 FROM organizations WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function findOrganizationMapPoints() {
  const result = await getPool().query<{
    id: string;
    name: string;
    category: string | null;
    latitude: number;
    longitude: number;
    location: string | null;
  }>(
    `SELECT id, name, category, latitude, longitude, location
     FROM organizations
     WHERE latitude IS NOT NULL AND longitude IS NOT NULL
     ORDER BY name ASC`
  );

  return result.rows;
}

export async function searchOrganizations(search: string, limit = 10) {
  const result = await getPool().query<{
    id: string;
    name: string;
    description: string;
    category: string | null;
    location: string | null;
  }>(
    `SELECT id, name, description, category, location
     FROM organizations
     WHERE name ILIKE $1 OR description ILIKE $1 OR location ILIKE $1
     ORDER BY name ASC
     LIMIT $2`,
    [`%${search}%`, limit]
  );

  return result.rows;
}
