import { createFileRoute } from "@tanstack/react-router";
import { CashierFeature } from "@/features/cashier";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/cashier")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "cashier"]}>
      <CashierFeature />
    </AuthGuard>
  ),
});
