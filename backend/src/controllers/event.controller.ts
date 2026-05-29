import type { Request, Response } from "express";
import {
  addEvent,
  editEvent,
  getEvent,
  listEvents,
  removeEvent,
} from "../services/event.service.js";
import { getRouteParam } from "../utils/params.js";

export async function list(req: Request, res: Response) {
  const events = await listEvents(req.query);
  res.json({ events });
}

export async function getById(req: Request, res: Response) {
  const event = await getEvent(getRouteParam(req.params.id));
  res.json({ event });
}

export async function create(req: Request, res: Response) {
  const event = await addEvent(req.body);
  res.status(201).json({ event });
}

export async function update(req: Request, res: Response) {
  const event = await editEvent(getRouteParam(req.params.id), req.body);
  res.json({ event });
}

export async function remove(req: Request, res: Response) {
  await removeEvent(getRouteParam(req.params.id));
  res.status(204).send();
}
