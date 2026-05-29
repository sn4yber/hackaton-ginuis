import { organizationExists } from "../models/organization.model.js";
import {
  createOpportunity,
  deleteOpportunity,
  findAllOpportunities,
  findMapPoints,
  findOpportunityById,
  updateOpportunity,
} from "../models/opportunity.model.js";
import type {
  CreateOpportunityInput,
  OpportunityFilters,
  UpdateOpportunityInput,
} from "../types/opportunity.js";
import { AppError } from "../utils/errors.js";
import {
  optionalDate,
  optionalNumber,
  optionalString,
  requireNonEmpty,
  requireUuid,
} from "../utils/validation.js";

function parseFilters(query: Record<string, unknown>): OpportunityFilters {
  return {
    category: optionalString(query.category) ?? undefined,
    organizationId: optionalString(query.organizationId) ?? undefined,
    search: optionalString(query.search) ?? undefined,
    mapOnly: query.mapOnly === "true",
  };
}

function parseCreateInput(body: unknown): CreateOpportunityInput {
  const data = body as CreateOpportunityInput;

  return {
    title: requireNonEmpty(data.title, "El título"),
    description: requireNonEmpty(data.description, "La descripción"),
    category: requireNonEmpty(data.category, "La categoría"),
    organizationId: requireUuid(data.organizationId, "organizationId"),
    location: optionalString(data.location),
    latitude: optionalNumber(data.latitude),
    longitude: optionalNumber(data.longitude),
    type: optionalString(data.type),
    startDate: optionalDate(data.startDate),
    endDate: optionalDate(data.endDate),
    link: optionalString(data.link),
    imageUrl: optionalString(data.imageUrl),
  };
}

function parseUpdateInput(body: unknown): UpdateOpportunityInput {
  const data = body as UpdateOpportunityInput;

  return {
    title: data.title ? requireNonEmpty(data.title, "El título") : undefined,
    description: data.description
      ? requireNonEmpty(data.description, "La descripción")
      : undefined,
    category: data.category ? requireNonEmpty(data.category, "La categoría") : undefined,
    organizationId: data.organizationId
      ? requireUuid(data.organizationId, "organizationId")
      : undefined,
    location: data.location !== undefined ? optionalString(data.location) : undefined,
    latitude: data.latitude !== undefined ? optionalNumber(data.latitude) : undefined,
    longitude: data.longitude !== undefined ? optionalNumber(data.longitude) : undefined,
    type: data.type !== undefined ? optionalString(data.type) : undefined,
    startDate: data.startDate !== undefined ? optionalDate(data.startDate) : undefined,
    endDate: data.endDate !== undefined ? optionalDate(data.endDate) : undefined,
    link: data.link !== undefined ? optionalString(data.link) : undefined,
    imageUrl: data.imageUrl !== undefined ? optionalString(data.imageUrl) : undefined,
  };
}

async function ensureOrganizationExists(organizationId: string) {
  const exists = await organizationExists(organizationId);

  if (!exists) {
    throw new AppError("La organización indicada no existe", 404);
  }
}

export async function listOpportunities(query: Record<string, unknown>) {
  return findAllOpportunities(parseFilters(query));
}

export async function getOpportunity(id: string) {
  const opportunity = await findOpportunityById(requireUuid(id));

  if (!opportunity) {
    throw new AppError("Oportunidad no encontrada", 404);
  }

  return opportunity;
}

export async function listMapPoints() {
  return findMapPoints();
}

export async function addOpportunity(body: unknown) {
  const input = parseCreateInput(body);
  await ensureOrganizationExists(input.organizationId);
  const opportunity = await createOpportunity(input);
  return getOpportunity(opportunity.id);
}

export async function editOpportunity(id: string, body: unknown) {
  const input = parseUpdateInput(body);

  if (input.organizationId) {
    await ensureOrganizationExists(input.organizationId);
  }

  const updated = await updateOpportunity(requireUuid(id), input);

  if (!updated) {
    throw new AppError("Oportunidad no encontrada", 404);
  }

  return getOpportunity(updated.id);
}

export async function removeOpportunity(id: string) {
  const deleted = await deleteOpportunity(requireUuid(id));

  if (!deleted) {
    throw new AppError("Oportunidad no encontrada", 404);
  }
}
