import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Clock,
  PlayCircle,
  CheckCircle2,
  LogOut,
  RefreshCw,
} from "lucide-react";

interface KDSHeaderProps {
  currentTime: Date;
  userName: string;
  stats: {
    pending: number;
    preparing: number;
    completedToday: number;
  };
  isConnected: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function KDSHeader({
  currentTime,
  userName,
  stats,
  isConnected,
  onRefresh,
  onLogout,
}: KDSHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-3">
      <div className="flex items-center gap-3">
        <ChefHat className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-xl font-bold">Kitchen Display</h1>
          <p className="text-xs text-gray-400">
            {currentTime.toLocaleTimeString()} • {userName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1.5 rounded bg-yellow-500/20 px-2 py-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{stats.pending}</span>
            <span className="text-gray-400">Pending</span>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-blue-500/20 px-2 py-1">
            <PlayCircle className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{stats.preparing}</span>
            <span className="text-gray-400">Preparing</span>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-green-500/20 px-2 py-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="font-medium">{stats.completedToday}</span>
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
          onClick={onRefresh}
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-gray-400 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
