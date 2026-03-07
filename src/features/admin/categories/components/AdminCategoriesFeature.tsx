import { useCategoryForm } from "../hooks/useCategoryForm";
import { CreateEditCategoryDialog } from "./CreateEditCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { CategoriesTable } from "./CategoriesTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FolderOpen, Plus } from "lucide-react";
import { useCategories } from "@/features/menu";

export function AdminCategoriesFeature() {
  const {
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
  } = useCategoryForm();

  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data ?? [];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Menu Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize your menu items into logical groups
            </p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="shrink-0 h-10">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage and reorder your item categories for better menu organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-2 rounded-md bg-muted animate-pulse h-16"
                />
              ))}
            </div>
          ) : (
            <CategoriesTable
              categories={categories}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
        </CardContent>
      </Card>

      <CreateEditCategoryDialog
        isOpen={isCreateDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={isEditDialogOpen ? handleUpdate : handleCreate}
        isEditMode={isEditDialogOpen}
        isSubmitting={false}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        isDeleting={false}
        categoryName={selectedCategory?.name}
      />
    </div>
  );
}
