import { describe, it, expect } from 'vitest';
import authReducer, { login, logout, setUser } from '../AuthSlice';

const initialState = {
  isAuthenticated: false,
  user: { role: '', name: '', email: '' },
};

describe('authSlice', () => {
  it('returns initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.user).toEqual({ role: '', name: '', email: '' });
  });

  it('login sets isAuthenticated to true', () => {
    const state = authReducer({ ...initialState, isAuthenticated: false }, login());
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser updates user and sets isAuthenticated', () => {
    const user = { role: 'admin', name: 'Ronald', email: 'ronald@dbo.id' };
    const state = authReducer({ ...initialState }, setUser(user));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
  });

  it('logout resets state', () => {
    const loggedIn = { isAuthenticated: true, user: { role: 'admin', name: 'Ronald', email: 'r@r.com' } };
    const state = authReducer(loggedIn, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ role: '', name: '', email: '' });
  });
});
