import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { UsersTable } from "./UsersTable";
import { CreateUserDialog } from "./CreateUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { BanUserDialog } from "./BanUserDialog";
import { useUserForm } from "../hooks/useUserForm";
import type { User, UserRole, CreateUserPayload } from "../types";
import { ITEMS_PER_PAGE } from "../types";

export function AdminUsersFeature() {
  const queryClient = useQueryClient();
  const { formData, resetForm, updateField, validateForm } = useUserForm();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("cashier");

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
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    createMutation.mutate(formData);
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
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Add users, change roles, and manage access
            </p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="shrink-0 h-10">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <CardTitle className="text-xl">All Users</CardTitle>
            <CardDescription className="mt-1">
              Total of {totalUsers} registered accounts
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <UsersTable
            users={users}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onBan={openDeleteDialog}
            onUnban={handleUnbanUser}
            onAddUser={openCreateDialog}
            isUnbanPending={unbanUserMutation.isPending}
          />
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of{" "}
              {totalUsers} users
              {isFetching && (
                <span className="animate-pulse flex h-2 w-2 rounded-full bg-primary ml-2"></span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${currentPage === page ? "pointer-events-none" : ""}`}
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
                className="h-8 px-3"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={formData}
        onFieldChange={updateField}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={selectedUser}
        editName={editName}
        editRole={editRole}
        onNameChange={setEditName}
        onRoleChange={setEditRole}
        onSave={handleSaveUser}
        isPending={updateUserMutation.isPending || updateRoleMutation.isPending}
      />

      <BanUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        user={selectedUser}
        onConfirm={handleBanUser}
        isPending={banUserMutation.isPending}
      />
    </div>
  );
}
