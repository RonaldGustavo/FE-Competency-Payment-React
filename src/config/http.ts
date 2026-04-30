import axios from 'axios';
import { store } from './store';
import { logout } from '../features/auth/AuthSlice';
import { clearAuthSession, getAuthToken } from '../utils/authToken';
import { isApiUnauthorizedError } from '../utils/apiError';

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_TIMEOUT = 15000;
let isHandlingUnauthorized = false;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasAuthSession =
      Boolean(getAuthToken()) || store.getState().auth.isAuthenticated;

    if (isApiUnauthorizedError(error) && hasAuthSession && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      clearAuthSession();
      store.dispatch(logout());
      isHandlingUnauthorized = false;
    }

    return Promise.reject(error);
  },
);
