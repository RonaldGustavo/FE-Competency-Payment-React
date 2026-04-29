import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  walletBalance: number;
}

const initialState: AuthState = {
  walletBalance: 0,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload;
    },
  },
});

export const { setWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
