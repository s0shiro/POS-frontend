import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersKeys } from "./query-keys";
import * as ordersApi from "./orders.api";
import type { CreateOrderPayload, CreatePaymentPayload, Order } from "../types";

export function useOrders(params?: {
  status?: string;
  type?: string;
  tableId?: string;
  tableNumber?: string;
  isPaid?: boolean;
}) {
  return useQuery({
    queryKey: ordersKeys.list(JSON.stringify(params)),
    queryFn: () => ordersApi.fetchOrders(params),
  });
}

export function useOrderById(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersApi.fetchOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<Order, "type" | "tableId" | "tableNumber" | "notes">>;
    }) => ordersApi.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useAddOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      item,
    }: {
      orderId: string;
      item: CreateOrderPayload["items"][0];
    }) => ordersApi.addOrderItem(orderId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useRemoveOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      ordersApi.removeOrderItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: CreatePaymentPayload;
    }) => ordersApi.createPayment(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
