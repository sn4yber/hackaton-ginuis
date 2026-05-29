import { getPool } from "../lib/db.js";
import {
  mapOpportunityRow,
  type CreateOpportunityInput,
  type MapPoint,
  type Opportunity,
  type OpportunityFilters,
  type OpportunityRow,
  type OpportunityWithOrganization,
  type UpdateOpportunityInput,
} from "../types/opportunity.js";

const OPPORTUNITY_COLUMNS = `
  o.id, o.title, o.description, o.category, o.location, o.latitude, o.longitude,
  o.type, o.start_date, o.end_date, o.link, o.image_url, o.organization_id, o.created_at
`;

type OpportunityWithOrganizationRow = OpportunityRow & {
  organization_name: string;
  organization_logo_url: string | null;
  organization_location: string | null;
};

function mapOpportunityWithOrganization(
  row: OpportunityWithOrganizationRow
): OpportunityWithOrganization {
  return {
    ...mapOpportunityRow(row),
    organization: {
      id: row.organization_id,
      name: row.organization_name,
      logoUrl: row.organization_logo_url,
      location: row.organization_location,
    },
  };
}

function buildFilters(filters: OpportunityFilters, startIndex = 1) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let index = startIndex;

  if (filters.category) {
    conditions.push(`o.category = $${index++}`);
    values.push(filters.category);
  }

  if (filters.organizationId) {
    conditions.push(`o.organization_id = $${index++}`);
    values.push(filters.organizationId);
  }

  if (filters.search) {
    conditions.push(
      `(o.title ILIKE $${index} OR o.description ILIKE $${index} OR o.location ILIKE $${index})`
    );
    values.push(`%${filters.search}%`);
    index++;
  }

  if (filters.mapOnly) {
    conditions.push("o.latitude IS NOT NULL AND o.longitude IS NOT NULL");
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { whereClause, values };
}

export async function findAllOpportunities(
  filters: OpportunityFilters = {}
): Promise<OpportunityWithOrganization[]> {
  const { whereClause, values } = buildFilters(filters);

  const result = await getPool().query<OpportunityWithOrganizationRow>(
    `SELECT ${OPPORTUNITY_COLUMNS},
            org.name AS organization_name,
            org.logo_url AS organization_logo_url,
            org.location AS organization_location
     FROM opportunities o
     INNER JOIN organizations org ON org.id = o.organization_id
     ${whereClause}
     ORDER BY o.created_at DESC`,
    values
  );

  return result.rows.map(mapOpportunityWithOrganization);
}

export async function findOpportunityById(
  id: string
): Promise<OpportunityWithOrganization | null> {
  const result = await getPool().query<OpportunityWithOrganizationRow>(
    `SELECT ${OPPORTUNITY_COLUMNS},
            org.name AS organization_name,
            org.logo_url AS organization_logo_url,
            org.location AS organization_location
     FROM opportunities o
     INNER JOIN organizations org ON org.id = o.organization_id
     WHERE o.id = $1`,
    [id]
  );

  return result.rows[0] ? mapOpportunityWithOrganization(result.rows[0]) : null;
}

export async function findMapPoints(): Promise<MapPoint[]> {
  const result = await getPool().query<MapPoint>(
    `SELECT
       o.id,
       o.title,
       o.category,
       o.latitude,
       o.longitude,
       o.location,
       o.organization_id AS "organizationId",
       org.name AS "organizationName"
     FROM opportunities o
     INNER JOIN organizations org ON org.id = o.organization_id
     WHERE o.latitude IS NOT NULL AND o.longitude IS NOT NULL
     ORDER BY o.created_at DESC`
  );

  return result.rows;
}

export async function createOpportunity(
  input: CreateOpportunityInput
): Promise<Opportunity> {
  const result = await getPool().query<OpportunityRow>(
    `INSERT INTO opportunities
      (title, description, category, location, latitude, longitude, type,
       start_date, end_date, link, image_url, organization_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id, title, description, category, location, latitude, longitude,
               type, start_date, end_date, link, image_url, organization_id, created_at`,
    [
      input.title,
      input.description,
      input.category,
      input.location ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.type ?? null,
      input.startDate ?? null,
      input.endDate ?? null,
      input.link ?? null,
      input.imageUrl ?? null,
      input.organizationId,
    ]
  );

  return mapOpportunityRow(result.rows[0]);
}

export async function updateOpportunity(
  id: string,
  input: UpdateOpportunityInput
): Promise<Opportunity | null> {
  const result = await getPool().query<OpportunityRow>(
    `UPDATE opportunities
     SET
       title = COALESCE($2, title),
       description = COALESCE($3, description),
       category = COALESCE($4, category),
       location = COALESCE($5, location),
       latitude = COALESCE($6, latitude),
       longitude = COALESCE($7, longitude),
       type = COALESCE($8, type),
       start_date = COALESCE($9, start_date),
       end_date = COALESCE($10, end_date),
       link = COALESCE($11, link),
       image_url = COALESCE($12, image_url),
       organization_id = COALESCE($13, organization_id)
     WHERE id = $1
     RETURNING id, title, description, category, location, latitude, longitude,
               type, start_date, end_date, link, image_url, organization_id, created_at`,
    [
      id,
      input.title ?? null,
      input.description ?? null,
      input.category ?? null,
      input.location ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.type ?? null,
      input.startDate ?? null,
      input.endDate ?? null,
      input.link ?? null,
      input.imageUrl ?? null,
      input.organizationId ?? null,
    ]
  );

  return result.rows[0] ? mapOpportunityRow(result.rows[0]) : null;
}

export async function deleteOpportunity(id: string): Promise<boolean> {
  const result = await getPool().query("DELETE FROM opportunities WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function findOpportunitiesByOrganizationId(organizationId: string) {
  return findAllOpportunities({ organizationId });
}

export async function searchOpportunities(search: string, limit = 10) {
  const result = await getPool().query<{
    id: string;
    title: string;
    description: string;
    category: string;
    location: string | null;
  }>(
    `SELECT id, title, description, category, location
     FROM opportunities
     WHERE title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1 OR category ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [`%${search}%`, limit]
  );

  return result.rows;
}
