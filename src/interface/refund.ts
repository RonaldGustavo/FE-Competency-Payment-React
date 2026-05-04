import type { ApiResponse } from './auth';
import type { Pagination } from './wallet';

export interface Refund {
  id: string;
  invoice_id: string;
  user_name?: string;
  reason: string;
  status: string;
  note?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface GetRefundsParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface CreateRefundPayload {
  invoice_id: string;
  reason: string;
}

export interface ReviewRefundPayload {
  action: 'approve' | 'reject';
  note: string;
}

export type RefundsResponse = ApiResponse<{ refunds: Refund[]; pagination: Pagination }>;
export type RefundResponse = ApiResponse<{ refund: Refund }>;
