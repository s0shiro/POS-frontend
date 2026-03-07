import type { Category } from "@/features/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { MenuItemFormData } from "../hooks/useMenuItemForm";

interface MenuItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  formData: MenuItemFormData;
  categories: Category[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: <K extends keyof MenuItemFormData>(
    field: K,
    value: MenuItemFormData[K],
  ) => void;
  onImageChange: (file: File | null) => void;
  onImageRemove: () => void;
}

export function MenuItemFormDialog({
  open,
  onOpenChange,
  mode,
  formData,
  categories,
  isLoading,
  onSubmit,
  onFieldChange,
  onImageChange,
  onImageRemove,
}: MenuItemFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Menu Item" : "Edit Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new item to your restaurant menu"
              : "Update the menu item details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => onFieldChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="e.g., Margherita Pizza"
                autoFocus={mode === "create"}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.price}
                onChange={(e) => onFieldChange("price", e.target.value)}
                placeholder="9.99"
              />
              <p className="text-xs text-gray-500">
                Enter price without currency symbol (e.g., 9.99)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              {formData.imagePreview && (
                <div className="relative h-32 w-full overflow-hidden rounded-md border">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute right-1 top-1 h-6 w-6 p-0"
                    onClick={onImageRemove}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onImageChange(file || null);
                }}
              />
              <p className="text-xs text-gray-500">
                Max 5MB. JPEG, PNG, WebP or GIF.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`isAvailable-${mode}`}
                checked={formData.isAvailable}
                onChange={(e) => onFieldChange("isAvailable", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor={`isAvailable-${mode}`}>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Item"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
