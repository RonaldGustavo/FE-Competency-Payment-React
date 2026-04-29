import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../config/hook';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { getProfileApi } from '../features/auth/AuthService';
import { logout, setUser } from '../features/auth/AuthSlice';
import { setWalletBalance } from '../features/wallet/WalletSlice';
import { clearAuthSession, getAuthToken } from '../utils/authToken';
import { getWalletBalanceApi } from '../features/wallet/WalletService';

export default function Routes(): React.JSX.Element {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const isFetchingProfile = React.useRef(false);

  React.useEffect(() => {
    const token = getAuthToken();

    if (!isAuthenticated || !token) {
      isFetchingProfile.current = false;
      return;
    }

    if (user.name || user.email || isFetchingProfile.current) return;

    isFetchingProfile.current = true;

    getProfileApi()
      .then((profile) => {
        dispatch(setUser(profile));
        getWalletBalanceApi()
          .then((res) => {
            dispatch(setWalletBalance(res.balance));
          })
          .catch(() => {
            //TODO - unauth change to global
            clearAuthSession();
            dispatch(logout());
          });
      })
      .catch(() => {
        clearAuthSession();
        dispatch(logout());
      })
      .finally(() => {
        isFetchingProfile.current = false;
      });
  }, [dispatch, isAuthenticated, user.email, user.name]);

  return (
    <BrowserRouter>
      {!isAuthenticated ? <PublicRoutes /> : <PrivateRoutes />}
    </BrowserRouter>
  );
}
