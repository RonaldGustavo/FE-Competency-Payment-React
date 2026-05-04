import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardSummary } from '../../interface/dashboard';

interface DashboardState {
  summary: DashboardSummary | null;
  isLoading: boolean;
}

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDashboardSummary: (state, action: PayloadAction<DashboardSummary>) => {
      state.summary = action.payload;
    },
  },
});

export const { setDashboardLoading, setDashboardSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;
