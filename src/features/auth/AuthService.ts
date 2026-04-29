import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  SignUpPayload,
} from '../../interface/auth';

export const loginApi = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>(ApiEndpoint.auth.login, payload);
  return response.data;
};

export const signUpApi = async (payload: SignUpPayload) => {
  const response = await api.post<AuthResponse>(ApiEndpoint.auth.signup, payload);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get<AuthResponse | AuthUser>(
    ApiEndpoint.auth.profile,
  );
  return response.data;
};

export const logoutApi = async () => {
  await api.post(ApiEndpoint.auth.logout);
};
