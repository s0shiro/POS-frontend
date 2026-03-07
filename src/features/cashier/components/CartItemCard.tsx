import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types";
import { formatCurrency } from "@/lib/currency";

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
    <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium">{item.menuItem.name}</p>
          {item.selectedModifiers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {item.selectedModifiers.map((m) => m.name).join(", ")}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <span className="font-medium">{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
}
