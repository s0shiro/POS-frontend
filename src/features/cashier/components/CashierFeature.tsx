import { useState, useRef, useEffect } from "react";
import { Toaster } from "sonner";
import { useFullscreen } from "../hooks/useFullscreen";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useCashierCart } from "../hooks/useCashierCart";
import { usePaymentFlow } from "../hooks/usePaymentFlow";
import { MenuPanel } from "./MenuPanel";
import { CartPanel } from "./CartPanel";
import { ModifierDialog } from "./ModifierDialog";
import { PaymentDialog } from "./PaymentDialog";

export function CashierFeature() {
  const { isFullscreen, isLocked, containerRef, toggleFullscreen, toggleLock } =
    useFullscreen();
  const tableNumberRef = useRef<HTMLInputElement>(null);
  const [dialogContainer, setDialogContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    setDialogContainer(containerRef.current);
  }, [containerRef]);

  const cart = useCashierCart();
  const payment = usePaymentFlow({
    cart: cart.cart,
    orderType: cart.orderType,
    tableNumber: cart.tableNumber,
    orderNotes: cart.orderNotes,
    total: cart.total,
    clearCart: cart.clearCart,
    tableNumberRef,
  });

  useKeyboardShortcuts({
    cart: cart.cart,
    orderType: cart.orderType,
    tableNumber: cart.tableNumber,
    paymentDialogOpen: payment.paymentDialogOpen,
    modifierDialogOpen: cart.modifierDialogOpen,
    paymentMethod: payment.paymentMethod,
    receivedAmount: payment.receivedAmount,
    total: cart.total,
    clearCart: cart.clearCart,
    toggleFullscreen,
    setPaymentDialogOpen: payment.setPaymentDialogOpen,
    setModifierDialogOpen: cart.setModifierDialogOpen,
    tableNumberRef,
  });

  return (
    <div
      ref={containerRef}
      className={`flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-7rem)] -m-4 md:-m-6"} ${isFullscreen ? "bg-background" : ""}`}
    >
      {isFullscreen && <Toaster position="top-right" richColors />}

      <MenuPanel
        isFullscreen={isFullscreen}
        isLocked={isLocked}
        onToggleFullscreen={toggleFullscreen}
        onToggleLock={toggleLock}
        onAddItem={cart.handleAddToCart}
      />

      <CartPanel
        cart={cart.cart}
        orderType={cart.orderType}
        tableNumber={cart.tableNumber}
        orderNotes={cart.orderNotes}
        subtotal={cart.subtotal}
        tax={cart.tax}
        total={cart.total}
        isProcessing={payment.isProcessing}
        tableNumberRef={tableNumberRef}
        onOrderTypeChange={cart.setOrderType}
        onTableNumberChange={cart.setTableNumber}
        onOrderNotesChange={cart.setOrderNotes}
        onIncrement={(index) => cart.updateQuantity(index, 1)}
        onDecrement={(index) => cart.updateQuantity(index, -1)}
        onRemove={cart.removeFromCart}
        onClear={cart.clearCart}
        onCheckout={payment.handleCheckout}
      />

      <ModifierDialog
        open={cart.modifierDialogOpen}
        onOpenChange={cart.setModifierDialogOpen}
        selectedItem={cart.selectedItem}
        selectedModifiers={cart.selectedModifiers}
        onToggleModifier={(mod) =>
          cart.setSelectedModifiers((prev) =>
            prev.some((m) => m.id === mod.id)
              ? prev.filter((m) => m.id !== mod.id)
              : [...prev, mod],
          )
        }
        onConfirm={cart.handleConfirmModifiers}
        container={dialogContainer}
      />

      <PaymentDialog
        open={payment.paymentDialogOpen}
        onOpenChange={payment.setPaymentDialogOpen}
        paymentMethod={payment.paymentMethod}
        onPaymentMethodChange={payment.setPaymentMethod}
        receivedAmount={payment.receivedAmount}
        onReceivedAmountChange={payment.setReceivedAmount}
        changeAmount={payment.changeAmount}
        subtotal={cart.subtotal}
        tax={cart.tax}
        total={cart.total}
        isProcessing={payment.isProcessing}
        onConfirm={payment.handlePayment}
        container={dialogContainer}
      />
    </div>
  );
}
