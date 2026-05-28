import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { getApiErrorMessage, getApiStatusCode, isApiUnauthorizedError, API_STATUS_CODE } from '../apiError';

const makeAxiosError = (statusCode: number, systemMessage?: string) => {
  const error = new axios.AxiosError('Request failed');
  error.response = {
    data: { status_code: statusCode, system_message: systemMessage },
    status: statusCode,
    statusText: '',
    headers: {},
    config: {} as any,
  };
  return error;
};

describe('getApiErrorMessage', () => {

  it('returns fallback when no system_message', () => {
    const error = makeAxiosError(500);
    expect(getApiErrorMessage(error)).toBe('Terjadi kesalahan. Silakan coba lagi.');
  });

  it('returns error.message for non-axios Error', () => {
    const error = new Error('Network error');
    expect(getApiErrorMessage(error)).toBe('Network error');
  });

  it('returns fallback for unknown error type', () => {
    expect(getApiErrorMessage('unknown')).toBe('Terjadi kesalahan. Silakan coba lagi.');
    expect(getApiErrorMessage(null)).toBe('Terjadi kesalahan. Silakan coba lagi.');
  });

  it('returns system_message from axios error response', () => {
    const error = makeAxiosError(400, 'Email sudah terdaftar');
    expect(getApiErrorMessage(error)).toBe('Email sudah terdaftar');
  });
});

describe('getApiStatusCode', () => {
  it('returns status_code from response data', () => {
    const error = makeAxiosError(400);
    expect(getApiStatusCode(error)).toBe(400);
  });

  it('returns undefined for non-axios error', () => {
    expect(getApiStatusCode(new Error('err'))).toBeUndefined();
  });
});

describe('isApiUnauthorizedError', () => {
  it('returns true for 401 error', () => {
    const error = makeAxiosError(401);
    expect(isApiUnauthorizedError(error)).toBe(true);
  });

  it('returns false for non-401 error', () => {
    expect(isApiUnauthorizedError(makeAxiosError(400))).toBe(false);
    expect(isApiUnauthorizedError(makeAxiosError(500))).toBe(false);
  });
});

describe('API_STATUS_CODE', () => {
  it('has correct constant values', () => {
    expect(API_STATUS_CODE.VALIDATION_ERROR).toBe(400);
    expect(API_STATUS_CODE.UNAUTHORIZED).toBe(401);
  });
});
