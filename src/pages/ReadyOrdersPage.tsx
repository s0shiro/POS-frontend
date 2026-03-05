import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import { ordersApi, type Order } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CheckCircle2,
  UtensilsCrossed,
  Package,
  Truck,
  RefreshCw,
  Bell,
  Clock,
  Megaphone,
} from "lucide-react";

// Currency formatter for Philippine Peso
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

// Format time
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get order type icon and label
const OrderTypeDisplay = ({ type }: { type: Order["type"] }) => {
  switch (type) {
    case "dine_in":
      return (
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <UtensilsCrossed className="h-4 w-4" />
          <span>Dine In</span>
        </div>
      );
    case "takeaway":
      return (
        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
          <Package className="h-4 w-4" />
          <span>Takeaway</span>
        </div>
      );
    case "delivery":
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <Truck className="h-4 w-4" />
          <span>Delivery</span>
        </div>
      );
  }
};

export function ReadyOrdersPage() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  // Track orders that have been manually uncalled (hidden from customer display)
  // All ready orders are shown on customer display by default
  const [uncalledOrders, setUncalledOrders] = useState<Set<string>>(new Set());

  // Fetch ready orders
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ready-orders"],
    queryFn: () => ordersApi.getAll({ status: "ready" }),
    refetchInterval: 30000, // Refresh every 30 seconds as backup
  });

  const orders = ordersData?.data ?? [];

  // Mark order as completed mutation
  const completeOrderMutation = useMutation({
    mutationFn: (orderId: string) =>
      ordersApi.updateStatus(orderId, "completed"),
    onSuccess: (response) => {
      toast.success(`Order ${response.data.orderNumber} completed!`);
      queryClient.invalidateQueries({ queryKey: ["ready-orders"] });
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
  });

  // Socket event handlers
  const handleOrderReady = useCallback(
    (data: { id: string; orderNumber: string; tableNumber: string | null }) => {
      console.log("[ReadyOrders] New ready order:", data);
      toast.info(`Order ${data.orderNumber} is ready!`, {
        icon: <Bell className="h-4 w-4" />,
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
    socket.on("order:called", (data: { id: string; orderNumber: string }) => {
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
  }, [socket, handleOrderReady]);

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
    } catch {}

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
    completeOrderMutation.mutate(orderId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ready Orders</h1>
            <p className="text-sm text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} ready for
              pickup
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
              isConnected
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {isConnected ? "Live" : "Offline"}
          </div>

          {/* Refresh button */}
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4\">
            {orders.map((order) => {
              // Order is called (shown on display) if NOT in uncalledOrders set
              const isCalled = !uncalledOrders.has(order.id);

              return (
                <Card
                  key={order.id}
                  className={`overflow-hidden transition-all ${
                    isCalled
                      ? "border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 shadow-lg ring-2 ring-yellow-300 dark:ring-yellow-500/30"
                      : "border-2 border-green-500 bg-green-50 dark:bg-green-500/10"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {order.orderNumber}
                        </CardTitle>
                        {order.tableNumber && (
                          <Badge variant="secondary" className="mt-1">
                            Table {order.tableNumber}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <OrderTypeDisplay type={order.type} />
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Order items */}
                    <div className="max-h-32 overflow-y-auto rounded-lg bg-card p-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between py-1 text-sm"
                        >
                          <div className="flex-1">
                            <span className="font-medium">
                              {item.quantity}x {item.menuItem?.name}
                            </span>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground italic">
                                {item.notes}
                              </p>
                            )}
                            {item.selectedModifiers &&
                              (
                                item.selectedModifiers as {
                                  name: string;
                                  price: number;
                                }[]
                              ).length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {(
                                    item.selectedModifiers as {
                                      name: string;
                                      price: number;
                                    }[]
                                  )
                                    .map((m) => m.name)
                                    .join(", ")}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order notes */}
                    {order.notes && (
                      <div className="rounded-lg bg-amber-100 dark:bg-amber-500/15 p-2 text-sm">
                        <span className="font-medium">Note:</span> {order.notes}
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-sm text-muted-foreground">
                        Total
                      </span>
                      <span className="font-bold">
                        {formatCurrency(parseFloat(order.totalAmount))}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {isCalled ? (
                        <Button
                          variant="secondary"
                          className="flex-1 animate-pulse bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-500/30 dark:hover:bg-yellow-500/40 dark:text-yellow-200"
                          onClick={() => handleUncallOrder(order)}
                        >
                          <Megaphone className="mr-2 h-4 w-4" />
                          Called! (Tap to hide)
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleCallOrder(order)}
                        >
                          <Megaphone className="mr-2 h-4 w-4" />
                          Call Order
                        </Button>
                      )}
                      <Button
                        variant="default"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleCompleteOrder(order.id)}
                        disabled={completeOrderMutation.isPending}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
