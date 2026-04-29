import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../config/hook';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { getProfileApi } from '../features/auth/AuthService';
import { logout, setUser } from '../features/auth/AuthSlice';
import { clearAuthSession, getAuthToken } from '../utils/authToken';

export default function Routes(): React.JSX.Element {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const token = getAuthToken();

    if (!isAuthenticated || !token || user.name || user.email) return;

    getProfileApi()
      .then((profile) => {
        if (profile) {
          dispatch(setUser(profile));
        }
      })
      .catch(() => {
        clearAuthSession();
        dispatch(logout());
      });
  }, [dispatch, isAuthenticated, user.email, user.name]);

  return (
    <BrowserRouter>
      {!isAuthenticated ? <PublicRoutes /> : <PrivateRoutes />}
    </BrowserRouter>
  );
}
