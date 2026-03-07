import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { CalledOrder } from "../utils";

// WebSocket must connect directly to backend (can't be proxied through Vercel)
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "";

export function useCustomerDisplaySocket() {
  const [calledOrders, setCalledOrders] = useState<CalledOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return { calledOrders, isConnected };
}
