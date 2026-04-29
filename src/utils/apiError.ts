import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../interface/auth';

export const getApiErrorMessage = (error: unknown) => {
  const fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.';

  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;
  const responseData = axiosError.response?.data;

  if (responseData?.system_message) return responseData.system_message;
  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;

  if (responseData?.errors) {
    const firstError = Object.values(responseData.errors)[0];
    if (Array.isArray(firstError)) return firstError[0] ?? fallbackMessage;
    if (typeof firstError === 'string') return firstError;
  }

  return axiosError.message || fallbackMessage;
};
