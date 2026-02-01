import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";
import { Dashboard } from "@/pages/Dashboard";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        throw redirect({ to: "/login" });
      }
      return { user: data.user };
    } catch (error) {
      // If it's a redirect, rethrow it
      if (error instanceof Error && "to" in error) {
        throw error;
      }
      // For network errors or other failures, redirect to login
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});
