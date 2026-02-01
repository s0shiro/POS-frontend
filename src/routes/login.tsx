import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        throw redirect({ to: "/" });
      }
    } catch (error) {
      // If it's a redirect, rethrow it
      if (error instanceof Error && "to" in error) {
        throw error;
      }
      // For network errors, just show the login page
    }
  },
  component: LoginPage,
});
