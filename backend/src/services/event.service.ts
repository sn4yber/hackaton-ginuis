import { organizationExists } from "../models/organization.model.js";
import {
  createEvent,
  deleteEvent,
  findAllEvents,
  findEventById,
  updateEvent,
} from "../models/event.model.js";
import type { CreateEventInput, EventFilters, UpdateEventInput } from "../types/event.js";
import { AppError } from "../utils/errors.js";
import {
  optionalDate,
  optionalNumber,
  optionalString,
  requireNonEmpty,
  requireUuid,
} from "../utils/validation.js";

function parseFilters(query: Record<string, unknown>): EventFilters {
  return {
    organizationId: optionalString(query.organizationId) ?? undefined,
    search: optionalString(query.search) ?? undefined,
    upcoming: query.upcoming === "true",
  };
}

function parseCreateInput(body: unknown): CreateEventInput {
  const data = body as CreateEventInput;

  return {
    title: requireNonEmpty(data.title, "El título"),
    description: requireNonEmpty(data.description, "La descripción"),
    organizationId: requireUuid(data.organizationId, "organizationId"),
    location: optionalString(data.location),
    date: optionalDate(data.date),
    latitude: optionalNumber(data.latitude),
    longitude: optionalNumber(data.longitude),
  };
}

function parseUpdateInput(body: unknown): UpdateEventInput {
  const data = body as UpdateEventInput;

  return {
    title: data.title ? requireNonEmpty(data.title, "El título") : undefined,
    description: data.description
      ? requireNonEmpty(data.description, "La descripción")
      : undefined,
    organizationId: data.organizationId
      ? requireUuid(data.organizationId, "organizationId")
      : undefined,
    location: data.location !== undefined ? optionalString(data.location) : undefined,
    date: data.date !== undefined ? optionalDate(data.date) : undefined,
    latitude: data.latitude !== undefined ? optionalNumber(data.latitude) : undefined,
    longitude: data.longitude !== undefined ? optionalNumber(data.longitude) : undefined,
  };
}

async function ensureOrganizationExists(organizationId: string) {
  const exists = await organizationExists(organizationId);

  if (!exists) {
    throw new AppError("La organización indicada no existe", 404);
  }
}

export async function listEvents(query: Record<string, unknown>) {
  return findAllEvents(parseFilters(query));
}

export async function getEvent(id: string) {
  const event = await findEventById(requireUuid(id));

  if (!event) {
    throw new AppError("Evento no encontrado", 404);
  }

  return event;
}

export async function addEvent(body: unknown) {
  const input = parseCreateInput(body);
  await ensureOrganizationExists(input.organizationId);
  const event = await createEvent(input);
  return getEvent(event.id);
}

export async function editEvent(id: string, body: unknown) {
  const input = parseUpdateInput(body);

  if (input.organizationId) {
    await ensureOrganizationExists(input.organizationId);
  }

  const updated = await updateEvent(requireUuid(id), input);

  if (!updated) {
    throw new AppError("Evento no encontrado", 404);
  }

  return getEvent(updated.id);
}

export async function removeEvent(id: string) {
  const deleted = await deleteEvent(requireUuid(id));

  if (!deleted) {
    throw new AppError("Evento no encontrado", 404);
  }
}
