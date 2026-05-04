import { describe, it, expect } from 'vitest';
import invoiceReducer, {
  setInvoiceLoading,
  setInvoiceList,
  setInvoicePage,
  setInvoicePerPage,
  setInvoiceSearch,
  setInvoiceStatusFilter,
} from '../InvoiceSlice';

const initialState = {
  invoices: [],
  total: 0,
  totalPages: 1,
  page: 1,
  perPage: 10,
  search: '',
  statusFilter: '',
  isLoading: false,
};

describe('invoiceSlice', () => {
  it('setInvoiceLoading updates loading state', () => {
    const state = invoiceReducer(initialState, setInvoiceLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('setInvoiceList updates invoices, total, and totalPages', () => {
    const payload = { invoices: [{ id: 'INV-001' } as any], total: 5, totalPages: 1 };
    const state = invoiceReducer(initialState, setInvoiceList(payload));
    expect(state.invoices).toHaveLength(1);
    expect(state.total).toBe(5);
  });

  it('setInvoicePage updates page', () => {
    const state = invoiceReducer(initialState, setInvoicePage(2));
    expect(state.page).toBe(2);
  });

  it('setInvoicePerPage resets page to 1', () => {
    const state = invoiceReducer({ ...initialState, page: 3 }, setInvoicePerPage(20));
    expect(state.perPage).toBe(20);
    expect(state.page).toBe(1);
  });

  it('setInvoiceSearch resets page to 1', () => {
    const state = invoiceReducer({ ...initialState, page: 3 }, setInvoiceSearch('INV'));
    expect(state.search).toBe('INV');
    expect(state.page).toBe(1);
  });

  it('setInvoiceStatusFilter resets page to 1', () => {
    const state = invoiceReducer({ ...initialState, page: 2 }, setInvoiceStatusFilter('Paid'));
    expect(state.statusFilter).toBe('Paid');
    expect(state.page).toBe(1);
  });
});
