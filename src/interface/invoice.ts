import type { ApiResponse } from './auth';
import type { Pagination } from './wallet';

export interface Invoice {
  id: string;
  merchant_name?: string;
  merchant_email?: string;
  amount: string | number;
  description: string;
  due_date: string;
  status: string;
  payment_token?: string;
  payment_type?: string;
  paid_at: string | null;
  created_at: string;
  updated_at?: string;
}

export type PaymentMethodType = 'WALLET' | 'VA_DUMMY' | 'EWALLET_DUMMY';

export interface PayInvoicePayload {
  payment_type: PaymentMethodType;
}

export interface GetInvoicesParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface CreateInvoicePayload {
  amount: number;
  description: string;
  due_date: string;
}

export interface ReviewInvoicePayload {
  action: 'approve' | 'reject';
  note: string;
}

export type InvoicesResponse = ApiResponse<{ invoices: Invoice[]; pagination: Pagination }>;
export type InvoiceResponse = ApiResponse<{ invoice: Invoice }>;
