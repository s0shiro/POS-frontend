import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { KDSOrder } from "../types";

export function useKDSSocket(socket: any) {
  const queryClient = useQueryClient();

  // Socket event handlers
  const handleNewOrder = useCallback(
    (order: KDSOrder) => {
      console.log("[KDS] New order received:", order);
      toast.info(`New order #${order.orderNumber}`);
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      queryClient.invalidateQueries({ queryKey: ["kds-stats"] });
    },
    [queryClient],
  );

  const handleOrderUpdated = useCallback(
    (data: { id: string; orderNumber: string; status: string }) => {
      console.log("[KDS] Order updated:", data);
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      queryClient.invalidateQueries({ queryKey: ["kds-stats"] });
    },
    [queryClient],
  );

  // Register socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("kds:new-order", handleNewOrder);
    socket.on("kds:order-updated", handleOrderUpdated);
    socket.on("kds:order-removed", handleOrderUpdated);

    return () => {
      socket.off("kds:new-order", handleNewOrder);
      socket.off("kds:order-updated", handleOrderUpdated);
      socket.off("kds:order-removed", handleOrderUpdated);
    };
  }, [socket, handleNewOrder, handleOrderUpdated]);
}
