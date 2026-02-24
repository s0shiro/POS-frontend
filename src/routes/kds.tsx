import { createFileRoute } from "@tanstack/react-router";
import { KDSPage } from "@/pages/KDSPage";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/kds")({
  component: () => (
    <AuthGuard allowedRoles={["admin", "kitchen"]}>
      <KDSPage />
    </AuthGuard>
  ),
});
