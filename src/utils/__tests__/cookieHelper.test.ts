import { describe, it, expect, beforeEach } from 'vitest';
import { getCookie, setCookie, deleteCookie } from '../cookieHelper';

beforeEach(() => {
  // bersihkan semua cookie sebelum setiap test
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  });
});

describe('setCookie & getCookie', () => {
  it('sets and gets a cookie', () => {
    setCookie('test-key', 'hello', 1);
    expect(getCookie('test-key')).toBe('hello');
  });

  it('returns empty string when cookie does not exist', () => {
    expect(getCookie('non-existent')).toBe('');
  });
});

describe('deleteCookie', () => {
  it('deletes an existing cookie', () => {
    setCookie('to-delete', 'value', 1);
    expect(getCookie('to-delete')).toBe('value');
    deleteCookie('to-delete');
    expect(getCookie('to-delete')).toBe('');
  });
});
