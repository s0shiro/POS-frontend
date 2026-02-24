import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminUsersPage />
    </AuthGuard>
  ),
});
