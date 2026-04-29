import axios from 'axios';
import type { ApiErrorResponse } from '../interface/auth';

export const getApiErrorMessage = (error: unknown) => {
  const fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.';

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  return error.response?.data?.system_message ?? fallbackMessage;
};
