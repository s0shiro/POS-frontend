import { createFileRoute } from "@tanstack/react-router";
import { AdminSalesPage } from "@/pages/AdminSalesPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/sales")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminSalesPage />
    </AuthGuard>
  ),
});
