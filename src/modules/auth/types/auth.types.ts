export type UserRole = "superadmin" | "admin" | "staff";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: UserRole | string;
  created_at?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface IAuthData {
  user: IUser;
  token: string;
}

export interface IApiResponse<T = unknown> {
  status_code: number;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}
