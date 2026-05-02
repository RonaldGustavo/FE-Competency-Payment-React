import { api } from '../../config/http';
import ApiEndpoint from '../../constant/apiEndpoint';
import type {
  CreateInvoicePayload,
  GetInvoicesParams,
  InvoiceResponse,
  InvoicesResponse,
  PayInvoicePayload,
  ReviewInvoicePayload,
} from '../../interface/invoice';

export const getInvoicesApi = async (params?: GetInvoicesParams, signal?: AbortSignal) => {
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    : undefined;
  const response = await api.get<InvoicesResponse>(ApiEndpoint.invoice.list, {
    params: cleanParams,
    signal,
  });
  return response.data.data;
};

export const createInvoiceApi = async (payload: CreateInvoicePayload) => {
  const response = await api.post<InvoiceResponse>(ApiEndpoint.invoice.create, payload);
  return response.data.data.invoice;
};

export const getInvoiceApi = async (id: string) => {
  const response = await api.get<InvoiceResponse>(ApiEndpoint.invoice.detail(id));
  return response.data.data.invoice;
};

export const reviewInvoiceApi = async (id: string, payload: ReviewInvoicePayload) => {
  const response = await api.patch<InvoiceResponse>(ApiEndpoint.invoice.review(id), payload);
  return response.data.data.invoice;
};

export const deleteInvoiceApi = async (id: string) => {
  await api.delete(ApiEndpoint.invoice.delete(id));
};

export const getInvoiceByTokenApi = async (token: string, signal?: AbortSignal) => {
  const response = await api.get<InvoiceResponse>(ApiEndpoint.invoice.paymentByToken(token), {
    signal,
  });
  return response.data.data.invoice;
};

export const payInvoiceApi = async (token: string, payload: PayInvoicePayload) => {
  const response = await api.post<InvoiceResponse>(ApiEndpoint.invoice.pay(token), payload);
  return response.data.data.invoice;
};
