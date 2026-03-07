import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Megaphone } from "lucide-react";
import type { Order } from "@/features/orders";
import { formatCurrency } from "@/lib/currency";
import { formatTime } from "../helpers";
import { OrderTypeDisplay } from "../utils";

interface ReadyOrderCardProps {
  order: Order;
  isCalled: boolean;
  onCallOrder: (order: Order) => void;
  onUncallOrder: (order: Order) => void;
  onCompleteOrder: (orderId: string) => void;
  isCompletePending: boolean;
}

export function ReadyOrderCard({
  order,
  isCalled,
  onCallOrder,
  onUncallOrder,
  onCompleteOrder,
  isCompletePending,
}: ReadyOrderCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        isCalled
          ? "border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 shadow-lg ring-2 ring-yellow-300 dark:ring-yellow-500/30"
          : "border-2 border-green-500 bg-green-50 dark:bg-green-500/10"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {order.orderNumber}
            </CardTitle>
            {order.tableNumber && (
              <Badge variant="secondary" className="mt-1">
                Table {order.tableNumber}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <OrderTypeDisplay type={order.type} />
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Order items */}
        <div className="max-h-32 overflow-y-auto rounded-lg bg-card p-2">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-1 text-sm"
            >
              <div className="flex-1">
                <span className="font-medium">
                  {item.quantity}x {item.menuItem?.name}
                </span>
                {item.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    {item.notes}
                  </p>
                )}
                {item.selectedModifiers &&
                  (
                    item.selectedModifiers as {
                      name: string;
                      price: number;
                    }[]
                  ).length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {(
                        item.selectedModifiers as {
                          name: string;
                          price: number;
                        }[]
                      )
                        .map((m) => m.name)
                        .join(", ")}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Order notes */}
        {order.notes && (
          <div className="rounded-lg bg-amber-100 dark:bg-amber-500/15 p-2 text-sm">
            <span className="font-medium">Note:</span> {order.notes}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-bold">
            {formatCurrency(parseFloat(order.totalAmount))}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isCalled ? (
            <Button
              variant="secondary"
              className="flex-1 animate-pulse bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-500/30 dark:hover:bg-yellow-500/40 dark:text-yellow-200"
              onClick={() => onUncallOrder(order)}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Called! (Tap to hide)
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCallOrder(order)}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Call Order
            </Button>
          )}
          <Button
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onCompleteOrder(order.id)}
            disabled={isCompletePending}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
