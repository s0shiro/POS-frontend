import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authClient, type Session, type User } from "./auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof authClient.signIn;
  signUp: typeof authClient.signUp;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
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
  };

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

  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null);
    setSession(null);
    // Navigation should be handled by the component calling signOut
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
