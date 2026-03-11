import { createAuthClient } from "better-auth/react";
import { adminClient, oneTimeTokenClient } from "better-auth/client/plugins";
import { apiKeyClient } from "@better-auth/api-key/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "",
  plugins: [adminClient(), oneTimeTokenClient(), apiKeyClient()],
  fetchOptions: {
    credentials: "include",
  },
});

// Export hooks for easy access
export const { useSession, signIn, signUp, signOut } = authClient;

// Types
export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
