import { createFileRoute } from "@tanstack/react-router";
import { CashierPage } from "@/pages/CashierPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/cashier")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "cashier"]}>
      <CashierPage />
    </AuthGuard>
  ),
});
