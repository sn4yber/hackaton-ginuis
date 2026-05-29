import { apiFetch } from "@/lib/api";
import type { Category, CreateCategoryInput } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const data = await apiFetch<{ categories: Category[] }>("/api/categories");
  return data.categories;
}

export async function fetchCategory(id: string): Promise<Category> {
  const data = await apiFetch<{ category: Category }>(`/api/categories/${id}`);
  return data.category;
}

export async function createCategory(
  token: string,
  input: CreateCategoryInput
): Promise<Category> {
  const data = await apiFetch<{ category: Category }>("/api/categories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return data.category;
}

export async function updateCategory(
  token: string,
  id: string,
  input: Partial<CreateCategoryInput>
): Promise<Category> {
  const data = await apiFetch<{ category: Category }>(`/api/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
  return data.category;
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  await apiFetch(`/api/categories/${id}`, { method: "DELETE", token });
}
