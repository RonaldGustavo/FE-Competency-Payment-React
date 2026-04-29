import { createSlice } from '@reduxjs/toolkit';
import type { AuthUser } from '../../interface/auth';
import { getAuthToken } from '../../utils/authToken';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(getAuthToken()),
  user: {
    role: '',
    name: '',
    email: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        role: '',
        name: '',
        email: '',
      };
    },
  },
});

export const { login, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
