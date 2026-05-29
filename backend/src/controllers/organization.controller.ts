import type { Request, Response } from "express";
import {
  addOrganization,
  editOrganization,
  getOrganization,
  listOrganizations,
  removeOrganization,
} from "../services/organization.service.js";
import { getRouteParam } from "../utils/params.js";

export async function list(req: Request, res: Response) {
  const organizations = await listOrganizations(req.query);
  res.json({ organizations });
}

export async function getById(req: Request, res: Response) {
  const organization = await getOrganization(getRouteParam(req.params.id));
  res.json({ organization });
}

export async function create(req: Request, res: Response) {
  const organization = await addOrganization(req.body);
  res.status(201).json({ organization });
}

export async function update(req: Request, res: Response) {
  const organization = await editOrganization(getRouteParam(req.params.id), req.body);
  res.json({ organization });
}

export async function remove(req: Request, res: Response) {
  await removeOrganization(getRouteParam(req.params.id));
  res.status(204).send();
}
