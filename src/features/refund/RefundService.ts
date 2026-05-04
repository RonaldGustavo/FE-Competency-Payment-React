import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type {
  CreateRefundPayload,
  GetRefundsParams,
  RefundResponse,
  RefundsResponse,
  ReviewRefundPayload,
} from '../../interface/refund';

export const getRefundsApi = async (params?: GetRefundsParams, signal?: AbortSignal) => {
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    : undefined;
  const response = await api.get<RefundsResponse>(ApiEndpoint.refund.list, {
    params: cleanParams,
    signal,
  });
  return response.data.data;
};

export const createRefundApi = async (payload: CreateRefundPayload) => {
  const response = await api.post<RefundResponse>(ApiEndpoint.refund.create, payload, { silent: true } as any);
  return response.data.data.refund;
};

export const reviewRefundApi = async (id: string, payload: ReviewRefundPayload) => {
  const response = await api.patch<RefundResponse>(ApiEndpoint.refund.review(id), payload);
  return response.data.data.refund;
};
