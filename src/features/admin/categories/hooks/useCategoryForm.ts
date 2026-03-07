import { useState } from "react";
import type { Category, CreateCategoryPayload } from "@/features/menu";
import { toast } from "sonner";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/menu";

export function useCategoryForm() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Category created successfully");
        setIsCreateDialogOpen(false);
        resetForm();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create category");
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    updateMutation.mutate(
      { id: selectedCategory.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
          setIsEditDialogOpen(false);
          setSelectedCategory(null);
          resetForm();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to update category");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    deleteMutation.mutate(selectedCategory.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete category");
      },
    });
  };

  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCategory,
    formData,
    setFormData,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
