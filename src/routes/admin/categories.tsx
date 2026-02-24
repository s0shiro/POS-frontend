import { createFileRoute } from "@tanstack/react-router";
import { AdminCategoriesPage } from "@/pages/AdminCategoriesPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/categories")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminCategoriesPage />
    </AuthGuard>
  ),
});
