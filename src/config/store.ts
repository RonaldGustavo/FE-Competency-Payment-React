import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/AuthSlice'
import walletReducer from '../features/wallet/WalletSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch