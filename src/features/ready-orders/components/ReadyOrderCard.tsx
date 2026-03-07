import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Megaphone, StickyNote } from "lucide-react";
import type { Order } from "@/features/orders";
import { formatCurrency } from "@/lib/currency";
import { formatTime } from "../helpers";
import { OrderTypeDisplay } from "../utils";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 border-2 p-0",
        isCalled
          ? "border-amber-400 dark:border-amber-500/50 bg-amber-50/30 dark:bg-amber-500/5 shadow-[0_0_15px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/50"
          : "border-emerald-500/30 bg-card hover:border-emerald-500/60 hover:shadow-md",
      )}
    >
      <CardHeader
        className={cn(
          "pb-4 px-5 pt-5 border-b border-border/50 rounded-t-xl",
          isCalled ? "bg-amber-100/50 dark:bg-amber-500/10" : "bg-muted/30",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-3xl font-black tracking-tight leading-none text-foreground flex items-center gap-2">
              #{order.orderNumber.replace(/^#/, "")}
              {isCalled && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </CardTitle>
            {order.tableNumber && (
              <Badge
                variant="secondary"
                className="w-fit font-bold border shadow-sm"
              >
                Table {order.tableNumber}
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <OrderTypeDisplay type={order.type} />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded-md border shadow-sm">
              <Clock className="h-3.5 w-3.5 text-foreground/70" />
              {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 p-5">
        {/* Order items */}
        <div className="flex-1 space-y-3 max-h-[12rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted font-bold border border-border/50 shadow-sm text-foreground">
                {item.quantity}
              </div>
              <div className="flex-1 pt-1 space-y-1 leading-none">
                <span className="font-semibold text-base">
                  {item.menuItem?.name}
                </span>
                {item.selectedModifiers &&
                  (item.selectedModifiers as { name: string; price: number }[])
                    .length > 0 && (
                    <ul className="text-muted-foreground space-y-0.5 mt-1.5">
                      {(
                        item.selectedModifiers as {
                          name: string;
                          price: number;
                        }[]
                      ).map((m) => (
                        <li
                          key={m.name}
                          className="flex items-center gap-1.5 text-xs font-medium"
                        >
                          <span className="h-1 w-1 rounded-full bg-border" />
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  )}
                {item.notes && (
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1 italic">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order notes */}
        {order.notes && (
          <div className="flex items-start gap-2 rounded-md bg-orange-50 dark:bg-orange-950/30 p-3 text-sm text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-900/50">
            <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-tight">
              <span className="font-semibold block mb-0.5">Order Note</span>
              {order.notes}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4 p-5 pt-0 mt-auto border-t bg-muted/10">
        <div className="flex items-center justify-between w-full pt-4">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total
          </span>
          <span className="text-xl font-black tracking-tight text-foreground">
            {formatCurrency(parseFloat(order.totalAmount))}
          </span>
        </div>

        <div className="flex gap-3 w-full">
          {isCalled ? (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 dark:border-amber-700/50 dark:text-amber-100 font-bold shadow-sm transition-colors"
              onClick={() => onUncallOrder(order)}
            >
              <Megaphone className="mr-2 h-5 w-5" />
              Hide
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 font-bold shadow-sm border-2 hover:bg-muted"
              onClick={() => onCallOrder(order)}
            >
              <Megaphone className="mr-2 h-5 w-5 text-foreground/70" />
              Call
            </Button>
          )}
          <Button
            variant="default"
            size="lg"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
            onClick={() => onCompleteOrder(order.id)}
            disabled={isCompletePending}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Finish
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
