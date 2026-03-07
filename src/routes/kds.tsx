import { createFileRoute } from "@tanstack/react-router";
import { KDSFeature } from "@/features/kds";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/kds")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "kitchen"]}>
      <KDSFeature />
    </AuthGuard>
  ),
});
