import { UtensilsCrossed, Package, Truck } from "lucide-react";

// Get order type icon component
export function OrderTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "dine_in":
      return <UtensilsCrossed className="h-6 w-6" />;
    case "takeaway":
      return <Package className="h-6 w-6" />;
    case "delivery":
      return <Truck className="h-6 w-6" />;
    default:
      return <UtensilsCrossed className="h-6 w-6" />;
  }
}

export interface CalledOrder {
  id: string;
  orderNumber: string;
  tableNumber: string | null;
  type: string;
  calledAt: string;
}
