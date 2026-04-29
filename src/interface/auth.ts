export interface AuthUser {
  id?: string | number;
  name: string;
  email?: string;
  role: string;
}

export interface ApiResponse<T> {
  status_code: number;
  data: T;
  system_message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  token: string;
  token_type?: string;
  expires_in?: string;
}>;

export type ProfileResponse = ApiResponse<{
  user: AuthUser;
}>;

export type ApiErrorResponse = ApiResponse<null> & {
  system_message: string;
};
