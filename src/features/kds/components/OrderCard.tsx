import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle2, Clock } from "lucide-react";
import type { KDSOrder } from "../types";
import { formatElapsedTime, getUrgencyColor } from "../helpers";
import { OrderTypeIcon } from "../utils";

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
  const urgencyColor = getUrgencyColor(order.elapsedMinutes, order.status);

  return (
    <Card className={`border-2 ${urgencyColor} bg-gray-800 text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">
            #{order.orderNumber}
          </CardTitle>
          <Badge
            variant="outline"
            className={`${order.status === "preparing" ? "border-blue-500 text-blue-400" : "border-yellow-500 text-yellow-400"}`}
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <OrderTypeIcon type={order.type} />
          {order.tableNumber && <span>Table {order.tableNumber}</span>}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span
              className={
                order.elapsedMinutes >= 10 ? "text-red-400 font-medium" : ""
              }
            >
              {formatElapsedTime(order.elapsedMinutes)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-700 text-sm font-bold">
                {item.quantity}
              </span>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.modifiers.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {item.modifiers.map((m) => m.name).join(", ")}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-orange-400">Note: {item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="rounded bg-orange-500/20 px-3 py-2 text-sm text-orange-300">
            <strong>Order Note:</strong> {order.notes}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {order.status === "pending" && onStartPreparing && (
            <Button
              onClick={onStartPreparing}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Preparing
            </Button>
          )}
          {order.status === "preparing" && onMarkReady && (
            <Button
              onClick={onMarkReady}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Ready
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
