import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KDSOrder } from "../types";
import { OrderCard } from "./OrderCard";

interface OrdersColumnProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  orders: KDSOrder[];
  isLoading: boolean;
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  onOrderAction?: (orderId: string) => void;
  isActionPending?: boolean;
}

export function OrdersColumn({
  title,
  count,
  icon,
  iconColor,
  bgColor,
  orders,
  isLoading,
  emptyIcon,
  emptyMessage,
  onOrderAction,
  isActionPending,
}: OrdersColumnProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-between border-b px-6 py-4",
          bgColor,
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md bg-background",
              iconColor,
            )}
          >
            {icon}
          </div>
          <h2 className={cn("text-lg font-semibold tracking-tight", iconColor)}>
            {title}
          </h2>
        </div>
        <Badge variant="secondary" className="text-sm font-bold shadow-sm">
          {count} {count === 1 ? "Order" : "Orders"}
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <div className="mb-4 opacity-20">{emptyIcon}</div>
              <p className="text-lg font-medium">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStartPreparing={
                    order.status === "pending" && onOrderAction
                      ? () => onOrderAction(order.id)
                      : undefined
                  }
                  onMarkReady={
                    order.status === "preparing" && onOrderAction
                      ? () => onOrderAction(order.id)
                      : undefined
                  }
                  isLoading={isActionPending}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
