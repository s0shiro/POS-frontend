import { createAuthClient } from "better-auth/react";
import { adminClient, oneTimeTokenClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  plugins: [adminClient(), oneTimeTokenClient()],
  fetchOptions: {
    credentials: "include",
  },
});

// Export hooks for easy access
export const { useSession, signIn, signUp, signOut } = authClient;

// Types
export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
