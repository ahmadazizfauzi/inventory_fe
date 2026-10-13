export interface IUserItem {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "staff";
  created_at?: string;
  updated_at?: string;
}

export interface IUsersResponse {
  data: IUserItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "superadmin" | "admin" | "staff";
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: "superadmin" | "admin" | "staff";
}
