import { Navigate, Outlet } from '@tanstack/react-router'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as string)) {
    return <Navigate to="/unauthorized" />
  }

  return <Outlet />
}