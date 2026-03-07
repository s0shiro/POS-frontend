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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, UserCircle, Printer } from "lucide-react";
import type { CreateUserPayload, UserRole } from "../types";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateUserPayload;
  onFieldChange: (
    field: keyof CreateUserPayload,
    value: string | UserRole,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function CreateUserDialog({
  isOpen,
  onClose,
  formData,
  onFieldChange,
  onSubmit,
  isPending,
}: CreateUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New User</DialogTitle>
          <DialogDescription>
            Add a new staff member and assign their access role.
          </DialogDescription>
        </DialogHeader>
        <form id="create-user-form" onSubmit={onSubmit}>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                placeholder="jane@example.com"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => onFieldChange("password", e.target.value)}
                placeholder="minimum 8 characters"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Role Assignment
              </label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  onFieldChange("role", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Administrator
                    </div>
                  </SelectItem>
                  <SelectItem value="cashier">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-blue-600" />
                      Cashier
                    </div>
                  </SelectItem>
                  <SelectItem value="kitchen">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-orange-600" />
                      Kitchen Staff
                    </div>
                  </SelectItem>
                  <SelectItem value="printer">
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-green-600" />
                      Printer Agent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-2 text-right sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} form="create-user-form">
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
