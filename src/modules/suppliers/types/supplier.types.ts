export interface ISupplierItem {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateSupplierPayload {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface IUpdateSupplierPayload {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}
