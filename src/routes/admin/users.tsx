import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersFeature } from "@/features/admin/users";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminUsersFeature />
    </AuthGuard>
  ),
});
