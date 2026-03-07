import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoriesApi,
  menuItemsApi,
  ordersApi,
  getImageUrl,
  type MenuItem,
  type Modifier,
  type CreateOrderPayload,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  UtensilsCrossed,
  Package,
  Truck,
  X,
  Maximize,
  Minimize,
  Lock,
  Unlock,
} from "lucide-react";

// Currency formatter for Philippine Peso
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

// Types for cart
interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  selectedModifiers: { id: string; name: string; price: number }[];
}

type OrderType = "dine_in" | "takeaway" | "delivery";
type PaymentMethod = "cash" | "card" | "digital_wallet";

export function CashierPage() {
  const queryClient = useQueryClient();

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dialogContainer, setDialogContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all",
  );
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [receivedAmount, setReceivedAmount] = useState("");

  // Refs
  const tableNumberRef = useRef<HTMLInputElement>(null);

  // Set dialog container when component mounts
  useEffect(() => {
    setDialogContainer(containerRef.current);
  }, []);

  // Fullscreen handlers
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        toast.error("Failed to enter fullscreen mode");
      }
    } else {
      if (!isLocked) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        toast.warning("Fullscreen is locked. Unlock to exit.", {
          description: "Click the lock icon to unlock",
        });
      }
    }
  }, [isLocked]);

  const toggleLock = useCallback(() => {
    if (!isFullscreen) {
      toast.info("Enter fullscreen first to lock");
      return;
    }
    setIsLocked((prev) => !prev);
    toast.success(isLocked ? "Fullscreen unlocked" : "Fullscreen locked");
  }, [isFullscreen, isLocked]);

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen && isLocked) {
        // Re-enter fullscreen if locked
        containerRef.current?.requestFullscreen().catch(() => {
          setIsLocked(false);
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(isCurrentlyFullscreen);
        if (!isCurrentlyFullscreen) {
          setIsLocked(false);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isLocked]);

  // Queries
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: menuItemsData, isLoading: menuItemsLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => menuItemsApi.getAll({ isAvailable: true }),
  });

  const categories = categoriesData?.data ?? [];

  // Filter menu items
  const filteredItems = useMemo(() => {
    const items = menuItemsData?.data ?? [];
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItemsData?.data, selectedCategory, searchQuery]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemPrice = parseFloat(item.menuItem.price);
      const modifiersPrice = item.selectedModifiers.reduce(
        (mSum, mod) => mSum + mod.price,
        0,
      );
      return sum + (itemPrice + modifiersPrice) * item.quantity;
    }, 0);
  }, [cart]);

  const tax = subtotal * 0; // 0% tax
  const total = subtotal + tax;

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      return response.data;
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: { method: PaymentMethod; tax: number; receivedAmount?: number };
    }) => ordersApi.createPayment(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Handlers
  const handleAddToCart = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      setSelectedItem(item);
      setSelectedModifiers([]);
      setModifierDialogOpen(true);
    } else {
      addItemToCart(item, []);
    }
  };

  const addItemToCart = (
    item: MenuItem,
    modifiers: { id: string; name: string; price: number }[],
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.menuItem.id === item.id &&
          JSON.stringify(cartItem.selectedModifiers) ===
            JSON.stringify(modifiers),
      );

      if (existingIndex >= 0) {
        return prev.map((cartItem, i) =>
          i === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [
        ...prev,
        { menuItem: item, quantity: 1, selectedModifiers: modifiers },
      ];
    });
  };

  const handleConfirmModifiers = () => {
    if (!selectedItem) return;

    const modifiersForCart = selectedModifiers.map((mod) => ({
      id: mod.id,
      name: mod.name,
      price: parseFloat(mod.priceAdjustment),
    }));

    addItemToCart(selectedItem, modifiersForCart);
    setModifierDialogOpen(false);
    setSelectedItem(null);
    setSelectedModifiers([]);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const newQuantity = prev[index].quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item,
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setTableNumber("");
    setOrderNotes("");
    setOrderType("dine_in");
  }, []);

  // Keyboard shortcuts
  const handleKeyboardShortcuts = useCallback(
    (e: KeyboardEvent) => {
      // Enter - Confirm payment (works even in input fields when payment dialog is open)
      if (e.key === "Enter" && paymentDialogOpen) {
        // For cash payments, check if amount is sufficient
        if (paymentMethod === "cash") {
          if (!receivedAmount || parseFloat(receivedAmount) < total) {
            return; // Don't proceed if insufficient amount
          }
        }
        e.preventDefault();
        // Trigger payment via the button click
        const confirmBtn = document.querySelector(
          "[data-confirm-payment]",
        ) as HTMLButtonElement;
        if (confirmBtn && !confirmBtn.disabled) {
          confirmBtn.click();
        }
        return;
      }

      // F9 - Open checkout/payment dialog (works from input fields)
      if (e.key === "F9") {
        e.preventDefault();
        if (!paymentDialogOpen && cart.length > 0) {
          if (orderType === "dine_in" && !tableNumber) {
            toast.error("Please enter a table number for dine-in orders");
            tableNumberRef.current?.focus();
            return;
          }
          setPaymentDialogOpen(true);
        }
        return;
      }

      // F1 - Clear cart (works from input fields)
      if (e.key === "F1") {
        e.preventDefault();
        if (cart.length > 0) {
          clearCart();
          toast.info("Cart cleared");
        }
        return;
      }

      // Escape - Close dialogs (works from input fields)
      if (e.key === "Escape") {
        if (paymentDialogOpen) {
          setPaymentDialogOpen(false);
        }
        if (modifierDialogOpen) {
          setModifierDialogOpen(false);
        }
        return;
      }

      // F11 - Toggle fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Don't trigger other shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
    },
    [
      cart.length,
      orderType,
      tableNumber,
      paymentDialogOpen,
      modifierDialogOpen,
      paymentMethod,
      receivedAmount,
      total,
      clearCart,
      toggleFullscreen,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (orderType === "dine_in" && !tableNumber) {
      toast.error("Please enter a table number for dine-in orders");
      tableNumberRef.current?.focus();
      return;
    }

    setPaymentDialogOpen(true);
  };

  const handlePayment = async () => {
    try {
      // Create order
      const orderPayload: CreateOrderPayload = {
        type: orderType,
        tableNumber: orderType === "dine_in" ? tableNumber : undefined,
        notes: orderNotes || undefined,
        items: cart.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          notes: item.notes,
          selectedModifiers:
            item.selectedModifiers.length > 0
              ? item.selectedModifiers
              : undefined,
        })),
      };

      const orderResponse = await createOrderMutation.mutateAsync(orderPayload);
      const orderId = orderResponse.data.id;

      // Create payment
      await createPaymentMutation.mutateAsync({
        orderId,
        data: {
          method: paymentMethod,
          tax: 0, // 0% tax rate
          receivedAmount:
            paymentMethod === "cash" && receivedAmount
              ? parseFloat(receivedAmount)
              : undefined,
        },
      });

      toast.success(
        `Order #${orderResponse.data.orderNumber} placed successfully!`,
      );
      setPaymentDialogOpen(false);
      setReceivedAmount("");
      clearCart();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
    }
  };

  const changeAmount =
    paymentMethod === "cash" && receivedAmount
      ? parseFloat(receivedAmount) - total
      : 0;

  return (
    <div
      ref={containerRef}
      className={`flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-7rem)] -m-4 md:-m-6"} ${isFullscreen ? "bg-background" : ""}`}
    >
      {/* Toaster for fullscreen mode */}
      {isFullscreen && <Toaster position="top-right" richColors />}

      {/* Left Panel - Menu Items */}
      <div className="flex flex-1 flex-col overflow-hidden border-r">
        {/* Search & Fullscreen Controls */}
        <div className="border-b bg-card p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              title={
                isFullscreen
                  ? "Exit fullscreen (locked: click unlock first)"
                  : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            {isFullscreen && (
              <Button
                variant={isLocked ? "destructive" : "outline"}
                size="icon"
                onClick={toggleLock}
                title={isLocked ? "Unlock fullscreen" : "Lock fullscreen"}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="border-b bg-card">
          {categoriesLoading ? (
            <div className="flex gap-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
            </div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap border-none">
              <div className="flex w-max space-x-2 p-4">
                <Tabs
                  value={selectedCategory}
                  onValueChange={(v) => setSelectedCategory(v as string)}
                >
                  <TabsList className="h-auto">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {categories
                      .filter((c) => c.isActive)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((category) => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                  </TabsList>
                </Tabs>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4 [&_[data-radix-scroll-area-viewport]]:scroll-smooth">
            {menuItemsLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No items found
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-4">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="flex w-96 flex-col border-l bg-card">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Current Order</h2>
            {cart.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            )}
          </div>
        </div>

        {/* Order Type Selection */}
        <div className="border-b p-4">
          <p className="mb-2 text-sm font-medium">Order Type</p>
          <ToggleGroup
            type="single"
            value={orderType}
            onValueChange={(value) => {
              if (value) setOrderType(value as OrderType);
            }}
            className="grid grid-cols-3 gap-2"
          >
            <ToggleGroupItem
              value="dine_in"
              variant="outline"
              className="flex-col h-auto py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <UtensilsCrossed className="mb-1 h-4 w-4" />
              Dine In
            </ToggleGroupItem>
            <ToggleGroupItem
              value="takeaway"
              variant="outline"
              className="flex-col h-auto py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Package className="mb-1 h-4 w-4" />
              Takeaway
            </ToggleGroupItem>
            <ToggleGroupItem
              value="delivery"
              variant="outline"
              className="flex-col h-auto py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Truck className="mb-1 h-4 w-4" />
              Delivery
            </ToggleGroupItem>
          </ToggleGroup>
          {orderType === "dine_in" && (
            <Input
              ref={tableNumberRef}
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="mt-3"
            />
          )}
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1">
          {cart.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="mb-2 h-12 w-12 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cart.map((item, index) => (
                <CartItemCard
                  key={`${item.menuItem.id}-${index}`}
                  item={item}
                  onIncrement={() => updateQuantity(index, 1)}
                  onDecrement={() => updateQuantity(index, -1)}
                  onRemove={() => removeFromCart(index)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Order Notes */}
        {cart.length > 0 && (
          <div className="border-t p-4">
            <Input
              placeholder="Order notes (optional)"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        )}

        {/* Totals & Checkout */}
        <div className="sticky bottom-0 z-10 border-t bg-card p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (0%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              className="w-full text-base font-bold shadow-sm"
              size="lg"
              onClick={clearCart}
              disabled={cart.length === 0}
              title="Clear cart (F1)"
            >
              <X className="mr-2 h-5 w-5" />
              CLEAR
              <kbd className="ml-2 hidden rounded bg-black/20 px-2 py-1 text-[11px] font-medium sm:inline">
                F1
              </kbd>
            </Button>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-sm"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || createOrderMutation.isPending}
              title="Checkout (F9)"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              PAY
              <kbd className="ml-2 hidden rounded bg-black/20 px-2 py-1 text-[11px] font-medium sm:inline">
                F9
              </kbd>
            </Button>
          </div>
        </div>
      </div>

      {/* Modifier Dialog */}
      <Dialog open={modifierDialogOpen} onOpenChange={setModifierDialogOpen}>
        <DialogContent container={dialogContainer}>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Select modifiers for this item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedItem?.modifiers?.map((modifier) => {
              const isSelected = selectedModifiers.some(
                (m) => m.id === modifier.id,
              );
              return (
                <div
                  key={modifier.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSelectedModifiers((prev) =>
                      isSelected
                        ? prev.filter((m) => m.id !== modifier.id)
                        : [...prev, modifier],
                    );
                  }}
                >
                  <span className="font-medium">{modifier.name}</span>
                  <span className="text-muted-foreground">
                    {parseFloat(modifier.priceAdjustment) > 0
                      ? `+${formatCurrency(parseFloat(modifier.priceAdjustment))}`
                      : "Free"}
                  </span>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModifierDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmModifiers}>Add to Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md" container={dialogContainer}>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select payment method and complete the order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="flex-col h-auto py-3"
                >
                  <Banknote className="mb-1 h-5 w-5" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex-col h-auto py-3"
                >
                  <CreditCard className="mb-1 h-5 w-5" />
                  Card
                </Button>
                <Button
                  variant={
                    paymentMethod === "digital_wallet" ? "default" : "outline"
                  }
                  onClick={() => setPaymentMethod("digital_wallet")}
                  className="flex-col h-auto py-3"
                >
                  <Smartphone className="mb-1 h-5 w-5" />
                  E-Wallet
                </Button>
              </div>
            </div>

            {paymentMethod === "cash" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Received Amount
                </label>
                <Input
                  autoFocus
                  type="number"
                  step="0.01"
                  min={total}
                  placeholder={`Min: ${formatCurrency(total)}`}
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                />
                {receivedAmount && changeAmount >= 0 && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Change: {formatCurrency(changeAmount)}
                  </p>
                )}
                {receivedAmount && changeAmount < 0 && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Insufficient amount
                  </p>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
              <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
                Esc
              </kbd>
            </Button>
            <Button
              data-confirm-payment
              onClick={handlePayment}
              disabled={
                createOrderMutation.isPending ||
                createPaymentMutation.isPending ||
                (paymentMethod === "cash" &&
                  (!receivedAmount || parseFloat(receivedAmount) < total))
              }
            >
              {createOrderMutation.isPending || createPaymentMutation.isPending
                ? "Processing..."
                : "Confirm Payment"}
              <kbd className="ml-2 hidden rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                Enter
              </kbd>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Menu Item Card Component
function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <Card
      className="cursor-pointer overflow-hidden p-0 gap-0 transition-all hover:shadow-md hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] flex flex-col"
      onClick={onAdd}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {item.image ? (
          <img
            src={getImageUrl(item.image) || item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold line-clamp-1 text-sm leading-tight mb-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground mb-2 flex-1">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-primary text-sm">
            {formatCurrency(parseFloat(item.price))}
          </span>
          {item.modifiers && item.modifiers.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              +Options
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

// Cart Item Card Component
function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
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
