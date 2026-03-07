import { useState, useMemo } from "react";
import type { MenuItem, Modifier } from "@/features/menu/types";
import type { CartItem, OrderType } from "../types";

export function useCashierCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);

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

  const tax = subtotal * 0;
  const total = subtotal + tax;

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

  const handleAddToCart = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      setSelectedItem(item);
      setSelectedModifiers([]);
      setModifierDialogOpen(true);
    } else {
      addItemToCart(item, []);
    }
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
      if (newQuantity <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item,
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setTableNumber("");
    setOrderNotes("");
    setOrderType("dine_in");
  };

  return {
    cart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    orderNotes,
    setOrderNotes,
    selectedItem,
    selectedModifiers,
    setSelectedModifiers,
    modifierDialogOpen,
    setModifierDialogOpen,
    subtotal,
    tax,
    total,
    handleAddToCart,
    handleConfirmModifiers,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
