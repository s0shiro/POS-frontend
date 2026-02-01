import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";
import { KDSPage } from "@/pages/KDSPage";

export const Route = createFileRoute("/kds")({
  beforeLoad: async () => {
    try {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        throw redirect({ to: "/login" });
      }
      // Only kitchen and admin can access KDS
      const role = data.user.role as string;
      if (role !== "kitchen" && role !== "admin") {
        throw redirect({ to: "/unauthorized" });
      }
      return { user: data.user };
    } catch (error) {
      if (error instanceof Error && "to" in error) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  },
  component: KDSPage,
});
