import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../config/hook';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { getProfileApi } from '../features/auth/AuthService';
import { setUser } from '../features/auth/AuthSlice';
import { setWalletBalance } from '../features/wallet/WalletSlice';
import { getAuthToken } from '../utils/authToken';
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
        if(profile?.role === 'Merchant'){
          getWalletBalanceApi()
          .then((res) => {
            dispatch(setWalletBalance(res.balance));
          })
          .catch(() => undefined);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        isFetchingProfile.current = false;
      });
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      {!isAuthenticated ? <PublicRoutes /> : <PrivateRoutes />}
    </BrowserRouter>
  );
}
