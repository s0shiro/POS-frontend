import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CalledOrder } from "../utils";
import { OrderTypeIcon } from "../utils";
import { formatTime } from "../helpers";

interface CalledOrderCardProps {
  order: CalledOrder;
  isNewest: boolean;
}

export function CalledOrderCard({ order, isNewest }: CalledOrderCardProps) {
  return (
    <Card
      className={`relative overflow-hidden border-2 transition-all duration-500 ${
        isNewest
          ? "animate-pulse border-green-400 bg-green-500/20 shadow-lg shadow-green-500/30"
          : "border-gray-600 bg-gray-800/50"
      }`}
    >
      {/* New order indicator */}
      {isNewest && (
        <div className="absolute right-2 top-2">
          <Badge className="animate-bounce bg-green-500 text-white">NEW</Badge>
        </div>
      )}

      <div className="p-6 text-center">
        {/* Order number - large and prominent */}
        <div
          className={`text-6xl font-bold ${
            isNewest ? "text-green-400" : "text-white"
          }`}
        >
          {order.orderNumber}
        </div>

        {/* Table number if dine-in */}
        {order.tableNumber && (
          <div className="mt-3">
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-300 text-lg px-4 py-1"
            >
              Table {order.tableNumber}
            </Badge>
          </div>
        )}

        {/* Order type */}
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
          <OrderTypeIcon type={order.type} />
          <span className="capitalize">{order.type.replace("_", " ")}</span>
        </div>

        {/* Time called */}
        <div className="mt-2 text-sm text-gray-500">
          Called at {formatTime(order.calledAt)}
        </div>
      </div>
    </Card>
  );
}
