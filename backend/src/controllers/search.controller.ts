import type { Request, Response } from "express";
import { globalSearch } from "../services/search.service.js";

export async function search(req: Request, res: Response) {
  const result = await globalSearch(req.query);
  res.json(result);
}
