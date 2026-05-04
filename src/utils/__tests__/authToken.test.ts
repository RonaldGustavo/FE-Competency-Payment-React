import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAuthToken, saveAuthToken, clearAuthSession, AUTH_TOKEN_KEY } from '../authToken';
import * as cookieHelper from '../cookieHelper';

beforeEach(() => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  });
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('saveAuthToken & getAuthToken', () => {
  it('saves and retrieves auth token from cookie', () => {
    saveAuthToken('my-jwt-token');
    expect(getAuthToken()).toBe('my-jwt-token');
  });

  it('returns empty string when no token is saved', () => {
    expect(getAuthToken()).toBe('');
  });
});

describe('clearAuthSession', () => {
  it('removes auth token cookie and clears localStorage', () => {
    saveAuthToken('some-token');
    localStorage.setItem('user', 'ronald');

    clearAuthSession();

    expect(getAuthToken()).toBe('');
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('uses AUTH_TOKEN_KEY constant', () => {
    expect(AUTH_TOKEN_KEY).toBe('auth-token');
    const spy = vi.spyOn(cookieHelper, 'deleteCookie');
    clearAuthSession();
    expect(spy).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
  });
});
