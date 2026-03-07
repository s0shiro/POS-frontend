import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  UtensilsCrossed,
  Package,
  Truck,
  Bell,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";

// WebSocket must connect directly to backend (can't be proxied through Vercel)
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "";

interface CalledOrder {
  id: string;
  orderNumber: string;
  tableNumber: string | null;
  type: string;
  calledAt: string;
}

// Get order type icon
const OrderTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "dine_in":
      return <UtensilsCrossed className="h-6 w-6" />;
    case "takeaway":
      return <Package className="h-6 w-6" />;
    case "delivery":
      return <Truck className="h-6 w-6" />;
    default:
      return <UtensilsCrossed className="h-6 w-6" />;
  }
};

// Format time
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function CustomerDisplayPage() {
  const [calledOrders, setCalledOrders] = useState<CalledOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Handle new called order
  const handleOrderCalled = useCallback(
    (order: CalledOrder) => {
      console.log("[CustomerDisplay] Order called:", order);
      setCalledOrders((prev) => {
        // Avoid duplicates
        if (prev.some((o) => o.id === order.id)) {
          return prev;
        }
        return [order, ...prev];
      });
      playSound();
    },
    [playSound],
  );

  // Handle order uncalled (removed from display)
  const handleOrderUncalled = useCallback(
    (data: { id: string; orderNumber: string }) => {
      console.log("[CustomerDisplay] Order uncalled:", data);
      setCalledOrders((prev) => prev.filter((o) => o.id !== data.id));
    },
    [],
  );

  // Handle order completed (removed from display)
  const handleOrderCompleted = useCallback(
    (data: { id: string; orderNumber: string }) => {
      console.log("[CustomerDisplay] Order completed:", data);
      setCalledOrders((prev) => prev.filter((o) => o.id !== data.id));
    },
    [],
  );

  // Connect to customer display namespace (no auth required)
  useEffect(() => {
    const socket = io(`${SOCKET_URL}/customer-display`, {
      transports: ["polling", "websocket"],
      withCredentials: false,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[CustomerDisplay] Connected to socket");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[CustomerDisplay] Disconnected from socket");
      setIsConnected(false);
    });

    // Receive existing called orders on connect/reconnect
    socket.on("order:initial-state", (orders: CalledOrder[]) => {
      console.log(
        "[CustomerDisplay] Received initial state:",
        orders.length,
        "orders",
      );
      setCalledOrders((prev) => {
        const existingIds = new Set(prev.map((o) => o.id));
        const newOrders = orders.filter((o) => !existingIds.has(o.id));
        return [...newOrders, ...prev];
      });
    });

    socket.on("order:called", handleOrderCalled);
    socket.on("order:uncalled", handleOrderUncalled);
    socket.on("order:completed", handleOrderCompleted);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order:initial-state");
      socket.off("order:called", handleOrderCalled);
      socket.off("order:uncalled", handleOrderUncalled);
      socket.off("order:completed", handleOrderCompleted);
      socket.disconnect();
    };
  }, [handleOrderCalled, handleOrderUncalled, handleOrderCompleted]);

  // Auto-remove orders after 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setCalledOrders((prev) =>
        prev.filter(
          (order) => new Date(order.calledAt).getTime() > fiveMinutesAgo,
        ),
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Bell className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Order Ready</h1>
              <p className="text-sm text-gray-400">
                Please collect your order when your number is called
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Connection status */}
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                isConnected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {isConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              {isConnected ? "Connected" : "Reconnecting..."}
            </div>

            {/* Current time */}
            <div className="flex items-center gap-2 text-xl font-mono text-gray-300">
              <Clock className="h-5 w-5" />
              {currentTime.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-8">
        {calledOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-800">
              <Bell className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="mt-8 text-3xl font-semibold text-gray-400">
              Waiting for orders...
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Your order number will appear here when ready
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {calledOrders.map((order, index) => (
              <Card
                key={order.id}
                className={`relative overflow-hidden border-2 transition-all duration-500 ${
                  index === 0
                    ? "animate-pulse border-green-400 bg-green-500/20 shadow-lg shadow-green-500/30"
                    : "border-gray-600 bg-gray-800/50"
                }`}
              >
                {/* New order indicator */}
                {index === 0 && (
                  <div className="absolute right-2 top-2">
                    <Badge className="animate-bounce bg-green-500 text-white">
                      NEW
                    </Badge>
                  </div>
                )}

                <div className="p-6 text-center">
                  {/* Order number - large and prominent */}
                  <div
                    className={`text-6xl font-bold ${
                      index === 0 ? "text-green-400" : "text-white"
                    }`}
                  >
                    {order.orderNumber}
                  </div>

                  {/* Table number if dine-in */}
                  {order.tableNumber && (
                    <div className="mt-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 text-lg px-4 py-1"
                      >
                        Table {order.tableNumber}
                      </Badge>
                    </div>
                  )}

                  {/* Order type */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                    <OrderTypeIcon type={order.type} />
                    <span className="capitalize">
                      {order.type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Time called */}
                  <div className="mt-2 text-sm text-gray-500">
                    Called at {formatTime(order.calledAt)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer with instructions */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-8 px-8 py-4 text-gray-400">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-blue-400" />
            <span>Dine In - Serve to table</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-400" />
            <span>Takeaway - Pickup counter</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-400" />
            <span>Delivery - Waiting area</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
