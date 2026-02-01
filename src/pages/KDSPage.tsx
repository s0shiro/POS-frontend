import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthProvider";
import { useSocket } from "@/hooks/useSocket";
import { kdsApi, type KDSOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ChefHat,
  Clock,
  UtensilsCrossed,
  Package,
  Truck,
  CheckCircle2,
  PlayCircle,
  LogOut,
  RefreshCw,
  Bell,
} from "lucide-react";

// Format elapsed time
const formatElapsedTime = (minutes: number) => {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Get urgency color based on elapsed time
const getUrgencyColor = (minutes: number, status: string) => {
  if (status === "preparing") return "border-blue-500 bg-blue-50";
  if (minutes >= 15) return "border-red-500 bg-red-50";
  if (minutes >= 10) return "border-orange-500 bg-orange-50";
  if (minutes >= 5) return "border-yellow-500 bg-yellow-50";
  return "border-green-500 bg-green-50";
};

// Get order type icon
const OrderTypeIcon = ({ type }: { type: KDSOrder["type"] }) => {
  switch (type) {
    case "dine_in":
      return <UtensilsCrossed className="h-4 w-4" />;
    case "takeaway":
      return <Package className="h-4 w-4" />;
    case "delivery":
      return <Truck className="h-4 w-4" />;
  }
};

export function KDSPage() {
  const { user, signOut } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for elapsed time display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["kds-orders"],
    queryFn: () => kdsApi.getOrders(),
    refetchInterval: 30000, // Refresh every 30 seconds as backup
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ["kds-stats"],
    queryFn: () => kdsApi.getStats(),
    refetchInterval: 30000,
  });

  const orders = ordersData?.data ?? [];
  const stats = statsData?.data;

  // Start preparing mutation
  const startPreparingMutation = useMutation({
    mutationFn: (orderId: string) => kdsApi.startPreparing(orderId),
    onSuccess: (response) => {
      toast.success(`Order #${response.data.orderNumber} is now preparing`);
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      queryClient.invalidateQueries({ queryKey: ["kds-stats"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update order",
      );
    },
  });

  // Mark ready mutation
  const markReadyMutation = useMutation({
    mutationFn: (orderId: string) => kdsApi.markReady(orderId),
    onSuccess: (response) => {
      toast.success(`Order #${response.data.orderNumber} is ready!`);
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      queryClient.invalidateQueries({ queryKey: ["kds-stats"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update order",
      );
    },
  });

  // Socket event handlers
  const handleNewOrder = useCallback(
    (order: KDSOrder) => {
      console.log("[KDS] New order received:", order);
      toast.info(`New order #${order.orderNumber}`, {
        icon: <Bell className="h-4 w-4" />,
      });
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

  // Separate orders by status
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold">Kitchen Display</h1>
            <p className="text-xs text-gray-400">
              {currentTime.toLocaleTimeString()} •{" "}
              {user?.name || "Kitchen Staff"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded bg-yellow-500/20 px-2 py-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{stats?.pending ?? 0}</span>
              <span className="text-gray-400">Pending</span>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-blue-500/20 px-2 py-1">
              <PlayCircle className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{stats?.preparing ?? 0}</span>
              <span className="text-gray-400">Preparing</span>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-green-500/20 px-2 py-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-medium">{stats?.completedToday ?? 0}</span>
              <span className="text-gray-400">Today</span>
            </div>
          </div>

          {/* Connection status */}
          <div
            className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${
              isConnected
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            />
            {isConnected ? "Live" : "Offline"}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pending Orders Column */}
        <div className="flex flex-1 flex-col border-r border-gray-700">
          <div className="flex items-center gap-2 border-b border-gray-700 bg-yellow-500/10 px-4 py-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h2 className="font-semibold text-yellow-500">
              Pending ({pendingOrders.length})
            </h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 bg-gray-700" />
                ))}
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-gray-500">
                <Clock className="mb-2 h-12 w-12 opacity-30" />
                <p>No pending orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStartPreparing={() =>
                      startPreparingMutation.mutate(order.id)
                    }
                    isLoading={startPreparingMutation.isPending}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Preparing Orders Column */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-gray-700 bg-blue-500/10 px-4 py-2">
            <PlayCircle className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold text-blue-500">
              Preparing ({preparingOrders.length})
            </h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 bg-gray-700" />
                ))}
              </div>
            ) : preparingOrders.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-gray-500">
                <PlayCircle className="mb-2 h-12 w-12 opacity-30" />
                <p>No orders being prepared</p>
              </div>
            ) : (
              <div className="space-y-4">
                {preparingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkReady={() => markReadyMutation.mutate(order.id)}
                    isLoading={markReadyMutation.isPending}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({
  order,
  onStartPreparing,
  onMarkReady,
  isLoading,
}: {
  order: KDSOrder;
  onStartPreparing?: () => void;
  onMarkReady?: () => void;
  isLoading?: boolean;
}) {
  const urgencyColor = getUrgencyColor(order.elapsedMinutes, order.status);

  return (
    <Card className={`border-2 ${urgencyColor} bg-gray-800 text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">
            #{order.orderNumber}
          </CardTitle>
          <Badge
            variant="outline"
            className={`${order.status === "preparing" ? "border-blue-500 text-blue-400" : "border-yellow-500 text-yellow-400"}`}
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <OrderTypeIcon type={order.type} />
          {order.tableNumber && <span>Table {order.tableNumber}</span>}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span
              className={
                order.elapsedMinutes >= 10 ? "text-red-400 font-medium" : ""
              }
            >
              {formatElapsedTime(order.elapsedMinutes)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-700 text-sm font-bold">
                {item.quantity}
              </span>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.modifiers.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {item.modifiers.map((m) => m.name).join(", ")}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-orange-400">Note: {item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="rounded bg-orange-500/20 px-3 py-2 text-sm text-orange-300">
            <strong>Order Note:</strong> {order.notes}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {order.status === "pending" && onStartPreparing && (
            <Button
              onClick={onStartPreparing}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Preparing
            </Button>
          )}
          {order.status === "preparing" && onMarkReady && (
            <Button
              onClick={onMarkReady}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Ready
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
