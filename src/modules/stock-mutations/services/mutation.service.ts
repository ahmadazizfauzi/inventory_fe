import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import {
  ICreateMutationPayload,
  IGetMutationsResult,
  IStockMutationItem,
} from "../types/mutation.types";

export const getStockMutations = async (
  page = 1,
  perPage = 10,
  productId?: number | string,
  startDate?: string,
  endDate?: string
): Promise<IGetMutationsResult> => {
  try {
    const params: Record<string, any> = { page, per_page: perPage };
    if (productId && productId !== "all") {
      params.product_id = productId;
    }
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await axiosInstance.get("/stock-mutations", { params });
    const responseData = response.data;

    return {
      status: true,
      data: (responseData.data || []) as IStockMutationItem[],
      pagination: responseData.pagination || {
        current_page: 1,
        per_page: perPage,
        total: 0,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
      message: responseData.message || "Riwayat mutasi stok berhasil dimuat",
    };
  } catch (error) {
    return {
      status: false,
      data: [],
      pagination: {
        current_page: 1,
        per_page: perPage,
        total: 0,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
      message: error instanceof AxiosError ? error.response?.data?.message : "Gagal memuat mutasi stok",
    };
  }
};

export const createStockMutation = async (payload: ICreateMutationPayload) => {
  try {
    const response = await axiosInstance.post("/stock-mutations", payload);
    return {
      status: true,
      data: response.data.data as IStockMutationItem,
      message: response.data.message || "Mutasi stok berhasil dicatat",
    };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return {
        status: false,
        message: err.response?.data?.message || "Gagal mencatat mutasi stok",
        errors: err.response?.data?.errors as Record<string, string[]> | undefined,
      };
    }
    return { status: false, message: "Terjadi kesalahan jaringan" };
  }
};
