export interface CashierSalesSummary {
  cashierId: string;
  cashierName: string;
  totalSales: number;
  totalOrders: number;
}

export interface DailySalesSummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  cashiers: CashierSalesSummary[];
}

export interface SalesTransaction {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string | null;
  amount: string;
  method: string;
  discount: string | null;
  discountType: string | null;
  tax: string | null;
  serviceCharge: string | null;
  paidAt: string;
  cashierId: string;
  cashierName: string;
}
