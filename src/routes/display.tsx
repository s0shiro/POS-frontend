import { createFileRoute } from "@tanstack/react-router";
import { CustomerDisplayFeature } from "@/features/customer-display";

// Public route - no authentication required
export const Route = createFileRoute("/display")({
  component: CustomerDisplayFeature,
});
