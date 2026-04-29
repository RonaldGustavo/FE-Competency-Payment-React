import type { AuthResponse, AuthUser } from '../interface/auth';

export const isUserLike = (value: unknown): value is AuthUser =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'name' in value &&
      typeof (value as AuthUser).name === 'string',
  );

export const normalizeAuthResponse = (response: AuthResponse) => ({
  token:
    response.token ??
    response.accessToken ??
    response.data?.token ??
    response.data?.accessToken ??
    '',
  user:
    response.user ??
    response.data?.user ??
    (isUserLike(response.data) ? response.data : undefined),
});

export const normalizeAuthUser = (
  response: AuthResponse | AuthUser,
): AuthUser | undefined => {
  if (isUserLike(response)) return response;

  return normalizeAuthResponse(response).user;
};
