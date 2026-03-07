import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreateCategoryPayload } from "@/features/menu";

interface CreateEditCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateCategoryPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateCategoryPayload>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditMode: boolean;
  isSubmitting: boolean;
}

export function CreateEditCategoryDialog({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEditMode,
  isSubmitting,
}: CreateEditCategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this category."
              : "Add a new category to organize your menu items."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} id="category-form">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Beverages, Main Course"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional: A brief summary of this category"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-3 h-10 rounded-md border px-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="isActive"
                    className="cursor-pointer font-normal text-sm pt-0.5"
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2 gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="category-form" disabled={isSubmitting}>
              {isEditMode
                ? isSubmitting
                  ? "Saving..."
                  : "Save Changes"
                : isSubmitting
                  ? "Creating..."
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
