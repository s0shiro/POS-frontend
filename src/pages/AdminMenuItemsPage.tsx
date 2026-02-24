import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoriesApi,
  menuItemsApi,
  getImageUrl,
  type MenuItem,
  type CreateMenuItemPayload,
  type UpdateMenuItemPayload,
  type CreateModifierPayload,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  ImageIcon,
  Settings2,
  X,
} from "lucide-react";

// Currency formatter for Philippine Peso
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

interface MenuItemFormData {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string;
  isAvailable: boolean;
}

interface ModifierFormData {
  name: string;
  priceAdjustment: string;
  isRequired: boolean;
}

const initialFormData: MenuItemFormData = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  imageFile: null,
  imagePreview: "",
  isAvailable: true,
};

const initialModifierFormData: ModifierFormData = {
  name: "",
  priceAdjustment: "0.00",
  isRequired: false,
};

export function AdminMenuItemsPage() {
  const queryClient = useQueryClient();

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

  // Form state
  const [formData, setFormData] = useState<MenuItemFormData>(initialFormData);
  const [modifierFormData, setModifierFormData] = useState<ModifierFormData>(
    initialModifierFormData,
  );

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: menuItemsData, isLoading } = useQuery({
    queryKey: ["menuItems", selectedCategoryFilter],
    queryFn: () =>
      menuItemsApi.getAll(
        selectedCategoryFilter !== "all"
          ? { categoryId: selectedCategoryFilter }
          : undefined,
      ),
  });

  const categories = categoriesData?.data ?? [];
  const menuItems = menuItemsData?.data ?? [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateMenuItemPayload) => menuItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Menu item created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create menu item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemPayload }) =>
      menuItemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Menu item updated successfully");
      setIsEditDialogOpen(false);
      setSelectedMenuItem(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update menu item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuItemsApi.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
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

  const createModifierMutation = useMutation({
    mutationFn: ({
      menuItemId,
      data,
    }: {
      menuItemId: string;
      data: CreateModifierPayload;
    }) => menuItemsApi.createModifier(menuItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Modifier added successfully");
      setModifierFormData(initialModifierFormData);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add modifier");
    },
  });

  const deleteModifierMutation = useMutation({
    mutationFn: ({
      menuItemId,
      modifierId,
    }: {
      menuItemId: string;
      modifierId: string;
    }) => menuItemsApi.deleteModifier(menuItemId, modifierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Modifier deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete modifier");
    },
  });

  // Handlers
  const resetForm = () => {
    setFormData(initialFormData);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setFormData({
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
    setModifierFormData(initialModifierFormData);
    setIsModifierDialogOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!formData.price || !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      toast.error("Valid price is required (e.g., 9.99)");
      return;
    }
    createMutation.mutate({
      ...formData,
      description: formData.description || undefined,
      imageFile: formData.imageFile || undefined,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) return;
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!formData.price || !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      toast.error("Valid price is required (e.g., 9.99)");
      return;
    }
    updateMutation.mutate({
      id: selectedMenuItem.id,
      data: {
        ...formData,
        description: formData.description || undefined,
        imageFile: formData.imageFile || undefined,
      },
    });
  };

  const handleDelete = () => {
    if (!selectedMenuItem) return;
    deleteMutation.mutate(selectedMenuItem.id);
  };

  const handleAddModifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) return;
    if (!modifierFormData.name.trim()) {
      toast.error("Modifier name is required");
      return;
    }
    createModifierMutation.mutate({
      menuItemId: selectedMenuItem.id,
      data: {
        name: modifierFormData.name,
        priceAdjustment: modifierFormData.priceAdjustment || "0.00",
        isRequired: modifierFormData.isRequired,
      },
    });
  };

  const handleDeleteModifier = (modifierId: string) => {
    if (!selectedMenuItem) return;
    deleteModifierMutation.mutate({
      menuItemId: selectedMenuItem.id,
      modifierId,
    });
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
            <Card
              key={item.id}
              className={`overflow-hidden transition-opacity ${!item.isAvailable ? "opacity-60" : ""}`}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-32 bg-gray-100">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image) || item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-1 flex items-start justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(parseFloat(item.price))}
                    </span>
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {getCategoryName(item.categoryId)}
                  </Badge>
                  {item.description && (
                    <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="mb-2 text-xs text-gray-400">
                      {item.modifiers.length} modifier(s)
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModifierDialog(item)}
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => openDeleteDialog(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Menu Item</DialogTitle>
            <DialogDescription>
              Add a new item to your restaurant menu
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Margherita Pizza"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          imageFile: null,
                          imagePreview: "",
                        })
                      }
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
                    if (file) {
                      setFormData({
                        ...formData,
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  Max 5MB. JPEG, PNG, WebP or GIF.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isAvailable">Available</Label>
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
                {createMutation.isPending ? "Creating..." : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the menu item details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Margherita Pizza"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          imageFile: null,
                          imagePreview: "",
                        })
                      }
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
                    if (file) {
                      setFormData({
                        ...formData,
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  Max 5MB. JPEG, PNG, WebP or GIF.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailableEdit"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isAvailableEdit">Available</Label>
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
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMenuItem?.name}"? This
              action cannot be undone. All modifiers associated with this item
              will also be deleted.
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
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modifiers Dialog */}
      <Dialog
        open={isModifierDialogOpen}
        onOpenChange={setIsModifierDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Modifiers</DialogTitle>
            <DialogDescription>
              Add or remove modifiers for "{currentMenuItem?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Existing Modifiers */}
            {currentMenuItem?.modifiers &&
              currentMenuItem.modifiers.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Modifiers</Label>
                  <div className="space-y-2">
                    {currentMenuItem.modifiers.map((modifier) => (
                      <div
                        key={modifier.id}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div>
                          <span className="font-medium">{modifier.name}</span>
                          {parseFloat(modifier.priceAdjustment) > 0 && (
                            <span className="ml-2 text-sm text-green-600">
                              +
                              {formatCurrency(
                                parseFloat(modifier.priceAdjustment),
                              )}
                            </span>
                          )}
                          {modifier.isRequired && (
                            <Badge variant="secondary" className="ml-2">
                              Required
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteModifier(modifier.id)}
                          disabled={deleteModifierMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Add New Modifier */}
            <form onSubmit={handleAddModifier} className="space-y-3">
              <Label>Add New Modifier</Label>
              <div className="space-y-2">
                <Input
                  value={modifierFormData.name}
                  onChange={(e) =>
                    setModifierFormData({
                      ...modifierFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Modifier name (e.g., Extra Cheese)"
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={modifierFormData.priceAdjustment}
                  onChange={(e) =>
                    setModifierFormData({
                      ...modifierFormData,
                      priceAdjustment: e.target.value,
                    })
                  }
                  placeholder="Price adjustment (e.g., 1.50)"
                />
                <p className="text-xs text-gray-500">
                  Leave as 0.00 for no additional charge
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={modifierFormData.isRequired}
                  onChange={(e) =>
                    setModifierFormData({
                      ...modifierFormData,
                      isRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isRequired">Required modifier</Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createModifierMutation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                {createModifierMutation.isPending
                  ? "Adding..."
                  : "Add Modifier"}
              </Button>
            </form>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModifierDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
