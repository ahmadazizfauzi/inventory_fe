import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import {
  IProduct,
  ICategory,
  IProductQueryParams,
  IProductPayload,
  IPaginationMeta,
} from "../types/product.types";

export interface IGetProductsResult {
  status: boolean;
  data: IProduct[];
  pagination: IPaginationMeta;
  message?: string;
}

export const getProducts = async (
  params?: IProductQueryParams
): Promise<IGetProductsResult> => {
  try {
    const cleanParams: Record<string, any> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.per_page) cleanParams.per_page = params.per_page;
    if (params?.search && params.search.trim() !== "") cleanParams.search = params.search.trim();
    if (params?.category_id && params.category_id !== "all" && params.category_id !== "") {
      cleanParams.category_id = params.category_id;
    }
    if (params?.stock_status && params.stock_status !== "all") {
      cleanParams.stock_status = params.stock_status;
    }
    if (params?.sort_by) cleanParams.sort_by = params.sort_by;
    if (params?.sort_order) cleanParams.sort_order = params.sort_order;
    if (params?.start_date) cleanParams.start_date = params.start_date;
    if (params?.end_date) cleanParams.end_date = params.end_date;

    const response = await axiosInstance.get("/products", { params: cleanParams });
    const responseData = response.data;

    return {
      status: true,
      data: responseData.data || [],
      pagination: responseData.pagination || {
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
      message: responseData.message,
    };
  } catch (error) {
    return {
      status: false,
      data: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
      message: error instanceof AxiosError ? error.response?.data?.message : "Gagal memuat produk",
    };
  }
};

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const getProductById = async (
  id: number
): Promise<{ status: boolean; data?: IProduct; message?: string }> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return {
      status: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal mengambil data produk",
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const createProduct = async (
  payload: IProductPayload
): Promise<{ status: boolean; data?: IProduct; message: string; errors?: Record<string, string[]> }> => {
  try {
    const response = await axiosInstance.post("/products", payload);
    return {
      status: true,
      data: response.data.data,
      message: response.data.message || "Produk berhasil ditambahkan",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal menambahkan produk",
        errors: err.response?.data?.errors,
      };
    }
    return { status: false, message: "Terjadi kesalahan jaringan" };
  }
};

export const updateProduct = async (
  id: number,
  payload: Partial<IProductPayload>
): Promise<{ status: boolean; data?: IProduct; message: string; errors?: Record<string, string[]> }> => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, payload);
    return {
      status: true,
      data: response.data.data,
      message: response.data.message || "Produk berhasil diperbarui",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal memperbarui produk",
        errors: err.response?.data?.errors,
      };
    }
    return { status: false, message: "Terjadi kesalahan jaringan" };
  }
};

export const deleteProduct = async (
  id: number
): Promise<{ status: boolean; message: string }> => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return {
      status: true,
      message: response.data.message || "Produk berhasil dihapus",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal menghapus produk",
      };
    }
    return { status: false, message: "Terjadi kesalahan jaringan" };
  }
};
