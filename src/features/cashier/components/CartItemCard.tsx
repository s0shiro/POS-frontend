import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types";
import { formatCurrency } from "@/lib/currency";
import { Card } from "@/components/ui/card";

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  const itemPrice = parseFloat(item.menuItem.price);
  const modifiersPrice = item.selectedModifiers.reduce(
    (sum, mod) => sum + mod.price,
    0,
  );
  const totalPrice = (itemPrice + modifiersPrice) * item.quantity;

  return (
    <Card className="flex flex-col p-3 shadow-sm border-muted-foreground/10 hover:border-primary/20 transition-all bg-card relative group overflow-hidden">
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors pr-2">
              {item.menuItem.name}
            </p>
            <span className="font-black text-foreground text-sm tabular-nums tracking-tight">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {item.selectedModifiers.length > 0 && (
            <div className="mt-1.5 space-y-1 bg-muted/30 rounded-md p-1.5 border border-muted-foreground/10">
              {item.selectedModifiers.map((m, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-[11px] font-medium text-muted-foreground"
                >
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/50" />
                    {m.name}
                  </span>
                  {m.price > 0 && (
                    <span className="tabular-nums opacity-80">
                      +{formatCurrency(m.price * item.quantity)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 border border-muted-foreground/10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-background hover:text-foreground shadow-sm rounded-md active:scale-95 transition-all bg-background/50"
            onClick={onDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-black tabular-nums">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-background hover:text-primary shadow-sm rounded-md active:scale-95 transition-all bg-background/50"
            onClick={onIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
          onClick={onRemove}
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Decorative gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
}
