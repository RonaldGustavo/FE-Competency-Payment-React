import { describe, it, expect } from 'vitest';
import refundReducer, {
  setRefundLoading,
  setRefundList,
  setRefundPage,
  setRefundPerPage,
  setRefundSearch,
  setRefundStatusFilter,
} from '../RefundSlice';

const initialState = {
  refunds: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  statusFilter: '',
  isLoading: false,
};

describe('refundSlice', () => {
  it('setRefundLoading updates loading state', () => {
    const state = refundReducer(initialState, setRefundLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('setRefundList updates refunds, total, and totalPages', () => {
    const payload = { refunds: [{ id: 'REF-001' } as any], total: 3, totalPages: 1 };
    const state = refundReducer(initialState, setRefundList(payload));
    expect(state.refunds).toHaveLength(1);
    expect(state.total).toBe(3);
  });

  it('setRefundPage updates page', () => {
    const state = refundReducer(initialState, setRefundPage(2));
    expect(state.page).toBe(2);
  });

  it('setRefundPerPage resets page to 1', () => {
    const state = refundReducer({ ...initialState, page: 4 }, setRefundPerPage(5));
    expect(state.perPage).toBe(5);
    expect(state.page).toBe(1);
  });

  it('setRefundSearch resets page to 1', () => {
    const state = refundReducer({ ...initialState, page: 2 }, setRefundSearch('REF'));
    expect(state.search).toBe('REF');
    expect(state.page).toBe(1);
  });

  it('setRefundStatusFilter resets page to 1', () => {
    const state = refundReducer({ ...initialState, page: 3 }, setRefundStatusFilter('APPROVED'));
    expect(state.statusFilter).toBe('APPROVED');
    expect(state.page).toBe(1);
  });
});
