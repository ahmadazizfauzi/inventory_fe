export interface ICategory {
  id: number;
  name: string;
  description?: string | null;
  products_count?: number;
}

export interface IProduct {
  id: number;
  category_id: number;
  category?: ICategory;
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  min_stock: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  created_at?: string;
  updated_at?: string;
}

export interface IPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export interface IProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number | string;
  stock_status?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  sort_by?: "created_at" | "name" | "sku" | "stock" | "purchase_price" | "selling_price";
  sort_order?: "asc" | "desc";
}

export interface IProductPayload {
  category_id: number;
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  stock?: number;
  min_stock?: number;
}
