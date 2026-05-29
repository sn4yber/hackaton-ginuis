import type { Request, Response } from "express";
import {
  addCategory,
  editCategory,
  getCategory,
  listCategories,
  removeCategory,
} from "../services/category.service.js";
import { getRouteParam } from "../utils/params.js";

export async function list(req: Request, res: Response) {
  const categories = await listCategories();
  res.json({ categories });
}

export async function getById(req: Request, res: Response) {
  const category = await getCategory(getRouteParam(req.params.id));
  res.json({ category });
}

export async function create(req: Request, res: Response) {
  const category = await addCategory(req.body);
  res.status(201).json({ category });
}

export async function update(req: Request, res: Response) {
  const category = await editCategory(getRouteParam(req.params.id), req.body);
  res.json({ category });
}

export async function remove(req: Request, res: Response) {
  await removeCategory(getRouteParam(req.params.id));
  res.status(204).send();
}
