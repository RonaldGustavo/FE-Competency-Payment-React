import { describe, it, expect } from 'vitest';
import dashboardReducer, { setDashboardLoading, setDashboardSummary } from '../DashboardSlice';
import type { DashboardSummary } from '../../../interface/dashboard';

const initialState = {
  summary: null,
  isLoading: false,
};

const mockSummary: DashboardSummary = {
  total_invoice: 10,
  total_paid: 5,
  total_failed: 2,
  total_expired: 1,
  total_paid_amount: '500000',
  total_refund_amount: '100000',
};

describe('dashboardSlice', () => {
  it('returns initial state', () => {
    const state = dashboardReducer(undefined, { type: '@@INIT' });
    expect(state.summary).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('setDashboardLoading sets isLoading to true', () => {
    const state = dashboardReducer(initialState, setDashboardLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('setDashboardLoading sets isLoading to false', () => {
    const state = dashboardReducer({ ...initialState, isLoading: true }, setDashboardLoading(false));
    expect(state.isLoading).toBe(false);
  });

  it('setDashboardSummary updates summary', () => {
    const state = dashboardReducer(initialState, setDashboardSummary(mockSummary));
    expect(state.summary).toEqual(mockSummary);
    expect(state.summary?.total_invoice).toBe(10);
    expect(state.summary?.total_paid_amount).toBe('500000');
  });
});
