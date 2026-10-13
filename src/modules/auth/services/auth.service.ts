import axiosInstance from "@/lib/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { IAuthData, IApiResponse, ILoginPayload, IRegisterPayload, IUser } from "../types/auth.types";

export const login = async (payload: ILoginPayload) => {
  try {
    const response: AxiosResponse<IApiResponse<IAuthData>> = await axiosInstance.post("/login", payload);
    if (response.data.status_code === 200 && response.data.data) {
      const { token, user } = response.data.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
      return { status: true, data: { token, user }, message: response.data.message || "Login berhasil" };
    }
    return { status: false, message: response.data.message || "Login gagal" };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors as Record<string, string[]> | undefined;
      return {
        status: false,
        message: serverMessage || "Email atau password salah",
        errors: validationErrors,
      };
    }
    return { status: false, message: "Gagal terhubung ke server backend (port 8000)" };
  }
};

export const register = async (payload: IRegisterPayload) => {
  try {
    const response: AxiosResponse<IApiResponse<IAuthData>> = await axiosInstance.post("/register", payload);
    if ((response.data.status_code === 200 || response.data.status_code === 201) && response.data.data) {
      const { token, user } = response.data.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
      return { status: true, data: { token, user }, message: response.data.message || "Registrasi berhasil" };
    }
    return { status: false, message: response.data.message || "Registrasi gagal" };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors as Record<string, string[]> | undefined;
      return {
        status: false,
        message: serverMessage || "Validasi pendaftaran gagal",
        errors: validationErrors,
      };
    }
    return { status: false, message: "Gagal terhubung ke server backend (port 8000)" };
  }
};

export const getMe = async (): Promise<{ status: boolean; user?: IUser; message: string }> => {
  try {
    const response: AxiosResponse<IApiResponse<IUser>> = await axiosInstance.get("/me");
    if (response.data.status_code === 200 && response.data.data) {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(response.data.data));
      }
      return { status: true, user: response.data.data, message: "Sesi valid" };
    }
    return { status: false, message: "Gagal memverifikasi sesi pengguna" };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return { status: false, message: err.response?.data?.message || "Sesi telah kedaluwarsa" };
    }
    return { status: false, message: "Terjadi kesalahan koneksi ke server" };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/logout");
  } catch {
    // Abaikan jika token sudah tidak valid di server
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
  }
};

// Aliases for compatibility
export const loginAction = login;
export const registerAction = register;
export const getMeAction = getMe;
export const logoutAction = logout;
