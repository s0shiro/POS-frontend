import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Ready Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orderCount} order{orderCount !== 1 ? "s" : ""} ready for pickup
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status */}
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
            isConnected
              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {isConnected ? "Live" : "Offline"}
        </div>

        {/* Refresh button */}
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
