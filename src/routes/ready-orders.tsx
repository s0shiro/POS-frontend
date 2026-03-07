import { createFileRoute } from "@tanstack/react-router";
import { ReadyOrdersFeature } from "@/features/ready-orders";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/ready-orders")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "cashier", "printer"]}>
      <ReadyOrdersFeature />
    </AuthGuard>
  ),
});
