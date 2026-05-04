import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Invoice } from '../../interface/invoice';

interface InvoiceState {
  invoices: Invoice[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  search: string;
  statusFilter: string;
  isLoading: boolean;
}

const initialState: InvoiceState = {
  invoices: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  statusFilter: '',
  isLoading: false,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoiceLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInvoiceList: (
      state,
      action: PayloadAction<{ invoices: Invoice[]; total: number; totalPages: number }>,
    ) => {
      state.invoices = action.payload.invoices;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },
    setInvoicePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setInvoicePerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.page = 1;
    },
    setInvoiceSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setInvoiceStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setInvoiceLoading,
  setInvoiceList,
  setInvoicePage,
  setInvoicePerPage,
  setInvoiceSearch,
  setInvoiceStatusFilter,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
