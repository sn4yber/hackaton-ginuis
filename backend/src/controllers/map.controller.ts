import type { Request, Response } from "express";
import { getAllMapPoints } from "../services/map.service.js";

export async function list(_req: Request, res: Response) {
  const points = await getAllMapPoints();
  res.json({ points });
}
