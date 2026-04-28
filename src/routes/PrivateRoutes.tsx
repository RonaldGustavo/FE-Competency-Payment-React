import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ErrorPage, NotFound } from '../pages';
import { PageBase } from '../components';
import Path from '../constant/path';
import { Menu } from '../constant/menu';
import { useAppSelector } from '../config/hook';

function PrivateRoutes(): React.ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${Path.dashboard}`} replace />}
      />

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PrivateRoutes;
