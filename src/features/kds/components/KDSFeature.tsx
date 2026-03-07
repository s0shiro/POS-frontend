import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import {
  useKDSOrders,
  useKDSStats,
  useStartPreparing,
  useMarkReady,
} from "../api/useKDS";
import { useKDSSocket } from "../hooks/useKDSSocket";
import { KDSHeader } from "./KDSHeader";
import { OrdersColumn } from "./OrdersColumn";
import { Clock, PlayCircle } from "lucide-react";
import { toast } from "sonner";

export function KDSFeature() {
  const { user, signOut } = useAuth();
  const { socket, isConnected } = useSocket();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for elapsed time display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch orders
  const { data: ordersData, isLoading, refetch } = useKDSOrders();

  // Fetch stats
  const { data: statsData } = useKDSStats();

  const orders = ordersData?.data ?? [];
  const stats = statsData?.data ?? {
    pending: 0,
    preparing: 0,
    completedToday: 0,
  };

  // Start preparing mutation
  const startPreparingMutation = useStartPreparing();

  // Mark ready mutation
  const markReadyMutation = useMarkReady();

  // Register socket listeners
  useKDSSocket(socket);

  // Separate orders by status
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");

  // Action handlers
  const handleStartPreparing = (orderId: string) => {
    startPreparingMutation.mutate(orderId, {
      onSuccess: (response) => {
        toast.success(`Order #${response.data.orderNumber} is now preparing`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to update order",
        );
      },
    });
  };

  const handleMarkReady = (orderId: string) => {
    markReadyMutation.mutate(orderId, {
      onSuccess: (response) => {
        toast.success(`Order #${response.data.orderNumber} is ready!`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to update order",
        );
      },
    });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      <KDSHeader
        currentTime={currentTime}
        userName={user?.name || "Kitchen Staff"}
        stats={stats}
        isConnected={isConnected}
        onRefresh={refetch}
        onLogout={signOut}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pending Orders Column */}
        <div className="flex flex-1 border-r border-gray-700">
          <OrdersColumn
            title="Pending"
            count={pendingOrders.length}
            icon={<Clock className="h-5 w-5" />}
            iconColor="text-yellow-500"
            bgColor="bg-yellow-500/10"
            orders={pendingOrders}
            isLoading={isLoading}
            emptyIcon={<Clock className="h-12 w-12" />}
            emptyMessage="No pending orders"
            onOrderAction={handleStartPreparing}
            isActionPending={startPreparingMutation.isPending}
          />
        </div>

        {/* Preparing Orders Column */}
        <OrdersColumn
          title="Preparing"
          count={preparingOrders.length}
          icon={<PlayCircle className="h-5 w-5" />}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
          orders={preparingOrders}
          isLoading={isLoading}
          emptyIcon={<PlayCircle className="h-12 w-12" />}
          emptyMessage="No orders being prepared"
          onOrderAction={handleMarkReady}
          isActionPending={markReadyMutation.isPending}
        />
      </div>
    </div>
  );
}
