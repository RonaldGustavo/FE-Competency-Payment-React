import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Refund } from '../../interface/refund';

interface RefundState {
  refunds: Refund[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  search: string;
  statusFilter: string;
  isLoading: boolean;
}

const initialState: RefundState = {
  refunds: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  statusFilter: '',
  isLoading: false,
};

const refundSlice = createSlice({
  name: 'refund',
  initialState,
  reducers: {
    setRefundLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefundList: (
      state,
      action: PayloadAction<{ refunds: Refund[]; total: number; totalPages: number }>,
    ) => {
      state.refunds = action.payload.refunds;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },
    setRefundPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRefundPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.page = 1;
    },
    setRefundSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setRefundStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setRefundLoading,
  setRefundList,
  setRefundPage,
  setRefundPerPage,
  setRefundSearch,
  setRefundStatusFilter,
} = refundSlice.actions;

export default refundSlice.reducer;
