import type { MenuItem } from "@/features/menu/types";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  priceAtTime: string;
  notes?: string;
  selectedModifiers?: { id: string; name: string; price: number }[];
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber?: string;
  userId?: string;
  status: "pending" | "preparing" | "ready" | "completed" | "canceled";
  type: "dine_in" | "takeaway" | "delivery";
  isPaid: boolean;
  totalAmount: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  tableId?: string;
  tableNumber?: string;
  type: "dine_in" | "takeaway" | "delivery";
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
    selectedModifiers?: { id: string; name?: string; price?: number }[];
  }[];
  notes?: string;
}

export interface CreatePaymentPayload {
  method: "cash" | "card" | "digital_wallet";
  discount?: number;
  discountType?: "fixed" | "percentage";
  tax?: number;
  serviceCharge?: number;
  receivedAmount?: number;
}
