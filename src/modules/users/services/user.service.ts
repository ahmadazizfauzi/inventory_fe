import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { IUserItem, ICreateUserPayload, IUpdateUserPayload } from "../types/user.types";

export const getUsers = async (page = 1, perPage = 10) => {
  try {
    const res = await axiosInstance.get(`/users?page=${page}&per_page=${perPage}`);
    return {
      status: true,
      data: (res.data.data || []) as IUserItem[],
      pagination: res.data.pagination,
      meta: res.data.pagination,
    };
  } catch (err: unknown) {
    let message = "Gagal memuat data pengguna";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message, data: [] as IUserItem[] };
  }
};

export const getUserById = async (id: number | string) => {
  try {
    const res = await axiosInstance.get(`/users/${id}`);
    return {
      status: true,
      data: res.data.data as IUserItem,
    };
  } catch (err: unknown) {
    let message = "Gagal memuat detail pengguna";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};

export const createUser = async (payload: ICreateUserPayload) => {
  try {
    const res = await axiosInstance.post("/users", payload);
    return {
      status: true,
      data: res.data.data as IUserItem,
      message: res.data.message || "Pengguna berhasil ditambahkan",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal menambahkan pengguna",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const updateUser = async (id: number, payload: IUpdateUserPayload) => {
  try {
    const res = await axiosInstance.put(`/users/${id}`, payload);
    return {
      status: true,
      data: res.data.data as IUserItem,
      message: res.data.message || "Pengguna berhasil diperbarui",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal memperbarui pengguna",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/users/${id}`);
    return {
      status: true,
      message: res.data.message || "Pengguna berhasil dihapus",
    };
  } catch (err: unknown) {
    let message = "Gagal menghapus pengguna";
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message;
    }
    return { status: false, message };
  }
};
