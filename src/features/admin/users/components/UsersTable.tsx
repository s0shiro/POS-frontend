import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Ban,
  CheckCircle2,
  Users,
  Plus,
} from "lucide-react";
import type { User } from "../types";
import { roleColors, roleLabels } from "../types";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (user: User) => void;
  onAddUser: () => void;
  isUnbanPending: boolean;
}

export function UsersTable({
  users,
  isLoading,
  onEdit,
  onBan,
  onUnban,
  onAddUser,
  isUnbanPending,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No users found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Get started by adding your first team member to the platform.
        </p>
        <Button onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add First User
        </Button>
      </div>
    );
  }

  return (
    <div className="p-0 overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-16 text-center">Avatar</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={`hover:bg-muted/30 transition-colors ${
                user.banned ? "opacity-60 bg-muted/20" : ""
              }`}
            >
              <TableCell className="p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary uppercase font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`font-medium ${roleColors[user.role]}`}
                >
                  {roleLabels[user.role]}
                </Badge>
              </TableCell>
              <TableCell>
                {user.banned ? (
                  <Badge variant="destructive" className="font-medium">
                    <Ban className="mr-1 h-3 w-3" />
                    Banned
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950/20"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.banned ? (
                      <DropdownMenuItem
                        onClick={() => onUnban(user)}
                        disabled={isUnbanPending}
                        className="text-emerald-600 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Unban User
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onBan(user)}
                          className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Ban User
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
