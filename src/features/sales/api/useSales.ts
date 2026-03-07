import { useQuery, useMutation } from "@tanstack/react-query";
import { salesKeys } from "./query-keys";
import * as salesApi from "./sales.api";

export function useSalesSummary(date: string) {
  return useQuery({
    queryKey: salesKeys.summary(date),
    queryFn: () => salesApi.fetchSalesSummary(date),
  });
}

export function useSalesTransactions(date: string, cashierId?: string) {
  return useQuery({
    queryKey: salesKeys.transaction(date, cashierId),
    queryFn: () => salesApi.fetchSalesTransactions(date, cashierId),
  });
}

export function useReprintReceipt() {
  return useMutation({
    mutationFn: (orderId: string) => salesApi.reprintReceipt(orderId),
  });
}
