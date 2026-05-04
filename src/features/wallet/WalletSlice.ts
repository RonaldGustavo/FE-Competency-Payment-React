import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TopUp } from '../../interface/wallet';

interface WalletState {
  walletBalance: number;
  topUps: TopUp[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  search: string;
  isLoading: boolean;
}

const initialState: WalletState = {
  walletBalance: 0,
  topUps: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  isLoading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload;
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTopUpList: (
      state,
      action: PayloadAction<{ topUps: TopUp[]; total: number; totalPages: number }>,
    ) => {
      state.topUps = action.payload.topUps;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },
    setWalletPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setWalletPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.page = 1;
    },
    setWalletSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setWalletBalance,
  setWalletLoading,
  setTopUpList,
  setWalletPage,
  setWalletPerPage,
  setWalletSearch,
} = walletSlice.actions;

export default walletSlice.reducer;
