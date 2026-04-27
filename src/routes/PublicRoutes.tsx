import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAppSelector } from '../config/hook'
import { Login } from '../pages'

export default function PublicRoutes (): React.JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!['/sign-in'].includes(location.pathname)) {
      navigate('/sign-in')
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/sign-in') {
      navigate('/dashboard')
    }
  }, [isAuthenticated, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/sign-in" element={<Login />} />
    </Routes>
  )
}
