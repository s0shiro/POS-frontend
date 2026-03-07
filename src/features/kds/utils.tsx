import type { KDSOrder } from "./index";
import { UtensilsCrossed, Package, Truck } from "lucide-react";

// Get order type icon component
export function OrderTypeIcon({ type }: { type: KDSOrder["type"] }) {
  switch (type) {
    case "dine_in":
      return <UtensilsCrossed className="h-4 w-4" />;
    case "takeaway":
      return <Package className="h-4 w-4" />;
    case "delivery":
      return <Truck className="h-4 w-4" />;
  }
}
