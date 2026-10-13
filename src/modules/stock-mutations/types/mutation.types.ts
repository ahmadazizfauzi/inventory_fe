import { IProduct, IPaginationMeta } from "@/modules/products/types/product.types";
import { ISupplierItem } from "@/modules/suppliers/types/supplier.types";

export interface IStockMutationItem {
  id: number;
  product_id: number;
  product?: IProduct;
  user_id: number;
  user?: {
    id: number;
    name: string;
    role: string;
  };
  supplier_id?: number | null;
  supplier?: ISupplierItem | null;
  type: "in" | "out";
  quantity: number;
  stock_before: number;
  stock_after: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateMutationPayload {
  product_id: number;
  supplier_id?: number | null;
  type: "in" | "out";
  quantity: number;
  notes?: string;
}

export interface IGetMutationsResult {
  status: boolean;
  data: IStockMutationItem[];
  pagination: IPaginationMeta;
  message?: string;
}
