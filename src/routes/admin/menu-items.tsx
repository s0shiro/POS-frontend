import { createFileRoute } from "@tanstack/react-router";
import { AdminMenuItemsPage } from "@/pages/AdminMenuItemsPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/menu-items")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminMenuItemsPage />
    </AuthGuard>
  ),
});
