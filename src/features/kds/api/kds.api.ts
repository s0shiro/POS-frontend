import { fetchWithAuth } from "@/lib/api-client";
import type { KDSOrder, KDSStats } from "../types";

export const fetchKDSOrders = async (): Promise<{
  success: boolean;
  data: KDSOrder[];
}> => {
  return fetchWithAuth("/api/kds/orders");
};

export const fetchKDSStats = async (): Promise<{
  success: boolean;
  data: KDSStats;
}> => {
  return fetchWithAuth("/api/kds/stats");
};

export const startPreparing = async (
  orderId: string,
): Promise<{
  success: boolean;
  data: { id: string; orderNumber: string; status: string; message: string };
}> => {
  return fetchWithAuth(`/api/kds/orders/${orderId}/preparing`, {
    method: "PATCH",
  });
};

export const markReady = async (
  orderId: string,
): Promise<{
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    tableNumber?: string;
    status: string;
    message: string;
  };
}> => {
  return fetchWithAuth(`/api/kds/orders/${orderId}/ready`, {
    method: "PATCH",
  });
};
