import { useEffect, useState, useCallback, type ReactNode } from "react";
import { type QueryClient } from "@tanstack/react-query";
import { authClient, type Session, type User } from "./auth";
import { AuthContext } from "./AuthContext";
import type { router as routerType } from "@/router";

interface AuthProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
  router: typeof routerType;
}

export function AuthProvider({
  children,
  queryClient,
  router,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update router context when user changes, but only after initial load
  useEffect(() => {
    router.update({
      context: {
        user,
        isAuthenticated: !!user,
        isLoading,
      },
    });
  }, [user, router, isLoading]);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      if (data) {
        setSession(data);
        setUser(data.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (isMounted) {
          if (data) {
            setSession(data);
            setUser(data.user);
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    // Sign out from backend first
    await authClient.signOut();
    // Clear state
    setUser(null);
    setSession(null);
    // Clear all cached queries
    queryClient.clear();
    // Navigate to login - router context will be updated via useEffect
    await router.navigate({ to: "/login", replace: true });
  }, [queryClient, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn: authClient.signIn,
        signUp: authClient.signUp,
        signOut: handleSignOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
