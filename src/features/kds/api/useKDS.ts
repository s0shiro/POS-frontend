import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kdsKeys } from "./query-keys";
import * as kdsApi from "./kds.api";

export function useKDSOrders() {
  return useQuery({
    queryKey: kdsKeys.orders(),
    queryFn: () => kdsApi.fetchKDSOrders(),
    refetchInterval: 30000, // Refresh every 30 seconds as backup
  });
}

export function useKDSStats() {
  return useQuery({
    queryKey: kdsKeys.stats(),
    queryFn: () => kdsApi.fetchKDSStats(),
    refetchInterval: 30000,
  });
}

export function useStartPreparing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => kdsApi.startPreparing(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kdsKeys.orders() });
      queryClient.invalidateQueries({ queryKey: kdsKeys.stats() });
    },
  });
}

export function useMarkReady() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => kdsApi.markReady(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kdsKeys.orders() });
      queryClient.invalidateQueries({ queryKey: kdsKeys.stats() });
    },
  });
}
