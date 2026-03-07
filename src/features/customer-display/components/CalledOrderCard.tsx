import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
      className={cn(
        "relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center p-0",
        isNewest
          ? "animate-[pulse_3s_ease-in-out_infinite] border-[3px] border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105 z-10"
          : "border-2 bg-card hover:bg-accent/10",
      )}
    >
      {/* New order indicator */}
      {isNewest && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold h-7 px-3 text-sm tracking-wider shadow-sm animate-bounce">
            NEW
          </Badge>
        </div>
      )}

      <CardContent className="p-8 text-center flex flex-col items-center w-full">
        {/* Order number - large and prominent */}
        <div
          className={cn(
            "text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-6",
            isNewest
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground",
          )}
        >
          #{order.orderNumber.replace(/^#/, "")}
        </div>

        {/* Table number if dine-in */}
        {order.tableNumber && (
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xl md:text-2xl font-bold px-6 py-2 mb-6 border border-blue-200 dark:border-blue-500/30"
          >
            Table {order.tableNumber}
          </Badge>
        )}

        <div className="flex flex-col items-center gap-3 w-full bg-muted/50 rounded-xl p-4 mt-auto border">
          {/* Order type */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 font-bold text-lg",
              isNewest
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-muted-foreground",
            )}
          >
            <OrderTypeIcon type={order.type} />
            <span className="capitalize">{order.type.replace("_", " ")}</span>
          </div>

          {/* Time called */}
          <div className="text-sm font-semibold tracking-wide text-muted-foreground/80 lowercase">
            CALLED AT {formatTime(order.calledAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
