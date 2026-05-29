import type { Request, Response } from "express";
import {
  addOpportunity,
  editOpportunity,
  getOpportunity,
  listMapPoints,
  listOpportunities,
  removeOpportunity,
} from "../services/opportunity.service.js";
import { getRouteParam } from "../utils/params.js";

export async function list(req: Request, res: Response) {
  const opportunities = await listOpportunities(req.query);
  res.json({ opportunities });
}

export async function getById(req: Request, res: Response) {
  const opportunity = await getOpportunity(getRouteParam(req.params.id));
  res.json({ opportunity });
}

export async function mapPoints(_req: Request, res: Response) {
  const points = await listMapPoints();
  res.json({ points });
}

export async function create(req: Request, res: Response) {
  const opportunity = await addOpportunity(req.body);
  res.status(201).json({ opportunity });
}

export async function update(req: Request, res: Response) {
  const opportunity = await editOpportunity(getRouteParam(req.params.id), req.body);
  res.json({ opportunity });
}

export async function remove(req: Request, res: Response) {
  await removeOpportunity(getRouteParam(req.params.id));
  res.status(204).send();
}
