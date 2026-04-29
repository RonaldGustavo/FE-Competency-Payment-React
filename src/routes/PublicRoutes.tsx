import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAppSelector } from '../config/hook'
import { Login, SignUp } from '../pages'

const publicPaths = ['/sign-in', '/sign-up'];

export default function PublicRoutes (): React.JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!publicPaths.includes(location.pathname)) {
      navigate('/sign-in')
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    if (isAuthenticated && publicPaths.includes(location.pathname)) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  )
}
