import { createFileRoute } from "@tanstack/react-router";
import { AdminMenuItemsFeature } from "@/features/admin/menu-items";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/menu-items")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminMenuItemsFeature />
    </AuthGuard>
  ),
});
