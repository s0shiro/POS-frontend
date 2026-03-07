import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Clock,
  PlayCircle,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="flex items-center justify-between border-b bg-card/50 backdrop-blur-xl px-6 py-4 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ChefHat className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight leading-none mb-1">
            Kitchen Display
          </h1>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span className="tabular-nums bg-muted px-2 py-0.5 rounded-md text-foreground">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="font-semibold">{userName}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Stats */}
        <div className="flex gap-2 text-sm bg-muted/50 p-1.5 rounded-lg border">
          <div className="flex items-center gap-2 rounded-md bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 px-3 py-1.5 font-medium border border-amber-200/50 dark:border-amber-900/50">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-amber-700 dark:text-amber-400 font-bold">
              {stats.pending}
            </span>
            <span className="opacity-80">Pending</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-200 px-3 py-1.5 font-medium border border-blue-200/50 dark:border-blue-900/50">
            <PlayCircle className="h-4 w-4 text-blue-500" />
            <span className="text-blue-700 dark:text-blue-400 font-bold">
              {stats.preparing}
            </span>
            <span className="opacity-80">Preparing</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 px-3 py-1.5 font-medium border border-emerald-200/50 dark:border-emerald-900/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {stats.completedToday}
            </span>
            <span className="opacity-80">Today</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l pl-6">
          {/* Connection status */}
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-sm font-semibold border shadow-sm",
              isConnected
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50",
            )}
          >
            {isConnected ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            {isConnected ? "Connected" : "Offline"}
          </Badge>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="text-muted-foreground hover:text-foreground shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={onLogout}
            className="shadow-sm font-bold"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
