import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAuth } from "@/lib/AuthContext";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    connectSocket()
      .then((s) => {
        setSocket(s);
        setIsConnected(true);
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  return { socket, isConnected, error };
}
