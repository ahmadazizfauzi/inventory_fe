import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from "axios";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return "http://localhost:8000/api";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const headers = config.headers as AxiosHeaders;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      if (!(config.data instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register") &&
          !window.location.pathname.startsWith("/ui-kit")
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
