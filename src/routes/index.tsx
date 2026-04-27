import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppSelector } from '../config/hook';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

export default function Routes(): React.JSX.Element {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      {isAuthenticated ? <PublicRoutes /> : <PrivateRoutes />}
    </BrowserRouter>
  );
}
