import { io, Socket } from "socket.io-client";
import { authClient } from "./auth";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  if (socket?.connected) {
    return socket;
  }

  // Generate one-time token for WebSocket auth
  const { data, error } = await authClient.oneTimeToken.generate();

  if (error || !data?.token) {
    throw new Error("Failed to generate socket auth token");
  }

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    auth: { token: data.token },
  });

  return new Promise((resolve, reject) => {
    socket!.on("connect", () => {
      console.log("Socket connected:", socket!.id);
      resolve(socket!);
    });

    socket!.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      reject(err);
    });
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
