import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateOrder,
  useCreatePayment,
} from "@/features/orders/api/useOrders";
import type { CreateOrderPayload } from "@/features/orders/types";
import type { CartItem, OrderType, PaymentMethod } from "../types";

interface UsePaymentFlowProps {
  cart: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  orderNotes: string;
  total: number;
  clearCart: () => void;
  tableNumberRef: React.RefObject<HTMLInputElement | null>;
}

export function usePaymentFlow({
  cart,
  orderType,
  tableNumber,
  orderNotes,
  total,
  clearCart,
  tableNumberRef,
}: UsePaymentFlowProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [receivedAmount, setReceivedAmount] = useState("");

  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  const changeAmount =
    paymentMethod === "cash" && receivedAmount
      ? parseFloat(receivedAmount) - total
      : 0;

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

      await createPaymentMutation.mutateAsync({
        orderId,
        data: {
          method: paymentMethod,
          tax: 0,
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

  return {
    paymentDialogOpen,
    setPaymentDialogOpen,
    paymentMethod,
    setPaymentMethod,
    receivedAmount,
    setReceivedAmount,
    changeAmount,
    handleCheckout,
    handlePayment,
    isProcessing:
      createOrderMutation.isPending || createPaymentMutation.isPending,
  };
}
