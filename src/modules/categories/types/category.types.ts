export interface ICategoryItem {
  id: number;
  name: string;
  description?: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateCategoryPayload {
  name: string;
  description?: string;
}

export interface IUpdateCategoryPayload {
  name: string;
  description?: string;
}
