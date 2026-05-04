import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import walletReducer from '../features/wallet/WalletSlice';
import invoiceReducer from '../features/invoice/InvoiceSlice';
import refundReducer from '../features/refund/RefundSlice';
import dashboardReducer from '../features/dashboard/DashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    invoice: invoiceReducer,
    refund: refundReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
