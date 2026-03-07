import { fetchWithAuth } from "@/lib/api-client";
import type { DailySalesSummary, SalesTransaction } from "../types";

export const fetchSalesSummary = async (
  date: string,
): Promise<{ success: boolean; data: DailySalesSummary }> => {
  return fetchWithAuth(`/api/sales/summary?date=${date}`);
};

export const fetchSalesTransactions = async (
  date: string,
  cashierId?: string,
): Promise<{ success: boolean; data: SalesTransaction[] }> => {
  const params = new URLSearchParams({ date });
  if (cashierId) params.set("cashierId", cashierId);
  return fetchWithAuth(`/api/sales/transactions?${params.toString()}`);
};

export const reprintReceipt = async (
  orderId: string,
): Promise<{ success: boolean; message: string }> => {
  return fetchWithAuth(`/api/sales/reprint/${orderId}`, {
    method: "POST",
  });
};
