import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type { DashboardSummaryResponse } from '../../interface/dashboard';

export const getDashboardSummaryApi = async (signal?: AbortSignal) => {
  const response = await api.get<DashboardSummaryResponse>(ApiEndpoint.dashboard.summary, { signal });
  return response.data.data.summary;
};
