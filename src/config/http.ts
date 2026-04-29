import axios from 'axios';
import { getAuthToken } from '../utils/authToken';

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_TIMEOUT = 15000;

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
