import axios from 'axios';
import type { ApiErrorResponse } from '../interface/auth';

export const API_STATUS_CODE = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
} as const;

export const getApiStatusCode = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return undefined;

  return error.response?.data?.status_code ?? error.response?.status;
};

export const isApiUnauthorizedError = (error: unknown) =>
  getApiStatusCode(error) === API_STATUS_CODE.UNAUTHORIZED;

export const getApiErrorMessage = (error: unknown) => {
  const fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.';

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  return error.response?.data?.system_message ?? fallbackMessage;
};
