import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrderCalledData {
  id: string;
  orderNumber: string;
}

interface OrderReadyData {
  id: string;
  orderNumber: string;
  tableNumber: string | null;
}

export function useReadyOrdersSocket(
  socket: any,
  setUncalledOrders: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
  const queryClient = useQueryClient();

  // Socket event handlers
  const handleOrderReady = useCallback(
    (data: OrderReadyData) => {
      console.log("[ReadyOrders] New ready order:", data);
      toast.info(`Order ${data.orderNumber} is ready!`, {
        description: data.tableNumber ? `Table: ${data.tableNumber}` : "Pickup",
      });
      // New orders are automatically shown on customer display (not in uncalledOrders)
      queryClient.invalidateQueries({ queryKey: ["ready-orders"] });
    },
    [queryClient],
  );

  // Register socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("order:ready", handleOrderReady);

    // Listen for order called from other cashier screens (remove from uncalled set)
    socket.on("order:called", (data: OrderCalledData) => {
      setUncalledOrders((prev) => {
        const next = new Set(prev);
        next.delete(data.id);
        return next;
      });
    });

    // Listen for order uncalled from other cashier screens (add to uncalled set)
    socket.on("order:uncalled", (data: { id: string }) => {
      setUncalledOrders((prev) => new Set(prev).add(data.id));
    });

    return () => {
      socket.off("order:ready", handleOrderReady);
      socket.off("order:called");
      socket.off("order:uncalled");
    };
  }, [socket, handleOrderReady, setUncalledOrders]);
}
