import { deleteCookie, getCookie, setCookie } from './cookieHelper';

export const AUTH_TOKEN_KEY = 'auth-token';

export const getAuthToken = () => getCookie(AUTH_TOKEN_KEY);

export const saveAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_KEY, token, 7);
};

export const clearAuthSession = () => {
  deleteCookie(AUTH_TOKEN_KEY);
  localStorage.clear();
};
