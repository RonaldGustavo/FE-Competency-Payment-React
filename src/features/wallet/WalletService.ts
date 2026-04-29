import { api } from "../../config/http";
import ApiEndpoint from "../../constant/apiEndpoint";
import type { BalanceResponse } from "../../interface/wallet";

export const getWalletBalanceApi = async () => {
  const response = await api.get<BalanceResponse>(ApiEndpoint.wallet.balance);
  return response.data.data.wallet;
};