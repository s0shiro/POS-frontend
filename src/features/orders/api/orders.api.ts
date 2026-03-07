import { fetchWithAuth } from "@/lib/api-client";
import type {
  Order,
  OrderItem,
  CreateOrderPayload,
  CreatePaymentPayload,
} from "../types";

export const fetchOrders = async (params?: {
  status?: string;
  type?: string;
  tableId?: string;
  tableNumber?: string;
  isPaid?: boolean;
}): Promise<{ success: boolean; data: Order[] }> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.tableId) searchParams.set("tableId", params.tableId);
  if (params?.tableNumber) searchParams.set("tableNumber", params.tableNumber);
  if (params?.isPaid !== undefined)
    searchParams.set("isPaid", String(params.isPaid));

  const query = searchParams.toString();
  return fetchWithAuth(`/api/orders${query ? `?${query}` : ""}`);
};

export const fetchOrderById = async (
  id: string,
): Promise<{ success: boolean; data: Order }> => {
  return fetchWithAuth(`/api/orders/${id}`);
};

export const createOrder = async (
  data: CreateOrderPayload,
): Promise<{ success: boolean; data: Order }> => {
  return fetchWithAuth("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateOrder = async (
  id: string,
  data: Partial<Pick<Order, "type" | "tableId" | "tableNumber" | "notes">>,
): Promise<{ success: boolean; data: Order }> => {
  return fetchWithAuth(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"],
): Promise<{ success: boolean; data: Order }> => {
  return fetchWithAuth(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const addOrderItem = async (
  orderId: string,
  item: CreateOrderPayload["items"][0],
): Promise<{ success: boolean; data: OrderItem }> => {
  return fetchWithAuth(`/api/orders/${orderId}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });
};

export const removeOrderItem = async (
  orderId: string,
  itemId: string,
): Promise<{ success: boolean }> => {
  return fetchWithAuth(`/api/orders/${orderId}/items/${itemId}`, {
    method: "DELETE",
  });
};

export const createPayment = async (
  orderId: string,
  data: CreatePaymentPayload,
): Promise<{ success: boolean; data: unknown }> => {
  return fetchWithAuth(`/api/orders/${orderId}/payment`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getReceipt = async (
  orderId: string,
): Promise<{ success: boolean; data: unknown }> => {
  return fetchWithAuth(`/api/orders/${orderId}/receipt`);
};
