import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReadyOrdersHeaderProps {
  orderCount: number;
  isConnected: boolean;
  onRefresh: () => void;
}

export function ReadyOrdersHeader({
  orderCount,
  isConnected,
  onRefresh,
}: ReadyOrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50 shadow-inner">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-0.5">
            Ready Orders
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
              {orderCount}
            </span>
            order{orderCount !== 1 ? "s" : ""} waiting for pickup
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border shadow-sm",
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
          className="shadow-sm hover:text-primary transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
