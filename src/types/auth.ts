export interface User {
  id?: string;
  email: string;
  username: string;
  company_id?: number | null;
  conpany_name?: string | null;
  group: Role;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type Role = "Admin" | "Manager" | "Employee";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthToken {
  refresh: string;
  access: string;
}
