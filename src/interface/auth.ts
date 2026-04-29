export interface AuthUser {
  id?: string | number;
  name: string;
  email?: string;
  role: string;
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

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  data?: Partial<AuthUser> & {
    token?: string;
    accessToken?: string;
    user?: AuthUser;
  };
}

export interface ApiErrorResponse {
  system_message?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
}
