import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban } from "lucide-react";
import type { User } from "../types";

interface BanUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function BanUserDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
  isPending,
}: BanUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-destructive flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Suspend User Account
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to suspend{" "}
            <span className="font-semibold text-foreground">
              "{user?.name}"
            </span>
            ? They will immediately lose access to the system. You can restore
            access later if needed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Suspending..." : "Suspend Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
