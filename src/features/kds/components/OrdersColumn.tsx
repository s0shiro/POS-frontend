import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="flex flex-1 flex-col">
      <div
        className={`flex items-center gap-2 border-b border-gray-700 ${bgColor} px-4 py-2`}
      >
        <div className={iconColor}>{icon}</div>
        <h2 className={`font-semibold ${iconColor}`}>
          {title} ({count})
        </h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 bg-gray-700" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500">
            <div className="mb-2 opacity-30">{emptyIcon}</div>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
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
      </ScrollArea>
    </div>
  );
}
