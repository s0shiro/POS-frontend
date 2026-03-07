import { Bell, Clock, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomerDisplayHeaderProps {
  isConnected: boolean;
  currentTime: Date;
}

export function CustomerDisplayHeader({
  isConnected,
  currentTime,
}: CustomerDisplayHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-xl shadow-sm z-10">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50 shadow-inner">
            <Bell className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-1">
              Order Ready
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Please collect your order when your number is called
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Connection status */}
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-base font-semibold border shadow-sm",
              isConnected
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50",
            )}
          >
            {isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {isConnected ? "Connected" : "Reconnecting..."}
          </Badge>

          {/* Current time */}
          <div className="flex items-center gap-2 text-3xl font-black tabular-nums tracking-tighter text-foreground/80 bg-muted/50 px-4 py-2 rounded-xl border">
            <Clock className="h-6 w-6 text-muted-foreground mb-0.5" />
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
