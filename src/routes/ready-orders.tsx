import { createFileRoute } from "@tanstack/react-router";
import { ReadyOrdersPage } from "@/pages/ReadyOrdersPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/ready-orders")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "cashier", "printer"]}>
      <ReadyOrdersPage />
    </AuthGuard>
  ),
});
