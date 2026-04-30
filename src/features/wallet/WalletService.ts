import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type {
  BalanceResponse,
  CreateTopUpPayload,
  GetTopUpsParams,
  ReviewTopUpPayload,
  TopUpResponse,
  TopUpsResponse,
} from '../../interface/wallet';

export const getWalletBalanceApi = async () => {
  const response = await api.get<BalanceResponse>(ApiEndpoint.wallet.balance);
  return response.data.data.wallet;
};

export const getTopUpsApi = async (params?: GetTopUpsParams, signal?: AbortSignal) => {
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    : undefined;
  const response = await api.get<TopUpsResponse>(ApiEndpoint.wallet.topUps, {
    params: cleanParams,
    signal,
  });
  return response.data.data;
};

export const createTopUpApi = async (payload: CreateTopUpPayload) => {
  const response = await api.post<TopUpResponse>(ApiEndpoint.wallet.topUps, payload);
  return response.data.data.top_up;
};

export const reviewTopUpApi = async (id: string, payload: ReviewTopUpPayload) => {
  const response = await api.patch<TopUpResponse>(
    ApiEndpoint.wallet.reviewTopUp(id),
    payload,
  );
  return response.data.data.top_up;
};
