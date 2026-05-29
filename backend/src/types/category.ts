export interface Category {
  id: string;
  name: string;
  icon: string | null;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string | null;
}

export interface CreateCategoryInput {
  name: string;
  icon?: string | null;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
  };
}
