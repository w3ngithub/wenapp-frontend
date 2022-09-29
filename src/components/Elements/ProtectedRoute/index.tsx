import React from 'react'
import {Navigate, Outlet, useLocation} from 'react-router-dom'

interface protectedRouteInterface {
  component?: React.ReactNode
  rest?: any
  auth: any
  children?: React.ReactNode
}

export const ProtectedRoute = ({
  component: Component,
  children,
  auth,
  ...rest
}: protectedRouteInterface) => {
  let location = useLocation()
  const authUser = auth
  if (!authUser || authUser === null || authUser === undefined) {
    return <Navigate to="/signin" state={{from: location}} replace />
  }

  return <Outlet />
}
