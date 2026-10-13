import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import {
  ICategoryItem,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "../types/category.types";

export const getCategories = async (params?: { search?: string; start_date?: string; end_date?: string }) => {
  try {
    const cleanParams: Record<string, string> = {};
    if (params?.search && params.search.trim() !== "") cleanParams.search = params.search.trim();
    if (params?.start_date) cleanParams.start_date = params.start_date;
    if (params?.end_date) cleanParams.end_date = params.end_date;

    const res = await axiosInstance.get("/categories", { params: cleanParams });
    return {
      status: true,
      data: (res.data.data || []) as ICategoryItem[],
      message: res.data.message || "Data kategori berhasil dimuat",
    };
  } catch (err: unknown) {
    let message = "Gagal memuat kategori";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message, data: [] as ICategoryItem[] };
  }
};

export const getCategoryById = async (id: number | string) => {
  try {
    const res = await axiosInstance.get(`/categories/${id}`);
    return {
      status: true,
      data: res.data.data as ICategoryItem,
      message: res.data.message || "Data kategori berhasil dimuat",
    };
  } catch (err: unknown) {
    let message = "Gagal memuat detail kategori";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};

export const createCategory = async (payload: ICreateCategoryPayload) => {
  try {
    const res = await axiosInstance.post("/categories", payload);
    return {
      status: true,
      data: res.data.data as ICategoryItem,
      message: res.data.message || "Kategori berhasil ditambahkan",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal menambahkan kategori",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const updateCategory = async (
  id: number | string,
  payload: IUpdateCategoryPayload
) => {
  try {
    const res = await axiosInstance.put(`/categories/${id}`, payload);
    return {
      status: true,
      data: res.data.data as ICategoryItem,
      message: res.data.message || "Kategori berhasil diperbarui",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal memperbarui kategori",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const deleteCategory = async (id: number | string) => {
  try {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return {
      status: true,
      message: res.data.message || "Kategori berhasil dihapus",
    };
  } catch (err: unknown) {
    let message = "Gagal menghapus kategori";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};
