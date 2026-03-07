import { fetchWithAuth, fetchWithFormData } from "@/lib/api-client";
import type {
  Category,
  MenuItem,
  Modifier,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  CreateModifierPayload,
} from "../types";

// Categories API
export const fetchCategories = async (): Promise<{
  success: boolean;
  data: Category[];
}> => {
  return fetchWithAuth("/api/menu/categories");
};

export const fetchCategoryById = async (
  id: string,
): Promise<{ success: boolean; data: Category }> => {
  return fetchWithAuth(`/api/menu/categories/${id}`);
};

export const createCategory = async (
  data: CreateCategoryPayload,
): Promise<{ success: boolean; data: Category }> => {
  return fetchWithAuth("/api/menu/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryPayload,
): Promise<{ success: boolean; data: Category }> => {
  return fetchWithAuth(`/api/menu/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (
  id: string,
): Promise<{ success: boolean }> => {
  return fetchWithAuth(`/api/menu/categories/${id}`, {
    method: "DELETE",
  });
};

// Menu Items API
export const fetchMenuItems = async (params?: {
  categoryId?: string;
  isAvailable?: boolean;
}): Promise<{ success: boolean; data: MenuItem[] }> => {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.isAvailable !== undefined)
    searchParams.set("isAvailable", String(params.isAvailable));

  const query = searchParams.toString();
  return fetchWithAuth(`/api/menu/items${query ? `?${query}` : ""}`);
};

export const fetchMenuItemById = async (
  id: string,
): Promise<{ success: boolean; data: MenuItem }> => {
  return fetchWithAuth(`/api/menu/items/${id}`);
};

export const createMenuItem = async (
  data: CreateMenuItemPayload,
): Promise<{ success: boolean; data: MenuItem }> => {
  const formData = new FormData();
  formData.append("categoryId", data.categoryId);
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("price", data.price);
  if (data.imageFile) formData.append("image", data.imageFile);
  if (data.isAvailable !== undefined)
    formData.append("isAvailable", String(data.isAvailable));
  return fetchWithFormData("/api/menu/items", {
    method: "POST",
    body: formData,
  });
};

export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemPayload,
): Promise<{ success: boolean; data: MenuItem }> => {
  const formData = new FormData();
  if (data.categoryId) formData.append("categoryId", data.categoryId);
  if (data.name) formData.append("name", data.name);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.price) formData.append("price", data.price);
  if (data.imageFile) formData.append("image", data.imageFile);
  if (data.isAvailable !== undefined)
    formData.append("isAvailable", String(data.isAvailable));
  return fetchWithFormData(`/api/menu/items/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteMenuItem = async (
  id: string,
): Promise<{ success: boolean; message?: string; archived?: boolean }> => {
  return fetchWithAuth(`/api/menu/items/${id}`, {
    method: "DELETE",
  });
};

// Modifier operations
export const createModifier = async (
  menuItemId: string,
  data: CreateModifierPayload,
): Promise<{ success: boolean; data: Modifier }> => {
  return fetchWithAuth(`/api/menu/items/${menuItemId}/modifiers`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteModifier = async (
  menuItemId: string,
  modifierId: string,
): Promise<{ success: boolean }> => {
  return fetchWithAuth(
    `/api/menu/items/${menuItemId}/modifiers/${modifierId}`,
    {
      method: "DELETE",
    },
  );
};
