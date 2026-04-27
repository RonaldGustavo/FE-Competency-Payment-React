import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard, ErrorPage, NotFound } from '../pages';
import { PageBase } from '../components';
import Path from '../constant/Path';

function PrivateRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${Path.dashboard}`} replace />}
      />

      <Route path="/" element={<PageBase />} errorElement={<ErrorPage />}>
        <Route path={`/${Path.dashboard}`} element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PrivateRoutes;
