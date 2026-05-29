import {
  createOrganization,
  deleteOrganization,
  findAllOrganizations,
  findOrganizationById,
  updateOrganization,
} from "../models/organization.model.js";
import { findAllEvents } from "../models/event.model.js";
import { findAllOpportunities } from "../models/opportunity.model.js";
import type {
  CreateOrganizationInput,
  OrganizationFilters,
  UpdateOrganizationInput,
} from "../types/organization.js";
import { AppError } from "../utils/errors.js";
import {
  optionalNumber,
  optionalString,
  requireNonEmpty,
  requireUuid,
} from "../utils/validation.js";

function parseFilters(query: Record<string, unknown>): OrganizationFilters {
  return {
    category: optionalString(query.category) ?? undefined,
    search: optionalString(query.search) ?? undefined,
  };
}

function parseCreateInput(body: unknown): CreateOrganizationInput {
  const data = body as CreateOrganizationInput;

  return {
    name: requireNonEmpty(data.name, "El nombre"),
    description: requireNonEmpty(data.description, "La descripción"),
    logoUrl: optionalString(data.logoUrl),
    website: optionalString(data.website),
    instagram: optionalString(data.instagram),
    email: optionalString(data.email),
    location: optionalString(data.location),
    category: optionalString(data.category),
    latitude: optionalNumber(data.latitude),
    longitude: optionalNumber(data.longitude),
  };
}

function parseUpdateInput(body: unknown): UpdateOrganizationInput {
  const data = body as UpdateOrganizationInput;

  return {
    name: data.name ? requireNonEmpty(data.name, "El nombre") : undefined,
    description: data.description
      ? requireNonEmpty(data.description, "La descripción")
      : undefined,
    logoUrl: data.logoUrl !== undefined ? optionalString(data.logoUrl) : undefined,
    website: data.website !== undefined ? optionalString(data.website) : undefined,
    instagram: data.instagram !== undefined ? optionalString(data.instagram) : undefined,
    email: data.email !== undefined ? optionalString(data.email) : undefined,
    location: data.location !== undefined ? optionalString(data.location) : undefined,
    category: data.category !== undefined ? optionalString(data.category) : undefined,
    latitude: data.latitude !== undefined ? optionalNumber(data.latitude) : undefined,
    longitude: data.longitude !== undefined ? optionalNumber(data.longitude) : undefined,
  };
}

export async function listOrganizations(query: Record<string, unknown>) {
  return findAllOrganizations(parseFilters(query));
}

export async function getOrganization(id: string) {
  const organization = await findOrganizationById(requireUuid(id));

  if (!organization) {
    throw new AppError("Organización no encontrada", 404);
  }

  const [opportunities, events] = await Promise.all([
    findAllOpportunities({ organizationId: organization.id }),
    findAllEvents({ organizationId: organization.id }),
  ]);

  return { ...organization, opportunities, events };
}

export async function addOrganization(body: unknown) {
  return createOrganization(parseCreateInput(body));
}

export async function editOrganization(id: string, body: unknown) {
  const organization = await updateOrganization(requireUuid(id), parseUpdateInput(body));

  if (!organization) {
    throw new AppError("Organización no encontrada", 404);
  }

  return organization;
}

export async function removeOrganization(id: string) {
  const deleted = await deleteOrganization(requireUuid(id));

  if (!deleted) {
    throw new AppError("Organización no encontrada", 404);
  }
}
