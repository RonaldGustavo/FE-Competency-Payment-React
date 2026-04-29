import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ErrorPage, NotFound, Payment, PaymentDetail } from '../pages';
import { PageBase } from '../components';
import Path from '../constant/path';
import { Menu } from '../constant/menu';
import { useAppSelector } from '../config/hook';

const authPaths = ['/sign-in', '/sign-up'];

function PrivateFallback(): React.ReactElement {
  const location = useLocation();

  if (authPaths.includes(location.pathname)) {
    return <Navigate to={`/${Path.dashboard}`} replace />;
  }

  return <NotFound />;
}

function PrivateRoutes(): React.ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${Path.dashboard}`} replace />}
      />

      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/:invoiceNumber" element={<PaymentDetail />} />

      <Route
        path="/"
        element={<PageBase userName={user?.name} userRole={user?.role} />}
        errorElement={<ErrorPage />}
      >
        {Menu.map((route) => {
          const Element = route.element;

          return (
            <Route key={route.path} path={route.path} element={<Element />} />
          );
        })}
      </Route>

      <Route path="*" element={<PrivateFallback />} />
    </Routes>
  );
}

export default PrivateRoutes;
