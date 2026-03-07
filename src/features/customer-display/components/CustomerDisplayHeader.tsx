import { Bell, Clock, Wifi, WifiOff } from "lucide-react";

interface CustomerDisplayHeaderProps {
  isConnected: boolean;
  currentTime: Date;
}

export function CustomerDisplayHeader({
  isConnected,
  currentTime,
}: CustomerDisplayHeaderProps) {
  return (
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
  );
}
