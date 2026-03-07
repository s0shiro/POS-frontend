export interface KDSOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  type: "dine_in" | "takeaway" | "delivery";
  status: "pending" | "preparing";
  notes?: string;
  createdAt: string;
  elapsedMinutes: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    notes?: string;
    modifiers: { name: string; price: number }[];
  }[];
}

export interface KDSStats {
  pending: number;
  preparing: number;
  ready: number;
  completedToday: number;
}
