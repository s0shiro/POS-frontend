import { createFileRoute } from "@tanstack/react-router";
import { ApiKeysFeature } from "@/features/admin/api-keys";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/admin/api-keys")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "kitchen", "printer"]}>
      <ApiKeysFeature />
    </AuthGuard>
  ),
});
