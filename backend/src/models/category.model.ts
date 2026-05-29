import { getPool } from "../lib/db.js";
import {
  mapCategoryRow,
  type Category,
  type CategoryRow,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "../types/category.js";

const CATEGORY_COLUMNS = "id, name, icon";

export async function findAllCategories(): Promise<Category[]> {
  const result = await getPool().query<CategoryRow>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories ORDER BY name ASC`
  );

  return result.rows.map(mapCategoryRow);
}

export async function findCategoryById(id: string): Promise<Category | null> {
  const result = await getPool().query<CategoryRow>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE id = $1`,
    [id]
  );

  return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
}

export async function findCategoryByName(name: string): Promise<Category | null> {
  const result = await getPool().query<CategoryRow>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE LOWER(name) = LOWER($1)`,
    [name.trim()]
  );

  return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const result = await getPool().query<CategoryRow>(
    `INSERT INTO categories (name, icon)
     VALUES ($1, $2)
     RETURNING ${CATEGORY_COLUMNS}`,
    [input.name, input.icon ?? null]
  );

  return mapCategoryRow(result.rows[0]);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category | null> {
  const result = await getPool().query<CategoryRow>(
    `UPDATE categories
     SET
       name = COALESCE($2, name),
       icon = COALESCE($3, icon)
     WHERE id = $1
     RETURNING ${CATEGORY_COLUMNS}`,
    [id, input.name ?? null, input.icon ?? null]
  );

  return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await getPool().query("DELETE FROM categories WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
