import { formatCurrency } from "@/lib/currency";
import type { PaymentMethod } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, CreditCard, Smartphone } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  receivedAmount: string;
  onReceivedAmountChange: (value: string) => void;
  changeAmount: number;
  subtotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onConfirm: () => void;
  container: HTMLDivElement | null;
}

export function PaymentDialog({
  open,
  onOpenChange,
  paymentMethod,
  onPaymentMethodChange,
  receivedAmount,
  onReceivedAmountChange,
  changeAmount,
  subtotal,
  tax,
  total,
  isProcessing,
  onConfirm,
  container,
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" container={container}>
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
                onClick={() => onPaymentMethodChange("cash")}
                className="flex-col h-auto py-3"
              >
                <Banknote className="mb-1 h-5 w-5" />
                Cash
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => onPaymentMethodChange("card")}
                className="flex-col h-auto py-3"
              >
                <CreditCard className="mb-1 h-5 w-5" />
                Card
              </Button>
              <Button
                variant={
                  paymentMethod === "digital_wallet" ? "default" : "outline"
                }
                onClick={() => onPaymentMethodChange("digital_wallet")}
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
                onChange={(e) => onReceivedAmountChange(e.target.value)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
            <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
              Esc
            </kbd>
          </Button>
          <Button
            data-confirm-payment
            onClick={onConfirm}
            disabled={
              isProcessing ||
              (paymentMethod === "cash" &&
                (!receivedAmount || parseFloat(receivedAmount) < total))
            }
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
            <kbd className="ml-2 hidden rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
              Enter
            </kbd>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
