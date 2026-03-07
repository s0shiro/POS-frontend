import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  StickyNote,
  AlertCircle,
} from "lucide-react";
import type { KDSOrder } from "../types";
import { formatElapsedTime, getUrgencyColor } from "../helpers";
import { OrderTypeIcon } from "../utils";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: KDSOrder;
  onStartPreparing?: () => void;
  onMarkReady?: () => void;
  isLoading?: boolean;
}

export function OrderCard({
  order,
  onStartPreparing,
  onMarkReady,
  isLoading,
}: OrderCardProps) {
  const urgencyClasses = getUrgencyColor(order.elapsedMinutes, order.status);
  const isUrgent = order.elapsedMinutes >= 10 && order.status !== "preparing";

  return (
    <Card className="flex flex-col overflow-hidden shadow-md transition-shadow hover:shadow-lg h-full border-2 p-0">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b border-border/50 rounded-t-xl",
          urgencyClasses,
        )}
      >
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
            {order.orderNumber}
            {isUrgent && (
              <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
            )}
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-background/80 backdrop-blur-sm shadow-sm capitalize font-bold"
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm font-medium">
          <div className="flex items-center gap-1.5 opacity-90">
            <OrderTypeIcon type={order.type} />
            {order.tableNumber && <span>Table {order.tableNumber}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span
              className={cn(
                "tabular-nums",
                isUrgent ? "font-bold text-red-600 dark:text-red-400" : "",
              )}
            >
              {formatElapsedTime(order.elapsedMinutes)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 p-4">
        {order.notes && (
          <div className="flex items-start gap-2 rounded-md bg-orange-50 dark:bg-orange-950/30 p-3 text-sm text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-900/50">
            <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-tight">
              <span className="font-semibold block mb-0.5">Order Note</span>
              {order.notes}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 text-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted font-bold shadow-sm border border-border/50">
                {item.quantity}
              </div>
              <div className="flex-1 space-y-1 pt-1">
                <p className="font-semibold leading-none">{item.name}</p>
                {item.modifiers.length > 0 && (
                  <ul className="text-muted-foreground space-y-0.5 mt-1.5">
                    {item.modifiers.map((m) => (
                      <li
                        key={m.name}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <span className="h-1 w-1 rounded-full bg-border" />
                        {m.name}
                      </li>
                    ))}
                  </ul>
                )}
                {item.notes && (
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <div className="p-4 pt-0 mt-auto">
        {order.status === "pending" && onStartPreparing && (
          <Button
            size="lg"
            onClick={onStartPreparing}
            disabled={isLoading}
            className="w-full font-bold shadow-sm"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && onMarkReady && (
          <Button
            size="lg"
            onClick={onMarkReady}
            disabled={isLoading}
            variant="default"
            className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold shadow-sm text-white"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Mark Ready
          </Button>
        )}
      </div>
    </Card>
  );
}
