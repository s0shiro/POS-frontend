import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/")({
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});
