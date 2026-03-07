import type { MenuItem, Modifier } from "@/features/menu/types";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: MenuItem | null;
  selectedModifiers: Modifier[];
  onToggleModifier: (modifier: Modifier) => void;
  onConfirm: () => void;
  container: HTMLDivElement | null;
}

export function ModifierDialog({
  open,
  onOpenChange,
  selectedItem,
  selectedModifiers,
  onToggleModifier,
  onConfirm,
  container,
}: ModifierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent container={container}>
        <DialogHeader>
          <DialogTitle>{selectedItem?.name}</DialogTitle>
          <DialogDescription>Select modifiers for this item</DialogDescription>
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
                  isSelected ? "border-primary bg-primary/5" : "hover:bg-muted"
                }`}
                onClick={() => onToggleModifier(modifier)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Add to Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
