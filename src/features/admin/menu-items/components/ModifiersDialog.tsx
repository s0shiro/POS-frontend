import type { MenuItem } from "@/features/menu";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import type { ModifierFormData } from "../hooks/useModifierForm";

interface ModifiersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem | null;
  formData: ModifierFormData;
  onFieldChange: <K extends keyof ModifierFormData>(
    field: K,
    value: ModifierFormData[K],
  ) => void;
  onAddModifier: (e: React.FormEvent) => void;
  onDeleteModifier: (modifierId: string) => void;
  isAdding: boolean;
  isDeleting: boolean;
}

export function ModifiersDialog({
  open,
  onOpenChange,
  menuItem,
  formData,
  onFieldChange,
  onAddModifier,
  onDeleteModifier,
  isAdding,
  isDeleting,
}: ModifiersDialogProps) {
  if (!menuItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Modifiers</DialogTitle>
          <DialogDescription>
            Add or remove modifiers for "{menuItem.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Existing Modifiers */}
          {menuItem.modifiers && menuItem.modifiers.length > 0 && (
            <div className="space-y-2">
              <Label>Current Modifiers</Label>
              <div className="space-y-2">
                {menuItem.modifiers.map((modifier) => (
                  <div
                    key={modifier.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div>
                      <span className="font-medium">{modifier.name}</span>
                      {parseFloat(modifier.priceAdjustment) > 0 && (
                        <span className="ml-2 text-sm text-green-600">
                          +
                          {formatCurrency(parseFloat(modifier.priceAdjustment))}
                        </span>
                      )}
                      {modifier.isRequired && (
                        <Badge variant="secondary" className="ml-2">
                          Required
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onDeleteModifier(modifier.id)}
                      disabled={isDeleting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Modifier */}
          <form onSubmit={onAddModifier} className="space-y-3">
            <Label>Add New Modifier</Label>
            <div className="space-y-2">
              <Input
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Modifier name (e.g., Extra Cheese)"
              />
            </div>
            <div className="space-y-2">
              <Input
                value={formData.priceAdjustment}
                onChange={(e) =>
                  onFieldChange("priceAdjustment", e.target.value)
                }
                placeholder="Price adjustment (e.g., 1.50)"
              />
              <p className="text-xs text-gray-500">
                Leave as 0.00 for no additional charge
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="modifierRequired"
                checked={formData.isRequired}
                onChange={(e) => onFieldChange("isRequired", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="modifierRequired">Required modifier</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isAdding}>
              <Plus className="mr-2 h-4 w-4" />
              {isAdding ? "Adding..." : "Add Modifier"}
            </Button>
          </form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
