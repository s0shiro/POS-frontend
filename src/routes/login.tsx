import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";
import { useAuth } from "@/lib/AuthContext";

function LoginRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <LoginPage />;
}

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});
