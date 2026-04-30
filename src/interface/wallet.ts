import type { ApiResponse } from './auth';

export interface TopUp {
  id: string;
  user_name?: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string | null;
  updated_at: string | null;
  note?: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface GetTopUpsParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface CreateTopUpPayload {
  amount: number;
}

export interface ReviewTopUpPayload {
  action: 'approve' | 'reject';
  note: string;
}

export interface BalanceResponse {
  data: {
    wallet: {
      balance: number;
    };
  };
}

export type TopUpsResponse = ApiResponse<{ top_ups: TopUp[]; pagination: Pagination }>;
export type TopUpResponse = ApiResponse<{ top_up: TopUp }>;
