import { createFileRoute } from "@tanstack/react-router";
import { CustomerDisplayPage } from "@/pages/CustomerDisplayPage";

// Public route - no authentication required
export const Route = createFileRoute("/display")({
  component: CustomerDisplayPage,
});
