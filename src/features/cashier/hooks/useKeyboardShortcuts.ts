import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { PaymentMethod } from "../types";

interface UseKeyboardShortcutsProps {
  cart: unknown[];
  orderType: string;
  tableNumber: string;
  paymentDialogOpen: boolean;
  modifierDialogOpen: boolean;
  paymentMethod: PaymentMethod;
  receivedAmount: string;
  total: number;
  clearCart: () => void;
  toggleFullscreen: () => void;
  setPaymentDialogOpen: (open: boolean) => void;
  setModifierDialogOpen: (open: boolean) => void;
  tableNumberRef: React.RefObject<HTMLInputElement | null>;
}

export function useKeyboardShortcuts({
  cart,
  orderType,
  tableNumber,
  paymentDialogOpen,
  modifierDialogOpen,
  paymentMethod,
  receivedAmount,
  total,
  clearCart,
  toggleFullscreen,
  setPaymentDialogOpen,
  setModifierDialogOpen,
  tableNumberRef,
}: UseKeyboardShortcutsProps) {
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
      setPaymentDialogOpen,
      setModifierDialogOpen,
      tableNumberRef,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);
}
