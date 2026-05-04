import { describe, it, expect } from 'vitest';
import walletReducer, {
  setWalletBalance,
  setWalletLoading,
  setTopUpList,
  setWalletPage,
  setWalletPerPage,
  setWalletSearch,
} from '../WalletSlice';

const initialState = {
  walletBalance: 0,
  topUps: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  isLoading: false,
};

describe('walletSlice', () => {
  it('setWalletBalance updates balance', () => {
    const state = walletReducer(initialState, setWalletBalance(500000));
    expect(state.walletBalance).toBe(500000);
  });

  it('setWalletLoading updates loading state', () => {
    const state = walletReducer(initialState, setWalletLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('setTopUpList updates topUps, total, and totalPages', () => {
    const payload = { topUps: [{ id: '1' } as any], total: 1, totalPages: 1 };
    const state = walletReducer(initialState, setTopUpList(payload));
    expect(state.topUps).toHaveLength(1);
    expect(state.total).toBe(1);
    expect(state.totalPages).toBe(1);
  });

  it('setWalletPage updates page', () => {
    const state = walletReducer(initialState, setWalletPage(3));
    expect(state.page).toBe(3);
  });

  it('setWalletPerPage resets page to 1', () => {
    const state = walletReducer({ ...initialState, page: 5 }, setWalletPerPage(25));
    expect(state.perPage).toBe(25);
    expect(state.page).toBe(1);
  });

  it('setWalletSearch resets page to 1', () => {
    const state = walletReducer({ ...initialState, page: 4 }, setWalletSearch('test'));
    expect(state.search).toBe('test');
    expect(state.page).toBe(1);
  });
});
