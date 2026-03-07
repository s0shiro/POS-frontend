import type { MenuItem } from "@/features/menu/types";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  selectedModifiers: { id: string; name: string; price: number }[];
}

export type OrderType = "dine_in" | "takeaway" | "delivery";
export type PaymentMethod = "cash" | "card" | "digital_wallet";
