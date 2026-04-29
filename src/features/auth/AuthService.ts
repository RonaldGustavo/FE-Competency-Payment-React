import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type {
  LoginResponse,
  LoginPayload,
  ProfileResponse,
  SignUpPayload,
} from '../../interface/auth';

export const loginApi = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>(ApiEndpoint.auth.login, payload);
  return response.data.data.token;
};

export const signUpApi = async (payload: SignUpPayload) => {
  await api.post(ApiEndpoint.auth.signup, payload);
};

export const getProfileApi = async () => {
  const response = await api.get<ProfileResponse>(ApiEndpoint.auth.profile);
  return response.data.data.user;
};

export const logoutApi = async () => {
  await api.post(ApiEndpoint.auth.logout);
};
