export interface Category {
  id: string;
  name: string;
  icon: string | null;
}

export interface CreateCategoryInput {
  name: string;
  icon?: string | null;
}
