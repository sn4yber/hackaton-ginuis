import { getPool } from "../lib/db.js";
import {
  mapEventRow,
  type CreateEventInput,
  type Event,
  type EventFilters,
  type EventRow,
  type EventWithOrganization,
  type UpdateEventInput,
} from "../types/event.js";

const EVENT_COLUMNS =
  "e.id, e.title, e.description, e.location, e.date, e.latitude, e.longitude, e.organization_id";

type EventWithOrganizationRow = EventRow & {
  organization_name: string;
  organization_logo_url: string | null;
};

function mapEventWithOrganization(row: EventWithOrganizationRow): EventWithOrganization {
  return {
    ...mapEventRow(row),
    organization: {
      id: row.organization_id,
      name: row.organization_name,
      logoUrl: row.organization_logo_url,
    },
  };
}

function buildFilters(filters: EventFilters) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (filters.organizationId) {
    conditions.push(`e.organization_id = $${index++}`);
    values.push(filters.organizationId);
  }

  if (filters.search) {
    conditions.push(
      `(e.title ILIKE $${index} OR e.description ILIKE $${index} OR e.location ILIKE $${index})`
    );
    values.push(`%${filters.search}%`);
    index++;
  }

  if (filters.upcoming) {
    conditions.push("e.date >= NOW()");
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
}

export async function findAllEvents(filters: EventFilters = {}): Promise<EventWithOrganization[]> {
  const { whereClause, values } = buildFilters(filters);

  const result = await getPool().query<EventWithOrganizationRow>(
    `SELECT ${EVENT_COLUMNS},
            org.name AS organization_name,
            org.logo_url AS organization_logo_url
     FROM events e
     INNER JOIN organizations org ON org.id = e.organization_id
     ${whereClause}
     ORDER BY e.date ASC NULLS LAST, e.title ASC`,
    values
  );

  return result.rows.map(mapEventWithOrganization);
}

export async function findEventsByOrganizationId(
  organizationId: string
): Promise<EventWithOrganization[]> {
  return findAllEvents({ organizationId });
}

export async function findEventById(id: string): Promise<EventWithOrganization | null> {
  const result = await getPool().query<EventWithOrganizationRow>(
    `SELECT ${EVENT_COLUMNS},
            org.name AS organization_name,
            org.logo_url AS organization_logo_url
     FROM events e
     INNER JOIN organizations org ON org.id = e.organization_id
     WHERE e.id = $1`,
    [id]
  );

  return result.rows[0] ? mapEventWithOrganization(result.rows[0]) : null;
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const result = await getPool().query<EventRow>(
    `INSERT INTO events (title, description, location, date, latitude, longitude, organization_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, location, date, latitude, longitude, organization_id`,
    [
      input.title,
      input.description,
      input.location ?? null,
      input.date ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.organizationId,
    ]
  );

  return mapEventRow(result.rows[0]);
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Event | null> {
  const result = await getPool().query<EventRow>(
    `UPDATE events
     SET
       title = COALESCE($2, title),
       description = COALESCE($3, description),
       location = COALESCE($4, location),
       date = COALESCE($5, date),
       latitude = COALESCE($6, latitude),
       longitude = COALESCE($7, longitude),
       organization_id = COALESCE($8, organization_id)
     WHERE id = $1
     RETURNING id, title, description, location, date, latitude, longitude, organization_id`,
    [
      id,
      input.title ?? null,
      input.description ?? null,
      input.location ?? null,
      input.date ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.organizationId ?? null,
    ]
  );

  return result.rows[0] ? mapEventRow(result.rows[0]) : null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const result = await getPool().query("DELETE FROM events WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function findEventMapPoints() {
  const result = await getPool().query<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    location: string | null;
    organizationId: string;
    organizationName: string;
  }>(
    `SELECT
       e.id,
       e.title,
       e.latitude,
       e.longitude,
       e.location,
       e.organization_id AS "organizationId",
       org.name AS "organizationName"
     FROM events e
     INNER JOIN organizations org ON org.id = e.organization_id
     WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL
     ORDER BY e.date ASC NULLS LAST`
  );

  return result.rows;
}

export async function searchEvents(search: string, limit = 10) {
  const result = await getPool().query<{
    id: string;
    title: string;
    description: string;
    location: string | null;
  }>(
    `SELECT id, title, description, location
     FROM events
     WHERE title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1
     ORDER BY date ASC NULLS LAST
     LIMIT $2`,
    [`%${search}%`, limit]
  );

  return result.rows;
}
