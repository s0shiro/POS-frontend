import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";
import { CashierPage } from "@/pages/CashierPage";

export const Route = createFileRoute("/cashier")({
  beforeLoad: async () => {
    try {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        throw redirect({ to: "/login" });
      }
      return { user: data.user };
    } catch (error) {
      if (error instanceof Error && "to" in error) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  },
  component: CashierPage,
});
