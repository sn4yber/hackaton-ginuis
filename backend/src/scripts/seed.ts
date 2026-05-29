import bcrypt from "bcryptjs";
import "dotenv/config";
import {
  SEED_ADMIN,
  SEED_CATEGORIES,
  SEED_EVENTS,
  SEED_OPPORTUNITIES,
  SEED_ORGANIZATIONS,
} from "../data/seed.js";
import { closePool, getPool } from "../lib/db.js";
import { createCategory, findCategoryByName } from "../models/category.model.js";
import { createEvent } from "../models/event.model.js";
import { createOpportunity } from "../models/opportunity.model.js";
import {
  createOrganization,
  findOrganizationByName,
} from "../models/organization.model.js";
import { createUser, findUserByEmail } from "../models/user.model.js";

async function seedCategories() {
  for (const category of SEED_CATEGORIES) {
    const existing = await findCategoryByName(category.name);
    if (!existing) {
      await createCategory(category);
      console.log(`Categoría creada: ${category.name}`);
    }
  }
}

async function seedOrganizations() {
  const organizationIds = new Map<string, string>();

  for (const organization of SEED_ORGANIZATIONS) {
    const existing = await findOrganizationByName(organization.name);

    if (existing) {
      organizationIds.set(organization.slug, existing.id);
      continue;
    }

    const created = await createOrganization({
      name: organization.name,
      description: organization.description,
      email: organization.email,
      website: "website" in organization ? organization.website : null,
      instagram: "instagram" in organization ? organization.instagram : null,
      location: organization.location,
      category: organization.category,
      latitude: organization.latitude,
      longitude: organization.longitude,
    });

    organizationIds.set(organization.slug, created.id);
    console.log(`Organización creada: ${organization.name}`);
  }

  return organizationIds;
}

async function seedOpportunities(organizationIds: Map<string, string>) {
  for (const opportunity of SEED_OPPORTUNITIES) {
    const organizationId = organizationIds.get(opportunity.orgSlug);
    if (!organizationId) continue;

    const existing = await getPool().query(
      "SELECT 1 FROM opportunities WHERE title = $1 AND organization_id = $2",
      [opportunity.title, organizationId]
    );

    if ((existing.rowCount ?? 0) > 0) continue;

    await createOpportunity({
      title: opportunity.title,
      description: opportunity.description,
      category: opportunity.category,
      organizationId,
      location: opportunity.location,
      latitude: opportunity.latitude,
      longitude: opportunity.longitude,
      type: opportunity.type,
      link: "link" in opportunity ? opportunity.link : null,
    });

    console.log(`Oportunidad creada: ${opportunity.title}`);
  }
}

async function seedEvents(organizationIds: Map<string, string>) {
  for (const event of SEED_EVENTS) {
    const organizationId = organizationIds.get(event.orgSlug);
    if (!organizationId) continue;

    const existing = await getPool().query(
      "SELECT 1 FROM events WHERE title = $1 AND organization_id = $2",
      [event.title, organizationId]
    );

    if ((existing.rowCount ?? 0) > 0) continue;

    await createEvent({
      title: event.title,
      description: event.description,
      organizationId,
      location: event.location,
      date: new Date(event.date),
      latitude: event.latitude,
      longitude: event.longitude,
    });

    console.log(`Evento creado: ${event.title}`);
  }
}

async function seedAdmin() {
  const existing = await findUserByEmail(SEED_ADMIN.email);
  if (existing) {
    console.log("Admin demo ya existe");
    return;
  }

  const passwordHash = await bcrypt.hash(SEED_ADMIN.password, 10);
  await createUser({
    name: SEED_ADMIN.name,
    email: SEED_ADMIN.email,
    passwordHash,
    role: SEED_ADMIN.role,
    city: SEED_ADMIN.city,
    interests: [...SEED_ADMIN.interests],
  });

  console.log(`Admin demo creado: ${SEED_ADMIN.email}`);
}

async function main() {
  await seedCategories();
  const organizationIds = await seedOrganizations();
  await seedOpportunities(organizationIds);
  await seedEvents(organizationIds);
  await seedAdmin();
  console.log("Seed completado");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
