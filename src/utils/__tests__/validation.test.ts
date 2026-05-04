import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isValidEmail, isFutureOrToday, formatRupiah, getNowDatetime, getTodayDate } from '../validation';

describe('isValidEmail', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('  user@domain.co.id  ')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('getTodayDate', () => {
  it('returns date in YYYY-MM-DD format', () => {
    const result = getTodayDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('isFutureOrToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15'));
  });

  it('returns true for today', () => {
    expect(isFutureOrToday('2025-06-15')).toBe(true);
  });

  it('returns true for future date', () => {
    expect(isFutureOrToday('2025-12-31')).toBe(true);
  });

  it('returns false for past date', () => {
    expect(isFutureOrToday('2025-01-01')).toBe(false);
  });
});

describe('formatRupiah', () => {
  it('formats number as IDR currency', () => {
    const result = formatRupiah(150000);
    expect(result).toContain('150.000');
    expect(result).toContain('Rp');
  });

  it('formats zero correctly', () => {
    const result = formatRupiah(0);
    expect(result).toContain('0');
  });
});

describe('getNowDatetime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T10:30:00'));
  });

  it('returns datetime in YYYY-MM-DDTHH:mm format', () => {
    const result = getNowDatetime();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(result).toBe('2025-06-15T10:30');
  });

  it('adds offset minutes correctly', () => {
    const result = getNowDatetime(30);
    expect(result).toBe('2025-06-15T11:00');
  });
});
