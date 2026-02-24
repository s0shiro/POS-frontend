import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  UserCircle,
  Shield,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type UserRole = "admin" | "cashier" | "kitchen" | "printer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  banned: boolean | null;
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  cashier: "bg-blue-100 text-blue-800",
  kitchen: "bg-orange-100 text-orange-800",
  printer: "bg-green-100 text-green-800",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  cashier: "Cashier",
  kitchen: "Kitchen",
  printer: "Printer",
};

const ITEMS_PER_PAGE = 10;

export function AdminUsersPage() {
  const queryClient = useQueryClient();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("cashier");

  // Form state
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  // Query - list users using better-auth admin plugin with server-side pagination
  const {
    data: usersData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin-users", currentPage],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          limit: ITEMS_PER_PAGE,
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
        },
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch users");
      }
      return result.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const users = (usersData?.users as User[]) ?? [];
  const totalUsers = usersData?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const result = await authClient.admin.createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        // @ts-expect-error - Custom roles not typed in better-auth client
        role: data.role,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to create user");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: UserRole;
    }) => {
      const result = await authClient.admin.setRole({
        userId,
        // @ts-expect-error - Custom roles not typed in better-auth client
        role,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to update user role");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, name }: { userId: string; name: string }) => {
      const result = await authClient.admin.updateUser({
        userId,
        data: { name },
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to update user");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  // Ban user mutation (soft delete)
  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await authClient.admin.banUser({
        userId,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to ban user");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User banned successfully");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await authClient.admin.unbanUser({
        userId,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to unban user");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User unbanned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });

  // Handlers
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "cashier",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdateRole = (role: UserRole) => {
    setEditRole(role);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }

    // Update name if changed
    if (editName !== selectedUser.name) {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        name: editName,
      });
    }

    // Update role if changed
    if (editRole !== selectedUser.role) {
      await updateRoleMutation.mutateAsync({
        userId: selectedUser.id,
        role: editRole,
      });
    }

    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleBanUser = () => {
    if (!selectedUser) return;
    banUserMutation.mutate(selectedUser.id);
  };

  const handleUnbanUser = (user: User) => {
    unbanUserMutation.mutate(user.id);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-xl font-bold">Users Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Users ({totalUsers})</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No users yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first user
            </p>
            <Button className="mt-4" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={user.banned ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <UserCircle className="h-6 w-6" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.banned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanUser(user)}
                            disabled={unbanUserMutation.isPending}
                          >
                            Unban
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of{" "}
                  {totalUsers} users
                  {isFetching && " (loading...)"}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="cashier">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        Cashier
                      </div>
                    </SelectItem>
                    <SelectItem value="kitchen">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        Kitchen
                      </div>
                    </SelectItem>
                    <SelectItem value="printer">
                      <div className="flex items-center gap-2">
                        <Printer className="h-4 w-4" />
                        Printer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="User name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(["admin", "cashier", "kitchen", "printer"] as UserRole[]).map(
                  (role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={editRole === role ? "default" : "outline"}
                      onClick={() => handleUpdateRole(role)}
                      className="w-full"
                    >
                      {roleLabels[role]}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={
                updateUserMutation.isPending || updateRoleMutation.isPending
              }
            >
              {updateUserMutation.isPending || updateRoleMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban "{selectedUser?.name}"? They will no
              longer be able to log in. You can unban them later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={banUserMutation.isPending}
            >
              {banUserMutation.isPending ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
