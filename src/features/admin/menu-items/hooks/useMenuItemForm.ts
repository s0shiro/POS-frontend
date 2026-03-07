import { useState } from "react";

export interface MenuItemFormData {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string;
  isAvailable: boolean;
}

export const initialMenuItemFormData: MenuItemFormData = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  imageFile: null,
  imagePreview: "",
  isAvailable: true,
};

export function useMenuItemForm(
  initialData: MenuItemFormData = initialMenuItemFormData,
) {
  const [formData, setFormData] = useState<MenuItemFormData>(initialData);

  const resetForm = () => {
    setFormData(initialMenuItemFormData);
  };

  const updateField = <K extends keyof MenuItemFormData>(
    field: K,
    value: MenuItemFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
        imagePreview: "",
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.categoryId) {
      return "Category is required";
    }
    if (!formData.price || !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      return "Valid price is required (e.g., 9.99)";
    }
    return null;
  };

  return {
    formData,
    setFormData,
    resetForm,
    updateField,
    handleImageChange,
    validateForm,
  };
}
