import type { ApiResponse } from './auth';

export interface DashboardSummary {
  total_invoice: number;
  total_paid: number;
  total_failed: number;
  total_expired: number;
  total_paid_amount: string;
  total_refund_amount: string;
}

export type DashboardSummaryResponse = ApiResponse<{ summary: DashboardSummary }>;
