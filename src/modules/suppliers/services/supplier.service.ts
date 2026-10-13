import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import {
  ISupplierItem,
  ICreateSupplierPayload,
  IUpdateSupplierPayload,
} from "../types/supplier.types";

export const getSuppliers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  all?: boolean;
}) => {
  try {
    const cleanParams: Record<string, any> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.per_page) cleanParams.per_page = params.per_page;
    if (params?.all) cleanParams.all = true;
    if (params?.search && params.search.trim() !== "") cleanParams.search = params.search.trim();
    if (params?.start_date) cleanParams.start_date = params.start_date;
    if (params?.end_date) cleanParams.end_date = params.end_date;

    const res = await axiosInstance.get("/suppliers", { params: cleanParams });
    return {
      status: true,
      data: (res.data.data || []) as ISupplierItem[],
      pagination: res.data.pagination || {
        current_page: 1,
        total_pages: 1,
        total: (res.data.data || []).length,
        per_page: 10,
      },
      message: res.data.message || "Data supplier berhasil dimuat",
    };
  } catch (err: unknown) {
    let message = "Gagal memuat supplier";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return {
      status: false,
      message,
      data: [] as ISupplierItem[],
      pagination: { current_page: 1, total_pages: 1, total: 0, per_page: 10 },
    };
  }
};

export const getSupplierById = async (id: number | string) => {
  try {
    const res = await axiosInstance.get(`/suppliers/${id}`);
    return {
      status: true,
      data: res.data.data as ISupplierItem,
      message: res.data.message || "Data supplier berhasil dimuat",
    };
  } catch (err: unknown) {
    let message = "Gagal memuat detail supplier";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};

export const createSupplier = async (payload: ICreateSupplierPayload) => {
  try {
    const res = await axiosInstance.post("/suppliers", payload);
    return {
      status: true,
      data: res.data.data as ISupplierItem,
      message: res.data.message || "Supplier berhasil ditambahkan",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal menambahkan supplier",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const updateSupplier = async (
  id: number | string,
  payload: IUpdateSupplierPayload
) => {
  try {
    const res = await axiosInstance.put(`/suppliers/${id}`, payload);
    return {
      status: true,
      data: res.data.data as ISupplierItem,
      message: res.data.message || "Supplier berhasil diperbarui",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal memperbarui supplier",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const deleteSupplier = async (id: number | string) => {
  try {
    const res = await axiosInstance.delete(`/suppliers/${id}`);
    return {
      status: true,
      message: res.data.message || "Supplier berhasil dihapus",
    };
  } catch (err: unknown) {
    let message = "Gagal menghapus supplier";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};
