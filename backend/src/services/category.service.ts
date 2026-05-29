import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  findCategoryByName,
  updateCategory,
} from "../models/category.model.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types/category.js";
import { AppError } from "../utils/errors.js";
import { optionalString, requireNonEmpty, requireUuid } from "../utils/validation.js";

function parseCreateInput(body: unknown): CreateCategoryInput {
  const data = body as CreateCategoryInput;

  return {
    name: requireNonEmpty(data.name, "El nombre"),
    icon: optionalString(data.icon),
  };
}

function parseUpdateInput(body: unknown): UpdateCategoryInput {
  const data = body as UpdateCategoryInput;

  return {
    name: data.name ? requireNonEmpty(data.name, "El nombre") : undefined,
    icon: data.icon !== undefined ? optionalString(data.icon) : undefined,
  };
}

export async function listCategories() {
  return findAllCategories();
}

export async function getCategory(id: string) {
  const category = await findCategoryById(requireUuid(id));

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  return category;
}

export async function addCategory(body: unknown) {
  const input = parseCreateInput(body);
  const existing = await findCategoryByName(input.name);

  if (existing) {
    throw new AppError("Ya existe una categoría con ese nombre", 409);
  }

  return createCategory(input);
}

export async function editCategory(id: string, body: unknown) {
  const category = await updateCategory(requireUuid(id), parseUpdateInput(body));

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  return category;
}

export async function removeCategory(id: string) {
  const deleted = await deleteCategory(requireUuid(id));

  if (!deleted) {
    throw new AppError("Categoría no encontrada", 404);
  }
}
