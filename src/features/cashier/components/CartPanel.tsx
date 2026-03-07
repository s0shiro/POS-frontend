import type { RefObject } from "react";
import { formatCurrency } from "@/lib/currency";
import type { CartItem, OrderType } from "../types";
import { CartItemCard } from "./CartItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ShoppingCart,
  UtensilsCrossed,
  Package,
  Truck,
  X,
  CreditCard,
} from "lucide-react";

interface CartPanelProps {
  cart: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  orderNotes: string;
  subtotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  tableNumberRef: RefObject<HTMLInputElement | null>;
  onOrderTypeChange: (type: OrderType) => void;
  onTableNumberChange: (value: string) => void;
  onOrderNotesChange: (value: string) => void;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function CartPanel({
  cart,
  orderType,
  tableNumber,
  orderNotes,
  subtotal,
  tax,
  total,
  isProcessing,
  tableNumberRef,
  onOrderTypeChange,
  onTableNumberChange,
  onOrderNotesChange,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
}: CartPanelProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex w-[400px] flex-col h-full border-l bg-card/95 backdrop-blur-sm shadow-xl z-10 overflow-hidden">
      {/* Header */}
      <div className="border-b px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold tracking-tight">Current Order</h2>
          {cart.length > 0 && (
            <Badge
              variant="default"
              className="ml-auto px-2 py-0.5 text-xs font-bold shadow-sm"
            >
              {totalItems} items
            </Badge>
          )}
        </div>
      </div>

      {/* Order Type Selection */}
      <div className="border-b px-4 py-3 bg-card">
        <p className="mb-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Order Type
        </p>
        <ToggleGroup
          type="single"
          value={orderType}
          onValueChange={(value) => {
            if (value) onOrderTypeChange(value as OrderType);
          }}
          className="grid grid-cols-3 gap-1.5"
        >
          <ToggleGroupItem
            value="dine_in"
            variant="outline"
            className="flex-col h-auto py-1.5 gap-1 border-muted-foreground/20 hover:bg-primary/5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all text-xs font-semibold"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Dine In
          </ToggleGroupItem>
          <ToggleGroupItem
            value="takeaway"
            variant="outline"
            className="flex-col h-auto py-1.5 gap-1 border-muted-foreground/20 hover:bg-orange-500/5 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:border-orange-500 transition-all text-xs font-semibold"
          >
            <Package className="h-3.5 w-3.5" />
            Takeaway
          </ToggleGroupItem>
          <ToggleGroupItem
            value="delivery"
            variant="outline"
            className="flex-col h-auto py-1.5 gap-1 border-muted-foreground/20 hover:bg-green-500/5 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:border-green-600 transition-all text-xs font-semibold"
          >
            <Truck className="h-3.5 w-3.5" />
            Delivery
          </ToggleGroupItem>
        </ToggleGroup>
        {orderType === "dine_in" && (
          <div className="mt-2.5 animate-in fade-in slide-in-from-top-2">
            <Input
              ref={tableNumberRef}
              placeholder="Enter Table Number..."
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              className="h-9 text-sm font-bold border-muted-foreground/20 text-center shadow-inner"
            />
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-hidden bg-muted/5">
        <ScrollArea className="h-full">
          {cart.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground/50">
              <ShoppingCart className="mb-4 h-16 w-16" />
              <p className="text-lg font-semibold text-muted-foreground">
                Your cart is empty
              </p>
              <p className="text-sm">
                Select items from the menu to get started
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2.5">
              {cart.map((item, index) => (
                <CartItemCard
                  key={`${item.menuItem.id}-${index}`}
                  item={item}
                  onIncrement={() => onIncrement(index)}
                  onDecrement={() => onDecrement(index)}
                  onRemove={() => onRemove(index)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Order Notes */}
      {cart.length > 0 && (
        <div className="border-t p-4 bg-card">
          <Input
            placeholder="Add order notes (optional)..."
            value={orderNotes}
            onChange={(e) => onOrderNotesChange(e.target.value)}
            className="bg-muted/50 border-muted-foreground/20"
          />
        </div>
      )}

      {/* Totals & Checkout */}
      <div className="mt-auto border-t bg-card pt-5 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="space-y-1.5 text-sm font-medium px-5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (0%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2.5 bg-muted-foreground/20" />
          <div className="flex justify-between text-2xl font-black tracking-tight">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3 px-5 mb-4">
            <Button
              variant="outline"
              className="w-full text-base font-bold shadow-sm h-14 border-red-500/50 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
              size="lg"
              onClick={onClear}
              disabled={cart.length === 0}
              title="Clear cart (F1)"
            >
              <X className="mr-2 h-5 w-5" />
              CLEAR ALL
              <kbd className="ml-2 hidden rounded bg-black/5 text-black/50 dark:bg-black/20 dark:text-white/50 px-2 py-0.5 text-[10px] font-bold sm:inline uppercase">
                F1
              </kbd>
            </Button>
            <Button
              variant="outline"
              className="w-full text-base font-bold shadow-sm h-14 bg-card border-border hover:bg-muted text-foreground"
              size="lg"
              title="Hold Order (F8)"
            >
              HOLD ORDER
              <kbd className="ml-2 hidden rounded bg-black/5 text-black/50 dark:bg-black/20 dark:text-white/50 px-2 py-0.5 text-[10px] font-bold sm:inline uppercase">
                F8
              </kbd>
            </Button>
          </div>

          <Button
            className="w-full h-20 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground text-2xl font-black tracking-tight shadow-none"
            size="lg"
            onClick={onCheckout}
            disabled={cart.length === 0 || isProcessing}
            title="Checkout (F9)"
          >
            <CreditCard className="mr-3 h-7 w-7" />
            PAY NOW {cart.length > 0 && `• ${formatCurrency(total)}`}
            <kbd className="ml-3 hidden rounded bg-black/20 text-white/80 px-2.5 py-1 text-xs font-bold sm:inline uppercase">
              F9
            </kbd>
          </Button>
        </div>
      </div>
    </div>
  );
}
