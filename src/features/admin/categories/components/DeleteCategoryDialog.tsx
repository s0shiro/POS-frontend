import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  categoryName?: string;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  categoryName,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete the category
            <span className="font-semibold text-foreground">
              {` "${categoryName}"`}
            </span>
            ? This action cannot be undone. Menu items in this category may
            become uncategorized.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
