import { useState } from "react";
import {
  useCategories,
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useCreateModifier,
  useDeleteModifier,
} from "@/features/menu/api/useMenu";
import type { MenuItem } from "@/features/menu";
import { getImageUrl } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, UtensilsCrossed } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemFormDialog } from "./MenuItemFormDialog";
import { DeleteMenuItemDialog } from "./DeleteMenuItemDialog";
import { ModifiersDialog } from "./ModifiersDialog";
import { useMenuItemForm } from "../hooks/useMenuItemForm";
import { useModifierForm } from "../hooks/useModifierForm";

export function AdminMenuItemsFeature() {
  // State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModifierDialogOpen, setIsModifierDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("all");

  // Form hooks
  const menuItemForm = useMenuItemForm();
  const modifierForm = useModifierForm();

  // Queries
  const { data: categoriesData } = useCategories();
  const { data: menuItemsData, isLoading } = useMenuItems(
    selectedCategoryFilter !== "all"
      ? { categoryId: selectedCategoryFilter }
      : undefined,
  );

  const categories = categoriesData?.data ?? [];
  const menuItems = menuItemsData?.data ?? [];

  // Mutations
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const createModifierMutation = useCreateModifier();
  const deleteModifierMutation = useDeleteModifier();

  // Dialog handlers
  const openCreateDialog = () => {
    menuItemForm.resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    menuItemForm.setFormData({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description || "",
      price: item.price,
      imageFile: null,
      imagePreview: item.image ? getImageUrl(item.image) || "" : "",
      isAvailable: item.isAvailable,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsDeleteDialogOpen(true);
  };

  const openModifierDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    modifierForm.resetForm();
    setIsModifierDialogOpen(true);
  };

  // Form submission handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const error = menuItemForm.validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    createMutation.mutate(
      {
        ...menuItemForm.formData,
        description: menuItemForm.formData.description || undefined,
        imageFile: menuItemForm.formData.imageFile || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Menu item created successfully");
          setIsCreateDialogOpen(false);
          menuItemForm.resetForm();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create menu item");
        },
      },
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) return;
    const error = menuItemForm.validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    updateMutation.mutate(
      {
        id: selectedMenuItem.id,
        data: {
          ...menuItemForm.formData,
          description: menuItemForm.formData.description || undefined,
          imageFile: menuItemForm.formData.imageFile || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Menu item updated successfully");
          setIsEditDialogOpen(false);
          setSelectedMenuItem(null);
          menuItemForm.resetForm();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update menu item");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!selectedMenuItem) return;
    deleteMutation.mutate(selectedMenuItem.id, {
      onSuccess: (response) => {
        if (response.archived) {
          toast.info(response.message || "Menu item archived (used in orders)");
        } else {
          toast.success(response.message || "Menu item deleted successfully");
        }
        setIsDeleteDialogOpen(false);
        setSelectedMenuItem(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete menu item");
      },
    });
  };

  const handleAddModifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) return;
    const error = modifierForm.validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    createModifierMutation.mutate(
      {
        menuItemId: selectedMenuItem.id,
        data: {
          name: modifierForm.formData.name,
          priceAdjustment: modifierForm.formData.priceAdjustment || "0.00",
          isRequired: modifierForm.formData.isRequired,
        },
      },
      {
        onSuccess: () => {
          toast.success("Modifier added successfully");
          modifierForm.resetForm();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to add modifier");
        },
      },
    );
  };

  const handleDeleteModifier = (modifierId: string) => {
    if (!selectedMenuItem) return;
    deleteModifierMutation.mutate(
      {
        menuItemId: selectedMenuItem.id,
        modifierId,
      },
      {
        onSuccess: () => {
          toast.success("Modifier deleted successfully");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete modifier");
        },
      },
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  // Get fresh item data for modifier dialog
  const currentMenuItem = selectedMenuItem
    ? menuItems.find((item) => item.id === selectedMenuItem.id) ||
      selectedMenuItem
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <UtensilsCrossed className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-xl font-bold">Menu Items Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage menu items for your restaurant
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            All Menu Items ({menuItems.length})
          </h2>
          <Select
            value={selectedCategoryFilter}
            onValueChange={setSelectedCategoryFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Menu Items List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="mb-3 h-32 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No menu items yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first menu item
            </p>
            <Button className="mt-4" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              categoryName={getCategoryName(item.categoryId)}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onManageModifiers={openModifierDialog}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <MenuItemFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
        formData={menuItemForm.formData}
        categories={categories}
        isLoading={createMutation.isPending}
        onSubmit={handleCreate}
        onFieldChange={menuItemForm.updateField}
        onImageChange={menuItemForm.handleImageChange}
        onImageRemove={() => menuItemForm.handleImageChange(null)}
      />

      <MenuItemFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        formData={menuItemForm.formData}
        categories={categories}
        isLoading={updateMutation.isPending}
        onSubmit={handleUpdate}
        onFieldChange={menuItemForm.updateField}
        onImageChange={menuItemForm.handleImageChange}
        onImageRemove={() => menuItemForm.handleImageChange(null)}
      />

      <DeleteMenuItemDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={selectedMenuItem?.name || ""}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      <ModifiersDialog
        open={isModifierDialogOpen}
        onOpenChange={setIsModifierDialogOpen}
        menuItem={currentMenuItem}
        formData={modifierForm.formData}
        onFieldChange={modifierForm.updateField}
        onAddModifier={handleAddModifier}
        onDeleteModifier={handleDeleteModifier}
        isAdding={createModifierMutation.isPending}
        isDeleting={deleteModifierMutation.isPending}
      />
    </div>
  );
}
