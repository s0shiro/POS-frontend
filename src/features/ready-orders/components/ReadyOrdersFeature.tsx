import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/features/orders/api/useOrders";
import type { Order } from "@/features/orders";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { ReadyOrdersHeader } from "./ReadyOrdersHeader";
import { ReadyOrderCard } from "./ReadyOrderCard";
import { useReadyOrdersSocket } from "../hooks/useReadyOrdersSocket";

export function ReadyOrdersFeature() {
  const { socket, isConnected } = useSocket();
  // Track orders that have been manually uncalled (hidden from customer display)
  // All ready orders are shown on customer display by default
  const [uncalledOrders, setUncalledOrders] = useState<Set<string>>(new Set());

  // Fetch ready orders
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useOrders({ status: "ready" });

  const orders = ordersData?.data ?? [];

  // Mark order as completed mutation
  const completeOrderMutation = useUpdateOrderStatus();

  // Register socket listeners
  useReadyOrdersSocket(socket, setUncalledOrders);

  // Call out order (visual indicator + broadcast to customer display)
  const handleCallOrder = (order: Order) => {
    // Remove from uncalled set to show on customer display
    setUncalledOrders((prev) => {
      const next = new Set(prev);
      next.delete(order.id);
      return next;
    });

    // Emit to socket for customer display and other cashier screens
    if (socket) {
      socket.emit("order:call", {
        id: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber || null,
        type: order.type,
        calledAt: new Date().toISOString(),
      });
    }

    // Play notification sound (if available)
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch {
      // Browser may block autoplay
    }

    toast.info(`Calling order ${order.orderNumber}`, {
      icon: <Megaphone className="h-4 w-4" />,
      description: order.tableNumber
        ? `Table ${order.tableNumber}`
        : "Pickup counter",
    });
  };

  // Uncall order (remove from customer display)
  const handleUncallOrder = (order: Order) => {
    // Add to uncalled set to hide from customer display
    setUncalledOrders((prev) => new Set(prev).add(order.id));

    if (socket) {
      socket.emit("order:uncall", {
        id: order.id,
        orderNumber: order.orderNumber,
      });
    }

    toast.info(`Order ${order.orderNumber} removed from display`);
  };

  // Handle complete order
  const handleCompleteOrder = (orderId: string) => {
    completeOrderMutation.mutate(
      { id: orderId, status: "completed" },
      {
        onSuccess: (response) => {
          toast.success(`Order ${response.data.orderNumber} completed!`);
          // Clean up from uncalled orders set
          setUncalledOrders((prev) => {
            const next = new Set(prev);
            next.delete(response.data.id);
            return next;
          });

          // Emit to socket so customer display removes the order
          if (socket) {
            socket.emit("order:completed", {
              id: response.data.id,
              orderNumber: response.data.orderNumber,
            });
          }
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to complete order",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <ReadyOrdersHeader
        orderCount={orders.length}
        isConnected={isConnected}
        onRefresh={refetch}
      />

      {/* Main content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No Ready Orders
          </h2>
          <p className="mt-2 text-muted-foreground">
            Orders will appear here when kitchen marks them as ready
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
            {orders.map((order) => {
              // Order is called (shown on display) if NOT in uncalledOrders set
              const isCalled = !uncalledOrders.has(order.id);

              return (
                <ReadyOrderCard
                  key={order.id}
                  order={order}
                  isCalled={isCalled}
                  onCallOrder={handleCallOrder}
                  onUncallOrder={handleUncallOrder}
                  onCompleteOrder={handleCompleteOrder}
                  isCompletePending={completeOrderMutation.isPending}
                />
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
