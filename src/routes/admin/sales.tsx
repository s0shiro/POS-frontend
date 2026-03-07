import { createFileRoute } from "@tanstack/react-router";
import { AdminSalesFeature } from "@/features/admin/sales";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/sales")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminSalesFeature />
    </AuthGuard>
  ),
});
