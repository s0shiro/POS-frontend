import type { Order } from "@/features/orders";
import { UtensilsCrossed, Package, Truck } from "lucide-react";

// Get order type icon and label
export function OrderTypeDisplay({ type }: { type: Order["type"] }) {
  switch (type) {
    case "dine_in":
      return (
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <UtensilsCrossed className="h-4 w-4" />
          <span>Dine In</span>
        </div>
      );
    case "takeaway":
      return (
        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
          <Package className="h-4 w-4" />
          <span>Takeaway</span>
        </div>
      );
    case "delivery":
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <Truck className="h-4 w-4" />
          <span>Delivery</span>
        </div>
      );
  }
}
