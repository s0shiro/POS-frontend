import { createFileRoute } from "@tanstack/react-router";
import { AdminCategoriesFeature } from "@/features/admin/categories";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/categories")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminCategoriesFeature />
    </AuthGuard>
  ),
});
