import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Shield, UserCircle, Printer } from "lucide-react";
import type { User, UserRole } from "../types";
import { roleLabels } from "../types";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  editName: string;
  editRole: UserRole;
  onNameChange: (name: string) => void;
  onRoleChange: (role: UserRole) => void;
  onSave: () => void;
  isPending: boolean;
}

export function EditUserDialog({
  isOpen,
  onClose,
  user,
  editName,
  editRole,
  onNameChange,
  onRoleChange,
  onSave,
  isPending,
}: EditUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit User Profile</DialogTitle>
          <DialogDescription>
            Update details for {user?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Full Name
            </label>
            <Input
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="User name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none block mb-2">
              Role Assignment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["admin", "cashier", "kitchen", "printer"] as UserRole[]).map(
                (role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={editRole === role ? "default" : "outline"}
                    onClick={() => onRoleChange(role)}
                    className={`w-full justify-start gap-2 ${editRole === role ? "ring-2 ring-primary ring-offset-1" : ""}`}
                  >
                    {role === "admin" && <Shield className="h-4 w-4" />}
                    {role === "cashier" || role === "kitchen" ? (
                      <UserCircle className="h-4 w-4" />
                    ) : null}
                    {role === "printer" && <Printer className="h-4 w-4" />}
                    {roleLabels[role]}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-2 gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving details..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
