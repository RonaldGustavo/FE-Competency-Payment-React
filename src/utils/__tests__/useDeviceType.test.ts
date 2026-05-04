import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDeviceType from '../useDeviceType';

vi.mock('@chakra-ui/react', () => ({
  useMediaQuery: vi.fn((queries: string[]) => {
    // simulate desktop: semua query false
    return queries.map(() => false);
  }),
}));

describe('useDeviceType', () => {
  it('returns isMobile and isTab as boolean', () => {
    const { result } = renderHook(() => useDeviceType());
    expect(typeof result.current.isMobile).toBe('boolean');
    expect(typeof result.current.isTab).toBe('boolean');
  });

  it('returns false for both on desktop', () => {
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTab).toBe(false);
  });

  it('returns true for isMobile on mobile viewport', async () => {
    const { useMediaQuery } = await import('@chakra-ui/react');
    vi.mocked(useMediaQuery).mockImplementation((queries: string[]) =>
      queries.map((q) => q.includes('768px') ? true : false)
    );
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTab).toBe(false);
  });
});
