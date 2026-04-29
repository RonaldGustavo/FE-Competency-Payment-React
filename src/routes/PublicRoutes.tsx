import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAppSelector } from '../config/hook'
import { Login, Payment, PaymentDetail, SignUp } from '../pages'

const publicPaths = ['/sign-in', '/sign-up'];

const isPublicPath = (pathname: string) =>
  publicPaths.includes(pathname) || pathname === '/payment' || pathname.startsWith('/payment/');

export default function PublicRoutes (): React.JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isPublicPath(location.pathname)) {
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
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/:invoiceNumber" element={<PaymentDetail />} />
    </Routes>
  )
}
